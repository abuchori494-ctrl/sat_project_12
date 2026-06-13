const fs = require('fs');

let setup_content = fs.readFileSync('plan-setup.html', 'utf-8');
let planner_content = fs.readFileSync('study-planner.html', 'utf-8');

// The JS we want to extract is from 'const API_BASE = '';' to '// DYNAMIC STUDY PLAN DASHBOARD RENDERER'
// PLUS the OFFLINE PLAN SEED GENERATOR and UTILITIES blocks.
const js_match = setup_content.match(/(const API_BASE = '';[\s\S]*?)(?=\/\/ ==========================================\s*\/\/ DYNAMIC STUDY PLAN DASHBOARD RENDERER)/);
let js_code = '';
if (js_match) js_code += js_match[1];

const offline_match = setup_content.match(/(\/\/ ==========================================\s*\/\/ OFFLINE PLAN SEED GENERATOR[\s\S]*?)(?=\/\/ ==========================================\s*\/\/ UTILITIES)/);
if (offline_match) js_code += '\n' + offline_match[1];

const utils_match = setup_content.match(/(\/\/ ==========================================\s*\/\/ UTILITIES[\s\S]*?)(?=<\/script>)/);
if (utils_match) js_code += '\n' + utils_match[1];

if (js_code && !planner_content.includes('const API_BASE =')) {
    js_code = js_code.replace(/window\.location\.href = 'study-planner\.html';/g, "navigate('dashboard');");
    
    planner_content = planner_content.replace('<script>', '<script>\n' + js_code + '\n');
}

fs.writeFileSync('study-planner_merged.html', planner_content, 'utf-8');
console.log("Merge complete!");
