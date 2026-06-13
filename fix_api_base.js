const fs = require('fs');
let html = fs.readFileSync('study-planner.html', 'utf8');

// Replace const API_BASE = ''; with window.API_BASE = window.API_BASE || '';
// to avoid the re-declaration error when app.js also declares it
html = html.replace("const API_BASE = '';", "// API_BASE declared in app.js");
console.log('Fixed API_BASE duplicate');

fs.writeFileSync('study-planner.html', html, 'utf8');
