const fs = require('fs');
const html = fs.readFileSync('past-exams.html', 'utf-8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);

if (scriptMatch) {
  const code = scriptMatch[1];
  try {
    new Function(code);
    console.log('Syntax OK');
  } catch (e) {
    console.error('Syntax Error:', e.message, e.stack);
  }
} else {
  console.log("No script tag found");
}
