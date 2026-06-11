document.addEventListener("DOMContentLoaded", () => {
  const sidebarHTML = `
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
    #sidebar .nav-links a.active { background: var(--lav-sidebar-active); color: #fff; }
    #sidebar .badge-new { font-size: 10px; font-weight: 600; background: #EDE9FE; color: #7C6FE0; padding: 2px 6px; border-radius: 6px; text-transform: uppercase; position: absolute; right: 10px; }
    #sidebar .sidebar-bottom { padding: 16px 10px; border-top: 1px solid rgba(255, 255, 255, 0.07); display: flex; flex-direction: column; gap: 2px; }
    #sidebar .sidebar-bottom a, #sidebar .sidebar-bottom button { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 10px; color: rgba(255, 255, 255, 0.7); font-size: 13px; font-weight: 600; text-decoration: none; background: transparent; border: none; font-family: inherit; cursor: pointer; width: 100%; text-align: left; transition: all 0.2s ease; }
    #sidebar .sidebar-bottom a:hover, #sidebar .sidebar-bottom button:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
    #sidebar .user-profile { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; background: rgba(0, 0, 0, 0.2); margin-top: 8px; cursor: pointer; transition: background 0.2s; }
    #sidebar .user-profile:hover { background: rgba(0, 0, 0, 0.3); }
    #sidebar .avatar { width: 32px; height: 32px; background: var(--lav-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 700; flex-shrink: 0; }
    #sidebar .user-profile span:nth-child(2) { flex: 1; font-size: 13px; font-weight: 600; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* Nav Icons Removed to match original styling */

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

    /* Dark Mode Bottom Icon Overrides */
    body:not(.dark) .dm-icon::before { content: '🌙'; }
    body.dark .dm-icon::before { content: '☀️'; }
    body:not(.dark) .dm-text::before { content: 'Dark Mode'; }
    body.dark .dm-text::before { content: 'Light Mode'; }
    body.dark .dm-switch { background: var(--lav-accent) !important; }
    body.dark .dm-knob { transform: translateX(12px); }
  </style>

  <button id="toggle-sidebar-btn" onclick="document.body.classList.toggle('sidebar-collapsed')" title="Collapse Menu">◄</button>

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
      <li><a href="/" data-page="home">🏠 Home</a></li>
      <li><a href="/study-planner.html" data-page="study-planner">📅 Study Planner</a></li>
      <li>
        <a href="/analytics.html" data-page="analytics">
          📊 Analytics <span class="badge-new">New</span>
        </a>
      </li>
      <li><a href="/chat-support.html" data-page="ask-preppy">🤖 Ask Preppy AI <span class="badge-new">New</span></a></li>

      <li class="section-label">PRACTICE</li>
      <li><a href="/question-bank/index.html" data-page="question-bank">🔲 Question Bank</a></li>
      <li><a href="/past-exams.html" data-page="past-exams">📝 Past Exams</a></li>
      <li><a href="/real-exam.html" data-page="real-exam">🎯 Real Exam Mode <span class="badge-new">New</span></a></li>
    </ul>

    <!-- Bottom items -->
    <div class="sidebar-bottom">
      <button onclick="if(typeof toggleTheme === 'function') { toggleTheme(); } else { document.body.classList.toggle('dark'); localStorage.setItem('oneprep_theme', document.body.classList.contains('dark') ? 'dark' : 'light'); }" style="justify-content: space-between;">
        <span style="display: flex; align-items: center; gap: 10px;">
          <span class="dm-icon"></span>
          <span class="dm-text"></span>
        </span>
        <span class="dm-switch" style="width: 28px; height: 16px; background: rgba(255,255,255,0.2); border-radius: 8px; position: relative; transition: background 0.2s; flex-shrink: 0; display: inline-block;">
          <span class="dm-knob" style="width: 12px; height: 12px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: transform 0.2s; display: inline-block;"></span>
        </span>
      </button>

      <a href="#" onclick="if(typeof showToast === 'function') showToast('Pro features unlocked!'); return false;">
        ⭐ Upgrade
      </a>
      
      <!-- Profile with Dropdown -->
      <div class="user-profile" style="position: relative; cursor: pointer;" onclick="const d = this.querySelector('.profile-dropdown'); if(d.style.display==='none'){d.style.display='block'}else{d.style.display='none'}">
        <span class="avatar">AA</span>
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
  `;

  const sidebarNav = document.getElementById('sidebar');
  if (sidebarNav) {
    sidebarNav.innerHTML = sidebarHTML;

    const path = window.location.pathname;
    const links = sidebarNav.querySelectorAll('.nav-links a');
    
    // Deactivate all first
    links.forEach(l => l.classList.remove('active'));

    // Check which one to activate
    let activated = false;
    links.forEach(link => {
      const href = link.getAttribute('href');
      // If we are on exact path (or index)
      if (href !== '/' && path.includes(href)) {
        link.classList.add('active');
        activated = true;
      }
    });

    if (!activated && (path === '/' || path.endsWith('/index.html') || path === '')) {
      // Find the first link which is home
      const homeLink = sidebarNav.querySelector('[data-page="home"]');
      if (homeLink) homeLink.classList.add('active');
    }
  }
});
