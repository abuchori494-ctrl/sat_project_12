const fs = require('fs');

const filePath = 'c:\\Users\\user\\sat_project_12\\study-planner.html';
let content = fs.readFileSync(filePath, 'utf-8');

const tbodyStart = content.indexOf('<tbody>');
const tbodyEnd = content.indexOf('</tbody>', tbodyStart);
let tbodyContent = content.substring(tbodyStart, tbodyEnd);

tbodyContent = tbodyContent.replace(/<td\s+style="([^"]+)">([\s\S]*?)<\/td>/g, (match, styleAttr, innerHtml) => {
    // 1. Remove border-left
    let newStyle = styleAttr.replace(/border-left:\s*[^;]+;/g, '');
    
    // 2. Remove old background
    newStyle = newStyle.replace(/background:\s*[^;]+;/g, '');
    
    // 3. Determine new background based on text content
    let bg = 'transparent';
    if (/Mock Exam/i.test(innerHtml)) {
        bg = '#FCE7F3'; // Pink (Exam)
    } else if (/Math|Algebra|Geometry/i.test(innerHtml)) {
        bg = '#D1FAE5'; // Green (Math)
    } else if (/Evidence|Synthesis|Reading|R&W|English/i.test(innerHtml)) {
        bg = '#DBEAFE'; // Blue (Reading/English)
    } else if (/Vocab/i.test(innerHtml)) {
        bg = '#FEF3C7'; // Yellow (Vocab)
    } else {
        bg = '#ffffff'; // Fallback
    }

    // Clean up extra spaces in style
    newStyle = newStyle.replace(/\s+/g, ' ').trim();
    
    // Add the new background
    newStyle += ` background: ${bg} !important;`;
    
    return `<td style="${newStyle}">${innerHtml}</td>`;
});

content = content.substring(0, tbodyStart) + tbodyContent + content.substring(tbodyEnd);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Table cells patched successfully.");
