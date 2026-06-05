const fs = require('fs');
const filepath = 'C:\\Users\\user\\sat_project_12\\past-exams.html';

let text = fs.readFileSync(filepath, 'utf8');

// Replace header emojis
text = text.replace(/<span class="ecl-icon">\?\?<\/span>\s*<div>\s*<h3>English &amp; Reading<\/h3>/g, '<span class="ecl-icon">📖</span>\n            <div>\n              <h3>English &amp; Reading</h3>');
text = text.replace(/<span class="ecl-icon">\?\?<\/span>\s*<div>\s*<h3>Math<\/h3>/g, '<span class="ecl-icon">🧮</span>\n            <div>\n              <h3>Math</h3>');
text = text.replace(/<span class="ecl-icon">\?\?<\/span>\s*<div>\s*<h3>Vocabulary Bank<\/h3>/g, '<span class="ecl-icon">🌿</span>\n            <div>\n              <h3>Vocabulary Bank</h3>');

// Latest highlight
text = text.replace(/id="latest-title">\?"? Latest Administration<\/h2>/g, 'id="latest-title">🔥 Latest Administration</h2>');
text = text.replace(/`\?\? Latest Administration:/g, '`🔥 Latest Administration:');

// Module titles
text = text.replace(/<strong>\?\? Reading Comprehension<\/strong>/g, '<strong>📖 Reading Comprehension</strong>');
text = text.replace(/<strong>\?\? Writing & Language<\/strong>/g, '<strong>✍️ Writing & Language</strong>');
text = text.replace(/<strong>\?\? Module 1<\/strong>/g, '<strong>🧩 Module 1</strong>');
text = text.replace(/<strong>\?\? Module 2<\/strong>/g, '<strong>🧩 Module 2</strong>');

// Date in card header
text = text.replace(/<h4>\?\? \$\{exam\.month\}/g, '<h4>🗓️ ${exam.month}');

// Buttons
text = text.replace(/\? PRACTICE/g, '▶ PRACTICE');
text = text.replace(/\? TRY NOW/g, '▶ TRY NOW');
text = text.replace(/\?\? Upgrade/g, '⬆️ Upgrade');
text = text.replace(/ů\? Upgrade/g, '⬆️ Upgrade');
text = text.replace(/- <\/button>/g, '▶</button>');

// Sidebar / Vocab icons
text = text.replace(/\?\? Daily Challenge/g, '📖 Daily Challenge');
text = text.replace(/size: 32px;">\?\?<\/div>/g, 'size: 32px;">💡</div>');
text = text.replace(/margin-right: 12px;">\?\?<\/div>/g, 'margin-right: 12px;">📚</div>');
text = text.replace(/font-weight: bold;">\?\?<\/div>/g, 'font-weight: bold;">🔗</div>');
text = text.replace(/margin-bottom: 8px;">\?\?<\/div>/g, 'margin-bottom: 8px;">📚</div>');

// Search bar
text = text.replace(/class="spb-icon-left">\?"?<\/span>/g, 'class="spb-icon-left">🔍</span>');
text = text.replace(/class="spb-icon-left">\?"\?<\/span>/g, 'class="spb-icon-left">🔍</span>');
text = text.replace(/class="spb-icon-right">\?\?<\/span>/g, 'class="spb-icon-right">⌘K</span>');
text = text.replace(/class="spb-icon-right">\?\?<\/span>/g, 'class="spb-icon-right">⌘K</span>');

// Sidebar Sun/Moon
text = text.replace(/body:not\(\.dark\) \.dm-icon::before \{ content: '\?\?'; \}/g, "body:not(.dark) .dm-icon::before { content: '☀️'; }");
text = text.replace(/body\.dark \.dm-icon::before \{ content: '\?\?'; \}/g, "body.dark .dm-icon::before { content: '🌙'; }");
text = text.replace(/content: '\?\?'/g, "content: '☀️'");
text = text.replace(/content: '\?\?T'/g, "content: '🌙'");

// Sidebar profile dropdown text
text = text.replace(/\?T\? Account Settings/g, '⚙️ Account Settings');
text = text.replace(/\?T\? Account Settings/g, '⚙️ Account Settings');
text = text.replace(/\?'\? Join Us/g, '🌟 Join Us');
text = text.replace(/\?'\? Join Us/g, '🌟 Join Us');
text = text.replace(/< Other/g, '✨ Other');
text = text.replace(/< Other/g, '✨ Other');
text = text.replace(/<span>\?T\?<\/span>/g, '<span>⚙️</span>');
text = text.replace(/<span>\?T\?<\/span>/g, '<span>⚙️</span>');

text = text.replace(/\?\? Complete Module 1/g, 'ℹ️ Complete Module 1');

// Write back
fs.writeFileSync(filepath, text, 'utf8');
console.log('done');
