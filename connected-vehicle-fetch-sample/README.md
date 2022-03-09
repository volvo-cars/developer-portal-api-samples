# Connected Vehicle API Node Example

## About

Minimal example using node on how to get started with Volvo Cars’ Connected Vehicle API.

Read the full API documentation [here](https://developer.volvocars.com/volvo-api/connected-vehicle/).

## Prerequisites

- node 14 or above.
- npm 7 or above.

## Running Locally

### 1. Setup your local project

Install dependencies

```zsh
npm install
```

### 2. Setup environment variables 

Create an .env file in the /node/ folder with your own environment variables.

```zsh
VCC_API_KEY=<your-vcc-api-key-here>
ACCESS_TOKEN=<your-access-token-here>
```
NOTE: The access token is short lived and needs to be refreshed every 60 min.

### 3. Run code

```zsh
npm run start
```
