const axios = require('axios');
const fs = require('fs');
const path = require('path');

class BatchRequests {
  constructor(api) {
    this.api = api;
    this.maxBatchSize = 5; // Adjust this based on typical request sizes
    this.requestDelay = 1000; // 1 second delay between requests
    this.maxRetries = 3;
  }

  async processBatchRequest(endpoint, weeks, outputFile, separate = false) {
    const batches = this.createBatches(weeks);
    let allResults = [];

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchEndpoint = this.constructBatchEndpoint(endpoint, batch);
      
      let retries = 0;
      while (retries < this.maxRetries) {
        try {
          const result = await this.makeBatchRequest(batchEndpoint);
          allResults.push(result);
          break; // Successful request, exit retry loop
        } catch (error) {
          console.error(`Error in batch ${i + 1}:`, error.message);
          retries++;
          if (retries >= this.maxRetries) {
            console.error(`Failed to process batch ${i + 1} after ${this.maxRetries} attempts`);
          } else {
            console.log(`Retrying batch ${i + 1}...`);
            await this.delay(this.requestDelay * 2); // Longer delay for retries
          }
        }
      }

      if (i < batches.length - 1) {
        await this.delay(this.requestDelay);
      }
    }

    this.saveResults(allResults, outputFile, separate);
  }

  createBatches(weeks) {
    const batches = [];
    for (let i = 0; i < weeks.length; i += this.maxBatchSize) {
      batches.push(weeks.slice(i, i + this.maxBatchSize));
    }
    return batches;
  }

  constructBatchEndpoint(baseEndpoint, weeks) {
    return `${baseEndpoint};weeks=${weeks.join(',')}`;
  }

  async makeBatchRequest(endpoint) {
    const url = `${this.api.BASE_URL}/${endpoint}?format=json`;
    const token = await this.api.getAccessToken();
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  saveResults(results, outputFile, separate) {
    if (separate) {
      results.forEach((result, index) => {
        const fileName = `${path.parse(outputFile).name}_${index + 1}.json`;
        fs.writeFileSync(fileName, JSON.stringify(result, null, 2));
        console.log(`Batch ${index + 1} saved to ${fileName}`);
      });
    } else {
      fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
      console.log(`All results saved to ${outputFile}`);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = BatchRequests;