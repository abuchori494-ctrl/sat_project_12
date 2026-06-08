const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

if (!code.includes('const compression = require')) {
  code = code.replace("const express = require('express');", "const express = require('express');\nconst compression = require('compression');");
  code = code.replace("const app = express();", "const app = express();\napp.use(compression());");
}

if (!code.includes('attemptSchema.index')) {
  code = code.replace("const Attempt = mongoose.model('Attempt', attemptSchema);", "attemptSchema.index({ userId: 1, examId: 1 });\nconst Attempt = mongoose.model('Attempt', attemptSchema);");
}
if (!code.includes('vocabWordSchema.index')) {
  code = code.replace("const VocabWord = mongoose.model('VocabWord', vocabWordSchema);", "vocabWordSchema.index({ userId: 1 });\nconst VocabWord = mongoose.model('VocabWord', vocabWordSchema);");
}

// Remove eager loading blocks
code = code.replace(/try\s*\{\s*if\s*\(fs\.existsSync\(EXAM_QUESTIONS_PATH\)\)\s*\{\s*const qData[^}]+\}\s*\}\s*catch[^{]+\{[^}]+\}/g, '');
code = code.replace(/try\s*\{\s*if\s*\(fs\.existsSync\(ATTEMPTS_PATH\)\)\s*\{\s*const aData[^}]+\}\s*\}\s*catch[^{]+\{[^}]+\}/g, '');
code = code.replace(/try\s*\{\s*if\s*\(fs\.existsSync\(REAL_EXAM_ATTEMPTS_PATH\)\)\s*\{\s*const rData[^}]+\}\s*\}\s*catch[^{]+\{[^}]+\}/g, '');

// Replace let with getter
code = code.replace('let examQuestionsDb = {};', 'let _examQuestionsDb = null;\nfunction getExamQuestionsDb() { if (!_examQuestionsDb) { try { if (fs.existsSync(EXAM_QUESTIONS_PATH)) _examQuestionsDb = JSON.parse(fs.readFileSync(EXAM_QUESTIONS_PATH, \'utf-8\')); else _examQuestionsDb = {}; } catch(e) { _examQuestionsDb = {}; } } return _examQuestionsDb; }\nfunction setExamQuestionsDb(v) { _examQuestionsDb = v; }');
code = code.replace('let examAttempts = {};', 'let _examAttempts = null;\nfunction getExamAttempts() { if (!_examAttempts) { try { if (fs.existsSync(ATTEMPTS_PATH)) _examAttempts = JSON.parse(fs.readFileSync(ATTEMPTS_PATH, \'utf-8\')); else _examAttempts = {}; } catch(e) { _examAttempts = {}; } } return _examAttempts; }\nfunction setExamAttempts(v) { _examAttempts = v; }');
code = code.replace('let realExamAttempts = {};', 'let _realExamAttempts = null;\nfunction getRealExamAttempts() { if (!_realExamAttempts) { try { if (fs.existsSync(REAL_EXAM_ATTEMPTS_PATH)) _realExamAttempts = JSON.parse(fs.readFileSync(REAL_EXAM_ATTEMPTS_PATH, \'utf-8\')); else _realExamAttempts = {}; } catch(e) { _realExamAttempts = {}; } } return _realExamAttempts; }\nfunction setRealExamAttempts(v) { _realExamAttempts = v; }');

code = code.replace(/\bexamQuestionsDb\b/g, 'getExamQuestionsDb()');
code = code.replace(/\bexamAttempts\b/g, 'getExamAttempts()');
code = code.replace(/\brealExamAttempts\b/g, 'getRealExamAttempts()');

// Fix the places where regex messed up our new function definitions
code = code.replace(/getExamQuestionsDb\(\)Loaded/g, 'examQuestionsDbLoaded');
code = code.replace(/_getExamQuestionsDb\(\)/g, '_examQuestionsDb');
code = code.replace(/getget/g, 'get');
code = code.replace(/setget/g, 'set');
code = code.replace(/function getExamQuestionsDb\(\)\(\)/g, 'function getExamQuestionsDb()');
code = code.replace(/function getExamAttempts\(\)\(\)/g, 'function getExamAttempts()');
code = code.replace(/function getRealExamAttempts\(\)\(\)/g, 'function getRealExamAttempts()');

// Update endpoint /api/exams/:examId/questions to return single question if index is provided
const qsRouteOld = "app.get('/api/exams/:examId/questions', (req, res) => {";
const qsRouteNew = "app.get('/api/exams/:examId/questions', (req, res) => {\n  res.set('Cache-Control', 'public, max-age=3600');\n  const questionIndex = req.query.index;";
code = code.replace(qsRouteOld, qsRouteNew);

// In the endpoint where it returns questions: mod.questions, we can check if index is provided
code = code.replace('questions: mod.questions', 'questions: questionIndex !== undefined ? [mod.questions[parseInt(questionIndex)]].filter(Boolean) : mod.questions');

// Add Cache-Control to /api/exams
const examsRouteOld = "app.get('/api/exams', (req, res) => {";
const examsRouteNew = "app.get('/api/exams', (req, res) => {\n  res.set('Cache-Control', 'public, max-age=3600');";
code = code.replace(examsRouteOld, examsRouteNew);

fs.writeFileSync('server.js', code);
console.log('Saved to server.js');
