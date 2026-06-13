const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'study-planner.html'), 'utf8');
const lines = content.split('\n');

console.log('Searching for non-ASCII characters in study-planner.html...');
let count = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Match any character outside standard ASCII range (0-127)
  const nonAscii = line.match(/[^\x00-\x7F]/g);
  if (nonAscii) {
    // Exclude valid HTML entities or simple typographic characters like smart quotes or bullets if needed,
    // but let's print them to inspect
    // Let's filter out standard characters like &mdash; if they are written in unicode, or bullets.
    // Cyrillic characters are in the range \u0400-\u04FF
    const cyrillic = line.match(/[\u0400-\u04FF]/g);
    if (cyrillic) {
      console.log(`Line ${i + 1}: ${line.trim()} (Found Cyrillic: ${cyrillic.join(', ')})`);
      count++;
    }
  }
}
console.log(`Finished search. Found ${count} lines with Cyrillic characters.`);
