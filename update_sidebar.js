const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

const baseSidebar = `<nav id="sidebar">
  <style>
    :root {
      --lav-sidebar: #4A4580;
      --lav-sidebar-active: #5A5690;
      --lav-accent: #7C6FE0;
      --lav-accent2: #B8B0F5;
      --sidebar-width: 240px;
    }
    html.dark, body.dark, .dark {
      --lav-sidebar: #130C27;
      --lav-sidebar-active: #251B4D;
    }
    #sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: var(--sidebar-width) !important;
      background: var(--lav-sidebar);
      z-index: 200;
      box-shadow: 4px 0 24px rgba(61, 56, 117, 0.18);
      transition: width 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
      font-family: 'Outfit', 'Inter', system-ui, sans-serif;
      overflow: hidden;
    }
    .sidebar-inner {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 240px;
      overflow-y: auto;
      transition: opacity 0.2s;
    }
    .sidebar-inner::-webkit-scrollbar { width: 4px; }
    .sidebar-inner::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 2px; }
    
    #sidebar .logo { display: flex; align-items: center; gap: 10px; padding: 24px 20px 20px; cursor: pointer; user-select: none; }
    #sidebar .logo-icon { font-size: 26px; }
    #sidebar .logo-text { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
    #sidebar .exam-selector { margin: 0 16px 20px; width: calc(100% - 32px); background: rgba(255, 255, 255, 0.08); color: #fff; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 10px; padding: 9px 14px; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; outline: none; }
    #sidebar .exam-selector option { background: var(--lav-sidebar); color: #fff; }
    #sidebar .nav-links { list-style: none; padding: 0 10px; flex: 1; margin: 0; }
    #sidebar .nav-links li { margin-bottom: 2px; }
    #sidebar .nav-links li.section-label { font-size: 10px; font-weight: 800; color: rgba(255, 255, 255, 0.45); letter-spacing: 0.1em; text-transform: uppercase; padding: 16px 12px 6px 14px; }
    #sidebar .nav-links a { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 10px; color: rgba(255, 255, 255, 0.82); font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.2s ease; position: relative; }
    #sidebar .nav-links a:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
    #sidebar .nav-links a.active { background: var(--lav-sidebar-active); color: #fff; box-shadow: inset 3px 0 0 var(--lav-accent2); }
    #sidebar .badge-new { font-size: 8px; font-weight: 800; background: var(--lav-accent); color: #fff; padding: 2px 6px; border-radius: 99px; text-transform: uppercase; position: absolute; right: 10px; }
    #sidebar .sidebar-bottom { padding: 16px 10px; border-top: 1px solid rgba(255, 255, 255, 0.07); display: flex; flex-direction: column; gap: 2px; }
    #sidebar .sidebar-bottom a, #sidebar .sidebar-bottom button { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 10px; color: rgba(255, 255, 255, 0.7); font-size: 13px; font-weight: 600; text-decoration: none; background: transparent; border: none; font-family: inherit; cursor: pointer; width: 100%; text-align: left; transition: all 0.2s ease; }
    #sidebar .sidebar-bottom a:hover, #sidebar .sidebar-bottom button:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
    #sidebar .user-profile { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; background: rgba(0, 0, 0, 0.2); margin-top: 8px; cursor: pointer; transition: background 0.2s; }
    #sidebar .user-profile:hover { background: rgba(0, 0, 0, 0.3); }
    #sidebar .avatar { width: 32px; height: 32px; background: var(--lav-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 700; flex-shrink: 0; }
    #sidebar .user-profile span:nth-child(2) { flex: 1; font-size: 12px; font-weight: 600; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* Toggle Logic */
    body.sidebar-collapsed {
      --sidebar-width: 0px;
    }
    body.sidebar-collapsed #sidebar {
      background: transparent !important;
      box-shadow: none !important;
      border: none !important;
      pointer-events: none;
    }
    body.sidebar-collapsed .sidebar-inner {
      opacity: 0;
      pointer-events: none;
    }
    
    /* Dynamically shift main containers to make room for fixed sidebar and floating pill */
    .views-wrap, .main-content, .page-wrap {
      margin-left: var(--sidebar-width) !important;
      width: auto !important;
      padding-right: 48px !important;
      transition: margin-left 0.3s ease, width 0.3s ease !important;
    }
    
    /* Floating Theme Toggle Pill */
    #theme-pill-toggle {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1000;
      width: 36px;
      height: 72px;
      border-radius: 18px 0 0 18px; /* Assuming it touches the right edge as requested */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 4px;
      transition: all 0.2s ease;
      background: #ffffff;
      border: 1px solid rgba(108,99,255,0.2);
      pointer-events: auto !important; /* Ensure it works even if sidebar is collapsed */
    }
    #theme-pill-toggle:hover {
      box-shadow: 0 4px 20px rgba(108,99,255,0.15);
    }
    .theme-pill-icon {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    /* Light Mode */
    body:not(.dark) #theme-pill-toggle .sun-icon {
      background: #fef3c7;
      color: #f59e0b;
    }
    body:not(.dark) #theme-pill-toggle .moon-icon {
      color: rgba(108,99,255,0.3);
      background: transparent;
    }
    /* Dark Mode */
    body.dark #theme-pill-toggle {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(108,99,255,0.25);
    }
    body.dark #theme-pill-toggle .moon-icon {
      background: rgba(108,99,255,0.2);
      color: #a5b4fc;
    }
    body.dark #theme-pill-toggle .sun-icon {
      color: rgba(255,255,255,0.2);
      background: transparent;
    }
    
    #uncollapse-btn {
      display: none;
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1000;
      background: var(--lav-sidebar-active);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 18px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    body.sidebar-collapsed #uncollapse-btn {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #toggle-sidebar-btn {
      position: absolute;
      top: 24px;
      right: 16px;
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.5);
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
      transition: color 0.2s;
      z-index: 200;
    }
    #toggle-sidebar-btn:hover {
      color: white;
    }
  </style>

  <button id="toggle-sidebar-btn" onclick="document.body.classList.toggle('sidebar-collapsed')" title="Collapse Menu">◀</button>

  <div class="sidebar-inner">
    <!-- Logo -->
    <div class="logo" onclick="window.location.href='/'" style="cursor:pointer">
      <span class="logo-icon">🤖</span>
      <span class="logo-text">SAT Platform</span>
    </div>

    <!-- Exam Selector -->
    <select class="exam-selector" onchange="if(typeof showToast === 'function') showToast('Selected ' + this.value.toUpperCase())">
      <option>SAT</option>
      <option>ACT</option>
    </select>

    <!-- Nav Links -->
    <ul class="nav-links">
      <li class="section-label">DASHBOARD</li>
      <li><a href="/" onclick="if(typeof show === 'function'){show('dashboard'); return false;}" data-page="home">🏠 Home</a></li>
      <li><a href="/study-planner" data-page="study-planner">📅 Study Planner</a></li>
      <li>
        <a href="/analytics" data-page="analytics">
          📊 Analytics <span class="badge-new">New</span>
        </a>
      </li>
      <li><a href="/" onclick="if(typeof show === 'function'){show('chat'); return false;}" data-page="ask-preppy">🤖 Ask Preppy AI</a></li>

      <li class="section-label">PRACTICE</li>
      <li><a href="/question-bank" data-page="question-bank">🔲 Question Bank</a></li>
      <li><a href="/question-rush" data-page="question-rush">⚡ Question Rush</a></li>
      <li><a href="/predicted-tests" data-page="predicted-tests">📝 Predicted Tests</a></li>
      <li><a href="/past-exams.html" data-page="past-exams">📝 Past Exams</a></li>
    </ul>

    <!-- Bottom items -->
    <div class="sidebar-bottom">
      <a href="#" onclick="if(typeof showToast === 'function') showToast('Pro features unlocked!'); return false;">⬆️ Upgrade</a>
      
      <!-- Profile with Dropdown -->
      <div class="user-profile" style="position: relative; cursor: pointer;" onclick="const d = this.querySelector('.profile-dropdown'); if(d.style.display==='none'){d.style.display='block'}else{d.style.display='none'}">
        <span class="avatar">A</span>
        <span>Abdullah Abdus...</span>
        <span>⚙️</span>
        <!-- Dropdown Menu -->
        <div class="profile-dropdown" style="display: none; position: absolute; bottom: 100%; left: 0; width: 100%; background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); z-index: 50; margin-bottom: 0.5rem; overflow: hidden;">
          <a href="#" style="display: block; padding: 0.5rem 1rem; font-size: 0.875rem; color: #374151; border-bottom: 1px solid #f3f4f6;" onclick="event.stopPropagation(); if(typeof showToast === 'function') showToast('Account Settings')">⚙️ Account Settings</a>
          <a href="#" style="display: block; padding: 0.5rem 1rem; font-size: 0.875rem; color: #374151; border-bottom: 1px solid #f3f4f6;" onclick="event.stopPropagation(); if(typeof showToast === 'function') showToast('Join Us loaded!')">👥 Join Us</a>
          <a href="#" style="display: block; padding: 0.5rem 1rem; font-size: 0.875rem; color: #374151;" onclick="event.stopPropagation(); if(typeof showToast === 'function') showToast('Other options')">⋯ Other</a>
        </div>
      </div>
    </div>
  </div>
  <button id="uncollapse-btn" onclick="document.body.classList.toggle('sidebar-collapsed')" title="Expand Menu">▶</button>
  
  <!-- Floating Theme Toggle Pill -->
  <div id="theme-pill-toggle">
    <div class="theme-pill-icon sun-icon" onclick="if(typeof toggleTheme==='function'){if(document.body.classList.contains('dark')) toggleTheme();}">☀️</div>
    <div class="theme-pill-icon moon-icon" onclick="if(typeof toggleTheme==='function'){if(!document.body.classList.contains('dark')) toggleTheme();}">🌙</div>
  </div>
  
  </nav>`;

let changed = 0;
files.forEach(file => {
  const filepath = path.join(__dirname, file);
  let content = fs.readFileSync(filepath, 'utf8');
  
  const regex = /<nav[^>]*id="sidebar"[^>]*>[\s\S]*?<\/nav>/;
  if (regex.test(content)) {
    let activePage = '';
    if (file === 'index.html') activePage = 'home';
    else if (file === 'study-planner.html') activePage = 'study-planner';
    else if (file === 'analytics.html') activePage = 'analytics';
    else if (file === 'question-bank.html') activePage = 'question-bank';
    else if (file === 'question-rush.html') activePage = 'question-rush';
    else if (file === 'predicted-tests.html') activePage = 'predicted-tests';
    else if (file === 'past-exams.html') activePage = 'past-exams';
    else if (file === 'vocab.html') activePage = 'vocab';
    
    let fileSidebar = baseSidebar;
    if (activePage) {
      fileSidebar = fileSidebar.replace(`data-page="${activePage}"`, `data-page="${activePage}" class="active"`);
    }

    const newContent = content.replace(regex, fileSidebar);
    fs.writeFileSync(filepath, newContent, 'utf8');
    console.log(`Updated ${file}`);
    changed++;
  }
});
console.log(`Total files updated: ${changed}`);
