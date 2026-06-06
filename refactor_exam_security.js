const fs = require('fs');

let code = fs.readFileSync('exam.html', 'utf8');

// 1. Add mock login fetch to DOMContentLoaded
const domLoadedRegex = /document\.addEventListener\('DOMContentLoaded', async \(\) => \{[\s\S]*?initURLParams\(\);[\s\S]*?await fetchUserData\(\);/;

const newDomLoaded = `document.addEventListener('DOMContentLoaded', async () => {
      initURLParams();
      
      // Ensure we have a JWT token for backend requests
      let token = localStorage.getItem('jwt_token');
      if (!token) {
        try {
          const authRes = await fetch('/api/auth/mock-login', { method: 'POST' });
          const authData = await authRes.json();
          token = authData.token;
          localStorage.setItem('jwt_token', token);
        } catch(e) { console.error('Failed to get mock token', e); }
      }

      await fetchUserData();`;

code = code.replace(domLoadedRegex, newDomLoaded);

// 2. Add Authorization header to attempts fetch
const attemptsFetchRegex = /const attemptsResponse = await fetch\('\/api\/exams\/attempts'\);/;
const newAttemptsFetch = `const attemptsResponse = await fetch('/api/exams/attempts', {
          headers: { 'Authorization': \`Bearer \${localStorage.getItem('jwt_token')}\` }
        });`;
code = code.replace(attemptsFetchRegex, newAttemptsFetch);

// 3. Add Authorization header to submit fetch
const submitFetchRegex = /const response = await fetch\(\`\/api\/exams\/\$\{examId\}\/submit\`, \{\s*method: 'POST',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(payload\)\s*\}\);/;
const newSubmitFetch = `const response = await fetch(\`/api/exams/\${examId}/submit\`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${localStorage.getItem('jwt_token')}\`
          },
          body: JSON.stringify(payload)
        });`;
code = code.replace(submitFetchRegex, newSubmitFetch);

fs.writeFileSync('exam.html', code);
console.log('exam.html security updates applied successfully');
