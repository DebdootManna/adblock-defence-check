// scripts/fetch-lists.js
const fetch = require('node-fetch');
const crypto = require('crypto');

/**
 * Fetches content from a URL and computes its SHA256 checksum.
 * @param {string} url The URL to fetch.
 * @returns {Promise<{content: string, checksum: string}>}
 * @throws Will throw an error if the fetch fails.
 */
async function fetchList(url) {
  const response = await fetch(url, { timeout: 15000 }); // 15-second timeout
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
  }
  const content = await response.text();
  const checksum = crypto.createHash('sha256').update(content).digest('hex');
  return { content, checksum };
}

module.exports = { fetchList };
