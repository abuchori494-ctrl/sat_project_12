import os
import re

html_files = [
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
]

nav_pattern = re.compile(r'<nav[^>]*id="sidebar"[^>]*>.*?</nav>', re.DOTALL | re.IGNORECASE)

for file in html_files:
    filepath = os.path.join(r"C:\Users\user\sat_project_12", file)
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = nav_pattern.sub('<nav id="sidebar"></nav>', content)
    
    if '<script src="/sidebar.js"></script>' not in new_content:
        new_content = new_content.replace('</body>', '<script src="/sidebar.js"></script>\n</body>')
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
    else:
        print(f"No changes needed for {file}")
