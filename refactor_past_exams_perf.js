const fs = require('fs');

let code = fs.readFileSync('past-exams.html', 'utf8');

// 1. Add pagination controls in HTML
const layoutRegex = /(<div class="exams-list" id="math-list"><\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/;
const paginationHtml = `
      </div>
      
      <!-- Pagination Controls -->
      <div id="pagination-controls" style="display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 24px;">
        <button id="prev-page-btn" class="nav-nav-btn" onclick="changePage(-1)" disabled>Previous</button>
        <span id="page-indicator" style="font-size: 14px; font-weight: 500;">Page 1</span>
        <button id="next-page-btn" class="nav-nav-btn primary" onclick="changePage(1)">Next</button>
      </div>
`;
code = code.replace(layoutRegex, paginationHtml);

// 2. Refactor fetching logic and setFilter
const fetchLogicRegex = /let currentFilters = \{[\s\S]*?function renderExams\(\) \{/;

const newFetchLogic = `let currentFilters = {
      year: 'all',
      region: 'all',
      status: 'all'
    };
    
    let currentPage = 1;
    let totalPages = 1;

    async function fetchExams() {
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
          headers: { 'Authorization': \`Bearer \${token}\` }
        });
        
        if (examsRes.ok) {
          const resJson = await examsRes.json();
          pastExamsData = resJson.data;
          totalPages = resJson.totalPages || 1;
          
          document.getElementById('page-indicator').textContent = \`Page \${currentPage} of \${totalPages}\`;
          document.getElementById('prev-page-btn').disabled = currentPage <= 1;
          document.getElementById('next-page-btn').disabled = currentPage >= totalPages;
          
          renderExams();
        }
      } catch (err) {
        console.error("Failed to fetch exams", err);
      }
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
          headers: { 'Authorization': \`Bearer \${token}\` }
        });
        
        if (attemptsRes.ok) {
          const attemptsArray = await attemptsRes.json();
          attemptsArray.forEach(a => {
            userAttempts[\`\${a.examId}-\${a.moduleId}\`] = {
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

    function renderExams() {`;

code = code.replace(fetchLogicRegex, newFetchLogic);

// 3. Remove local filtering inside renderExams
code = code.replace(/if \(currentFilters\.year !== 'all' && exam\.year\.toString\(\) !== currentFilters\.year\) return;/g, '');
code = code.replace(/if \(currentFilters\.region !== 'all' && region\.name !== currentFilters\.region\) return;/g, '');
code = code.replace(/if \(currentFilters\.status === 'completed' && !isCompleted\) return;/g, '');
code = code.replace(/if \(currentFilters\.status === 'not_started' && isCompleted\) return;/g, '');

fs.writeFileSync('past-exams.html', code);
console.log('past-exams.html performance updates successful');
