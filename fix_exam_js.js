const fs = require('fs');
let code = fs.readFileSync('exam.js', 'utf8');

// fetchExamQuestions
code = code.replace(
  'const response = await fetch(`/api/exams/${examId}/questions?module=${currentModule}`);',
  'const response = await fetch(`/api/exams/${examId}/questions?module=${currentModule}&index=0`);'
);

code = code.replace(
  'questions = data.questions;',
  'questions = new Array(data.totalQuestions).fill(null);\n          questions[0] = data.questions[0];'
);

code = code.replace(
  'loadQuestion(0);',
  'await loadQuestion(0);'
);

// loadQuestion
const loadOld = 'function loadQuestion(idx) {\n      if (idx < 0 || idx >= questions.length) return;\n      currentIdx = idx;\n      \n      const q = questions[idx];';

const loadNew = `async function loadQuestion(idx) {
      if (idx < 0 || idx >= questions.length) return;
      
      if (!questions[idx]) {
        document.getElementById('question-text').textContent = "Loading...";
        try {
           const res = await fetch(\`/api/exams/\${examId}/questions?module=\${currentModule}&index=\${idx}\`);
           const data = await res.json();
           if (data.questions && data.questions[0]) questions[idx] = data.questions[0];
        } catch(e) { console.error(e); }
      }
      
      currentIdx = idx;
      const q = questions[idx];
      if (!q) return;

      if (idx + 1 < questions.length && !questions[idx + 1]) {
         fetch(\`/api/exams/\${examId}/questions?module=\${currentModule}&index=\${idx+1}\`)
           .then(res => res.json())
           .then(data => { if (data.questions && data.questions[0]) questions[idx+1] = data.questions[0]; });
      }`;

code = code.replace(loadOld, loadNew);

const timerLeakFix = "\n\nwindow.addEventListener('beforeunload', () => { if (timerInterval) clearInterval(timerInterval); });";
code += timerLeakFix;

fs.writeFileSync('exam.js', code);
console.log('Fixed exam.js frontend performance');
