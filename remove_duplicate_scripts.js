const fs = require('fs');
let html = fs.readFileSync('study-planner.html', 'utf-8');

// remove all app.js inclusions
html = html.replace(/<script src="app\.js"><\/script>\s*/g, '');
// remove all sidebar.js inclusions
html = html.replace(/<script src="\/sidebar\.js"><\/script>\s*/g, '');

// insert one copy of each right before the main <script> tag starts
html = html.replace('<!-- ==========================================\n       JAVASCRIPT APPLICATION ROUTER & STATES', 
'<script src="app.js"></script>\n<script src="/sidebar.js"></script>\n\n  <!-- ==========================================\n       JAVASCRIPT APPLICATION ROUTER & STATES');

fs.writeFileSync('study-planner.html', html, 'utf-8');
console.log("Duplicate scripts removed.");
