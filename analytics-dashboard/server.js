const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==========================================================
// DATA STORE
// ==========================================================
const store = {
  userId: "user_001",
  questions: [
    // Pre-loaded seed data (matching screenshots)
    { id: 1, date: "2025-08-16", topic: "Standard English Conventions", subject: "english", difficulty: "easy", correct: true, timeSeconds: 68 },
    { id: 2, date: "2025-08-16", topic: "Standard English Conventions", subject: "english", difficulty: "easy", correct: true, timeSeconds: 72 },
    { id: 3, date: "2025-08-16", topic: "Standard English Conventions", subject: "english", difficulty: "easy", correct: true, timeSeconds: 65 },
    { id: 4, date: "2025-08-16", topic: "Standard English Conventions", subject: "english", difficulty: "easy", correct: true, timeSeconds: 70 },
    { id: 5, date: "2025-08-16", topic: "Standard English Conventions", subject: "english", difficulty: "easy", correct: true, timeSeconds: 75 },
    { id: 6, date: "2025-08-16", topic: "Standard English Conventions", subject: "english", difficulty: "hard", correct: true, timeSeconds: 172 }
  ],
  settings: {
    dailyGoal: 10,
    notifications: true
  },
  streak: {
    current: 0,
    longest: 1,
    lastActiveDate: "2025-08-16"
  }
};

// ==========================================================
// API ENDPOINTS
// ==========================================================

// GET /api/analytics/summary
app.get('/api/analytics/summary', (req, res) => {
  const total = store.questions.length;
  const correct = store.questions.filter(q => q.correct).length;
  const wrong = total - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;

  res.json({
    questionsAttempted: total,
    currentAccuracy: accuracy,
    savedQuestions: 0,
    studyStreak: store.streak.current,
    totalCorrect: correct,
    totalWrong: wrong
  });
});

// GET /api/analytics/activity-trend
app.get('/api/analytics/activity-trend', (req, res) => {
  // Weekly bucket data for 6 weeks
  // Week 1 (Aug 11, '25) has all our 6 correct questions (5 easy, 1 hard)
  res.json([
    { week: "Aug 11, '25", easyCorrect: 5, hardCorrect: 1, easyWrong: 0, hardWrong: 0 },
    { week: "Sep 29, '25", easyCorrect: 0, hardCorrect: 0, easyWrong: 0, hardWrong: 0 },
    { week: "Nov 17, '25", easyCorrect: 0, hardCorrect: 0, easyWrong: 0, hardWrong: 0 },
    { week: "Jan 5, '26", easyCorrect: 0, hardCorrect: 0, easyWrong: 0, hardWrong: 0 },
    { week: "Feb 23, '26", easyCorrect: 0, hardCorrect: 0, easyWrong: 0, hardWrong: 0 },
    { week: "Apr 13, '26", easyCorrect: 0, hardCorrect: 0, easyWrong: 0, hardWrong: 0 }
  ]);
});

// GET /api/analytics/accuracy-by-topic
app.get('/api/analytics/accuracy-by-topic', (req, res) => {
  res.json({
    english: [
      { topic: "Standard English Conventions", attempts: 6, accuracy: 100, locked: false },
      { topic: "Information and Ideas", attempts: 0, accuracy: null, locked: true },
      { topic: "Craft and Structure", attempts: 0, accuracy: null, locked: true },
      { topic: "Expression of Ideas", attempts: 0, accuracy: null, locked: true }
    ],
    math: [
      { topic: "Algebra", attempts: 31, accuracy: 58, locked: false },
      { topic: "Advanced Math", attempts: 35, accuracy: 41, locked: false },
      { topic: "Problem Solving and Data Analysis", attempts: 0, accuracy: null, locked: true },
      { topic: "Geometry", attempts: 0, accuracy: null, locked: true }
    ]
  });
});

// GET /api/analytics/time-by-difficulty
app.get('/api/analytics/time-by-difficulty', (req, res) => {
  res.json({
    english: {
      avgTotal: "2m 12s",
      easy: { yourTime: "46s", platformAvg: "1m 11s" },
      medium: { yourTime: "1m 14s", platformAvg: "1m 23s" },
      hard: { yourTime: "2m 52s", platformAvg: "2m 23s" }
    },
    math: {
      avgTotal: "1m 58s",
      easy: { yourTime: "55s", platformAvg: "1m 8s" },
      medium: { yourTime: "1m 35s", platformAvg: "1m 31s" },
      hard: { yourTime: "3m 8s", platformAvg: "2m 36s" }
    }
  });
});

