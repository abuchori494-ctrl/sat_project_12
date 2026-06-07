const fs = require('fs');
const path = 'C:\\Users\\user\\sat_project_12\\past-exams.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Fix the progress ring empty states
// EBRW empty ring
html = html.replace(
  /\$\{p_ebrw1 === 0 \? '<div class="progress-ring-box"><svg width="54" height="54"><circle fill="none" stroke="#F3F4F6" stroke-width="5" r="22" cx="27" cy="27"><\/circle><\/svg><\/div>'/g,
  `\${p_ebrw1 === 0 ? '<div class="progress-ring-box"><svg width="54" height="54" style="transform: rotate(-90deg);"><circle fill="none" stroke="#EEEDFE" stroke-width="5" r="22" cx="27" cy="27"></circle></svg></div>'`
);
html = html.replace(
  /\$\{p_ebrw2 === 0 \? '<div class="progress-ring-box"><svg width="54" height="54"><circle fill="none" stroke="#F3F4F6" stroke-width="5" r="22" cx="27" cy="27"><\/circle><\/svg><\/div>'/g,
  `\${p_ebrw2 === 0 ? '<div class="progress-ring-box"><svg width="54" height="54" style="transform: rotate(-90deg);"><circle fill="none" stroke="#EEEDFE" stroke-width="5" r="22" cx="27" cy="27"></circle></svg></div>'`
);

// Math empty ring
html = html.replace(
  /\$\{p_math1 === 0 \? '<div class="progress-ring-box math-ring"><svg width="54" height="54"><circle fill="none" stroke="#F3F4F6" stroke-width="5" r="22" cx="27" cy="27"><\/circle><\/svg><\/div>'/g,
  `\${p_math1 === 0 ? '<div class="progress-ring-box math-ring"><svg width="54" height="54" style="transform: rotate(-90deg);"><circle fill="none" stroke="#EBF1FE" stroke-width="5" r="22" cx="27" cy="27"></circle></svg></div>'`
);
html = html.replace(
  /\$\{p_math2 === 0 \? '<div class="progress-ring-box math-ring"><svg width="54" height="54"><circle fill="none" stroke="#F3F4F6" stroke-width="5" r="22" cx="27" cy="27"><\/circle><\/svg><\/div>'/g,
  `\${p_math2 === 0 ? '<div class="progress-ring-box math-ring"><svg width="54" height="54" style="transform: rotate(-90deg);"><circle fill="none" stroke="#EBF1FE" stroke-width="5" r="22" cx="27" cy="27"></circle></svg></div>'`
);

// 2. Fix the "Not started" badge styling by removing the border
html = html.replace(
  /'style="background: transparent; color: #9CA3AF; border: 1px solid #E5E7EB;"'/g,
  `'style="background: transparent; color: #9CA3AF;"'`
);

fs.writeFileSync(path, html, 'utf8');
console.log('Applied UX fixes for Not Started state!');
