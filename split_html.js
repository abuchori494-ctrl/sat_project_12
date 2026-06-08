const fs = require('fs');
let html = fs.readFileSync('exam.html', 'utf8');

const scriptStart = '<script>';
const scriptEnd = '</script>';

// Find the last script tag since it contains all the logic
const lastScriptStartIndex = html.lastIndexOf(scriptStart);
const lastScriptEndIndex = html.lastIndexOf(scriptEnd);

if (lastScriptStartIndex !== -1 && lastScriptEndIndex > lastScriptStartIndex) {
  const scriptContent = html.substring(lastScriptStartIndex + scriptStart.length, lastScriptEndIndex);
  
  // Write to exam.js
  fs.writeFileSync('exam.js', scriptContent.trim());
  console.log('Created exam.js');
  
  // Replace in html
  const newHtml = html.substring(0, lastScriptStartIndex) + '<script src="exam.js" defer></script>\n' + html.substring(lastScriptEndIndex + scriptEnd.length);
  fs.writeFileSync('exam.html', newHtml);
  console.log('Updated exam.html');
} else {
  console.log('Could not extract script');
}
