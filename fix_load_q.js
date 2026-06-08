const fs = require('fs');
let code = fs.readFileSync('exam.js', 'utf8');

const loadOldRegex = /function loadQuestion\(idx\)\s*\{[\s\S]*?const q = questions\[idx\];/;

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

code = code.replace(loadOldRegex, loadNew);
fs.writeFileSync('exam.js', code);
console.log('Fixed loadQuestion to be async and lazy');
