const fs = require('fs');

// 1 & 4: Fix style.css (ecl-card-header padding and ecl-badge border-radius)
let css = fs.readFileSync('style.css', 'utf8');
css = css.replace(/padding: 20px 24px 14px;/g, 'padding: 20px 24px 12px;');
css = css.replace(/\.ecl-badge\s*\{[\s\S]*?border-radius: 20px;/g, function(match) {
  return match.replace('border-radius: 20px;', 'border-radius: 999px;');
});
fs.writeFileSync('style.css', css);
console.log('style.css updated');

// 3. Ring percentage text color
function fixHtml(file) {
  let text = fs.readFileSync(file, 'utf8');

  // English ring
  text = text.replace(
    /(<div class="progress-ring-box">[\s\S]*?<span style="position: absolute; top: 50%; left: 50%; transform: translate\(-50%, -50%\);)(">)/g,
    '$1; color: #6C63D4;$2'
  );

  // Math ring
  text = text.replace(
    /(<div class="progress-ring-box math-ring">[\s\S]*?<span style="position: absolute; top: 50%; left: 50%; transform: translate\(-50%, -50%\);)(">)/g,
    '$1; color: #5B8DEF;$2'
  );

  fs.writeFileSync(file, text);
  console.log(file + ' updated');
}

fixHtml('past-exams.html');
fixHtml('app.js');
