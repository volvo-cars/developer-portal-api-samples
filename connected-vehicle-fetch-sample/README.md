# Connected Vehicle API Node Example

## About

Minimal example using node on how to get started with Volvo Cars’ Connected Vehicle API.

Read the full API documentation [here](https://developer.volvocars.com/apis/connected-vehicle/details/).

## Prerequisites

- node 16 or above.
- npm 8 or above.

## Authentication

To authenticate to the Connected Vehicle API, you need two things: a VCC API Key and an access token.

- `VCC_API_KEY` - This is an application key that is generated when you create an application on the Volvo Cars Developer Portal. Visit [your account on the Volvo Cars Developer Portal](https://developer.volvocars.com/account/) to create an application and acquire your application key.

- `ACCESS_TOKEN` - This is an OAuth bearer token that you will need to obtain. For instructions on how to acquire an access token, please refer to the [Volvo Cars Developer Portal reference on authorisation](https://developer.volvocars.com/apis/docs/authorisation/).

## Running Locally

### 1. Setup your local project

Install dependencies

```zsh
npm install
```

### 2. Setup environment variables

Create an .env file with your own environment variables.

```zsh
VCC_API_KEY=<your-vcc-api-key-here>
ACCESS_TOKEN=<your-access-token-here>
```

NOTE: The access token is short lived and needs to be refreshed every 60 min.

### 3. Run code

```zsh
npm run start
```
