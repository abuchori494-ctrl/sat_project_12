const fs = require('fs');

const htmlPath = 'C:\\Users\\user\\sat_project_12\\past-exams.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Add savedVocabWords variable and the new banners/pills before exams-columns-layout
html = html.replace(/<div class="exams-columns-layout">/, `
        <div id="vocab-empty-banner" style="display: none; background: #FFFBEB; border: 1px solid #FEF3C7; color: #92400E; padding: 12px 20px; border-radius: var(--radius-md); font-size: 13px; margin-bottom: 24px; font-weight: 500;">
          💡 Save words while practicing to build your Vocabulary Bank.
        </div>

        <div id="vocab-empty-pills" class="vocab-compact-row" style="display: none;">
          <div class="vocab-compact-card" style="cursor:pointer;" onclick="alert('Launch Quiz!')">
            <div style="font-size: 24px;">📖</div>
            <div>
              <strong style="color: var(--text-main); font-size: 13.5px;">Daily Challenge</strong>
              <p style="color: var(--text-sub); font-size: 11px; margin: 0;">Learn 3 new words today</p>
            </div>
          </div>
          <div class="vocab-compact-card" style="cursor:pointer;" onclick="alert('Launch Quiz!')">
            <div style="font-size: 24px;">📚</div>
            <div>
              <strong style="color: var(--text-main); font-size: 13.5px;">Vocabulary Quiz</strong>
              <p style="color: var(--text-sub); font-size: 11px; margin: 0;">Flashcards &amp; spaced repetition</p>
            </div>
          </div>
        </div>
      <div class="exams-columns-layout" id="ecl-layout">`);

// 2. Add id to vocab sidebar
html = html.replace(/<!-- COLUMN 3: Vocabulary Bank -->\s*<div class="ecl-column"/, `<!-- COLUMN 3: Vocabulary Bank -->\n        <div class="ecl-column" id="vocab-sidebar"`);

