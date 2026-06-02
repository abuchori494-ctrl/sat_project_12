const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

const baseSidebar = `<nav id="sidebar">
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
      <li class="section-label text-xs font-bold tracking-wider text-slate-400 uppercase pl-5" style="padding-left: 1.25rem;">DASHBOARD</li>
      <li><a href="/" onclick="if(typeof show === 'function'){show('dashboard'); return false;}" data-page="home">🏠 Home</a></li>
      <li><a href="/study-planner" data-page="study-planner">📅 Study Planner</a></li>
      <li>
        <a href="/analytics" data-page="analytics">
          📊 Analytics <span class="badge-new">New</span>
        </a>
      </li>
      <li><a href="/" onclick="if(typeof show === 'function'){show('chat'); return false;}" data-page="ask-preppy">🤖 Ask Preppy AI</a></li>

      <li class="section-label text-xs font-bold tracking-wider text-slate-400 uppercase pl-5" style="padding-left: 1.25rem;">PRACTICE</li>
      <li><a href="/question-bank" data-page="question-bank">🔲 Question Bank</a></li>
      <li><a href="/question-rush" data-page="question-rush">⚡ Question Rush</a></li>
      <li><a href="/predicted-tests" data-page="predicted-tests">📝 Predicted Tests</a></li>
      <li><a href="/past-exams.html" data-page="past-exams">📝 Past Exams</a></li>
    </ul>

    <!-- Bottom items -->
    <div class="sidebar-bottom">
      <button onclick="if(typeof toggleDark === 'function') toggleDark()">🌙 Switch To Dark</button>
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
