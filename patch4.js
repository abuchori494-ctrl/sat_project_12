const fs = require('fs');

const filePath = 'c:\\Users\\user\\sat_project_12\\study-planner.html';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Geometry fix in JS renderDailyAgenda
content = content.replace(
    /justify-content: space-between;/g,
    'gap: 10px;'
);
content = content.replace(
    /<h4 style="margin: 0; font-size: 13px; font-weight: 500;/g,
    '<h4 style="margin: 0; font-size: 13px; font-weight: 500; flex: 1; min-width: 0;'
);
content = content.replace(
    /<span class="da-pill" style="font-size: 11px; font-weight: 500; color: #94A3B8; white-space: nowrap;">/g,
    '<span class="da-pill" style="white-space: nowrap; flex-shrink: 0; font-size: 12px; color: var(--color-text-secondary);">'
);

// Do the same for static HTML
content = content.replace(
    /<span class="da-pill">(\d+ Questions)<\/span>\s*<span class="da-pill">(~.*?m|~.*?min)<\/span>/g,
    '<span class="da-pill" style="white-space: nowrap; flex-shrink: 0; font-size: 12px; color: var(--color-text-secondary);">$1 &middot; $2</span>'
);
content = content.replace(
    /<h4>(.*?)<\/h4>/g,
    '<h4 style="font-size: 13px; flex: 1; min-width: 0; margin: 0;">$1</h4>'
);

// 2. Agenda card width 42% -> 45%
content = content.replace(
    /flex: 0 0 42%;/g,
    'flex: 0 0 45%;'
);

// 3. SAT date card & Grid template columns
content = content.replace(
    /grid-template-columns: 2fr 1fr 1fr 1fr;/g,
    'grid-template-columns: 2fr 1.2fr 1fr 1fr;'
);
content = content.replace(
    /<!-- Card 2: Diagnostic Timeline -->\s*<div class="sp-stat-card" style="/g,
    '<!-- Card 2: Diagnostic Timeline -->\n            <div class="sp-stat-card" style="white-space: nowrap; min-width: 170px; '
);

// 4. Target + Latest merge
let targetLatestRegex = /<!-- Merged Target\+Latest Card -->[\s\S]*?<!-- Card 2: Diagnostic Timeline -->/;
let newTargetLatest = `<!-- Merged Target+Latest Card -->
            <div style="display:flex;flex-direction:row;background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);overflow:hidden">
                <div style="flex:1;padding:18px 20px;display:flex;flex-direction:column;justify-content:center;gap:4px">
                    <div style="display:flex;align-items:center;gap:4px">
                        <span style="font-size:16px">🎯</span>
                        <span style="font-size:12px;font-weight:700;color:var(--lav-gray);letter-spacing:0.05em">Target</span>
                    </div>
                    <div id="dash-goal-score" style="font-size:32px;font-weight:800;color:var(--lav-dark);line-height:1;letter-spacing:-0.02em">1500</div>
                    <div style="font-size:12px;color:var(--color-text-secondary);font-weight:400;margin-top:2px">Math: 800 | R&W: 700</div>
                    <style>.no-underline-goal, .no-underline-goal:hover, .no-underline-goal:focus, .no-underline-goal:visited { text-decoration: none !important; }</style>
                    <a href="#" class="no-underline-goal" style="text-decoration:none!important;color:var(--color-purple-primary,#7C6FE0);font-size:13px;font-weight:500;cursor:pointer;margin-top:2px">Set goal &rarr;</a>
                </div>
                <div style="width:0.5px;background:var(--color-border-tertiary);margin:14px 0"></div>
                <div style="flex:1;padding:18px 20px;display:flex;flex-direction:column;justify-content:center;gap:4px">
                    <div style="display:flex;align-items:center;gap:4px">
                        <span style="font-size:16px">📈</span>
                        <span style="font-size:12px;font-weight:700;color:var(--lav-gray);letter-spacing:0.05em">Latest</span>
                    </div>
                    <div id="stat-latest-has-score" style="display:block">
                        <div style="font-size:32px;font-weight:800;color:var(--color-purple-primary,#7C6FE0);line-height:1;letter-spacing:-0.02em">1240</div>
                        <div style="font-size:12px;color:var(--color-text-secondary);font-weight:400;margin-top:2px">Math: 620 | R&W: 620</div>
                    </div>
                    <div id="stat-latest-empty" style="display:none">
                        <div style="font-size:11px;color:var(--lav-dark);line-height:1.3">One exam away from knowing your baseline.</div>
                        <div style="font-size:11px;color:var(--lav-gray)">No practice yet</div>
                    </div>
                </div>
            </div>

            <!-- Card 2: Diagnostic Timeline -->`;
content = content.replace(targetLatestRegex, newTargetLatest);

// 5 & 6. Weekly table: left borders & text wrapping
const tbodyStart = content.indexOf('<tbody>');
const tbodyEnd = content.indexOf('</tbody>', tbodyStart);
let tbodyContent = content.substring(tbodyStart, tbodyEnd);

tbodyContent = tbodyContent.replace(/<tr>[\s\S]*?<\/tr>/g, (tr) => {
    let border = '';
    if (/Heart of Algebra|Geometry|Mock Exam|Advanced Math|Full Math/.test(tr)) {
        border = '#378ADD';
    } else if (/Command of Evidence|Rhetorical Synthesis|Reading Comp|Full R&W/.test(tr)) {
        border = '#7F77DD';
    } else if (/Daily Vocabulary/.test(tr)) {
        border = '#1D9E75';
    }

    // Process tds
    let tds = tr.split(/(<td[^>]*>[\s\S]*?<\/td>)/g);
    for (let i = 1; i < tds.length; i += 2) {
        let td = tds[i];
        
        // Add border-left
        if (border) {
            td = td.replace(/style="([^"]*)"/, `style="$1 border-left: 4px solid ${border} !important;"`);
        }
        
        // Add text wrapping to the inner div
        td = td.replace(/<div>/g, '<div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">');

        // 7. Restore full color for Fri remaining tasks
        // Fri is the second column (index 3 in the split array)
        if (i === 3) {
            if (/Rhetorical Synthesis|Daily Vocab/i.test(td)) {
                td = td.replace(/color:\s*var\(--color-text-secondary[^;]*\);?/g, 'color: var(--color-text-primary, var(--lav-dark));');
                td = td.replace(/text-decoration:\s*line-through;?/g, '');
            }
        }
        
        tds[i] = td;
    }
    return tds.join('');
});

content = content.substring(0, tbodyStart) + tbodyContent + content.substring(tbodyEnd);

// 8. Equal card heights
content = content.replace(
    /align-items:\s*stretch;/g,
    'align-items: stretch !important;'
);
content = content.replace(
    /class="sp-tasks-col"\s*style="([^"]*)"/g,
    'class="sp-tasks-col" style="$1 display: flex !important; flex-direction: column !important; height: 100% !important;"'
);
content = content.replace(
    /class="sp-table-col"\s*style="([^"]*)"/g,
    'class="sp-table-col" style="$1 display: flex !important; flex-direction: column !important; height: 100% !important;"'
);
content = content.replace(
    /class="sp-table-card"\s*style="([^"]*)"/g,
    'class="sp-table-card" style="$1 display: flex !important; flex-direction: column !important; height: 100% !important;"'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Patched 8 issues successfully.");
