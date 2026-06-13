const fs = require('fs');
let html = fs.readFileSync('study-planner-restored.html', 'utf8');

// Fix 1: Remove rogue navigate call at end of file (outside any script scope)
html = html.replace(
  'document.addEventListener("DOMContentLoaded", () => { navigate("dashboard"); });',
  '// (removed rogue navigate call - navigate is scoped inside the main DOMContentLoaded handler)'
);

// Fix 2: Remove duplicate toastTimer (app.js also declares it)
// Find both occurrences - keep just one
const firstIdx = html.indexOf('let toastTimer = null;');
const secondIdx = html.indexOf('let toastTimer = null;', firstIdx + 1);
if (secondIdx !== -1) {
  html = html.substring(0, secondIdx) + '// toastTimer declared above' + html.substring(secondIdx + 'let toastTimer = null;'.length);
  console.log('Removed second toastTimer declaration');
}

// Fix 3: Remove duplicate API_BASE (app.js declares it too)
const apiIdx1 = html.indexOf("const API_BASE = '';");
const apiIdx2 = html.indexOf("const API_BASE = '';", apiIdx1 + 1);
if (apiIdx2 !== -1) {
  html = html.substring(0, apiIdx2) + "// API_BASE declared above" + html.substring(apiIdx2 + "const API_BASE = '';".length);
  console.log('Removed second API_BASE declaration');
}

// Fix 4: Guard renderCalendar against missing DOM elements
if (!html.includes("function renderCalendar() {\n        if (!document.getElementById('schedule-calendar')) return;")) {
  html = html.replace(
    'function renderCalendar() {',
    "function renderCalendar() {\n        if (!document.getElementById('schedule-calendar')) return;"
  );
  console.log('Guarded renderCalendar');
}

// Fix 5: Guard renderWeekTabs against missing DOM elements
if (!html.includes("function renderWeekTabs() {\n        if (!document.getElementById('dash-week-tabs')) return;")) {
  html = html.replace(
    'function renderWeekTabs() {',
    "function renderWeekTabs() {\n        if (!document.getElementById('dash-week-tabs')) return;"
  );
  console.log('Guarded renderWeekTabs');
}

// Fix 6: Guard calendar.className
html = html.replace(
  '        calendar.className = ',
  '        if(calendar) calendar.className = '
);

// Fix 7: Guard recsContainer
html = html.split("recsContainer.classList.remove('hidden');").join("if (recsContainer) recsContainer.classList.remove('hidden');");
html = html.split("recsContainer.classList.add('hidden');").join("if (recsContainer) recsContainer.classList.add('hidden');");

fs.writeFileSync('study-planner.html', html, 'utf8');
console.log('Done! study-planner.html fully restored and fixed.');
console.log('Length:', html.length);
