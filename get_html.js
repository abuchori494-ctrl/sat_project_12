const fs = require('fs');
const html = fs.readFileSync('question-bank/index.html', 'utf8');

const m = html.match(/class="qb-split-col"/);
if (m) {
  console.log(html.substring(m.index, m.index + 2000));
}
