import re

with open('plan-setup.html', 'r', encoding='utf-8') as f:
    setup_content = f.read()

with open('study-planner.html', 'r', encoding='utf-8') as f:
    planner_content = f.read()

# 1. Extract Tailwind
tailwind_match = re.search(r'(<script src="https://cdn\.tailwindcss\.com"></script>\s*<script>\s*tailwind\.config = \{.*?\n\s*\}\s*</script>)', setup_content, re.DOTALL)
if tailwind_match:
    tailwind_script = tailwind_match.group(1)
    if 'cdn.tailwindcss.com' not in planner_content:
        planner_content = planner_content.replace('</title>', '</title>\n    ' + tailwind_script)

# 2. Extract Screens 1, 2, 3
screens_match = re.search(r'(<!-- ==========================================\s*SCREEN 1: LANDING PAGE VIEW.*?)(?=<!-- ==========================================\s*SCREEN 4:)', setup_content, re.DOTALL)
if screens_match:
    screens_html = screens_match.group(1)
    
    # In planner, find <div class="sp-shell"> and wrap the rest in <section id="view-dashboard">
    # Wait, the sidebar is BEFORE sp-shell. We want sp-shell to contain EVERYTHING, so we don't duplicate the sidebar or margin.
    # Actually, in planner_content, the dashboard IS the contents of sp-shell.
    # Let's replace <div class="sp-shell"> with <div class="sp-shell">\n + screens_html + \n<section id="view-dashboard" class="hidden">\n
    
    # Find end of sp-shell to close the section. It's right before the <script> tags.
    # The end of planner_content looks like:
    # </div> <!-- end sp-shell -->
    # <script>
    if 'id="view-landing"' not in planner_content:
        planner_content = planner_content.replace('<div class="sp-shell">', '<div class="sp-shell">\n' + screens_html + '\n<section id="view-dashboard" class="hidden">\n')
        
        # Now close the section right before the first <script>
        planner_content = planner_content.replace('<script>', '</section>\n<script>', 1)

# 3. Extract JS Handlers
js_match = re.search(r'(// SCREEN 1: LANDING PAGE HANDLERS.*?)(?=// ==========================================\s*// DYNAMIC STUDY PLAN DASHBOARD RENDERER)', setup_content, re.DOTALL)
if js_match:
    js_code = js_match.group(1)
    # Also we need generateOfflinePlan because it's used in the setup flow
    offline_match = re.search(r'(// ==========================================\s*// OFFLINE PLAN SEED GENERATOR.*?)(?=// ==========================================\s*// UTILITIES)', setup_content, re.DOTALL)
    if offline_match:
        js_code += '\n' + offline_match.group(1)
        
    # And we need utilities like showToast, escapeHtml
    utils_match = re.search(r'(// ==========================================\s*// UTILITIES.*?)(?=</script>)', setup_content, re.DOTALL)
    if utils_match:
        js_code += '\n' + utils_match.group(1)
        
    if 'SCREEN 1: LANDING PAGE HANDLERS' not in planner_content:
        planner_content = planner_content.replace('<script>', '<script>\n' + js_code + '\n')

with open('study-planner_merged.html', 'w', encoding='utf-8') as f:
    f.write(planner_content)
print("Merge complete!")
