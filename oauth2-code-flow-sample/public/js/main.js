/*
  Copyright 2022 Volvo Car Corporation
  SPDX-License-Identifier: Apache-2.0
*/

const refreshButton = document.querySelector("button#refresh");
const accessTokenContainer = document.querySelector("#access-token");

// Refresh token is stored in-memory, refreshing the browser will force re-login.
let refreshToken;

/**
 * - This function is triggered immediately after a token exchange on the server.
 * - It retrieves cookies sent by the server, clears them, and fills the given DOM element with the access token.
 * - It stores the refresh token in a memory variable which can be used later to post a refresh request.
 */
const onLoad = () => {
  const tokens = getTokenCookies();

  clearTokenCookies();

  // If the access token is missing from cookies, redirect the user to the login page
  if (!tokens.accessToken) {
    window.location.href = "/login";
  }

  refreshToken = tokens.refreshToken;

  accessTokenContainer.textContent = tokens.accessToken;
};

const onRefreshTokenButtonClick = async () => {
  const tokens = await postRefreshToken(refreshToken);

  refreshToken = tokens.refreshToken;

  accessTokenContainer.textContent = tokens.accessToken;
};

const postRefreshToken = async (refreshToken) => {
  const response = await fetch(`${window.location.origin}/auth/refresh`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  return response.json();
};

refreshButton.addEventListener("click", onRefreshTokenButtonClick);

window.addEventListener("load", onLoad);
