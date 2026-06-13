const fs = require('fs');
let content = fs.readFileSync('study-planner.html', 'utf-8');

// Replace renderSchedulePlan(...) with navigate('dashboard')
content = content.replace(/renderSchedulePlan\([^)]+\);/g, "navigate('dashboard');");

fs.writeFileSync('study-planner.html', content, 'utf-8');
