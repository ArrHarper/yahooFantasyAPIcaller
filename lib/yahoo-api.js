const axios = require('axios');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const BatchRequests = require('./batch-requests');
require('dotenv').config();

const BASE_URL = 'https://fantasysports.yahooapis.com/fantasy/v2';
const AUTH_URL = 'https://api.login.yahoo.com/oauth2/request_auth';
const TOKEN_URL = 'https://api.login.yahoo.com/oauth2/get_token';

class YahooFantasyAPI {
  constructor() {
    this.accessToken = null;
    this.tokenExpiresAt = null;
    this.refreshToken = process.env.YAHOO_REFRESH_TOKEN;
    this.BASE_URL = BASE_URL;
    this.batchRequests = new BatchRequests(this);
  }

  async initializeAuthentication() {
    const authCode = await this.getAuthorizationCode();
    await this.getInitialTokens(authCode);
  }

  async getAuthorizationCode() {
    const authUrl = `${AUTH_URL}?client_id=${process.env.YAHOO_CLIENT_ID}&redirect_uri=oob&response_type=code`;
    console.log(`Please visit this URL to authorize the application: ${authUrl}`);
    console.log('After authorizing, you will receive a code. Enter that code below:');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question('Enter the code: ', (code) => {
        rl.close();
        resolve(code);
      });
    });
  }

  async getInitialTokens(authCode) {
    const data = new URLSearchParams({
      grant_type: 'authorization_code',
      redirect_uri: 'oob',
      code: authCode
    });

    try {
      const response = await axios.post(TOKEN_URL, data, {
        auth: {
          username: process.env.YAHOO_CLIENT_ID,
          password: process.env.YAHOO_CLIENT_SECRET
        }
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      this.tokenExpiresAt = new Date(Date.now() + response.data.expires_in * 1000);

      // Save the refresh token to .env file
      const envPath = path.resolve(process.cwd(), '.env');
      let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
      
      if (envContent.includes('YAHOO_REFRESH_TOKEN=')) {
        envContent = envContent.replace(/YAHOO_REFRESH_TOKEN=.*/, `YAHOO_REFRESH_TOKEN=${this.refreshToken}`);
      } else {
        envContent += `\nYAHOO_REFRESH_TOKEN=${this.refreshToken}`;
      }

      fs.writeFileSync(envPath, envContent);

      console.log('Tokens acquired and refresh token saved to .env file.');
      return this.accessToken;
    } catch (error) {
      console.error('Error getting initial tokens:', error.message);
      throw error;
    }
  }

  async getAccessToken() {
    if (this.accessToken && new Date() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    if (!this.refreshToken) {
      throw new Error("Add refresh token to .env or run 'yahooAPI initauth' to init authentication.");
    }

    const data = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken
    });

    try {
      const response = await axios.post(TOKEN_URL, data, {
        auth: {
          username: process.env.YAHOO_CLIENT_ID,
          password: process.env.YAHOO_CLIENT_SECRET
        }
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = new Date(Date.now() + (response.data.expires_in - 300) * 1000);
      return this.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error.message);
      throw error;
    }
  }

  async makeRequest(endpoint, outputFile) {
    try {
      const token = await this.getAccessToken();
      const url = `${BASE_URL}/${endpoint}?format=json`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const outputPath = path.resolve(process.cwd(), outputFile);
      fs.writeFileSync(outputPath, JSON.stringify(response.data, null, 2));
      console.log(`Response saved to ${outputPath}`);
    } catch (error) {
      console.error('Error making request:', error.message);
      throw error;
    }
  }

async makeBatchRequest(endpoint, weeks, outputFile, separate = false) {
    await this.batchRequests.processBatchRequest(endpoint, weeks, outputFile, separate);
  }

}
module.exports = YahooFantasyAPI;