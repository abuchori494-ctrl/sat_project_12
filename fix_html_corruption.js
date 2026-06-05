const fs = require('fs');

const htmlPath = 'C:\\Users\\user\\sat_project_12\\past-exams.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// The corrupted block was inserted between `<option value="completed">Completed</option>` and `<option value="not_started">Not Started</option>`.
// Let's use a regex to match from the first `<option value="completed">Completed</option>` to the second `<option value="completed">Completed</option>` and replace it with just the first one.

const corruptedRegex = /<option value="completed">Completed<\/option>[\s\S]*?<option value="completed">Completed<\/option>/;
html = html.replace(corruptedRegex, '<option value="completed">Completed</option>');

// Now we still need to remove the lah-versions div
html = html.replace(/\s*<div class="lah-versions" id="latest-versions"><\/div>/, '');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML restored');
