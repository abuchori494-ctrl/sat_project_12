// ==========================================================================
// OnePrep Interactive Application Core Engine
// ==========================================================================

// --- STATE MANAGEMENT ---
let vocabularyDb = [];  // Real data will be fetched from MongoDB via API

// 🔴 API HELPER FUNCTIONS FOR VOCABULARY
async function getAuthToken() {
  let token = localStorage.getItem('jwt_token');
  if (!token) {
    console.warn('[VOCAB] No JWT token found, attempting mock login...');
    try {
      const res = await fetch('/api/auth/mock-login', { method: 'POST' });
      const data = await res.json();
      token = data.token;
      localStorage.setItem('jwt_token', token);
      console.log('[VOCAB] Mock login successful, token saved');
    } catch (e) {
      console.error('[VOCAB] Mock login failed:', e);
    }
  }
  return token;
}

async function fetchVocabularyFromAPI() {
  console.log('[API CALL] GET /api/vocab/words');
  try {
    const token = await getAuthToken();
    const res = await fetch('/api/vocab/words', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!res.ok) {
      console.error(`[API ERROR] GET /api/vocab/words - ${res.status} ${res.statusText}`);
      return [];
    }
    
    const words = await res.json();
    console.log(`[API RESPONSE] GET /api/vocab/words - Fetched ${words.length} words from MongoDB:`, words);
    return words;
  } catch (e) {
    console.error('[API FAILED] GET /api/vocab/words', e);
    return [];
  }
}

async function saveVocabularyToAPI(word, context = '') {
  console.log(`[API CALL] POST /api/vocab/word - Payload:`, { word, context });
  try {
    const token = await getAuthToken();
    const res = await fetch('/api/vocab/word', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ word, context })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      console.error(`[API ERROR] POST /api/vocab/word - ${data.error || res.statusText}`);
      return null;
    }
    
    console.log('[API RESPONSE] POST /api/vocab/word - Saved to MongoDB:', data.word);
    return data.word;
  } catch (e) {
    console.error('[API FAILED] POST /api/vocab/word', e);
    return null;
  }
}

