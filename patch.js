const fs = require('fs');

const filePath = 'c:\\Users\\user\\sat_project_12\\study-planner.html';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. JS mockupTasks Backgrounds (Today's Agenda)
// Update the rowBg in the JS array to use the new 44 opacity for agenda
content = content.replace(/rowBg: "#E6F1FB33"/g, 'rowBg: "#E6F1FB44"');
content = content.replace(/rowBg: "#EEEDFE33"/g, 'rowBg: "#EEEDFE44"');
content = content.replace(/rowBg: "#E1F5EE33"/g, 'rowBg: "#E1F5EE44"');

// 2. JS Template String
// Replace border-left: 3px solid ${task.border} -> border-left: 4px solid ${task.border} !important
// background: ${cardBg} -> background: ${cardBg} !important
// border-radius: 0 8px 8px 0 -> border-radius: 0 8px 8px 0 !important
// add padding-left: 12px !important
content = content.replace(
    /background: \$\{cardBg\};.*?border-radius: 0 8px 8px 0;\s*border-left: 3px solid \$\{task\.border\};/,
    'background: ${cardBg} !important; opacity: ${cardOp}; border: 0.5px solid var(--color-border-tertiary, var(--lav-border)); border-radius: 0 8px 8px 0 !important; border-left: 4px solid ${task.border} !important; padding-left: 12px !important;'
);

// 3. Static Today's Agenda (HTML)
const dacStart = content.indexOf('<div id="daily-agenda-tasks"');
const dacEnd = content.indexOf('</aside>', dacStart);
let dacContent = content.substring(dacStart, dacEnd);

dacContent = dacContent.replace(/<div class="da-task-card.*?<\/div>\s*<\/div>/gs, (div) => {
    // we want to replace the style block with the new !important rules
    return div.replace(/style="([^"]*)"/, (match, p1) => {
        // Remove existing border-left, background, border-radius, padding-left if any
        let newStyle = p1.replace(/border-left:\s*3px\s*solid\s*#[0-9a-fA-F]+;/i, '');
        newStyle = newStyle.replace(/background:\s*#[0-9a-fA-F]+;/i, '');
        newStyle = newStyle.replace(/border-radius:\s*0\s*8px\s*8px\s*0;/i, '');
        
        let border = '#000000';
        let bg = 'transparent';
        if (div.includes('border-left-color:#3B82F6;') || div.includes('Math')) {
            border = '#378ADD';
            bg = '#E6F1FB44';
        } else if (div.includes('border-left-color:#7C6FE0;') || div.includes('English')) {
            border = '#7F77DD';
            bg = '#EEEDFE44';
        } else if (div.includes('border-left-color:#10B981;') || div.includes('Vocab')) {
            border = '#1D9E75';
            bg = '#E1F5EE44';
        }
        
        return `style="${newStyle.trim()} border-left: 4px solid ${border} !important; background: ${bg} !important; border-radius: 0 8px 8px 0 !important; padding-left: 12px !important;"`;
    });
});

content = content.substring(0, dacStart) + dacContent + content.substring(dacEnd);

// 4. Weekly Table (HTML)
const patchTd = (td, border, bg) => {
    let result = td.replace(/border-left:\s*3px\s*solid\s*#[0-9a-fA-F]+;/, `border-left: 4px solid ${border} !important;`);
    result = result.replace(/background:\s*#[0-9a-fA-F]+;/, `background: ${bg} !important;`);
    return result;
};

const tbodyStart = content.indexOf('<tbody>');
const tbodyEnd = content.indexOf('</tbody>', tbodyStart);
let tbodyContent = content.substring(tbodyStart, tbodyEnd);

tbodyContent = tbodyContent.replace(/<tr>.*?<\/tr>/gs, (tr) => {
    let border = '#000000';
    let bg = 'transparent';
    if (/Heart of Algebra|Geometry|Mock Exam|Advanced Math|Full Math/.test(tr)) {
        border = '#378ADD';
        bg = '#E6F1FB33';
    } else if (/Command of Evidence|Rhetorical Synthesis|Reading Comp|Full R&W/.test(tr)) {
        border = '#7F77DD';
        bg = '#EEEDFE33';
    } else if (/Daily Vocabulary/.test(tr)) {
        border = '#1D9E75';
        bg = '#E1F5EE33';
    }

    let patchedTr = tr.replace(/<td\s+style="[^"]+">/g, (td) => patchTd(td, border, bg));
    return patchedTr;
});

content = content.substring(0, tbodyStart) + tbodyContent + content.substring(tbodyEnd);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Patched successfully.");
