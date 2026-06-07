const fs = require('fs');
const path = 'C:\\Users\\user\\sat_project_12\\past-exams.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Math buttons "TRY NOW" -> "PRACTICE"
html = html.replace(/>\s*▶\s*TRY NOW<\/button>/g, '>▶ PRACTICE</button>');
html = html.replace(/>\s*\?\s*TRY NOW<\/button>/g, '>▶ PRACTICE</button>');

// 2. Score badges and Rings
// Instead of modifying the logic string, we can modify the HTML template blocks.
// For EBRW1:
html = html.replace(
  /<div class="score-badge">\$\{score_ebrw1\}<\/div>/g,
  `<div class="score-badge" \${score_ebrw1.startsWith('0/') ? 'style="background: transparent; color: #9CA3AF; border: 1px solid #E5E7EB;"' : ''}>\${score_ebrw1.startsWith('0/') ? 'Not started' : score_ebrw1}</div>`
);
html = html.replace(
  /<div class="progress-ring-box">\s*<svg width="54" height="54" style="transform: rotate\(-90deg\);">\s*<circle fill="none" stroke="#EEEDFE" stroke-width="5" r="22" cx="27" cy="27"><\/circle>\s*<circle fill="none" stroke="#6C63D4" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138\.2" stroke-dashoffset="\$\{138\.2 \* \(1 - p_ebrw1\/100\)\}" stroke-linecap="round"><\/circle>\s*<\/svg>\s*<span style="position: absolute; top: 50%; left: 50%; transform: translate\(-50%, -50%\); color: #6C63D4;">\$\{p_ebrw1\}%<\/span>\s*<\/div>/g,
  `\${p_ebrw1 === 0 ? '<div class="progress-ring-box"><svg width="54" height="54"><circle fill="none" stroke="#F3F4F6" stroke-width="5" r="22" cx="27" cy="27"></circle></svg></div>' : \`<div class="progress-ring-box">
    <svg width="54" height="54" style="transform: rotate(-90deg);">
      <circle fill="none" stroke="#EEEDFE" stroke-width="5" r="22" cx="27" cy="27"></circle>
      <circle fill="none" stroke="#6C63D4" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138.2" stroke-dashoffset="\${138.2 * (1 - p_ebrw1/100)}" stroke-linecap="round"></circle>
    </svg>
    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #6C63D4;">\${p_ebrw1}%</span>
  </div>\`}`
);

// Do the same for EBRW2
html = html.replace(
  /<div class="score-badge">\$\{score_ebrw2\}<\/div>/g,
  `<div class="score-badge" \${score_ebrw2.startsWith('0/') ? 'style="background: transparent; color: #9CA3AF; border: 1px solid #E5E7EB;"' : ''}>\${score_ebrw2.startsWith('0/') ? 'Not started' : score_ebrw2}</div>`
);
html = html.replace(
  /<div class="progress-ring-box">\s*<svg width="54" height="54" style="transform: rotate\(-90deg\);">\s*<circle fill="none" stroke="#EEEDFE" stroke-width="5" r="22" cx="27" cy="27"><\/circle>\s*<circle fill="none" stroke="#6C63D4" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138\.2" stroke-dashoffset="\$\{138\.2 \* \(1 - p_ebrw2\/100\)\}" stroke-linecap="round"><\/circle>\s*<\/svg>\s*<span style="position: absolute; top: 50%; left: 50%; transform: translate\(-50%, -50%\); color: #6C63D4;">\$\{p_ebrw2\}%<\/span>\s*<\/div>/g,
  `\${p_ebrw2 === 0 ? '<div class="progress-ring-box"><svg width="54" height="54"><circle fill="none" stroke="#F3F4F6" stroke-width="5" r="22" cx="27" cy="27"></circle></svg></div>' : \`<div class="progress-ring-box">
    <svg width="54" height="54" style="transform: rotate(-90deg);">
      <circle fill="none" stroke="#EEEDFE" stroke-width="5" r="22" cx="27" cy="27"></circle>
      <circle fill="none" stroke="#6C63D4" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138.2" stroke-dashoffset="\${138.2 * (1 - p_ebrw2/100)}" stroke-linecap="round"></circle>
    </svg>
    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #6C63D4;">\${p_ebrw2}%</span>
  </div>\`}`
);

// Math 1
html = html.replace(
  /<div class="score-badge">\$\{score_math1\}<\/div>/g,
  `<div class="score-badge" \${score_math1.startsWith('0/') ? 'style="background: transparent; color: #9CA3AF; border: 1px solid #E5E7EB;"' : ''}>\${score_math1.startsWith('0/') ? 'Not started' : score_math1}</div>`
);
html = html.replace(
  /<div class="progress-ring-box math-ring">\s*<svg width="54" height="54" style="transform: rotate\(-90deg\);">\s*<circle fill="none" stroke="#EBF1FE" stroke-width="5" r="22" cx="27" cy="27"><\/circle>\s*<circle fill="none" stroke="#5B8DEF" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138\.2" stroke-dashoffset="\$\{138\.2 \* \(1 - p_math1\/100\)\}" stroke-linecap="round"><\/circle>\s*<\/svg>\s*<span style="position: absolute; top: 50%; left: 50%; transform: translate\(-50%, -50%\); color: #5B8DEF;">\$\{p_math1\}%<\/span>\s*<\/div>/g,
  `\${p_math1 === 0 ? '<div class="progress-ring-box math-ring"><svg width="54" height="54"><circle fill="none" stroke="#F3F4F6" stroke-width="5" r="22" cx="27" cy="27"></circle></svg></div>' : \`<div class="progress-ring-box math-ring">
    <svg width="54" height="54" style="transform: rotate(-90deg);">
      <circle fill="none" stroke="#EBF1FE" stroke-width="5" r="22" cx="27" cy="27"></circle>
      <circle fill="none" stroke="#5B8DEF" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138.2" stroke-dashoffset="\${138.2 * (1 - p_math1/100)}" stroke-linecap="round"></circle>
    </svg>
    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #5B8DEF;">\${p_math1}%</span>
  </div>\`}`
);

