const fs = require('fs');

const filePath = 'c:\\Users\\user\\sat_project_12\\study-planner.html';
let content = fs.readFileSync(filePath, 'utf-8');

// --- 1. LEGEND CSS (.wt-box) ---
content = content.replace(/.wt-box.math { background: #[a-zA-Z0-9]+; border: 1px solid #[a-zA-Z0-9]+; }/g, '.wt-box.math { background: #D1FAE5; border: 1px solid #6EE7B7; }');
content = content.replace(/.wt-box.reading { background: #[a-zA-Z0-9]+; border: 1px solid #[a-zA-Z0-9]+; }/g, '.wt-box.reading { background: #DBEAFE; border: 1px solid #93C5FD; }');
content = content.replace(/.wt-box.vocab { background: #[a-zA-Z0-9]+; border: 1px solid #[a-zA-Z0-9]+; }/g, '.wt-box.vocab { background: #FEF3C7; border: 1px solid #FCD34D; }');
content = content.replace(/.wt-box.exam { background: #[a-zA-Z0-9]+; border: 1px solid #[a-zA-Z0-9]+; }/g, '.wt-box.exam { background: #FCE7F3; border: 1px solid #F9A8D4; }');

// --- 2. JAVASCRIPT mockupTasks ---
// In JS, task.border and task.badgeBg and task.rowBg need updating.
// Geometry & Heart of Algebra (Math)
content = content.replace(
    /border: "#378ADD", badgeBg: "#DBEAFE", rowBg: "#E6F1FB44"/g,
    'border: "#10B981", badgeBg: "#D1FAE5", rowBg: "#D1FAE544"'
);
// Command of Evidence & Rhetorical Synthesis (English)
content = content.replace(
    /border: "#7F77DD", badgeBg: "#FAE8FF", rowBg: "#EEEDFE44"/g,
    'border: "#3B82F6", badgeBg: "#DBEAFE", rowBg: "#DBEAFE44"'
);
// Daily Vocabulary
content = content.replace(
    /border: "#1D9E75", badgeBg: "#FEF3C7", rowBg: "#E1F5EE44"/g,
    'border: "#F59E0B", badgeBg: "#FEF3C7", rowBg: "#FEF3C744"'
);

// --- 3. STATIC HTML (Today's Agenda) ---
// We need to replace inline colors for da-task-card
// We replace border-left: 4px solid ... !important; background: ... !important;
const dacStart = content.indexOf('<div id="daily-agenda-tasks"');
const dacEnd = content.indexOf('</aside>', dacStart);
let dacContent = content.substring(dacStart, dacEnd);

dacContent = dacContent.replace(/border-left:\s*4px\s*solid\s*#378ADD\s*!important;\s*background:\s*#E6F1FB44\s*!important/g, 'border-left: 4px solid #10B981 !important; background: #D1FAE544 !important');
dacContent = dacContent.replace(/border-left:\s*4px\s*solid\s*#7F77DD\s*!important;\s*background:\s*#EEEDFE44\s*!important/g, 'border-left: 4px solid #3B82F6 !important; background: #DBEAFE44 !important');
dacContent = dacContent.replace(/border-left:\s*4px\s*solid\s*#1D9E75\s*!important;\s*background:\s*#E1F5EE44\s*!important/g, 'border-left: 4px solid #F59E0B !important; background: #FEF3C744 !important');
// Also update badge backgrounds in the static HTML
dacContent = dacContent.replace(/<span class="da-subject-badge" style="background:#DBEAFE;">Math<\/span>/g, '<span class="da-subject-badge" style="background:#D1FAE5;">Math</span>');
dacContent = dacContent.replace(/<span class="da-subject-badge" style="background:#FAE8FF;">English<\/span>/g, '<span class="da-subject-badge" style="background:#DBEAFE;">English</span>');
dacContent = dacContent.replace(/<span class="da-subject-badge" style="background:#FEF3C7;">Vocab<\/span>/g, '<span class="da-subject-badge" style="background:#FEF3C7;">Vocab</span>');

content = content.substring(0, dacStart) + dacContent + content.substring(dacEnd);

// --- 4. WEEKLY TABLE (HTML) ---
const tbodyStart = content.indexOf('<tbody>');
const tbodyEnd = content.indexOf('</tbody>', tbodyStart);
let tbodyContent = content.substring(tbodyStart, tbodyEnd);

tbodyContent = tbodyContent.replace(/<tr>.*?<\/tr>/gs, (tr) => {
    // If Math row
    if (/Heart of Algebra|Geometry|Mock Exam|Advanced Math|Full Math/.test(tr)) {
        tr = tr.replace(/border-left: 4px solid #378ADD !important;/g, 'border-left: 4px solid #10B981 !important;');
        tr = tr.replace(/background: #E6F1FB33 !important;/g, 'background: #D1FAE533 !important;');
    }
    // If English row
    if (/Command of Evidence|Rhetorical Synthesis|Reading Comp|Full R&W/.test(tr)) {
        tr = tr.replace(/border-left: 4px solid #7F77DD !important;/g, 'border-left: 4px solid #3B82F6 !important;');
        tr = tr.replace(/background: #EEEDFE33 !important;/g, 'background: #DBEAFE33 !important;');
    }
    // If Vocab row
    if (/Daily Vocabulary/.test(tr)) {
        tr = tr.replace(/border-left: 4px solid #1D9E75 !important;/g, 'border-left: 4px solid #F59E0B !important;');
        tr = tr.replace(/background: #E1F5EE33 !important;/g, 'background: #FEF3C733 !important;');
    }
    return tr;
});

content = content.substring(0, tbodyStart) + tbodyContent + content.substring(tbodyEnd);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Colors patched successfully.");
