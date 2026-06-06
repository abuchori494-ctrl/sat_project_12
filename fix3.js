const fs = require('fs');

function fixHtml(file) {
  let text = fs.readFileSync(file, 'utf8');

  // 1. Ring percentage text color and arc color
  // English rings
  text = text.replace(
    /<div class="progress-ring-box">[\s\S]*?<\/svg>\s*<span style="position: absolute; top: 50%; left: 50%; transform: translate\(-50%, -50%\)[^>]*>\$\{([^}]+)\}%<\/span>\s*<\/div>/g,
    function(match, pVar) {
      let track = '#EEEDFE';
      let accent = '#6C63D4';
      return `<div class="progress-ring-box">
  <svg width="54" height="54" style="transform: rotate(-90deg);">
    <circle fill="none" stroke="${track}" stroke-width="5" r="22" cx="27" cy="27"></circle>
    <circle fill="none" stroke="${accent}" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138.2" stroke-dashoffset="\${138.2 * (1 - ${pVar}/100)}" stroke-linecap="round"></circle>
  </svg>
  <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: ${accent};">\${${pVar}}%</span>
</div>`;
    }
  );

  // Math rings
  text = text.replace(
    /<div class="progress-ring-box math-ring">[\s\S]*?<\/svg>\s*<span style="position: absolute; top: 50%; left: 50%; transform: translate\(-50%, -50%\)[^>]*>\$\{([^}]+)\}%<\/span>\s*<\/div>/g,
    function(match, pVar) {
      let track = '#EBF1FE';
      let accent = '#5B8DEF';
      return `<div class="progress-ring-box math-ring">
  <svg width="54" height="54" style="transform: rotate(-90deg);">
    <circle fill="none" stroke="${track}" stroke-width="5" r="22" cx="27" cy="27"></circle>
    <circle fill="none" stroke="${accent}" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138.2" stroke-dashoffset="\${138.2 * (1 - ${pVar}/100)}" stroke-linecap="round"></circle>
  </svg>
  <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: ${accent};">\${${pVar}}%</span>
</div>`;
    }
  );

  // app.js English rings (0%)
  text = text.replace(
    /<div class="progress-ring-box">\s*<svg width="54" height="54" style="transform: rotate\(-90deg\);\"><circle fill="none" stroke="#EEEDFE" stroke-width="5" r="22" cx="27" cy="27"><\/circle>\s*<circle fill="none" stroke="#6C63D4" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138.2" stroke-dashoffset="138.2" stroke-linecap="round"><\/circle>\s*<\/svg>\s*<span style="position: absolute; top: 50%; left: 50%; transform: translate\(-50%, -50%\)[^>]*>0%<\/span>\s*<\/div>/g,
    `<div class="progress-ring-box">
  <svg width="54" height="54" style="transform: rotate(-90deg);">
    <circle fill="none" stroke="#EEEDFE" stroke-width="5" r="22" cx="27" cy="27"></circle>
    <circle fill="none" stroke="#6C63D4" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138.2" stroke-dashoffset="138.2" stroke-linecap="round"></circle>
  </svg>
  <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #6C63D4;">0%</span>
</div>`
  );

  // app.js Math rings (0%)
  text = text.replace(
    /<div class="progress-ring-box math-ring">\s*<svg width="54" height="54" style="transform: rotate\(-90deg\);\"><circle fill="none" stroke="#EBF1FE" stroke-width="5" r="22" cx="27" cy="27"><\/circle>\s*<circle fill="none" stroke="#10b981" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138.2" stroke-dashoffset="138.2" stroke-linecap="round"><\/circle>\s*<\/svg>\s*<span style="position: absolute; top: 50%; left: 50%; transform: translate\(-50%, -50%\)[^>]*>0%<\/span>\s*<\/div>/g,
    `<div class="progress-ring-box math-ring">
  <svg width="54" height="54" style="transform: rotate(-90deg);">
    <circle fill="none" stroke="#EBF1FE" stroke-width="5" r="22" cx="27" cy="27"></circle>
    <circle fill="none" stroke="#5B8DEF" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138.2" stroke-dashoffset="138.2" stroke-linecap="round"></circle>
  </svg>
  <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #5B8DEF;">0%</span>
</div>`
  );

  // 2. REVIEW button inactive state based on score instead of percentage
  text = text.replace(
    /style="\$\{p_([^ ]+) <= 0 \? 'opacity: 0\.4; pointer-events: none;' : ''\}"/g,
    (match, mod) => `style="\$\{score_${mod}.startsWith('0/') ? 'opacity: 0.4; pointer-events: none;' : ''\}"`
  );

  // 3. Card header divider
  text = text.replace(
    /<div class="ecl-card-header"( style="border-bottom: 1px solid #F0F0F8;")?>/g,
    '<div class="ecl-card-header" style="border-bottom: 1px solid #F0F0F8; padding-bottom: 12px;">'
  );

  fs.writeFileSync(file, text);
  console.log(file + ' updated');
}

fixHtml('past-exams.html');
fixHtml('app.js');
