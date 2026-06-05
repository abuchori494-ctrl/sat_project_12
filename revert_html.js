const fs = require('fs');

const htmlPath = 'C:\\Users\\user\\sat_project_12\\past-exams.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Remove savedVocabWords variable
html = html.replace(/let savedVocabWords = 0;\s*let currentFilters = \{/, `let currentFilters = {`);

// 2. Remove the banners and pills before exams-columns-layout, and remove the id
const bannerRegex = /<div id="vocab-empty-banner"[\s\S]*?<div class="exams-columns-layout" id="ecl-layout">/;
html = html.replace(bannerRegex, `<div class="exams-columns-layout">`);

// 3. Remove id from vocab sidebar
html = html.replace(/<!-- COLUMN 3: Vocabulary Bank -->\s*<div class="ecl-column" id="vocab-sidebar"/, `<!-- COLUMN 3: Vocabulary Bank -->\n        <div class="ecl-column"`);

// 4. In renderExams, remove layout logic
const renderExamsRegex = /function renderExams\(\) \{\s*\/\/\s*Toggle vocabulary bank visibility[\s\S]*?if\(layout\) layout\.style\.gridTemplateColumns = '';\s*\}/;
html = html.replace(renderExamsRegex, `function renderExams() {`);

// 5. Replace the whole template rendering loop with the old one
const startRegex = /\/\/ Attempted vs Not Started Logic[\s\S]*?`\s*;\s*mathList\.insertAdjacentHTML\('beforeend', mathHtml\);\s*\}\);\s*\}\);\s*\}\);/;

const oldTemplateLogic = `// Practice links
            const link_ebrw1 = \`/past-exams/\${exam.year}/\${exam.month.toLowerCase()}/\${v.id}/ebrw1\`;
            const link_ebrw2 = \`/past-exams/\${exam.year}/\${exam.month.toLowerCase()}/\${v.id}/ebrw2\`;
            const link_math1 = \`/past-exams/\${exam.year}/\${exam.month.toLowerCase()}/\${v.id}/math1\`;
            const link_math2 = \`/past-exams/\${exam.year}/\${exam.month.toLowerCase()}/\${v.id}/math2\`;
            
            const m2BtnClick = isM2Locked ? \`onclick="const msg = this.parentElement.nextElementSibling; if(msg) msg.style.display='block';"\` : \`onclick="window.location.href='\${link_math2}'"\`;

            // Review button configurations
            let showReviewEbrw1 = "";
            let showReviewEbrw2 = "";
            let showReviewMath1 = "";
            let showReviewMath2 = "";
            
            if (examId === 'march-2026-int-a') {
              showReviewEbrw1 = userAttempts && userAttempts['march-2026-int-a-ebrw1'] ? \`onclick="window.location.href='\${link_ebrw1}'"\` : \`disabled style="opacity: 0.5; cursor: not-allowed;"\`;
              showReviewEbrw2 = userAttempts && userAttempts['march-2026-int-a-ebrw2'] ? \`onclick="window.location.href='\${link_ebrw2}'"\` : \`disabled style="opacity: 0.5; cursor: not-allowed;"\`;
              showReviewMath1 = userAttempts && userAttempts['march-2026-int-a-math1'] ? \`onclick="window.location.href='\${link_math1}'"\` : \`disabled style="opacity: 0.5; cursor: not-allowed;"\`;
              showReviewMath2 = userAttempts && userAttempts['march-2026-int-a-math2'] ? \`onclick="window.location.href='\${link_math2}'"\` : \`disabled style="opacity: 0.5; cursor: not-allowed;"\`;
            } else {
              showReviewEbrw1 = \`onclick="window.location.href='\${link_ebrw1}'"\`;
              showReviewEbrw2 = \`onclick="window.location.href='\${link_ebrw2}'"\`;
              showReviewMath1 = \`onclick="window.location.href='\${link_math1}'"\`;
              showReviewMath2 = isM2Locked ? \`disabled style="opacity: 0.5; cursor: not-allowed;"\` : \`onclick="window.location.href='\${link_math2}'"\`;
            }

            // EBRW CARD
            const englishHtml = \`
              <article class="ecl-card ecl-card-english">
                <div class="ecl-card-header">
                  <div>
                    <h4>🗓️ \${exam.month} \${exam.year} (\${v.name})</h4>
                  </div>
                  <span class="ecl-badge official" \${badgeClass}>OFFICIAL</span>
                </div>
                
                <div class="ecl-card-body">
                  <div class="ecl-bg-illustration">📖</div>
                  
                  <div class="ecl-row">
                    <div class="ecl-row-info">
                      <strong>📖 Reading Comprehension</strong>
                      <small>32 min • 27 questions</small>
                      <div class="score-badge">\${score_ebrw1}</div>
                      <div class="ecl-row-btns" style="margin-top: 12px;">
                        <button class="btn-practice-pill" onclick="window.location.href='\${link_ebrw1}'">▶ PRACTICE</button>
                        <button class="btn-review-pill" \${showReviewEbrw1}>REVIEW</button>
                      </div>
                    </div>
                    <div class="progress-ring-box" style="--p:\${p_ebrw1}">
                      <svg viewBox="0 0 36 36" class="pr-svg">
                        <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path class="pr-fill" stroke-dasharray="\${p_ebrw1}, 100" \${p_ebrw1 <= 0 ? 'style="display:none;"' : ''} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span>\${p_ebrw1}%</span>
                    </div>
                  </div>
                  
                  <div class="ecl-divider"></div>
                  
                  <div class="ecl-row">
                    <div class="ecl-row-info">
                      <strong>✍️ Writing & Language</strong>
                      <small>32 min • 27 questions</small>
                      <div class="score-badge">\${score_ebrw2}</div>
                      <div class="ecl-row-btns" style="margin-top: 12px;">
                        <button class="btn-practice-pill" onclick="window.location.href='\${link_ebrw2}'">▶ PRACTICE</button>
                        <button class="btn-review-pill" \${showReviewEbrw2}>REVIEW</button>
                      </div>
                    </div>
                    <div class="progress-ring-box" style="--p:\${p_ebrw2}">
                      <svg viewBox="0 0 36 36" class="pr-svg">
                        <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path class="pr-fill" stroke-dasharray="\${p_ebrw2}, 100" \${p_ebrw2 <= 0 ? 'style="display:none;"' : ''} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span>\${p_ebrw2}%</span>
                    </div>
                  </div>
                </div>
              </article>
            \`;
            englishList.insertAdjacentHTML('beforeend', englishHtml);

            // MATH CARD
            const mathHtml = \`
              <article class="ecl-card ecl-card-english">
                <div class="ecl-card-header">
                  <div>
                    <h4>🗓️ \${exam.month} \${exam.year} (\${v.name})</h4>
                  </div>
                  <span class="ecl-badge official btn-math" \${badgeClass}>OFFICIAL</span>
                </div>
                
                <div class="ecl-card-body">
                  
                  <div class="ecl-row">
                    <div class="ecl-row-info">
                      <strong>🧩 Module 1</strong>
                      <small>35 min • 22 questions</small>
                      <div class="score-badge">\${score_math1}</div>
                      <div class="ecl-row-btns" style="margin-top: 12px;">
                        <button class="btn-practice-pill btn-math" onclick="window.location.href='\${link_math1}'">▶ TRY NOW</button>
                        <button class="btn-review-pill" \${showReviewMath1}>REVIEW</button>
                      </div>
                    </div>
                    <div class="progress-ring-box math-ring" style="--p:\${p_math1}">
                      <svg viewBox="0 0 36 36" class="pr-svg">
                        <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path class="pr-fill" stroke-dasharray="\${p_math1}, 100" \${p_math1 <= 0 ? 'style="display:none;"' : ''} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span>\${p_math1}%</span>
                    </div>
                  </div>
                  
                  <div class="ecl-divider"></div>
                  
                  <div class="ecl-row \${m2Class}">
                    <div class="ecl-row-info">
                      <strong>🧩 Module 2</strong>
                      <small>35 min • 22 questions</small>
                      <div class="score-badge">\${score_math2}</div>
                      <div class="ecl-row-btns" style="margin-top: 12px;">
                        <button class="btn-practice-pill btn-math" \${m2BtnClick}>▶ TRY NOW</button>
                        <button class="btn-review-pill" \${showReviewMath2}>REVIEW</button>
                      </div>
                      \${isM2Locked ? \`<div style="display: none; color: #9CA3AF; font-size: 0.78rem; margin-top: 8px;">ℹ️ Complete Module 1 first to unlock adaptive scoring.</div>\` : ''}
                    </div>
                    <div class="progress-ring-box math-ring" style="--p:\${p_math2}">
                      <svg viewBox="0 0 36 36" class="pr-svg">
                        <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path class="pr-fill" stroke-dasharray="\${p_math2}, 100" \${p_math2 <= 0 ? 'style="display:none;"' : ''} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span>\${p_math2}%</span>
                    </div>
                  </div>

                </div>
              </article>
            \`;
            mathList.insertAdjacentHTML('beforeend', mathHtml);
          });
        });
      });`;

html = html.replace(startRegex, oldTemplateLogic);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML Reverted');