async function deleteVocabularyFromAPI(wordId) {
  console.log(`[API CALL] DELETE /api/vocab/word/${wordId}`);
  try {
    const token = await getAuthToken();
    const res = await fetch(`/api/vocab/word/${wordId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!res.ok) {
      console.error(`[API ERROR] DELETE /api/vocab/word/${wordId} - ${res.status}`);
      return false;
    }
    
    console.log(`[API RESPONSE] DELETE /api/vocab/word/${wordId} - Success`);
    return true;
  } catch (e) {
    console.error(`[API FAILED] DELETE /api/vocab/word/${wordId}`, e);
    return false;
  }
}

async function updateMasteredStatus(wordId, mastered) {
  console.log(`[API CALL] PATCH /api/vocab/word/${wordId}/mastered - Payload:`, { mastered });
  try {
    const token = await getAuthToken();
    const res = await fetch(`/api/vocab/word/${wordId}/mastered`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ mastered })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      console.error(`[API ERROR] PATCH /api/vocab/word/${wordId}/mastered - ${data.error}`);
      return null;
    }
    
    console.log(`[API RESPONSE] PATCH /api/vocab/word/${wordId}/mastered - Updated in MongoDB:`, data.word);
    return data.word;
  } catch (e) {
    console.error(`[API FAILED] PATCH /api/vocab/word/${wordId}/mastered`, e);
    return null;
  }
}

let mistakesDb = JSON.parse(localStorage.getItem('oneprep_mistakes')) || [
  {
    id: "err_1",
    questionId: "RW-M1-Q4",
    section: "Reading & Writing",
    module: "Module 1",
    conceptArea: "Vocabulary in Context",
    difficulty: "Hard",
    passage: "Some robots such as Wabian (developed in 1995) and ASIMO (developed in 2011) feature humanoid characteristics like the ability to respond to voice commands so that people will find it easier to interact with them. While these features can help to ______ feelings of comfort in people, a robot that looks too human can fall into the 'uncanny valley,' meaning that its appearance unintentionally unsettles those who encounter it.",
    question: "Which choice completes the text with the most logical and precise word or phrase?",
    options: {
      A: "constrict",
      B: "counterbalance",
      C: "repudiate",
      D: "engender"
    },
    userAnswer: "B",
    correctAnswer: "D",
    misconception: "You selected 'counterbalance' (B) because you interpreted the uncanny valley later in the sentence as requiring a balance. However, the first clause is entirely positive. Counterbalancing comfort implies neutralizing it, which is the opposite of the author's point.",
    underlyingRule: "Vocabulary Precision & Connotation: In SAT fill-in-the-blank questions, the chosen word must match the logical direction (positive/negative) and prepositional collocation of the surrounding text.",
    quickFix: "Look for verbs that directly mean 'produce' or 'foster' when introducing beneficial emotions, and avoid selecting words that imply solving a problem that has not been established yet.",
    similarQuestion: {
      passage: "The director's new cinematic release is designed to ______ a sense of nostalgia in older viewers, transport them back to their childhood, and evoke memories of simpler times.",
      question: "Which choice completes the text with the most logical and precise word or phrase?",
      options: {
        A: "evacuate",
        B: "suppress",
        C: "provoke",
        D: "foster"
      },
      answer: "D",
      explanation: "The context speaks of creating positive feelings of nostalgia and evoking warm childhood memories. Therefore, 'foster' (which means to encourage or promote development) is the correct choice, similar to 'engender'."
    }
  },
  {
    id: "err_2",
    questionId: "MATH-M1-Q3",
    section: "Math",
    module: "Module 1",
    conceptArea: "Algebra (Linear Equations)",
    difficulty: "Medium",
    passage: "Consider the equation: &radic;(x + 20) = x.",
    question: "What is the positive solution to the given equation?",
    options: {
      A: "5",
      B: "10",
      C: "20",
      D: "29"
    },
    userAnswer: "D",
    correctAnswer: "A",
    misconception: "You selected '29' (D). This is a common algebra error if you forgot to take the square root or mistakenly thought 29 is the positive solution of the simplified quadratic equation.",
    underlyingRule: "Radical Equation Solving: To solve &radic;A = B, square both sides to get A = B^2. Solve the resulting quadratic equation and *always* check for extraneous solutions by plugging values back into the original radical.",
    quickFix: "Plug the answer options directly back into the original equation before doing complex algebra; if &radic;(5+20) = 5 works, it is correct immediately!",
    similarQuestion: {
      passage: "Consider the equation: &radic;(2x + 15) = x.",
      question: "What is the positive solution to the given equation?",
      options: {
        A: "3",
        B: "5",
        C: "15",
        D: "20"
      },
      answer: "B",
      explanation: "Squaring both sides: 2x + 15 = x^2 &rarr; x^2 - 2x - 15 = 0 &rarr; (x - 5)(x + 3) = 0. The positive solution is x = 5. Checking: &radic;(2(5) + 15) = &radic;25 = 5, which works."
    }
  }
];

let activeMistakeId = "err_1";
let currentSimModule = null;
let currentSimQuestions = [];
let currentSimIdx = 0;
let userSimAnswers = {};
let flaggedSimQuestions = {};
let simTimeRemaining = 0;
let simTimerInterval = null;
let similarQuizDeck = [];
let similarQuizIdx = 0;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[APP] Initializing application...');
  
  // Sync Theme
  const savedTheme = localStorage.getItem('oneprep_theme') || 'dark';
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(savedTheme);
  
  // 🔴 FETCH VOCABULARY FROM MONGODB BEFORE RENDERING
  console.log('[APP] Fetching vocabulary data from MongoDB...');
  vocabularyDb = await fetchVocabularyFromAPI();
  console.log(`[APP] Loaded ${vocabularyDb.length} vocab words into memory`);
  
  // Render views
  renderVocab();
  renderMistakes();
  initCountdown();
  renderStackedBars();
  generateHeatmap();
  updateTasksProgress();
  renderDashboardWidgets();
  renderPastExams();
  renderScoreSummary();
  
  console.log('[APP] Application initialization complete');
});

// --- SPA VIEW ROUTING ---
function show(viewId) {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  
  // Show active view
  const targetView = document.getElementById(`v-${viewId}`);
  if (targetView) targetView.classList.add('active');
  
  // Manage navigation button states
  document.querySelectorAll('.nl').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`nl-${viewId}`);
  if (activeBtn) activeBtn.classList.add('active');
  
  if (viewId === 'dashboard' && typeof renderDailyAgenda === 'function') {
      renderDailyAgenda(); // Sync visually when returning to home dashboard
  }

  // Custom headers & clean states
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- THEME SWITCHER (UNIFIED) ---
function toggleTheme() {
  const isDark = document.body.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(newTheme);
  localStorage.setItem('oneprep_theme', newTheme);
  const msg = `Switched to ${newTheme} mode!`;
  showToast(msg);
  // Close menu if open
  const menu = document.getElementById('sh-menu');
  if (menu) menu.style.display = 'none';
}

function toggleDark() {
  toggleTheme();
}

// --- COUNTDOWN TIMER ---
function initCountdown() {
  const targetDate = new Date("2026-12-05T08:00:00"); // Real Dec 5, 2026 SAT date
  
  function updateCountdown() {
    const diff = targetDate.getTime() - new Date().getTime();
    if (diff <= 0) {
      document.getElementById('tcc-days').textContent = '0';
      document.getElementById('tcc-hours').textContent = '00';
      document.getElementById('tcc-minutes').textContent = '00';
      return;
    }
    
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    const daysEl = document.getElementById('tcc-days');
    const hoursEl = document.getElementById('tcc-hours');
    const minsEl = document.getElementById('tcc-minutes');
    
    if (daysEl) daysEl.textContent = String(d);
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
  }
  
  updateCountdown();
  setInterval(updateCountdown, 60000); // Update every minute to be efficient
}

// --- TASKS INTERACTION ---
function toggleTask(taskEl) {
  taskEl.classList.toggle('done');
  const cb = taskEl.querySelector('.task-cb');
  
  if (taskEl.classList.contains('done')) {
    cb.textContent = '✓';
    showToast('Task completed! Keep it up! 🔥');
  } else {
    cb.textContent = '';
    showToast('Task active.');
  }
  
  updateTasksProgress();
}

function updateTasksProgress() {
  const tasks = document.querySelectorAll('#tasks-list .task');
  const done = document.querySelectorAll('#tasks-list .task.done');
  const pill = document.getElementById('tasks-pill');
  if (pill) {
    pill.textContent = `${done.length} / ${tasks.length} Done`;
  }
}

// --- PAST EXAMS DATABASE (REAL SAT EXAMS & VERSIONS SPEC) ---
const pastExamsDb = [
  {
    year: 2026,
    month: "March",
    intl: ["A", "B", "C"],
    us: ["A", "B"]
  },
  {
    year: 2025,
    month: "December",
    intl: ["A", "B", "C", "D"],
    us: ["A", "B", "C"]
  },
  {
    year: 2025,
    month: "November",
    intl: ["A", "B", "C"],
    us: ["A"]
  },
  {
    year: 2025,
    month: "October",
    intl: ["A", "B"],
    us: ["A", "B"]
  },
  {
    year: 2025,
    month: "August",
    intl: ["A", "B", "C"],
    us: ["A", "B"]
  },
  {
    year: 2025,
    month: "June",
    intl: ["A", "B"],
    us: ["A", "B", "C"]
  },
  {
    year: 2025,
    month: "May",
    intl: ["A", "B", "C"],
    us: ["A"]
  },
  {
    year: 2025,
    month: "March",
    intl: ["A", "B", "C", "D", "E"],
    us: ["A", "B", "C"]
  },
  {
    year: 2024,
    month: "December",
    intl: ["A", "B", "C", "D"],
    us: ["A", "B", "C"]
  },
  {
    year: 2024,
    month: "November",
    intl: ["A", "B", "C", "D"],
    us: ["A", "B"]
  },
  {
    year: 2024,
    month: "October",
    intl: ["A", "B", "C"],
    us: ["A", "B", "C"]
  },
  {
    year: 2024,
    month: "August",
    intl: ["A", "B"],
    us: ["A", "B", "C", "D", "E"]
  },
  {
    year: 2024,
    month: "June",
    intl: ["A", "B", "C"],
    us: ["A", "B"]
  },
  {
    year: 2024,
    month: "May",
    intl: ["A", "B"],
    us: ["A", "B"]
  },
  {
    year: 2024,
    month: "March",
    intl: ["A", "B"],
    us: ["A", "B"]
  }
];

// --- PAST EXAMS SEARCH ---
function filterExams(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.ecl-card').forEach(card => {
    const name = card.getAttribute('data-name') || '';
    if (name.includes(q)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function clearSearch() {
  const searchInput = document.getElementById('exam-search');
  if (searchInput) searchInput.value = '';
  filterExams('');
}

function renderPastExams() {
  const englishList = document.getElementById('english-list');
  const mathList = document.getElementById('math-list');
  
  if (!englishList || !mathList) return;
  
  englishList.innerHTML = '';
  mathList.innerHTML = '';
  
  pastExamsDb.forEach(exam => {
    // Generate English & Reading Versions
    // International versions
    exam.intl.forEach(v => {
      const cardName = `${exam.month} ${exam.year} Int-${v} ebrw english reading writing`.toLowerCase();
      const progress1 = Math.floor(Math.random() * 40) + 30;
      const progress2 = Math.floor(Math.random() * 40) + 40;
      const title = `${exam.month} ${exam.year} (Int-${v})`;
      
      const cardHtml = `
        <article class="ecl-card ecl-card-english" data-name="${cardName}">
          <div class="ecl-card-header">
            <div>
              <h4>${exam.month} ${exam.year} (Int-${v})</h4>
              <span class="ecl-card-sub">EBRW Practice</span>
            </div>
            <span class="ecl-badge official">INT-${v}</span>
          </div>
          
          <div class="ecl-card-body">
            <div class="ecl-bg-illustration">📖</div>
            
            <div class="ecl-row">
              <div class="ecl-row-info">
                <strong>Reading Comprehension</strong>
                <small>32 min • 27 questions</small>
                <div class="ecl-row-btns">
                  <button class="btn-practice-pill" onclick="startModule('english_m1', '${title}')">✓ PRACTICE</button>
                  <button class="btn-review-pill" onclick="show('review')">REVIEW</button>
                </div>
              </div>
              <div class="progress-ring-box" style="--p:${progress1}">
                <svg viewBox="0 0 36 36" class="pr-svg">
                  <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="pr-fill" stroke-dasharray="${progress1}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span>${progress1}%</span>
              </div>
            </div>
            
            <div class="ecl-divider"></div>
            
            <div class="ecl-row">
              <div class="ecl-row-info">
                <strong>Writing & Language</strong>
                <small>32 min • 27 questions</small>
                <div class="ecl-row-btns">
                  <button class="btn-practice-pill" onclick="startModule('english_m2', '${title}')">✓ PRACTICE</button>
                  <button class="btn-review-pill" onclick="show('review')">REVIEW</button>
                </div>
              </div>
              <div class="progress-ring-box" style="--p:${progress2}">
                <svg viewBox="0 0 36 36" class="pr-svg">
                  <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="pr-fill" stroke-dasharray="${progress2}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span>${progress2}%</span>
              </div>
            </div>
          </div>
        </article>
      `;
      englishList.insertAdjacentHTML('beforeend', cardHtml);
    });
    
    // US versions
    exam.us.forEach(v => {
      const cardName = `${exam.month} ${exam.year} US-${v} ebrw english reading writing`.toLowerCase();
      const progress1 = Math.floor(Math.random() * 40) + 30;
      const progress2 = Math.floor(Math.random() * 40) + 40;
      const title = `${exam.month} ${exam.year} (US-${v})`;
      
      const cardHtml = `
        <article class="ecl-card ecl-card-english" data-name="${cardName}">
          <div class="ecl-card-header">
            <div>
              <h4>${exam.month} ${exam.year} (US-${v})</h4>
              <span class="ecl-card-sub">EBRW Practice</span>
            </div>
            <span class="ecl-badge official" style="background: var(--blue-glow); color: var(--blue);">US-${v}</span>
          </div>
          
          <div class="ecl-card-body">
            <div class="ecl-bg-illustration">📖</div>
            
            <div class="ecl-row">
              <div class="ecl-row-info">
                <strong>Reading Comprehension</strong>
                <small>32 min • 27 questions</small>
                <div class="ecl-row-btns">
                  <button class="btn-practice-pill" onclick="startModule('english_m1', '${title}')">✓ PRACTICE</button>
                  <button class="btn-review-pill" onclick="show('review')">REVIEW</button>
                </div>
              </div>
              <div class="progress-ring-box" style="--p:${progress1}">
                <svg viewBox="0 0 36 36" class="pr-svg">
                  <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="pr-fill" stroke-dasharray="${progress1}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span>${progress1}%</span>
              </div>
            </div>
            
            <div class="ecl-divider"></div>
            
            <div class="ecl-row">
              <div class="ecl-row-info">
                <strong>Writing & Language</strong>
                <small>32 min • 27 questions</small>
                <div class="ecl-row-btns">
                  <button class="btn-practice-pill" onclick="startModule('english_m2', '${title}')">✓ PRACTICE</button>
                  <button class="btn-review-pill" onclick="show('review')">REVIEW</button>
                </div>
              </div>
              <div class="progress-ring-box" style="--p:${progress2}">
                <svg viewBox="0 0 36 36" class="pr-svg">
                  <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="pr-fill" stroke-dasharray="${progress2}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span>${progress2}%</span>
              </div>
            </div>
          </div>
        </article>
      `;
      englishList.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Generate Math Versions
    // International versions
    exam.intl.forEach(v => {
      const cardName = `${exam.month} ${exam.year} Int-${v} math mathematics`.toLowerCase();
      const progress1 = Math.floor(Math.random() * 40) + 30;
      const progress2 = Math.floor(Math.random() * 40) + 40;
      const title = `${exam.month} ${exam.year} (Int-${v})`;
      
      const cardHtml = `
        <article class="ecl-card ecl-card-math" data-name="${cardName}">
          <div class="ecl-card-header">
            <div>
              <h4>${exam.month} ${exam.year} (Int-${v})</h4>
              <span class="ecl-card-sub">Math Practice</span>
            </div>
            <span class="ecl-badge official btn-math">INT-${v}</span>
          </div>
          
          <div class="ecl-card-body">
            <div class="ecl-bg-illustration math-bg">＋１<br>✕＝</div>
            
            <div class="ecl-row">
              <div class="ecl-row-info">
                <strong>Module 1</strong>
                <small>35 min • 22 questions</small>
                <div class="ecl-row-btns">
                  <button class="btn-practice-pill btn-math" onclick="startModule('math_m1', '${title}')">+ TRY NOW</button>
                  <button class="btn-review-pill" onclick="show('review')">REVIEW</button>
                </div>
              </div>
              <div class="progress-ring-box math-ring" style="--p:${progress1}">
                <svg viewBox="0 0 36 36" class="pr-svg">
                  <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="pr-fill" stroke-dasharray="${progress1}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span>${progress1}%</span>
              </div>
            </div>
            
            <div class="ecl-divider"></div>
            
            <div class="ecl-row">
              <div class="ecl-row-info">
                <strong>Module 2</strong>
                <small>35 min • 22 questions</small>
                <div class="ecl-row-btns">
                  <button class="btn-practice-pill btn-math" onclick="startModule('math_m2', '${title}')">+ TRY NOW</button>
                  <button class="btn-review-pill" onclick="show('review')">REVIEW</button>
                </div>
              </div>
              <div class="progress-ring-box math-ring" style="--p:${progress2}">
                <svg viewBox="0 0 36 36" class="pr-svg">
                  <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="pr-fill" stroke-dasharray="${progress2}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span>${progress2}%</span>
              </div>
            </div>
          </div>
        </article>
      `;
      mathList.insertAdjacentHTML('beforeend', cardHtml);
    });
    
    // US versions
    exam.us.forEach(v => {
      const cardName = `${exam.month} ${exam.year} US-${v} math mathematics`.toLowerCase();
      const progress1 = Math.floor(Math.random() * 40) + 30;
      const progress2 = Math.floor(Math.random() * 40) + 40;
      const title = `${exam.month} ${exam.year} (US-${v})`;
      
      const cardHtml = `
        <article class="ecl-card ecl-card-math" data-name="${cardName}">
          <div class="ecl-card-header">
            <div>
              <h4>${exam.month} ${exam.year} (US-${v})</h4>
              <span class="ecl-card-sub">Math Practice</span>
            </div>
            <span class="ecl-badge official btn-math" style="background: var(--blue-glow); color: var(--blue);">US-${v}</span>
          </div>
          
          <div class="ecl-card-body">
            <div class="ecl-bg-illustration math-bg">＋１<br>✕＝</div>
            
            <div class="ecl-row">
              <div class="ecl-row-info">
                <strong>Module 1</strong>
                <small>35 min • 22 questions</small>
                <div class="ecl-row-btns">
                  <button class="btn-practice-pill btn-math" onclick="startModule('math_m1', '${title}')">+ TRY NOW</button>
                  <button class="btn-review-pill" onclick="show('review')">REVIEW</button>
                </div>
              </div>
              <div class="progress-ring-box math-ring" style="--p:${progress1}">
                <svg viewBox="0 0 36 36" class="pr-svg">
                  <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="pr-fill" stroke-dasharray="${progress1}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span>${progress1}%</span>
              </div>
            </div>
            
            <div class="ecl-divider"></div>
            
            <div class="ecl-row">
              <div class="ecl-row-info">
                <strong>Module 2</strong>
                <small>35 min • 22 questions</small>
                <div class="ecl-row-btns">
                  <button class="btn-practice-pill btn-math" onclick="startModule('math_m2', '${title}')">+ TRY NOW</button>
                  <button class="btn-review-pill" onclick="show('review')">REVIEW</button>
                </div>
              </div>
              <div class="progress-ring-box math-ring" style="--p:${progress2}">
                <svg viewBox="0 0 36 36" class="pr-svg">
                  <path class="pr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="pr-fill" stroke-dasharray="${progress2}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span>${progress2}%</span>
              </div>
            </div>
          </div>
        </article>
      `;
      mathList.insertAdjacentHTML('beforeend', cardHtml);
    });
  });
}

// --- VOCABULARY CRUD ---
function renderVocab() {
  console.log('[VOCAB] renderVocab called, updating UI with', vocabularyDb.length, 'words');
  
  const container = document.getElementById('vocab-list');
  const countSpan = document.getElementById('vocab-count');
  
  if (!container) {
    console.warn('[VOCAB] vocab-list container not found');
    return;
  }
  
  const masteredCount = vocabularyDb.filter(w => w.mastered).length;
  countSpan.textContent = `${masteredCount} word${masteredCount !== 1 ? 's' : ''} mastered • ${vocabularyDb.length} total`;
  updateVocabWidget();
  
  if (vocabularyDb.length === 0) {
    container.innerHTML = `<p style="color: var(--text-sub); text-align: center; padding: 20px; font-size: 13px;">No words saved yet. Start by typing a word in the exam.</p>`;
    return;
  }
  
  container.innerHTML = vocabularyDb.map(w => {
    // Generate icon based on word
    let icon = "📚";
    if (w.word && w.word.toLowerCase().includes("ambiguous")) icon = "✍️";
    else if (w.word && w.word.toLowerCase().includes("ephemeral")) icon = "☁️";
    else if (w.word && w.word.toLowerCase().includes("eloquent")) icon = "🗣️";
    else if (w.word && w.word.toLowerCase().includes("aberration")) icon = "🏛️";
    else if (w.word && w.word.toLowerCase().includes("ameliorate")) icon = "🌿";
    
    // MongoDB structure: {_id, userId, word, definition, context, mastered, addedAt}
    return `
      <div class="vocab-feed-item" style="opacity: ${w.mastered ? 0.6 : 1};">
        <div class="vfi-icon">${icon}</div>
        <div class="vfi-content">
          <div class="vfi-word-row">
            <strong class="vfi-word">${escapeHtml(w.word)}</strong>
            <button class="vfi-del" onclick="deleteWordHandler('${w._id}')" title="Delete word" style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 16px;">✕</button>
          </div>
          <p class="vfi-def">${escapeHtml(w.definition || 'Definition not found')}</p>
          ${w.context ? `<span class="vfi-src">${escapeHtml(w.context)}</span>` : ''}
          <label style="margin-top: 8px; display: flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer;">
            <input type="checkbox" ${w.mastered ? 'checked' : ''} onchange="toggleMastered('${w._id}', this.checked)" style="cursor: pointer;">
            <span>Mastered</span>
          </label>
        </div>
      </div>
    `;
  }).join('');
}

function toggleAddForm() {
  const form = document.getElementById('add-form');
  const btn = document.getElementById('btn-add');
  if (form.style.display === 'none') {
    form.style.display = 'flex';
    btn.style.display = 'none';
  } else {
    form.style.display = 'none';
    btn.style.display = 'block';
    // Clear inputs
    document.getElementById('f-word').value = '';
    document.getElementById('f-pos').value = '';
    document.getElementById('f-def').value = '';
    document.getElementById('f-src').value = '';
  }
}

function saveWord(btnElement) {
  let btn = btnElement;
  if (btnElement && btnElement.target) {
    btn = btnElement.target;
  } else if (!btn) {
    btn = document.getElementById('btn-add') || document.querySelector('.save-vocab-btn');
  }

  const wordEl = document.getElementById('f-word') || document.getElementById('vocab-word-input');
  const defEl = document.getElementById('f-def') || document.getElementById('vocab-def-input');
  const srcEl = document.getElementById('f-src') || document.getElementById('vocab-src-input');
  
  if (!wordEl) return;
  
  const word = wordEl.value.trim();
  const def = defEl ? defEl.value.trim() : '';
  const src = srcEl ? srcEl.value.trim() : '';
  
  if (!word) {
    showToast('Word is required! ⚠️');
    return;
  }
  
  console.log(`[VOCAB-UI] User clicked save for word: ${word}`);
  
  saveVocabularyToAPI(word, src || 'Exam practice').then(savedWord => {
    if (savedWord) {
      vocabularyDb.unshift(savedWord);
      renderVocab();
      if (typeof toggleAddForm === 'function' && document.getElementById('add-form') && document.getElementById('add-form').style.display !== 'none') {
        toggleAddForm();
      }
      showToast(`Saved "${word}" to Vocabulary Bank!`);
      
      if (btn) {
        const originalText = btn.textContent;
        const originalBg = btn.style.backgroundColor;
        btn.textContent = '✓ Saved!';
        btn.style.backgroundColor = '#22c55e';
        btn.style.color = '#ffffff';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = originalBg;
        }, 2000);
      }
      
      updateVocabWidget();
    } else {
      showToast(`Failed to save "${word}" - check console`);
    }
  });
}

async function deleteWordHandler(wordId) {
  console.log('[VOCAB] deleteWordHandler called, wordId:', wordId);
  const deleted = await deleteVocabularyFromAPI(wordId);
  if (deleted) {
    vocabularyDb = vocabularyDb.filter(w => w._id !== wordId);
    renderVocab();
    showToast('Deleted word from bank.');
  } else {
    showToast('Failed to delete word');
  }
}

async function toggleMastered(wordId, mastered) {
  console.log('[VOCAB] toggleMastered called, wordId:', wordId, 'mastered:', mastered);
  const updated = await updateMasteredStatus(wordId, mastered);
  if (updated) {
    const idx = vocabularyDb.findIndex(w => w._id === wordId);
    if (idx !== -1) {
      vocabularyDb[idx].mastered = mastered;
      renderVocab();
      showToast(mastered ? 'Marked as mastered!' : 'Unmarked as mastered');
    }
  }
}

// --- VOCAB FLASHCARD QUIZ ---
function launchQuiz() {
  if (vocabularyDb.length === 0) {
    showToast('Vocabulary Bank is empty! ⚠️');
    return;
  }
  
  similarQuizDeck = [...vocabularyDb].sort(() => Math.random() - 0.5);
  similarQuizIdx = 0;
  
  document.getElementById('quiz-modal').style.display = 'flex';
  renderQuizSlide();
}

function closeQuiz() {
  document.getElementById('quiz-modal').style.display = 'none';
}

function renderQuizSlide() {
  const content = document.getElementById('quiz-content');
  if (similarQuizIdx >= similarQuizDeck.length) {
    content.innerHTML = `
      <div class="quiz-card" style="padding: 20px 0;">
        <div style="font-size: 48px; margin-bottom: 12px;">🏆</div>
        <h3>Daily Deck Complete!</h3>
        <p style="color: var(--text-sub); margin: 12px 0 20px;">You reviewed all ${similarQuizDeck.length} words in your bank.</p>
        <button class="btn-primary" onclick="closeQuiz()">Close</button>
      </div>
    `;
    return;
  }
  
  const w = similarQuizDeck[similarQuizIdx];
  content.innerHTML = `
    <div class="quiz-card">
      <span style="font-size: 11px; font-weight: 700; color: var(--primary); text-transform: uppercase;">Flashcard ${similarQuizIdx + 1} of ${similarQuizDeck.length}</span>
      <div class="qc-word" style="margin-top: 12px;">${escapeHtml(w.word)}</div>
      <div class="qc-def" style="margin: 20px 0; border: 1px dashed var(--border); padding: 16px; border-radius: var(--radius-md); background: var(--bg-app);">${escapeHtml(w.definition || w.def || 'Definition not found')}</div>
      ${w.context ? `<span class="qc-src">Context: ${escapeHtml(w.context)}</span>` : ''}
      ${w.src ? `<span class="qc-src">Source: ${escapeHtml(w.src)}</span>` : ''}
      <div class="modal-actions" style="margin-top: 24px;">
        <button class="btn-primary" onclick="nextQuizSlide()">Next Word →</button>
      </div>
    </div>
  `;
}

function nextQuizSlide() {
  similarQuizIdx++;
  renderQuizSlide();
}

// --- LIVE DIGITAL SAT SIMULATOR ENGINE ---
function startModule(moduleKey, customTitle) {
  if (typeof june2024ExamDb === 'undefined' || !june2024ExamDb.modules[moduleKey]) {
    showToast('Module data not loaded! ⚠️');
    return;
  }
  
  const moduleData = june2024ExamDb.modules[moduleKey];
  currentSimModule = moduleKey;
  currentSimQuestions = moduleData.questions;
  currentSimIdx = 0;
  userSimAnswers = {};
  flaggedSimQuestions = {};
  
  // Set timers
  simTimeRemaining = moduleData.limitMinutes * 60;
  
  // Show active screen
  document.getElementById('sim-welcome').style.display = 'none';
  document.getElementById('sim-results').style.display = 'none';
  document.getElementById('sim-active').style.display = 'block';
  
  // Set header
  const titleText = moduleKey.includes('english') ? 'Reading and Writing' : 'Mathematics';
  const modNum = moduleKey.endsWith('m1') ? 'Module 1' : 'Module 2';
  document.getElementById('sh-title').textContent = customTitle ? `${customTitle} - ${modNum}` : `${titleText} (${modNum})`;
  
  show('simulator');
  
  // Timer loop
  if (simTimerInterval) clearInterval(simTimerInterval);
  updateTimerUI();
  simTimerInterval = setInterval(() => {
    simTimeRemaining--;
    updateTimerUI();
    if (simTimeRemaining <= 0) {
      clearInterval(simTimerInterval);
      showToast('Time expired! Automatically submitting... ⏰');
      finishModule();
    }
  }, 1000);
  
  // Render nodes & load first question
  renderNavigatorNodes();
  loadQuestion(0);
}

function updateTimerUI() {
  const m = Math.floor(simTimeRemaining / 60);
  const s = simTimeRemaining % 60;
  document.getElementById('sh-timer').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function renderNavigatorNodes() {
  const container = document.getElementById('snb-nodes');
  container.innerHTML = '';
  
  currentSimQuestions.forEach((q, idx) => {
    const node = document.createElement('div');
    node.className = 'snb-node';
    node.textContent = idx + 1;
    node.onclick = () => loadQuestion(idx);
    
    // States
    if (idx === currentSimIdx) {
      node.classList.add('active');
    } else if (flaggedSimQuestions[idx]) {
      node.classList.add('flagged');
    } else if (userSimAnswers[idx] !== undefined) {
      node.classList.add('answered');
    }
    
    container.appendChild(node);
  });
}

function loadQuestion(idx) {
  currentSimIdx = idx;
  const q = currentSimQuestions[idx];
  
  // Badge
  document.getElementById('sp-badge').textContent = `${idx + 1} of ${currentSimQuestions.length}`;
  
  // Passage / prompt content
  document.getElementById('sp-content').innerHTML = q.passage || `<div style="padding: 40px 0; text-align: center; color: var(--text-sub);">Mathematics Problem. Refer to equation details on the right pane.</div>`;
  
  // Question & Option
  document.getElementById('sim-q').innerHTML = q.question;
  
  // Explanation hidden
  document.getElementById('expl-box').style.display = 'none';
  
  // Mark for Review button state
  const markBtn = document.getElementById('mark-review-btn');
  if (markBtn) {
    if (flaggedSimQuestions[idx]) {
      markBtn.classList.add('flagged');
      markBtn.textContent = '✓ Marked for Review';
    } else {
      markBtn.classList.remove('flagged');
      markBtn.textContent = 'Mark for Review';
    }
  }
  
  const optsContainer = document.getElementById('sim-opts');
  const gridInContainer = document.getElementById('grid-in');
  
  if (q.type === 'student-produced') {
    // Grid-in
    optsContainer.style.display = 'none';
    gridInContainer.style.display = 'flex';
    document.getElementById('grid-input').value = userSimAnswers[idx] || '';
  } else {
    // MCQ
    optsContainer.style.display = 'flex';
    gridInContainer.style.display = 'none';
    
    optsContainer.innerHTML = '';
    Object.entries(q.options).forEach(([char, text]) => {
      const optDiv = document.createElement('button');
      optDiv.className = 'sim-opt';
      optDiv.onclick = () => selectOption(char);
      
      const letter = document.createElement('span');
      letter.className = 'sim-opt-letter';
      letter.textContent = char;
      
      const content = document.createElement('span');
      content.innerHTML = text;
      
      optDiv.appendChild(letter);
      optDiv.appendChild(content);
      
      // Restore selected state if answered
      if (userSimAnswers[idx] === char) {
        optDiv.classList.add('selected');
        // Show correct / incorrect feedback instantly if practicing
        if (char === q.answer) {
          optDiv.classList.add('correct');
        } else {
          optDiv.classList.add('incorrect');
        }
        showExplanation(char === q.answer, q.answer, q.explanation);
      }
      
      optsContainer.appendChild(optDiv);
    });
  }
  
  // Nav buttons display
  document.getElementById('btn-back').style.display = (idx === 0) ? 'none' : 'block';
  if (idx === currentSimQuestions.length - 1) {
    document.getElementById('btn-next').style.display = 'none';
    document.getElementById('btn-finish').style.display = 'block';
  } else {
    document.getElementById('btn-next').style.display = 'block';
    document.getElementById('btn-finish').style.display = 'none';
  }
  
  renderNavigatorNodes();
}

function selectOption(char) {
  const q = currentSimQuestions[currentSimIdx];
  userSimAnswers[currentSimIdx] = char;
  
  // Load question again to render direct green/red feedback & explanations
  loadQuestion(currentSimIdx);
  
  // Save vocab automatically if a difficult context vocabulary question is wrong
  if (char !== q.answer && q.type === 'vocabulary') {
    // Attempt to parse out word title
    const wordClean = q.passage.match(/______ feelings/i) ? 'Engender' : 'Adept';
    // Add to vocab bank if not already in
    if (!vocabularyDb.some(w => w.word.toLowerCase() === wordClean.toLowerCase())) {
      console.log('[VOCAB] Auto-saving missed vocabulary word:', wordClean);
      saveVocabularyToAPI(wordClean, `Simulator Error, Question ${currentSimIdx + 1}`).then(savedWord => {
        if (savedWord) {
          vocabularyDb.push(savedWord);
          renderVocab();
          console.log('[VOCAB] Auto-saved word, vocabularyDb now has', vocabularyDb.length, 'words');
        }
      });
    }
  }
}

function submitGridIn() {
  const val = document.getElementById('grid-input').value.trim();
  if (!val) return;
  
  const q = currentSimQuestions[currentSimIdx];
  userSimAnswers[currentSimIdx] = val;
  
  const isCorrect = (val === q.answer);
  showExplanation(isCorrect, q.answer, q.explanation);
  renderNavigatorNodes();
}

function showExplanation(isCorrect, answer, explanation) {
  const box = document.getElementById('expl-box');
  const verdict = document.getElementById('expl-verdict');
  const text = document.getElementById('expl-text');
  
  box.style.display = 'block';
  if (isCorrect) {
    verdict.textContent = '🎉 Correct Option!';
    verdict.style.color = 'var(--green)';
  } else {
    verdict.textContent = `❌ Incorrect. Correct answer is ${answer}`;
    verdict.style.color = 'var(--red)';
  }
  
  text.innerHTML = explanation;
}

function toggleFlag() {
  flaggedSimQuestions[currentSimIdx] = !flaggedSimQuestions[currentSimIdx];
  const btn = document.getElementById('mark-review-btn');
  if (btn) {
    if (flaggedSimQuestions[currentSimIdx]) {
      btn.classList.add('flagged');
      btn.textContent = '✓ Marked for Review';
    } else {
      btn.classList.remove('flagged');
      btn.textContent = 'Mark for Review';
    }
  }
  renderNavigatorNodes();
}

function toggleDirections() {
  showToast('Directions: Review the problem passage and select the best answer.');
}

function toggleHighlight() {
  showToast('Highlight mode toggled for the current passage.');
}

function toggleSimMenu() {
  const menu = document.getElementById('sh-menu');
  if (menu) {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  }
}

function saveAndExit() {
  if (confirm('Save your progress and exit this module?')) {
    if (simTimerInterval) clearInterval(simTimerInterval);
    document.getElementById('sim-active').style.display = 'none';
    document.getElementById('sim-welcome').style.display = 'block';
    show('simulator');
    showToast('Progress saved! Return anytime to resume.');
  }
}

function goQuestion(dir) {
  const target = currentSimIdx + dir;
  if (target >= 0 && target < currentSimQuestions.length) {
    loadQuestion(target);
  }
}

function nextQuestion() {
  goQuestion(1);
}

function quitSim() {
  if (confirm('Are you sure you want to quit the active session? All progress on this module will be lost.')) {
    if (simTimerInterval) clearInterval(simTimerInterval);
    document.getElementById('sim-active').style.display = 'none';
    document.getElementById('sim-welcome').style.display = 'block';
    show('simulator');
  }
}

function finishModule() {
  if (simTimerInterval) clearInterval(simTimerInterval);
  
  let correct = 0;
  
  currentSimQuestions.forEach((q, idx) => {
    const userAns = userSimAnswers[idx];
    if (userAns !== undefined && String(userAns).trim().toLowerCase() === String(q.answer).trim().toLowerCase()) {
      correct++;
    } else {
      // Log wrong answers to mistakesDb for review panel
      const alreadyLogged = mistakesDb.some(err => err.questionId === `${currentSimModule}-${idx + 1}`);
      if (!alreadyLogged) {
        const trapMap = {
          A: `You selected option 'A'. A common distractor trap that sounds correct but is grammatically or semantically disconnected.`,
          B: `You selected option 'B'. This choice represents a common misconception that flips the logical relationship established in the passage.`,
          C: `You selected option 'C'. This option is too broad or too extreme, extending past direct evidence in the paragraph.`,
          D: `You selected option 'D'. A vocabulary precision error that shifts the author's primary theme.`
        };
        
        mistakesDb.push({
          id: `err_${Date.now()}_${idx}`,
          questionId: `${currentSimModule.toUpperCase()}-Q${idx + 1}`,
          section: currentSimModule.includes('english') ? 'Reading & Writing' : 'Math',
          module: currentSimModule.includes('m1') ? 'Module 1' : 'Module 2',
          conceptArea: q.type === 'vocabulary' ? 'Vocabulary in Context' : (currentSimModule.includes('english') ? 'Craft & Structure' : 'Algebra'),
          difficulty: 'Medium',
          passage: q.passage || '',
          question: q.question,
          options: q.options || { A: 'A', B: 'B', C: 'C', D: 'D' },
          userAnswer: userAns || 'Unanswered',
          correctAnswer: q.answer,
          misconception: trapMap[userAns] || 'You missed this question. Double-check your formulas or passage context details.',
          underlyingRule: currentSimModule.includes('english') ? "Precision & Connotation: Words must match structural directives precisely without logical shifts." : "Linear Systems: Keep operations clean on both sides of equal markers.",
          quickFix: currentSimModule.includes('english') ? "Quick Fix: Eliminate options containing synonyms of extreme claims." : "Quick Fix: Plug option coordinates directly into expressions.",
          similarQuestion: {
            passage: q.passage || "Similar practice problem.",
            question: q.question,
            options: q.options || { A: 'A', B: 'B', C: 'C', D: 'D' },
            answer: q.answer,
            explanation: q.explanation
          }
        });
      }
    }
  });
  
  localStorage.setItem('oneprep_mistakes', JSON.stringify(mistakesDb));
  renderMistakes();
  
  const total = currentSimQuestions.length;
  const pct = Math.round((correct / total) * 100);
  
  // Results
  document.getElementById('sim-active').style.display = 'none';
  document.getElementById('sim-results').style.display = 'block';
  
  document.getElementById('sr-correct').textContent = correct;
  document.getElementById('sr-total').textContent = total;
  document.getElementById('sr-pct').textContent = `${pct}% Accuracy`;
}

