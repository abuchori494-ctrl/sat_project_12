const fs = require('fs');
const html = fs.readFileSync('latest_commit.html', 'utf8');
const rx = /<section id=\"view-dashboard\"[\s\S]*?<\/section>\s*<\/div>\s*<!-- Dynamic alert toast -->/;
const match = html.match(rx);
if (match) {
  fs.writeFileSync('commit_dashboard.html', match[0]);
  console.log('Saved commit_dashboard.html');
} else {
  console.log('No match!');
}
