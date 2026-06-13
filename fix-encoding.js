const fs = require('fs');
let data = fs.readFileSync('C:\\Users\\user\\sat_project_12\\study-planner.html', 'utf8');

data = data.replace(
    /<div class="jdot-wrapper" title="Week \$\{i\} [^$]+\$\{i <= currentWeek \? 'Completed or Active' : 'Future Week'\}" onclick="document\.querySelector\('\.journey-scroll'\)\.scrollLeft \+= \$\{i < currentWeek \? '-80' : '80'\}"/g,
    '<div class="jdot-wrapper" title="Week ${i} — ${i <= currentWeek ? \'Completed or Active\' : \'Future Week\'}" onclick="document.querySelector(\'.journey-scroll\').scrollLeft += ${i < currentWeek ? \'-80\' : \'80\'}"'
);

fs.writeFileSync('C:\\Users\\user\\sat_project_12\\study-planner.html', data);
