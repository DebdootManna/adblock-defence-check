import crypto from "crypto";

/**
 * Fetches content from a URL and computes its SHA256 checksum.
 * @param {string} url The URL to fetch.
 * @returns {Promise<{content: string, checksum: string}>}
 * @throws Will throw an error if the fetch fails.
 */
export async function fetchList(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`,
      );
    }
    const content = await response.text();
    const checksum = crypto.createHash("sha256").update(content).digest("hex");
    return { content, checksum };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Request timed out after 15 seconds");
    }
    throw error;
  }
}
