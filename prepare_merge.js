const fs = require('fs');
const restored = fs.readFileSync('study-planner-restored.html', 'utf-8');

// 1. Extract <style>
const styleMatch = restored.match(/<style>[\s\S]*?<\/style>/);
if (!styleMatch) {
    console.log("NO STYLE FOUND");
    process.exit(1);
}
const styleBlock = styleMatch[0];

// 2. Extract view-dashboard
// Since there's another </section> after view-dashboard, we can't just match until </section>.
// We need to match until </section> but there are no nested sections inside view-dashboard.
// Let's check if there are nested sections in view-dashboard.
const dashboardMatch = restored.match(/<section id="view-dashboard"[\s\S]*?<\/section>/);
if (!dashboardMatch) {
    console.log("NO DASHBOARD FOUND");
    process.exit(1);
}
let dashboardHTML = dashboardMatch[0];

console.log("Style block length: " + styleBlock.length);
console.log("Dashboard HTML length: " + dashboardHTML.length);
