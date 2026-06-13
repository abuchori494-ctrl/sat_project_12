const fs = require('fs');

let planner = fs.readFileSync('study-planner.html', 'utf-8');
let dashHTML = fs.readFileSync('extracted_dash.html', 'utf-8');
const styleHTML = fs.readFileSync('extracted_style.html', 'utf-8');

// Add IDs to Vanilla CSS dashboard elements
dashHTML = dashHTML.replace(
    '<div style="font-size:28px; font-weight:800; color:var(--lav-dark); line-height:1; margin-bottom:4px; letter-spacing:-0.02em;">1500</div>',
    '<div id="dash-goal-score" style="font-size:28px; font-weight:800; color:var(--lav-dark); line-height:1; margin-bottom:4px; letter-spacing:-0.02em;">1500</div>'
);
dashHTML = dashHTML.replace(
    '<span id="sat-date-display">Dec 5, 2026</span>',
    '<span id="dash-exam-date">Dec 5, 2026</span>'
);
dashHTML = dashHTML.replace(
    '<div class="spc-val" id="days-until-exam" style="margin-bottom:4px;">175</div>',
    '<div class="spc-val" id="dash-days-left" style="margin-bottom:4px;">175</div>'
);
dashHTML = dashHTML.replace(
    '<div class="spc-val" style="font-size:18px; margin-bottom:4px; letter-spacing:-0.01em;">Full Coverage</div>',
    '<div class="spc-val" id="dash-study-mode" style="font-size:18px; margin-bottom:4px; letter-spacing:-0.01em;">Full Coverage</div>'
);

// 1. Inject Style
planner = planner.replace('</head>', styleHTML + '\n</head>');

// 2. Replace dashboard
const dashRegex = /<section id="view-dashboard"[\s\S]*?<\/section>\s*<\/div>\s*<!-- Dynamic alert toast -->/;
const match = planner.match(dashRegex);
if (!match) {
    console.log("Could not find dashboard boundaries in original file.");
    process.exit(1);
}
planner = planner.replace(dashRegex, dashHTML + '\n\n  </div>\n\n  <!-- Dynamic alert toast -->');

// 3. Remove duplicate JS declarations
planner = planner.replace(/const API_BASE = '';/g, '');
planner = planner.replace(/let toastTimer = null;[\s\S]*?function showToast.*?{[\s\S]*?}, 3000\);\s*}/g, '');

// 4. Also wrap textContent updates in JS to avoid any null errors just in case
planner = planner.replace("document.getElementById('dash-goal-score').textContent = goalScore;", "const gEl = document.getElementById('dash-goal-score'); if(gEl) gEl.textContent = goalScore;");
planner = planner.replace("document.getElementById('dash-exam-date').textContent = examDate;", "const eEl = document.getElementById('dash-exam-date'); if(eEl) eEl.textContent = examDate;");
planner = planner.replace("document.getElementById('dash-days-left').textContent = calculateDaysLeft(examDate);", "const dEl = document.getElementById('dash-days-left'); if(dEl) dEl.textContent = calculateDaysLeft(examDate);");
planner = planner.replace("document.getElementById('dash-study-mode').textContent = formatStudyMode(studyMode);", "const mEl = document.getElementById('dash-study-mode'); if(mEl) mEl.textContent = formatStudyMode(studyMode);");

// 5. CSS Fixes for the new dashboard
planner = planner.replace(
  '.sp-cards-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }',
  '.sp-cards-row {\n            display: grid;\n            grid-template-columns: 2fr 1fr 1fr 1fr;\n            gap: 12px;\n            align-items: stretch;\n            margin-bottom: 16px;\n        }'
);
planner = planner.replace(
  '<div class="sp-stat-card" style="grid-column: span 2;">',
  '<div class="sp-stat-card">'
);
planner = planner.replace(
  '<div style="flex: 1; padding-right: 12px; border-right: 1px solid var(--lav-border);">',
  '<div style="flex: 1; padding: 20px; border-right: 1px solid var(--lav-border);">'
);
planner = planner.replace(
  '<div style="flex: 1; padding-left: 12px;">',
  '<div style="flex: 1; padding: 20px;">'
);
planner = planner.replace('TARGET', 'Target');
planner = planner.replace('LATEST', 'Latest');
planner = planner.replace('SAT DATE', 'SAT Date');
planner = planner.replace('COUNTDOWN', 'Days to exam');
planner = planner.replace('THIS WEEK', 'This week');
planner = planner.replace('<p class="spc-sub text-center" style="margin-top:8px;">Click to edit</p>', '');

fs.writeFileSync('study-planner.html', planner, 'utf-8');
console.log("Merge completed successfully!");
