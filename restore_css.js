const fs = require('fs');

const cssPath = 'C:\\Users\\user\\sat_project_12\\style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const targetStr = `body.dark .lah-header h2 {
  font-size: 18px;
  font-weight: 800;
  color: #4C1D95;
}
.filter-pill {`;

const restoredCSS = `body.dark .lah-header h2 {
  font-size: 18px;
  font-weight: 800;
  color: #4C1D95;
}

/* Filters Container */
.exam-filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.filter-group label {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-sub);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Inline Select Filters */
.filter-group-inline {
  display: flex;
  align-items: center;
  gap: 6px;
}
.filter-group-inline label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-sub);
  text-transform: uppercase;
}
.filter-group-inline select {
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: #7C6FE0;
  background: white;
  border: 1px solid #7C6FE0;
  border-radius: 6px;
  padding: 4px 8px;
  outline: none;
  cursor: pointer;
}
body.dark .filter-group-inline select {
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: #7C6FE0;
  background: white;
  border: 1px solid #7C6FE0;
}
.filter-pills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.filter-pill {`;

css = css.replace(targetStr, restoredCSS);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Restored missing CSS correctly');
