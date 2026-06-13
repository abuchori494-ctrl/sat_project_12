const fs = require('fs');
let html = fs.readFileSync('golden.html', 'utf8');

// ONLY fix 1: guard renderCalendar against missing DOM elements
html = html.replace(
  'function renderCalendar() {',
  'function renderCalendar() {\n        if (!document.getElementById(\'schedule-calendar\')) return;'
);

// ONLY fix 2: guard renderWeekTabs against missing DOM elements  
html = html.replace(
  'function renderWeekTabs() {',
  'function renderWeekTabs() {\n        if (!document.getElementById(\'dash-week-tabs\')) return;'
);

// ONLY fix 3: guard against null className on calendar
html = html.replace(
  '        calendar.className = ',
  '        if(calendar) calendar.className = '
);

// ONLY fix 4: guard recsContainer
html = html.replace(
  "recsContainer.classList.remove('hidden');",
  "if (recsContainer) recsContainer.classList.remove('hidden');"
);
html = html.replace(
  "recsContainer.classList.add('hidden');",
  "if (recsContainer) recsContainer.classList.add('hidden');"
);

fs.writeFileSync('study-planner.html', html, 'utf8');
console.log('Done! study-planner.html restored from git with minimal JS null-guard fixes only.');
