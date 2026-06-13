const fs = require('fs');
const html = fs.readFileSync('latest_commit.html', 'utf8');
const rx = /let toastTimer = null;[\s\S]*?function showToast.*?{[\s\S]*?}, 3000\);\s*}/g;
const matches = html.match(rx);
if (matches) {
  console.log('Matches found:', matches.length);
  for(let m of matches) {
    console.log('Length:', m.length);
    console.log('First 100:', m.substring(0, 100));
  }
} else {
  console.log('No matches');
}
