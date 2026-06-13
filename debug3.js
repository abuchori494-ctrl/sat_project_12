const fs = require('fs');
let html;
try { html = fs.readFileSync('latest_commit.html', 'utf16le'); } catch(e) { html = fs.readFileSync('latest_commit.html', 'utf8'); }
const lines = html.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('view-dashboard')) console.log('DASH:', i);
  if (lines[i].includes('Dynamic alert toast')) console.log('TOAST:', i);
}
