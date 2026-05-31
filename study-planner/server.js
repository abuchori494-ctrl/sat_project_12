const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '15mb' })); // Allow PDF/image base64 payloads

// ==========================================================
// IN-MEMORY STORAGE
// ==========================================================
const plansDb = {};
const uploadsDb = [];
const statsDb = {
  totalPlansCreated: 0,
  totalUploads: 0,
  averageTargetScore: 1480
};

// ==========================================================
// TOPIC ARRAYS FOR SEED GENERATION
// ==========================================================
const mathTopics = ["Heart of Algebra", "Advanced Math (Quadratics)", "Problem Solving & Data Analysis", "Geometry & Trigonometry"];
const readingTopics = ["Central Ideas & Details", "Inference & Connections", "Command of Evidence", "Words in Context"];
const writingTopics = ["Standard English Conventions (Colons/Semicolons)", "Transitions & Logical Connections", "Expression of Ideas", "Sentence Structure"];

// Helper to rotate topics in order
function getRotatedTopic(dayIndex) {
  const rotationIndex = dayIndex % 3;
  if (rotationIndex === 0) {
    return { section: "Math", topic: mathTopics[Math.floor(dayIndex / 3) % mathTopics.length] };
  } else if (rotationIndex === 1) {
    return { section: "Reading", topic: readingTopics[Math.floor(dayIndex / 3) % readingTopics.length] };
  } else {
    return { section: "Writing", topic: writingTopics[Math.floor(dayIndex / 3) % writingTopics.length] };
  }
}

// Helper to generate a 4-week (28 days) schedule
function generate4WeekPlan(selectedDays, targetScore = 1500, examDate = "2026-12-05") {
  const plan = [];
  let totalQuestions = 0;
  let totalMinutes = 0;
  
  const startDay = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 28; i++) {
    const currentDate = new Date(startDay);
    currentDate.setDate(startDay.getDate() + i);
    const dayName = dayNames[currentDate.getDay()];
    const dateStr = currentDate.toISOString().split('T')[0];

    // Check if day is selected for study
    if (selectedDays[dayName]) {
      const type = selectedDays[dayName]; // "standard" or "extended"
      const { section, topic } = getRotatedTopic(i);
      
      const questionCount = type === "extended" ? 20 : 10;
      const estimatedMinutes = type === "extended" ? 40 : 20;

      totalQuestions += questionCount;
      totalMinutes += estimatedMinutes;

      plan.push({
        date: dateStr,
        day: dayName,
        type: type,
        status: "scheduled",
        section: section,
        topic: topic,
        questionCount: questionCount,
        estimatedMinutes: estimatedMinutes
      });
    } else {
      // Rest Day
      plan.push({
        date: dateStr,
        day: dayName,
        type: "rest",
        status: "rest",
        section: "Rest",
        topic: "Relax & Recharge 🧘",
        questionCount: 0,
        estimatedMinutes: 0
      });
    }
  }

  return { plan, totalQuestions, totalMinutes };
}

// ==========================================================
// API ENDPOINTS
// ==========================================================

// POST /api/planner/create
app.post('/api/planner/create', (req, res) => {
  const { days, targetScore, examDate } = req.body;

  if (!days || Object.keys(days).length === 0) {
    return res.status(400).json({ error: "At least one study day must be selected." });
  }

  const planId = "plan_" + Date.now();
  const scoreGoal = parseInt(targetScore) || 1500;
  const testDate = examDate || "2026-12-05";

  const { plan, totalQuestions, totalMinutes } = generate4WeekPlan(days, scoreGoal, testDate);

  const newPlan = {
    planId,
    daysSelected: days,
    targetScore: scoreGoal,
    examDate: testDate,
    plan,
    totalDays: 28,
    totalQuestions,
    totalMinutes,
    createdAt: new Date().toISOString()
  };

  plansDb[planId] = newPlan;
  
  // Update overall metrics
  statsDb.totalPlansCreated++;
  
  res.json({
    success: true,
    planId,
    plan: plan,
    totalDays: 28,
    totalQuestions,
    totalMinutes
  });
});

// GET /api/planner/plan/:planId
app.get('/api/planner/plan/:planId', (req, res) => {
  const planId = req.params.planId;
  const plan = plansDb[planId];

  if (!plan) {
    return res.status(404).json({ error: "Study plan not found." });
  }

  res.json(plan);
});

// POST /api/planner/upload-score
app.post('/api/planner/upload-score', (req, res) => {
  const { file, filename, type } = req.body;

  if (!file) {
    return res.status(400).json({ error: "Missing score report file." });
  }

  // Validate standard SAT formats
  const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
  if (type && !allowed.includes(type)) {
    return res.status(400).json({ error: "Unsupported file format. Please upload a PDF, PNG, or JPEG score report." });
  }

  // Simulate AI parsed score assessment
  setTimeout(() => {
    const planId = "plan_personalized_" + Date.now();
    
    // Simulate weak areas
    const mathWeak = ["Problem Solving & Data Analysis", "Geometry & Trigonometry"];
    const readingWeak = ["Command of Evidence", "Transitions & Logical Connections"];

    // Generate personalized schedule (defaulting study days: Mon, Wed, Fri standard; Sat extended)
    const presetDays = { Mon: "standard", Wed: "standard", Fri: "standard", Sat: "extended" };
    const { plan, totalQuestions, totalMinutes } = generate4WeekPlan(presetDays, 1520, "2026-12-05");

    // Heavily inject priority topics into the scheduled study sessions
    plan.forEach((item, index) => {
      if (item.type !== "rest") {
        if (item.section === "Math" && mathWeak.length > 0) {
          item.topic = mathWeak[index % mathWeak.length] + " (Priority ⚠️)";
        } else if (item.section === "Reading" && readingWeak.length > 0) {
          item.topic = readingWeak[index % readingWeak.length] + " (Priority ⚠️)";
        }
      }
    });

    const analysis = {
      totalScore: 1220,
      math: { score: 620, weakAreas: mathWeak },
      reading: { score: 600, weakAreas: readingWeak },
      recommendations: [
        "Focus on multi-step geometry theorems and circle equations.",
        "Practice transitional words in context to fix sentence flow rules.",
        "Strengthen command of evidence inside dual reading passages."
      ],
      planSuggestion: { priorityTopics: [...mathWeak, ...readingWeak], dailyMinutes: 30 }
    };

    plansDb[planId] = {
      planId,
      daysSelected: presetDays,
      targetScore: 1520,
      examDate: "2026-12-05",
      plan,
      totalDays: 28,
      totalQuestions,
      totalMinutes,
      analysis,
      createdAt: new Date().toISOString()
    };

    // Store upload log
    uploadsDb.push({
      filename: filename || "score_report.pdf",
      uploadedAt: new Date().toISOString(),
      parsedScore: 1220
    });

    statsDb.totalUploads++;

    res.json({
      success: true,
      analysis,
      planId
    });

  }, 1500); // 1.5s simulated parsing delay
});

// GET /api/planner/stats
app.get('/api/planner/stats', (req, res) => {
  res.json(statsDb);
});

// GET /api/planner/all-plans (convenience list)
app.get('/api/planner/all-plans', (req, res) => {
  res.json(plansDb);
});

// Start Server
app.listen(PORT, () => {
  console.log(`==========================================================`);
  console.log(`🚀 OnePrep Study Planner API Server running on port ${PORT}`);
  console.log(`   Local Address: http://localhost:${PORT}`);
  console.log(`==========================================================`);
});
