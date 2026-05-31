# OnePrep SAT Question Bank & Redesigned Practice Module 📖

An exceptionally full-featured, production-ready SAT Question Bank & 2-Panel Split Practice interface complete with dynamic SVGs, interactive modals (scientific calculators, geometric reference cards), navigator grids, and local simulated AI integrations.

---

## 🎨 Key Views & Structures
1. **View 1 (Home)**: High-end card indicators to navigate between **Reading & Writing** and **Math** blocks.
2. **View 2 (Reading & Writing Topics)**: Shows category segments (Craft & Structure, Expression of Ideas, Information & Ideas) and subtopic rows (Transitions, Central Ideas) with progress gauges.
3. **View 3 (Math Topics)**: Lists categories (Algebra, Geometry) and subtopics (Linear Equations, Area & Volume) along with percentage indicators.
4. **View 4 (Redesigned Practice Interface)**:
   - **Left Panel (Question Area, ~72% width)**: Sticky controls (Calculator modal, Reference formulas sheet with SVGs, pause timers), passage readers, responsive leak container SVG curves, selection badges, and action bars.
   - **Right Panel (AI Sidebar / Explanation, ~28% width)**: Tab toggles for Ask Preppy chatbot (with mascot blob graphics and quick action tags) or detailed explanation steps with highlighted values.

---

## 🚀 Rapid Run & Install Guide

To start the API backend and play with the interactive practice:

### 1. Install Dependencies
Execute from this directory:
```bash
npm install
```

### 2. Start the API Server
Launch the Node/Express backend:
```bash
npm start
```

### 3. Open the Client Application
Simply load `index.html` in your web browser:
```bash
# macOS terminal command:
open index.html
```

---

## 💻 Technical Spec
- **Frontend**: Single-page structure with 4 routing views. Employs vanilla CSS, ES6 hooks, and SVG coordinates.
- **Backend API**: Node.js + Express with pre-populated in-memory arrays containing 30 real SAT questions.
