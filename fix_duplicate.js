const fs = require('fs');
let html = fs.readFileSync('study-planner.html', 'utf8');

// Remove the duplicate toastTimer and showToast from the inline script
// (app.js already has these)
const firstIdx = html.indexOf('let toastTimer = null;');
if (firstIdx !== -1) {
  // Find the end of this showToast function block
  const blockEnd = html.indexOf('}, 3000);', firstIdx) + '}, 3000);'.length;
  // Also remove the closing brace of showToast
  const closeIdx = html.indexOf('}', blockEnd) + 1;
  html = html.substring(0, firstIdx) + html.substring(closeIdx);
  console.log('Removed duplicate toastTimer/showToast block');
}

fs.writeFileSync('study-planner.html', html, 'utf8');
