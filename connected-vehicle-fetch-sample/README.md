# Connected Vehicle API Node Example

## About

Minimal example using node on how to get started with Volvo Cars’ Connected Vehicle API.

Read the full API documentation on the [Volvo Cars Developer Portal](https://developer.volvocars.com/apis/connected-vehicle/details/).

## Prerequisites

- node 16 or above.
- npm 8 or above.

## Running Locally

### 1. Setup your local project

Install dependencies

```zsh
npm install
```

### 2. Setup environment variables

Create an .env file with the following environment variables:

- `VCC_API_KEY` - This is your application key. To acquire your application key, visit [your account page](https://developer.volvocars.com/account/) and create an application.

- `ACCESS_TOKEN` - This is an OAuth2 bearer token. To generate a Connected Vehicle API access token, visit the [Test access tokens page](https://developer.volvocars.com/apis/docs/test-access-tokens/#demo-car)

NOTE: The access token is short lived and needs to be refreshed every 60 min.

### 3. Run code

```zsh
npm run start
```