// Math 2
html = html.replace(
  /<div class="score-badge">\$\{score_math2\}<\/div>/g,
  `<div class="score-badge" \${score_math2.startsWith('0/') ? 'style="background: transparent; color: #9CA3AF; border: 1px solid #E5E7EB;"' : ''}>\${score_math2.startsWith('0/') ? 'Not started' : score_math2}</div>`
);
html = html.replace(
  /<div class="progress-ring-box math-ring">\s*<svg width="54" height="54" style="transform: rotate\(-90deg\);">\s*<circle fill="none" stroke="#EBF1FE" stroke-width="5" r="22" cx="27" cy="27"><\/circle>\s*<circle fill="none" stroke="#5B8DEF" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138\.2" stroke-dashoffset="\$\{138\.2 \* \(1 - p_math2\/100\)\}" stroke-linecap="round"><\/circle>\s*<\/svg>\s*<span style="position: absolute; top: 50%; left: 50%; transform: translate\(-50%, -50%\); color: #5B8DEF;">\$\{p_math2\}%<\/span>\s*<\/div>/g,
  `\${p_math2 === 0 ? '<div class="progress-ring-box math-ring"><svg width="54" height="54"><circle fill="none" stroke="#F3F4F6" stroke-width="5" r="22" cx="27" cy="27"></circle></svg></div>' : \`<div class="progress-ring-box math-ring">
    <svg width="54" height="54" style="transform: rotate(-90deg);">
      <circle fill="none" stroke="#EBF1FE" stroke-width="5" r="22" cx="27" cy="27"></circle>
      <circle fill="none" stroke="#5B8DEF" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138.2" stroke-dashoffset="\${138.2 * (1 - p_math2/100)}" stroke-linecap="round"></circle>
    </svg>
    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #5B8DEF;">\${p_math2}%</span>
  </div>\`}`
);


// 3. Review Tooltips
// Change pointer-events: none to cursor: not-allowed, and add the title
html = html.replace(
  /<button class="btn-review-pill" \$\{showReviewEbrw1\} style="\$\{score_ebrw1\.startsWith\('0\/'\) \? 'opacity: 0\.4; pointer-events: none;' : ''\}">REVIEW<\/button>/g,
  `<button class="btn-review-pill" \${showReviewEbrw1} style="\${score_ebrw1.startsWith('0/') ? 'opacity: 0.5; cursor: not-allowed;' : ''}" \${score_ebrw1.startsWith('0/') ? 'title="Complete at least one question to unlock Review"' : ''}>REVIEW</button>`
);
html = html.replace(
  /<button class="btn-review-pill" \$\{showReviewEbrw2\} style="\$\{score_ebrw2\.startsWith\('0\/'\) \? 'opacity: 0\.4; pointer-events: none;' : ''\}">REVIEW<\/button>/g,
  `<button class="btn-review-pill" \${showReviewEbrw2} style="\${score_ebrw2.startsWith('0/') ? 'opacity: 0.5; cursor: not-allowed;' : ''}" \${score_ebrw2.startsWith('0/') ? 'title="Complete at least one question to unlock Review"' : ''}>REVIEW</button>`
);
html = html.replace(
  /<button class="btn-review-pill" \$\{showReviewMath1\} style="\$\{score_math1\.startsWith\('0\/'\) \? 'opacity: 0\.4; pointer-events: none;' : ''\}">REVIEW<\/button>/g,
  `<button class="btn-review-pill" \${showReviewMath1} style="\${score_math1.startsWith('0/') ? 'opacity: 0.5; cursor: not-allowed;' : ''}" \${score_math1.startsWith('0/') ? 'title="Complete at least one question to unlock Review"' : ''}>REVIEW</button>`
);
html = html.replace(
  /<button class="btn-review-pill" \$\{showReviewMath2\} style="\$\{score_math2\.startsWith\('0\/'\) \? 'opacity: 0\.4; pointer-events: none;' : ''\}">REVIEW<\/button>/g,
  `<button class="btn-review-pill" \${showReviewMath2} style="\${score_math2.startsWith('0/') ? 'opacity: 0.5; cursor: not-allowed;' : ''}" \${score_math2.startsWith('0/') ? 'title="Complete at least one question to unlock Review"' : ''}>REVIEW</button>`
);


fs.writeFileSync(path, html, 'utf8');
console.log('Applied UX fixes!');
