const html = require('fs').readFileSync('study-planner.html', 'utf8');
const classListRegex = /document\.getElementById\('([^']+)'\)\.classList/g;
let match;
const missing = new Set();
while ((match = classListRegex.exec(html)) !== null) {
  const id = match[1];
  if (!html.includes(\id="\"\) && !html.includes(\id='\'\)) {
    missing.add(id);
  }
}
console.log('Missing element for classList:', Array.from(missing));
