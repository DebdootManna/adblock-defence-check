// Keywords to help categorize entries from mixed lists
const categoryKeywords = {
  ADS: ['ad', 'banner', 'doubleclick', 'syndication', 'yield', 'monetize', 'sponsor'],
  ANALYTICS: ['analytic', 'metric', 'tracker', 'telemetry', 'pixel', 'collect', 'stats'],
  SOCIAL: ['facebook', 'twitter', 'linkedin', 'pinterest', 'instagram'],
  MALWARE: ['malware', 'exploit', 'phishing', 'ransom'],
};

/**
 * Parses a raw filter list, extracting valid domains and ignoring cosmetic/comment rules.
 * @param {string} content The raw text content of the filter list.
 * @returns {Set<string>} A Set of unique, valid domains from the list.
 */
export function parseListContent(content) {
  const lines = content.split('\n');
  const domains = new Set();
  let ignoredCosmeticRules = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Ignore comments, empty lines, and metadata
    if (!trimmedLine || trimmedLine.startsWith('!') || trimmedLine.startsWith('[')) {
      continue;
    }

    // Ignore cosmetic rules explicitly
    if (trimmedLine.includes('#') || trimmedLine.includes('$')) {
      ignoredCosmeticRules++;
      continue;
    }

    let domain = trimmedLine;

    // Handle host-file format (e.g., 0.0.0.0 example.com)
    if (domain.startsWith('0.0.0.0') || domain.startsWith('127.0.0.1')) {
      domain = domain.replace(/^(0\.0\.0\.0|127\.0\.0\.1)\s+/, '');
    }

    // Handle Adblock Plus domain format (e.g., ||example.com^)
    if (domain.startsWith('||')) {
      domain = domain.substring(2);
      const caretIndex = domain.indexOf('^');
      if (caretIndex !== -1) {
        domain = domain.substring(0, caretIndex);
      }
    }
    
    // Remove any path info
    const slashIndex = domain.indexOf('/');
    if (slashIndex !== -1) {
      domain = domain.substring(0, slashIndex);
    }
    
    // Final validation for a clean domain
    if (domain.includes('.') && !domain.includes('*') && !domain.includes(' ')) {
      // Remove 'www.' prefix for consistency
      if (domain.startsWith('www.')) {
        domain = domain.substring(4);
      }
      if(domain) domains.add(domain);
    }
  }

  return { domains, ignoredCosmeticRules };
}

/**
 * Assigns a category to a domain based on keywords.
 * @param {string} domain The domain to categorize.
 * @param {string} defaultCategory The default category from the source list.
 * @returns {string} The determined category.
 */
export function categorizeDomain(domain, defaultCategory) {
  if (defaultCategory !== 'MIXED') {
    return defaultCategory;
  }
  
  const foundCategory = Object.keys(categoryKeywords).find(key => 
    categoryKeywords[key].some(keyword => domain.includes(keyword))
  );

  return foundCategory || 'General';
}
