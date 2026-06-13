import re

with open(r'c:\Users\user\sat_project_12\study-planner.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. JS: Update mockupTasks with rowBg
content = content.replace(
    'border: "#378ADD", badgeBg: "#DBEAFE"',
    'border: "#378ADD", badgeBg: "#DBEAFE", rowBg: "#E6F1FB33"'
)
content = content.replace(
    'border: "#7F77DD", badgeBg: "#FAE8FF"',
    'border: "#7F77DD", badgeBg: "#FAE8FF", rowBg: "#EEEDFE33"'
)
content = content.replace(
    'border: "#1D9E75", badgeBg: "#FEF3C7"',
    'border: "#1D9E75", badgeBg: "#FEF3C7", rowBg: "#E1F5EE33"'
)

# 2. JS: Remove default seed for geometry
seed_block = """if (checkedTasks['mock_geometry'] === undefined) {
        checkedTasks['mock_geometry'] = true;
        checkedTasks['mock_heart_of_algebra'] = false;
        checkedTasks['mock_command_of_evidence'] = false;
        checkedTasks['mock_rhetorical_synthesis'] = false;
        checkedTasks['mock_daily_vocabulary'] = false;
        localStorage.setItem('oneprep_plan_checks', JSON.stringify(checkedTasks));
      }"""
content = content.replace(seed_block, '')

# 3. JS: Remove truncation from h4, add border-radius, use rowBg
content = content.replace(
    '''border-radius: 0 var(--lav-radius, 20px) var(--lav-radius, 20px) 0; border-left: 3px solid ${task.border};''',
    '''border-radius: 0 8px 8px 0; border-left: 3px solid ${task.border};'''
)
content = content.replace(
    '''const cardBg = isChecked ? '#F8F9FA' : '#ffffff';''',
    '''const cardBg = task.rowBg;'''
)
content = content.replace(
    '''h4 style="margin: 0; font-size: 13px; font-weight: 500; color: ${isChecked ? 'var(--color-text-secondary, #A0A0B0)' : 'var(--lav-dark)'}; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px;''',
    '''h4 style="margin: 0; font-size: 13px; font-weight: 500; color: ${isChecked ? 'var(--color-text-secondary, #A0A0B0)' : 'var(--lav-dark)'}; line-height: 1.4;'''
)

# 4. HTML: Table headers Ahead -> Upcoming
content = content.replace('&mdash; Ahead', '&mdash; Upcoming')

# 5. HTML: Table rows left border and tints
def patch_td(match, border_color, bg_color):
    td = match.group(0)
    # remove overflow, text-overflow, white-space
    td = re.sub(r'overflow:\s*hidden;\s*text-overflow:\s*ellipsis;\s*white-space:\s*nowrap;', '', td)
    # set border-left
    td = re.sub(r'border-left:\s*[^;]+;', f'border-left: 3px solid {border_color};', td)
    # add/replace background inside td
    if 'background:' in td:
        td = re.sub(r'background:\s*#[0-9a-fA-F]+;?', f'background: {bg_color};', td)
    else:
        td = re.sub(r'(style="[^"]*)(")', rf'\1 background: {bg_color};\2', td)
    # remove max-width
    td = re.sub(r'max-width:\s*[^;]+;', '', td)
    return td

def process_tr(match):
    tr = match.group(0)
    if 'Heart of Algebra' in tr or 'Geometry' in tr or 'Mock Exam' in tr or 'Advanced Math' in tr or 'Full Math' in tr:
        border = '#378ADD'
        bg = '#E6F1FB22'
    elif 'Command of Evidence' in tr or 'Rhetorical Synthesis' in tr or 'Reading Comp' in tr or 'Full R&W' in tr:
        border = '#7F77DD'
        bg = '#EEEDFE22'
    elif 'Daily Vocabulary' in tr:
        border = '#1D9E75'
        bg = '#E1F5EE22'
    else:
        border = '#000000'
        bg = 'transparent'
    
    tr = re.sub(r'<td\s+style="[^"]+">', lambda m: patch_td(m, border, bg), tr)
    tr = re.sub(r'<div\s+style="overflow:\s*hidden;\s*text-overflow:\s*ellipsis;\s*white-space:\s*nowrap;">', '<div>', tr)
    return tr

tbody_start = content.find('<tbody>')
tbody_end = content.find('</tbody>', tbody_start)
tbody_content = content[tbody_start:tbody_end]
patched_tbody = re.sub(r'(?s)<tr>.*?</tr>', process_tr, tbody_content)
content = content[:tbody_start] + patched_tbody + content[tbody_end:]

# 6. HTML: Heights
content = content.replace(
    '<aside class="sp-tasks-col" style="flex: 0 0 42%; display: flex; flex-direction: column; min-height: 0;">',
    '<aside class="sp-tasks-col" style="flex: 0 0 42%; display: flex; flex-direction: column; height: 100%;">'
)
content = content.replace(
    '<div class="sp-table-card" style="display: flex; flex-direction: column; flex: 1; padding: 0; padding-bottom: 24px;">',
    '<div class="sp-table-card" style="display: flex; flex-direction: column; height: 100%; flex: 1; padding: 0; padding-bottom: 24px;">'
)

# 7. HTML: Update static tasks
def patch_static_tasks(match):
    div = match.group(0)
    if 'border-left-color:#3B82F6;' in div:
        border = '#378ADD'
        bg = '#E6F1FB33'
    elif 'border-left-color:#7C6FE0;' in div:
        border = '#7F77DD'
        bg = '#EEEDFE33'
    elif 'border-left-color:#10B981;' in div:
        border = '#1D9E75'
        bg = '#E1F5EE33'
    else:
        border = '#000000'
        bg = 'transparent'
    
    # ensure border-radius is 0 8px 8px 0
    div = re.sub(r'style="([^"]*)"', lambda m: f'style="{m.group(1)} border-left: 3px solid {border}; background: {bg}; border-radius: 0 8px 8px 0;"', div, count=1)
    return div

dac_tasks_start = content.find('<div id="daily-agenda-tasks"')
dac_tasks_end = content.find('</aside>', dac_tasks_start)
dac_content = content[dac_tasks_start:dac_tasks_end]
patched_dac = re.sub(r'<div class="da-task-card.*?</div>\s*</div>', patch_static_tasks, dac_content, flags=re.DOTALL)
content = content[:dac_tasks_start] + patched_dac + content[dac_tasks_end:]

with open(r'c:\Users\user\sat_project_12\study-planner.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched successfully.")
