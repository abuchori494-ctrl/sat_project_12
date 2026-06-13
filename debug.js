const fs = require('fs');
const html = fs.readFileSync('latest_commit.html', 'utf8');
const lines = html.split('\n');
let dashboardStart = -1;
let toastStart = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<section id="view-dashboard"')) dashboardStart = i;
  if (lines[i].includes('<!-- Dynamic alert toast -->')) toastStart = i;
}
console.log('Dashboard starts at', dashboardStart, 'Toast at', toastStart);
if (toastStart - dashboardStart > 10) {
  console.log('Lines between them:', toastStart - dashboardStart);
}
