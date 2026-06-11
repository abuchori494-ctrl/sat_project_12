const fs = require('fs');
let html = fs.readFileSync('question-bank/index.html', 'utf8');

// 0. Tabler icons
if (!html.includes('tabler-icons.min.css')) {
  html = html.replace(/<\/head>/, '  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">\n</head>');
}

// 1. Remove Hamburger Icons
html = html.replace(/<div class="flex items-center mb-4 mobile-nav-toggle"[\s\S]*?<\/div>/g, '');
html = html.replace(/\.mobile-nav-toggle \{ display: none; margin-right: 12px; cursor: pointer; color: var\(--heading\); \}/g, '');
html = html.replace(/\.mobile-nav-toggle \{ display: block !important; \}/g, '');

// 2. Redesign Stat Cards
html = html.replace(/padding: 12px 20px;/g, 'padding: 12px 16px;');
html = html.replace(/padding: 16px 20px;/g, 'padding: 12px 16px;');
html = html.replace(/<p class="text-\[24px\] font-bold text-\[#1E1B4B\]"/g, '<p class="text-[28px] font-medium text-[#1E1B4B]"');
html = html.replace(/<p class="text-\[28px\] font-medium text-\[#1E1B4B\]"/g, '<p class="text-[28px] font-medium text-[#1E1B4B]"');
html = html.replace(/<p class="text-\[11px\] font-medium text-\[#6B7280\]"/g, '<p class="text-[12px] font-medium text-[#6B7280] mt-1"');
html = html.replace(/<div class="absolute top-4 right-4 text-\[#[A-F0-9]+\] opacity-20"><svg[\s\S]*?<\/svg><\/div>/g, '');
html = html.replace(/<div class="w-1 self-stretch rounded-full shrink-0"/g, '<div class="w-[3px] self-stretch rounded-full shrink-0"');
html = html.replace(/<div class="w-\[3px\] self-stretch rounded-full shrink-0"/g, '<div class="w-[3px] self-stretch rounded-full shrink-0"');

// 3. CTA Banner ("Practice all topics")
html = html.replace(/style="background: #3C3489;"/g, 'style="background: #3C3489;"');
html = html.replace(/style="background: linear-gradient\(135deg, #FFFFFF 0%, #F5F3FF 100%\);"/g, 'style="background: #3C3489;"');
html = html.replace(/style="background: linear-gradient\(135deg, #FFFFFF 0%, #F0F9FF 100%\);"/g, 'style="background: #3C3489;"');

html = html.replace(/<h2 class="text-\[18px\] font-bold text-\[#1E1B4B\]">/g, '<h2 class="text-[18px] font-bold text-[#EEEDFE]">');
html = html.replace(/<p class="text-\[14px\] text-\[#6B7280\] mt-1 font-medium">/g, '<p class="text-[14px] text-[#AFA9EC] mt-1 font-medium">');

html = html.replace(/class="btn-primary shrink-0 w-full sm:w-auto" style="background: #8B5CF6;"/g, 'class="shrink-0 w-full sm:w-auto banner-btn"');
html = html.replace(/class="btn-primary shrink-0 w-full sm:w-auto" style="background: #0EA5E9;"/g, 'class="shrink-0 w-full sm:w-auto banner-btn"');

html = html.replace(/<div class="absolute right-\[-10px\] top-\[-10px\] text-\[72px\] font-bold leading-none opacity-\[0\.07\] text-white select-none pointer-events-none">10<\/div>/g, '<div class="absolute right-[0px] top-[-10px] text-[72px] font-bold leading-none opacity-[0.07] text-white select-none pointer-events-none z-0">10</div>');
html = html.replace(/<div class="absolute right-\[-10px\] top-\[-10px\] text-\[72px\] font-bold leading-none opacity-\[0\.07\] text-white select-none pointer-events-none">28<\/div>/g, '<div class="absolute right-[0px] top-[-10px] text-[72px] font-bold leading-none opacity-[0.07] text-white select-none pointer-events-none z-0">28</div>');

if (!html.includes('.banner-btn {')) {
  const bannerCss = `
    .banner-btn { background: #7F77DD; color: #EEEDFE; border: none; padding: 9px 20px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.2s; position: relative; z-index: 10; }
    .banner-btn:hover { background: #6B57E8; }
`;
  html = html.replace(/<\/style>/, bannerCss + '\n  </style>');
}

