const fs = require('fs');
const html = fs.readFileSync('question-bank/index.html', 'utf8');

const filterRowRegex = /<div class="qb-filter-row.*?<\/div>\s*<\/div>\s*<\/div>/g;
const matches = [...html.matchAll(filterRowRegex)];
console.log(matches.map(m => m[0]));
