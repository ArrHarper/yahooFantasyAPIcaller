# Yahoo Fantasy API Developer Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Authentication](#authentication)
4. [Making Requests](#making-requests)
5. [Batch Requests](#batch-requests)
6. [Commands and Options](#commands-and-options)
7. [Troubleshooting](#troubleshooting)

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

Before using the API, you need to authenticate and obtain a refresh token. 

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

## Batch Requests

For larger datasets or queries that span multiple weeks, you can use the batch request functionality:

```
yahooAPI batch <endpoint> -w <weeks> -o <output_file.json> [-s]
```

Example:
```
yahooAPI batch team/423.l.189611.t.1/roster/players/stats -w 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17 -o season_stats.json
```

This command will:
- Make multiple requests to the specified endpoint, breaking down the weeks into manageable batches
- Combine all responses into a single JSON file (season_stats.json in this example)
- Handle rate limiting and errors automatically

### Options for Batch Requests:
- `-w, --weeks <weeks>`: Comma-separated list of weeks to include in the request (required)
- `-o, --output <file>`: Specify the output JSON file (default: "batch_output.json")
- `-s, --separate`: Save results in separate files instead of combining them

If you use the `-s` flag, each batch will be saved in a separate file with a numeric suffix (e.g., season_stats_1.json, season_stats_2.json, etc.).

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

3. `batch`: Make a batch request
   - Usage: `yahooAPI batch <endpoint> -w <weeks> -o <output_file> [-s]`
   - Description: Sends multiple requests to the specified API endpoint for the given weeks
   - Options:
     - `-w, --weeks <weeks>`: Comma-separated list of weeks (required)
     - `-o, --output <file>`: Specify the output JSON file (default: "batch_output.json")
     - `-s, --separate`: Save results in separate files

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

3. **Batch Request Errors**
   - If a batch request fails, the program will automatically retry up to 3 times
   - Check the console output for any error messages or failed batches
   - Consider reducing the number of weeks per request if you're consistently seeing timeouts

4. **Rate Limiting**
   - The batch request functionality is designed to respect Yahoo's rate limits
   - If you're still encountering rate limit errors, try spreading out your requests over a longer period

5. **Installation Issues**
   - Make sure you have the latest version of Node.js and npm
   - Try uninstalling and reinstalling the package:
     ```
     npm uninstall -g yahooapi
     npm install -g .
     ```

6. **Permissions Errors**
   - On Unix-based systems, you might need to use `sudo` when installing globally

For any other issues, please check the error message for details or consult the Yahoo Fantasy Sports API documentation.