// GET /api/analytics/pacing
app.get('/api/analytics/pacing', (req, res) => {
  res.json([
    { week: "Mar 24", yourTime: 32, platformMin: 20, platformMax: 50 },
    { week: "Mar 31", yourTime: 28, platformMin: 18, platformMax: 48 },
    { week: "Apr 7",  yourTime: 40, platformMin: 24, platformMax: 55 },
    { week: "Apr 14", yourTime: 38, platformMin: 25, platformMax: 50 },
    { week: "Apr 21", yourTime: 30, platformMin: 20, platformMax: 44 },
    { week: "Apr 28", yourTime: 31, platformMin: 18, platformMax: 45 },
    { week: "May 5",  yourTime: 52, platformMin: 28, platformMax: 58 }
  ]);
});

// GET /api/analytics/heatmap?months=10
app.get('/api/analytics/heatmap', (req, res) => {
  // Return map of date -> questionCount for last 10 months
  // Standard August 16, 2025 has our 6 questions answered
  const heatmap = {};
  
  // Initialize standard dates
  const today = new Date();
  for (let i = 0; i < 300; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateString = d.toISOString().split('T')[0];
    heatmap[dateString] = 0;
  }

  // Inject actual activity
  heatmap["2025-08-16"] = 6;
  
  // Let's add some mock mini calendar dates in April/May 2026 for Section 7
  heatmap["2026-04-12"] = 2;
  heatmap["2026-04-18"] = 5;
  heatmap["2026-04-25"] = 9;
  heatmap["2026-05-02"] = 12;
  heatmap["2026-05-09"] = 1;
  heatmap["2026-05-16"] = 7;
  heatmap["2026-05-23"] = 4;
  
  res.json(heatmap);
});

// POST /api/analytics/log-answer
app.post('/api/analytics/log-answer', (req, res) => {
  const { topic, subject, difficulty, correct, timeSeconds } = req.body;

  if (!topic || !subject || !difficulty || correct === undefined || !timeSeconds) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const newQuestion = {
    id: store.questions.length + 1,
    date: todayStr,
    topic,
    subject,
    difficulty,
    correct,
    timeSeconds
  };

  store.questions.push(newQuestion);

  // Update study streak
  if (store.streak.lastActiveDate !== todayStr) {
    store.streak.current++;
    store.streak.lastActiveDate = todayStr;
    if (store.streak.current > store.streak.longest) {
      store.streak.longest = store.streak.current;
    }
  }

  // Compute updated stats summary
  const total = store.questions.length;
  const correctCount = store.questions.filter(q => q.correct).length;
  const wrongCount = total - correctCount;
  const accuracy = Math.round((correctCount / total) * 100);

  res.json({
    success: true,
    summary: {
      questionsAttempted: total,
      currentAccuracy: accuracy,
      savedQuestions: 0,
      studyStreak: store.streak.current,
      totalCorrect: correctCount,
      totalWrong: wrongCount
    }
  });
});

// GET /api/analytics/weak-spots
app.get('/api/analytics/weak-spots', (req, res) => {
  res.json({
    weeklyBars: [
      { label: "Mar 24", redHeight: 18, lightGreenHeight: 22, darkGreenHeight: 15 },
      { label: "Mar 31", redHeight: 15, lightGreenHeight: 20, darkGreenHeight: 14 },
      { label: "Apr 7",  redHeight: 22, lightGreenHeight: 28, darkGreenHeight: 18 },
      { label: "Apr 14", redHeight: 20, lightGreenHeight: 26, darkGreenHeight: 13 },
      { label: "Apr 21", redHeight: 28, lightGreenHeight: 30, darkGreenHeight: 16 },
      { label: "Apr 28", redHeight: 15, lightGreenHeight: 22, darkGreenHeight: 30 },
      { label: "May 5",  redHeight: 38, lightGreenHeight: 28, darkGreenHeight: 15 },
      { label: "May 12", redHeight: 23, lightGreenHeight: 24, darkGreenHeight: 28 },
      { label: "May 19", redHeight: 30, lightGreenHeight: 20, darkGreenHeight: 31 },
      { label: "May 26", redHeight: 24, lightGreenHeight: 22, darkGreenHeight: 34 },
      { label: "Jun 2",  redHeight: 22, lightGreenHeight: 25, darkGreenHeight: 34 }
    ],
    topicAccuracy: [
      { topic: "Information and Ideas", attempts: 48, accuracy: 72, subject: "english" },
      { topic: "Craft and Structure", attempts: 41, accuracy: 58, subject: "english" },
      { topic: "Standard English Con...", attempts: 36, accuracy: 81, subject: "english" },
      { topic: "Algebra", attempts: 52, accuracy: 64, subject: "math" },
      { topic: "Advanced Math", attempts: 38, accuracy: 47, subject: "math" },
      { topic: "Problem-Solving...", attempts: 28, accuracy: 76, subject: "math" }
    ]
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`==========================================================`);
  console.log(`🚀 OnePrep Analytics Dashboard API Server running on port ${PORT}`);
  console.log(`   Local Address: http://localhost:${PORT}`);
  console.log(`==========================================================`);
});
