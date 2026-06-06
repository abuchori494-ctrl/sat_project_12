const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

// 1. Add Rate Limiting
const rateLimitCode = `
const rateLimit = require('express-rate-limit');
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', globalLimiter);
const submitLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
`;
code = code.replace(/(const app = express\(\);\s*app\.use\(express\.json[^\n]+\napp\.use\(cors[^\n]+\n)/, "$1" + rateLimitCode);

// Apply submitLimiter to submit route
code = code.replace(/app\.post\('\/api\/exams\/:examId\/submit', verifyToken, async \(req, res\) => \{/, "app.post('/api/exams/:examId/submit', verifyToken, submitLimiter, async (req, res) => {");

// 2. Add Background Analytics Worker
const backgroundWorkerCode = `
let cachedAnalytics = { questionsDone: 0, accuracy: 0, weakestTopics: [], isPerfect: false };
let cachedConsistencyWeek = [];

async function updateAnalyticsCache() {
  cachedAnalytics = getAnalyticsSummary();
  
  // Compute consistencyWeek
  const newConsistencyWeek = [];
  try {
    const now = new Date();
    const dayOfWeekISO = (now.getDay() + 6) % 7; 
    let activePlan = null;
    const planKeys = Object.keys(store.planner.plans);
    if (planKeys.length > 0) activePlan = store.planner.plans[planKeys[0]];

    for (let i = 0; i < 7; i++) {
      const day = new Date(now);
      day.setHours(0, 0, 0, 0);
      day.setDate(now.getDate() - (dayOfWeekISO - i));
      const dateStr = day.toISOString().split('T')[0];
      let status = "empty";
      
      if (activePlan) {
        const scheduleDay = activePlan.schedule.find(s => s.date === dateStr);
        if (scheduleDay) {
          const hasRestTask = scheduleDay.tasks.some(t => t.type === 'rest');
          const tasks = scheduleDay.tasks.filter(t => t.type !== 'rest');
          const scheduledCount = tasks.length;
          if (hasRestTask && scheduledCount === 0) status = "rest";
          else if (scheduledCount > 0) {
            const dayIndex = activePlan.schedule.indexOf(scheduleDay);
            let completedCount = 0;
            tasks.forEach((t, idx) => {
              if (store.planner.taskCompletions[\`\${activePlan.planId}_day\${dayIndex}_task\${idx}\`]) completedCount++;
            });
            if (completedCount === scheduledCount && scheduledCount > 0) status = "complete";
            else if (scheduledCount > 0 && day < new Date(new Date().setHours(0, 0, 0, 0))) status = "incomplete";
          }
        }
      }
      newConsistencyWeek.push({ date: dateStr, status: status, isToday: i === dayOfWeekISO });
    }
  } catch (e) { console.error("Error computing consistencyWeek cache", e); }
  
  cachedConsistencyWeek = newConsistencyWeek;
}
setInterval(updateAnalyticsCache, 5 * 60 * 1000);
setTimeout(updateAnalyticsCache, 1000); // Initial run
`;

// Replace consistencyWeek computation in '/' route with cache
const rootRouteRegex = /app\.get\('\/', \(req, res\) => \{[\s\S]*?res\.render\('index\.html', \{[\s\S]*?\}\);\s*}\);/;
const newRootRoute = `app.get('/', async (req, res) => {
  let latestExamName = "No active exam";
  let latestExamId = "none";
  try {
    const raw = await fs.promises.readFile(path.join(__dirname, 'exams_array.json'), 'utf-8');
    const examsData = JSON.parse(raw);
    const activeExams = examsData.filter(e => !e.id.endsWith('-b'));
    if (activeExams.length > 0) {
      latestExamName = activeExams[0].name;
      latestExamId = activeExams[0].id;
    }
  } catch (err) { console.error("Error reading exams database:", err); }

  res.render('index.html', { 
    latestExamName, 
    latestExamId, 
    consistencyWeek: cachedConsistencyWeek, 
    user: store.user, 
    analyticsData: cachedAnalytics 
  });
});`;
code = code.replace(rootRouteRegex, backgroundWorkerCode + "\n\n" + newRootRoute);


// 3. Trigger cache update on submit
code = code.replace(/updateStreak\(\);/g, "updateStreak();\n      updateAnalyticsCache();");


// 4. Async Read, Filter, Paginate in /api/exams
const examsRouteRegex = /app\.get\('\/api\/exams', \(req, res\) => \{[\s\S]*?res\.json\(Object\.values\(grouped\)\);\s*\} catch \(err\) \{[\s\S]*?\}\s*\}\);/;
const newExamsRoute = `app.get('/api/exams', async (req, res) => {
  try {
    const raw = await fs.promises.readFile(path.join(__dirname, 'exams_array.json'), 'utf-8');
    let examsData = JSON.parse(raw);
    
    // Parse query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const yearFilter = req.query.year;
    const regionFilter = req.query.region;
    const statusFilter = req.query.status;

    // Filter by year & region
    if (yearFilter && yearFilter !== 'all') {
      examsData = examsData.filter(e => e.date.includes(yearFilter));
    }
    if (regionFilter && regionFilter !== 'all') {
      examsData = examsData.filter(e => e.region.toLowerCase() === regionFilter.toLowerCase());
    }

    // Filter by status if requested (requires DB lookup)
    if (statusFilter && statusFilter !== 'all') {
      // Temporarily bypass token required for public frontend; if token exists, we filter, else return incomplete
      const authHeader = req.headers.authorization;
      let userAttemptsList = [];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
          userAttemptsList = await Attempt.find({ userId: decoded.userId }).lean();
        } catch(e) {}
      }
      
      examsData = examsData.filter(e => {
        const hasAttempt = userAttemptsList.some(a => a.examId === e.id);
        if (statusFilter === 'completed') return hasAttempt;
        if (statusFilter === 'incomplete') return !hasAttempt;
        return true;
      });
    }

    const grouped = {};
    examsData.forEach(exam => {
      if (exam.id.endsWith('-b')) return;
      const year = parseInt(exam.date.split(' ')[1]);
      const month = exam.date.split(' ')[0];
      const examKey = month + '-' + year;
      
      if (!grouped[examKey]) grouped[examKey] = { id: month.toLowerCase() + '-' + year, month, year, regions: [] };
      let regionEntry = grouped[examKey].regions.find(r => r.name === exam.region);
      if (!regionEntry) { regionEntry = { name: exam.region, versions: [] }; grouped[examKey].regions.push(regionEntry); }
      
      const versionId = exam.id.split('-').slice(2).join('-');
      const versionMatch = exam.name.match(/\\(([^)]+)\\)/);
      const versionName = versionMatch ? versionMatch[1] : versionId;
      regionEntry.versions.push({ name: versionName, id: versionId });
    });
    
    const fullArray = Object.values(grouped);
    const total = fullArray.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedData = fullArray.slice((page - 1) * limit, page * limit);
    
    res.json({
      data: paginatedData,
      total,
      page,
      limit,
      totalPages
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load exams' });
  }
});`;
code = code.replace(examsRouteRegex, newExamsRoute);

fs.writeFileSync('server.js', code);
console.log('server.js performance refactor successful');
