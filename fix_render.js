const fs = require('fs');
const path = 'C:/Users/user/sat_project_12/past-exams.html';
let html = fs.readFileSync(path, 'utf8');

// The ring helper – returns clean SVG string
// Used inside template literals so must produce a self-contained string
const newEnglishHtml = `
            // EBRW CARD
            function makeRing(p, colorTrack, colorFill, extraClass) {
              if (p === 0) {
                return '<div class="progress-ring-box' + (extraClass ? ' ' + extraClass : '') + '"><svg width="54" height="54" viewBox="0 0 54 54"><circle cx="27" cy="27" r="22" fill="none" stroke="#e0e0e0" stroke-width="5"/></svg></div>';
              }
              const offset = 138.2 * (1 - p / 100);
              return '<div class="progress-ring-box' + (extraClass ? ' ' + extraClass : '') + '" style="position:relative"><svg width="54" height="54" viewBox="0 0 54 54" style="transform:rotate(-90deg)"><circle cx="27" cy="27" r="22" fill="none" stroke="' + colorTrack + '" stroke-width="5"/><circle cx="27" cy="27" r="22" fill="none" stroke="' + colorFill + '" stroke-width="5" stroke-dasharray="138.2" stroke-dashoffset="' + offset + '" stroke-linecap="round"/></svg><span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:' + colorFill + ';font-size:11px;font-weight:700;">' + p + '%</span></div>';
            }`;

const fnStart = html.indexOf('    function renderExams() {');
const fnEnd = html.lastIndexOf('</script>');

if (fnStart === -1 || fnEnd === -1) {
  console.error('Could not find renderExams bounds!', { fnStart, fnEnd });
  process.exit(1);
}

const before = html.substring(0, fnStart);
const after = html.substring(fnEnd);

