/**
 * Copyright 2022 Volvo Car Corporation
 * SPDX-License-Identifier: Apache-2.0
 */

import path from "path";
import dotenv from "dotenv";
import express from "express";
import * as client from "openid-client";
import cookieParser from "cookie-parser";
import session from "express-session";

dotenv.config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const scopes = process.env.SCOPES;
const port = process.env.PORT || 3000;
const redirectPath = new URL(redirectUri).pathname;

const main = async () => {
  const app = express();
  const __dirname = path.resolve();

  app.use(express.json());
  app.use(express.static(__dirname + "/public"));
  app.use(cookieParser());

  let config = await client.discovery(
    new URL("https://volvoid.eu.volvocars.com"),
    clientId
  );

  /**
   * MemoryStore is used debugging and developing, for production refer to https://github.com/expressjs/session#compatible-session-stores
   * **/
  let sessionConfig = {
    secret: "your-secret-key",
    cookie: {
      httpOnly: true,
      maxAge: 600000,
      //secure: true
    },
  };

  app.use(session(sessionConfig));

  // Renders the main view
  app.get("/", (req, res) => {
    const { refresh_token, access_token } = req.cookies;

    if (access_token && refresh_token) {
      res.sendFile(path.join(__dirname, "main.html"));
    } else {
      res.redirect("/login");
    }
  });

  // Renders the login view
  app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
  });
  /**
   * This endpoint returns a URL that can be used by the client to redirect the user to the Volvo ID login page.
   */
  app.get("/auth/login", async (req, res) => {
    let code_verifier = client.randomPKCECodeVerifier();
    let code_challenge = await client.calculatePKCECodeChallenge(code_verifier);

    req.session.code_verifier = code_verifier;
    
    const parameters = {
      redirect_uri: redirectUri,
      scope: scopes,
      code_challenge,
      code_challenge_method: "S256",
    };

    let loginUrl = client.buildAuthorizationUrl(config, parameters);

    res.status(200).json({ loginUrl: loginUrl.href });
  });

  /**
   * This endpoint is the destination for Volvo ID after a successful login, also known as your redirect URI.
   * It will provide the login code as a query parameter and exchange it for access and refresh tokens.
   **/
  app.get(redirectPath, async (req, res) => {
    try {
      const protocol = req.protocol;
      const host = req.get("host");
      const originalUrl = req.originalUrl;
      const currentURL = `${protocol}://${host}${originalUrl}`;

      let tokenSet = await client.authorizationCodeGrant(
        config,
        new URL(currentURL),
        {
          pkceCodeVerifier: req.session.code_verifier,
          idTokenExpected: true,
          client_secret: clientSecret,
        }
      );

      res.cookie("refresh_token", tokenSet.refresh_token);
      res.cookie("access_token", tokenSet.access_token);

      res.redirect("/");
    } catch (e) {
      console.error(`Request failed with error "${e}"`);
    }
  });

  /**
   * Use the provided refresh token from the token exchange to call the refresh endpoint and obtain a new access token.
   */
  app.post("/auth/refresh", async (req, res) => {
    const tokenSet = await client.refreshTokenGrant(
      config,
      req.body.refreshToken
    );

    res.status(200).json({
      refreshToken: tokenSet.refresh_token,
      accessToken: tokenSet.access_token,
    });
  });

  // Start the application
  app.listen(port, () => {
    console.log(`Server is successfully running at http://localhost:${port}. `);
  });
};

// Bootstrap the main method to run it with async syntax.
(async () => {
  await main();
})().catch((e) => {
  console.log(e);
});
