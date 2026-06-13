const fs = require('fs');
let html = fs.readFileSync('study-planner.html', 'utf8');

html = html.replace(
  "tabsContainer.innerHTML = '';",
  "if (tabsContainer) tabsContainer.innerHTML = '';"
);
html = html.replace(
  "calendar.innerHTML = '';",
  "if (calendar) calendar.innerHTML = '';"
);
html = html.replace(
  "tabsContainer.appendChild(tab);",
  "if (tabsContainer) tabsContainer.appendChild(tab);"
);
html = html.replace(
  "calendar.appendChild(weekHeader);",
  "if (calendar) calendar.appendChild(weekHeader);"
);
html = html.replace(
  "calendar.appendChild(dayHeader);",
  "if (calendar) calendar.appendChild(dayHeader);"
);
html = html.replace(
  "calendar.appendChild(card);",
  "if (calendar) calendar.appendChild(card);"
);
html = html.replace(
  "recsList.innerHTML =",
  "if (recsList) recsList.innerHTML ="
);
html = html.replace(
  "document.getElementById('dash-goal-score').textContent = goalScore;",
  "const elGoal = document.getElementById('dash-goal-score'); if(elGoal) elGoal.textContent = goalScore;"
);

fs.writeFileSync('study-planner.html', html, 'utf8');
