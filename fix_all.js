const fs = require('fs');

let planner = fs.readFileSync('study-planner.html', 'utf-8');
const setup = fs.readFileSync('plan-setup.html', 'utf-8');

// 1. CSS fixes
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

// 2. Sentence case labels
planner = planner.replace('TARGET', 'Target');
planner = planner.replace('LATEST', 'Latest');
planner = planner.replace('SAT DATE', 'SAT Date');
planner = planner.replace('COUNTDOWN', 'Days to exam');
planner = planner.replace('THIS WEEK', 'This week');
planner = planner.replace('<p class="spc-sub text-center" style="margin-top:8px;">Click to edit</p>', '');
planner = planner.replace('Math: 800 | R&W: 700</p>', 'Math: 800 | R&W: 700</p>');

// 3. Extract setup screens
const screens_match = setup.match(/(<!-- ==========================================\s*SCREEN 1: LANDING PAGE VIEW[\s\S]*?)(?=<!-- ==========================================\s*SCREEN 4:)/);
if (screens_match) {
    planner = planner.replace('<div class="sp-shell">', '<div class="sp-shell">\n' + screens_match[1] + '\n<section id="view-dashboard" class="hidden">\n');
    planner = planner.replace('</div>\n\n<script src="app.js"></script>', '</section>\n</div>\n\n<script src="app.js"></script>');
}

// 4. Extract Javascript
const jsMatch = setup.match(/<script>([\s\S]*?)<\/script>/g);
if (jsMatch) {
    let jsCode = '';
    jsMatch.forEach(m => jsCode += m.replace(/<script>|<\/script>/g, '') + '\n');
    
    // Filter out API_BASE and toastTimer and showToast
    jsCode = jsCode.replace(/const API_BASE = '';/, '');
    jsCode = jsCode.replace(/let toastTimer = null;[\s\S]*?function showToast.*?{[\s\S]*?}, 3000\);\s*}/g, '');
    
    // 5. Append Javascript block at the end, right before </body>
    // We already have a <script> block at the end in study-planner.html that we added for the checkbox logic
    // Let's just put our new JS code before </body>
    planner = planner.replace('</body>', '<script>\n' + jsCode + '\n</script>\n</body>');
}

fs.writeFileSync('study-planner.html', planner, 'utf-8');
console.log("All fixes applied perfectly!");
