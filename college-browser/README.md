# OnePrep SAT College Browser Module 🎓

A comprehensive, production-ready full-featured digital college browser designed to help SAT students discover, compare, and bookmark top colleges across the United States. Integrates a beautiful score comparative widget and detailed admissions matrices.

---

## 🎨 Key Features & Views
1. **View 1 (College Browser)**:
   - Sticky header with search debouncers and filter tags.
   - 2-Column responsive grid presenting admissions profiles (Acceptance rates, Median SAT scores, type).
   - Live query highlighters wrapping matched strings in `<mark>` tags.
2. **View 2 (College Details)**:
   - Profile summary with abbreviated colorful logos and customized color schemes.
   - Admission stats block: application deadlines, test policy, application fee, and setting.
   - **SAT Score Comparison Widget**: Dynamic zone slider comparing user's inline-editable SAT score against selected college's cohorts (below, lower, upper, above ranges) with interactive marker indicators.
   - **Similar Colleges scroll row**: Recommends similar options within ±10% acceptance rates.
3. **Sort & Filter Modal**:
   - Filter by Public vs Private Nonprofit, acceptance rate range, SAT score range, or US states.
   - Sort by Name, Acceptance Rate, Median SAT, or National Ranking.

---

## 🚀 Rapid Run Guide

To start the API backend and play with the colleges catalog:

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
Simply load `colleges.html` in your web browser:
```bash
# macOS terminal command:
open colleges.html
```

---

## 💻 Technical Spec
- **Frontend**: Responsive single page structure with zero hard reloads. Implements the Sora and DM Sans design languages, heart-beat toggles, and range calculation markers.
- **Backend API**: Node/Express serving the **top 100 US colleges admissions dataset**, complete with filtered matching, tags generation, and relative statistics aggregates.
