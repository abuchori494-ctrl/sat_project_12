const fs = require('fs');
let html = fs.readFileSync('study-planner.html', 'utf-8');

const firstIdx = html.indexOf('// UTILITIES');
const secondIdx = html.indexOf('// UTILITIES', firstIdx + 1);

if (secondIdx !== -1) {
    // Find the end of the second UTILITIES block. It ends right before document.addEventListener
    const endIdx = html.indexOf('document.addEventListener("DOMContentLoaded"', secondIdx);
    
    // We want to remove the text starting from // ==========================================\n    // UTILITIES
    // at secondIdx
    // Let's find the // ==== right before secondIdx
    const startOfSecond = html.lastIndexOf('// ==========================================', secondIdx);
    
    if (startOfSecond !== -1 && endIdx !== -1) {
        html = html.substring(0, startOfSecond) + html.substring(endIdx);
        fs.writeFileSync('study-planner.html', html, 'utf-8');
        console.log("Removed from", startOfSecond, "to", endIdx);
    } else {
        console.log("Could not find start or end bounds.");
    }
} else {
    console.log("Second UTILITIES not found.");
}
