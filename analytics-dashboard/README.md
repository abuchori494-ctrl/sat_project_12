# OnePrep SAT Analytics Dashboard Module 📊

An exceptionally premium, production-grade SAT Analytics Dashboard module featuring customized hand-drawn Canvas 2D charts, dynamic SVGs, and a lightweight Node/Express backend.

---

## 🎨 Key Features & Sections
1. **Premium Stat Tiles**: Displaying active metrics (Questions Attempted, Current Accuracy, Saved Questions, streaks).
2. **Light Blue Diagnostic Callout**: Includes customized CSS blob characters (purple, pink, and green) with detailed visual effects.
3. **Canvas 2D Activity Trend**: Stacked weekly bars rendered directly onto high-DPI HTML Canvas overlays, complete with standard segment color codings.
4. **Interactive Topic Gauges**: Interactive multi-color progress bars featuring active dot pointers and blurred locked states representing Pro subscription access.
5. **SVG Weak Spots Chart**: Scales stacked pill bars based on weekly metrics, side-by-side with conic pace donut charts and blurred overlays.
6. **SVG Lollipop Pacing Graph**: Lollipop comparisons of student pacing metrics vs platform wide thresholds.
7. **10-Month Daily Heatmaps**: Authentic rendering of 300+ calendar squares highlighted based on weekly practices, complete with accurate Saturday column highlights.
8. **Graceful Connection Fallbacks**: Fully operational even if the Node server is not active! Smoothly routes all fetches through local memory engines.

---

## 🚀 Rapid Setup & Run Instructions

To install dependencies and start the local API server:

### 1. Install Dependencies
Run from this directory:
```bash
npm install
```

### 2. Start the Server
Start the Express server:
```bash
npm start
```

### 3. Open the Dashboard
Simply double-click or open `analytics.html` directly in any web browser!
```bash
# macOS terminal command to open in Chrome/Safari:
open analytics.html
```

---

## 💻 Tech Stack
- **Frontend**: HTML5, Tailwind CSS (via CDN), Vanilla ES6 JavaScript (zero compiled bundlers required).
- **Backend API**: Node.js + Express + CORS.
