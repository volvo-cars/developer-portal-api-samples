/*
  Copyright 2022 Volvo Car Corporation
  SPDX-License-Identifier: Apache-2.0
*/

import path from "path";
import dotenv from "dotenv";
import express from "express";
import { Issuer } from "openid-client";
import cookieParser from "cookie-parser";

dotenv.config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const scopes = process.env.SCOPES;
const port = process.env.PORT || 3000;

const redirectPath = new URL(redirectUri).pathname;

/**
 * Creates and returns a new OpenID Connect client with the provided client credentials.
 */
const createClient = async () => {
  const issuer = await Issuer.discover("https://volvoid.eu.qa.volvocars.com");

  const client = new issuer.Client({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [redirectUri],
    response_types: ["code"],
  });

  return client;
};

const main = async () => {
  const app = express();
  const __dirname = path.resolve();

  app.use(express.json());
  app.use(express.static(__dirname + "/public"));
  app.use(cookieParser());

  const client = await createClient();

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
   * This endpoint is the destination for Volvo ID after a successful login, also known as your redirect URI.
   * It will provide the login code as a query parameter and exchange it for access and refresh tokens.
   **/
  app.get(redirectPath, async (req, res) => {
    try {
      const tokenSet = await client.callback(redirectUri, {
        code: req.query.code,
        grant_type: "authorization_code",
      });

      res.cookie("refresh_token", tokenSet.refresh_token);
      res.cookie("access_token", tokenSet.access_token);

      res.redirect("/");
    } catch (e) {
      console.error(
        `Request failed with error "${e.error}" and message "${e.error_description}"`
      );
    }
  });

  /**
   * This endpoint returns a URL that can be used by the client to redirect the user to the Volvo ID login page.
   */
  app.get("/auth/login", (req, res) => {
    const loginUrl = client.authorizationUrl({
      scope: scopes,
    });

    res.status(200).json({ loginUrl });
  });

  /**
   * Use the provided refresh token from the token exchange to call the refresh endpoint and obtain a new access token.
   */
  app.post("/auth/refresh", async (req, res) => {
    const tokenSet = await client.refresh(req.body.refreshToken);

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
