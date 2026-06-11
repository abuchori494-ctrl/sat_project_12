const fs = require('fs');
const html = fs.readFileSync('question-bank/index.html', 'utf8');

const i = html.indexOf('class="qb-split-col"');
console.log(html.substring(Math.max(0, i-200), i+1500));
