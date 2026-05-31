const fs = require('fs');
const content = fs.readFileSync('/Users/abdusalomovabdulloh/summer_projects/sat_project_11/style.css', 'utf8');

let stack = [];
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  for (let j = 0; j < line.length; j++) {
    let char = line[j];
    if (char === '{') {
      stack.push({ line: i + 1, text: line.trim() });
    }
    if (char === '}') {
      if (stack.length === 0) {
        console.error(`Error: Extra closing brace at line ${i + 1}: ${line.trim()}`);
        process.exit(1);
      }
      stack.pop();
    }
  }
}

if (stack.length > 0) {
  console.error(`Error: Found ${stack.length} unclosed braces!`);
  stack.forEach(item => {
    console.error(`- Unclosed '{' opened at line ${item.line}: "${item.text}"`);
  });
  process.exit(1);
} else {
  console.log("Braces match perfectly!");
}
