const fs = require('fs');
const path = require('path');

const htmlFiles = [
    "vocab.html",
    "vocab-quiz.html",
    "tutor-apply.html",
    "score-calculator.html",
    "study-planner.html",
    "question-bank/index.html",
    "real-exam.html",
    "past-exams.html",
    "index.html",
    "feedback.html",
    "creator-program.html",
    "bug-report.html",
    "colleges.html",
    "chat-support.html",
    "analytics.html"
];

// Regex to match <nav id="sidebar">...</nav>
const navPattern = /<nav[^>]*id="sidebar"[^>]*>[\s\S]*?<\/nav>/i;

htmlFiles.forEach(file => {
    const filepath = path.join(__dirname, file);
    if (!fs.existsSync(filepath)) {
        console.log(`File not found: ${filepath}`);
        return;
    }
    
    const content = fs.readFileSync(filepath, 'utf8');
    
    // Replace sidebar with empty nav tag
    let newContent = content.replace(navPattern, '<nav id="sidebar"></nav>');
    
    // Add script tag before </body> if it doesn't already exist
    if (!newContent.includes('<script src="/sidebar.js"></script>')) {
        newContent = newContent.replace('</body>', '<script src="/sidebar.js"></script>\n</body>');
    }
        
    if (newContent !== content) {
        fs.writeFileSync(filepath, newContent, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`No changes needed for ${file}`);
    }
});