// --- REVIEW MISTAKES VIEW ---
function renderMistakes() {
  const list = document.getElementById('review-list');
  const detail = document.getElementById('review-detail');
  
  if (!list || !detail) return;
  
  if (mistakesDb.length === 0) {
    list.innerHTML = `<p style="color: var(--text-sub); text-align: center; padding: 20px;">No mistakes currently logged. Complete simulated tests first!</p>`;
    detail.innerHTML = `<div class="rd-placeholder">🎉 You have zero mistakes logged! Perfect record.</div>`;
    return;
  }
  
  // Render vertical list
  list.innerHTML = mistakesDb.map(m => {
    const isActive = m.id === activeMistakeId;
    return `
      <div class="mistake-card ${isActive ? 'active' : ''}" onclick="selectMistake('${m.id}')">
        <div class="mc-header">
          <span>${m.questionId}</span>
          <span class="mc-difficulty ${m.difficulty.toLowerCase()}">${m.difficulty}</span>
        </div>
        <h4>${m.conceptArea}</h4>
        <p>${m.section} · ${m.module}</p>
      </div>
    `;
  }).join('');
  
  // Load active detail
  const activeObj = mistakesDb.find(m => m.id === activeMistakeId) || mistakesDb[0];
  if (activeObj) {
    activeMistakeId = activeObj.id;
    
    let optionsList = '';
    if (activeObj.options) {
      Object.entries(activeObj.options).forEach(([char, text]) => {
        let stateClass = '';
        if (char === activeObj.correctAnswer) stateClass = 'correct';
        if (char === activeObj.userAnswer) stateClass = 'user-wrong';
        
        optionsList += `
          <div class="rd-option ${stateClass}">
            <strong>${char}</strong> ${text}
            ${char === activeObj.correctAnswer ? ' (Correct Answer)' : ''}
            ${char === activeObj.userAnswer ? ' (Your Wrong Choice)' : ''}
          </div>
        `;
      });
    }
    
    detail.innerHTML = `
      <div class="rd-header">
        <h2>${activeObj.questionId} Analysis</h2>
        <span>${activeObj.section} · ${activeObj.module}</span>
      </div>
      
      ${activeObj.passage ? `<div class="rd-passage">${activeObj.passage}</div>` : ''}
      <div class="rd-question">${activeObj.question}</div>
      <div class="sim-options" style="margin-bottom: 24px;">${optionsList}</div>
      
      <div class="rd-section-title">🎯 WHY YOU GOT IT WRONG</div>
      <p style="margin-bottom: 20px; font-size: 13.5px; line-height: 1.5; color: var(--text-sub);">${activeObj.misconception}</p>
      
      <div class="rd-section-title">📚 UNDERLYING RULE</div>
      <p class="rd-rule" style="margin-bottom: 20px;">${activeObj.underlyingRule}</p>
      
      <div class="rd-section-title">💡 STRATEGIC SHORTCUT</div>
      <p class="rd-fix">${activeObj.quickFix}</p>
    `;
  }
}

