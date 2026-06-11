const fs = require('fs');
let html = fs.readFileSync('question-bank/index.html', 'utf8');

// 1. Remove mock data arrays
html = html.replace(/const RW_CATEGORIES = \[[\s\S]*?const MATH_CATEGORIES = \[[\s\S]*?\];/m, `let RW_CATEGORIES = [];\n    let MATH_CATEGORIES = [];`);

// 2. Remove hardcoded headers
html = html.replace(/<p class="text-\[14px\] text-\[#6B7280\]">1492 questions across 10 skills<\/p>/, `<p id="rw-subtitle" class="text-[14px] text-[#6B7280]"></p>`);
html = html.replace(/<p class="text-\[14px\] text-\[#6B7280\]">2390 questions across 28 skills<\/p>/, `<p id="math-subtitle" class="text-[14px] text-[#6B7280]"></p>`);

// 3. Add Empty State Renderer
const emptyStateJS = `
    function renderEmptyState(viewId, subjectName) {
      const mainEl = document.getElementById(viewId);
      if(!mainEl) return;
      mainEl.innerHTML = \`
        <div class="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div class="w-20 h-20 mb-6 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center justify-center text-4xl">
             🗂️
          </div>
          <h2 class="text-2xl font-bold text-[#1E293B] mb-2">No Questions Available</h2>
          <p class="text-[#64748B] max-w-md mb-8">The database currently has no \${subjectName} questions. Upload your curriculum to start populating this dashboard.</p>
          <button class="px-6 py-3 bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold rounded-lg shadow-md transition-all">
            Start by Uploading Questions
          </button>
        </div>
      \`;
    }

    async function fetchQuestionBankStats() {
      // Set Loading State
      const subjectCards = document.getElementById('subject-cards-container');
      if(subjectCards) subjectCards.innerHTML = '<div class="col-span-1 md:col-span-2 p-8 text-center text-gray-500 font-medium">Loading metrics...</div>';
      
      try {
        const res = await fetch('/api/question-bank/stats');
        const data = await res.json();
        
        if (data.totalQuestions === 0 || data.status === 'empty') {
          // Zero-State
          renderEmptyState('view-overview', 'SAT');
          renderEmptyState('view-rw-skills', 'Reading & Writing');
          renderEmptyState('view-math-skills', 'Math');
          return;
        }

        // Future data mapping logic
        RW_CATEGORIES = data.categories.filter(c => c.subject === 'reading') || [];
        MATH_CATEGORIES = data.categories.filter(c => c.subject === 'math') || [];
        
        const rwSub = document.getElementById('rw-subtitle');
        if(rwSub) rwSub.innerText = \`\${data.totalQuestions} questions available\`;
        const mathSub = document.getElementById('math-subtitle');
        if(mathSub) mathSub.innerText = \`\${data.totalQuestions} questions available\`;
        
        renderPageLayout();
        renderList('rw');
        renderList('math');
        runCountUp();
      } catch (err) {
        console.error(err);
        renderEmptyState('view-overview', 'SAT');
        renderEmptyState('view-rw-skills', 'Reading & Writing');
        renderEmptyState('view-math-skills', 'Math');
      }
    }
`;

// 4. Inject it right before renderList
html = html.replace(/\/\/ LIST RENDERER/, emptyStateJS + '\n    // LIST RENDERER');

// 5. Update initialization
html = html.replace(/document\.addEventListener\('DOMContentLoaded', \(\) => \{[\s\S]*?\}\);/m, `document.addEventListener('DOMContentLoaded', () => {
      checkTips();
      fetchQuestionBankStats();
      window.triggerConfetti = triggerConfetti;
    });`);

fs.writeFileSync('question-bank/index.html', html);
console.log('Successfully updated question-bank/index.html');
