const fs = require('fs');

const cssPath = 'C:\\Users\\user\\sat_project_12\\style.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Revert .btn-practice-pill
css = css.replace(/\.btn-practice-pill \{[\s\S]*?transition: var\(--transition\);\s*\}/, `.btn-practice-pill {
  font-family: inherit;
  font-size: 10px;
  font-weight: 850;
  padding: 6px 14px;
  border-radius: 50px;
  cursor: pointer;
  border: 1px solid #bae6fd;
  background: #f0f9ff;
  color: #0369a1;
  transition: var(--transition);
}`);

css = css.replace(/\.btn-practice-pill:hover \{[\s\S]*?\}/, `.btn-practice-pill:hover {
  background: #e0f2fe;
  transform: translateY(-1px);
}`);

// Insert btn-math overrides
css = css.replace(/\.btn-practice-pill:hover \{[\s\S]*?\}/, `$&
.btn-practice-pill.btn-math {
  background: #1e1b4b;
  color: white;
  border: none;
}
.btn-practice-pill.btn-math:hover {
  background: #312e81;
}`);

// Revert .btn-review-pill
css = css.replace(/\.btn-review-pill \{[\s\S]*?transition: var\(--transition\);\s*\}/, `.btn-review-pill {
  font-family: inherit;
  font-size: 10px;
  font-weight: 750;
  padding: 6px 14px;
  border-radius: 50px;
  cursor: pointer;
  border: 1px solid var(--border);
  background: #ddd6fe;
  color: #5b21b6;
  border-color: transparent;
  transition: var(--transition);
}`);

css = css.replace(/\.btn-review-pill:hover \{[\s\S]*?\}/, `.btn-review-pill:hover {
  background: var(--secondary);
  color: white;
}`);

// Remove new classes
css = css.replace(/\/\* Not Started Badge \*\/[\s\S]*/, '');

fs.writeFileSync(cssPath, css, 'utf8');
console.log('CSS Reverted');
