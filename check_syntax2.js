const fs = require('fs');
const html = fs.readFileSync('C:/Users/user/sat_project_12/past-exams.html', 'utf8');
const scripts = html.match(/<script(?:\s[^>]*)?>[\s\S]*?<\/script>/g);
const code = scripts[scripts.length - 1].replace(/<script(?:\s[^>]*)?>|<\/script>/g, '');

// Write to temp file and try to parse it
fs.writeFileSync('C:/Users/user/sat_project_12/temp_script_check.js', code, 'utf8');

const { spawnSync } = require('child_process');
const result = spawnSync('node', ['--check', 'temp_script_check.js'], { 
  cwd: 'C:/Users/user/sat_project_12',
  encoding: 'utf8' 
});
console.log('STDOUT:', result.stdout);
console.log('STDERR:', result.stderr);
console.log('Status:', result.status);
