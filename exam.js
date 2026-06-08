// Simulator State variables
    let year = "2026";
    let month = "march";
    let version = "int-a";
    let subject = "ebrw";
    let examId = "march-2026-int-a";
    let currentModule = "ebrw1";
    
    let questions = [];
    let currentIdx = 0;
    
    let timerTotalSeconds = 32 * 60;
    let timerInterval = null;
let isTimerHidden = false;
    let isTimerPaused = false;
    let isHighlightMode = false;

    let isLineReaderActive = false;
    let currentZoomLevel = 1;

    let savedHighlights = {}; // { questionIdx: [ { range, color, note, id } ] }
    let currentSelectionRange = null;
    let activeHighlightNode = null;

    document.addEventListener('selectionchange', handleSelection);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', (e) => {
      const toolbar = document.getElementById('highlight-toolbar');
      if (toolbar && !toolbar.contains(e.target) && !e.target.closest('.user-highlight')) {
        toolbar.style.display = 'none';
        document.getElementById('highlight-note-input-container').style.display = 'none';
      }
    });

    // Suppress browser default context menu except in inputs
    document.addEventListener('contextmenu', e => {
      if (e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
      }
    });

    function toggleHighlightMode() {
      isHighlightMode = !isHighlightMode;
      const btn = document.getElementById('highlighter-tool');
      if (btn) {
        if (isHighlightMode) {
          btn.style.background = '#cbd5e1'; 
          btn.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.1)';
        } else {
          btn.style.background = 'transparent';
          btn.style.boxShadow = 'none';
        }
      }
    }

    function handleSelection() {
      // do not hide immediately on selection change to allow clicking toolbar
    }

    function handleMouseUp(e) {
      if (e.target.closest('#highlight-toolbar')) return;
      if (!isHighlightMode) return;
      
      const sel = window.getSelection();
      if (!sel.rangeCount || sel.isCollapsed) return;
      
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      if (rect.width === 0) return;
      
      // Make sure selection is inside passage or question
      if (!e.target.closest('.passage-panel') && !e.target.closest('.question-panel')) return;

      currentSelectionRange = range;
      activeHighlightNode = null;
      
      showToolbar(rect.left + rect.width / 2, rect.top);
      document.getElementById('highlight-remove-btn').style.display = 'none';
    }

    function showToolbar(x, y) {
      const tb = document.getElementById('highlight-toolbar');
      tb.style.display = 'flex';
      tb.style.left = x + 'px';
      tb.style.top = (y + window.scrollY) + 'px';
      document.getElementById('highlight-note-input-container').style.display = 'none';
    }

    function applyHighlight(styleVal) {
      if (!currentSelectionRange && !activeHighlightNode) return;
      
      let span;
      if (activeHighlightNode) {
        span = activeHighlightNode;
      } else {
        span = document.createElement('span');
        span.className = 'user-highlight';
        span.style.cursor = 'pointer';
        span.dataset.id = Date.now().toString();
        
        try {
          span.appendChild(currentSelectionRange.extractContents());
          currentSelectionRange.insertNode(span);
        } catch(e) {
          console.error("Highlight wrap failed", e);
          return;
        }
      }

      if (styleVal === 'underline') {
        span.style.backgroundColor = 'transparent';
        span.style.textDecoration = 'underline';
        span.style.textDecorationColor = '#ef4444';
        span.style.textDecorationThickness = '2px';
      } else {
        span.style.textDecoration = 'none';
        span.style.backgroundColor = styleVal;
      }
      
      span.onclick = function(e) {
        if (!isHighlightMode) return;
        e.stopPropagation();
        const rect = span.getBoundingClientRect();
        activeHighlightNode = span;
        currentSelectionRange = null;
        showToolbar(rect.left + rect.width / 2, rect.top);
        document.getElementById('highlight-remove-btn').style.display = 'flex';
      };

      document.getElementById('highlight-toolbar').style.display = 'none';
      window.getSelection().removeAllRanges();
      persistHighlights();
    }

    function removeHighlight() {
      if (activeHighlightNode) {
        const parent = activeHighlightNode.parentNode;
        while (activeHighlightNode.firstChild) {
          parent.insertBefore(activeHighlightNode.firstChild, activeHighlightNode);
        }
        parent.removeChild(activeHighlightNode);
        parent.normalize();
        
        document.getElementById('highlight-toolbar').style.display = 'none';
        activeHighlightNode = null;
        persistHighlights();
      }
    }

    function addNote() {
      document.getElementById('highlight-note-input-container').style.display = 'block';
      const ta = document.getElementById('highlight-note-textarea');
      if (activeHighlightNode) {
        ta.value = activeHighlightNode.dataset.note || "";
      } else {
        ta.value = "";
      }
      ta.focus();
    }

    function saveNote() {
      const val = document.getElementById('highlight-note-textarea').value;
      if (activeHighlightNode) {
        activeHighlightNode.dataset.note = val;
      } else if (currentSelectionRange) {
        // apply default yellow highlight to anchor the note
        applyHighlight('#fef08a');
        activeHighlightNode.dataset.note = val;
      }
      document.getElementById('highlight-toolbar').style.display = 'none';
      persistHighlights();
    }
    
    function persistHighlights() {
      // Basic HTML persistence for this specific question
      savedHighlights[currentIdx] = {
        passage: document.getElementById('passage-body').innerHTML,
        question: document.getElementById('question-text').innerHTML
      };
    }
    
    function restoreHighlights() {
      if (savedHighlights[currentIdx]) {
        document.getElementById('passage-body').innerHTML = savedHighlights[currentIdx].passage;
        document.getElementById('question-text').innerHTML = savedHighlights[currentIdx].question;
        
        // Re-attach listeners
        document.querySelectorAll('.user-highlight').forEach(span => {
          span.onclick = function(e) {
            if (!isHighlightMode) return;
            e.stopPropagation();
            const rect = span.getBoundingClientRect();
            activeHighlightNode = span;
            currentSelectionRange = null;
            showToolbar(rect.left + rect.width / 2, rect.top);
            document.getElementById('highlight-remove-btn').style.display = 'flex';
          };
        });
      }
    }


    
    // User answer sheets & bookmarks
    let userAnswers = {};
    let bookmarkedQuestions = {};
    let eliminatedOptions = {}; // format: { questionIdx: { "A": true } }
    

    let isExplanationsVisible = false;

    // Split screen resizing logic
    const divider = document.getElementById('pane-divider');
    const leftPane = document.getElementById('left-pane');
    const rightPane = document.getElementById('right-pane');
    let isResizing = false;

    divider.addEventListener('mousedown', (e) => {
      isResizing = true;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const containerWidth = document.body.clientWidth;
      const percentage = (e.clientX / containerWidth) * 100;
      if (percentage > 25 && percentage < 75) {
        leftPane.style.flex = `0 0 ${percentage}%`;
        rightPane.style.flex = `0 0 ${100 - percentage}%`;
      }
    });

    document.addEventListener('mouseup', () => {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    });

    // Parse URL parts to initialize
    function initURLParams() {
      const parts = window.location.pathname.split('/');
      // Path format: /past-exams/:year/:month/:version/:subject
      if (parts.length >= 6) {
        year = parts[2];
        month = parts[3];
        version = parts[4];
        subject = parts[5];
        examId = `${month}-${year}-${version}`.toLowerCase();
        currentModule = subject.toLowerCase();
      }
    }

    // Load initial data
    document.addEventListener('DOMContentLoaded', async () => {
      initURLParams();
      
      // Ensure we have a JWT token for backend requests
      let token = localStorage.getItem('jwt_token');
      if (!token) {
        try {
          const authRes = await fetch('/api/auth/mock-login', { method: 'POST' });
          const authData = await authRes.json();
          token = authData.token;
          localStorage.setItem('jwt_token', token);
        } catch(e) { console.error('Failed to get mock token', e); }
      }

      await fetchUserData();
      
      // Fetch and restore attempt if exists
      try {
        const attemptsResponse = await fetch('/api/exams/attempts', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` }
        });
        if (attemptsResponse.ok) {
          const allAttempts = await attemptsResponse.json();
          const attemptKey = `${examId}-${currentModule}`;
          if (allAttempts && allAttempts[attemptKey]) {
            sessionStorage.setItem(`result_${examId}_${currentModule}`, JSON.stringify(allAttempts[attemptKey]));
            userAnswers = allAttempts[attemptKey].answers || {};
            isExplanationsVisible = true; // Auto open explanations in review
          }
        }
      } catch (err) {
        console.error("Failed to restore attempts from database", err);
      }
      
      await fetchExamQuestions();
      startTimer();
      renderNavigatorGrid();
    });

    async function fetchUserData() {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const user = await response.json();
          document.getElementById('streak-val').textContent = user.streak || 1;
          document.getElementById('score-val').textContent = user.coins || 80;
        }
      } catch (err) {
        console.error("Failed to load user info", err);
      }
    }

    async function fetchExamQuestions() {
      try {
        const response = await fetch(`/api/exams/${examId}/questions?module=${currentModule}&index=0`);
        if (response.ok) {
          const data = await response.json();
          questions = new Array(data.totalQuestions).fill(null);
          questions[0] = data.questions[0];
          timerTotalSeconds = (data.timeLimit || 32) * 60;

          // Directions modal updates
          const isMath = currentModule.toLowerCase().includes('math');
          const modalTitle = document.querySelector('#directions-modal-overlay .modal-title');
          const modalBody = document.querySelector('#directions-modal-overlay .modal-body');
          if (isMath) {
            if (modalTitle) modalTitle.textContent = "Math Directions";
            if (modalBody) {
              modalBody.innerHTML = `
                <p>The questions in this section address a number of important math skills. Each question includes one or more problems, which may include a table or graph. Solve each problem and enter your answer or select the best choice.</p>
                <br />
                <p>For multiple-choice questions, choose the best answer. For student-produced response questions, input your numeric or algebraic answer directly in the text field provided.</p>
              `;
            }
          } else {
            if (modalTitle) modalTitle.textContent = "Reading and Writing Directions";
            if (modalBody) {
              modalBody.innerHTML = `
                <p>The questions in this section address a number of important reading and writing skills. Each question includes one or more passages, which may include a table or graph. Read each passage and question carefully, and then choose the best answer to the question based on the passage(s).</p>
                <br />
                <p>All questions in this section are multiple-choice with four answer choices. Each question has a single best answer.</p>
              `;
            }
          }

          await loadQuestion(0);
          
    async function loadStudentName() {
      try {
        const token = localStorage.getItem('oneprep_token');
        if (!token) return;
        const res = await fetch('/api/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          document.getElementById('student-name-display').textContent = user.name || 'Student Name';
        }
      } catch(e) { console.error(e); }
    }
    loadStudentName();

          renderNavigatorGrid();
        } else {
          // Fallback questions if API returns error
          alert("Error loading questions. Using simulator template.");
        }
      } catch (err) {
        console.error("Failed to fetch questions", err);
      }
    }

    function updateTimerDisplay() {
      const timerDisplay = document.getElementById('timer-text');
      const hideBtn = document.getElementById('hide-timer-btn');
      
      const mins = Math.floor(timerTotalSeconds / 60);
      const secs = timerTotalSeconds % 60;
      const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      
      if (timerTotalSeconds <= 300) { // 5 minutes remaining
        timerDisplay.style.color = '#DC2626'; // Red color
        isTimerHidden = false; // Force show
        if (hideBtn) hideBtn.style.display = 'none'; // Hide the hide button
      } else {
        timerDisplay.style.color = '';
        if (hideBtn) hideBtn.style.display = 'inline-block';
      }
      
      if (isTimerHidden && timerTotalSeconds > 300) {
        timerDisplay.style.visibility = 'hidden';
      } else {
        timerDisplay.style.visibility = 'visible';
        timerDisplay.textContent = formatted;
      }
    }

    function toggleTimerPause() {
      isTimerPaused = !isTimerPaused;
      const pauseBtn = document.getElementById('pause-timer-btn');
      if (pauseBtn) {
        pauseBtn.innerHTML = isTimerPaused ? '▶' : '⏸';
      }
    }

    function toggleTimerVisibility() {
      isTimerHidden = !isTimerHidden;
      const btn = document.getElementById('hide-timer-btn');
      if (btn) btn.textContent = isTimerHidden ? 'Show' : 'Hide';
      updateTimerDisplay();
    }

    // Pause functionality removed

    function startTimer() {
      if (getSubmissionResult()) {
        document.getElementById('timer-text').textContent = "Reviewed";
        document.getElementById('hide-timer-btn').style.display = 'none';
        return;
      }
      
      const savedTimer = localStorage.getItem(`timer_${examId}_${currentModule}`);
      if (savedTimer !== null) {
        timerTotalSeconds = parseInt(savedTimer, 10);
      }

      if (timerInterval) clearInterval(timerInterval);
      
      updateTimerDisplay();
      timerInterval = setInterval(() => {
        if (isTimerPaused) return;
        timerTotalSeconds--;
        localStorage.setItem(`timer_${examId}_${currentModule}`, timerTotalSeconds);
        updateTimerDisplay();
        
        if (timerTotalSeconds <= 0) {
          clearInterval(timerInterval);
          submitExam();
        }
      }, 1000);
    }

    
    async function saveProgressToServer() {
      const token = localStorage.getItem('oneprep_token');
      if (!token || !examId || !currentModule) return;
      
      try {
        await fetch(`/api/exams/${examId}/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            targetModule: currentModule,
            answers: userAnswers
          })
        });
      } catch(e) {
        console.error("Failed to save incremental progress", e);
      }
    }

    // Load and Display Questions
    async function loadQuestion(idx) {
      if (idx < 0 || idx >= questions.length) return;
      
      if (!questions[idx]) {
        document.getElementById('question-text').textContent = "Loading...";
        try {
           const res = await fetch(`/api/exams/${examId}/questions?module=${currentModule}&index=${idx}`);
           const data = await res.json();
           if (data.questions && data.questions[0]) questions[idx] = data.questions[0];
        } catch(e) { console.error(e); }
      }
      
      currentIdx = idx;
      const q = questions[idx];
      if (!q) return;

      if (idx + 1 < questions.length && !questions[idx + 1]) {
         fetch(`/api/exams/${examId}/questions?module=${currentModule}&index=${idx+1}`)
           .then(res => res.json())
           .then(data => { if (data.questions && data.questions[0]) questions[idx+1] = data.questions[0]; });
      }
      
      // Update UI elements
      document.getElementById('passage-label').textContent = `Passage ${q.questionNumber}`;
      document.getElementById('passage-body').innerHTML = `<p>${q.passageText}</p>`;
      document.getElementById('question-badge-num').textContent = q.questionNumber;
      document.getElementById('question-text').textContent = q.questionText;
      document.getElementById('nav-badge-text').textContent = `${q.questionNumber} of ${questions.length}`;
      
      // Load bookmark state
      const isBookmarked = !!bookmarkedQuestions[q.questionNumber];
      const bkBtn = document.getElementById('bookmark-btn');
      bkBtn.classList.toggle('flagged', isBookmarked);
      // bkBtn text should not change, only the icon color changes via CSS
      
      // Load choices
      const choicesBox = document.getElementById('choices-box');
      choicesBox.innerHTML = '';
      
      const savedAnswer = userAnswers[q.questionNumber];
      
      if (!q.choices || q.choices.length === 0) {
        // Render Free-Response Text Field
        const submissionResult = getSubmissionResult();
        let statusClass = "";
        let badgeHtml = "";
        let disabledAttr = "";
        
        if (submissionResult) {
          disabledAttr = "disabled";
          const resultObj = submissionResult.results.find(r => r.questionNumber === q.questionNumber);
          if (resultObj) {
            if (resultObj.isCorrect) {
              statusClass = "correct";
              badgeHtml = `<div class="free-response-badge-row"><span class="correct-badge">вњ“ Correct</span></div>`;
            } else {
              statusClass = "wrong";
              badgeHtml = `<div class="free-response-badge-row"><span class="wrong-badge">вњ— Incorrect</span> (Correct: <strong>${resultObj.correctAnswer}</strong>)</div>`;
            }
          }
        }
        
        const frHtml = `
          <div class="free-response-card ${statusClass}">
            <label for="free-response-input" class="free-response-label">Student-Produced Response</label>
            <div class="free-response-input-wrapper">
              <input type="text" id="free-response-input" class="free-response-input" 
                     placeholder="Enter your answer..." value="${savedAnswer || ''}" 
                     oninput="saveFreeResponseAnswer(this.value)" ${disabledAttr} />
            </div>
            ${badgeHtml}
          </div>
        `;
        choicesBox.innerHTML = frHtml;
      } else {
        const eliminations = eliminatedOptions[q.questionNumber] || {};
        const letters = ["A", "B", "C", "D"];
        q.choices.forEach((choiceContent, i) => {
          const letter = letters[i];
          const isSelected = savedAnswer === letter;
          const isEliminated = !!eliminations[letter];
          
          let cardClass = "choice-card";
          if (isSelected) cardClass += " selected";
          if (isEliminated) cardClass += " eliminated";
          
          // If test is submitted and reviewed, show correct/wrong checks
          const submissionResult = getSubmissionResult();
          if (submissionResult) {
            const resultObj = submissionResult.results.find(r => r.questionNumber === q.questionNumber);
            if (resultObj) {
              if (letter === resultObj.correctAnswer) cardClass += " correct";
              else if (isSelected && letter === resultObj.userAnswer) cardClass += " wrong";
            }
          }
          
          const cardHtml = `
            <div style="display: flex; align-items: center; width: 100%; margin-bottom: 12px;">
              <button class="${cardClass}" onclick="selectChoice('${letter}')" oncontextmenu="event.preventDefault(); toggleElimination(event, '${letter}');" id="choice-${letter}" style="flex: 1; padding: 16px 20px; border: 1px solid #94a3b8; border-radius: 6px; background: ${isEliminated ? '#f8fafc' : 'var(--bg-app)'}; cursor: pointer; text-align: left; transition: all 0.2s; position: relative; margin-right: ${isEliminated ? '16px' : '0'}; opacity: ${isEliminated ? '0.45' : '1'};">
                <div class="choice-card-left" style="padding-right: 0; width: 100%; display: flex; align-items: center; gap: 16px;">
                  <div class="choice-letter" style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid #64748b; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; color: #475569; flex-shrink: 0;">${letter}</div>
                  <div class="choice-text" style="flex: 1; font-family: var(--font-ui); font-size: 15px; line-height: 1.4; color: var(--text-main); ${isEliminated ? 'text-decoration: line-through;' : ''}">${choiceContent}</div>
                </div>
              </button>
              ${isEliminated ? 
                `<div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-left: 12px;">
                   <div class="undo-btn" onclick="toggleElimination(event, '${letter}')" style="color: #0f172a; font-weight: 800; text-decoration: underline; text-decoration-thickness: 2px; font-size: 14px; cursor: pointer; padding: 10px;">Undo</div>
                   <div class="eliminate-btn-right" onclick="toggleElimination(event, '${letter}')" style="width: 26px; height: 26px; border-radius: 50%; border: 1px solid #94a3b8; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: 600; font-size: 13px; color: #64748b;" >${letter}</div>
                 </div>` : 
                `<div class="eliminate-btn-right" onclick="toggleElimination(event, '${letter}')" style="width: 26px; height: 26px; border-radius: 50%; border: 1px solid #94a3b8; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; margin-left: 16px; font-weight: 600; font-size: 13px; color: #64748b;" >
                  ${letter}
                </div>`
              }
            </div>
          `;
          choicesBox.insertAdjacentHTML('beforeend', cardHtml);
        });
      }
      
      // Load navigation buttons disabled state
      document.getElementById('prev-btn').disabled = idx === 0;
      const nextBtn = document.getElementById('next-btn');
      if (idx === questions.length - 1) {
        nextBtn.textContent = 'Submit';
        nextBtn.className = 'nav-nav-btn primary';
      } else {
        nextBtn.textContent = 'Next';
        nextBtn.className = 'nav-nav-btn primary';
      }
      
      // Toggle explanation visibility
      const expBox = document.getElementById('explanation-box');
      if (isExplanationsVisible) {
        expBox.classList.add('open');
        document.getElementById('explanation-content').textContent = q.explanation || "No explanation provided.";
      } else {
        expBox.classList.remove('open');
      }

      // Close popover
      document.getElementById('navigator-popover').classList.remove('open');
      updateActiveNavigatorNode();
    }

    function selectChoice(letter) {
      const qNum = questions[currentIdx].questionNumber;
      
      // If choice was crossed out, do nothing
      const eliminations = eliminatedOptions[qNum] || {};
      if (eliminations[letter]) return;
      
      userAnswers[qNum] = letter;
      
      // update classes visually
      const letters = ["A", "B", "C", "D"];
      letters.forEach(l => {
        const btn = document.getElementById(`choice-${l}`);
        if (btn) {
          btn.classList.remove('selected');
          if (l === letter) btn.classList.add('selected');
        }
      });
      
      // update navigator grid representation
      const node = document.getElementById(`nav-node-${qNum}`);
      if (node) node.classList.add('answered');
      saveProgressToServer();
    }


    window.saveFreeResponseAnswer = function(value) {
      const qNum = questions[currentIdx].questionNumber;
      userAnswers[qNum] = value;
      
      // update navigator grid representation
      const node = document.getElementById(`nav-node-${qNum}`);
      if (node) {
        if (value && value.trim() !== "") {
          node.classList.add('answered');
        } else {
          node.classList.remove('answered');
          delete userAnswers[qNum];
        }
      }
      saveProgressToServer();
    }

    function toggleElimination(event, letter) {
      event.stopPropagation(); // prevent option selection trigger
      const qNum = questions[currentIdx].questionNumber;
      
      if (!eliminatedOptions[qNum]) {
        eliminatedOptions[qNum] = {};
      }
      
      const isEliminated = !eliminatedOptions[qNum][letter];
      eliminatedOptions[qNum][letter] = isEliminated;
      
      // If user selected this choice, deselect it
      if (isEliminated && userAnswers[qNum] === letter) {
        delete userAnswers[qNum];
        // update navigator node state
        const node = document.getElementById(`nav-node-${qNum}`);
        if (node) node.classList.remove('answered');
        saveProgressToServer();
      }
      
      // refresh option card visual state
      loadQuestion(currentIdx);
    }

    function toggleQuestionBookmark() {
      const qNum = questions[currentIdx].questionNumber;
      const isBookmarked = !bookmarkedQuestions[qNum];
      bookmarkedQuestions[qNum] = isBookmarked;
      
      const bkBtn = document.getElementById('bookmark-btn');
      bkBtn.classList.toggle('flagged', isBookmarked);
      // bkBtn text should not change, only the icon color changes via CSS
      
      // update popover grid node representation
      const node = document.getElementById(`nav-node-${qNum}`);
      if (node) node.classList.toggle('flagged', isBookmarked);
    }

    // Explanations Box
    function toggleExplanation() {
      isExplanationsVisible = !isExplanationsVisible;
      const expBox = document.getElementById('explanation-box');
      const explainBtn = document.getElementById('explain-btn');
      
      if (isExplanationsVisible) {
        expBox.classList.add('open');
        explainBtn.style.background = 'var(--purple-light)';
        document.getElementById('explanation-content').textContent = questions[currentIdx].explanation || "No explanation provided.";
      } else {
        expBox.classList.remove('open');
        explainBtn.style.background = 'none';
      }
    }

    // Remix Clone Questions
    async function triggerRemix() {
      const q = questions[currentIdx];
      const remixBtn = document.getElementById('remix-btn');
      remixBtn.textContent = '🌀 Loading...';
      try {
        const response = await fetch(`/api/questions/remix/${q.id}`);
        if (response.ok) {
          const clone = await response.json();
          // Replace current question data with clone
          questions[currentIdx] = {
            ...q,
            passageText: clone.passage || q.passageText,
            questionText: clone.question,
            choices: clone.choices.map(c => c.text),
            correctAnswer: clone.correctAnswer,
            explanation: clone.explanation
          };
          loadQuestion(currentIdx);
          showToast("Question cloned & modified using Remix AI! рџ§¬");
        } else {
          showToast("Remix data unavailable for this question.");
        }
      } catch (err) {
        console.error(err);
        showToast("Error loading Remix variant.");
      }
      remixBtn.innerHTML = '🌀 Remix';
    }

    // Ask Preppy AI panel
    function togglePreppyAI(open) {
      const drawer = document.getElementById('ai-drawer');
      if (open === undefined) {
        drawer.classList.toggle('open');
      } else if (open) {
        drawer.classList.add('open');
      } else {
        drawer.classList.remove('open');
      }
    }

    function sendPreppyMessage() {
      const inputEl = document.getElementById('ai-chat-input');
      const text = inputEl.value.trim();
      if (!text) return;
      
      const history = document.getElementById('ai-chat-history');
      
      // User bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble user';
      userBubble.textContent = text;
      history.appendChild(userBubble);
      
      inputEl.value = '';
      
      // Scroll to bottom
      history.scrollTop = history.scrollHeight;
      
      // Simulate Assistant Response
      setTimeout(() => {
        const assistBubble = document.createElement('div');
        assistBubble.className = 'chat-bubble assistant';
        
        const q = questions[currentIdx];
        assistBubble.textContent = `Excellent question! Let's look at Question ${q.questionNumber} about: "${q.questionText.slice(0, 45)}...". The passage emphasizes that the research remains relevant because the data is *still used*. This corresponds to "${q.choices[0]}" (persists). What part of this grammar or context rule is most confusing?`;
        
        history.appendChild(assistBubble);
        history.scrollTop = history.scrollHeight;
      }, 800);
    }

    // Modal control helpers
    
    function toggleLineReader() {
      isLineReaderActive = !isLineReaderActive;
      const lr = document.getElementById('line-reader-overlay');
      if (isLineReaderActive) {
        if (!lr) {
          const div = document.createElement('div');
          div.id = 'line-reader-overlay';
          div.style.position = 'fixed';
          div.style.left = '0';
          div.style.top = '0';
          div.style.width = '100vw';
          div.style.height = '100vh';
          div.style.pointerEvents = 'none';
          div.style.zIndex = '9000';
          div.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.4) calc(50% - 24px), transparent calc(50% - 24px), transparent calc(50% + 24px), rgba(0,0,0,0.4) calc(50% + 24px), rgba(0,0,0,0.4) 100%)';
          document.body.appendChild(div);
          
          document.addEventListener('mousemove', updateLineReader);
        } else {
          lr.style.display = 'block';
        }
      } else {
        if (lr) lr.style.display = 'none';
      }
    }

    function updateLineReader(e) {
      const lr = document.getElementById('line-reader-overlay');
      if (lr && isLineReaderActive) {
        lr.style.background = `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) ${e.clientY - 24}px, transparent ${e.clientY - 24}px, transparent ${e.clientY + 24}px, rgba(0,0,0,0.3) ${e.clientY + 24}px, rgba(0,0,0,0.3) 100%)`;
      }
    }

    function zoom(direction) {
      if (direction === 'in' && currentZoomLevel < 1.6) {
        currentZoomLevel += 0.1;
      } else if (direction === 'out' && currentZoomLevel > 0.8) {
        currentZoomLevel -= 0.1;
      } else if (direction === 'reset') {
        currentZoomLevel = 1;
      }
      document.documentElement.style.setProperty('--font-passage', (16 * currentZoomLevel) + 'px');
      document.documentElement.style.setProperty('--font-ui', (15 * currentZoomLevel) + 'px');
    }

    function toggleShortcutsModal(open) {
      document.getElementById('shortcuts-modal-overlay').classList.toggle('open', open);
    }

    function toggleDirections(open) {
      const arrow = document.getElementById('directions-arrow');
      if (arrow) arrow.textContent = open ? '▲' : '▾';
      document.getElementById('directions-modal-overlay').classList.toggle('open', open);
    }

    function toggleMoreMenu() {
      document.getElementById('more-dropdown').classList.toggle('open');
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          alert(`Error attempting to enable full-screen mode: ${err.message}

    document.addEventListener('fullscreenchange', () => {
      const btn = document.getElementById('fullscreen-btn-text');
      if (btn) {
        btn.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
      }
    });
`);
        });
      } else {
        document.exitFullscreen();
      }
      toggleMoreMenu();
    }

    function toggleDarkMode() {
      document.body.classList.toggle('dark');
      toggleMoreMenu();
      showToast("Toggled screen contrast.");
    }

    function confirmExit() {
      if (confirm("Are you sure you want to exit? Your current simulator answers will be saved.")) {
        saveProgressAndExit();
      }
    }

    function saveProgressAndExit() {
      window.location.href = '/past-exams.html';
    }

    function triggerReport() {
      const issue = prompt("Enter bug details or content issue:");
      if (issue) {
        showToast("Report submitted successfully! Thank you. рџЋЇ");
      }
      const menu = document.getElementById('more-dropdown');
      if (menu) menu.classList.remove('open');
    }

    // Navigation and Pager
    
    function goToPrevQuestion() {
      if (currentIdx > 0) {
        loadQuestion(currentIdx - 1);
      }
    }

    function goToNextQuestion() {
      if (currentIdx < questions.length - 1) {
        loadQuestion(currentIdx + 1);
      } else {
        submitExam();
      }
    }

    async function submitExam() {
      if (getSubmissionResult()) {
        // already submitted, simply close or view results
        return;
      }
      
      const moduleDisplay = currentModule.toUpperCase();
      if (!confirm(`Are you ready to submit your answers for ${moduleDisplay}?`)) return;
      
      clearInterval(timerInterval);
      
      const maxTime = (currentModule.includes('math') ? 35 : 32) * 60;
      const payload = {
        answers: userAnswers,
        timeSpent: maxTime - timerTotalSeconds,
        module: currentModule
      };
      
      try {
        const response = await fetch(`/api/exams/${examId}/submit`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          const result = await response.json();
          // Store results in session storage to display correct/wrong outlines
          sessionStorage.setItem(`result_${examId}_${currentModule}`, JSON.stringify(result));
          
          // Display result modal
          document.getElementById('results-percentage').textContent = `${result.percentage}%`;
          document.getElementById('results-correct-ratio').textContent = `Correct Answers: ${result.score} of ${result.total}`;
          document.getElementById('results-ring-fill').style.strokeDasharray = `${result.percentage}, 100`;
          
          document.getElementById('results-modal-overlay').classList.add('open');
        } else {
          alert("Submission error. Please check server.");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to submit exam session.");
      }
    }

    function getSubmissionResult() {
      const data = sessionStorage.getItem(`result_${examId}_${currentModule}`);
      return data ? JSON.parse(data) : null;
    }

    function reviewIncorrectAnswers() {
      document.getElementById('results-modal-overlay').classList.remove('open');
      isExplanationsVisible = true;
      loadQuestion(0);
    }

    // Navigator Popover Grid builders
    function toggleNavigatorPopover() {
      document.getElementById('navigator-popover').classList.toggle('open');
    }

    function renderNavigatorGrid() {
      const grid = document.getElementById('navigator-grid');
      grid.innerHTML = '';
      
      for (let idx = 0; idx < questions.length; idx++) {
        const qNum = idx + 1;
        const node = document.createElement('div');
        node.className = 'popover-node';
        node.id = `nav-node-${qNum}`;
        node.textContent = qNum;
        node.onclick = () => {
          loadQuestion(idx);
          toggleNavigatorPopover();
        };
        
        // Add answered / bookmarked classes
        if (userAnswers[qNum]) {
          node.classList.add('answered');
        }
        if (bookmarkedQuestions[qNum]) {
          node.classList.add('flagged');
        }
        
        // If submitted, show correctness
        const submissionResult = getSubmissionResult();
        if (submissionResult) {
          const resultObj = submissionResult.results.find(r => r.questionNumber === qNum);
          if (resultObj) {
            if (resultObj.isCorrect) node.classList.add('correct');
            else node.classList.add('wrong');
          }
        }
        
        grid.appendChild(node);
      }
    }

    function updateActiveNavigatorNode() {
      const qNum = currentIdx + 1;
      for (let i = 0; i < questions.length; i++) {
        const node = document.getElementById(`nav-node-${i + 1}`);
        if (node) {
          node.classList.remove('active');
          if ((i + 1) === qNum) {
            node.classList.add('active');
          }
        }
      }
    }

    async function saveTypedVocab() {
      const input = document.getElementById('vocab-input-field');
      const btn = document.getElementById('vocab-save-btn');
      const spinner = document.getElementById('vocab-spinner');
      let word = input.value.trim();
      if (word.length > 50) word = word.substring(0, 50);
      if (!word) return;

      const contextEl = document.getElementById('sh-title');
      const context = contextEl ? contextEl.textContent.trim() : 'Practice Exam';
      const token = localStorage.getItem('jwt_token') || '';

      const originalText = btn.textContent || 'Save';
      const originalBg = btn.style.backgroundColor || '';
      const originalColor = btn.style.color || '';

      btn.disabled = true;
      btn.textContent = '⏳';
      if (spinner) spinner.style.display = 'block';

      try {
        const res = await fetch('/api/vocab/word', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ word, context })
        });
        const data = await res.json();
        
        if (res.ok) {
          if (typeof showToast === 'function') {
            try { showToast(`Saved "${word}" to Vocabulary Bank`); } catch (err) { console.error(err); }
          }
          
          btn.textContent = '✓ Saved!';
          btn.style.backgroundColor = '#10b981';
          btn.style.color = '#fff';
          
          await new Promise(resolve => setTimeout(resolve, 1200));
          input.value = '';
          document.getElementById('save-vocab-box').style.display = 'none';
        } else {
          if (typeof showToast === 'function') {
            try { showToast(data.error || "Error saving word"); } catch (err) { console.error(err); }
          }
          
          btn.textContent = '✗ Error';
          btn.style.backgroundColor = '#ef4444';
          btn.style.color = '#fff';
          
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (e) {
        if (typeof showToast === 'function') {
          try { showToast("Network error saving word"); } catch (err) { console.error(err); }
        }
        
        btn.textContent = '✗ Error';
        btn.style.backgroundColor = '#ef4444';
        btn.style.color = '#fff';
        
        await new Promise(resolve => setTimeout(resolve, 1500));
      } finally {
        btn.textContent = originalText;
        btn.style.backgroundColor = originalBg;
        btn.style.color = originalColor;
        btn.disabled = false;
        if (spinner) spinner.style.display = 'none';
      }
    }

    // Toast alerts helper
    function showToast(msg) {
      const toast = document.createElement('div');
      toast.style.position = 'fixed';
      toast.style.bottom = '80px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = 'var(--text-main)';
      toast.style.color = 'var(--bg-app)';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '30px';
      toast.style.fontSize = '13.5px';
      toast.style.fontWeight = '600';
      toast.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
      toast.style.zIndex = '9999';
      toast.textContent = msg;
      
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }

    // Close popovers on click outside
    document.addEventListener('click', (e) => {
      // More dropdown
      const moreBtn = document.getElementById('more-menu-btn');
      const moreDrop = document.getElementById('more-dropdown');
      if (moreBtn && !moreBtn.contains(e.target) && !moreDrop.contains(e.target)) {
        moreDrop.classList.remove('open');
      }
      
      // Navigator popover
      const navBtn = document.getElementById('navigator-btn');
      const navPop = document.getElementById('navigator-popover');
      if (navBtn && !navBtn.contains(e.target) && !navPop.contains(e.target)) {
        navPop.classList.remove('open');
      }
    });


    // Global function exports for HTML onclick handlers
    window.toggleHighlightMode = toggleHighlightMode;
    window.handleSelection = handleSelection;
    window.handleMouseUp = handleMouseUp;
    window.showToolbar = showToolbar;
    window.applyHighlight = applyHighlight;
    window.removeHighlight = removeHighlight;
    window.addNote = addNote;
    window.saveNote = saveNote;
    window.persistHighlights = persistHighlights;
    window.restoreHighlights = restoreHighlights;
    window.initURLParams = initURLParams;
    window.updateTimerDisplay = updateTimerDisplay;
    window.toggleTimerVisibility = toggleTimerVisibility;
    window.startTimer = startTimer;
    window.selectChoice = selectChoice;
    window.toggleElimination = toggleElimination;
    window.toggleQuestionBookmark = toggleQuestionBookmark;
    window.toggleExplanation = toggleExplanation;
    window.togglePreppyAI = togglePreppyAI;
    window.sendPreppyMessage = sendPreppyMessage;
    window.toggleLineReader = toggleLineReader;
    window.updateLineReader = updateLineReader;
    window.zoom = zoom;
    window.toggleShortcutsModal = toggleShortcutsModal;
    window.toggleDirections = toggleDirections;
    window.toggleMoreMenu = toggleMoreMenu;
    window.toggleFullscreen = toggleFullscreen;
    window.toggleDarkMode = toggleDarkMode;
    window.confirmExit = confirmExit;
    window.saveProgressAndExit = saveProgressAndExit;
    window.triggerReport = triggerReport;
    window.goToPrevQuestion = goToPrevQuestion;
    window.goToNextQuestion = goToNextQuestion;
    window.getSubmissionResult = getSubmissionResult;
    window.reviewIncorrectAnswers = reviewIncorrectAnswers;
    window.toggleNavigatorPopover = toggleNavigatorPopover;
    window.renderNavigatorGrid = renderNavigatorGrid;
    window.updateActiveNavigatorNode = updateActiveNavigatorNode;
    window.showToast = showToast;
    if (typeof toggleTimerPause !== 'undefined') window.toggleTimerPause = toggleTimerPause;
    window.addEventListener('beforeunload', () => { if (timerInterval) clearInterval(timerInterval); });