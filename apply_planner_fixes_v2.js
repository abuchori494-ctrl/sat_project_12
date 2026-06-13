const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'study-planner.html');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF
content = content.replace(/\r\n/g, '\n');

// 1. Move/Add <meta charset="UTF-8"> to the very top of <head>
content = content.replace(
  '<head><style>',
  '<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <style>'
);

// Remove duplicate mid-file metas (around line 848)
content = content.replace(
  `</head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Study Planner - OnePrep</title>`,
  `</head>\n  <title>Study Planner - OnePrep</title>`
);

console.log('1. Repositioned UTF-8 charset metadata to the top of <head>.');

// 2. Fix the weekly table column colors:
// Thu (done): light green tint #f0fdf4
// Fri (today): light purple tint #f5f3ff
// Sat+ (ahead): white/no tint
content = content.replace(
  /\.wt-col\.today \{\s*background: #F8F7FF;\s*\}/g,
  `.wt-col.today { background: #f5f3ff !important; }\n        .wt-col.past { background: #f0fdf4 !important; opacity: 1 !important; }`
);
// Ensure cells in today/past columns show the parent background tint
content = content.replace(
  /\.wt-task-cell\.math \{\s*background: #F3F8FF;/g,
  `.wt-col.past .wt-task-cell { background: transparent !important; }\n        .wt-col.today .wt-task-cell { background: transparent !important; }\n        .wt-task-cell.math { background: #F3F8FF;`
);
console.log('2. Set column background tints and cell transparencies.');

// 3. Subject color borders in weekly table cells matching subject color exactly
// Math=#378ADD, Reading=#1D9E75, Writing=#EF9F27, Vocab=#7F77DD
// row 1=Math, row 2=Reading, row 3=Math, row 4=Writing, row 5=Vocab
const subjectBordersCSS = `
        /* Subject left borders in weekly table by row index */
        .wt-col-tasks .wt-task-cell:nth-child(1) { border-left: 3px solid #378ADD !important; }
        .wt-col-tasks .wt-task-cell:nth-child(2) { border-left: 3px solid #1D9E75 !important; }
        .wt-col-tasks .wt-task-cell:nth-child(3) { border-left: 3px solid #378ADD !important; }
        .wt-col-tasks .wt-task-cell:nth-child(4) { border-left: 3px solid #EF9F27 !important; }
        .wt-col-tasks .wt-task-cell:nth-child(5) { border-left: 3px solid #7F77DD !important; }
`;
content = content.replace(
  `        .wt-task-cell.exam { background: #FFF7ED; border-left: 3px solid #EA580C; }`,
  `        .wt-task-cell.exam { background: #FFF7ED; border-left: 3px solid #EA580C; }\n${subjectBordersCSS}`
);
console.log('3. Added cell row index border colors.');

// 4. Center scroll hint below weekly table
content = content.replace(
  /padding: 8px 20px 12px;/g,
  'padding: 8px 20px 12px; text-align: center !important;'
);
content = content.replace(
  /text-align: right; font-size: 11px; color: var\(--lav-gray\); padding: 8px 20px 12px;/g,
  'text-align: center; font-size: 11px; color: var(--lav-gray); padding: 8px 20px 12px;'
);
console.log('4. Centered scroll hint below the weekly table.');

// 5. Spacing: Reduce top padding of the agenda+weekly section from 24px to 16px
content = content.replace(
  /padding: 24px 28px;/g,
  'padding: 16px 28px 24px;'
);
console.log('5. Reduced top padding of sp-body to 16px.');

// 6. Card Heights: Make Today\'s Agenda card and Weekly Table card equal height
content = content.replace(
  /\.sp-tasks-col \{\s*width: 42%;/g,
  `.sp-tasks-col {
            width: 42%;
            align-self: stretch !important;`
);
content = content.replace(
  /\.sp-table-col \{\s*min-width: 0;/g,
  `.sp-table-col {
            min-width: 0;
            align-self: stretch !important;`
);
console.log('6. Applied stretch equal heights to cards.');

// 7. Today\'s Agenda card header layout & elements
const oldHeaderBlock = `<div class="sp-tasks-header">
                <h2><i class="ti ti-clipboard-list"></i> Today's agenda</h2>
                <div style="display:flex; align-items:center; gap:12px;">
                    <span id="agenda-progress-text" style="display:none; margin:0;"></span>
                    <button class="sp-cta-btn" onclick="window.location.href='exam.html'" style="margin: 0; white-space: nowrap;">
                        Continue Session &rarr;
                    </button>
                </div>
            </div>`;

const newHeaderBlock = `<div class="sp-tasks-header" style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 16px;">
                <h2 style="font-size: 14px; font-weight: 700; color: var(--lav-dark); margin: 0; display: flex; align-items: center; gap: 8px; white-space: nowrap; flex-shrink: 0;">
                    <i class="ti ti-list-check" style="font-size: 16px; color: var(--lav-accent);"></i> Today's agenda
                </h2>
                <span id="agenda-progress-text" style="display: none; font-size: 11px; font-weight: 700; color: var(--lav-gray); background: var(--lav-light); padding: 3px 10px; border-radius: 99px; white-space: nowrap; margin: 0 12px; flex-shrink: 0;">1 of 5 completed</span>
                <button class="sp-cta-btn" onclick="window.location.href='exam.html'" style="margin: 0; white-space: nowrap; flex-shrink: 0;">
                    Continue Session &rarr;
                </button>
            </div>`;

content = content.replace(oldHeaderBlock, newHeaderBlock);
console.log('7. Rebuilt Today\'s Agenda card header layout.');

// 8. Style for Today\'s Agenda card h2 in CSS
content = content.replace(
  /\.sp-tasks-header h2 \{\s*font-size: 14px;\s*font-weight: 700;\s*color: var\(--lav-dark\);\s*margin: 0;\s*display: flex; align-items: center; gap: 8px;\s*\}/g,
  `.sp-tasks-header h2 {
            font-size: 14px;
            font-weight: 700;
            color: var(--lav-dark);
            margin: 0;
            display: flex; align-items: center; gap: 8px;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
        }`
);

// 9. Task Rows height and checkbox/badge top alignments
const customTaskCardCSS = `
        /* Overrides for Agenda task rows layout specificity */
        .dac-tasks .da-task-card {
            padding: 12px 16px !important;
            background: #ffffff !important;
            border: 1px solid var(--lav-border) !important;
            border-left-width: 4px !important;
            border-left-style: solid !important;
            border-radius: 0 20px 20px 0 !important;
            display: flex !important;
            align-items: flex-start !important;
            gap: 12px !important;
            margin-bottom: 8px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            min-height: 48px !important;
        }
        .dac-tasks .da-task-card .da-subject-badge {
            align-self: flex-start !important;
            margin-top: 2px !important;
        }
        .dac-tasks .da-task-card .da-task-checkbox {
            align-self: flex-start !important;
            margin-top: 4px !important;
        }
        .dac-tasks .da-task-card .da-pill {
            align-self: flex-start !important;
            margin-top: 2px !important;
        }
        .dac-tasks .da-task-card h4 {
            line-height: 1.4 !important;
            align-self: flex-start !important;
            margin-top: 1px !important;
        }
`;
content = content.replace(
  `        .da-pill {
            font-size: 12px;
            color: var(--lav-gray);
            white-space: nowrap;
            flex-shrink: 0;
            margin-top: 2px;
        }`,
  `        .da-pill {
            font-size: 12px;
            color: var(--lav-gray);
            white-space: nowrap;
            flex-shrink: 0;
            margin-top: 2px;
        }\n${customTaskCardCSS}`
);
console.log('8 & 9. Added Agenda task card custom layouts and checkbox/badge alignments.');

// 10. Update JavaScript mockup renderer for Today's Agenda to use new alignments and rounded pills
const oldJSBlock = `        return \`
          <div class="da-task-card \${isChecked ? 'completed' : ''}" onclick="toggleMockAgendaTask('\${task.id}')" style="padding: 10px 16px; background: \${cardBg}; border: 1px solid #EDE9FE; border-radius: 0 20px 20px 0; border-left: 4px solid \${task.border}; display: flex; align-items: center; gap: 12px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s ease;">
              <span style="background: \${task.badgeBg}; color: #1E293B; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; text-transform: uppercase;">\${task.subject}</span>
              <h4 style="margin: 0; font-size: 13px; font-weight: 600; flex: 1; color: var(--lav-dark); line-height: 1.4;">\${task.topic}</h4>
              <span style="font-size: 12px; color: var(--lav-gray); white-space: nowrap;">\${task.questions} Questions</span>
              <span style="font-size: 12px; color: var(--lav-gray); white-space: nowrap;">~\${task.time} min</span>
              <div class="da-task-checkbox \${isChecked ? 'checked' : ''}" style="width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid \${cbBorder}; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; background: \${cbBg}; flex-shrink: 0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="check-icon" style="opacity: \${checkOp}; transition: opacity 0.2s;"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
          </div>
        \`;`;

const newJSBlock = `        return \`
          <div class="da-task-card \${isChecked ? 'completed' : ''}" onclick="toggleMockAgendaTask('\${task.id}')" style="padding: 12px 16px; background: \${cardBg}; border: 1px solid #EDE9FE; border-radius: 0 20px 20px 0; border-left: 4px solid \${task.border}; display: flex; align-items: flex-start; gap: 12px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s ease; min-height: 48px;">
              <span class="da-subject-badge" style="background: \${task.badgeBg}; color: #1E293B; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; align-self: flex-start; margin-top: 2px;">\${task.subject}</span>
              <h4 style="margin: 0; font-size: 13px; font-weight: 600; flex: 1; color: var(--lav-dark); line-height: 1.4; align-self: flex-start; margin-top: 1px;">\${task.topic}</h4>
              <span class="da-pill" style="font-size: 11px; background: #F3F2FF; color: #7C6FE0; padding: 2px 8px; border-radius: 20px; align-self: flex-start; margin-top: 2px;">\${task.questions} Questions</span>
              <span class="da-pill" style="font-size: 11px; background: #F3F2FF; color: #7C6FE0; padding: 2px 8px; border-radius: 20px; align-self: flex-start; margin-top: 2px;">~\${task.time} min</span>
              <div class="da-task-checkbox \${isChecked ? 'checked' : ''}" style="width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid \${cbBorder}; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; background: \${cbBg}; flex-shrink: 0; align-self: flex-start; margin-top: 4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="check-icon" style="opacity: \${checkOp}; transition: opacity 0.2s;"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
          </div>
        \`;`;

if (content.includes(oldJSBlock)) {
  content = content.replace(oldJSBlock, newJSBlock);
  console.log('10. Patched JS renderDailyAgenda template.');
} else {
  console.log('10. Warning: could not match renderDailyAgenda JS template.');
}

// 11. CSS overrides for weekly table cells layout: Name & Time on one line, status symbol floated right
const weeklyTableCSS = `
        /* Weekly table cell layout overrides */
        .wt-task-cell {
            padding: 8px 12px !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 8px !important;
            min-height: 40px !important;
        }
        .wt-task-info {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 6px !important;
            min-width: 0 !important;
            flex: 1 !important;
        }
        .wt-task-name {
            font-size: 11px !important;
            font-weight: 700 !important;
            color: var(--lav-dark) !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            flex-shrink: 1 !important;
        }
        .wt-task-time {
            font-size: 10px !important;
            font-weight: 600 !important;
            color: var(--lav-gray) !important;
            flex-shrink: 0 !important;
        }
        .wt-task-icon {
            font-size: 13px !important;
            font-weight: bold !important;
            flex-shrink: 0 !important;
            margin-left: auto !important;
            vertical-align: middle !important;
        }
`;
content = content.replace(
  `        .wt-task-icon.prog { color: var(--lav-accent); }`,
  `        .wt-task-icon.prog { color: var(--lav-accent); }\n${weeklyTableCSS}`
);
console.log('11. Applied weekly table cell horizontal layout overrides in CSS.');

// 12. Simplified legend string
const oldLegendGroupHTML = `<div class="wt-legend-group">
                            <div class="wt-legend-item"><span class="wt-icon done" style="color: #059669; font-weight: bold; margin-right: 2px;">&#10003;</span> Done</div>
                            <div class="wt-legend-item"><span class="wt-icon missed" style="color: #EF4444; font-weight: bold; margin-right: 2px;">&#10007;</span> Missed</div>
                            <div class="wt-legend-item"><span class="wt-icon prog" style="color: #7C6FE0; font-size: 14px; margin-right: 2px;">&bull;</span> Today</div>
                        </div>`;
const newLegendGroupHTML = `<div class="wt-legend-group" style="display: flex; gap: 12px; font-weight: bold;">
                            &#10003; Done &middot; &#10007; Missed &middot; &bull; Today
                        </div>`;
if (content.includes(oldLegendGroupHTML)) {
  content = content.replace(oldLegendGroupHTML, newLegendGroupHTML);
  console.log('12. Updated weekly progress legend block.');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('All patches applied successfully!');
