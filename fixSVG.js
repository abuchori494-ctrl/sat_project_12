const fs = require('fs');

function fixHtml(file) {
  let text = fs.readFileSync(file, 'utf8');
  
  // 1. Calendar icon move
  text = text.replace(/<h4>(.*?)<\/h4>\s*<span class="ecl-card-header-icon">🗓️<\/span>/g, '<h4><span class="ecl-card-header-icon">🗓️</span> $1</h4>');

  // 2. Add header border-bottom
  text = text.replace(/<div class="ecl-card-header">/g, '<div class="ecl-card-header" style="border-bottom: 1px solid #F0F0F8;">');

  // 3. Fix SVG for English modules
  text = text.replace(
    /<div class="progress-ring-box" style="--p:\$\{([^}]+)\}">[\s\S]*?<\/svg>\s*<span>\$\{([^}]+)\}%<\/span>\s*<\/div>/g,
    function(match, pVar1, pVar2) {
      let isMath = match.includes('math-ring');
      
      let trackColor = isMath ? '#EBF1FE' : '#EEEDFE';
      let strokeColor = isMath ? '#10b981' : '#6C63D4';
      
      return `<div class="progress-ring-box">
  <svg width="54" height="54" style="transform: rotate(-90deg);">
    <circle fill="none" stroke="${trackColor}" stroke-width="5" r="22" cx="27" cy="27"></circle>
    <circle fill="none" stroke="${strokeColor}" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138.2" stroke-dashoffset="\${138.2 * (1 - ${pVar1}/100)}" stroke-linecap="round"></circle>
  </svg>
  <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">\${${pVar1}}%</span>
</div>`;
    }
  );

  text = text.replace(
    /<div class="progress-ring-box math-ring" style="--p:\$\{([^}]+)\}">[\s\S]*?<\/svg>\s*<span>\$\{([^}]+)\}%<\/span>\s*<\/div>/g,
    function(match, pVar1, pVar2) {
      return `<div class="progress-ring-box math-ring">
  <svg width="54" height="54" style="transform: rotate(-90deg);">
    <circle fill="none" stroke="#EBF1FE" stroke-width="5" r="22" cx="27" cy="27"></circle>
    <circle fill="none" stroke="#10b981" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138.2" stroke-dashoffset="\${138.2 * (1 - ${pVar1}/100)}" stroke-linecap="round"></circle>
  </svg>
  <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">\${${pVar1}}%</span>
</div>`;
    }
  );

  // 4. Same fix SVG for app.js where progress is a hardcoded variable
  text = text.replace(
    /<div class="progress-ring-box(.*?)?" style="--p:0">[\s\S]*?<\/svg>\s*<span>0%<\/span>\s*<\/div>/g,
    function(match, pClass) {
      pClass = pClass || '';
      let isMath = pClass.includes('math-ring');
      let trackColor = isMath ? '#EBF1FE' : '#EEEDFE';
      let strokeColor = isMath ? '#10b981' : '#6C63D4';
      
      return `<div class="progress-ring-box${pClass}">
  <svg width="54" height="54" style="transform: rotate(-90deg);">
    <circle fill="none" stroke="${trackColor}" stroke-width="5" r="22" cx="27" cy="27"></circle>
    <circle fill="none" stroke="${strokeColor}" stroke-width="5" r="22" cx="27" cy="27" stroke-dasharray="138.2" stroke-dashoffset="138.2" stroke-linecap="round"></circle>
  </svg>
  <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">0%</span>
</div>`;
    }
  );

  fs.writeFileSync(file, text);
  console.log(file + ' updated');
}

fixHtml('past-exams.html');
fixHtml('app.js');

let css = fs.readFileSync('style.css', 'utf8');
css = css.replace(/width: 48px;\s*height: 48px;/g, 'width: 54px;\n  height: 54px;');
fs.writeFileSync('style.css', css);
console.log('style.css updated');