// 4. Sidebar Nav Icons
html = html.replace(/🏠 Home/g, '<i class="ti ti-home"></i> Home');
html = html.replace(/📅 Study Planner/g, '<i class="ti ti-calendar"></i> Study Planner');
html = html.replace(/📊 Analytics/g, '<i class="ti ti-chart-bar"></i> Analytics');
html = html.replace(/🤖 Ask Preppy AI/g, '<i class="ti ti-robot"></i> Ask Preppy AI');
html = html.replace(/🔲 Question Bank/g, '<i class="ti ti-books"></i> Question Bank');
html = html.replace(/📝 Past Exams/g, '<i class="ti ti-file-text"></i> Past Exams');
html = html.replace(/🎯 Real Exam Mode/g, '<i class="ti ti-clock"></i> Real Exam Mode');

// 5. Typography Hierarchy
html = html.replace(/<h2 class="text-\[16px\] font-bold/g, '<h2 class="text-[15px] font-medium');
html = html.replace(/<p class="text-\[13px\] text-\[#6B7280\] mt-1">/g, '<p class="text-[12px] text-[var(--muted)] font-normal mt-1">');
html = html.replace(/<span class="font-semibold text-\[#1E1B4B\] sub-name">/g, '<span class="text-[13px] font-normal text-[var(--heading)] sub-name">');

// 6. Sub-skill Indentation
html = html.replace(/<button class="sub-row group/g, '<button class="sub-row group pl-5 ml-5" style="border-left: 2px solid var(--border);"');
html = html.replace(/<button class="sub-row group pl-5 ml-5" style="border-left: 2px solid var\(--border\);" pl-5 ml-5" style="border-left: 2px solid var\(--border\);"/g, '<button class="sub-row group pl-5 ml-5" style="border-left: 2px solid var(--border);"');

// 7. Progress Bar layout (Category level)
const newProgressHtml = `<div class="mt-2 flex items-center gap-3">
                  <div class="h-1.5 w-[140px] shrink-0 bg-[#E8EAF2] rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" style="width: \${catPct}%; background: \${cat.accentHex}"></div>
                  </div>
                  <span class="text-[12px] font-medium" style="color: \${catPct === 0 ? 'var(--muted)' : cat.accentHex}">\${catCompleted} of \${catTotal} done · \${catPct}%</span>
                </div>`;
html = html.replace(/<div class="mt-2 flex items-center gap-3">[\s\S]*?<p class="text-\[12px\] font-bold text-\[#4B5563\] w-\[40px\]">\$\{catCompleted\} \/ \$\{catTotal\}<\/p>[\s\S]*?<div class="h-1\.5 flex-1 bg-\[#E8EAF2\] rounded-full overflow-hidden">[\s\S]*?<div class="h-full rounded-full transition-all duration-500" style="width: \$\{catPct\}%; background: \$\{cat\.accentHex\}"><\/div>[\s\S]*?<\/div>[\s\S]*?<span class="text-\[11px\] font-bold" style="color: \$\{cat\.accentHex\}">\$\{catPct\}%<\/span>[\s\S]*?<\/div>/g, newProgressHtml);

// 8. NOT STARTED badges
html = html.replace(/\.status-not-started \{ background: transparent; border: 1px solid var\(--muted\); color: var\(--muted\); \}/, '.status-not-started { background: transparent; border: none; color: var(--muted); font-weight: 400; padding: 0; font-size: 12px; }');
html = html.replace(/\.status-in-progress \{ background: var\(--soft-alt\); color: var\(--primary\); \}/, '.status-in-progress { background: #EEEDFE; color: #3C3489; font-size: 11px; padding: 3px 10px; border-radius: 99px; }');
html = html.replace(/\.status-completed \{ background: #E1F5EE; color: #10B981; \}/, '.status-completed { background: #E1F5EE; color: #085041; font-size: 11px; padding: 3px 10px; border-radius: 99px; }');

// 9. Card Elevation
html = html.replace(/\.premium-card, \.cat-card \{ box-shadow: 0 1px 3px rgba\(0,0,0,0\.06\); \}/, '.premium-card, .cat-card { box-shadow: 0 1px 0 rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.06); }');

// 10. Sub-action width
html = html.replace(/\.sub-action \{ min-width: 76px;/, '.sub-action { min-width: 80px;');

// 11. Time pills
html = html.replace(/\.time-pill \{ background: #F3F4F6; padding: 2px 8px; border-radius: 99px; font-size: 11px; \}/, '.time-pill { background: var(--surface); border: 0.5px solid var(--border); border-radius: 99px; padding: 2px 8px; font-size: 11px; color: var(--muted); }');

// 12. Filter pills
html = html.replace(/\.filter-btn\.active \{\s*background: #CECBF6;\s*color: #26215C;\s*border-color: #7F77DD;\s*box-shadow: none;\s*\}/, '.filter-btn.active { background: #CECBF6; color: #26215C; border: 0.5px solid #7F77DD; font-weight: 500; box-shadow: none; }');
html = html.replace(/\.filter-btn \{/g, '.filter-btn { border: 0.5px solid var(--border);');

// 13. Hover States
html = html.replace(/\.cat-card:hover \{ border-color: var\(--border\); transition: border-color 0\.15s; \}/g, '');
const cardHoverCss = `.cat-card:hover { border-color: var(--border); transition: border-color 0.15s; }`;
html = html.replace(/<\/style>/, cardHoverCss + '\n  </style>');

// 14. Real Empty State
html = html.replace(/<div class="text-center py-12"><i class="ti ti-circle-dashed text-\[28px\] text-\[var\(--muted\)\] mb-3 inline-block"><\/i><p class="text-\[14px\] text-\[#6B7280\] font-medium">No skills match this filter\.<\/p><p class="text-\[12px\] text-\[#9CA3AF\]">Try 'All' to see everything<\/p><\/div>/g, '<div class="text-center py-12"><i class="ti ti-circle-dashed text-[28px] text-[var(--muted)] mb-3 inline-block"></i><p class="text-[14px] text-[#6B7280] font-medium">No skills match this filter.</p><p class="text-[12px] text-[#9CA3AF]">Try \\\'All\\\' to see everything</p></div>');
html = html.replace(/<div class="text-center py-12"><div class="text-3xl mb-3 opacity-50 text-\[#9CA3AF\]">⊘<\/div><p class="text-\[#6B7280\] font-medium">No skills match this filter\.<\/p><\/div>/g, '<div class="text-center py-12"><i class="ti ti-circle-dashed text-[28px] text-[var(--muted)] mb-3 inline-block"></i><p class="text-[14px] text-[#6B7280] font-medium">No skills match this filter.</p><p class="text-[12px] text-[#9CA3AF]">Try \\\'All\\\' to see everything</p></div>');

// 15. Functional Search Input & Clear
html = html.replace(/<input type="text" id="rw-search" class="search-input" placeholder="Search skills\.\.\." oninput="debounceSearch\('rw'\)" \/>/g, '<div class="relative w-full"><input type="text" id="rw-search" class="search-input pr-8" placeholder="Search skills..." oninput="debounceSearch(\'rw\')" /><button id="rw-search-clear" onclick="clearSearch(\'rw\')" class="absolute right-0 top-1/2 -translate-y-1/2 text-[#9CA3AF] hidden"><i class="ti ti-x"></i></button></div>');
html = html.replace(/<input type="text" id="math-search" class="search-input" placeholder="Search skills\.\.\." oninput="debounceSearch\('math'\)" \/>/g, '<div class="relative w-full"><input type="text" id="math-search" class="search-input pr-8" placeholder="Search skills..." oninput="debounceSearch(\'math\')" /><button id="math-search-clear" onclick="clearSearch(\'math\')" class="absolute right-0 top-1/2 -translate-y-1/2 text-[#9CA3AF] hidden"><i class="ti ti-x"></i></button></div>');

if (!html.includes('function clearSearch')) {
  const searchJS = `
    function clearSearch(type) {
      document.getElementById(type + '-search').value = '';
      document.getElementById(type + '-search-clear').style.display = 'none';
      debounceSearch(type);
    }
  `;
  html = html.replace(/function debounceSearch/, searchJS + '\n    function debounceSearch');
}

// Ensure clear button toggles properly inside debounceSearch
if (!html.includes('const clearBtn = document.getElementById(`${type}-search-clear`);')) {
  html = html.replace(/const searchLower = search\.toLowerCase\(\)\.trim\(\);/, 'const searchLower = search.toLowerCase().trim();\n        const clearBtn = document.getElementById(`${type}-search-clear`);\n        if(clearBtn) clearBtn.style.display = search.length > 0 ? "block" : "none";');
}

// 18. Fully Completed
html = html.replace(/ctaHtml = `<button class="btn-outline-gray sub-action">Review →<\/button>`;/g, 'ctaHtml = `<button class="btn-outline-gray sub-action" style="background: #E1F5EE; color: #085041; border: 0.5px solid #5DCAA5;">Review →</button>`;');

fs.writeFileSync('question-bank/index.html', html);
console.log('Successfully applied 20 fixes v2');
