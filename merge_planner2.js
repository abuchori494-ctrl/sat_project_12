const fs = require('fs');
let planner_content = fs.readFileSync('study-planner_merged.html', 'utf-8');

if (!planner_content.includes("navigate('dashboard');")) {
    planner_content = planner_content.replace('</script>\n</body>', 'document.addEventListener("DOMContentLoaded", () => { navigate("dashboard"); });\n</script>\n</body>');
} else {
    // If it already has navigate('dashboard'); from my previous logic... wait, I want it to run on load.
    planner_content = planner_content.replace('</script>\n</body>', 'document.addEventListener("DOMContentLoaded", () => { navigate("dashboard"); });\n</script>\n</body>');
}

fs.writeFileSync('study-planner_merged.html', planner_content, 'utf-8');