// 3. Update Javascript: add savedVocabWords
html = html.replace(/let currentFilters = \{/, `let savedVocabWords = 0;\n    let currentFilters = {`);

// 4. In renderExams, update layout logic
const renderExamsStart = /function renderExams\(\) \{/;
html = html.replace(renderExamsStart, `function renderExams() {
      // Toggle vocabulary bank visibility
      const sidebar = document.getElementById('vocab-sidebar');
      const emptyBanner = document.getElementById('vocab-empty-banner');
      const emptyPills = document.getElementById('vocab-empty-pills');
      const layout = document.getElementById('ecl-layout');
      
      if (savedVocabWords === 0) {
        if(sidebar) sidebar.style.display = 'none';
        if(emptyBanner) emptyBanner.style.display = 'block';
        if(emptyPills) emptyPills.style.display = 'flex';
        if(layout) layout.style.gridTemplateColumns = '1fr 1fr';
      } else {
        if(sidebar) sidebar.style.display = 'flex';
        if(emptyBanner) emptyBanner.style.display = 'none';
        if(emptyPills) emptyPills.style.display = 'none';
        if(layout) layout.style.gridTemplateColumns = '';
      }`);

// 5. Replace the whole template rendering loop for the exam cards with the updated logic
const startRegex = /\/\/ Practice links[\s\S]*?`\s*;\s*mathList\.insertAdjacentHTML\('beforeend', mathHtml\);\s*\}\);\s*\}\);\s*\}\);/;

const newTemplateLogic = `// Attempted vs Not Started Logic
            let isEbrw1Started = p_ebrw1 > 0 || (userAttempts && userAttempts[examId+'-ebrw1']);
            let isEbrw2Started = p_ebrw2 > 0 || (userAttempts && userAttempts[examId+'-ebrw2']);
            let isMath1Started = p_math1 > 0 || (userAttempts && userAttempts[examId+'-math1']);
            let isMath2Started = p_math2 > 0 || (userAttempts && userAttempts[examId+'-math2']);

            // Practice links
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

            // --- HTML GENERATORS FOR EACH MODULE ---
            
            // EBRW 1
            const ebrw1Badge = isEbrw1Started ? \`<div class="score-badge">\${score_ebrw1}</div>\` : \`<div class="badge-not-started">Not started</div>\`;
            const ebrw1Ring = isEbrw1Started ? \`
                    <div class="progress-ring-box" style="--p:\${p_ebrw1}">
                      <svg viewBox="0 0 36 36" class="pr-svg">
                        <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path class="pr-fill" stroke-dasharray="\${p_ebrw1}, 100" \${p_ebrw1 <= 0 ? 'style="display:none;"' : ''} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span>\${p_ebrw1}%</span>
                    </div>\` : '';
            const ebrw1Btns = isEbrw1Started ? \`
                      <div class="ecl-row-btns" style="margin-top: 12px;">
                        <button class="btn-practice-pill" onclick="window.location.href='\${link_ebrw1}'">▶ PRACTICE</button>
                        <button class="btn-review-pill" \${showReviewEbrw1}>REVIEW</button>
                      </div>\` : \`
                      <button class="btn-practice-pill btn-start-center" onclick="window.location.href='\${link_ebrw1}'">▶ START</button>\`;

            // EBRW 2
            const ebrw2Badge = isEbrw2Started ? \`<div class="score-badge">\${score_ebrw2}</div>\` : \`<div class="badge-not-started">Not started</div>\`;
            const ebrw2Ring = isEbrw2Started ? \`
                    <div class="progress-ring-box" style="--p:\${p_ebrw2}">
                      <svg viewBox="0 0 36 36" class="pr-svg">
                        <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path class="pr-fill" stroke-dasharray="\${p_ebrw2}, 100" \${p_ebrw2 <= 0 ? 'style="display:none;"' : ''} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span>\${p_ebrw2}%</span>
                    </div>\` : '';
            const ebrw2Btns = isEbrw2Started ? \`
                      <div class="ecl-row-btns" style="margin-top: 12px;">
                        <button class="btn-practice-pill" onclick="window.location.href='\${link_ebrw2}'">▶ PRACTICE</button>
                        <button class="btn-review-pill" \${showReviewEbrw2}>REVIEW</button>
                      </div>\` : \`
                      <button class="btn-practice-pill btn-start-center" onclick="window.location.href='\${link_ebrw2}'">▶ START</button>\`;

            // MATH 1
            const math1Badge = isMath1Started ? \`<div class="score-badge">\${score_math1}</div>\` : \`<div class="badge-not-started">Not started</div>\`;
            const math1Ring = isMath1Started ? \`
                    <div class="progress-ring-box math-ring" style="--p:\${p_math1}">
                      <svg viewBox="0 0 36 36" class="pr-svg">
                        <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path class="pr-fill" stroke-dasharray="\${p_math1}, 100" \${p_math1 <= 0 ? 'style="display:none;"' : ''} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span>\${p_math1}%</span>
                    </div>\` : '';
            const math1Btns = isMath1Started ? \`
                      <div class="ecl-row-btns" style="margin-top: 12px;">
                        <button class="btn-practice-pill btn-math" onclick="window.location.href='\${link_math1}'">▶ TRY NOW</button>
                        <button class="btn-review-pill" \${showReviewMath1}>REVIEW</button>
                      </div>\` : \`
                      <button class="btn-practice-pill btn-start-center btn-math" onclick="window.location.href='\${link_math1}'">▶ START</button>\`;

            // MATH 2
            const math2Badge = isMath2Started ? \`<div class="score-badge">\${score_math2}</div>\` : \`<div class="badge-not-started">Not started</div>\`;
            const math2Ring = isMath2Started ? \`
                    <div class="progress-ring-box math-ring" style="--p:\${p_math2}">
                      <svg viewBox="0 0 36 36" class="pr-svg">
                        <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path class="pr-fill" stroke-dasharray="\${p_math2}, 100" \${p_math2 <= 0 ? 'style="display:none;"' : ''} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span>\${p_math2}%</span>
                    </div>\` : '';
            const math2Btns = isMath2Started ? \`
                      <div class="ecl-row-btns" style="margin-top: 12px;">
                        <button class="btn-practice-pill btn-math" \${m2BtnClick}>▶ TRY NOW</button>
                        <button class="btn-review-pill" \${showReviewMath2}>REVIEW</button>
                      </div>\` : \`
                      <button class="btn-practice-pill btn-start-center btn-math" \${m2BtnClick}>▶ START</button>\`;

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
                      \${ebrw1Badge}
                      \${ebrw1Btns}
                    </div>
                    \${ebrw1Ring}
                  </div>
                  
                  <div class="ecl-divider"></div>
                  
                  <div class="ecl-row">
                    <div class="ecl-row-info">
                      <strong>✍️ Writing & Language</strong>
                      <small>32 min • 27 questions</small>
                      \${ebrw2Badge}
                      \${ebrw2Btns}
                    </div>
                    \${ebrw2Ring}
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
                      \${math1Badge}
                      \${math1Btns}
                    </div>
                    \${math1Ring}
                  </div>
                  
                  <div class="ecl-divider"></div>
                  
                  <div class="ecl-row \${m2Class}">
                    <div class="ecl-row-info">
                      <strong>🧩 Module 2</strong>
                      <small>35 min • 22 questions</small>
                      \${math2Badge}
                      \${math2Btns}
                      \${isM2Locked ? \`<div style="display: none; color: #9CA3AF; font-size: 0.78rem; margin-top: 8px;">ℹ️ Complete Module 1 first to unlock adaptive scoring.</div>\` : ''}
                    </div>
                    \${math2Ring}
                  </div>

                </div>
              </article>
            \`;
            mathList.insertAdjacentHTML('beforeend', mathHtml);
          });
        });
      });`;

html = html.replace(startRegex, newTemplateLogic);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML updated');
