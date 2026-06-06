const fs = require('fs');

let code = fs.readFileSync('past-exams.html', 'utf8');

// 1. Remove pastExamsData script
code = code.replace(/<script src="pastExamsData\.js"><\/script>\s*/, '');

// 2. Add pastExamsData global
code = code.replace(/let userAttempts = \{\};/, 'let userAttempts = {};\n    let pastExamsData = [];');

// 3. Update DOMContentLoaded to fetch exams and attempts with headers
const domLoadedRegex = /document\.addEventListener\('DOMContentLoaded', async \(\) => \{[\s\S]*?renderExams\(\);\s*\}\);/;
const newDomLoaded = `document.addEventListener('DOMContentLoaded', async () => {
      const savedTheme = localStorage.getItem('oneprep_theme') || 'light';
      document.body.className = savedTheme;
      try {
        const [attemptsRes, examsRes] = await Promise.all([
          fetch('/api/exams/attempts', {
            headers: { 'x-user-id': 'user_001' }
          }),
          fetch('/api/exams')
        ]);
        
        if (attemptsRes.ok) {
          userAttempts = await attemptsRes.json();
        }
        if (examsRes.ok) {
          pastExamsData = await examsRes.json();
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
      renderExams();
    });`;

code = code.replace(domLoadedRegex, newDomLoaded);

fs.writeFileSync('past-exams.html', code);
console.log('past-exams.html updated successfully');
