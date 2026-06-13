const fs = require('fs');
let html = fs.readFileSync('study-planner.html', 'utf8');

html = html.replace(
  "function renderCalendar() {",
  "function renderCalendar() {\n        if (!document.getElementById('schedule-calendar')) return;"
);
html = html.replace(
  "function renderWeekTabs() {",
  "function renderWeekTabs() {\n        if (!document.getElementById('dash-week-tabs')) return;"
);

// also let's check for any other uncaught errors
html = html.replace(
  "calendar.className =",
  "if(calendar) calendar.className ="
);

fs.writeFileSync('study-planner.html', html, 'utf8');
