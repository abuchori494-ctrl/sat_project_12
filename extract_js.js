const fs = require('fs');
const html = fs.readFileSync('study-planner.html', 'utf-8');
const jsMatches = html.match(/<script>([\s\S]*?)<\/script>/g);
if (jsMatches) {
    let scriptContent = '';
    jsMatches.forEach(m => scriptContent += m.replace(/<script>|<\/script>/g, '') + '\n');
    fs.writeFileSync('test_syntax.js', scriptContent);
}