function selectMistake(id) {
  activeMistakeId = id;
  renderMistakes();
}

// --- WEEKLY STACKED BARS AND HEATMAPS ---
const analyticsWeeksData = [
  { label: 'Mar 24', total: 45, red: 14, orange: 8,  lightGreen: 13, vibrantGreen: 10 },
  { label: 'Mar 31', total: 41, red: 12, orange: 5,  lightGreen: 14, vibrantGreen: 10 },
  { label: 'Apr 7',  total: 57, red: 18, orange: 11, lightGreen: 16, vibrantGreen: 12 },
  { label: 'Apr 14', total: 50, red: 16, orange: 6,  lightGreen: 18, vibrantGreen: 10 },
  { label: 'Apr 21', total: 62, red: 12, orange: 11, lightGreen: 23, vibrantGreen: 16 },
  { label: 'Apr 28', total: 56, red: 14, orange: 6,  lightGreen: 21, vibrantGreen: 15 },
  { label: 'May 5',  total: 70, red: 16, orange: 15, lightGreen: 24, vibrantGreen: 15 },
  { label: 'May 12', total: 63, red: 12, orange: 6,  lightGreen: 25, vibrantGreen: 20 },
  { label: 'May 19', total: 75, red: 15, orange: 11, lightGreen: 24, vibrantGreen: 25 },
  { label: 'May 26', total: 72, red: 12, orange: 8,  lightGreen: 22, vibrantGreen: 30 },
  { label: 'Jun 2',  total: 80, red: 10, orange: 10, lightGreen: 25, vibrantGreen: 35 }
];

