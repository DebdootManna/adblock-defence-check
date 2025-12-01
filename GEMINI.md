# Project: AdBlock Defence Check

This file is for the Gemini AI to preserve context about the project across sessions.

## Core Architecture

The project consists of two main parts:
1.  A **React frontend** that displays the user interface and runs the ad-block tests.
2.  A **Node.js script pipeline** that automatically fetches and processes public filter lists to generate the test data.

---

## Filter List Auto-Update System

A sophisticated, automated pipeline exists to keep the test targets current.

### 1. Purpose
The goal is to avoid maintaining a static list of test domains. This system pulls from major public ad-blocking filter lists, ensuring the tests remain relevant as blocking strategies evolve.

### 2. File Structure
-   `scripts/build-filters.js`: The main orchestrator script that is executed to run the entire pipeline.
-   `scripts/fetch-lists.js`: A helper module that fetches a list's content and calculates its checksum.
-   `scripts/parse-utils.js`: A helper module that parses raw filter list text and categorizes domains.
-   `public/data/filters.json`: The final JSON output consumed by the React application. It contains the test rules and metadata.
-   `logs/update.log`: A log file that records the outcome of each update attempt.

### 3. Workflow
The `build-filters.js` script performs the following steps:
1.  **Read Existing Data:** It first reads `public/data/filters.json` (if it exists) to get the checksums of the previously fetched lists.
2.  **Fetch & Compare:** It fetches the latest content of each source list (EasyList, AdGuard, etc.) and computes a new SHA256 checksum.
3.  **Change Detection:** It compares the new checksums with the old ones. If no checksums have changed, the script logs "No update needed" and exits.
4.  **Parse & Categorize:** If changes are detected, it uses `parse-utils.js` to process the raw text, ignoring comments and cosmetic rules to extract a clean list of domains. It categorizes each domain based on keywords (e.g., 'ADS', 'ANALYTICS', 'MALWARE').
5.  **Select & Build:** It randomly selects ~15 entries from each category to keep the final test suite lightweight. It then constructs the final JSON object, including a `last_updated` timestamp, source metadata (URLs and new checksums), and the array of `rules`.
6.  **Write & Log:** The new object is written to `public/data/filters.json`, and a detailed summary of the process is logged to both the console and `logs/update.log`.

### 4. Automation
-   **GitHub Actions:** The workflow at `.github/workflows/update-filters.yml` runs on a daily schedule (`cron`). It checks out the repo, runs the build script, and commits the updated `filters.json` and `update.log` files back to the repository if any changes were made.
-   **Manual Trigger:** The pipeline can be run locally at any time via `npm run update-filters`.

---

## React Frontend Logic

### 1. Dynamic Test Generation
The hardcoded list of tests has been removed. The file `src/tests.js` now directly imports `public/data/filters.json` and dynamically generates the array of test functions that the application will execute. This means whenever `filters.json` is updated, the frontend automatically uses the new test cases on the next build/run.

### 2. Accurate Network Testing
The core testing logic in `App.jsx` uses the `fetch` API with `mode: 'no-cors'`. This method accurately differentiates between a network request that was truly blocked by an extension (which throws an error) and a request that failed for other reasons (like a CORS policy error), preventing the false positives seen in earlier versions.

### 3. UI Components
-   **`ResultChart.jsx`:** A custom SVG doughnut chart showing the overall percentage of blocked requests.
-   **`CategoryBarChart.jsx`:** A component that provides a visual breakdown of block rates per category (Ads, Analytics, etc.).
-   **`TestResultRow.jsx`:** A minimal list-item component to display the status of each individual test, styled to look like a file explorer list.
