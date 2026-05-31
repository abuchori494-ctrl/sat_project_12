# OnePrep Vocabulary Practice Module 🎯

A premium, highly interactive, production-grade SAT Vocabulary Practice platform featuring a fully animated frontend and a lightweight Express API server.

---

## 🎨 Key Features & Game Modes
1. **Explore Dashboard**: A beautifully designed Hub to access multiple practice game modes.
2. **Learn Mode (MCQ Practice)**: Quiz sessions of 10 unmastered words with real-time green/red verdict animations, progress markers, and detailed breakdowns.
3. **Match (Stopwatch matching game)**: A timed, two-column dynamic match selector matching words to definitions against the clock.
4. **Flashcards**: Smooth, 3D animated CSS Y-axis flipping card deck with touch-event swipe support for mobile, along with Mastered vs. Learning filters.
5. **Dynamic Library Sets**: Manage and study core vs. custom lists complete with live search and custom progress tracking.
6. **Quizlet & Platform Importer**: Automatically parse tab-separated exported Quizlet sets directly into your dynamic word lists.
7. **Graceful Offline Auto-Fallback**: If the API server is offline or unreachable, the client automatically switches to an in-memory, fully-featured localized local database state with zero user disruption.

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
- **Backend API**: Node.js + Express + CORS (In-memory persistent array architecture).