function renderStackedBars() {
  const container = document.getElementById('stacked-bars-container');
  if (!container) return;
  
  container.innerHTML = analyticsWeeksData.map(week => {
    const barHeightPct = (week.total / 80) * 100;
    const redPct = (week.red / week.total) * 100;
    const orangePct = (week.orange / week.total) * 100;
    const lightGreenPct = (week.lightGreen / week.total) * 100;
    const vibrantGreenPct = (week.vibrantGreen / week.total) * 100;
    
    return `
      <div class="bar-column" style="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%;">
        <div class="chart-stacked-bar" style="height: ${barHeightPct}%;">
          <div class="bar-segment segment-red" style="height: ${redPct}%;"></div>
          <div class="bar-segment segment-orange" style="height: ${orangePct}%;"></div>
          <div class="bar-segment segment-lightgreen" style="height: ${lightGreenPct}%;"></div>
          <div class="bar-segment segment-vibrantgreen" style="height: ${vibrantGreenPct}%;"></div>
        </div>
        <span class="bar-date-label">${week.label}</span>
      </div>
    `;
  }).join('');
}

function generateHeatmap() {
  const aprilGrid = document.getElementById('heatmap-april-grid');
  const mayGrid = document.getElementById('heatmap-may-grid');
  
  if (!aprilGrid || !mayGrid) return;
  
  // April calendar dummy values (30 days)
  const aprilValues = [
    2, 3, 0, 1, 2, 0, 4,
    1, 2, 3, 0, 1, 2, 0,
    3, 0, 1, 2, 4, 3, 0,
    1, 2, 0, 3, 1, 2, 4,
    0, 2
  ];
  
  // May calendar dummy values (31 days)
  const mayValues = [
    3, 1, 2, 4, 0, 1, 2,
    0, 3, 1, 2, 4, 0, 2,
    1, 3, 0, 2, 4, 1, 0,
    2, 3, 1, 4, 0, 2, 3,
    0, 1, 4
  ];
  
  aprilGrid.innerHTML = '';
  aprilValues.forEach((val) => {
    const cell = document.createElement('div');
    cell.className = `hm-cell lvl-${val}`;
    cell.title = `Intensity: Level ${val}`;
    aprilGrid.appendChild(cell);
  });
  
  mayGrid.innerHTML = '';
  mayValues.forEach((val) => {
    const cell = document.createElement('div');
    cell.className = `hm-cell lvl-${val}`;
    cell.title = `Intensity: Level ${val}`;
    mayGrid.appendChild(cell);
  });
}

