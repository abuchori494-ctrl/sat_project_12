const fs = require('fs');

const htmlPath = 'C:\\Users\\user\\sat_project_12\\past-exams.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// Remove Daily Challenge Card
const dailyChallengeRegex = /\s*<!-- Daily Challenge Card -->\s*<div class="ecl-card ecl-card-english daily-challenge-card"[\s\S]*?<\/div>\s*<\/div>/;
html = html.replace(dailyChallengeRegex, '');

// Replace ? with 💡 in Vocabulary Quiz
const vocabQuizArrowRegex = /<div class="qbc-arrow" style="color: var\(--primary\); font-weight: bold;">\?<\/div>/;
html = html.replace(vocabQuizArrowRegex, '<div class="qbc-arrow" style="color: var(--primary); font-weight: bold; font-size: 18px;">💡</div>');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Done');
