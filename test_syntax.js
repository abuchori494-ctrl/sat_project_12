
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Outfit', 'Inter', 'sans-serif'],
          },
          colors: {
            lavBg: '#F8F7FF',
            lavCard: '#FFFFFF',
            lavBorder: '#EDE9FE',
            lavAccent: '#7C6FE0',
            lavAccent2: '#B8B0F5',
            lavLight: '#F0EFFE',
            lavDark: '#1A1035',
            lavGray: '#6B7280'
          },
          boxShadow: {
            lav: '0 2px 12px rgba(124, 111, 224, 0.08)'
          }
        }
      }
    }
  

    (function() {
      const savedTheme = localStorage.getItem('oneprep_theme') || 'dark';
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(savedTheme);
    })();
  

    

    // State Variables
    let currentView = 'landing';
    let studyDaysState = {}; // { Mon: "standard", Wed: "extended" }
    let activeDropdownDay = null;
    let studyModeState = null;
    let alternatingDaysState = {};
    const weekDaysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    // File upload states
    let selectedFileObject = null;

    // Offline auto fallback mock DB
    let offlineMode = false;
    let offlinePlans = JSON.parse(localStorage.getItem('oneprep_offline_plans')) || {};
    const hardcodedPlanId = "plan_mockup";
    offlinePlans[hardcodedPlanId] = {
        planId: hardcodedPlanId,
        targetScore: 1500,
        examDate: "2026-12-05",
        studyMode: "custom",
        plan: [
          { dayIndex: 0, week: 1, fullDateStr: "Thursday, June 11", isToday: true, tasks: [{ type: "Math", topic: "Advanced Math", questionCount: 22, estimatedMinutes: 35 }, { type: "English", topic: "Reading Comprehension", questionCount: 27, estimatedMinutes: 35 }, { type: "English", topic: "Central Ideas & Details", questionCount: 27, estimatedMinutes: 32 }, { type: "Vocab", topic: "Daily Vocabulary", questionCount: 10, estimatedMinutes: 15 }] },
          { dayIndex: 1, week: 1, fullDateStr: "Friday, June 12", isToday: false, tasks: [{ type: "Math", topic: "Data Analysis", questionCount: 27, estimatedMinutes: 32 }, { type: "English", topic: "Central Ideas & Details", questionCount: 27, estimatedMinutes: 32 }, { type: "English", topic: "Command of Evidence", questionCount: 27, estimatedMinutes: 32 }, { type: "Vocab", topic: "Daily Vocabulary", questionCount: 10, estimatedMinutes: 15 }] }
        ]
    };
    let checkedTasksGlob = JSON.parse(localStorage.getItem('oneprep_plan_checks')) || {};
    checkedTasksGlob[`${hardcodedPlanId}_day0_task0`] = true;
    checkedTasksGlob[`${hardcodedPlanId}_day0_task1`] = false;
    checkedTasksGlob[`${hardcodedPlanId}_day0_task2`] = false;
    checkedTasksGlob[`${hardcodedPlanId}_day0_task3`] = false;
    checkedTasksGlob[`${hardcodedPlanId}_day1_task0`] = false;
    checkedTasksGlob[`${hardcodedPlanId}_day1_task1`] = false;
    checkedTasksGlob[`${hardcodedPlanId}_day1_task2`] = false;
    checkedTasksGlob[`${hardcodedPlanId}_day1_task3`] = false;
    localStorage.setItem('oneprep_plan_checks', JSON.stringify(checkedTasksGlob));
    let offlineStats = { totalPlansCreated: 0, totalUploads: 0, averageTargetScore: 1480 };

    // Standard DOM bindings
    document.addEventListener('DOMContentLoaded', () => {
      // Event listeners for ESC and outside clicks
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeModal('modal-days');
        }
      });

      checkExistingPlan();
    });
    
    async function checkExistingPlan() {
      try {
        const res = await fetch(`${API_BASE}/api/dashboard`);
        const data = await res.json();
        if (data.studyPlan || Object.keys(offlinePlans).length > 0) {
          viewActivePlan();
        } else {
          navigate('landing');
          showSetupOptions();
        }
      } catch (err) {
        if (Object.keys(offlinePlans).length > 0) {
          viewActivePlan();
        } else {
          navigate('landing');
          showSetupOptions();
        }
      }
    }

    function showExistingPlan() {
      document.getElementById('existing-plan-container').classList.remove('hidden');
      document.getElementById('setup-options-container').classList.add('hidden');
    }

    function showSetupOptions() {
      document.getElementById('existing-plan-container').classList.add('hidden');
      document.getElementById('setup-options-container').classList.remove('hidden');
    }

    // SPA View Router
    function navigate(viewName) {
      document.getElementById('view-landing').classList.add('hidden');
      document.getElementById('view-upload').classList.add('hidden');
      document.getElementById('view-dashboard').classList.add('hidden');

      document.getElementById(`view-${viewName}`).classList.remove('hidden');
      currentView = viewName;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    async function viewActivePlan() {
      try {
        const res = await fetch(`${API_BASE}/api/dashboard`);
        const data = await res.json();
        if (data.studyPlan) {
          const p = data.studyPlan;
          renderSchedulePlan(p.planId, p.schedule || p.plan, p.targetScore, p.examDate, p.analysis, p.studyMode);
          return;
        }
      } catch (err) {
        console.warn("Backend fetch failed in viewActivePlan. Using local data.");
      }

      const planId = "plan_mockup";
      if (planId && offlinePlans[planId]) {
        const planObj = offlinePlans[planId];
        renderSchedulePlan(planObj.planId, planObj.plan, planObj.targetScore, planObj.examDate, planObj.analysis, planObj.studyMode);
      } else {
        navigate('dashboard');
      }
    }

    function startOverPlan() {
      navigate('landing');
      showSetupOptions();
    }

    // Modal Control flows
    function openModal(id) {
      const modal = document.getElementById(id);
      const card = document.getElementById('modal-days-card');
      
      modal.classList.remove('hidden');
      
      // Clear previous selectors
      studyDaysState = {};
      document.querySelectorAll('#modal-days button').forEach(btn => {
        if (btn.id && btn.id.startsWith('day-')) {
          btn.className = "w-10 h-14 md:w-12 md:h-16 border border-gray-200 text-xs md:text-sm font-bold rounded-xl hover:border-black flex flex-col items-center justify-center gap-1.5 transition-all";
          const dot = btn.querySelector('span:nth-child(2)');
          if (dot) dot.classList.add('hidden');
        }
      });
      updateCreateButtonState();

      // Reset Step 2
      document.getElementById('modal-step-label').textContent = 'Step 1 of 2';
      const step1 = document.getElementById('modal-step-1');
      const step2 = document.getElementById('modal-step-2');
      if (step1) step1.classList.remove('hidden');
      if (step2) {
          step2.classList.add('hidden');
          step2.classList.remove('flex');
      }

      studyModeState = null;
      alternatingDaysState = {};
      ['alternating', 'full_coverage', 'custom'].forEach(c => {
          const el = document.getElementById(`card-${c}`);
          if (el) {
              el.style.border = '2px solid #EDE9FE';
              el.style.backgroundColor = '#FFFFFF';
          }
      });
      const cis = document.getElementById('custom-inputs-section');
      if (cis) cis.classList.add('hidden');
      const ais = document.getElementById('alternating-inputs-section');
      if (ais) {
          ais.classList.add('hidden');
          ais.classList.remove('flex');
      }
      updateCreatePlanButtonState();

      setTimeout(() => {
        card.classList.remove('scale-95', 'opacity-0');
      }, 10);
    }

    function closeModal(id) {
      const modal = document.getElementById(id);
      const card = document.getElementById('modal-days-card');
      
      card.classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 200);
    }

    function handleOutsideClick(event) {
      closeModal('modal-days');
    }

    // ==========================================
    // SCREEN 2: STUDY DAYS POPUP HANDLERS
    // ==========================================
    function toggleStudyDay(dayName, btnEl) {
      const dot = document.getElementById(`dot-${dayName}`);

      if (studyDaysState[dayName]) {
        // Deselect
        delete studyDaysState[dayName];
        btnEl.className = "w-10 h-14 md:w-12 md:h-16 border border-gray-200 text-xs md:text-sm font-bold rounded-xl hover:border-black flex flex-col items-center justify-center gap-1.5 transition-all";
        dot.classList.add('hidden');
      } else {
        // Select
        studyDaysState[dayName] = 'standard';
        btnEl.className = "w-10 h-14 md:w-12 md:h-16 border-2 border-black text-xs md:text-sm font-extrabold rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-1.5 transition-all scale-102";
        dot.className = "w-1.5 h-1.5 rounded-full dot-standard";
        dot.classList.remove('hidden');
      }

      updateCreateButtonState();
    }

    function updateCreateButtonState() {
      const btn = document.getElementById('btn-next-step');
      const keys = Object.keys(studyDaysState);
      
      const mockContainer = document.getElementById('mock-exam-container');
      const mockSelect = document.getElementById('mock-exam-day');

      if (keys.length > 0) {
        btn.disabled = false;
        btn.className = "bg-lavAccent hover:bg-opacity-90 text-white text-xs font-bold px-8 py-4 rounded-[10px] transition-all shadow-sm cursor-pointer active:scale-95 ml-auto";
        
        mockContainer.classList.remove('hidden');
        mockContainer.classList.add('flex');
        const oldVal = mockSelect.value;
        mockSelect.innerHTML = keys.map(k => `<option value="${k}">${k}</option>`).join('');
        if (keys.includes(oldVal)) mockSelect.value = oldVal;
      } else {
        btn.disabled = true;
        btn.className = "bg-gray-300 text-gray-500 text-xs font-bold px-8 py-4 rounded-[10px] transition-all cursor-not-allowed shadow-sm ml-auto";
        mockContainer.classList.add('hidden');
        mockContainer.classList.remove('flex');
      }
    }

    function goToStep2() {
        document.getElementById('modal-step-1').classList.add('hidden');
        document.getElementById('modal-step-2').classList.remove('hidden');
        document.getElementById('modal-step-2').classList.add('flex');
        document.getElementById('modal-step-label').textContent = 'Step 2 of 2';

        if (studyModeState === 'alternating') {
            renderAlternatingDays();
        }
    }

    function goToStep1() {
        document.getElementById('modal-step-2').classList.add('hidden');
        document.getElementById('modal-step-2').classList.remove('flex');
        document.getElementById('modal-step-1').classList.remove('hidden');
        document.getElementById('modal-step-label').textContent = 'Step 1 of 2';
    }

    function selectStudyMode(mode) {
        studyModeState = mode;
        const cards = ['alternating', 'full_coverage', 'custom'];
        cards.forEach(c => {
            const el = document.getElementById(`card-${c}`);
            if (c === mode) {
                el.style.border = '2px solid #7C6FE0';
                el.style.backgroundColor = '#F0EFFE';
            } else {
                el.style.border = '2px solid #EDE9FE';
                el.style.backgroundColor = '#FFFFFF';
            }
        });

        if (mode === 'custom') {
            document.getElementById('custom-inputs-section').classList.remove('hidden');
        } else {
            document.getElementById('custom-inputs-section').classList.add('hidden');
        }

        if (mode === 'alternating') {
            document.getElementById('alternating-inputs-section').classList.remove('hidden');
            document.getElementById('alternating-inputs-section').classList.add('flex');
            renderAlternatingDays();
        } else {
            document.getElementById('alternating-inputs-section').classList.add('hidden');
            document.getElementById('alternating-inputs-section').classList.remove('flex');
        }

        updateCreatePlanButtonState();
    }

    function updateCreatePlanButtonState() {
        const btn = document.getElementById('btn-create-plan');
        if (studyModeState) {
            btn.disabled = false;
            btn.className = "bg-lavAccent hover:bg-opacity-90 text-white text-xs font-bold px-8 py-4 rounded-[10px] transition-all shadow-sm cursor-pointer active:scale-95";
        } else {
            btn.disabled = true;
            btn.className = "bg-gray-300 text-gray-500 text-xs font-bold px-8 py-4 rounded-[10px] transition-all cursor-not-allowed shadow-sm";
        }
    }

    function renderAlternatingDays() {
        const container = document.getElementById('alternating-days-container');
        if (!container) return;

        const selectedDays = Object.keys(studyDaysState).sort((a, b) => weekDaysOrder.indexOf(a) - weekDaysOrder.indexOf(b));
        
        const currentKeys = Object.keys(alternatingDaysState);
        const keysMatch = selectedDays.length === currentKeys.length && selectedDays.every(d => currentKeys.includes(d));

        if (!keysMatch) {
            alternatingDaysState = {};
            let isMath = true;
            selectedDays.forEach(day => {
                alternatingDaysState[day] = isMath ? 'Math' : 'English';
                isMath = !isMath;
            });
        }

        container.innerHTML = selectedDays.map(day => {
            const subject = alternatingDaysState[day];
            const isMath = subject === 'Math';
            const bgClass = isMath ? 'bg-[#EFF6FF]' : 'bg-[#F0EFFE]';
            const textClass = isMath ? 'text-[#3B82F6]' : 'text-[#7C6FE0]';
            
            return `
                <button onclick="toggleAlternatingDay('${day}')" class="px-4 py-2 rounded-full font-bold text-xs transition-all ${bgClass} ${textClass} border border-transparent hover:border-current">
                    ${day} — ${subject}
                </button>
            `;
        }).join('');
    }

    function toggleAlternatingDay(day) {
        if (alternatingDaysState[day] === 'Math') {
            alternatingDaysState[day] = 'English';
        } else {
            alternatingDaysState[day] = 'Math';
        }
        renderAlternatingDays();
    }

    // API Post submission
    async function submitDaysPlan() {
      try {
        const payload = {
          days: studyDaysState,
          studyMode: studyModeState,
          customQuestions: {
            math: parseInt(document.getElementById('custom-math').value) || 20,
            english: parseInt(document.getElementById('custom-english').value) || 20,
            vocab: parseInt(document.getElementById('custom-vocab').value) || 10
          },
          mockExamDay: document.getElementById('mock-exam-day').value,
          targetScore: 1500,
          examDate: "2026-12-05"
        };

        if (studyModeState === 'alternating') {
            payload.dayAssignments = alternatingDaysState;
        }

        const response = await fetch(`${API_BASE}/api/planner/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("API error");
        const resData = await response.json();

        // Save to offline cache to persist across server restarts
        offlinePlans[resData.plan.planId] = {
          planId: resData.plan.planId,
          daysSelected: studyDaysState,
          studyMode: studyModeState,
          targetScore: resData.plan.targetScore,
          examDate: resData.plan.examDate,
          plan: resData.plan.schedule
        };
        localStorage.setItem('oneprep_offline_plans', JSON.stringify(offlinePlans));

        showToast("Your study plan has been created! 🎉");
        closeModal('modal-days');

        // Render created plan inside view-dashboard
        renderSchedulePlan(resData.plan.planId, resData.plan.schedule, resData.plan.targetScore, resData.plan.examDate, null, studyModeState);
      } catch (err) {
        console.warn("Backend unavailable. Falling back to local offline mode.");
        offlineMode = true;
        const fakePlanId = "plan_offline_" + Date.now();
        const fakePlan = generateOfflinePlan(studyDaysState, studyModeState, alternatingDaysState, {
            math: parseInt(document.getElementById('custom-math').value) || 20,
            english: parseInt(document.getElementById('custom-english').value) || 20,
            vocab: parseInt(document.getElementById('custom-vocab').value) || 10
        }, document.getElementById('mock-exam-day').value, "2026-12-05");
        
        offlinePlans[fakePlanId] = {
          planId: fakePlanId,
          daysSelected: studyDaysState,
          studyMode: studyModeState,
          targetScore: 1500,
          examDate: "2026-12-05",
          plan: fakePlan
        };
        localStorage.setItem('oneprep_offline_plans', JSON.stringify(offlinePlans));

        showToast("Your study plan has been created! 🎉");
        closeModal('modal-days');
        renderSchedulePlan(fakePlanId, fakePlan, 1500, "2026-12-05", null, studyModeState);
      }
    }

    // ==========================================
    // SCREEN 3: UPLOAD SAT SCORE REPORT HANDLERS
    // ==========================================
    function toggleTooltip() {
      document.getElementById('score-tooltip').classList.toggle('hidden');
    }

    function triggerFileSelector() {
      document.getElementById('file-input').click();
    }

    function handleDragOver(e) {
      e.preventDefault();
      const zone = document.getElementById('upload-zone');
      zone.classList.add('border-lavAccent', 'bg-lavLight');
    }

    function handleDragLeave() {
      const zone = document.getElementById('upload-zone');
      zone.classList.remove('border-lavAccent', 'bg-lavLight');
    }

    function handleDrop(e) {
      e.preventDefault();
      handleDragLeave();

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        verifyAndLoadFile(e.dataTransfer.files[0]);
      }
    }

    function handleFileSelect(e) {
      if (e.target.files && e.target.files[0]) {
        verifyAndLoadFile(e.target.files[0]);
      }
    }

    function verifyAndLoadFile(file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

      if (!allowed.includes(file.type)) {
        showToast("Unsupported file format! Please upload PDF or image. ⚠️");
        return;
      }

      if (file.size > maxSize) {
        showToast("File size exceeded 10MB limit! ⚠️");
        return;
      }

      // Prepare file reader
      const reader = new FileReader();
      
      // Shift UI to upload running loader
      document.getElementById('upload-idle-state').classList.add('hidden');
      document.getElementById('upload-running-state').classList.remove('hidden');

      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        document.getElementById('upload-bar').style.width = `${progress}%`;
        if (progress >= 100) {
          clearInterval(interval);
          
          // Complete load
          reader.readAsDataURL(file);
        }
      }, 200);

      reader.onload = () => {
        selectedFileObject = {
          file: reader.result.split(',')[1], // raw base64 data
          filename: file.name,
          type: file.type,
          sizeStr: (file.size / (1024 * 1024)).toFixed(1) + " MB"
        };

        // Render Success zone
        document.getElementById('upload-running-state').classList.add('hidden');
        document.getElementById('upload-success-state').classList.remove('hidden');
        document.getElementById('success-filename').textContent = file.name;
        document.getElementById('success-filesize').textContent = selectedFileObject.sizeStr;
        
        const zone = document.getElementById('upload-zone');
        zone.classList.remove('border-lavBorder');
        zone.classList.add('border-[#16a34a]', 'bg-[#d1fae5]/30');

        // Enable continue button
        const btn = document.getElementById('btn-submit-upload');
        btn.disabled = false;
        btn.className = "w-full bg-lavAccent hover:bg-opacity-90 text-white text-xs font-bold py-4 rounded-[10px] transition-all shadow-sm max-w-xs active:scale-95 cursor-pointer";
      };
    }

    function resetFileSelector(e) {
      if (e) e.stopPropagation(); // Avoid loop triggers on zone click
      
      selectedFileObject = null;
      
      // Restore default states
      document.getElementById('file-input').value = '';
      document.getElementById('upload-idle-state').classList.remove('hidden');
      document.getElementById('upload-running-state').classList.add('hidden');
      document.getElementById('upload-success-state').classList.add('hidden');

      const zone = document.getElementById('upload-zone');
      zone.className = "border-2 border-dashed border-lavBorder rounded-[16px] p-10 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all hover:bg-gray-50 relative min-h-[220px]";

      // Disable button
      const btn = document.getElementById('btn-submit-upload');
      btn.disabled = true;
      btn.className = "w-full bg-gray-300 text-gray-500 text-xs font-bold py-4 rounded-[10px] transition-all cursor-not-allowed shadow-sm max-w-xs";
    }

    async function submitUploadedReport() {
      if (!selectedFileObject) return;

      const btn = document.getElementById('btn-submit-upload');
      btn.disabled = true;
      btn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Analyzing...
      `;

      try {
        const response = await fetch(`${API_BASE}/api/planner/upload-score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: selectedFileObject.file,
            filename: selectedFileObject.filename,
            type: selectedFileObject.type
          })
        });

        if (!response.ok) throw new Error("API error");
        const resData = await response.json();
      
      // If the backend is active but doesn't return a plan ID, simulate the offline generation flow.
      if (!resData.planId) throw new Error("Trigger offline analysis mock");

        // Retrieve plan details
        const planRes = await fetch(`${API_BASE}/api/planner/plan/${resData.planId}`);
        const fullPlan = await planRes.json();

        // Save to offline cache to persist across server restarts
        offlinePlans[resData.planId] = {
          planId: resData.planId,
          targetScore: fullPlan.targetScore || 1520,
          examDate: fullPlan.examDate || "2026-12-05",
          plan: fullPlan.schedule || fullPlan.plan,
            studyMode: fullPlan.studyMode || "custom",
          analysis: fullPlan.analysis
        };
        localStorage.setItem('oneprep_offline_plans', JSON.stringify(offlinePlans));

        // Render success page overlay
        showUploadSuccessOverlay(() => {
          renderSchedulePlan(resData.planId, fullPlan.schedule || fullPlan.plan, 1520, "2026-12-05", fullPlan.analysis);
        });

      } catch (err) {
        console.warn("Backend unavailable. Simulating offline report parsing.");
        setTimeout(() => {
          const fakePlanId = "plan_personalized_offline_" + Date.now();
          const presetDays = { Mon: "standard", Wed: "standard", Fri: "standard", Sat: "extended" };
          const fakePlan = generateOfflinePlan(presetDays, "custom", {}, { math: 30, english: 30, vocab: 15 }, "Sat", "2026-12-05");
          
          const fakeAnalysis = {
            totalScore: 1220,
            math: { score: 620, weakAreas: ["Geometry & Trigonometry", "Heart of Algebra"] },
            reading: { score: 600, weakAreas: ["Central Ideas & Details", "Command of Evidence"] },
            recommendations: [
              "Focus on multi-step geometry theorems and circle equations.",
              "Practice transitional words in context to fix sentence flow rules."
            ]
          };

          offlinePlans[fakePlanId] = {
            planId: fakePlanId,
            daysSelected: presetDays,
            targetScore: 1520,
            examDate: "2026-12-05",
            studyMode: "custom",
            plan: fakePlan,
            analysis: fakeAnalysis
          };
          localStorage.setItem('oneprep_offline_plans', JSON.stringify(offlinePlans));

          showUploadSuccessOverlay(() => {
            renderSchedulePlan(fakePlanId, fakePlan, 1520, "2026-12-05", fakeAnalysis);
          });
        }, 1500);
      }
    }

    function showUploadSuccessOverlay(callback) {
      // Build temporary visual screen success block overlay
      const overlay = document.createElement('div');
      overlay.className = "fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center gap-4 animate-fade-in";
      overlay.innerHTML = `
        <svg class="w-16 h-16 text-[#16a34a] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h2 class="text-2xl font-bold text-lavDark">Score Report Analyzed Successfully!</h2>
        <p class="text-sm text-lavGray font-medium animate-pulse">Prepping your personalized SAT study plan now...</p>
      `;
      document.body.appendChild(overlay);

      setTimeout(() => {
        document.body.removeChild(overlay);
        resetFileSelector();
        callback();
      }, 2000);
    }

    // ==========================================
    // DYNAMIC STUDY PLAN DASHBOARD RENDERER
    // ==========================================
    let currentPlanData = null;
    let currentPlanId = null;
    let currentWeek = 1;

    function renderWeekTabs(totalWeeks) {
      if (!document.getElementById('week-tabs-wrapper')) {
          const originalTabs = document.getElementById('week-tabs');
          if (originalTabs) {
              originalTabs.outerHTML = `
                <div class="relative flex items-center border-b border-gray-200 pb-1" id="week-tabs-wrapper">
                    <button onclick="document.getElementById('week-tabs').scrollBy({left:-200, behavior:'smooth'})" class="hidden md:flex absolute left-0 z-10 w-10 h-10 bg-white shadow-sm flex items-center justify-center -ml-4 rounded-full hover:bg-[#F8F7FF] hover:border-[#7C6FE0] text-[#7C6FE0] hover:text-[#5B21B6] font-bold border-2 border-[#EDE9FE] transition-all"><span class="-translate-x-[1px]">&lt;</span></button>
                    <div class="flex gap-2 overflow-x-auto hide-scrollbar flex-1 scroll-smooth px-4" id="week-tabs" style="scrollbar-width: none;"></div>
                    <button onclick="document.getElementById('week-tabs').scrollBy({left:200, behavior:'smooth'})" class="hidden md:flex absolute right-0 z-10 w-10 h-10 bg-white shadow-sm flex items-center justify-center -mr-4 rounded-full hover:bg-[#F8F7FF] hover:border-[#7C6FE0] text-[#7C6FE0] hover:text-[#5B21B6] font-bold border-2 border-[#EDE9FE] transition-all"><span class="translate-x-[1px]">&gt;</span></button>
                </div>
              `;
          }
      }
      const tabsContainer = document.getElementById('week-tabs');
      if (!tabsContainer) return;

      tabsContainer.innerHTML = '';
      for (let i = 1; i <= totalWeeks; i++) {
        const btn = document.createElement('button');
        btn.id = `tab-week-${i}`;
        btn.onclick = () => switchWeek(i);
        tabsContainer.appendChild(btn);
      }
      updateWeekTabStyles();
    }

    function updateWeekTabStyles() {
      if (!currentPlanData) return;
      const totalWeeks = currentPlanData.length > 0 ? Math.max(...currentPlanData.map(d => d.week)) : 1;
      let checkedTasks = JSON.parse(localStorage.getItem('oneprep_plan_checks')) || {};
      
      for(let i=1; i<=totalWeeks; i++) {
        const tab = document.getElementById(`tab-week-${i}`);
        if(!tab) continue;
        
        // Calculate completion for this week
        let totalWk = 0;
        let compWk = 0;
        currentPlanData.filter(d => d.week === i).forEach(day => {
            day.tasks.forEach((t, tIdx) => {
                if(t.type !== 'Rest') {
                    totalWk++;
                    const tId = `${currentPlanId}_day${day.dayIndex}_task${tIdx}`;
                    const oId = `${currentPlanId}_${day.dayIndex}`;
                    if (checkedTasks[tId] || (tIdx===0 && checkedTasks[oId])) compWk++;
                }
            });
        });
        const isCompleted = totalWk > 0 && compWk === totalWk;

        if(i === currentWeek) {
          tab.className = "flex items-center gap-2 px-5 py-2 text-[14px] font-bold bg-[#7C6FE0] text-white rounded-full transition-all whitespace-nowrap shadow-md";
          tab.innerHTML = `Week ${i}`;
        } else if (isCompleted) {
          tab.className = "flex items-center gap-2 px-5 py-2 text-[14px] font-bold bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5] rounded-full transition-all whitespace-nowrap";
          tab.innerHTML = `<div class="w-2 h-2 rounded-full bg-[#10B981]"></div> Week ${i}`;
        } else if (compWk > 0) {
          tab.className = "flex items-center gap-2 px-5 py-2 text-[14px] font-bold bg-[#F5F3FF] text-[#7C6FE0] hover:bg-[#EDE9FE] rounded-full transition-all whitespace-nowrap";
          tab.innerHTML = `<div class="w-2 h-2 rounded-full bg-[#7C6FE0]"></div> Week ${i}`;
        } else {
          tab.className = "flex items-center gap-2 px-5 py-2 text-[14px] font-semibold bg-transparent text-[#9CA3AF] hover:bg-gray-100 border border-transparent rounded-full transition-all whitespace-nowrap";
          tab.innerHTML = `Week ${i}`;
        }
      }
    }

    function switchWeek(weekNum) {
      currentWeek = weekNum;
      updateWeekTabStyles();
      renderCalendar();
    }

    function calculateDaysLeft(examDateStr) {
      if (!examDateStr) return "--";
      const ed = new Date(examDateStr);
      const diff = ed - new Date();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    
    function formatStudyMode(mode) {
      if (mode === 'alternating') return 'Alternating Focus';
      if (mode === 'full_coverage') return 'Full Coverage';
      if (mode === 'custom') return 'Custom Mix';
      return 'Standard';
    }

    function getTaskStyling(type) {
        if (type === 'Math') return { border: '#1D9E75', badgeBg: '#D1FAE5', badgeText: '#065F46', icon: '△' };
        if (type === 'English') return { border: '#7F77DD', badgeBg: '#EEEDFE', badgeText: '#534AB7', icon: '☶' };
        if (type === 'Vocab') return { border: '#EF9F27', badgeBg: '#FEF3C7', badgeText: '#92400E', icon: '✦' };
        if (type === 'Mock Exam') return { border: '#F59E0B', badgeBg: '#FEF3C7', badgeText: '#F59E0B', icon: '📝' };
        return { border: '#9CA3AF', badgeBg: '#F3F4F6', badgeText: '#6B7280', icon: '🧘' };
    }

    function renderCalendar() {
      const calendar = document.getElementById('schedule-calendar');
      calendar.innerHTML = '';
      calendar.className = 'grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 !mt-6 w-full max-w-5xl mx-auto items-start relative';
      
      const headerContainer = document.getElementById('board-header-container');
      if (headerContainer) headerContainer.remove();

      let checkedTasks = JSON.parse(localStorage.getItem('oneprep_plan_checks')) || {};

      const weekDays = currentPlanData.filter(item => item.week === currentWeek);

      if (weekDays.length > 0) {
          const weekHeader = document.createElement('div');
          weekHeader.className = "col-span-1 lg:col-span-2 mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4";
          
          const startDate = new Date();
          startDate.setHours(0,0,0,0);
          const weekStart = new Date(startDate);
          weekStart.setDate(startDate.getDate() + (currentWeek - 1) * 7);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const weekDateRange = `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()} – ${monthNames[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;
          
          let totalWkMins = 0;
          let totalWkTasks = 0;
          let compWkTasks = 0;
          let subjects = new Set();
          
          weekDays.forEach(dayObj => {
              dayObj.tasks.forEach((t, tIdx) => {
                  if (t.type !== 'Rest') {
                      totalWkTasks++;
                      totalWkMins += (t.estimatedMinutes || 0);
                      subjects.add(t.type);
                      const tId = `${currentPlanId}_day${dayObj.dayIndex}_task${tIdx}`;
                      const oId = `${currentPlanId}_${dayObj.dayIndex}`;
                      if (checkedTasks[tId] || (tIdx===0 && checkedTasks[oId])) compWkTasks++;
                  }
              });
          });
          
          const hrs = Math.floor(totalWkMins / 60);
          const mins = totalWkMins % 60;
          const subjsArr = Array.from(subjects).map(s => s==='English'?'Reading & Writing':s).join(', ');

          weekHeader.innerHTML = `
            <div>
              <h1 class="text-[18px] font-[800] text-[#1E1B4B] tracking-wide mb-1">Week ${currentWeek} <span class="text-[14px] font-medium text-[#6B7280] ml-2">(${weekDateRange})</span></h1>
              <div class="mt-2 flex items-center flex-wrap gap-3 text-[12px] font-bold text-[#6B7280]">
                <span class="bg-white border border-gray-200 px-3 py-1 rounded-md shadow-sm flex items-center gap-1.5"><span class="text-[#1D9E75]">${compWkTasks}</span> / ${totalWkTasks} tasks</span>
                <span class="bg-white border border-gray-200 px-3 py-1 rounded-md shadow-sm flex items-center gap-1.5">⏱ ${hrs}h ${mins}m studied</span>
                <span class="bg-white border border-gray-200 px-3 py-1 rounded-md shadow-sm flex items-center gap-1.5">📚 ${subjsArr}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button onclick="document.getElementById('schedule-calendar').scrollIntoView({behavior: 'smooth'})" class="bg-white hover:bg-gray-50 text-gray-700 text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm border border-gray-200 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                Jump to Today
              </button>
              <div class="flex items-center gap-2 bg-[#F5F3FF] px-4 py-2 rounded-xl shadow-sm border border-[#EDE9FE]">
                <span class="text-lg">🔥</span>
                <div>
                  <p class="text-[10px] font-bold text-[#7C6FE0] uppercase tracking-widest leading-none mb-0.5">Current Streak</p>
                  <p class="text-[15px] font-black text-[#5B21B6] leading-none">4 Days</p>
                </div>
              </div>
            </div>
          `;
          calendar.appendChild(weekHeader);
      }
      
      weekDays.forEach((dayObj, index) => {
        const trueDayIndex = dayObj.dayIndex;
        
        let totalDayMins = 0;
        let totalDayTasks = 0;
        let completedDayTasks = 0;

        dayObj.tasks.forEach((t, tIdx) => {
            if (t.type !== 'Rest') {
                totalDayTasks++;
                totalDayMins += (t.estimatedMinutes || 0);
                const tId = `${currentPlanId}_day${trueDayIndex}_task${tIdx}`;
                const oId = `${currentPlanId}_${trueDayIndex}`;
                if (checkedTasks[tId] || (tIdx===0 && checkedTasks[oId])) completedDayTasks++;
            }
        });

        const dayPct = totalDayTasks > 0 ? Math.round((completedDayTasks / totalDayTasks) * 100) : 0;
        const isDayComplete = dayPct === 100 && totalDayTasks > 0;
        const isOpen = dayObj.isToday && !isDayComplete; 
        
        const dayCol = document.createElement('div');
        dayCol.className = "flex flex-col bg-white border border-[#E8EAF2] rounded-[12px] overflow-hidden";

        const dayHeader = document.createElement('div');
        dayHeader.className = "relative flex items-center justify-between h-[44px] px-4 bg-white cursor-pointer select-none";
        dayHeader.onclick = function() {
            const container = this.nextElementSibling;
            const caret = this.querySelector('svg.caret');
            if (container.classList.contains('hidden')) {
                container.classList.remove('hidden');
                caret.style.transform = 'rotate(0deg)';
            } else {
                container.classList.add('hidden');
                caret.style.transform = 'rotate(-90deg)';
            }
        };

        const progColor = isDayComplete ? '#10B981' : '#7C6FE0';
        let hours = Math.floor(totalDayMins / 60);
        let mins = totalDayMins % 60;
        let timeStr = hours > 0 ? `~${hours}h ${mins}m` : `~${mins}m`;
        if (totalDayMins === 0) timeStr = 'Rest Day';

        dayHeader.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wide">DAY ${trueDayIndex + 1}</span>
                <span class="text-[13px] font-[500] text-[#1E1B4B]">${dayObj.fullDateStr}</span>
                ${dayObj.isToday ? '<span class="bg-[#F3F4F6] text-[#4B5563] text-[10px] font-bold px-2 py-0 h-[24px] rounded-full flex items-center uppercase ml-1">Today</span>' : ''}
                ${isDayComplete ? '<span class="bg-[#D1FAE5] text-[#059669] text-[10px] font-bold px-2 py-0 h-[24px] rounded-full flex items-center uppercase ml-1">Complete</span>' : ''}
            </div>
            
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-1.5 text-[11px] font-medium text-[#6B7280] whitespace-nowrap">
                    <span>${completedDayTasks}/${totalDayTasks}</span>
                    <span class="text-[#D1D5DB]">|</span>
                    <span>${timeStr}</span>
                </div>
                <svg class="caret w-4 h-4 text-[#9CA3AF] transition-transform duration-200" style="transform: rotate(${isOpen ? '0deg' : '-90deg'});" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            ${totalDayTasks > 0 ? `
            <div class="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E8EAF2]">
                <div class="h-full transition-all duration-500" style="width: ${dayPct}%; background: ${progColor};"></div>
            </div>` : ''}
        `;
        dayCol.appendChild(dayHeader);

        const tasksContainer = document.createElement('div');
        tasksContainer.className = `flex flex-col border-t border-[#E8EAF2] ${isOpen ? '' : 'hidden'}`;
        dayCol.appendChild(tasksContainer);

        dayObj.tasks.forEach((task, taskIdx) => {
            const taskId = `${currentPlanId}_day${trueDayIndex}_task${taskIdx}`;
            const oldTaskId = `${currentPlanId}_${trueDayIndex}`;
            const isChecked = checkedTasks[taskId] || (taskIdx === 0 && checkedTasks[oldTaskId]);

            const style = getTaskStyling(task.type);
            const isRest = task.type === 'Rest';
            const isMock = task.type === 'Mock Exam';

            const card = document.createElement('div');
            card.className = `group relative hover:bg-gray-50 cursor-pointer border-b border-[#E8EAF2] last:border-b-0 bg-white transition-colors flex justify-between items-center pl-4 pr-2 py-2`;
            
            let actionHtml = '';
            let btnHtml = '';
            if (isRest) {
                // No action
            } else if (isMock) {
                btnHtml = `<button onclick="window.location.href='/mock-exam'" class="bg-[#1D9E75] text-white text-[12px] h-[28px] px-[10px] rounded-[7px] font-medium transition-all whitespace-nowrap">Continue →</button>`;
            } else {
                if (isChecked) {
                    btnHtml = `<button onclick="window.location.href='/exam.html?mode=practice'" class="mr-3 font-medium text-[12px] h-[28px] px-[10px] rounded-[7px] transition-all bg-[#F3F4F6] border border-[#D1D5DB] text-[#4B5563] hover:bg-[#E5E7EB] whitespace-nowrap">Review →</button>`;
                } else {
                    btnHtml = `<button onclick="window.location.href='/exam.html?mode=practice'" class="mr-3 font-medium text-[12px] h-[28px] px-[10px] rounded-[7px] transition-all bg-[#7C6FE0] text-white hover:bg-[#5B21B6] whitespace-nowrap border-none">Start →</button>`;
                }
                actionHtml = `
                    <div class="relative flex items-center justify-center w-[18px] h-[18px] cursor-pointer shrink-0" onclick="togglePlanCheck(this, '${currentPlanId}', ${trueDayIndex}, ${taskIdx}, '${style.border}')">
                      <div class="checkbox-box w-[18px] h-[18px] rounded-[5px] border-[1.5px] transition-all flex items-center justify-center ${isChecked ? 'border-[#1D9E75] bg-[#1D9E75]' : 'border-[#D1D5DB] bg-white'}">
                        <svg class="checkmark w-2.5 h-2.5 text-white transition-all ${isChecked ? 'opacity-100' : 'opacity-0'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                    </div>
                `;
            }

            let displayType = task.type.toUpperCase();
            if (displayType === 'ENGLISH') displayType = 'READING & WRITING';
            if (displayType === 'MOCK EXAM') displayType = 'MOCK_EXAM';

            card.innerHTML = `
              <div class="flex items-center gap-[8px] min-w-0 flex-1">
                <!-- Icon Box -->
                <div class="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center text-[13px] shrink-0" style="background: ${style.badgeBg}; color: ${style.badgeText}; font-family: system-ui; font-weight: 600;">
                  ${style.icon}
                </div>
                <!-- Content -->
                <div class="flex flex-col min-w-0 flex-1 justify-center gap-0">
                  <div class="flex items-center gap-2">
                      <span class="text-[10px] font-bold px-[8px] py-[4px] rounded-[10px] uppercase leading-none" style="background: ${style.badgeBg}; color: ${style.badgeText};">${displayType}</span>
                      <h4 title="${escapeHtml(task.topic)}" class="text-[13px] text-[#1E1B4B] truncate leading-none ${isChecked ? 'font-[400] line-through text-[#9CA3AF]' : 'font-[500]'}">${escapeHtml(task.topic)}</h4>
                  </div>
                  <div class="flex items-center flex-wrap gap-x-2 mt-1">
                      ${!isRest && !isMock ? `
                        <p class="text-[11px] text-[#9CA3AF] font-normal leading-none ${isChecked ? 'opacity-60' : ''}">${task.questionCount} questions · ${task.estimatedMinutes} mins</p>
                      ` : ''}
                      ${isMock ? `
                        <p class="text-[11px] text-[#9CA3AF] font-normal leading-none mt-0">Full SAT Length · 134 mins</p>
                      ` : ''}
                      ${isRest ? `
                        <p class="text-[11px] text-[#9CA3AF] font-normal leading-none mt-0">Take a break today to prevent burnout.</p>
                      ` : ''}
                  </div>
                </div>
              </div>
              <!-- Action / Checkbox -->
              <div class="shrink-0 flex items-center ml-2">
                ${btnHtml}
                ${actionHtml}
              </div>
            `;
            tasksContainer.appendChild(card);
        });
        calendar.appendChild(dayCol);
      });

      const centerLine = document.createElement('div');
      centerLine.className = "hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-gray-300 transform -translate-x-1/2";
      calendar.appendChild(centerLine);
    }

    function updateProgressBars() {
      let checkedTasks = JSON.parse(localStorage.getItem('oneprep_plan_checks')) || {};
      let totalTasksThisWeek = 0;
      let completedTasksThisWeek = 0;
      let totalTasksAll = 0;
      let completedTasksAll = 0;

      const weekDays = currentPlanData.filter(item => item.week === currentWeek);
      weekDays.forEach(day => {
          day.tasks.forEach((t, tIdx) => {
              if (t.type !== 'Rest') {
                  totalTasksThisWeek++;
                  if (checkedTasks[`${currentPlanId}_day${day.dayIndex}_task${tIdx}`] || (tIdx===0 && checkedTasks[`${currentPlanId}_${day.dayIndex}`])) completedTasksThisWeek++;
              }
          });
      });

      currentPlanData.forEach(day => {
          day.tasks.forEach((t, tIdx) => {
              if (t.type !== 'Rest') {
                  totalTasksAll++;
                  if (checkedTasks[`${currentPlanId}_day${day.dayIndex}_task${tIdx}`] || (tIdx===0 && checkedTasks[`${currentPlanId}_${day.dayIndex}`])) completedTasksAll++;
              }
          });
      });

      const weeklyText = document.getElementById('weekly-completed-text');
      if (weeklyText) weeklyText.textContent = `${completedTasksThisWeek} of ${totalTasksThisWeek} tasks completed this week`;
      
      const pct = totalTasksThisWeek === 0 ? 0 : Math.round((completedTasksThisWeek / totalTasksThisWeek) * 100);
      const weeklyBar = document.getElementById('weekly-progress-bar');
      if (weeklyBar) weeklyBar.style.width = `${pct}%`;
      
      let msg = "Let's get started! 🚀";
      if (pct > 0) msg = "Great start! Keep going 🔥";
      if (pct > 40) msg = "You're doing amazing! 🌟";
      if (pct > 80) msg = "Almost done for the week! 💪";
      if (pct === 100 && totalTasksThisWeek > 0) msg = "Perfect week! You crushed it! 🏆";
      const motText = document.getElementById('weekly-motivational-text');
      if (motText) motText.textContent = msg;

      const totalPct = totalTasksAll === 0 ? 0 : Math.round((completedTasksAll / totalTasksAll) * 100);
      const totalText = document.getElementById('dash-total-progress-text');
      if (totalText) totalText.textContent = `1% Complete`;
      const totalBar = document.getElementById('dash-total-progress-bar');
      if (totalBar) totalBar.style.width = `1%`;
      
      const weekProgressText = document.getElementById('dash-week-progress-text');
      if(weekProgressText) weekProgressText.textContent = `Week 1 of 27`;
      
      updateWeekTabStyles();
    }

    function renderSchedulePlan(planId, plan, goalScore, examDate, analysis = null, studyMode = 'Standard') {
      currentPlanId = planId;

      if (!plan || !Array.isArray(plan)) {
        console.error("Invalid plan array passed to renderSchedulePlan", plan);
        const mockDay = document.getElementById('mock-exam-day') ? document.getElementById('mock-exam-day').value : null;
        const cQs = {
            math: parseInt(document.getElementById('custom-math')?.value) || 20,
            english: parseInt(document.getElementById('custom-english')?.value) || 20,
            vocab: parseInt(document.getElementById('custom-vocab')?.value) || 10
        };
        plan = generateOfflinePlan(studyDaysState || {}, studyMode, alternatingDaysState || {}, cQs, mockDay, examDate);
      }

      // Upgrade old flat plan structure to nested tasks if necessary
      const startDate = new Date();
      startDate.setHours(0,0,0,0);

      if (plan.length > 0) {
          plan = plan.map((item, i) => {
              const dayIndex = item.dayIndex !== undefined ? item.dayIndex : i;
              const dayDate = new Date(startDate);
              dayDate.setDate(startDate.getDate() + dayIndex);

              const dayNameList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              
              let tasks = item.tasks;
              if (!tasks) {
                  const isRest = item.type === 'rest';
                  const isMock = item.section === 'Mock Exam' || item.type === 'mock_exam';
                  
                  tasks = [];
                  if (isRest) {
                      tasks.push({ type: "Rest", topic: "Relax & Recharge 🧘", questionCount: 0, estimatedMinutes: 0 });
                  } else if (isMock) {
                      tasks.push({ type: "Mock Exam", topic: "Full SAT Simulator — 4 Modules — Timed", questionCount: 98, estimatedMinutes: 134 });
                  } else {
                      tasks.push({ type: item.section || (i%2===0?"Math":"English"), topic: item.topic || "Practice", questionCount: item.questionCount || 20, estimatedMinutes: item.estimatedMinutes || 30 });
                  }
              }

              tasks = tasks.map(t => ({
                  type: t.type || t.section || "Practice",
                  topic: t.topic || "Practice",
                  questionCount: t.questionCount || 0,
                  estimatedMinutes: t.estimatedMinutes || 0,
                  section: t.section || t.type
              }));

              return {
                  dayIndex: dayIndex,
                  week: item.week || Math.floor(dayIndex / 7) + 1,
                  dayName: dayNameList[dayDate.getDay()],
                  fullDayName: fullDayNames[dayDate.getDay()],
                  dateStr: `${monthNames[dayDate.getMonth()]} ${dayDate.getDate()}`,
                  fullDateStr: dayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
                  isToday: dayIndex === 0,
                  isRest: tasks.length === 1 && tasks[0].type === 'Rest',
                  isMock: tasks.length === 1 && tasks[0].type === 'Mock Exam',
                  tasks: tasks
              };
          });
      }

      currentPlanData = plan;

      // Update variables
      document.getElementById('dash-goal-score').textContent = goalScore;
      document.getElementById('dash-exam-date').textContent = examDate;
      document.getElementById('dash-days-left').textContent = calculateDaysLeft(examDate);
      document.getElementById('dash-study-mode').textContent = formatStudyMode(studyMode);
      
      const planIdEl = document.getElementById('dash-plan-id');
      if (planIdEl) planIdEl.classList.add('hidden');

      // AI Recommendations block
      const recsContainer = document.getElementById('ai-recs-container');
      const recsList = document.getElementById('ai-recs-list');
      
      if (analysis && analysis.recommendations) {
        recsList.innerHTML = analysis.recommendations.map(rec => `<li>${escapeHtml(rec)}</li>`).join('');
        recsContainer.classList.remove('hidden');
      } else {
        recsContainer.classList.add('hidden');
      }

      const totalWeeks = Math.max(...plan.map(d => d.week));
      renderWeekTabs(totalWeeks);
      switchWeek(1); // Renders calendar for week 1

      // Shift view
      navigate('dashboard');
    }

    function togglePlanCheck(el, planId, dayIndex, taskIdx, borderColor) {
      let checkedTasks = JSON.parse(localStorage.getItem('oneprep_plan_checks')) || {};
      let taskId = taskIdx !== undefined ? `${planId}_day${dayIndex}_task${taskIdx}` : `${planId}_${dayIndex}`;
      
      const isCurrentlyChecked = !!checkedTasks[taskId];
      const willBeChecked = !isCurrentlyChecked;
      
      checkedTasks[taskId] = willBeChecked;
      localStorage.setItem('oneprep_plan_checks', JSON.stringify(checkedTasks));

      const box = el.querySelector('.checkbox-box');
      const checkmark = el.querySelector('.checkmark');
      const card = el.closest('.bg-white');
      const title = card.querySelector('.task-title');

      if (willBeChecked) {
        showToast("Task completed! Keep crushing your plan! 🔥");
        box.style.backgroundColor = '#22C55E';
        box.style.borderColor = '#22C55E';
        checkmark.classList.remove('opacity-0');
        checkmark.classList.add('opacity-100');
        card.classList.add('opacity-60');
        if(title) title.classList.add('line-through', 'text-gray-500');
      } else {
        box.style.backgroundColor = 'white';
        box.style.borderColor = '#7C6FE0';
        checkmark.classList.remove('opacity-100');
        checkmark.classList.add('opacity-0');
        card.classList.remove('opacity-60');
        if(title) title.classList.remove('line-through', 'text-gray-500');
      }

      updateProgressBars();
    }

    // ==========================================
    // OFFLINE PLAN SEED GENERATOR
    // ==========================================
    function generateOfflinePlan(selectedDays, studyMode, alternatingDays, customQ, mockDay, examDate) {
      console.log('studyMode:', studyMode, 'customQuestions:', customQ, 'dayAssignments:', alternatingDays);
      const plan = [];
      const mathTopics = ["Heart of Algebra", "Advanced Math", "Problem Solving & Data Analysis", "Geometry & Trigonometry"];
      const englishTopics = ["Reading Comprehension", "Central Ideas & Details", "Command of Evidence", "Rhetorical Synthesis", "Standard English Conventions"];
      const dayNameList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      let weeks = 4;
      if (examDate) {
        const ed = new Date(examDate);
        const diff = ed - new Date();
        const daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        weeks = Math.max(1, Math.ceil(daysLeft / 7));
      }

      let currentDate = new Date();
      currentDate.setHours(0,0,0,0);
      const todayTime = currentDate.getTime();
      let globalStudyDayIndex = 0;

      for (let i = 0; i < weeks * 7; i++) {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + i);
        const dayName = dayNameList[d.getDay()];
        const fullDayName = fullDayNames[d.getDay()];
            const dateStr = `${monthNames[d.getMonth()].substring(0,3)} ${d.getDate()}`;
        const weekNum = Math.floor(i / 7) + 1;
        const isToday = d.getTime() === todayTime;

        let dayObj = {
           dayIndex: i,
           week: weekNum,
           dayName: dayName,
           fullDayName: fullDayName,
           dateStr: dateStr,
               fullDateStr: `${fullDayName}, ${monthNames[d.getMonth()]} ${d.getDate()}`,
           isToday: isToday,
           tasks: []
        };

        const isStudyDay = selectedDays && selectedDays[dayName];
        const isMockExamDay = isStudyDay && dayName === mockDay;

        if (isMockExamDay) {
           dayObj.isMock = true;
           dayObj.tasks.push({
               type: "Mock Exam", topic: "Full SAT Simulator — 4 Modules — Timed", questionCount: 98, estimatedMinutes: 134
           });
        } else if (isStudyDay) {
           const type = selectedDays[dayName]; // 'standard' or 'extended'
           
           if (studyMode === 'alternating') {
               const subject = (alternatingDays && alternatingDays[dayName]) ? alternatingDays[dayName] : (globalStudyDayIndex % 2 === 0 ? 'Math' : 'English');
               const topic = subject === 'Math' ? mathTopics[globalStudyDayIndex % mathTopics.length] : englishTopics[globalStudyDayIndex % englishTopics.length];
               dayObj.tasks.push({ type: subject, topic: topic, questionCount: 20, estimatedMinutes: 30 });
               dayObj.tasks.push({ type: "Vocab", section: "Vocab", topic: "Daily Vocabulary", questionCount: 10, estimatedMinutes: 15 });
           } else if (studyMode === 'full_coverage') {
               dayObj.tasks.push({ type: 'Math', topic: mathTopics[globalStudyDayIndex % mathTopics.length], questionCount: 22, estimatedMinutes: 35 });
               dayObj.tasks.push({ type: 'Math', topic: mathTopics[(globalStudyDayIndex + 1) % mathTopics.length], questionCount: 22, estimatedMinutes: 35 });
               dayObj.tasks.push({ type: 'English', topic: englishTopics[globalStudyDayIndex % englishTopics.length], questionCount: 27, estimatedMinutes: 32 });
               dayObj.tasks.push({ type: 'English', topic: englishTopics[(globalStudyDayIndex + 1) % englishTopics.length], questionCount: 27, estimatedMinutes: 32 });
               dayObj.tasks.push({ type: "Vocab", section: "Vocab", topic: "Daily Vocabulary", questionCount: 10, estimatedMinutes: 15 });
           } else if (studyMode === 'custom') {
               const mathQ = customQ?.math || 20;
               const engQ = customQ?.english || 20;
               const vocQ = customQ?.vocab || 10;
               dayObj.tasks.push({ type: 'Math', topic: mathTopics[globalStudyDayIndex % mathTopics.length], questionCount: mathQ, estimatedMinutes: Math.round(mathQ * 1.5) });
               dayObj.tasks.push({ type: 'English', topic: englishTopics[globalStudyDayIndex % englishTopics.length], questionCount: engQ, estimatedMinutes: Math.round(engQ * 1.5) });
               dayObj.tasks.push({ type: "Vocab", section: "Vocab", topic: "Daily Vocabulary", questionCount: vocQ, estimatedMinutes: Math.round(vocQ * 2) });
           } else {
               const subject = globalStudyDayIndex % 2 === 0 ? 'Math' : 'English';
               const topic = subject === 'Math' ? mathTopics[globalStudyDayIndex % mathTopics.length] : englishTopics[globalStudyDayIndex % englishTopics.length];
               const qCount = type === 'extended' ? 30 : 20;
               dayObj.tasks.push({ type: subject, topic: topic, questionCount: qCount, estimatedMinutes: Math.round(qCount * 1.5) });
               dayObj.tasks.push({ type: "Vocab", section: "Vocab", topic: "Daily Vocabulary", questionCount: 10, estimatedMinutes: 15 });
           }
           globalStudyDayIndex++;
        } else {
           dayObj.isRest = true;
           dayObj.tasks.push({ type: "Rest", topic: "Relax & Recharge 🧘", questionCount: 0, estimatedMinutes: 0 });
        }

        plan.push(dayObj);
      }
      return plan;
    }

    // ==========================================
    // UTILITIES
    // ==========================================
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    
  