async function renderDashboardWidgets() {
  await renderConsistencyTracker();
  await renderDailyAgenda();
}

async function renderConsistencyTracker() {
  // Disabled: The consistency tracker is now rendered via EJS on the backend (server.js & index.html).
  return;
}

async function renderDailyAgenda() {
  try {
    const res = await fetch(API_BASE + '/api/planner/agenda');
    if (!res.ok) throw new Error('Failed to fetch agenda');
    const data = await res.json();
    let tasks = data.tasks;

    if (!tasks || tasks.length === 0) {
      const offlinePlans = JSON.parse(localStorage.getItem('oneprep_offline_plans')) || {};
      const planId = Object.keys(offlinePlans)[0];
      if (planId) {
        const planObj = offlinePlans[planId];
        const todayStr = new Date().toISOString().split('T')[0];
        let todaySchedule = planObj.plan.find(s => s.date === todayStr);
        if (!todaySchedule && planObj.plan.length > 0) todaySchedule = planObj.plan[0];
        
        if (todaySchedule) {
          const dayIndex = planObj.plan.indexOf(todaySchedule);
          tasks = todaySchedule.tasks.filter(t => t.type !== 'rest').map((t, idx) => ({
            taskId: `${planId}_day${dayIndex}_task${idx}`,
            topic: t.topic,
            subject: t.section || t.subject || 'Unknown',
            questions: t.questionCount || 20,
            time: t.estimatedMinutes || 30
          }));
        }
      }
    }

    const container = document.getElementById('daily-agenda-tasks');
    if (!container) return;

    if (!tasks || tasks.length === 0) {
      container.innerHTML = `<p class="dac-prompt">Create a study plan to get your daily agenda.</p>`;
      return;
    }

    const checkedTasks = JSON.parse(localStorage.getItem('oneprep_plan_checks')) || {};

    container.innerHTML = tasks.map(task => {
      let badgeBg = '#DBEAFE'; // Blue (Math default)
      let badgeColor = '#1E293B';
      let borderLeftColor = '#3B82F6';
      let subjectText = (task.subject || 'Math').toUpperCase();
      
      if (subjectText.includes('ENGLISH') || subjectText.includes('READING')) {
        badgeBg = '#FAE8FF'; // Fuchsia
        borderLeftColor = '#7C6FE0'; // purple
        subjectText = 'ENGLISH';
      } else if (subjectText.includes('VOCAB')) {
        badgeBg = '#FEF3C7'; // Amber
        borderLeftColor = '#10B981'; // green
        subjectText = 'VOCAB';
      } else {
        subjectText = 'MATH';
        borderLeftColor = '#3B82F6'; // blue
      }

      const isChecked = !!checkedTasks[task.taskId];
      const cbBg = isChecked ? '#7C6FE0' : '#fff';
      const cbBorder = isChecked ? '#7C6FE0' : '#D0CBF5';
      const checkOp = isChecked ? '1' : '0';
      const titleStyle = isChecked ? 'text-decoration: line-through; color: var(--text-sub);' : 'text-decoration: none; color: inherit;';
      const cardBg = isChecked ? '#F8F7FF' : '#ffffff';

      return `
        <div class="da-task-card ${isChecked ? 'completed' : ''}" onclick="startPracticeTopic('${task.topic}')" style="padding: 10px 16px; background: ${cardBg}; border: 1px solid #EDE9FE; border-radius: 0 20px 20px 0; border-left: 4px solid ${borderLeftColor}; display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <span style="background: ${badgeBg}; color: ${badgeColor}; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px;">${subjectText}</span>
            <h4 style="margin: 0; font-size: 14px; font-weight: 600; flex: 1; ${titleStyle}">${task.topic}</h4>
            <span style="font-size: 11px; background: #F3F2FF; color: #7C6FE0; padding: 2px 8px; border-radius: 20px;">${task.questions} Questions</span>
            <span style="font-size: 11px; background: #F3F2FF; color: #7C6FE0; padding: 2px 8px; border-radius: 20px;">~${task.time} min</span>
            <div class="da-task-checkbox" onclick="toggleAgendaTask(this, event, '${task.taskId}')" style="width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid ${cbBorder}; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; background: ${cbBg}; flex-shrink: 0;">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="check-icon" style="opacity: ${checkOp}; transition: opacity 0.2s;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
        </div>
      `;
    }).join('');

    if (typeof window.updateAgendaProgress === 'function') window.updateAgendaProgress();

  } catch (error) {
    console.error("Error rendering daily agenda:", error);
    const container = document.getElementById('daily-agenda-tasks');
    if(container) container.innerHTML = `<p class="dac-prompt">Could not load agenda.</p>`;
  }
}

