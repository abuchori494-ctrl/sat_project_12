const fs = require('fs');
let html = fs.readFileSync('study-planner.html', 'utf8');

html = html.replace(
  "recsContainer.classList.remove('hidden');",
  "if (recsContainer) recsContainer.classList.remove('hidden');"
);
html = html.replace(
  "recsContainer.classList.add('hidden');",
  "if (recsContainer) recsContainer.classList.add('hidden');"
);
html = html.replace(
  "document.getElementById('ai-recs-list').innerHTML =",
  "const arl = document.getElementById('ai-recs-list'); if (arl) arl.innerHTML ="
);

fs.writeFileSync('study-planner.html', html, 'utf8');
