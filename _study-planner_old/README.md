# OnePrep SAT Study Planner Module 🎯

An exceptionally premium, production-grade SAT Study Planner module featuring customized calendar schedulers, SVG illustration displays, interactive drag/drop score report parsing screens, and a lightweight Node/Express backend.

---

## 🎨 Key Features & Screens
1. **Screen 1: Landing Hub**: An elegant central interface with custom CSS floating schedule cards, animated teal blob mascot character, multi-step explanations, and option route selections.
2. **Screen 2: Multi-Day Selector Modal**: Select target study days via a horizontal pill grid. Features inline dropdown selectors configured for "Standard practice days" or "Extended practice days" complete with colored dot flags and interactive validations.
3. **Screen 3: Report Upload Zone**: Drag-and-drop or browse local score sheets (PDF, PNG, WebP) up to 10MB. Accompanied by active file selectors, load progress bars, and CollegeBoard retrieval tip popovers.
4. **Interactive 4-Week Plan Dashboard**: Automatically outputs a completed study schedule from selected metrics, displaying rotating Math, Reading, and Writing topics with active checklists.
5. **Robust Offline Support**: Auto-detects server connection status and smoothly routes all operations through localized client data state to prevent disruption if the API server is offline.

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
Simply double-click or open `index.html` directly in any web browser!
```bash
# macOS terminal command to open in Chrome/Safari:
open index.html
```

---

## 💻 Tech Stack
- **Frontend**: HTML5, Tailwind CSS (via CDN), Vanilla ES6 JavaScript (zero compiled bundlers required).
- **Backend API**: Node.js + Express + CORS.
