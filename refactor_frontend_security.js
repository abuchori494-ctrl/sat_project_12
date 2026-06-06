const fs = require('fs');

let code = fs.readFileSync('past-exams.html', 'utf8');

const domLoadedRegex = /document\.addEventListener\('DOMContentLoaded', async \(\) => \{[\s\S]*?renderExams\(\);\s*\}\);/;
const newDomLoaded = `document.addEventListener('DOMContentLoaded', async () => {
      const savedTheme = localStorage.getItem('oneprep_theme') || 'light';
      document.body.className = savedTheme;
      try {
        // 1. Fetch mock JWT token
        const authRes = await fetch('/api/auth/mock-login', { method: 'POST' });
        const authData = await authRes.json();
        const token = authData.token;
        localStorage.setItem('jwt_token', token); // Store for other pages like app.js

        // 2. Fetch attempts and exams using the token
        const [attemptsRes, examsRes] = await Promise.all([
          fetch('/api/exams/attempts', {
            headers: { 'Authorization': \`Bearer \${token}\` }
          }),
          fetch('/api/exams')
        ]);
        
        if (attemptsRes.ok) {
          const attemptsArray = await attemptsRes.json();
          // Convert array format back to dictionary format expected by the UI
          attemptsArray.forEach(a => {
            userAttempts[\`\${a.examId}-\${a.moduleId}\`] = {
              score: a.correct,
              total: a.total,
              percentage: a.percentage
            };
          });
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
console.log('past-exams.html security updates applied successfully');