window.toggleAgendaTask = function(el, e, taskId) {
  e.stopPropagation(); // CRITICAL FE FIX: Prevent parent onclick navigation
  
  let checkedTasks = JSON.parse(localStorage.getItem('oneprep_plan_checks')) || {};
  const isCurrentlyChecked = !!checkedTasks[taskId];
  const willBeChecked = !isCurrentlyChecked;
  
  checkedTasks[taskId] = willBeChecked;
  localStorage.setItem('oneprep_plan_checks', JSON.stringify(checkedTasks));

  // Sync with backend
  fetch(API_BASE + '/api/planner/agenda/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId, completed: willBeChecked })
  }).catch(err => console.error("Failed to sync task completion", err));

  const card = el.closest('.da-task-card');
  card.classList.toggle('completed', willBeChecked);
  
  const checkIcon = el.querySelector('.check-icon');
  const title = card.querySelector('h4');
  
  if (willBeChecked) {
    el.style.background = '#7C6FE0';
    el.style.borderColor = '#7C6FE0';
    checkIcon.style.opacity = '1';
    
    title.style.textDecoration = 'line-through';
    title.style.color = 'var(--text-sub)'; // slate-400 equivalent
    card.style.background = '#F8F7FF';
  } else {
    el.style.background = '#fff';
    el.style.borderColor = '#D0CBF5';
    checkIcon.style.opacity = '0';
    
    title.style.textDecoration = 'none';
    title.style.color = 'inherit'; // Revert to default
    card.style.background = '#ffffff';
  }
  
  if (typeof window.updateAgendaProgress === 'function') window.updateAgendaProgress();
};

window.updateAgendaProgress = function() {
  const container = document.getElementById('daily-agenda-tasks');
  const textEl = document.getElementById('agenda-progress-text');
  const trackEl = document.getElementById('agenda-progress-track');
  const fillEl = document.getElementById('agenda-progress-fill');
  
  if (!container || !textEl || !trackEl || !fillEl) return;
  
  const tasks = container.querySelectorAll('.da-task-card');
  if (tasks.length === 0) {
    textEl.style.display = 'none';
    trackEl.style.display = 'none';
    return;
  }
  
  textEl.style.display = 'block';
  trackEl.style.display = 'block';
  
  const completed = container.querySelectorAll('.da-task-card.completed').length;
  const total = tasks.length;
  
  textEl.textContent = `${completed} of ${total} completed`;
  fillEl.style.width = `${(completed / total) * 100}%`;
};

function startPracticeTopic(topic) {
  // This could navigate to the question bank view filtered by topic
  showToast(`Starting practice for: ${topic}`);
  show('exams'); // The 'exams' view seems to be the question bank
}

// --- UTILITIES ---
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = msg;
  toast.classList.add('active');
  
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

function updateVocabWidget() {
  const vocabWidgetCount = document.getElementById('widget-vocab-count');
  if (vocabWidgetCount && vocabularyDb) {
    vocabWidgetCount.textContent = vocabularyDb.length;
  }
}

// ==========================================================================
// INTERACTIVE DASHBOARD ACTION FLOWS (EXACT MOCKUP MATCH)
// ==========================================================================
function createStudyPlan() {
  const currentMathStr = prompt("Enter your latest Math score (e.g., 600):", "600");
  if (!currentMathStr) return;
  const currentEbrwStr = prompt("Enter your latest English/EBRW score (e.g., 620):", "620");
  if (!currentEbrwStr) return;
  
  const targetMathStr = prompt("Enter your target goal Math score (e.g., 800):", "800");
  if (!targetMathStr) return;
  const targetEbrwStr = prompt("Enter your target goal English/EBRW score (e.g., 760):", "760");
  if (!targetEbrwStr) return;
  
  const scores = {
    currentMath: parseInt(currentMathStr, 10) || 0,
    currentEbrw: parseInt(currentEbrwStr, 10) || 0,
    targetMath: parseInt(targetMathStr, 10) || 0,
    targetEbrw: parseInt(targetEbrwStr, 10) || 0,
  };
  localStorage.setItem('oneprep_scores', JSON.stringify(scores));
  
  renderScoreSummary();

  const currentTotal = scores.currentMath + scores.currentEbrw;
  const targetTotal = scores.targetMath + scores.targetEbrw;
  
  // Update UI values dynamically
  const scoreCardVal = document.querySelector('.dsps-score-info strong');
  const goalCardVal = document.querySelector('.dsps-small-card.purple-bg strong');
  
  if (scoreCardVal) scoreCardVal.textContent = currentTotal;
  if (goalCardVal) goalCardVal.textContent = targetTotal;
  
  showToast("🎯 Study plan created! Goal score set to " + targetTotal + ".");
  
  // Increment coins as reward!
  updateCoins(20);
}

function renderScoreSummary() {
  const scoresStr = localStorage.getItem('oneprep_scores');
  if (!scoresStr) return;
  const scores = JSON.parse(scoresStr);
  
  const currentTotal = scores.currentMath + scores.currentEbrw;
  const targetTotal = scores.targetMath + scores.targetEbrw;
  const leftTotal = targetTotal - currentTotal;
  const leftMath = scores.targetMath - scores.currentMath;
  const leftEbrw = scores.targetEbrw - scores.currentEbrw;

  let summaryContainer = document.getElementById('custom-score-summary');
  if (!summaryContainer) {
    summaryContainer = document.createElement('div');
    summaryContainer.id = 'custom-score-summary';
    summaryContainer.className = 'custom-score-summary';
    
    const welcomeContainer = document.querySelector('.welcome-container');
    if (welcomeContainer) {
      welcomeContainer.parentNode.insertBefore(summaryContainer, welcomeContainer.nextSibling);
    } else {
      const dashGrid = document.querySelector('.dash-grid');
      if (dashGrid) {
        dashGrid.parentNode.insertBefore(summaryContainer, dashGrid);
      }
    }
  }

  summaryContainer.innerHTML = `
    <div class="score-summary-grid">
      <div class="ss-card current-score">
        <div class="ss-label">Latest Overall Score</div>
        <div class="ss-total">${currentTotal}</div>
        <div class="ss-breakdown">
          <span>Math: <strong>${scores.currentMath}</strong></span>
          <span>English: <strong>${scores.currentEbrw}</strong></span>
        </div>
      </div>
      
      <div class="ss-card target-score">
        <div class="ss-label">Target Goal Score</div>
        <div class="ss-total">${targetTotal}</div>
        <div class="ss-breakdown">
          <span>Math: <strong>${scores.targetMath}</strong></span>
          <span>English: <strong>${scores.targetEbrw}</strong></span>
        </div>
      </div>
      
      <div class="ss-card score-left">
        <div class="ss-label">Points Left to Goal</div>
        <div class="ss-total">${leftTotal > 0 ? '+' + leftTotal : leftTotal}</div>
        <div class="ss-breakdown">
          <span>Math: <strong>${leftMath > 0 ? '+' + leftMath : leftMath}</strong></span>
          <span>English: <strong>${leftEbrw > 0 ? '+' + leftEbrw : leftEbrw}</strong></span>
        </div>
      </div>
    </div>
  `;
}

