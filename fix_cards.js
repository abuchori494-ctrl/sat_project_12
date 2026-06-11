const fs = require('fs');

let html = fs.readFileSync('question-bank/index.html', 'utf8');

// 1. Remove time estimates
html = html.replace(/<p class="text-\[12px\] text-\[#9CA3AF\] font-regular mt-0\.5">~\$\{estMin\} min<\/p>/g, '');

// 2. Remove "Ready to begin? Pick any skill below."
html = html.replace(/if\s*\(isZeroState\)\s*\{\s*bodyHtml\s*\+=\s*`<div class="px-4 py-3 text-\[14px\] text-\[#6B7280\] font-medium">Ready to begin\? Pick any skill below\.<\/div>`;\s*\}/g, '');

// 3. All cards collapsed by default except IN PROGRESS
html = html.replace(/catEl\.className = `cat-card stagger-item \$\{isZeroState \? 'zero-state' : ''\} \$\{isCompleteState \? 'completed-state' : ''\}`;/g, 
  "const isOpen = (!isZeroState && !isCompleteState);\n          catEl.className = `cat-card stagger-item ${isZeroState ? 'zero-state' : ''} ${isCompleteState ? 'completed-state' : ''} ${isOpen ? 'open' : ''}`;");

if (!html.includes('.cat-body { display: none; }')) {
  html = html.replace(/<\/style>/, `
    .cat-body { display: none; }
    .cat-card.open .cat-body { display: block; }
  </style>`);
}

// 4. Fix sub-skill name truncation CSS and shorten names
// Update CSS
html = html.replace(/<p class="text-\[14px\] font-medium text-\[#374151\] truncate leading-snug group-hover:text-\[\$\{colorSet\.border\}\] transition-colors">\$\{labelHtml\}<\/p>/g,
  '<p class="text-[14px] font-medium text-[#374151] leading-snug group-hover:text-[${colorSet.border}] transition-colors" style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${labelHtml}</p>');

// Shorten data names
html = html.replace(/"Central Ideas and Details"/g, '"Central Ideas"');
html = html.replace(/"Command of Evidence"/g, '"Evidence"');
html = html.replace(/"Equivalent expressions"/g, '"Expressions"');
html = html.replace(/"Linear inequalities in one or two variables"/g, '"Linear inequalities"');
html = html.replace(/"Systems of two linear equations in two variables"/g, '"Systems of linear eq"');
html = html.replace(/"Nonlinear equations in one variable and systems of equations"/g, '"Nonlinear equations"');
html = html.replace(/"Ratios, rates, proportional relationships, and units"/g, '"Ratios & proportions"');
html = html.replace(/"One-variable data: Distributions and measures of center"/g, '"Data distributions"');
html = html.replace(/"Two-variable data: Models and scatterplots"/g, '"Scatterplots & models"');
html = html.replace(/"Probability and conditional probability"/g, '"Probability"');
html = html.replace(/"Right triangles and trigonometry"/g, '"Trigonometry"');
html = html.replace(/"Form, Structure, and Sense"/g, '"Form & Structure"');
html = html.replace(/"Lines, angles, and triangles"/g, '"Lines & angles"');
html = html.replace(/"Inference from sample statistics"/g, '"Sample statistics"');

// 5. Add indentation to sub-skill rows
// Update CSS for .sub-row
html = html.replace(/\.sub-row\s*\{\s*align-items: center;\s*display: flex;\s*align-items: center;\s*justify-content: space-between;\s*gap: 12px;\s*padding: 10px 14px;/g, 
  `.sub-row {
      align-items: center;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 14px 10px 16px;
      border-left: 2px solid var(--border);`);

// 6. Consistent Practice All -> link
// Replace Footer logic
const oldFooter = `          // ZONE C: Footer
          bodyHtml += \`<div class="border-t border-[#E8EAF2] mt-1 px-5 py-3 flex items-center justify-between">\`;
          if (isCompleteState) {
            bodyHtml += \`<span class="text-[13px] text-[#10B981] font-bold">Category mastered! 🎉</span>\`;
            bodyHtml += \`<div class="flex items-center gap-4 shrink-0"><button onclick="window.location.href='/exam.html?mode=practice&category=\${cat.id}'" class="practice-all-link">Review All →</button><div class="w-[140px]"></div></div>\`;
          } else {
            bodyHtml += \`<span class="text-[12px] text-[#6B7280] font-medium">\${visibleSubs.length} of \${cat.subTopics.length} skills in this category</span>\`;
            bodyHtml += \`<div class="flex items-center gap-4 shrink-0"><button onclick="window.location.href='/exam.html?mode=practice&category=\${cat.id}'" class="practice-all-link">Practice All →</button><div class="w-[140px]"></div></div>\`;
          }
          bodyHtml += \`</div></div></div>\`;`;

const newFooter = `          // ZONE C: Footer
          bodyHtml += \`<div class="border-t border-[#E8EAF2] mt-1 px-5 py-3 flex items-center justify-between">\`;
          if (isCompleteState) {
            bodyHtml += \`<span class="text-[13px] text-[#10B981] font-bold">Category mastered! 🎉</span>\`;
          } else {
            bodyHtml += \`<span class="text-[12px] text-[#6B7280] font-medium">\${visibleSubs.length} of \${cat.subTopics.length} skills in this category</span>\`;
          }
          bodyHtml += \`<div class="flex items-center gap-4 shrink-0"><button onclick="window.location.href='/exam.html?mode=practice&category=\${cat.id}'" style="font-size: 13px; color: #534AB7; font-weight: 500; background: transparent; border: none; cursor: pointer; text-decoration: none;">Practice All →</button></div></div></div></div>\`;`;

html = html.replace(oldFooter, newFooter);

fs.writeFileSync('question-bank/index.html', html);
console.log("Fixes applied successfully.");
