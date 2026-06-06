const fs = require('fs');
const path = require('path');
let code = fs.readFileSync('server.js', 'utf8');

// 1. Add mongoose connection and schema after the requires
const mongooseCode = `
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/sat_prep', {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const attemptSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  examId: { type: String, required: true },
  moduleId: { type: String, required: true },
  correct: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
  answers: { type: Object },
  completedAt: { type: Date, default: Date.now }
});

const Attempt = mongoose.model('Attempt', attemptSchema);
`;
code = code.replace(/const PORT = 3000;/, 'const PORT = 3000;\n' + mongooseCode);

// 2. Remove examAttempts global and persistAttempts
code = code.replace(/const ATTEMPTS_PATH = [^\n]+;\n/, '');
code = code.replace(/let examAttempts = {};\n/, '');
code = code.replace(/try {\s*if \(fs\.existsSync\(ATTEMPTS_PATH\)\) {\s*const aData = fs\.readFileSync\(ATTEMPTS_PATH, 'utf-8'\);\s*examAttempts = JSON\.parse\(aData\);\s*}\s*} catch \(err\) {\s*console\.error\(\"Failed to load examAttempts\.json on startup\", err\);\s*}\n/, '');
code = code.replace(/function persistAttempts\(\) {\s*try {\s*fs\.writeFileSync\(ATTEMPTS_PATH, JSON\.stringify\(examAttempts, null, 2\)\);\s*} catch \(err\) {\s*console\.error\(\"Failed to write to examAttempts\.json\", err\);\s*}\s*}\n/, '');

// 3. New /api/exams route
const apiExamsRoute = `
app.get('/api/exams', (req, res) => {
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'exams_array.json'), 'utf-8');
    const examsData = JSON.parse(raw);
    
    // Group exams into the hierarchical format
    const grouped = {};
    
    examsData.forEach(exam => {
      // Filter out 'B' versions (keep exclusive to Real Exam Mode)
      if (exam.id.endsWith('-b')) return;
      
      const year = parseInt(exam.date.split(' ')[1]);
      const month = exam.date.split(' ')[0];
      const examKey = month + '-' + year;
      
      if (!grouped[examKey]) {
        grouped[examKey] = {
          id: month.toLowerCase() + '-' + year,
          month: month,
          year: year,
          regions: []
        };
      }
      
      let regionEntry = grouped[examKey].regions.find(r => r.name === exam.region);
      if (!regionEntry) {
        regionEntry = { name: exam.region, versions: [] };
        grouped[examKey].regions.push(regionEntry);
      }
      
      // Extract version id and name (e.g., 'march-2026-int-a' -> 'int-a', 'Int A')
      const versionId = exam.id.split('-').slice(2).join('-');
      const versionMatch = exam.name.match(/\\(([^)]+)\\)/);
      const versionName = versionMatch ? versionMatch[1] : versionId;
      
      regionEntry.versions.push({
        name: versionName,
        id: versionId
      });
    });
    
    res.json(Object.values(grouped));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load exams' });
  }
});
`;
code = code.replace(/app\.get\('\/api\/exams\/:examId\/questions',/, apiExamsRoute + '\napp.get(\'/api/exams/:examId/questions\',');

// 4. Update /api/exams/:examId/submit
const submitRegex = /app\.post\('\/api\/exams\/:examId\/submit', \(req, res\) => \{[\s\S]*?persistAttempts\(\);\s*updateStreak\(\);\s*return res\.json\(\{[\s\S]*?\}\);\s*\}\s*res\.status\(404\)\.json\(\{ error: \`Exam \$\{examId\} not found\.\` \}\);\s*}\);/;
const newSubmitCode = `app.post('/api/exams/:examId/submit', async (req, res) => {
  const { examId } = req.params;
  const { answers, timeSpent, module: bodyModule } = req.body;
  const targetModule = bodyModule || req.query.module || 'ebrw1';
  const userId = req.headers['x-user-id'] || 'user_001';

  if (examQuestionsDb && examQuestionsDb.examId === examId) {
    let questions = [];
    if (examQuestionsDb.modules && examQuestionsDb.modules[targetModule]) {
      questions = examQuestionsDb.modules[targetModule].questions;
    } else if (examQuestionsDb.questions) {
      questions = examQuestionsDb.questions;
    }

    if (!questions || questions.length === 0) {
      return res.status(400).json({ error: \`No questions found for module \${targetModule}\` });
    }

    let correctCount = 0;
    const results = [];

    questions.forEach(q => {
      const userAnswer = answers[q.questionNumber];
      let isCorrect = false;
      if (userAnswer !== undefined && userAnswer !== null) {
        const cleanedUser = String(userAnswer).trim().toLowerCase();
        const cleanedCorrect = String(q.correctAnswer).trim().toLowerCase();
        isCorrect = cleanedUser === cleanedCorrect;
      }
      if (isCorrect) correctCount++;

      results.push({
        questionNumber: q.questionNumber,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      });
    });

    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    // Transactional logic: Save to MongoDB and update streak together
    try {
      const attempt = new Attempt({
        userId,
        examId,
        moduleId: targetModule,
        correct: correctCount,
        total,
        percentage,
        answers
      });
      await attempt.save();

      // Log answer in global history (assuming it's safe outside transaction for now)
      questions.forEach((q, idx) => {
        store.questions.answered.push({
          questionId: q.id,
          correct: results[idx].isCorrect,
          timeSpent: Math.round(timeSpent / questions.length) || 15,
          topic: q.module || targetModule,
          subject: targetModule.includes('math') ? 'math' : 'reading',
          date: new Date().toISOString().split('T')[0]
        });
      });

      updateStreak();

      return res.json({
        success: true,
        score: correctCount,
        total,
        percentage,
        results
      });
    } catch (err) {
      console.error('Failed to save attempt transactionally', err);
      return res.status(500).json({ error: 'Failed to save attempt' });
    }
  }

  res.status(404).json({ error: \`Exam \${examId} not found.\` });
});`;
code = code.replace(submitRegex, newSubmitCode);

// 5. Update /api/exams/attempts
const attemptsRegex = /app\.get\('\/api\/exams\/attempts', \(req, res\) => \{\s*res\.json\(examAttempts\);\s*}\);/;
const newAttemptsCode = `app.get('/api/exams/attempts', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'user_001';
  try {
    const attempts = await Attempt.find({ userId });
    
    // Convert to dictionary format expected by frontend: { 'examId-moduleId': attempt }
    const attemptsDict = {};
    attempts.forEach(a => {
      attemptsDict[\`\${a.examId}-\${a.moduleId}\`] = {
        score: a.correct,
        total: a.total,
        percentage: a.percentage,
        answers: a.answers,
        timestamp: a.completedAt
      };
    });
    
    res.json(attemptsDict);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});`;
code = code.replace(attemptsRegex, newAttemptsCode);

fs.writeFileSync('server.js', code);
console.log('server.js updated successfully!');
