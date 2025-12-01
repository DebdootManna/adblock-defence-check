import fetch from 'node-fetch';
import crypto from 'crypto';

/**
 * Fetches content from a URL and computes its SHA256 checksum.
 * @param {string} url The URL to fetch.
 * @returns {Promise<{content: string, checksum: string}>}
 * @throws Will throw an error if the fetch fails.
 */
export async function fetchList(url) {
  const response = await fetch(url, { timeout: 15000 }); // 15-second timeout
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
  }
  const content = await response.text();
  const checksum = crypto.createHash('sha256').update(content).digest('hex');
  return { content, checksum };
}