const newFn = `    function makeRing(p, colorTrack, colorFill, extraClass) {
      if (p === 0) {
        return '<div class="progress-ring-box' + (extraClass ? ' ' + extraClass : '') + '"><svg width="54" height="54" viewBox="0 0 54 54"><circle cx="27" cy="27" r="22" fill="none" stroke="#e0e0e0" stroke-width="5"/></svg></div>';
      }
      const offset = (138.2 * (1 - p / 100)).toFixed(2);
      return '<div class="progress-ring-box' + (extraClass ? ' ' + extraClass : '') + '" style="position:relative"><svg width="54" height="54" viewBox="0 0 54 54" style="transform:rotate(-90deg)"><circle cx="27" cy="27" r="22" fill="none" stroke="' + colorTrack + '" stroke-width="5"/><circle cx="27" cy="27" r="22" fill="none" stroke="' + colorFill + '" stroke-width="5" stroke-dasharray="138.2" stroke-dashoffset="' + offset + '" stroke-linecap="round"/></svg><span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:' + colorFill + ';font-size:11px;font-weight:700;">' + p + '%</span></div>';
    }

    function scoreBadge(score) {
      if (score.startsWith('0/')) {
        return '<div class="score-badge" style="background:transparent;color:#9CA3AF;">Not started</div>';
      }
      return '<div class="score-badge">' + score + '</div>';
    }

    function reviewBtn(hasAttempt, linkHref, scoreStr) {
      if (hasAttempt) {
        return '<button class="btn-review-pill" onclick="window.location.href=\'' + linkHref + '\'">REVIEW</button>';
      }
      return '<button class="btn-review-pill" disabled style="opacity:0.5;cursor:not-allowed;" title="Complete at least one question to unlock Review">REVIEW</button>';
    }

    function renderExams() {
      const englishList = document.getElementById('english-list');
      const mathList = document.getElementById('math-list');
      const searchQuery = document.getElementById('exam-search').value.toLowerCase();

      englishList.innerHTML = '';
      mathList.innerHTML = '';

      let stats = { exams: 0, versions: 0, sections: 0 };
      let latestExam = null;

      if (!pastExamsData || pastExamsData.length === 0) {
        englishList.innerHTML = '<p style="color:#9CA3AF;padding:24px;text-align:center;">No exams found.</p>';
        mathList.innerHTML = '<p style="color:#9CA3AF;padding:24px;text-align:center;">No exams found.</p>';
        return;
      }

      pastExamsData.forEach(exam => {
        if (!latestExam) latestExam = exam;

        if (!exam.regions) return;

        exam.regions.forEach(region => {
          if (!region.versions) return;

          region.versions.forEach(v => {
            const cardName = \`\${exam.month} \${exam.year} \${region.name}-\${v.name} ebrw english reading writing math\`.toLowerCase();
            if (searchQuery && !cardName.includes(searchQuery)) return;

            stats.exams = pastExamsData.length;
            stats.versions += 1;
            stats.sections += 2;

            const examId = \`\${exam.month.toLowerCase()}-\${exam.year}-\${v.id}\`;

            // Load real attempt data — no fake values
            let p_ebrw1 = 0, p_ebrw2 = 0, p_math1 = 0, p_math2 = 0;
            let score_ebrw1 = '0/27 Correct', score_ebrw2 = '0/27 Correct';
            let score_math1 = '0/22 Correct', score_math2 = '0/22 Correct';

            const a1 = userAttempts[\`\${examId}-ebrw1\`];
            const a2 = userAttempts[\`\${examId}-ebrw2\`];
            const a3 = userAttempts[\`\${examId}-math1\`];
            const a4 = userAttempts[\`\${examId}-math2\`];

            if (a1) { p_ebrw1 = a1.percentage; score_ebrw1 = \`\${a1.score}/\${a1.total} Correct\`; }
            if (a2) { p_ebrw2 = a2.percentage; score_ebrw2 = \`\${a2.score}/\${a2.total} Correct\`; }
            if (a3) { p_math1 = a3.percentage; score_math1 = \`\${a3.score}/\${a3.total} Correct\`; }
            if (a4) { p_math2 = a4.percentage; score_math2 = \`\${a4.score}/\${a4.total} Correct\`; }

            const badgeClass = region.name === 'US' ? 'style="background:var(--blue-glow);color:var(--blue);"' : '';
            const isM2Locked = !a3;

            const link_ebrw1 = \`/past-exams/\${exam.year}/\${exam.month.toLowerCase()}/\${v.id}/ebrw1\`;
            const link_ebrw2 = \`/past-exams/\${exam.year}/\${exam.month.toLowerCase()}/\${v.id}/ebrw2\`;
            const link_math1 = \`/past-exams/\${exam.year}/\${exam.month.toLowerCase()}/\${v.id}/math1\`;
            const link_math2 = \`/past-exams/\${exam.year}/\${exam.month.toLowerCase()}/\${v.id}/math2\`;

            const m2BtnClick = isM2Locked
              ? 'onclick="const msg=this.closest(\\'.ecl-row\\').querySelector(\\'.m2-locked-msg\\');if(msg)msg.style.display=\\'block\\';"'
              : \`onclick="window.location.href='\${link_math2}'"\`;

            // EBRW CARD
            const englishHtml = \`
              <article class="ecl-card ecl-card-english">
                <div class="ecl-card-header" style="border-bottom:1px solid #F0F0F8;padding-bottom:12px;">
                  <div><h4><span class="ecl-card-header-icon">🗓️</span> \${exam.month} \${exam.year} (\${v.name})</h4></div>
                  <span class="ecl-badge official" \${badgeClass}>OFFICIAL</span>
                </div>
                <div class="ecl-card-body">
                  <div class="ecl-bg-illustration">📖</div>
                  <div class="ecl-row">
                    <div class="ecl-row-info">
                      <strong>📖 Module 1</strong>
                      <small>32 min • 27 questions</small>
                      \${scoreBadge(score_ebrw1)}
                      <div class="ecl-row-btns">
                        <button class="btn-practice-pill" onclick="window.location.href='\${link_ebrw1}'">▶ PRACTICE</button>
                        \${reviewBtn(!!a1, link_ebrw1, score_ebrw1)}
                      </div>
                    </div>
                    \${makeRing(p_ebrw1, '#e0e0e0', '#6C63FF', '')}
                  </div>
                  <div class="ecl-row">
                    <div class="ecl-row-info">
                      <strong>✍️ Module 2</strong>
                      <small>32 min • 27 questions</small>
                      \${scoreBadge(score_ebrw2)}
                      <div class="ecl-row-btns">
                        <button class="btn-practice-pill" onclick="window.location.href='\${link_ebrw2}'">▶ PRACTICE</button>
                        \${reviewBtn(!!a2, link_ebrw2, score_ebrw2)}
                      </div>
                    </div>
                    \${makeRing(p_ebrw2, '#e0e0e0', '#6C63FF', '')}
                  </div>
                </div>
              </article>
            \`;
            englishList.insertAdjacentHTML('beforeend', englishHtml);

            // MATH CARD
            const mathHtml = \`
              <article class="ecl-card ecl-card-math">
                <div class="ecl-card-header" style="border-bottom:1px solid #F0F0F8;padding-bottom:12px;">
                  <div><h4><span class="ecl-card-header-icon">🗓️</span> \${exam.month} \${exam.year} (\${v.name})</h4></div>
                  <span class="ecl-badge official btn-math" \${badgeClass}>OFFICIAL</span>
                </div>
                <div class="ecl-card-body">
                  <div class="ecl-bg-illustration math-bg">＋１<br>✕＝</div>
                  <div class="ecl-row">
                    <div class="ecl-row-info">
                      <strong>🧩 Module 1</strong>
                      <small>35 min • 22 questions</small>
                      \${scoreBadge(score_math1)}
                      <div class="ecl-row-btns">
                        <button class="btn-practice-pill btn-math" onclick="window.location.href='\${link_math1}'">▶ PRACTICE</button>
                        \${reviewBtn(!!a3, link_math1, score_math1)}
                      </div>
                    </div>
                    \${makeRing(p_math1, '#e0e0e0', '#6C63FF', 'math-ring')}
                  </div>
                  <div class="ecl-row \${isM2Locked ? 'module-locked' : ''}">
                    <div class="ecl-row-info">
                      <strong>🧩 Module 2</strong>
                      <small>35 min • 22 questions</small>
                      \${scoreBadge(score_math2)}
                      <div class="ecl-row-btns">
                        <button class="btn-practice-pill btn-math" \${m2BtnClick}>▶ PRACTICE</button>
                        \${reviewBtn(!!a4, link_math2, score_math2)}
                      </div>
                      \${isM2Locked ? '<div class="m2-locked-msg" style="display:none;color:#9CA3AF;font-size:0.78rem;margin-top:8px;">ℹ️ Complete Module 1 first to unlock adaptive scoring.</div>' : ''}
                    </div>
                    \${makeRing(p_math2, '#e0e0e0', '#6C63FF', 'math-ring')}
                  </div>
                </div>
              </article>
            \`;
            mathList.insertAdjacentHTML('beforeend', mathHtml);
          });
        });
      });

      // Update Stats
      document.getElementById('stat-exams').innerText = stats.exams;
      document.getElementById('stat-versions').innerText = stats.versions;
      document.getElementById('stat-sections').innerText = stats.sections;

      // Update Latest Highlight
      if (latestExam) {
        document.getElementById('latest-title').innerText = \`🔥 Latest Administration: \${latestExam.month} \${latestExam.year}\`;
      }
    }`;

html = before + newFn + after;
fs.writeFileSync(path, html, 'utf8');
console.log('renderExams rewritten cleanly. Total lines:', html.split('\n').length);
