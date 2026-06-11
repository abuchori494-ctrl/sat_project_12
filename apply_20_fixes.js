const fs = require('fs');
let html = fs.readFileSync('question-bank/index.html', 'utf8');

// 1. Sidebar padding
html = html.replace(/padding: 9px 12px;/g, 'padding: 9px 16px;');

// 2. Logo Area
html = html.replace(/#sidebar \.logo-text \{[\s\S]*?\}/, '#sidebar .logo-text { font-size: 20px; font-weight: 900; color: #fff; letter-spacing: -0.03em; font-family: "Inter", sans-serif; }');
html = html.replace(/#sidebar \.logo-icon \{[\s\S]*?\}/, '#sidebar .logo-icon { font-size: 36px; background: rgba(255,255,255,0.1); border-radius: 8px; padding: 4px; }');

// 3. CTA Banner
html = html.replace(/<div class="mb-6 relative flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6/g, '<div class="mb-6 relative flex flex-col sm:flex-row sm:items-center justify-between gap-5 py-5 px-6 overflow-hidden');
html = html.replace(/<div class="absolute left-0 top-0 bottom-0 w-1 bg-\[#8B5CF6\] rounded-l-2xl"><\/div>\n\s*<div class="pl-2">/, '<div class="absolute left-0 top-0 bottom-0 w-1 bg-[#8B5CF6] rounded-l-2xl"></div>\n          <div class="absolute right-[-10px] top-[-10px] text-[100px] font-bold leading-none opacity-[0.04] select-none pointer-events-none">10</div>\n          <div class="pl-2 relative z-10">');
html = html.replace(/<div class="absolute left-0 top-0 bottom-0 w-1 bg-\[#0EA5E9\] rounded-l-2xl"><\/div>\n\s*<div class="pl-2">/, '<div class="absolute left-0 top-0 bottom-0 w-1 bg-[#0EA5E9] rounded-l-2xl"></div>\n          <div class="absolute right-[-10px] top-[-10px] text-[100px] font-bold leading-none opacity-[0.04] select-none pointer-events-none">28</div>\n          <div class="pl-2 relative z-10">');

// 4. Stat cards hover & 17. Focus styles & 19. Card surface shadow & 20. Mobile responsive & 18. Action buttons
const extraCss = `
    .stat-box { transition: border-color 0.15s ease-out; border: 1px solid transparent; }
    .stat-box:hover { border-color: var(--primary-hover); }
    button:focus-visible, a:focus-visible, input:focus-visible, .filter-btn:focus-visible { outline: 2px solid #7F77DD; outline-offset: 2px; }
    .premium-card, .cat-card { box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .sub-action { min-width: 76px; text-align: center; justify-content: center; display: inline-flex; }
    @media (max-width: 600px) {
      #sidebar { display: none; }
      body.sidebar-collapsed #sidebar { display: block; z-index: 999; }
      .views-wrap { margin-left: 0; padding: 16px; }
      .mobile-nav-toggle { display: block !important; }
    }
    .mobile-nav-toggle { display: none; margin-right: 12px; cursor: pointer; color: var(--heading); }
`;
html = html.replace(/<\/style>/, extraCss + '\n  </style>');

// 5. Filter pill active
html = html.replace(/\.filter-btn\.active \{[\s\S]*?\}/, `.filter-btn.active {\n      background: #CECBF6;\n      color: #26215C;\n      border-color: #7F77DD;\n      box-shadow: none;\n    }`);
html = html.replace(/\.filter-btn\.active \.filter-badge \{[\s\S]*?\}/, `.filter-btn.active .filter-badge {\n      background: rgba(255,255,255,0.4);\n      color: #26215C;\n    }`);

// 7. Expand collapse animation
html = html.replace(/\.cat-body \{[\s\S]*?grid-template-rows: 0fr;[\s\S]*?transition: grid-template-rows 250ms ease-out;[\s\S]*?\}/, `.cat-body {\n      max-height: 0;\n      overflow: hidden;\n      transition: max-height 0.25s ease;\n    }`);
html = html.replace(/\.cat-card\.open \.cat-body \{[\s\S]*?grid-template-rows: 1fr;[\s\S]*?\}/, `.cat-card.open .cat-body {\n      max-height: 400px;\n    }`);

// 8. Vertical alignment sub row
html = html.replace(/\.sub-row \{/, '.sub-row {\n      align-items: center;');

// 9. Progress bars thinness
html = html.replace(/\.progress-track \{[\s\S]*?height: 8px; \/\* h-2 \*\/[\s\S]*?\}/, `.progress-track {\n      background: var(--border);\n      border-radius: 9999px;\n      overflow: hidden;\n      height: 6px;\n    }\n    .sub-row .progress-track {\n      height: 5px;\n    }`);

// 10. Badge hierarchy
html = html.replace(/\.status-badge \{[\s\S]*?\}/, `.status-badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 99px; letter-spacing: 0.05em; display: inline-flex; align-items: center; gap: 6px; }`);
html = html.replace(/\.status-not-started \{[\s\S]*?\}/, `.status-not-started { background: transparent; border: 1px solid var(--muted); color: var(--muted); }`);
html = html.replace(/\.status-in-progress \{[\s\S]*?\}/, `.status-in-progress { background: var(--soft-alt); color: var(--primary); }\n    .status-in-progress::before { content: ''; display: block; width: 6px; height: 6px; border-radius: 50%; background: var(--primary); }`);
html = html.replace(/\.status-completed \{[\s\S]*?\}/, `.status-completed { background: #E1F5EE; color: #10B981; }`);

// 11. Empty state filters
const emptyListJS = `
          if (visibleSubs.length === 0) return;
          hasVisible = true;
`;
html = html.replace(/if \(visibleSubs\.length === 0\) return;/, emptyListJS);
html = html.replace(/const searchLower = search\.toLowerCase\(\)\.trim\(\);/g, 'const searchLower = search.toLowerCase().trim();\n        let hasVisible = false;');
html = html.replace(/categories\.forEach\(\(cat, index\) => \{/g, 'categories.forEach((cat, index) => {');
html = html.replace(/container\.appendChild\(catEl\);\n        \}\);/g, `container.appendChild(catEl);\n        });\n        if (!hasVisible) {\n          container.innerHTML = '<div class="text-center py-12"><div class="text-3xl mb-3 opacity-50 text-[#9CA3AF]">⊘</div><p class="text-[#6B7280] font-medium">No skills match this filter.</p></div>';\n        }`);

// 12. "Practice all ->" link styling
html = html.replace(/<button onclick="window\.location\.href='\/exam\.html\?mode=practice&category=\$\{cat\.id\}'" class="btn-outline-gray">/g, '<button onclick="window.location.href=\'/exam.html?mode=practice&category=${cat.id}\'" class="practice-all-link">');
const linkCss = `
    .practice-all-link { font-size: 13px; color: #534AB7; border-bottom: 1px solid transparent; padding: 0 0 2px 0; background: none; border-radius: 0; border: none; font-weight: 600; cursor: pointer; }
    .practice-all-link:hover { border-bottom: 1px solid #534AB7; background: none; transform: none; border-color: #534AB7; }
`;
html = html.replace(/<\/style>/, linkCss + '\n  </style>');

// 13. Sub-skill time estimates
html = html.replace(/~\$\{Math\.round\(s\.total \* 1\.5\)\} min/g, '<span class="time-pill">~${Math.round(s.total * 1.5)} min</span>');
const timePillCss = `
    .time-pill { background: #F3F4F6; padding: 2px 8px; border-radius: 99px; font-size: 11px; }
`;
html = html.replace(/<\/style>/, timePillCss + '\n  </style>');

// 14. Completion checkmark
html = html.replace(/<button class="sub-row \$\{isDone \? 'completed-row' : ''\}/g, '<button class="sub-row ${isDone ? \'completed-row\' : \'\'}');
const compCss = `
    .sub-row.completed-row { background: #E1F5EE; }
    .sub-row.completed-row .sub-name { color: var(--muted); }
`;
html = html.replace(/<\/style>/, compCss + '\n  </style>');
html = html.replace(/<span class="font-semibold text-\[#1E1B4B\]">\$\{s\.label\}<\/span>/g, '<span class="font-semibold text-[#1E1B4B] sub-name">${s.label}</span>');

// 15. Sidebar section labels
html = html.replace(/#sidebar \.nav-links li\.section-label \{[\s\S]*?\}/, '#sidebar .nav-links li.section-label { font-size: 10.5px; font-weight: 800; color: rgba(255, 255, 255, 0.35); letter-spacing: 0.1em; text-transform: uppercase; padding: 16px 12px 6px 14px; }');

// 16. Page title anchor
html = html.replace(/<p class="text-\[13px\] font-bold uppercase tracking-wider mb-1" style="color: var\(--primary\)">Practice<\/p>/, '<p class="text-[13px] font-bold uppercase tracking-wider mb-1" style="color: var(--primary); border-left: 2px solid #7F77DD; padding-left: 8px; border-radius: 0;">Practice</p>');
html = html.replace(/<p class="text-\[13px\] font-bold uppercase tracking-wider mb-1" style="color: #0EA5E9">Practice<\/p>/, '<p class="text-[13px] font-bold uppercase tracking-wider mb-1" style="color: #0EA5E9; border-left: 2px solid #0EA5E9; padding-left: 8px; border-radius: 0;">Practice</p>');

// 18. Sub-skill action buttons logic
html = html.replace(/class="btn-solid-purple"/g, 'class="btn-solid-purple sub-action"');
html = html.replace(/class="btn-outline-gray"/g, 'class="btn-outline-gray sub-action"');

// 20. Mobile hamburger menu html injection
html = html.replace(/<main id="view-overview"/, `<div class="flex items-center mb-4 mobile-nav-toggle" onclick="document.body.classList.toggle('sidebar-collapsed')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </div>\n      <main id="view-overview"`);
html = html.replace(/<main id="view-rw-skills"/, `<div class="flex items-center mb-4 mobile-nav-toggle" onclick="document.body.classList.toggle('sidebar-collapsed')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </div>\n      <main id="view-rw-skills"`);
html = html.replace(/<main id="view-math-skills"/, `<div class="flex items-center mb-4 mobile-nav-toggle" onclick="document.body.classList.toggle('sidebar-collapsed')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </div>\n      <main id="view-math-skills"`);


fs.writeFileSync('question-bank/index.html', html);
console.log('Successfully applied 20 fixes to question-bank/index.html');