function switchTestDate() {
  const newDateStr = prompt("Enter your new test date (YYYY-MM-DD):", "2026-12-05");
  if (!newDateStr) return;
  
  try {
    const d = new Date(newDateStr);
    if (isNaN(d.getTime())) throw new Error("Invalid date");
    
    // Switch the text
    const dateFooter = document.querySelector('.tcc-date');
    if (dateFooter) {
      dateFooter.textContent = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
    showToast("📅 Test date switched to " + d.toLocaleDateString());
  } catch(e) {
    showToast("⚠️ Invalid date format. Please use YYYY-MM-DD.");
  }
}

function uploadScoreReport() {
  showToast("📁 Selecting SAT Score Report PDF...");
  setTimeout(() => {
    const confirmed = confirm("Simulated File Selector:\nDo you want to upload 'CollegeBoard_SAT_ScoreReport_May2026.pdf'?");
    if (confirmed) {
      showToast("⚡ Parsing CollegeBoard report...");
      setTimeout(() => {
        // Update dashboard values
        const attempted = document.querySelector('.das-card:nth-child(1) .das-card-val');
        const accuracy = document.querySelector('.das-card:nth-child(2) .das-card-val');
        
        if (attempted) attempted.textContent = "48";
        if (accuracy) accuracy.textContent = "86%";
        
        showToast("🎉 Score Report successfully analyzed! Weekly plan updated.");
        updateCoins(50);
      }, 1500);
    }
  }, 300);
}

function updateCoins(amount) {
  const coinsBadge = document.querySelector('.dhr-badge.coins');
  if (coinsBadge) {
    const currentCoins = parseInt(coinsBadge.textContent.replace(/[^\d]/g, '')) || 0;
    const newCoins = currentCoins + amount;
    coinsBadge.innerHTML = `💎 ${newCoins}`;
    showToast(`💰 Received +${amount} coins!`);
  }
}

// ==========================================================================
// ASK PREPPY AI (GEMINI ENGINE & EXPERT OFFLINE SAT TUTOR)
// ==========================================================================
function handleChatKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendChatMessage();
  }
}

function sendChatMessage() {
  const inputEl = document.getElementById('chat-msg-input');
  if (!inputEl) return;
  
  const text = inputEl.value.trim();
  if (!text) return;
  
  // Clear input
  inputEl.value = '';
  
  // Append user message
  appendMessage("user", "You", text);
  
  // Show typing indicator
  const chatBody = document.getElementById('chat-box-body');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message preppy typing-container';
  typingDiv.innerHTML = `
    <div class="cm-avatar">🤖</div>
    <div class="cm-content">
      <strong>Preppy AI</strong>
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
  chatBody.appendChild(typingDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
  
  // Simulate AI Response delay
  setTimeout(() => {
    // Remove typing indicator
    typingDiv.remove();
    
    // Generate intelligent SAT response
    const aiResponse = generatePreppyResponse(text);
    appendMessage("preppy", "Preppy AI", aiResponse);
  }, 1200);
}

function appendMessage(sender, senderLabel, text) {
  const chatBody = document.getElementById('chat-box-body');
  if (!chatBody) return;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${sender}`;
  
  const avatar = sender === 'user' ? '👤' : '🤖';
  
  msgDiv.innerHTML = `
    <div class="cm-avatar">${avatar}</div>
    <div class="cm-content">
      <strong>${senderLabel}</strong>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
  
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function generatePreppyResponse(userText) {
  const query = userText.toLowerCase();
  
  if (query.includes("solve") || query.includes("equation") || query.includes("math")) {
    return `Let's tackle this SAT Math problem step-by-step! 🧠📝

Example quadratic equation solving:
Given: x² - 6x + 9 = 0

Step 1: Identify the coefficients of the quadratic equation ax² + bx + c = 0.
Here, a = 1, b = -6, and c = 9.

Step 2: Check if this is a perfect square trinomial.
We know that (x - d)² = x² - 2dx + d².
Since (-3)² = 9 and 2 * (-3) = -6, we can write:
(x - 3)² = 0

Step 3: Solve for x.
Taking the square root of both sides:
x - 3 = 0  ➔  x = 3.

🎯 Tip for SAT Math: When using the quadratic formula, always check the discriminant (b² - 4ac) first to see how many real solutions exist!
- If positive: 2 real solutions
- If zero: 1 real solution (like this example)
- If negative: 0 real solutions (complex solutions only)

Does this explanation help, or would you like to try another problem?`;
  }
  
  if (query.includes("grammar") || query.includes("colon") || query.includes("comma") || query.includes("punctuation")) {
    return `Here is a masterclass guide on SAT Punctuation Rules! ✍️📖

1. Colons (:)
- Rule: The clause before a colon MUST be independent (a complete sentence that can stand alone). The text after the colon can be a list, an explanation, or a dependent clause.
- Example:
  ✅ Correct: "She had only one goal in mind: scoring a perfect 1600."
  ❌ Incorrect: "Her main goal was to: score a perfect 1600." (Because "Her main goal was to" is not independent).

2. Semicolons (;)
- Rule: Used to link two independent clauses without a coordinating conjunction (FANBOYS).
- Example: "The SAT exam is computer-based; it adapts in difficulty based on your performance."

3. Commas (,)
- Rule: Never join two independent clauses with just a comma (this is a Comma Splice error). Use a comma + coordinating conjunction (e.g. , but) or a semicolon instead!

Which of these rules would you like to practice with a mock question?`;
  }
  
  if (query.includes("vocab") || query.includes("ephemeral") || query.includes("aberration")) {
    return `Vocab is crucial for the Reading & Writing section! 🌿💡

Let's review two high-utility SAT words:
1. Ephemeral (adj.)
- Definition: Lasting for a very short time; fleeting or transient.
- Sentence: "The morning dew was ephemeral, evaporating as soon as the sun rose over the hills."

2. Aberration (noun)
- Definition: A departure from what is normal, usual, or expected; an anomaly.
- Sentence: "His failing grade on the practice test was a temporary aberration; he usually scores near perfect."

🎯 SAT Reading Tip: In Vocab-in-Context questions, look for contrast words like 'although', 'however', or 'but' to determine if the blank should have a positive or negative charge.

Would you like me to quiz you on these terms?`;
  }
  
  // Default encouraging tutor response
  return `I'm on it! 🚀 As your SAT Preppy AI tutor, I am fully equipped to solve complex algebraic equations, explain coordinate geometry, breakdown reading comprehension passages, and clarify punctuation rules.

Please paste the exact question you're struggling with, or let me know if you want to start a custom mini-practice quiz on any topic! 🎓`;
}

// ── UNIFIED FULL-STACK HELPERS ──
const API_BASE = '';  // same origin

async function loadUserData() {
  try {
    const res = await fetch(API_BASE + '/api/user');
    const user = await res.json();
    // Update header flames/coins if elements 
    const flamesEl = document.getElementById('flames-count');
    const coinsEl = document.getElementById('coins-count');
    if (flamesEl) flamesEl.textContent = user.flames || 0;
    if (coinsEl) coinsEl.textContent = user.coins || 80;
  } catch(e) { console.error('User load error:', e); }
}

function toggleDark() {
  document.documentElement.classList.toggle('dark');
  document.body.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('darkMode', isDark);
  localStorage.setItem('oneprep_theme', isDark ? 'dark' : 'light');
}

// Apply saved dark mode
if (localStorage.getItem('darkMode') === 'true' || localStorage.getItem('oneprep_theme') === 'dark') {
  document.documentElement.classList.add('dark');
  document.body.classList.add('dark');
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    padding: 12px 20px; border-radius: 12px; font-weight: 600;
    font-size: 0.9rem; animation: slideUp 0.3s ease;
    background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', loadUserData);
