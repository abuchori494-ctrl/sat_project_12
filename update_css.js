const fs = require('fs');

const cssPath = 'C:\\Users\\user\\sat_project_12\\style.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Replace .btn-practice-pill
css = css.replace(/\.btn-practice-pill \{[\s\S]*?transition: var\(--transition\);\s*\}/, `.btn-practice-pill {
  font-family: inherit;
  font-size: 10px;
  font-weight: 850;
  padding: 6px 14px;
  border-radius: 50px;
  cursor: pointer;
  border: 1px solid #534AB7;
  background: #534AB7;
  color: white;
  transition: var(--transition);
}`);

css = css.replace(/\.btn-practice-pill:hover \{[\s\S]*?\}/, `.btn-practice-pill:hover {
  background: #4338ca;
  transform: translateY(-1px);
}`);

css = css.replace(/\.btn-practice-pill\.btn-math \{[\s\S]*?\}/, '');
css = css.replace(/\.btn-practice-pill\.btn-math:hover \{[\s\S]*?\}/, '');

// Replace .btn-review-pill
css = css.replace(/\.btn-review-pill \{[\s\S]*?transition: var\(--transition\);\s*\}/, `.btn-review-pill {
  font-family: inherit;
  font-size: 10px;
  font-weight: 750;
  padding: 6px 14px;
  border-radius: 50px;
  cursor: pointer;
  border: 1px solid #534AB7;
  background: transparent;
  color: #534AB7;
  transition: var(--transition);
}`);

css = css.replace(/\.btn-review-pill:hover \{[\s\S]*?\}/, `.btn-review-pill:hover {
  background: #F5F3FF;
}`);

// Add new classes
const newClasses = `
/* Not Started Badge */
.badge-not-started {
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  background: #F3F4F6;
  padding: 4px 10px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 12px;
}
body.dark .badge-not-started {
  background: rgba(255,255,255,0.05);
  color: #9CA3AF;
}

/* Centered Start Button */
.btn-start-center {
  width: 100%;
  max-width: 160px;
  margin: 12px auto 0;
  display: block;
  text-align: center;
  font-size: 11px;
  padding: 8px 16px;
}

/* Compact empty state widgets */
.vocab-compact-row {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 24px;
}
.vocab-compact-card {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 12px rgba(124, 111, 224, 0.08);
}
`;

css += newClasses;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('CSS updated');
