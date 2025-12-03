import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { fetchList } from "./fetch-lists.js";
import { parseListContent, categorizeDomain } from "./parse-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sources = [
  {
    name: "easylist",
    url: "https://easylist.to/easylist/easylist.txt",
    category: "ADS",
  },
  {
    name: "easyprivacy",
    url: "https://easylist.to/easylist/easyprivacy.txt",
    category: "ANALYTICS",
  },
  {
    name: "adguard",
    url: "https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt",
    category: "ADS",
  },
  { name: "oisd", url: "https://abp.oisd.nl/basic/", category: "MIXED" },
];

const FILTERS_PATH = path.join(__dirname, "../public/data/filters.json");
const LOG_PATH = path.join(__dirname, "../logs/update.log");
const ITEMS_PER_CATEGORY = 15;

/**
 * Appends a message to the log file.
 * @param {string} message The message to log.
 */
function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${message}
`;
  console.log(message);

  // Ensure logs directory exists
  const logDir = path.dirname(LOG_PATH);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  fs.appendFileSync(LOG_PATH, logEntry);
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

async function main() {
  logMessage("Starting filter update process...");

  let oldData = null;
  if (fs.existsSync(FILTERS_PATH)) {
    oldData = JSON.parse(fs.readFileSync(FILTERS_PATH, "utf-8"));
  }

  const newMetadata = {};
  const fetchedContents = {};
  let needsUpdate = false;

  // 1. Fetch all lists and check for changes
  for (const source of sources) {
    try {
      const { content, checksum } = await fetchList(source.url);
      fetchedContents[source.name] = content;
      newMetadata[source.name] = { url: source.url, checksum };
      if (
        !oldData ||
        !oldData.sources[source.name] ||
        oldData.sources[source.name].checksum !== checksum
      ) {
        needsUpdate = true;
        logMessage(`Source '${source.name}' has changed.`);
      }
    } catch (error) {
      logMessage(
        `ERROR: Failed to fetch source '${source.name}': ${error.message}. Aborting update.`,
      );
      // Fallback logic: abort if any list fails to download
      return;
    }
  }

  if (!needsUpdate) {
    logMessage("No changes detected in any source lists. No update needed.");
    return;
  }

  logMessage("Changes detected. Proceeding to build new filter list.");

  // 2. Parse all contents
  let allRules = new Set();
  let totalIgnored = 0;

  for (const source of sources) {
    const content = fetchedContents[source.name];
    const { domains, ignoredCosmeticRules } = parseListContent(content);
    domains.forEach((domain) => {
      const category = categorizeDomain(domain, source.category);
      allRules.add(
        JSON.stringify({ category, target: domain, source: source.name }),
      );
    });
    totalIgnored += ignoredCosmeticRules;
  }
  logMessage(`Total processed rules: ${allRules.size}`);
  logMessage(`Total ignored cosmetic rules: ${totalIgnored}`);

  const parsedRules = Array.from(allRules).map((item) => JSON.parse(item));

  // 3. Group, shuffle, and select
  const grouped = parsedRules.reduce((acc, rule) => {
    acc[rule.category] = acc[rule.category] || [];
    acc[rule.category].push(rule);
    return acc;
  }, {});

  const finalRules = [];
  const categoryCounts = {};
  for (const category in grouped) {
    const group = grouped[category];
    shuffleArray(group);
    const selected = group.slice(0, ITEMS_PER_CATEGORY);
    finalRules.push(...selected);
    categoryCounts[category] = selected.length;
  }

  // Add manual cosmetic rules
  const cosmeticRules = [
    { category: "Cosmetic", target: ".ad.banner_ad", source: "Manual" },
    { category: "Cosmetic", target: "#sponsored-links", source: "Manual" },
  ];
  finalRules.push(...cosmeticRules);
  categoryCounts["Cosmetic"] =
    (categoryCounts["Cosmetic"] || 0) + cosmeticRules.length;

  logMessage("Category breakdown:");
  for (const cat in categoryCounts) {
    const percentage = (
      (categoryCounts[cat] / finalRules.length) *
      100
    ).toFixed(1);
    logMessage(`- ${cat}: ${categoryCounts[cat]} rules (${percentage}%)`);
  }

  // 4. Compare with old rules for stats
  if (oldData) {
    const oldTargets = new Set(oldData.rules.map((r) => r.target));
    const newTargets = new Set(finalRules.map((r) => r.target));
    const added = finalRules.filter((r) => !oldTargets.has(r.target)).length;
    const removed = oldData.rules.filter(
      (r) => !newTargets.has(r.target),
    ).length;
    logMessage(`Rules comparison: ${added} added, ${removed} removed.`);
  }

  // 5. Build final JSON object and write to file
  const output = {
    last_updated: new Date().toISOString(),
    sources: newMetadata,
    rules: finalRules,
  };

  // Ensure public/data directory exists
  const filtersDir = path.dirname(FILTERS_PATH);
  if (!fs.existsSync(filtersDir)) {
    fs.mkdirSync(filtersDir, { recursive: true });
  }

  fs.writeFileSync(FILTERS_PATH, JSON.stringify(output, null, 2));
  logMessage(
    `Successfully generated new filters.json with ${finalRules.length} rules.`,
  );
}

main().catch((error) => {
  logMessage(`FATAL: An unexpected error occurred: ${error.message}`);
  process.exit(1);
});
