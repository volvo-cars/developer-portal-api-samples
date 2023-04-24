# OAuth2 code flow example

## About

This is a sample app built using Node.js, the Express framework and vanilla JavaScript. It showcases how to authorize with the Volvo ID Identity system using OAuth2 and how to acquire an access token.

Read the full step by step documentation on the [Volvo Cars Developer Portal Authorization page](https://developer.volvocars.com/apis/docs/authorisation/).

## Prerequisites

- node 18 or above.
- npm 9 or above.

## Running Locally

### 1. Setup your local project

Install dependencies

```zsh
npm install
```

### 2. Setup environment variables

Create an `.env` file with the following environment variables:

- `CLIENT_ID` - This is the identifier for your client credentials. It is provided to you after the application publishing process is completed.
- `CLIENT_SECRET` - This is a private key for your client credentials. It is also provided to you after the application publishing process is completed.
- `REDIRECT_URI` - A valid callback URL that was registered when you published your application. It is used to redirect the user after the OAuth2 authorization flow is completed. If used in this application, it's origin must match this server's origin.
- `SCOPES` - A space-separated list of scopes that the user needs to grant consent for.
- `PORT` - Specifies the application's network port. To successfully run this application, the specified port **must** match the port of your `REDIRECT_URI`.

### 3. Run code

```zsh
npm run start
```

### 4. Open application

Your application will now be available at `http://localhost:3000`

## Disclaimer

This project is not intended for use in production environments and is only meant for educational and local testing purposes.
