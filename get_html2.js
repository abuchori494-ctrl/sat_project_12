const fs = require('fs');
const html = fs.readFileSync('question-bank/index.html', 'utf8');

const i = html.indexOf('qb-split-col');
if (i !== -1) {
  console.log(html.substring(Math.max(0, i-500), i+2000));
} else {
  console.log('qb-split-col not found');
}
