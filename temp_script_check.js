
    let currentFilters = {
      year: 'all',
      region: 'all',
      status: 'all'
    };
    
    let currentPage = 1;
    let totalPages = 1;

    async function fetchExams() {
      // Show loading state
      const englishList = document.getElementById('english-list');
      const mathList = document.getElementById('math-list');
      if (englishList) englishList.innerHTML = '<p style="color:#9CA3AF;padding:24px;text-align:center;font-size:13px;">Loading exams…</p>';
      if (mathList) mathList.innerHTML = '<p style="color:#9CA3AF;padding:24px;text-align:center;font-size:13px;">Loading exams…</p>';

      try {
        const token = localStorage.getItem('jwt_token') || '';
        const params = new URLSearchParams({
          page: currentPage,
          limit: 10,
          year: currentFilters.year,
          region: currentFilters.region,
          status: currentFilters.status
        });
        
        const examsRes = await fetch('/api/exams?' + params.toString(), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (examsRes.ok) {
          const resJson = await examsRes.json();
          pastExamsData = resJson.data || [];
          totalPages = resJson.totalPages || 1;
          
          document.getElementById('page-indicator').textContent = `Page ${currentPage} of ${totalPages}`;
          document.getElementById('prev-page-btn').disabled = currentPage <= 1;
          document.getElementById('next-page-btn').disabled = currentPage >= totalPages;
        } else {
          console.error('Exams API returned', examsRes.status);
        }
      } catch (err) {
        console.error("Failed to fetch exams", err);
        if (englishList) englishList.innerHTML = '<p style="color:#EF4444;padding:24px;text-align:center;font-size:13px;">Could not load exams — check your connection.</p>';
        if (mathList) mathList.innerHTML = '';
        return;
      }

      renderExams();
    }

    function setFilter(type, val) {
      currentFilters[type] = val;
      currentPage = 1; // reset to first page on filter change
      fetchExams();
    }
    
    function changePage(delta) {
      const newPage = currentPage + delta;
      if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        fetchExams();
      }
    }

    function toggleTheme() {
      const isDark = document.body.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';
      document.body.className = newTheme;
      localStorage.setItem('oneprep_theme', newTheme);
    }

    let userAttempts = {};
    let pastExamsData = [];

    // Sync theme on load
    document.addEventListener('DOMContentLoaded', async () => {
      const savedTheme = localStorage.getItem('oneprep_theme') || 'light';
      document.body.className = savedTheme;
      try {
        const authRes = await fetch('/api/auth/mock-login', { method: 'POST' });
        const authData = await authRes.json();
        const token = authData.token;
        localStorage.setItem('jwt_token', token);

        const attemptsRes = await fetch('/api/exams/attempts', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (attemptsRes.ok) {
          const attemptsArray = await attemptsRes.json();
          attemptsArray.forEach(a => {
            userAttempts[`${a.examId}-${a.moduleId}`] = {
              score: a.correct,
              total: a.total,
              percentage: a.percentage
            };
          });
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
      
      // Fetch initial paginated data
      await fetchExams();
    });

    // STATE 1 = not started (attempt===undefined)
    // STATE 2 = in progress (attempt exists but no .percentage — future use)
    // STATE 3 = completed (attempt exists with percentage > 0)

    function moduleRing(attempt) {
      // STATE 1 — no attempt at all
      if (!attempt) {
        return [
          '<div class="mod-ring-wrap">',
          '<svg width="52" height="52" viewBox="0 0 52 52">',
          '<circle cx="26" cy="26" r="20" fill="none" stroke="#D1D5DB" stroke-width="4"/>',
          '</svg>',
          '</div>'
        ].join('');
      }
      // STATE 2 or 3 — has attempt
      var p = attempt.percentage || 0;
      var r = 20;
      var c = 125.6;
      var offset = (c - (p / 100 * c)).toFixed(2);
      // Determine state based on percentage
      var isInProgress = p > 0 && p < 100;
      var arcColor = isInProgress ? '#F59E0B' : '#0D9488';
      return [
        '<div class="mod-ring-wrap" style="position:relative">',
        '<svg width="52" height="52" viewBox="0 0 52 52">',
        '<circle cx="26" cy="26" r="20" fill="none" stroke="#D1D5DB" stroke-width="4"/>',
        '<circle cx="26" cy="26" r="' + r + '" fill="none" stroke="' + arcColor + '" stroke-width="4"',
        ' stroke-dasharray="' + c + '" stroke-dashoffset="' + offset + '"',
        ' stroke-linecap="round" transform="rotate(-90 26 26)"/>',
        '<text x="26" y="30" text-anchor="middle" font-size="12" font-weight="600" fill="#111827">' + p + '%</text>',
        '</svg>',
        '</div>'
      ].join('');
    }

    function moduleStatusText(attempt, totalLabel) {
      if (!attempt) {
        // STATE 1 - Not started
        return '<div style="font-size:16px;font-weight:400;color:#D1D5DB;margin-bottom:8px;">Not started</div>';
      }
      // STATE 2 - In progress (has attempt but percentage < 100)
      if (attempt.percentage < 100) {
        return '<div style="font-size:16px;font-weight:500;color:#F59E0B;margin-bottom:8px;">In progress</div>';
      }
      // STATE 3 - Completed
      var scoreText = attempt.score + '/' + attempt.total + ' Correct';
      return '<div style="font-size:18px;font-weight:600;color:#111827;margin-bottom:8px;">' + scoreText + '</div>';
    }

    function moduleBorderStyle(attempt) {
      if (!attempt) {
        // Not started
        return 'border-left:3px solid #E5E7EB;padding-left:10px;';
      }
      // In progress
      if (attempt.percentage < 100) {
        return 'border-left:3px solid #F59E0B;padding-left:10px;';
      }
      // Completed
      return 'border-left:3px solid #0D9488;padding-left:10px;';
    }

    function practiceBtn(link, isMath) {
      var cls = isMath ? 'btn-practice-pill btn-math' : 'btn-practice-pill';
      return '<button class="' + cls + '" data-href="' + link + '" onclick="window.location.href=this.dataset.href">▶ PRACTICE</button>';
    }

    function reviewBtn(attempt, link) {
      if (attempt) {
        return '<button class="btn-review-pill btn-review-enabled" data-href="' + link + '" onclick="window.location.href=this.dataset.href">REVIEW</button>';
      }
      return '<button class="btn-review-pill btn-review-disabled" disabled title="Complete the module to unlock Review">REVIEW</button>';
    }

    function moduleRow(attempt, label, timeStr, practiceLink, isMath) {
      return [
        '<div class="ecl-row">',
          '<div class="ecl-row-info" style="' + moduleBorderStyle(attempt) + '">',
            '<strong>' + label + '</strong>',
            '<small>' + timeStr + '</small>',
            moduleStatusText(attempt),
            '<div class="ecl-row-btns">',
              practiceBtn(practiceLink, isMath),
              reviewBtn(attempt, practiceLink),
            '</div>',
          '</div>',
          moduleRing(attempt),
        '</div>'
      ].join('');
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
            const cardName = `${exam.month} ${exam.year} ${region.name}-${v.name} ebrw english reading writing math`.toLowerCase();
            if (searchQuery && !cardName.includes(searchQuery)) return;

            stats.exams = pastExamsData.length;
            stats.versions += 1;
            stats.sections += 2;

            const examId = `${exam.month.toLowerCase()}-${exam.year}-${v.id}`;

            // Load real attempt data — no fake values
            let p_ebrw1 = 0, p_ebrw2 = 0, p_math1 = 0, p_math2 = 0;
            let score_ebrw1 = '0/27 Correct', score_ebrw2 = '0/27 Correct';
            let score_math1 = '0/22 Correct', score_math2 = '0/22 Correct';

            const a1 = userAttempts[`${examId}-ebrw1`];
            const a2 = userAttempts[`${examId}-ebrw2`];
            const a3 = userAttempts[`${examId}-math1`];
            const a4 = userAttempts[`${examId}-math2`];

            if (a1) { p_ebrw1 = a1.percentage; score_ebrw1 = `${a1.score}/${a1.total} Correct`; }
            if (a2) { p_ebrw2 = a2.percentage; score_ebrw2 = `${a2.score}/${a2.total} Correct`; }
            if (a3) { p_math1 = a3.percentage; score_math1 = `${a3.score}/${a3.total} Correct`; }
            if (a4) { p_math2 = a4.percentage; score_math2 = `${a4.score}/${a4.total} Correct`; }

            const badgeClass = region.name === 'US' ? 'style="background:var(--blue-glow);color:var(--blue);"' : '';
            const isM2Locked = !a3;

            const link_ebrw1 = `/past-exams/${exam.year}/${exam.month.toLowerCase()}/${v.id}/ebrw1`;
            const link_ebrw2 = `/past-exams/${exam.year}/${exam.month.toLowerCase()}/${v.id}/ebrw2`;
            const link_math1 = `/past-exams/${exam.year}/${exam.month.toLowerCase()}/${v.id}/math1`;
            const link_math2 = `/past-exams/${exam.year}/${exam.month.toLowerCase()}/${v.id}/math2`;

            const m2BtnClick = isM2Locked
              ? 'onclick="const msg=this.closest(\'.ecl-row\').querySelector(\'.m2-locked-msg\');if(msg)msg.style.display=\'block\';"'
              : `onclick="window.location.href='${link_math2}'"`;

            // EBRW CARD
            const englishHtml = `
              <article class="ecl-card ecl-card-english">
                <div class="ecl-card-header" style="border-bottom:1px solid #F0F0F8;padding-bottom:12px;">
                  <div><h4><span class="ecl-card-header-icon">🗓️</span> ${exam.month} ${exam.year} (${v.name})</h4></div>
                  <span class="ecl-badge official" ${badgeClass}>OFFICIAL</span>
                </div>
                <div class="ecl-card-body">
                  <div class="ecl-bg-illustration">📖</div>
                  ${moduleRow(a1, '📖 Module 1', '32 min • 27 questions', link_ebrw1, false)}
                  ${moduleRow(a2, '✍️ Module 2', '32 min • 27 questions', link_ebrw2, false)}
                </div>
              </article>
            `;
            englishList.insertAdjacentHTML('beforeend', englishHtml);

            // MATH CARD
            const mathHtml = `
              <article class="ecl-card ecl-card-math">
                <div class="ecl-card-header" style="border-bottom:1px solid #F0F0F8;padding-bottom:12px;">
                  <div><h4><span class="ecl-card-header-icon">🗓️</span> ${exam.month} ${exam.year} (${v.name})</h4></div>
                  <span class="ecl-badge official btn-math" ${badgeClass}>OFFICIAL</span>
                </div>
                <div class="ecl-card-body">
                  <div class="ecl-bg-illustration math-bg">＋１<br>✕＝</div>
                  ${moduleRow(a3, '🧩 Module 1', '35 min • 22 questions', link_math1, true)}
                  <div class="ecl-row">
                    <div class="ecl-row-info" style="${moduleBorderStyle(a4)}">
                      <strong>🧩 Module 2</strong>
                      <small>35 min • 22 questions</small>
                      ${moduleStatusText(a4)}
                      <div class="ecl-row-btns">
                        <button class="btn-practice-pill btn-math" ${m2BtnClick}>▶ PRACTICE</button>
                        ${reviewBtn(a4, link_math2)}
                      </div>
                      ${isM2Locked ? '<div class="m2-locked-msg" style="display:none;color:#9CA3AF;font-size:0.78rem;margin-top:8px;">ℹ️ Complete Module 1 first to unlock adaptive scoring.</div>' : ''}
                    </div>
                    ${moduleRing(a4)}
                  </div>
                </div>
              </article>
            `;
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
        document.getElementById('latest-title').innerText = `🔥 Latest Administration: ${latestExam.month} ${latestExam.year}`;
      }
    }