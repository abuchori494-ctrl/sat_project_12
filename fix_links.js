const fs = require('fs');

let html = fs.readFileSync('question-bank/index.html', 'utf8');

// Fix border
html = html.replace('border-left: 2px solid var(--border);', 'border-left: 2px solid var(--color-border-tertiary);');

// Fix button to a
html = html.replace(/<button onclick="window\.location\.href='\/exam\.html\?mode=practice&category=\$\{cat\.id\}'" style="([^"]*)">Practice All →<\/button>/g, '<a href="/exam.html?mode=practice&category=${cat.id}" style="$1">Practice All →</a>');

fs.writeFileSync('question-bank/index.html', html);
console.log('Fixed button to a tag and border color!');
