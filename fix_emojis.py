import re
import os

filepath = r'C:\Users\user\sat_project_12\past-exams.html'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Header emojis
text = text.replace('<span class="ecl-icon">??</span>\n            <div>\n              <h3>English &amp; Reading</h3>', '<span class="ecl-icon">📖</span>\n            <div>\n              <h3>English &amp; Reading</h3>')
text = text.replace('<span class="ecl-icon">??</span>\n            <div>\n              <h3>Math</h3>', '<span class="ecl-icon">🧮</span>\n            <div>\n              <h3>Math</h3>')
text = text.replace('<span class="ecl-icon">??</span>\n            <div>\n              <h3>Vocabulary Bank</h3>', '<span class="ecl-icon">🌿</span>\n            <div>\n              <h3>Vocabulary Bank</h3>')

# Latest Administration
text = text.replace('id="latest-title">?"? Latest Administration</h2>', 'id="latest-title">🔥 Latest Administration</h2>')
text = text.replace('`?? Latest Administration:', '`🔥 Latest Administration:')

# Module titles
text = text.replace('<strong>?? Reading Comprehension</strong>', '<strong>📖 Reading Comprehension</strong>')
text = text.replace('<strong>?? Writing & Language</strong>', '<strong>✍️ Writing & Language</strong>')
text = text.replace('<strong>?? Module 1</strong>', '<strong>🧩 Module 1</strong>')
text = text.replace('<strong>?? Module 2</strong>', '<strong>🧩 Module 2</strong>')

# Exam dates
text = text.replace('<h4>?? ${exam.month}', '<h4>🗓️ ${exam.month}')

# Buttons
text = text.replace('? PRACTICE', '▶ PRACTICE')
text = text.replace('? TRY NOW', '▶ TRY NOW')
text = text.replace('?? Upgrade', '⬆️ Upgrade')
text = text.replace('- </button>', '▶</button>')
text = text.replace('ů? Upgrade', '⬆️ Upgrade')


# Vocab sidebar
text = text.replace('?? Daily Challenge', '📖 Daily Challenge')
text = text.replace('size: 32px;">??</div>', 'size: 32px;">💡</div>')
text = text.replace('margin-right: 12px;">??</div>', 'margin-right: 12px;">📚</div>')
text = text.replace('font-weight: bold;">??</div>', 'font-weight: bold;">🔗</div>')
text = text.replace('margin-bottom: 8px;">??</div>', 'margin-bottom: 8px;">📚</div>')

# Search bar
text = text.replace('class="spb-icon-left">?"?</span>', 'class="spb-icon-left">🔍</span>')
text = text.replace('class="spb-icon-right">??</span>', 'class="spb-icon-right">⌘K</span>')

# Sun/Moon sidebar toggle
text = text.replace("body:not(.dark) .dm-icon::before { content: '??'; }", "body:not(.dark) .dm-icon::before { content: '☀️'; }")
text = text.replace("body.dark .dm-icon::before { content: '??'; }", "body.dark .dm-icon::before { content: '🌙'; }")

# Sidebar profile dropdown text (was broken by PS)
text = text.replace('?T? Account Settings', '⚙️ Account Settings')
text = text.replace("?'? Join Us", '🌟 Join Us')
text = text.replace('< Other', '✨ Other')
text = text.replace('<span>?T?</span>', '<span>⚙️</span>')
text = text.replace('?? Complete Module 1', 'ℹ️ Complete Module 1')

# Any remaining isolated broken chars
text = text.replace('??', '📖') # fallback just in case, but probably a bad idea, let's remove this

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

print("done")
