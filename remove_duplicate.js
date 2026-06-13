const fs = require('fs');
let html = fs.readFileSync('study-planner.html', 'utf-8');

html = html.replace("const API_BASE = '';\n", "");
html = html.replace("const API_BASE = '';\r\n", "");
html = html.replace("const API_BASE = '';", "");

fs.writeFileSync('study-planner.html', html, 'utf-8');
console.log("Removed API_BASE");
