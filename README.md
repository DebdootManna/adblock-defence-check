# Browser Defence & Ad-Blocking Test

This is a web-based utility designed to test the effectiveness of your browser's ad-blocking and anti-tracking capabilities. It runs a series of live checks against known advertising networks, analytics trackers, and cosmetic filter rules to provide a clear score and a detailed breakdown of your browser's defences.

![Screenshot of the AdBlock Defence Tester](./public/screenshot.png) 
*(Note: You will need to add a screenshot.png to the root of your project for the image to display.)*

---

## Features

-   **Comprehensive Testing:** Checks against dozens of targets across multiple categories, including Ads, Analytics, Social Media, and device-specific (OEM) trackers.
-   **Dynamic, Live Checks:** Actively attempts to load scripts and render elements, providing a real-world assessment rather than a static check.
-   **Visual Dashboards:** Test results are summarized in clean, easy-to-understand doughnut and bar charts.
-   **Detailed Results List:** Every test target is listed with a clear "BLOCKED" or "ALLOWED" status.
-   **Modern & Responsive Design:** Built with a clean, minimal aesthetic inspired by modern developer tools.
-   **Fluid Animations:** Subtle animations provide a smooth and professional user experience.

## Tech Stack

-   **Frontend:** [React](https://reactjs.org/) (with Hooks)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Animation:** [Framer Motion](https://www.framer.com/motion/)
-   **Styling:** CSS with native CSS variables.
-   **Font:** Oswald (from Google Fonts)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (version 16 or later) and npm installed on your machine.

### Installation

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/DebdootManna/adblock-defence-check.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd adblock-defence-check
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```

### Running the Application

To run the app in development mode, execute the following command. This will open the app on `http://localhost:5173` (or the next available port).

```sh
npm run dev
```

### Building for Production

To create a production-ready build of the application, run:

```sh
npm run build
```
This will create a `dist` folder in your project directory with all the static assets.

---
## Credits

This project was created by [Debdoot Manna](https://github.com/DebdootManna).
- **Portfolio:** [debdootmanna.me](https://debdootmanna.me)
- **GitHub:** [@DebdootManna](https://github.com/DebdootManna)
