# Yahoo Fantasy API Developer Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Authentication](#authentication)
4. [Making Requests](#making-requests)
5. [Commands and Options](#commands-and-options)
6. [Troubleshooting](#troubleshooting)

## Introduction

The Yahoo Fantasy API program is a command-line tool that simplifies interaction with the Yahoo Fantasy Sports API. It handles authentication, token management, and making API requests, allowing developers to easily retrieve data from Yahoo Fantasy Sports.

## Installation

### Prerequisites
- Node.js (v12 or higher)
- npm (usually comes with Node.js)

### Steps
1. Clone the repository or download the source code:
   ```
   git clone https://github.com/your-repo/yahoo-fantasy-api.git
   cd yahoo-fantasy-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install the package globally:
   ```
   npm install -g .
   ```

4. Create a `.env` file in the root directory with your Yahoo API credentials:
   ```
   YAHOO_CLIENT_ID=your_client_id_here
   YAHOO_CLIENT_SECRET=your_client_secret_here
   ```

## Authentication

Before using the API, you need to authenticate and obtain a refresh token. If you already have a refresh token, simply add it to .env and you can start making requests. 

1. Run the authentication command:
   ```
   yahooAPI initauth
   ```

2. Follow the prompts:
   - Visit the provided URL in your web browser
   - Log in to your Yahoo account and authorize the application
   - Copy the authorization code provided by Yahoo
   - Paste the code into the command line when prompted

3. The program will save the refresh token in your `.env` file automatically.

## Making Requests

Once authenticated, you can make requests to the Yahoo Fantasy Sports API:

```
yahooAPI req <endpoint> -o <output_file.json>
```

Example:
```
yahooAPI req league/nfl.l.123456/standings -o standings.json
```

This will save the API response to `standings.json` in your current directory.

## Commands and Options

### Global Command
- `yahooAPI`: Base command for all operations

### Subcommands
1. `initauth`: Initialize authentication
   - Usage: `yahooAPI initauth`
   - Description: Starts the OAuth2 flow to obtain a refresh token

2. `req`: Make an API request
   - Usage: `yahooAPI req <endpoint> -o <output_file>`
   - Description: Sends a request to the specified API endpoint
   - Options:
     - `-o, --output <file>`: Specify the output JSON file (default: "output.json")

### Options
- `-v, --version`: Display the version number
- `-h, --help`: Display help information

## Troubleshooting

1. **Authentication Errors**
   - Ensure your `YAHOO_CLIENT_ID` and `YAHOO_CLIENT_SECRET` are correct in the `.env` file
   - Run `yahooAPI initauth` to obtain a new refresh token

2. **Request Errors**
   - Check your internet connection
   - Verify that your refresh token is still valid
   - Ensure you're using the correct endpoint in your request

3. **Installation Issues**
   - Make sure you have the latest version of Node.js and npm
   - Try uninstalling and reinstalling the package:
     ```
     npm uninstall -g yahooapi
     npm install -g .
     ```

4. **Permissions Errors**
   - On Unix-based systems, you might need to use `sudo` when installing globally

For any other issues, please check the error message for details or consult the Yahoo Fantasy Sports API documentation.