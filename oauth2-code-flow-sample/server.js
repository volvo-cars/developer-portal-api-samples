/**
 * Copyright 2022 Volvo Car Corporation
 * SPDX-License-Identifier: Apache-2.0
 */

import path from "path";
import dotenv from "dotenv";
import express from "express";
import rateLimit from 'express-rate-limit';
import * as client from "openid-client";
import cookieParser from "cookie-parser";

dotenv.config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const scopes = process.env.SCOPES;
const port = process.env.PORT || 3000;

const redirectPath = new URL(redirectUri).pathname;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const main = async () => {
  const app = express();
  const __dirname = path.resolve();

  app.use(express.json());
  app.use(express.static(__dirname + "/public"));
  app.use(cookieParser());

  const myServer = new URL("https://volvoid.eu.qa.volvocars.com");
  let config = await client.discovery(myServer, clientId, clientSecret);

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
  app.get("/auth/login", authLimiter, async (req, res) => {
    let code_verifier = client.randomPKCECodeVerifier();
    let code_challenge = await client.calculatePKCECodeChallenge(code_verifier);
    res.cookie("code_verifier", code_verifier, { httpOnly: true });
    let parameters = {
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
  app.get(redirectPath, authLimiter, async (req, res) => {
    try {
      const protocol = req.protocol;
      const host = req.get("host");
      const originalUrl = req.originalUrl;
      const currentURL = `${protocol}://${host}${originalUrl}`;

      let tokenSet = await client.authorizationCodeGrant(
        config,
        new URL(currentURL),
        {
          pkceCodeVerifier: req.cookies.code_verifier,
          idTokenExpected: true,
        }
      );

      res.cookie("refresh_token", tokenSet.refresh_token);
      res.cookie("access_token", tokenSet.access_token);

      res.redirect("/");
    } catch (e) {
      console.error(`Request failed with error "${e}" and message "${e}"`);
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
