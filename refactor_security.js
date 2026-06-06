const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

// 2. CORS and Payload Limit
code = code.replace(/app\.use\(cors\(\)\);/, "app.use(cors({ origin: ['http://localhost:3000', 'https://yourdomain.com'], credentials: true }));");
code = code.replace(/app\.use\(express\.json\(\{ limit: '10mb' \}\)\);/, "app.use(express.json({ limit: '50kb' }));");

// 3. Import JWT and Zod
const importsCode = `
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-jwt-secret-key-123';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
`;
code = code.replace(/(const PORT = 3000;\s*)/, "$1" + importsCode);

// Add mock login endpoint
const mockLoginCode = `
app.post('/api/auth/mock-login', (req, res) => {
  const token = jwt.sign({ userId: 'user_001' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});
`;
code = code.replace(/(app\.get\('\/',)/, mockLoginCode + "\n$1");

// 4. Update attempts endpoint
const attemptsRegex = /app\.get\('\/api\/exams\/attempts', async \(req, res\) => \{[\s\S]*?res\.json\(attemptsDict\);\s*\} catch \(err\) \{[\s\S]*?\}\s*\}\);/;
const newAttemptsCode = `app.get('/api/exams/attempts', verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    const attempts = await Attempt.find({ userId });
    
    // Explicit response serializer: return only safe fields
    const safeAttempts = attempts.map(a => ({
      examId: a.examId,
      moduleId: a.moduleId,
      correct: a.correct,
      total: a.total,
      percentage: a.percentage
    }));
    
    res.json(safeAttempts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});`;
code = code.replace(attemptsRegex, newAttemptsCode);

// 5. Update submit endpoint
const submitRegex = /app\.post\('\/api\/exams\/:examId\/submit', async \(req, res\) => \{/;

const submitZodCode = `
const submitAttemptSchema = z.object({
  body: z.object({
    answers: z.record(z.any()).optional(),
    timeSpent: z.number().optional(),
    module: z.string().optional()
  }),
  params: z.object({
    examId: z.string().min(1, 'examId is required')
  })
});

app.post('/api/exams/:examId/submit', verifyToken, async (req, res) => {
  try {
    submitAttemptSchema.parse({ body: req.body, params: req.params });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid input', details: error.errors });
  }
`;
code = code.replace(submitRegex, submitZodCode);

// Also replace userId fetching in submit endpoint
code = code.replace(/const userId = req\.headers\['x-user-id'\] \|\| 'user_001';/, 'const userId = req.userId;');

fs.writeFileSync('server.js', code);
console.log('server.js security refactor successful');
