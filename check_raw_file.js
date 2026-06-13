const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'study-planner.html'), 'utf8');

const targets = ["тЬУ", "тЬЧ", "тАв", "тАЬ", "тАФ", "ЁЯУЛ", "ЁЯУЖ", "ЁЯОп", "ЁЯУи", "ЁЯУЕ", "тП|"];

console.log("Checking for literal strings in study-planner.html:");
targets.forEach(t => {
  const count = content.split(t).length - 1;
  console.log(`- "${t}": ${count} occurrences`);
});
