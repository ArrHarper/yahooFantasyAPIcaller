#!/usr/bin/env node

const { Command } = require('commander');
const YahooFantasyAPI = require('../lib/yahoo-api');
const fs = require('fs');
const path = require('path');

const program = new Command();
const api = new YahooFantasyAPI();

program
  .version('1.0.0')
  .description('CLI for Yahoo Fantasy Sports API');

program
  .command('req <endpoint>')
  .description('Make a request to the Yahoo Fantasy Sports API')
  .option('-o, --output <file>', 'Output file name', 'output.json')
  .action(async (endpoint, options) => {
    try {
      if (!process.env.YAHOO_REFRESH_TOKEN) {
        console.error('No refresh token found. Please add your refresh token to .env or run "yahooAPI initauth"');
        process.exit(1);
      }
      await api.makeRequest(endpoint, options.output);
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

program
  .command('initauth')
  .description('Initialize authentication and get new API and refresh tokens')
  .action(async () => {
    try {
      await api.initializeAuthentication();
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

program.parse(process.argv);

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}