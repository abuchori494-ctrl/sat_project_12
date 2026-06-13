const fs = require('fs');
const restored = fs.readFileSync('study-planner-restored.html', 'utf-8');

// 1. Extract <style>
const styleMatch = restored.match(/<style>[\s\S]*?<\/style>/);
const styleBlock = styleMatch[0];
fs.writeFileSync('extracted_style.html', styleBlock);

// 2. Extract view-dashboard
const dashStart = restored.indexOf('<section id="view-dashboard"');
const scriptStart = restored.indexOf('<script>', dashStart);
let dashHTML = restored.substring(dashStart, scriptStart).trim();

// Append closing section if missing
if (!dashHTML.endsWith('</section>')) {
    dashHTML += '\n</section>';
}

fs.writeFileSync('extracted_dash.html', dashHTML);
console.log("Extracted dashHTML length: " + dashHTML.length);
