// scripts/fetch-filters.js

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Define the sources for the filter lists
const sources = [
  { url: 'https://easylist.to/easylist/easylist.txt', source: 'EasyList', category: 'ADS' },
  { url: 'https://easylist.to/easylist/easyprivacy.txt', source: 'EasyPrivacy', category: 'ANALYTICS' },
  { url: 'https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt', source: 'AdGuard DNS', category: 'ADS' },
  { url: 'https://abp.oisd.nl/basic/', source: 'OISD Basic', category: 'MIXED' }, // OISD is a mix, we can try to sub-categorize
];

// Keywords to help categorize entries from mixed lists like OISD
const categoryKeywords = {
  ADS: ['ad', 'banner', 'doubleclick', 'syndication', 'yield', 'monetize'],
  ANALYTICS: ['analytic', 'metric', 'tracker', 'telemetry', 'pixel', 'collect'],
  SOCIAL: ['facebook', 'twitter', 'linkedin', 'pinterest'],
  MALWARE: ['malware', 'exploit', 'phishing'],
};

/**
 * Fetches the content of a single filter list from a URL.
 * @param {string} url The URL of the filter list.
 * @returns {Promise<string>} The raw text content of the list.
 */
async function fetchList(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    console.log(`Successfully fetched ${url}`);
    return await response.text();
  } catch (error) {
    console.error(`Error fetching list from ${url}:`, error.message);
    return ''; // Return empty string on failure
  }
}

/**
 * Parses a raw filter list, extracting valid domains.
 * @param {string} content The raw text content of the filter list.
 * @param {string} sourceName The name of the filter list (e.g., 'EasyList').
 * @param {string} defaultCategory The default category to assign to entries from this list.
 * @returns {Array<object>} An array of parsed filter objects.
 */
function parseList(content, sourceName, defaultCategory) {
  const lines = content.split('\n');
  const results = new Set(); // Use a Set to avoid duplicate domains from the same list

  for (const line of lines) {
    // Ignore comments, cosmetic rules, and empty lines
    if (!line || line.startsWith('!') || line.startsWith('[') || line.includes('#') || line.includes('$')) {
      continue;
    }

    let domain = line.trim();
    
    // Extract domain from rules like ||example.com^ or |http://example.com
    if (domain.startsWith('||')) {
      domain = domain.substring(2);
      const caretIndex = domain.indexOf('^');
      if (caretIndex !== -1) {
        domain = domain.substring(0, caretIndex);
      }
    } else if (domain.startsWith('|http')) {
        continue; // Ignore full URL path rules for simplicity
    }
    
    // Clean up common prefixes/suffixes and patterns
    domain = domain.replace(/^0.0.0.0\s+/, ''); // For hosts-file format
    domain = domain.replace(/^127.0.0.1\s+/, ''); // For hosts-file format
    domain = domain.replace(/^(www|ads|ad|tracker)\./, ''); // Remove common subdomains

    // Remove any path info
    const slashIndex = domain.indexOf('/');
    if (slashIndex !== -1) {
      domain = domain.substring(0, slashIndex);
    }
    
    // Basic validation for a domain name
    if (domain.includes('.') && !domain.includes('*') && !domain.includes(' ')) {
        let category = defaultCategory;
        // If the list is mixed, try to categorize based on keywords
        if (defaultCategory === 'MIXED') {
            const foundCategory = Object.keys(categoryKeywords).find(key => 
                categoryKeywords[key].some(keyword => domain.includes(keyword))
            );
            category = foundCategory || 'ADS'; // Default mixed entries to ADS
        }

        results.add(JSON.stringify({ category, target: domain, source: sourceName }));
    }
  }

  return Array.from(results).map(item => JSON.parse(item));
}

/**
 * Shuffles an array in place.
 * @param {Array} array The array to shuffle.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Main function to run the entire process.
 */
async function main() {
  console.log('Starting filter list processing...');
  
  const allEntries = [];

  for (const source of sources) {
    const content = await fetchList(source.url);
    if (content) {
      const parsedEntries = parseList(content, source.source, source.category);
      allEntries.push(...parsedEntries);
      console.log(`Parsed ${parsedEntries.length} entries from ${source.source}`);
    }
  }

  console.log(`\nTotal unique entries before selection: ${allEntries.length}`);

  // Group entries by category
  const groupedByCategory = allEntries.reduce((acc, entry) => {
    acc[entry.category] = acc[entry.category] || [];
    acc[entry.category].push(entry);
    return acc;
  }, {});

  const finalSelection = [];
  const itemsPerCategory = 15;

  // Randomly select items from each category
  for (const category in groupedByCategory) {
    const group = groupedByCategory[category];
    shuffleArray(group);
    const selected = group.slice(0, itemsPerCategory);
    finalSelection.push(...selected);
    console.log(`Selected ${selected.length} entries from category: ${category}`);
  }
  
  // Ensure we have some cosmetic rules as well, which are defined separately
  const cosmeticRules = [
    { category: 'Cosmetic', target: '.ad.banner_ad', source: 'Manual' },
    { category: 'Cosmetic', target: '#sponsored-links', source: 'Manual' },
    { category: 'Cosmetic', target: '.block-adblock-wrapper', source: 'Manual' },
  ];
  finalSelection.push(...cosmeticRules);
  console.log(`Added ${cosmeticRules.length} manual cosmetic rules.`);

  const outputPath = path.join(__dirname, '../src/filters.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalSelection, null, 2));

  console.log(`\nSuccessfully wrote ${finalSelection.length} total entries to ${outputPath}`);
  console.log('Filter processing complete.');
}

main();
