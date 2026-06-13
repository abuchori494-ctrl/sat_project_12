const fs = require('fs');
const lines = fs.readFileSync('study-planner-utf8.patch', 'utf-8').split('\n');

let inHunk = false;
let outLines = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('@@ ')) {
        inHunk = true;
        continue;
    }
    
    if (inHunk) {
        if (line.startsWith('+')) {
            outLines.push(line.substring(1));
        } else if (line.startsWith(' ')) {
            outLines.push(line.substring(1));
        } else if (line === '') {
            outLines.push('');
        }
        // ignore lines starting with '-'
    }
}

fs.writeFileSync('study-planner-restored.html', outLines.join('\n'));
console.log('Restored to study-planner-restored.html, length: ' + outLines.length);
