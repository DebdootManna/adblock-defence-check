# Project: AdBlock Defence Check

This file is for the Gemini AI to preserve context about the project across sessions.

## Tech Stack

-   **Framework:** React 18+ (with Hooks)
-   **Build Tool:** Vite
-   **Styling:** Global CSS with component-specific stylesheets.
-   **Language:** JavaScript (ES6+)

## Key Logic & Architecture (v2)

The application has been significantly refactored for a more visually appealing and minimal user experience.

1.  **UI Components:**
    *   **`ResultChart.jsx`:** A custom, animated SVG doughnut chart that serves as the main visual summary. It takes a count of "protected" and "vulnerable" results and displays the percentage of blocked trackers.
    *   **`TestResultRow.jsx`:** The primary component for displaying individual test results. It replaces the previous card-based layout with a clean, minimal list view item, showing the test title, target, and a status pill ("BLOCKED" / "ALLOWED").
    *   The old `TestCard.jsx` component has been deleted.

2.  **Centralized Test Definitions:** The `src/tests.js` file exports an exhaustive array of test objects. This list has been expanded significantly with more ad, tracker, and OEM-specific domains. Each test is defined with a type ('network' or 'cosmetic'), a bait element, and a check function.

3.  **Dynamic Test Execution:** In `src/App.jsx`, the `useEffect` hook iterates through the imported `tests`.
    *   It dynamically creates bait elements (`<script>`, `<div>`) and appends them to the document.
    *   Network tests use `onload` and `onerror` handlers to determine if a script was blocked.
    *   Cosmetic tests run after a timeout, checking the computed styles of elements to see if they were hidden by a cosmetic filter.

4.  **Aesthetic:** The design was changed to be minimal and clean, resembling a modern developer tool. The primary colors are dark navy/charcoal, with neon green for "BLOCKED" statuses and red for "ALLOWED" statuses.

## Deployment to Vercel

This is a standard Vite application. Deployment requires no special configuration.
1.  Connect the Git repository to Vercel.
2.  Set the framework preset to "Vite".
3.  The build command is `npm run build`.
4.  The output directory is `dist`.

## User Intent

The user's goal is a functional and visually appealing tool to test a browser's ad-blocking capabilities. The user has a strong preference for a minimal, clean, list-based design over generic card layouts. The visualization of results via a chart is a key feature. The comprehensiveness of the test list is also a top priority.