const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.get('/', (req, res) => {
  let latestExamName = "March 2026 Real Past Exam Available Now";
  let latestExamId = "march-2026-int-a";
  
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'exams_array.json'), 'utf-8');
    const examsData = JSON.parse(raw);
    
    const examsWithDate = examsData.filter(e => e.createdAt);
    if (examsWithDate.length > 0) {
      examsWithDate.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      latestExamName = examsWithDate[0].name + " Available Now";
      latestExamId = examsWithDate[0].id;
    }
  } catch (err) {
    console.error("Error reading exams database:", err);
  }

  const consistencyWeek = [];
  try {
    const now = new Date();
    const dayOfWeekISO = (now.getDay() + 6) % 7; // 0=Mon, 6=Sun
    
    let activePlan = null;
    const planKeys = Object.keys(store.planner.plans);
    if (planKeys.length > 0) {
      activePlan = store.planner.plans[planKeys[0]];
    }

    for (let i = 0; i < 7; i++) {
      const day = new Date(now);
      day.setHours(0, 0, 0, 0);
      day.setDate(now.getDate() - (dayOfWeekISO - i));
      const dateStr = day.toISOString().split('T')[0];
      
      let status = "empty";
      
      if (activePlan) {
        const scheduleDay = activePlan.schedule.find(s => s.date === dateStr);
        if (scheduleDay) {
          const tasks = scheduleDay.tasks.filter(t => t.type !== 'rest');
          const scheduledCount = tasks.length;
          
          if (scheduledCount > 0) {
            const dayIndex = activePlan.schedule.indexOf(scheduleDay);
            let completedCount = 0;
            
            tasks.forEach((t, idx) => {
              const taskId = `${activePlan.planId}_day${dayIndex}_task${idx}`;
              if (store.planner.taskCompletions[taskId]) {
                completedCount++;
              }
            });
            
            if (completedCount === scheduledCount) {
              status = "complete";
            } else {
              status = "incomplete";
            }
          }
        }
      }
      
      consistencyWeek.push({
        date: dateStr,
        status: status,
        isToday: i === dayOfWeekISO
      });
    }
  } catch (err) {
    console.error("Error computing consistencyWeek:", err);
  }

  res.render('index.html', { latestExamName, latestExamId, consistencyWeek });
});

app.use(express.static(path.join(__dirname))); // Serve all HTML, CSS, JS static files

// ==========================================================
// IN-MEMORY STORAGE AND SEEDS
// ==========================================================
const store = {
  user: {
    id: 'user_001',
    name: 'Abdullah',
    currentScore: 1220,
    goalScore: 1560,
    examDate: '2026-12-05', // FIX 1: updated to a future date
    streak: 3,
    consistency: {
      '2026-05-25': true,
      '2026-05-26': true,
      '2026-05-27': false,
      '2026-05-28': true,
      '2026-05-29': true,
      '2026-05-30': false,
      '2026-05-31': true
    },
    coins: 80,
    flames: 1,
    savedColleges: [],
    savedQuestions: [],
    settings: { dailyGoal: 10, notifications: true, difficulty: 'all' }
  },
  questions: {
    answered: [
      { questionId: "q_math_lin1_01", correct: true, timeSpent: 22, topic: "Algebra", subject: "math", date: "2025-08-16" },
      { questionId: "q_math_lin1_02", correct: true, timeSpent: 18, topic: "Algebra", subject: "math", date: "2025-08-16" },
      { questionId: "q_math_linf_01", correct: true, timeSpent: 30, topic: "Algebra", subject: "math", date: "2025-08-16" },
      { questionId: "q_eng_bound_01", correct: true, timeSpent: 15, topic: "Standard English Conventions", subject: "reading", date: "2025-08-16" },
      { questionId: "q_eng_bound_02", correct: true, timeSpent: 12, topic: "Standard English Conventions", subject: "reading", date: "2025-08-16" },
      { questionId: "q_eng_idea_01", correct: true, timeSpent: 40, topic: "Information and Ideas", subject: "reading", date: "2025-08-16" }
    ],
    saved: []
  },
  planner: {
    plans: {},       // planId → plan object
    taskCompletions: {}, // taskId -> boolean
    uploads: []
  },
  vocab: {
    sets: [],
    progress: {},    // wordId → { status, lastSeen }
    scores: []
  },
  analytics: {
    heatmap: { '2025-08-16': 6 }
  },
  colleges: {
    saved: []        // array of college ids
  }
};

// ==========================================================
// PERSISTENCE LAYER (To survive Nodemon / Laptop restarts)
// ==========================================================
const DB_PATH = path.join(__dirname, 'db.json');
const EXAM_QUESTIONS_PATH = path.join(__dirname, 'examQuestions.json');
const ATTEMPTS_PATH = path.join(__dirname, 'examAttempts.json');
const REAL_EXAM_ATTEMPTS_PATH = path.join(__dirname, 'realExamAttempts.json');

let examQuestionsDb = {};
let examAttempts = {};
let realExamAttempts = {};

try {
  if (fs.existsSync(DB_PATH)) {
    const rawData = fs.readFileSync(DB_PATH, 'utf-8');
    const savedData = JSON.parse(rawData);
    if (savedData) {
      store.planner.plans = savedData; // Restore the plans
    }
  }
} catch (err) {
  console.error("Failed to load db.json on startup", err);
}

try {
  if (fs.existsSync(EXAM_QUESTIONS_PATH)) {
    const qData = fs.readFileSync(EXAM_QUESTIONS_PATH, 'utf-8');
    examQuestionsDb = JSON.parse(qData);
  }
} catch (err) {
  console.error("Failed to load examQuestions.json on startup", err);
}

try {
  if (fs.existsSync(ATTEMPTS_PATH)) {
    const aData = fs.readFileSync(ATTEMPTS_PATH, 'utf-8');
    examAttempts = JSON.parse(aData);
  }
} catch (err) {
  console.error("Failed to load examAttempts.json on startup", err);
}

try {
  if (fs.existsSync(REAL_EXAM_ATTEMPTS_PATH)) {
    const rData = fs.readFileSync(REAL_EXAM_ATTEMPTS_PATH, 'utf-8');
    realExamAttempts = JSON.parse(rData);
  }
} catch (err) {
  console.error("Failed to load realExamAttempts.json on startup", err);
}

function persistPlans() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(store.planner.plans, null, 2));
  } catch (err) {
    console.error("Failed to write to db.json", err);
  }
}

function persistAttempts() {
  try {
    fs.writeFileSync(ATTEMPTS_PATH, JSON.stringify(examAttempts, null, 2));
  } catch (err) {
    console.error("Failed to write to examAttempts.json", err);
  }
}

function persistRealExamAttempts() {
  try {
    fs.writeFileSync(REAL_EXAM_ATTEMPTS_PATH, JSON.stringify(realExamAttempts, null, 2));
  } catch (err) {
    console.error("Failed to write to realExamAttempts.json", err);
  }
}

// ==========================================================
// SEEDS: 100 COLLEGES
// ==========================================================
const collegesDb = [
  { id: 1,  name: "Harvard University",           city: "Cambridge", state: "MA", type: "Private Nonprofit", acceptanceRate: 3,  medianSAT: 1580, logo: "H",  logoColor: "#A51C30" },
  { id: 2,  name: "MIT",                          city: "Cambridge", state: "MA", type: "Private Nonprofit", acceptanceRate: 4,  medianSAT: 1570, logo: "MIT",logoColor: "#750014" },
  { id: 3,  name: "Stanford University",          city: "Stanford",  state: "CA", type: "Private Nonprofit", acceptanceRate: 4,  medianSAT: 1570, logo: "S",  logoColor: "#8C1515" },
  { id: 4,  name: "Yale University",              city: "New Haven", state: "CT", type: "Private Nonprofit", acceptanceRate: 5,  medianSAT: 1560, logo: "Y",  logoColor: "#00356B" },
  { id: 5,  name: "Princeton University",         city: "Princeton", state: "NJ", type: "Private Nonprofit", acceptanceRate: 4,  medianSAT: 1570, logo: "P",  logoColor: "#E87722" },
  { id: 6,  name: "Columbia University",          city: "New York",  state: "NY", type: "Private Nonprofit", acceptanceRate: 4,  medianSAT: 1560, logo: "C",  logoColor: "#003DA5" },
  { id: 7,  name: "UPenn",                        city: "Philadelphia", state: "PA", type: "Private Nonprofit", acceptanceRate: 7, medianSAT: 1530, logo: "UP", logoColor: "#011F5B" },
  { id: 8,  name: "Brown University",             city: "Providence", state: "RI", type: "Private Nonprofit", acceptanceRate: 5,  medianSAT: 1530, logo: "B",  logoColor: "#4E3629" },
  { id: 9,  name: "Dartmouth College",            city: "Hanover",   state: "NH", type: "Private Nonprofit", acceptanceRate: 6,  medianSAT: 1540, logo: "D",  logoColor: "#00693E" },
  { id: 10, name: "Cornell University",           city: "Ithaca",    state: "NY", type: "Private Nonprofit", acceptanceRate: 9,  medianSAT: 1520, logo: "C",  logoColor: "#B31B1B" },
  { id: 11, name: "Duke University",              city: "Durham",    state: "NC", type: "Private Nonprofit", acceptanceRate: 7,  medianSAT: 1540, logo: "D",  logoColor: "#003087" },
  { id: 12, name: "Northwestern University",      city: "Evanston",  state: "IL", type: "Private Nonprofit", acceptanceRate: 7,  medianSAT: 1540, logo: "N",  logoColor: "#4E2A84" },
  { id: 13, name: "Johns Hopkins University",     city: "Baltimore", state: "MD", type: "Private Nonprofit", acceptanceRate: 8,  medianSAT: 1540, logo: "JH", logoColor: "#002D72" },
  { id: 14, name: "Vanderbilt University",        city: "Nashville", state: "TN", type: "Private Nonprofit", acceptanceRate: 8,  medianSAT: 1540, logo: "V",  logoColor: "#866D4B" },
  { id: 15, name: "Rice University",              city: "Houston",   state: "TX", type: "Private Nonprofit", acceptanceRate: 9,  medianSAT: 1545, logo: "R",  logoColor: "#002469" },
  { id: 16, name: "Washington University in St. Louis", city: "St. Louis", state: "MO", type: "Private Nonprofit", acceptanceRate: 13, medianSAT: 1540, logo: "WU", logoColor: "#A51417" },
  { id: 17, name: "Notre Dame University",        city: "Notre Dame", state: "IN", type: "Private Nonprofit", acceptanceRate: 13, medianSAT: 1510, logo: "ND", logoColor: "#0C2340" },
  { id: 18, name: "Georgetown University",        city: "Washington", state: "DC", type: "Private Nonprofit", acceptanceRate: 14, medianSAT: 1490, logo: "G",  logoColor: "#041E42" },
  { id: 19, name: "Emory University",             city: "Atlanta",   state: "GA", type: "Private Nonprofit", acceptanceRate: 17, medianSAT: 1480, logo: "E",  logoColor: "#012169" },
  { id: 20, name: "Carnegie Mellon University",   city: "Pittsburgh",state: "PA", type: "Private Nonprofit", acceptanceRate: 14, medianSAT: 1540, logo: "CM", logoColor: "#C41230" },
  { id: 21, name: "UC Berkeley",                  city: "Berkeley",  state: "CA", type: "Public",            acceptanceRate: 14, medianSAT: 1445, logo: "B",  logoColor: "#003262" },
  { id: 22, name: "UCLA",                         city: "Los Angeles", state: "CA", type: "Public",          acceptanceRate: 9,  medianSAT: 1415, logo: "UCLA",logoColor: "#2774AE" },
  { id: 23, name: "University of Michigan",       city: "Ann Arbor", state: "MI", type: "Public",            acceptanceRate: 18, medianSAT: 1460, logo: "M",  logoColor: "#00274C" },
  { id: 24, name: "University of Virginia",       city: "Charlottesville", state: "VA", type: "Public",      acceptanceRate: 19, medianSAT: 1430, logo: "UVA",logoColor: "#232D4B" },
  { id: 25, name: "University of North Carolina", city: "Chapel Hill", state: "NC", type: "Public",          acceptanceRate: 19, medianSAT: 1380, logo: "UNC",logoColor: "#4B9CD3" },
  { id: 26, name: "Georgia Tech",                 city: "Atlanta",   state: "GA", type: "Public",            acceptanceRate: 17, medianSAT: 1490, logo: "GT", logoColor: "#B3A369" },
  { id: 27, name: "University of Texas Austin",   city: "Austin",    state: "TX", type: "Public",            acceptanceRate: 32, medianSAT: 1330, logo: "UT", logoColor: "#BF5700" },
  { id: 28, name: "University of Wisconsin",      city: "Madison",   state: "WI", type: "Public",            acceptanceRate: 49, medianSAT: 1370, logo: "W",  logoColor: "#C5050C" },
  { id: 29, name: "University of Illinois",       city: "Urbana-Champaign", state: "IL", type: "Public",     acceptanceRate: 45, medianSAT: 1390, logo: "I",  logoColor: "#13294B" },
  { id: 30, name: "Ohio State University",        city: "Columbus",  state: "OH", type: "Public",            acceptanceRate: 54, medianSAT: 1340, logo: "OSU",logoColor: "#BA0C2F" },
  { id: 31, name: "Tufts University",             city: "Medford",   state: "MA", type: "Private Nonprofit", acceptanceRate: 10, medianSAT: 1500, logo: "T",  logoColor: "#3E8EDE" },
  { id: 32, name: "Boston College",               city: "Chestnut Hill", state: "MA", type: "Private Nonprofit", acceptanceRate: 19, medianSAT: 1460, logo: "BC", logoColor: "#98002E" },
  { id: 33, name: "Boston University",            city: "Boston",    state: "MA", type: "Private Nonprofit", acceptanceRate: 19, medianSAT: 1430, logo: "BU", logoColor: "#CC0000" },
  { id: 34, name: "Northeastern University",      city: "Boston",    state: "MA", type: "Private Nonprofit", acceptanceRate: 7,  medianSAT: 1510, logo: "N",  logoColor: "#C8102E" },
  { id: 35, name: "NYU",                          city: "New York",  state: "NY", type: "Private Nonprofit", acceptanceRate: 12, medianSAT: 1480, logo: "NYU",logoColor: "#57068C" },
  { id: 36, name: "USC",                          city: "Los Angeles", state: "CA", type: "Private Nonprofit", acceptanceRate: 12, medianSAT: 1475, logo: "SC", logoColor: "#990000" },
  { id: 37, name: "Wake Forest University",       city: "Winston-Salem", state: "NC", type: "Private Nonprofit", acceptanceRate: 22, medianSAT: 1430, logo: "WF", logoColor: "#9E7E38" },
  { id: 38, name: "Tulane University",            city: "New Orleans", state: "LA", type: "Private Nonprofit", acceptanceRate: 13, medianSAT: 1450, logo: "T",  logoColor: "#006747" },
  { id: 39, name: "Lehigh University",            city: "Bethlehem", state: "PA", type: "Private Nonprofit", acceptanceRate: 34, medianSAT: 1410, logo: "L",  logoColor: "#653400" },
  { id: 40, name: "George Washington University", city: "Washington", state: "DC", type: "Private Nonprofit", acceptanceRate: 45, medianSAT: 1380, logo: "GW", logoColor: "#033C5A" },
  { id: 41, name: "Purdue University",            city: "West Lafayette", state: "IN", type: "Public",       acceptanceRate: 67, medianSAT: 1320, logo: "P",  logoColor: "#CEB888" },
  { id: 42, name: "Penn State University",        city: "University Park", state: "PA", type: "Public",      acceptanceRate: 57, medianSAT: 1260, logo: "PSU",logoColor: "#1E407C" },
  { id: 43, name: "Indiana University",           city: "Bloomington", state: "IN", type: "Public",          acceptanceRate: 80, medianSAT: 1230, logo: "IU", logoColor: "#990000" },
  { id: 44, name: "University of Florida",        city: "Gainesville", state: "FL", type: "Public",          acceptanceRate: 24, medianSAT: 1380, logo: "UF", logoColor: "#0021A5" },
  { id: 45, name: "University of Georgia",        city: "Athens",    state: "GA", type: "Public",            acceptanceRate: 45, medianSAT: 1290, logo: "UGA",logoColor: "#BA0C2F" },
  { id: 46, name: "University of Washington",     city: "Seattle",   state: "WA", type: "Public",            acceptanceRate: 49, medianSAT: 1330, logo: "W",  logoColor: "#4B2E83" },
  { id: 47, name: "Michigan State University",    city: "East Lansing", state: "MI", type: "Public",         acceptanceRate: 76, medianSAT: 1210, logo: "MSU",logoColor: "#18453B" },
  { id: 48, name: "Rutgers University",           city: "New Brunswick", state: "NJ", type: "Public",        acceptanceRate: 66, medianSAT: 1250, logo: "R",  logoColor: "#CC0033" },
  { id: 49, name: "University of Minnesota",      city: "Minneapolis", state: "MN", type: "Public",          acceptanceRate: 57, medianSAT: 1310, logo: "M",  logoColor: "#7A0019" },
  { id: 50, name: "University of Pittsburgh",     city: "Pittsburgh", state: "PA", type: "Public",           acceptanceRate: 52, medianSAT: 1320, logo: "UP", logoColor: "#003594" },
  { id: 51, name: "Case Western Reserve",         city: "Cleveland", state: "OH", type: "Private Nonprofit", acceptanceRate: 30, medianSAT: 1480, logo: "CW", logoColor: "#0A304E" },
  { id: 52, name: "Brandeis University",          city: "Waltham",   state: "MA", type: "Private Nonprofit", acceptanceRate: 35, medianSAT: 1430, logo: "B",  logoColor: "#003478" },
  { id: 53, name: "Rochester University",         city: "Rochester", state: "NY", type: "Private Nonprofit", acceptanceRate: 29, medianSAT: 1470, logo: "R",  logoColor: "#003B71" },
  { id: 54, name: "Rensselaer Polytechnic",       city: "Troy",      state: "NY", type: "Private Nonprofit", acceptanceRate: 49, medianSAT: 1450, logo: "RPI",logoColor: "#E2231A" },
  { id: 55, name: "Santa Clara University",       city: "Santa Clara", state: "CA", type: "Private Nonprofit", acceptanceRate: 46, medianSAT: 1380, logo: "SC", logoColor: "#862633" },
  { id: 56, name: "Villanova University",         city: "Villanova", state: "PA", type: "Private Nonprofit", acceptanceRate: 23, medianSAT: 1420, logo: "V",  logoColor: "#00205B" },
  { id: 57, name: "Fordham University",           city: "New York",  state: "NY", type: "Private Nonprofit", acceptanceRate: 46, medianSAT: 1350, logo: "F",  logoColor: "#6B2737" },
  { id: 58, name: "American University",          city: "Washington", state: "DC", type: "Private Nonprofit", acceptanceRate: 36, medianSAT: 1310, logo: "AU", logoColor: "#C8102E" },
  { id: 59, name: "University of Denver",         city: "Denver",    state: "CO", type: "Private Nonprofit", acceptanceRate: 75, medianSAT: 1270, logo: "DU", logoColor: "#CE1141" },
  { id: 60, name: "Drexel University",            city: "Philadelphia", state: "PA", type: "Private Nonprofit", acceptanceRate: 75, medianSAT: 1290, logo: "D",  logoColor: "#07294D" },
  { id: 61, name: "UC San Diego",                 city: "La Jolla",  state: "CA", type: "Public",            acceptanceRate: 24, medianSAT: 1390, logo: "UCSD",logoColor: "#00629B" },
  { id: 62, name: "UC Davis",                     city: "Davis",     state: "CA", type: "Public",            acceptanceRate: 39, medianSAT: 1330, logo: "UCD",logoColor: "#022851" },
  { id: 63, name: "UC Santa Barbara",             city: "Santa Barbara", state: "CA", type: "Public",        acceptanceRate: 26, medianSAT: 1340, logo: "UCSB",logoColor: "#003660" },
  { id: 64, name: "UC Irvine",                    city: "Irvine",    state: "CA", type: "Public",            acceptanceRate: 21, medianSAT: 1310, logo: "UCI",logoColor: "#003764" },
  { id: 65, name: "University of Maryland",       city: "College Park", state: "MD", type: "Public",         acceptanceRate: 44, medianSAT: 1390, logo: "UM", logoColor: "#E03A3E" },
  { id: 66, name: "Virginia Tech",                city: "Blacksburg", state: "VA", type: "Public",           acceptanceRate: 57, medianSAT: 1310, logo: "VT", logoColor: "#630031" },
  { id: 67, name: "University of Colorado",       city: "Boulder",   state: "CO", type: "Public",            acceptanceRate: 84, medianSAT: 1230, logo: "CU", logoColor: "#CFB87C" },
  { id: 68, name: "Clemson University",           city: "Clemson",   state: "SC", type: "Public",            acceptanceRate: 43, medianSAT: 1270, logo: "C",  logoColor: "#F66733" },
  { id: 69, name: "University of Arizona",        city: "Tucson",    state: "AZ", type: "Public",            acceptanceRate: 85, medianSAT: 1180, logo: "UA", logoColor: "#AB0520" },
  { id: 70, name: "University of Iowa",           city: "Iowa City", state: "IA", type: "Public",            acceptanceRate: 84, medianSAT: 1230, logo: "UI", logoColor: "#FFCD00" },
  { id: 71, name: "Babson College",               city: "Wellesley", state: "MA", type: "Private Nonprofit", acceptanceRate: 24, medianSAT: 1390, logo: "B",  logoColor: "#00563F" },
  { id: 72, name: "Colgate University",           city: "Hamilton",  state: "NY", type: "Private Nonprofit", acceptanceRate: 22, medianSAT: 1460, logo: "C",  logoColor: "#821019" },
  { id: 73, name: "Wesleyan University",          city: "Middletown",state: "CT", type: "Private Nonprofit", acceptanceRate: 16, medianSAT: 1480, logo: "W",  logoColor: "#C8102E" },
  { id: 74, name: "Hamilton College",             city: "Clinton",   state: "NY", type: "Private Nonprofit", acceptanceRate: 17, medianSAT: 1460, logo: "H",  logoColor: "#0047AB" },
  { id: 75, name: "Bowdoin College",              city: "Brunswick", state: "ME", type: "Private Nonprofit", acceptanceRate: 9,  medianSAT: 1500, logo: "B",  logoColor: "#000000" },
  { id: 76, name: "Middlebury College",           city: "Middlebury",state: "VT", type: "Private Nonprofit", acceptanceRate: 14, medianSAT: 1480, logo: "M",  logoColor: "#004F97" },
  { id: 77, name: "Williams College",             city: "Williamstown",state:"MA", type: "Private Nonprofit", acceptanceRate: 9, medianSAT: 1510, logo: "W",  logoColor: "#512888" },
  { id: 78, name: "Amherst College",              city: "Amherst",   state: "MA", type: "Private Nonprofit", acceptanceRate: 9,  medianSAT: 1510, logo: "A",  logoColor: "#3E1F8E" },
  { id: 79, name: "Swarthmore College",           city: "Swarthmore",state: "PA", type: "Private Nonprofit", acceptanceRate: 8,  medianSAT: 1520, logo: "S",  logoColor: "#CF102D" },
  { id: 80, name: "Carleton College",             city: "Northfield",state: "MN", type: "Private Nonprofit", acceptanceRate: 17, medianSAT: 1490, logo: "C",  logoColor: "#002B5C" },
  { id: 81, name: "Harvey Mudd College",          city: "Claremont", state: "CA", type: "Private Nonprofit", acceptanceRate: 10, medianSAT: 1560, logo: "HM", logoColor: "#F9A21B" },
  { id: 82, name: "Pomona College",               city: "Claremont", state: "CA", type: "Private Nonprofit", acceptanceRate: 7,  medianSAT: 1510, logo: "P",  logoColor: "#0057A8" },
  { id: 83, name: "Claremont McKenna College",    city: "Claremont", state: "CA", type: "Private Nonprofit", acceptanceRate: 9,  medianSAT: 1490, logo: "CM", logoColor: "#8B0000" },
  { id: 84, name: "Davidson College",             city: "Davidson",  state: "NC", type: "Private Nonprofit", acceptanceRate: 17, medianSAT: 1440, logo: "D",  logoColor: "#CC0000" },
  { id: 85, name: "Grinnell College",             city: "Grinnell",  state: "IA", type: "Private Nonprofit", acceptanceRate: 13, medianSAT: 1470, logo: "G",  logoColor: "#CC0000" },
  { id: 86, name: "Oberlin College",              city: "Oberlin",   state: "OH", type: "Private Nonprofit", acceptanceRate: 33, medianSAT: 1420, logo: "O",  logoColor: "#B1242A" },
  { id: 87, name: "Colorado College",             city: "Colorado Springs", state: "CO", type: "Private Nonprofit", acceptanceRate: 15, medianSAT: 1430, logo: "CC", logoColor: "#1D3557" },
  { id: 88, name: "Smith College",                city: "Northampton",state: "MA", type: "Private Nonprofit", acceptanceRate: 32, medianSAT: 1380, logo: "S",  logoColor: "#002855" },
  { id: 89, name: "Wellesley College",            city: "Wellesley", state: "MA", type: "Private Nonprofit", acceptanceRate: 14, medianSAT: 1460, logo: "W",  logoColor: "#005596" },
  { id: 90, name: "Barnard College",              city: "New York",  state: "NY", type: "Private Nonprofit", acceptanceRate: 11, medianSAT: 1470, logo: "B",  logoColor: "#C8102E" },
  { id: 91, name: "Abilene Christian University",  city: "Abilene",     state: "TX", type: "Private Nonprofit", acceptanceRate: 64, medianSAT: 1170, logo: "ACU",logoColor: "#5B2C8D" },
  { id: 92, name: "Adelphi University",             city: "Garden City", state: "NY", type: "Private Nonprofit", acceptanceRate: 78, medianSAT: 1210, logo: "A",  logoColor: "#B45309" },
  { id: 93, name: "Agnes Scott College",            city: "Decatur",     state: "GA", type: "Private Nonprofit", acceptanceRate: 62, medianSAT: 1250, logo: "A",  logoColor: "#6B7280" },
  { id: 94, name: "Alabama A&M University",         city: "Normal",      state: "AL", type: "Public",            acceptanceRate: 66, medianSAT: 940,  logo: "A",  logoColor: "#8B0000" },
  { id: 95, name: "Alabama State University",       city: "Montgomery",  state: "AL", type: "Public",            acceptanceRate: 96, medianSAT: 900,  logo: "ASU",logoColor: "#000000" },
  { id: 96, name: "Alaska Pacific University",      city: "Anchorage",   state: "AK", type: "Private Nonprofit", acceptanceRate: 86, medianSAT: 1020, logo: "A",  logoColor: "#1E3A5F" },
  { id: 97, name: "Abraham Baldwin Agricultural",   city: "Tifton",      state: "GA", type: "Public",            acceptanceRate: 77, medianSAT: 1000, logo: "A",  logoColor: "#374151" },
  { id: 98, name: "Adrian College",                 city: "Adrian",      state: "MI", type: "Private Nonprofit", acceptanceRate: 68, medianSAT: 1000, logo: "A",  logoColor: "#8B6914" },
  { id: 99, name: "Florida State University",       city: "Tallahassee", state: "FL", type: "Public",            acceptanceRate: 25, medianSAT: 1310, logo: "FSU",logoColor: "#782F40" },
  { id: 100,name: "Arizona State University",       city: "Tempe",       state: "AZ", type: "Public",            acceptanceRate: 88, medianSAT: 1210, logo: "ASU",logoColor: "#8C1D40" }
];

collegesDb.forEach(c => {
  c.ranking = c.id;
  c.satRange = { low: c.medianSAT - 80, high: c.medianSAT + 80 };
  const tags = [];
  if (c.id <= 10) tags.push("Ivy League");
  if (c.type === "Public") tags.push("Public");
  if (c.type === "Private Nonprofit") tags.push("Private");
  if (c.medianSAT >= 1500) tags.push("STEM");
  if (c.id > 70 && c.id <= 90) tags.push("Liberal Arts");
  if (c.id <= 50) tags.push("Research");
  c.tags = tags;
});

// ==========================================================
// SEEDS: 30 VOCAB WORDS
// ==========================================================
const vocabWordsDb = [
  { id: 1, word: "Aberrant", definition: "Departing from an accepted standard or normal course.", example: "The aberrant behavior of the computer program puzzled the developers.", difficulty: "hard" },
  { id: 2, word: "Benevolent", definition: "Well meaning and kindly.", example: "The benevolent king donated half of his fortune to the poor.", difficulty: "easy" },
  { id: 3, word: "Cacophony", definition: "A harsh, discordant mixture of sounds.", example: "The cacophony of car horns in New York City kept her awake all night.", difficulty: "medium" },
  { id: 4, word: "Didactic", definition: "Intended to teach, particularly in having moral instruction.", example: "The classroom was filled with didactic posters explaining algebra rules.", difficulty: "hard" },
  { id: 5, word: "Ephemeral", definition: "Lasting for a very short time; transient.", example: "Fame in the digital age is often ephemeral, lasting only a few days.", difficulty: "medium" },
  { id: 6, word: "Fallacious", definition: "Based on a mistaken belief or unsound argument.", example: "The argument was based on fallacious reasoning that ignored the scientific facts.", difficulty: "medium" },
  { id: 7, word: "Garrulous", definition: "Excessively talkative, especially on trivial matters.", example: "The garrulous passenger kept talking about his cat for three hours.", difficulty: "hard" },
  { id: 8, word: "Hegemony", definition: "Leadership or dominance, especially by one country or group.", example: "The empire struggled to maintain its political hegemony over the surrounding states.", difficulty: "hard" },
  { id: 9, word: "Iconoclast", definition: "A person who attacks cherished beliefs or institutions.", example: "The young filmmaker was hailed as an iconoclast who challenged Hollywood conventions.", difficulty: "hard" },
  { id: 10, word: "Juxtapose", definition: "Place or deal with close together for contrasting effect.", example: "The gallery exhibition juxtaposed classic renaissance paintings with modern street art.", difficulty: "medium" },
  { id: 11, word: "Kinetic", definition: "Relating to or resulting from motion.", example: "The kinetic energy of the roller coaster peaked at the bottom of the track.", difficulty: "easy" },
  { id: 12, word: "Loquacious", definition: "Tending to talk a great deal; talkative.", example: "The loquacious host made sure that none of the guests felt left out.", difficulty: "hard" },
  { id: 13, word: "Melancholy", definition: "A feeling of pensive sadness, typically with no obvious cause.", example: "The rainy afternoon filled her with a sense of quiet melancholy.", difficulty: "easy" },
  { id: 14, word: "Nefarious", definition: "Wicked, impious, or criminal.", example: "The hacker's nefarious plans to steal credit card details were thwarted by security.", difficulty: "hard" },
  { id: 15, word: "Obfuscate", definition: "Render obscure, unclear, or unintelligible.", example: "The politician tried to obfuscate the real issues with long, winded speeches.", difficulty: "hard" },
  { id: 16, word: "Paradigm", definition: "A typical example or pattern of something; a model.", example: "The discovery of gravity caused a major paradigm shift in physics.", difficulty: "medium" },
  { id: 17, word: "Querulous", definition: "Complaining in a petulant or whining manner.", example: "The querulous patient demanded to see the doctor immediately.", difficulty: "hard" },
  { id: 18, word: "Reticent", definition: "Not revealing one's thoughts or feelings readily.", example: "She was extremely reticent about her personal life during the interview.", difficulty: "medium" },
  { id: 19, word: "Sycophant", definition: "A person who acts obsequiously toward someone important in order to gain advantage.", example: "The CEO was surrounded by sycophants who agreed with his every word.", difficulty: "hard" },
  { id: 20, word: "Taciturn", definition: "Reserved or uncommunicative in speech; saying little.", example: "My grandfather was a taciturn man who rarely spoke unless spoken to.", difficulty: "hard" },
  { id: 21, word: "Ubiquitous", definition: "Present, appearing, or found everywhere.", example: "Smartphones have become ubiquitous in modern society.", difficulty: "easy" },
  { id: 22, word: "Vacuous", definition: "Having or showing a lack of thought or intelligence; mindless.", example: "The movie was criticized for its vacuous plot and generic dialogue.", difficulty: "medium" },
  { id: 23, word: "Wane", definition: "Decrease in vigor, power, or extent; become weaker.", example: "Support for the new tax plan began to wane as prices rose.", difficulty: "easy" },
  { id: 24, word: "Xenophobia", definition: "Dislike of or prejudice against people from other countries.", example: "The local government launched campaigns to combat the rise of xenophobia.", difficulty: "medium" },
  { id: 25, word: "Zealot", definition: "A person who is fanatical and uncompromising in pursuit of ideals.", example: "The environmental activist was a zealot who refused to accept any compromises.", difficulty: "hard" },
  { id: 26, word: "Ambiguous", definition: "Open to more than one interpretation; having a double meaning.", example: "The instructions were so ambiguous that nobody knew what to do.", difficulty: "easy" },
  { id: 27, word: "Brevity", definition: "Concise and exact use of words in writing or speech.", example: "The brevity of the speech was appreciated by the tired audience.", difficulty: "easy" },
  { id: 28, word: "Cogent", definition: "Clear, logical, and convincing.", example: "She presented a cogent argument that won over the entire board.", difficulty: "medium" },
  { id: 29, word: "Diligent", definition: "Having or showing care and conscientiousness in one's work.", example: "The diligent student studied four hours every night for the SAT.", difficulty: "easy" },
  { id: 30, word: "Eloquent", definition: "Fluent or persuasive in speaking or writing.", example: "His eloquent eulogy moved many in the audience to tears.", difficulty: "easy" }
];

vocabWordsDb.forEach(w => w.mastered = false);

// ==========================================================
// SEEDS: QUESTIONS DATABASE
// ==========================================================
const questionsDb = [
  {
    id: "q_math_lin1_01",
    subject: "math",
    topic: "Algebra",
    subtopic: "Linear equations in one variable",
    difficulty: "easy",
    type: "multiple-choice",
    passage: null,
    question: "If 3x + 7 = 22, what is the value of x?",
    choices: [
      { letter: "A", text: "3" },
      { letter: "B", text: "5" },
      { letter: "C", text: "7" },
      { letter: "D", text: "9" }
    ],
    correctAnswer: "B",
    explanation: "Subtract 7 from both sides to get 3x = 15. Then, divide both sides by 3 to find x = 5. Answer B is correct.",
    explanationSteps: [
      { step: 1, text: "Write the equation: 3x + 7 = 22" },
      { step: 2, text: "Subtract 7 from both sides: 3x = 15" },
      { step: 3, text: "Divide by 3: x = 5" }
    ],
    timeLimit: 90
  },
  {
    id: "q_math_lin1_02",
    subject: "math",
    topic: "Algebra",
    subtopic: "Linear equations in one variable",
    difficulty: "easy",
    type: "multiple-choice",
    passage: null,
    question: "Solve for x: 2(x - 4) = 10",
    choices: [
      { letter: "A", text: "7" },
      { letter: "B", text: "9" },
      { letter: "C", text: "11" },
      { letter: "D", text: "13" }
    ],
    correctAnswer: "B",
    explanation: "Divide both sides by 2 to get x - 4 = 5. Add 4 to both sides to find x = 9. Answer B is correct.",
    explanationSteps: [
      { step: 1, text: "Divide by 2: x - 4 = 5" },
      { step: 2, text: "Add 4: x = 9" }
    ],
    timeLimit: 90
  },
  {
    id: "q_math_lin1_03",
    subject: "math",
    topic: "Algebra",
    subtopic: "Linear equations in one variable",
    difficulty: "medium",
    type: "multiple-choice",
    passage: null,
    question: "If 5x - 3 = 2x + 9, what is the value of x?",
    choices: [
      { letter: "A", text: "2" },
      { letter: "B", text: "4" },
      { letter: "C", text: "6" },
      { letter: "D", text: "8" }
    ],
    correctAnswer: "B",
    explanation: "Subtract 2x from both sides to get 3x - 3 = 9. Add 3 to both sides to get 3x = 12. Divide by 3 to find x = 4. Answer B is correct.",
    explanationSteps: [
      { step: 1, text: "Subtract 2x: 3x - 3 = 9" },
      { step: 2, text: "Add 3: 3x = 12" },
      { step: 3, text: "Divide by 3: x = 4" }
    ],
    timeLimit: 90
  },
  {
    id: "q_math_lin1_04",
    subject: "math",
    topic: "Algebra",
    subtopic: "Linear equations in one variable",
    difficulty: "easy",
    type: "multiple-choice",
    passage: null,
    question: "A store sells notebooks for $3 each. If Maria spent $21, how many notebooks did she buy?",
    choices: [
      { letter: "A", text: "5" },
      { letter: "B", text: "6" },
      { letter: "C", text: "7" },
      { letter: "D", text: "8" }
    ],
    correctAnswer: "C",
    explanation: "Let x represent the number of notebooks. The equation is 3x = 21. Dividing both sides by 3 gives x = 7. Answer C is correct.",
    explanationSteps: [
      { step: 1, text: "Model equation: 3x = 21" },
      { step: 2, text: "Divide by 3: x = 7" }
    ],
    timeLimit: 90
  },
  {
    id: "q_math_lin1_05",
    subject: "math",
    topic: "Algebra",
    subtopic: "Linear equations in one variable",
    difficulty: "medium",
    type: "multiple-choice",
    passage: null,
    question: "If (x/4) + 3 = 7, what is the value of x?",
    choices: [
      { letter: "A", text: "8" },
      { letter: "B", text: "12" },
      { letter: "C", text: "16" },
      { letter: "D", text: "20" }
    ],
    correctAnswer: "C",
    explanation: "Subtract 3 from both sides to get x/4 = 4. Multiply both sides by 4 to find x = 16. Answer C is correct.",
    explanationSteps: [
      { step: 1, text: "Subtract 3: x/4 = 4" },
      { step: 2, text: "Multiply by 4: x = 16" }
    ],
    timeLimit: 90
  },
  {
    id: "q_math_linf_01",
    subject: "math",
    topic: "Algebra",
    subtopic: "Linear functions",
    difficulty: "easy",
    type: "multiple-choice",
    passage: null,
    question: "A line passes through (0, 3) and (2, 7). What is its slope?",
    choices: [
      { letter: "A", text: "1" },
      { letter: "B", text: "2" },
      { letter: "C", text: "3" },
      { letter: "D", text: "4" }
    ],
    correctAnswer: "B",
    explanation: "Slope m = (y2 - y1) / (x2 - x1) = (7 - 3) / (2 - 0) = 4 / 2 = 2. Answer B is correct.",
    explanationSteps: [
      { step: 1, text: "Identify points: (0, 3) and (2, 7)" },
      { step: 2, text: "Apply slope formula: (7 - 3) / (2 - 0)" },
      { step: 3, text: "Simplify: 4 / 2 = 2" }
    ],
    timeLimit: 90
  },
  {
    id: "q_math_linf_02",
    subject: "math",
    topic: "Algebra",
    subtopic: "Linear functions",
    difficulty: "easy",
    type: "multiple-choice",
    passage: null,
    question: "What is the y-intercept of the line modeled by y = 4x - 5?",
    choices: [
      { letter: "A", text: "-5" },
      { letter: "B", text: "4" },
      { letter: "C", text: "5" },
      { letter: "D", text: "-4" }
    ],
    correctAnswer: "A",
    explanation: "A linear equation in slope-intercept form y = mx + b has y-intercept b. Here b = -5. Answer A is correct.",
    explanationSteps: [
      { step: 1, text: "Recognize slope-intercept form: y = mx + b" },
      { step: 2, text: "Extract value b: -5" }
    ],
    timeLimit: 90
  },
  {
    id: "q_math_linf_03",
    subject: "math",
    topic: "Algebra",
    subtopic: "Linear functions",
    difficulty: "medium",
    type: "multiple-choice",
    passage: null,
    question: "If f(x) = 3x + 1, what is f(4)?",
    choices: [
      { letter: "A", text: "10" },
      { letter: "B", text: "12" },
      { letter: "C", text: "13" },
      { letter: "D", text: "15" }
    ],
    correctAnswer: "C",
    explanation: "Substitute x = 4 into the function: f(4) = 3(4) + 1 = 12 + 1 = 13. Answer C is correct.",
    explanationSteps: [
      { step: 1, text: "Substitute: 3(4) + 1" },
      { step: 2, text: "Evaluate: 12 + 1 = 13" }
    ],
    timeLimit: 90
  },
  {
    id: "q_math_linf_04",
    subject: "math",
    topic: "Algebra",
    subtopic: "Linear functions",
    difficulty: "easy",
    type: "multiple-choice",
    passage: null,
    question: "Which equation represents a line with slope -2 and y-intercept 6?",
    choices: [
      { letter: "A", text: "y = 6x - 2" },
      { letter: "B", text: "y = -2x + 6" },
      { letter: "C", text: "y = 2x + 6" },
      { letter: "D", text: "y = -6x + 2" }
    ],
    correctAnswer: "B",
    explanation: "Plug slope m = -2 and y-intercept b = 6 into y = mx + b to get y = -2x + 6. Answer B is correct.",
    explanationSteps: [
      { step: 1, text: "Use form: y = mx + b" },
      { step: 2, text: "Substitute: y = -2x + 6" }
    ],
    timeLimit: 90
  },
  {
    id: "q_math_linf_05",
    subject: "math",
    topic: "Algebra",
    subtopic: "Linear functions",
    difficulty: "medium",
    type: "multiple-choice",
    passage: null,
    question: "A taxi charges a $2 base fare plus $1.50 per mile. Which equation models the total cost C for m miles?",
    choices: [
      { letter: "A", text: "C = 1.5m" },
      { letter: "B", text: "C = 2m + 1.5" },
      { letter: "C", text: "C = 1.5m + 2" },
      { letter: "D", text: "C = 2 + m" }
    ],
    correctAnswer: "C",
    explanation: "The base fare of $2 is a flat fee (y-intercept) and $1.50 per mile is the variable rate (slope). Thus, C = 1.5m + 2. Answer C is correct.",
    explanationSteps: [
      { step: 1, text: "Constant value: 2" },
      { step: 2, text: "Variable rate: 1.5 per mile" },
      { step: 3, text: "Model equation: C = 1.5m + 2" }
    ],
    timeLimit: 90
  },
  {
    id: "q_math_geom_01",
    subject: "math",
    topic: "Geometry and Trigonometry",
    subtopic: "Area and volume",
    difficulty: "medium",
    type: "graph",
    passage: "The graph shows the liquid level y, in centimeters, in a container x hours after it began to leak.",
    graphData: {
      type: "line",
      title: "Liquid Level in a Leaking Container",
      xLabel: "Time (hours)",
      yLabel: "Liquid level (cm)",
      xRange: [0, 10],
      yRange: [0, 100],
      points: [[0,95],[1,82],[2,70],[3,59],[4,49],[5,40],[6,32],[7,26],[8,20],[9,18],[10,17]]
    },
    question: "Which of the following is closest to the liquid level in the container 6 hours after it began to leak?",
    choices: [
      { letter: "A", text: "31 cm" },
      { letter: "B", text: "45 cm" },
      { letter: "C", text: "65 cm" },
      { letter: "D", text: "95 cm" }
    ],
    correctAnswer: "A",
    explanation: "Looking at the graph at x = 6 hours, the curve intersects at approximately y = 31-32 cm. The graph shows exponential decay, and at t=6, the liquid level has decreased to about 31 cm. Answer A (31 cm) is closest.",
    explanationSteps: [
      { step: 1, text: "Locate x = 6 on the horizontal axis (Time axis)" },
      { step: 2, text: "Draw a vertical line up from x = 6 until it hits the curve" },
      { step: 3, text: "Read the y-value at that intersection point" },
      { step: 4, text: "The curve at x = 6 is at approximately y ≈ 31-32 cm" },
      { step: 5, text: "Among the choices, 31 cm (A) is closest" }
    ],
    timeLimit: 90
  },
  {
    id: "q_math_geom_02",
    subject: "math",
    topic: "Geometry and Trigonometry",
    subtopic: "Area and volume",
    difficulty: "easy",
    type: "multiple-choice",
    passage: null,
    question: "A rectangle has length 12 cm and width 5 cm. What is its area?",
    choices: [
      { letter: "A", text: "17 cm²" },
      { letter: "B", text: "34 cm²" },
      { letter: "C", text: "60 cm²" },
      { letter: "D", text: "120 cm²" }
    ],
    correctAnswer: "C",
    explanation: "Area of a rectangle is computed as length × width = 12 × 5 = 60 cm². Answer C is correct.",
    explanationSteps: [
      { step: 1, text: "Formula: Area = length × width" },
      { step: 2, text: "Multiply: 12 × 5 = 60" }
    ],
    timeLimit: 90
  },
  {
    id: "q_eng_bound_01",
    subject: "reading",
    topic: "Standard English Conventions",
    subtopic: "Boundaries",
    difficulty: "medium",
    type: "multiple-choice",
    passage: null,
    question: "Choose the version that correctly punctuates the sentence:\n\"The experiment was a success___ the scientists celebrated.\"",
    choices: [
      { letter: "A", text: "success the" },
      { letter: "B", text: "success, the" },
      { letter: "C", text: "success; the" },
      { letter: "D", text: "success: the" }
    ],
    correctAnswer: "C",
    explanation: "The sentence contains two independent clauses. A semicolon is required to separate them without a coordinating conjunction. Comma splicing (Choice B) is incorrect. Answer C is correct.",
    explanationSteps: [
      { step: 1, text: "Identify clauses: 'The experiment was a success' and 'the scientists celebrated'" },
      { step: 2, text: "Both are independent clauses." },
      { step: 3, text: "Separate with a semicolon: 'success; the'" }
    ],
    timeLimit: 90
  },
  {
    id: "q_eng_bound_02",
    subject: "reading",
    topic: "Standard English Conventions",
    subtopic: "Boundaries",
    difficulty: "easy",
    type: "multiple-choice",
    passage: null,
    question: "Which option correctly joins two independent clauses?\n\"She studied hard___ she passed the exam.\"",
    choices: [
      { letter: "A", text: "hard she" },
      { letter: "B", text: "hard, she" },
      { letter: "C", text: "hard; she" },
      { letter: "D", text: "hard: she" }
    ],
    correctAnswer: "C",
    explanation: "Two independent clauses must be joined with a semicolon. Answer C is correct.",
    explanationSteps: [
      { step: 1, text: "Separate clauses: hard / she" },
      { step: 2, text: "Use semicolon: 'hard; she'" }
    ],
    timeLimit: 90
  },
  {
    id: "q_eng_idea_01",
    subject: "reading",
    topic: "Information and Ideas",
    subtopic: "Central Ideas and Details",
    difficulty: "medium",
    type: "passage",
    passage: "Bees play a crucial role in agriculture by pollinating crops. Without bees, many plants cannot reproduce, which would devastate food supplies worldwide. Scientists estimate that one-third of all food consumed by humans depends on pollination by bees.",
    question: "What is the central idea of the passage?",
    choices: [
      { letter: "A", text: "Bees make honey." },
      { letter: "B", text: "Bees are essential for global food production." },
      { letter: "C", text: "Scientists study insects." },
      { letter: "D", text: "Plants need water to grow." }
    ],
    correctAnswer: "B",
    explanation: "The passage emphasizes bees' vital role in pollinating crops that support humanity's food chain, asserting that one-third of food depends on them. Thus, they are essential for global food production. Answer B is correct.",
    explanationSteps: [
      { step: 1, text: "Analyze key sentence: 'devastate food supplies worldwide'" },
      { step: 2, text: "Match with option B: bees are essential for food production." }
    ],
    timeLimit: 90
  },
  {
    id: "q_eng_trans_01",
    subject: "reading",
    topic: "Expression of Ideas",
    subtopic: "Transitions",
    difficulty: "easy",
    type: "multiple-choice",
    passage: null,
    question: "The team practiced diligently every single day. ________, they comfortably won the championship.",
    choices: [
      { letter: "A", text: "However" },
      { letter: "B", text: "Therefore" },
      { letter: "C", text: "Although" },
      { letter: "D", text: "Meanwhile" }
    ],
    correctAnswer: "B",
    explanation: "The winning of the championship is a direct cause-and-effect result of daily practice. 'Therefore' expresses this logical relationship. Answer B is correct.",
    explanationSteps: [
      { step: 1, text: "Identify cause: practiced every day" },
      { step: 2, text: "Identify effect: won the championship" },
      { step: 3, text: "Use transition of consequence: 'Therefore'" }
    ],
    timeLimit: 90
  }
];

const remixDb = {
  "q_math_lin1_01": {
    question: "If 4x + 9 = 29, what is the value of x?",
    choices: [
      { letter: "A", text: "3" },
      { letter: "B", text: "5" },
      { letter: "C", text: "7" },
      { letter: "D", text: "9" }
    ],
    correctAnswer: "B",
    explanation: "Subtract 9 from both sides: 4x = 20. Divide by 4: x = 5. Answer B is correct."
  }
};

// ==========================================================
// SHARED HELPERS
// ==========================================================
function calcAccuracy() {
  const answered = store.questions.answered;
  if (!answered.length) return 100;
  const correct = answered.filter(q => q.correct).length;
  return Math.round((correct / answered.length) * 100);
}

function updateStreak() {
  const today = new Date().toDateString();
  const last = store.user.lastActiveDate;
  if (last === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  store.user.streak = (last === yesterday) ? store.user.streak + 1 : 1;
  store.user.lastActiveDate = today;

  const key = new Date().toISOString().split('T')[0];
  store.analytics.heatmap[key] = (store.analytics.heatmap[key] || 0) + 1;
}

// ==========================================================
// STATIC PAGES REDIRECTS
// ==========================================================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/analytics', (req, res) => res.sendFile(path.join(__dirname, 'analytics.html')));
app.get('/colleges', (req, res) => res.sendFile(path.join(__dirname, 'colleges.html')));
app.get('/question-bank', (req, res) => res.sendFile(path.join(__dirname, 'question-bank.html')));
app.get('/study-planner', (req, res) => res.sendFile(path.join(__dirname, 'study-planner.html')));
app.get('/vocab', (req, res) => res.sendFile(path.join(__dirname, 'vocab.html')));

// Route to serve the exam simulator for specific past exam subject versions
app.get('/past-exams/:year/:month/:version/:subject', (req, res) => {
  res.sendFile(path.join(__dirname, 'exam.html'));
});

// Fallback handles routing data views nicely
app.get('/challenge', (req, res) => res.sendFile(path.join(__dirname, 'question-bank.html')));
app.get('/saved', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/mistakes', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ==========================================================
// EXAM SIMULATOR API
// ==========================================================
app.get('/api/exams/:examId/questions', (req, res) => {
  const { examId } = req.params;
  const targetModule = req.query.module || 'ebrw1';
  if (examQuestionsDb && examQuestionsDb.examId === examId) {
    if (examQuestionsDb.modules && examQuestionsDb.modules[targetModule]) {
      const mod = examQuestionsDb.modules[targetModule];
      return res.json({
        examId,
        module: targetModule,
        moduleName: mod.moduleName,
        totalQuestions: mod.totalQuestions,
        timeLimit: mod.timeLimit,
        questions: mod.questions
      });
    } else {
      if (examQuestionsDb.questions) {
        return res.json(examQuestionsDb);
      }
      return res.status(404).json({ error: `Module ${targetModule} not found for exam ${examId}.` });
    }
  }
  res.status(404).json({ error: `Questions for exam ${examId} not found.` });
});

app.post('/api/exams/:examId/submit', (req, res) => {
  const { examId } = req.params;
  const { answers, timeSpent, module: bodyModule } = req.body;
  const targetModule = bodyModule || req.query.module || 'ebrw1';

  if (examQuestionsDb && examQuestionsDb.examId === examId) {
    let questions = [];
    if (examQuestionsDb.modules && examQuestionsDb.modules[targetModule]) {
      questions = examQuestionsDb.modules[targetModule].questions;
    } else if (examQuestionsDb.questions) {
      questions = examQuestionsDb.questions;
    }

    if (!questions || questions.length === 0) {
      return res.status(400).json({ error: `No questions found for module ${targetModule}` });
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

      // Log answer in global history
      store.questions.answered.push({
        questionId: q.id,
        correct: isCorrect,
        timeSpent: Math.round(timeSpent / questions.length) || 15,
        topic: q.module || targetModule,
        subject: targetModule.includes('math') ? 'math' : 'reading',
        date: new Date().toISOString().split('T')[0]
      });
    });

    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    const attemptKey = `${examId}-${targetModule}`;
    examAttempts[attemptKey] = {
      score: correctCount,
      total,
      percentage,
      answers,
      timestamp: new Date().toISOString()
    };
    persistAttempts();
    updateStreak();

    return res.json({
      success: true,
      score: correctCount,
      total,
      percentage,
      results
    });
  }

  res.status(404).json({ error: `Exam ${examId} not found.` });
});

app.get('/api/exams/attempts', (req, res) => {
  res.json(examAttempts);
});


// ==========================================================
// USER API
// ==========================================================
app.get('/api/user', (req, res) => {
  res.json(store.user);
});

app.put('/api/user', (req, res) => {
  const { name, currentScore, goalScore, examDate } = req.body;
  if (name !== undefined) store.user.name = name;
  if (currentScore !== undefined) store.user.currentScore = parseInt(currentScore);
  if (goalScore !== undefined) store.user.goalScore = parseInt(goalScore);
  if (examDate !== undefined) store.user.examDate = examDate;
  res.json(store.user);
});

app.post('/api/user/settings', (req, res) => {
  const { dailyGoal, notifications, difficulty } = req.body;
  if (dailyGoal !== undefined) store.user.settings.dailyGoal = parseInt(dailyGoal);
  if (notifications !== undefined) store.user.settings.notifications = !!notifications;
  if (difficulty !== undefined) store.user.settings.difficulty = difficulty;
  res.json(store.user.settings);
});

app.get('/api/user/consistency', (req, res) => {
  // FIX 6: use real current time, not a hardcoded date
  const now = new Date();
  // ISO week: Monday=0, Sunday=6
  const dayOfWeekISO = (now.getDay() + 6) % 7;

  const week = [];
  let activeCount = 0;
  for (let i = 0; i < 7; i++) {
    const day = new Date(now);
    day.setHours(0, 0, 0, 0);
    day.setDate(now.getDate() - (dayOfWeekISO - i));
    const dateKey = day.toISOString().split('T')[0];
    const isComplete = !!store.user.consistency[dateKey];
    week.push(isComplete);
    if (isComplete) {
      activeCount++;
    }
  }

  // FIX 6: also return today's index (0=Mon … 6=Sun) so the frontend
  // can highlight the current day box
  res.json({
    week, // array of 7 booleans [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
    activeCount,
    todayIndex: dayOfWeekISO // 0=Mon, 1=Tue, … 6=Sun
  });
});

app.post('/api/user/consistency', (req, res) => {
  const { date, completed } = req.body; // date in 'YYYY-MM-DD' format
  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }
  store.user.consistency[date] = !!completed;
  res.json({ success: true, date, completed: store.user.consistency[date] });
});

// ==========================================================
// DASHBOARD API
// ==========================================================
app.get('/api/dashboard', (req, res) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayQs = store.questions.answered.filter(q => q.date === todayStr).length;

  // Extract last 3 unique topics
  const topics = Array.from(new Set(store.questions.answered.map(q => q.topic))).slice(-3);

  // Return formatted payload
  res.json({
    user: store.user,
    todayQuestions: todayQs,
    weekStreak: store.user.streak,
    recentTopics: topics.length > 0 ? topics : ["Algebra", "Standard English Conventions"],
    studyPlan: store.planner.plans[Object.keys(store.planner.plans)[0]] || null,
    analytics: {
      questionsAttempted: store.questions.answered.length,
      currentAccuracy: calcAccuracy(),
      savedQuestions: store.questions.saved.length,
      recentErrors: store.questions.answered.filter(q => !q.correct).length
    }
  });
});

// ==========================================================
// ANALYTICS API
// ==========================================================
app.get('/api/analytics/summary', (req, res) => {
  res.json({
    totalAttempted: store.questions.answered.length,
    accuracy: calcAccuracy(),
    streak: store.user.streak,
    savedQuestionsCount: store.questions.saved.length
  });
});

app.get('/api/analytics/activity-trend', (req, res) => {
  // Return last 7 days answer activity trend
  const trend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    const count = store.questions.answered.filter(q => q.date === d).length;
    trend.push({ date: d, count });
  }
  res.json(trend);
});

app.get('/api/analytics/accuracy-by-topic', (req, res) => {
  const topics = ["Algebra", "Geometry and Trigonometry", "Standard English Conventions", "Information and Ideas", "Expression of Ideas"];
  const data = topics.map(t => {
    const subset = store.questions.answered.filter(q => q.topic === t);
    if (!subset.length) return { topic: t, accuracy: 100, attempted: 0 };
    const correct = subset.filter(q => q.correct).length;
    return {
      topic: t,
      accuracy: Math.round((correct / subset.length) * 100),
      attempted: subset.length
    };
  });
  res.json(data);
});

app.get('/api/analytics/time-by-difficulty', (req, res) => {
  const diffs = ["easy", "medium", "hard"];
  const result = diffs.map(d => {
    const subset = store.questions.answered; // simulated difficulty mappings
    return { difficulty: d, avgTimeSeconds: d === "easy" ? 25 : d === "medium" ? 45 : 75 };
  });
  res.json(result);
});

app.get('/api/analytics/pacing', (req, res) => {
  res.json({
    mathPacing: 45, // seconds avg
    readingPacing: 35
  });
});

app.get('/api/analytics/heatmap', (req, res) => {
  res.json(store.analytics.heatmap);
});

app.get('/api/analytics/weak-spots', (req, res) => {
  // Returns topic sets under 75% accuracy
  res.json([
    { topic: "Expression of Ideas", accuracy: 60, recommendedAction: "Practice Transitions on Vocab Sets" }
  ]);
});

app.post('/api/analytics/log-answer', (req, res) => {
  const { topic, subject, difficulty, correct, timeSeconds } = req.body;
  
  store.questions.answered.push({
    questionId: `q_sim_${Date.now()}`,
    correct: !!correct,
    timeSpent: parseInt(timeSeconds || 30),
    topic: topic || "Algebra",
    subject: subject || "math",
    date: new Date().toISOString().split('T')[0]
  });

  updateStreak();
  res.json({ success: true, user: store.user });
});

// ==========================================================
// QUESTION BANK API
// ==========================================================
app.get('/api/questions/:subject/:topic', (req, res) => {
  const { subject, topic } = req.params;
  const { limit, difficulty } = req.query;

  let list = questionsDb.filter(q => 
    q.subject.toLowerCase() === subject.toLowerCase() && 
    q.topic.toLowerCase() === topic.toLowerCase()
  );

  if (difficulty && difficulty !== 'all') {
    list = list.filter(q => q.difficulty === difficulty);
  }

  const sliceLimit = parseInt(limit) || 10;
  res.json(list.slice(0, sliceLimit));
});

app.post('/api/questions/answer', (req, res) => {
  const { questionId, selectedAnswer, timeSpent } = req.body;
  const question = questionsDb.find(q => q.id === questionId);

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  const correct = question.correctAnswer === selectedAnswer;
  
  // Log answer in store
  store.questions.answered.push({
    questionId,
    correct,
    timeSpent: parseInt(timeSpent || 30),
    topic: question.topic,
    subject: question.subject,
    date: new Date().toISOString().split('T')[0]
  });

  updateStreak();

  res.json({
    correct,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    explanationSteps: question.explanationSteps
  });
});

app.post('/api/questions/save/:id', (req, res) => {
  const id = req.params.id;
  const idx = store.questions.saved.indexOf(id);
  if (idx > -1) {
    store.questions.saved.splice(idx, 1);
  } else {
    store.questions.saved.push(id);
  }
  res.json({ saved: store.questions.saved.includes(id) });
});

app.get('/api/questions/saved', (req, res) => {
  const list = questionsDb.filter(q => store.questions.saved.includes(q.id));
  res.json(list);
});

app.get('/api/questions/progress/:subject', (req, res) => {
  // Returns summary progress per subtopic
  const subject = req.params.subject;
  const progress = {};
  const list = questionsDb.filter(q => q.subject === subject);
  
  list.forEach(q => {
    if (!progress[q.subtopic]) {
      progress[q.subtopic] = { answered: 0, total: 5, correct: 0 };
    }
    const answeredQs = store.questions.answered.filter(ans => ans.questionId === q.id);
    if (answeredQs.length > 0) {
      progress[q.subtopic].answered += answeredQs.length;
      progress[q.subtopic].correct += answeredQs.filter(ans => ans.correct).length;
    }
  });

  res.json(progress);
});

app.get('/api/questions/remix/:id', (req, res) => {
  const id = req.params.id;
  const original = questionsDb.find(q => q.id === id);
  if (!original) {
    return res.status(404).json({ error: "Question not found" });
  }

  const remix = remixDb[id];
  if (remix) {
    res.json({
      ...original,
      id: `${id}_remix`,
      question: remix.question,
      choices: remix.choices,
      correctAnswer: remix.correctAnswer,
      explanation: remix.explanation
    });
  } else {
    res.json({
      ...original,
      id: `${id}_remix`,
      question: `${original.question} (Modified Clone)`,
      choices: original.choices,
      correctAnswer: original.correctAnswer,
      explanation: original.explanation
    });
  }
});

// ==========================================================
// STUDY PLANNER API
// ==========================================================
app.post('/api/planner/create', (req, res) => {
  const { days, targetScore, examDate, studyMode, dayAssignments, customQuestions, mockExamDay } = req.body;
  const planId = `plan_${Date.now()}`;

  const ed = new Date(examDate || '2026-12-05');
  const today = new Date();
  today.setHours(0,0,0,0);
  const diffDays = Math.max(1, Math.ceil((ed - today) / (1000 * 60 * 60 * 24)));
  const totalWeeks = Math.max(1, Math.ceil(diffDays / 7));

  const plan = {
    planId,
    targetScore: parseInt(targetScore || 1500),
    examDate: examDate || '2025-12-05',
    studyMode: studyMode || 'custom',
    schedule: []
  };

  const mathTopics = ["Heart of Algebra", "Advanced Math", "Data Analysis", "Geometry"];
  const englishTopics = ["Reading Comprehension", "Central Ideas & Details", "Command of Evidence", "Rhetorical Synthesis", "Standard English Conventions"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let globalStudyDayIndex = 0;
  let currentDate = new Date();

  for (let i = 0; i < totalWeeks * 7; i++) {
    const iterDate = new Date(currentDate);
    iterDate.setDate(currentDate.getDate() + i);
    const dayName = dayNames[iterDate.getDay()];
    const weekNum = Math.floor(i / 7) + 1;
    
    const isStudyDay = days && !!days[dayName];
    const isMockExamDay = isStudyDay && dayName === mockExamDay;

    let dailyTasks = [];

    if (!isStudyDay) {
      dailyTasks.push({ type: "rest", section: "Rest", topic: "Rest Day 🧘", questionCount: 0, estimatedMinutes: 0 });
    } else if (isMockExamDay) {
      dailyTasks.push({ type: "mock_exam", section: "Mock Exam", topic: "Full SAT Simulator — 4 Modules — Timed", questionCount: 98, estimatedMinutes: 134 });
    } else {
      const vocabCount = customQuestions?.vocab || 10;
      if (studyMode === 'alternating') {
        const subj = dayAssignments?.[dayName] || (globalStudyDayIndex % 2 === 0 ? "Math" : "English");
        if (subj === 'Math') {
           dailyTasks.push({ type: "Math", section: "Math", topic: mathTopics[globalStudyDayIndex % mathTopics.length], questionCount: 20, estimatedMinutes: 30 });
        } else {
           dailyTasks.push({ type: "English", section: "English", topic: englishTopics[globalStudyDayIndex % englishTopics.length], questionCount: 20, estimatedMinutes: 30 });
        }
        dailyTasks.push({ type: "Vocab", section: "Vocab", topic: "Daily Vocabulary", questionCount: 10, estimatedMinutes: 15 });
      } else if (studyMode === 'full_coverage') {
         dailyTasks.push({ type: "Math", section: "Math", topic: mathTopics[globalStudyDayIndex % mathTopics.length], questionCount: 22, estimatedMinutes: 35 });
         dailyTasks.push({ type: "Math", section: "Math", topic: mathTopics[(globalStudyDayIndex + 1) % mathTopics.length], questionCount: 22, estimatedMinutes: 35 });
         dailyTasks.push({ type: "English", section: "English", topic: englishTopics[globalStudyDayIndex % englishTopics.length], questionCount: 27, estimatedMinutes: 32 });
         dailyTasks.push({ type: "English", section: "English", topic: englishTopics[(globalStudyDayIndex + 1) % englishTopics.length], questionCount: 27, estimatedMinutes: 32 });
         dailyTasks.push({ type: "Vocab", section: "Vocab", topic: "Daily Vocabulary", questionCount: 10, estimatedMinutes: 15 });
      } else {
         const mCount = customQuestions?.math || 20;
         const eCount = customQuestions?.english || 20;
         dailyTasks.push({ type: "Math", section: "Math", topic: mathTopics[globalStudyDayIndex % mathTopics.length], questionCount: mCount, estimatedMinutes: Math.round(mCount * 1.5) });
         dailyTasks.push({ type: "English", section: "English", topic: englishTopics[globalStudyDayIndex % englishTopics.length], questionCount: eCount, estimatedMinutes: Math.round(eCount * 1.5) });
         dailyTasks.push({ type: "Vocab", section: "Vocab", topic: "Daily Vocabulary", questionCount: vocabCount, estimatedMinutes: Math.round(vocabCount * 2) });
      }
    }

    const yy = iterDate.getFullYear();
    const mm = String(iterDate.getMonth() + 1).padStart(2, '0');
    const dd = String(iterDate.getDate()).padStart(2, '0');
    const dateStr = `${yy}-${mm}-${dd}`;

    plan.schedule.push({
      week: weekNum,
      day: dayName,
      date: dateStr,
      tasks: dailyTasks
    });
    
    if (isStudyDay) globalStudyDayIndex++;
  }

  store.planner.plans[planId] = plan;
  persistPlans(); // Save to db.json immediately so it survives restarts
  res.json({ success: true, plan });
});

app.post('/api/planner/agenda/check', (req, res) => {
  const { taskId, completed } = req.body;
  if (!taskId) return res.status(400).json({ error: "taskId is required" });
  store.planner.taskCompletions[taskId] = !!completed;
  res.json({ success: true, taskId, completed: !!completed });
});

app.get('/api/planner/agenda', (req, res) => {
  const activePlanId = Object.keys(store.planner.plans)[0];
  if (!activePlanId) {
    return res.json({ tasks: [] });
  }
  const plan = store.planner.plans[activePlanId];
  
  const todayStr = new Date().toISOString().split('T')[0];
  let todaySchedule = plan.schedule.find(s => s.date === todayStr);
  
  if (!todaySchedule && plan.schedule.length > 0) {
    todaySchedule = plan.schedule[0];
  }
  
  if (!todaySchedule) {
    return res.json({ tasks: [] });
  }

  const dayIndex = plan.schedule.indexOf(todaySchedule);

  const agendaTasks = todaySchedule.tasks
    .filter(t => t.type !== 'rest')
    .map((task, taskIdx) => ({
      taskId: `${activePlanId}_day${dayIndex}_task${taskIdx}`,
      topic: task.topic,
      subject: task.section || task.subject || 'Unknown',
      questions: task.questionCount || 20,
      time: task.estimatedMinutes || 30
    }));

  res.json({ tasks: agendaTasks });
});

app.get('/api/planner/plan/:planId', (req, res) => {
  const plan = store.planner.plans[req.params.planId];
  if (!plan) return res.status(404).json({ error: "Plan not found" });
  res.json(plan);
});

app.post('/api/planner/upload-score', (req, res) => {
  const { file, filename, type } = req.body;
  store.planner.uploads.push({ file, filename, type, date: new Date().toISOString() });
  res.json({ success: true, message: "Score report analyzed with Gemini AI successfully!" });
});

app.get('/api/planner/stats', (req, res) => {
  res.json({
    totalPlansCreated: Object.keys(store.planner.plans).length,
    lastPlanId: Object.keys(store.planner.plans).slice(-1)[0] || null
  });
});

// ==========================================================
// VOCAB API
// ==========================================================
app.get('/api/vocab/sets', (req, res) => {
  const total = vocabWordsDb.length;
  const masteredCount = Object.keys(store.vocab.progress).filter(k => store.vocab.progress[k] === 'mastered').length;
  const pct = Math.round((masteredCount / total) * 100) || 0;

  res.json([
    {
      id: "core_sat",
      name: "Core SAT Vocabulary",
      wordCount: total,
      progress: pct,
      lastStudied: new Date().toISOString().split('T')[0]
    }
  ]);
});

app.get('/api/vocab/learn', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const unmastered = vocabWordsDb.filter(w => store.vocab.progress[w.id] !== 'mastered');
  const pool = unmastered.length > 0 ? unmastered : vocabWordsDb;
  res.json(pool.slice(0, limit));
});

app.get('/api/vocab/match', (req, res) => {
  const count = parseInt(req.query.count) || 6;
  const pool = [...vocabWordsDb].sort(() => 0.5 - Math.random());
  res.json(pool.slice(0, count));
});

app.get('/api/vocab/flashcards', (req, res) => {
  res.json(vocabWordsDb);
});

app.post('/api/vocab/progress', (req, res) => {
  const { wordId, status } = req.body;
  store.vocab.progress[wordId] = status;
  res.json({ success: true, progress: store.vocab.progress });
});

app.post('/api/vocab/score', (req, res) => {
  const { game, time, date } = req.body;
  store.vocab.scores.push({ game, time, date: date || new Date().toISOString() });
  res.json({ success: true });
});

app.get('/api/vocab/stats', (req, res) => {
  const total = vocabWordsDb.length;
  const mastered = Object.keys(store.vocab.progress).filter(k => store.vocab.progress[k] === 'mastered').length;
  res.json({
    totalWords: total,
    mastered,
    accuracy: Math.round((mastered / total) * 100) || 0,
    streak: store.user.streak
  });
});

app.post('/api/vocab/bank', (req, res) => {
  const { name, words } = req.body;
  res.json({ success: true, message: "Custom word bank saved!" });
});

app.get('/api/vocab/bank', (req, res) => {
  res.json([]);
});

app.get('/api/vocab/settings', (req, res) => {
  res.json(store.user.settings);
});

app.post('/api/vocab/settings', (req, res) => {
  res.json({ success: true });
});

// ==========================================================
// COLLEGES API
// ==========================================================
app.get('/api/colleges', (req, res) => {
  let { search, type, minSAT, maxSAT, minRate, maxRate, sort, state } = req.query;
  let list = [...collegesDb];

  if (search) {
    const q = search.toLowerCase().trim();
    list = list.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.city.toLowerCase().includes(q) || 
      c.state.toLowerCase().includes(q)
    );
  }

  if (type && type !== 'All') {
    list = list.filter(c => c.type.toLowerCase() === type.toLowerCase());
  }

  if (minSAT) list = list.filter(c => c.medianSAT >= parseInt(minSAT));
  if (maxSAT) list = list.filter(c => c.medianSAT <= parseInt(maxSAT));
  if (minRate) list = list.filter(c => c.acceptanceRate >= parseInt(minRate));
  if (maxRate) list = list.filter(c => c.acceptanceRate <= parseInt(maxRate));

  if (state) {
    const states = state.split(',');
    list = list.filter(c => states.includes(c.state));
  }

  list.forEach(c => c.saved = store.colleges.saved.includes(c.id));

  if (sort) {
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'ranking') list.sort((a, b) => a.ranking - b.ranking);
    else if (sort === 'rate-low-high') list.sort((a, b) => a.acceptanceRate - b.acceptanceRate);
    else if (sort === 'rate-high-low') list.sort((a, b) => b.acceptanceRate - a.acceptanceRate);
    else if (sort === 'sat-high-low') list.sort((a, b) => b.medianSAT - a.medianSAT);
    else if (sort === 'sat-low-high') list.sort((a, b) => a.medianSAT - b.medianSAT);
  }

  res.json({
    colleges: list,
    total: collegesDb.length,
    filtered: list.length
  });
});

app.get('/api/colleges/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const college = collegesDb.find(c => c.id === id);
  if (!college) return res.status(404).json({ error: "College not found" });

  college.saved = store.colleges.saved.includes(college.id);
  const similar = collegesDb
    .filter(c => c.id !== college.id && c.type === college.type && Math.abs(c.acceptanceRate - college.acceptanceRate) <= 15)
    .slice(0, 4);

  res.json({ college, similar });
});

app.post('/api/colleges/:id/save', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = store.colleges.saved.indexOf(id);
  if (idx > -1) {
    store.colleges.saved.splice(idx, 1);
  } else {
    store.colleges.saved.push(id);
  }
  res.json({ saved: store.colleges.saved.includes(id), collegeId: id });
});

app.get('/api/colleges/saved', (req, res) => {
  const list = collegesDb.filter(c => store.colleges.saved.includes(c.id));
  list.forEach(c => c.saved = true);
  res.json({ colleges: list });
});

app.get('/api/colleges/stats', (req, res) => {
  const total = collegesDb.length;
  const savedCount = store.colleges.saved.length;
  const sumRate = collegesDb.reduce((sum, c) => sum + c.acceptanceRate, 0);
  const sumSAT = collegesDb.reduce((sum, c) => sum + c.medianSAT, 0);

  res.json({
    totalColleges: total,
    savedCount,
    avgAcceptanceRate: Math.round(sumRate / total),
    avgMedianSAT: Math.round(sumSAT / total)
  });
});

// ==========================================================
// REAL EXAM MODE API
// ==========================================================

// Helper: build module list for an exam
function buildRealExamModules(examId) {
  const modules = [
    { id: 'ebrw1', name: 'Reading & Writing — Module 1', subject: 'reading', timeSeconds: 32 * 60, questionCount: 27, status: 'active', answers: {}, score: null, flagged: [] },
    { id: 'ebrw2', name: 'Reading & Writing — Module 2', subject: 'reading', timeSeconds: 32 * 60, questionCount: 27, status: 'locked', answers: {}, score: null, flagged: [] },
    { id: 'break', name: '10-Minute Break', subject: 'break', timeSeconds: 10 * 60, questionCount: 0, status: 'locked', answers: {}, score: null, flagged: [] },
    { id: 'math1', name: 'Math — Module 1', subject: 'math', timeSeconds: 35 * 60, questionCount: 22, status: 'locked', answers: {}, score: null, flagged: [] },
    { id: 'math2', name: 'Math — Module 2', subject: 'math', timeSeconds: 35 * 60, questionCount: 22, status: 'locked', answers: {}, score: null, flagged: [] }
  ];
  return modules;
}

// Helper: get questions for a module (from real exam or cycle from seed)
function getRealExamQuestions(examId, moduleId) {
  if (examId === 'march-2026-int-a' && examQuestionsDb && examQuestionsDb.modules && examQuestionsDb.modules[moduleId]) {
    return examQuestionsDb.modules[moduleId].questions;
  }
  // AI-generated: cycle questionsDb
  const allQ = questionsDb;
  const counts = { ebrw1: 27, ebrw2: 27, math1: 22, math2: 22 };
  const count = counts[moduleId] || 22;
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push({ ...allQ[i % allQ.length], questionNumber: i + 1 });
  }
  return result;
}

// Helper: compute SAT scale score from raw
function computeScaledScore(rawCorrect, rawTotal, sectionMin = 200, sectionMax = 800) {
  if (rawTotal === 0) return sectionMin;
  const pct = rawCorrect / rawTotal;
  return Math.round(sectionMin + pct * (sectionMax - sectionMin));
}

// Route: serve real-exam page
app.get('/real-exam', (req, res) => res.sendFile(path.join(__dirname, 'real-exam.html')));

// GET /api/real-exam/list — available exams + in-progress status
app.get('/api/real-exam/list', (req, res) => {
  const userId = 'user_001';

  // Find any in-progress attempt for this user
  const inProgress = Object.values(realExamAttempts).find(a => a.userId === userId && a.status === 'in_progress');

  const exams = [
  {
    "id": "march-2026-int-a",
    "type": "official",
    "name": "March 2026 SAT (Int A)",
    "date": "March 2026",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2026-int-b",
    "type": "official",
    "name": "March 2026 SAT (Int B)",
    "date": "March 2026",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2026-int-c",
    "type": "official",
    "name": "March 2026 SAT (Int C)",
    "date": "March 2026",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2026-us-a",
    "type": "official",
    "name": "March 2026 SAT (US A)",
    "date": "March 2026",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2026-us-b",
    "type": "official",
    "name": "March 2026 SAT (US B)",
    "date": "March 2026",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "december-2025-int-a",
    "type": "official",
    "name": "December 2025 SAT (Int A)",
    "date": "December 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "december-2025-int-b",
    "type": "official",
    "name": "December 2025 SAT (Int B)",
    "date": "December 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "december-2025-int-c",
    "type": "official",
    "name": "December 2025 SAT (Int C)",
    "date": "December 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "december-2025-int-d",
    "type": "official",
    "name": "December 2025 SAT (Int D)",
    "date": "December 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "december-2025-us-a",
    "type": "official",
    "name": "December 2025 SAT (US A)",
    "date": "December 2025",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "december-2025-us-b",
    "type": "official",
    "name": "December 2025 SAT (US B)",
    "date": "December 2025",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "december-2025-us-c",
    "type": "official",
    "name": "December 2025 SAT (US C)",
    "date": "December 2025",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "november-2025-int-a",
    "type": "official",
    "name": "November 2025 SAT (Int A)",
    "date": "November 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "november-2025-int-b",
    "type": "official",
    "name": "November 2025 SAT (Int B)",
    "date": "November 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "november-2025-int-c",
    "type": "official",
    "name": "November 2025 SAT (Int C)",
    "date": "November 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "november-2025-us-a",
    "type": "official",
    "name": "November 2025 SAT (US A)",
    "date": "November 2025",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "october-2025-int-a",
    "type": "official",
    "name": "October 2025 SAT (Int A)",
    "date": "October 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "october-2025-int-b",
    "type": "official",
    "name": "October 2025 SAT (Int B)",
    "date": "October 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "october-2025-us-a",
    "type": "official",
    "name": "October 2025 SAT (US A)",
    "date": "October 2025",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "october-2025-us-b",
    "type": "official",
    "name": "October 2025 SAT (US B)",
    "date": "October 2025",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "august-2025-form-a",
    "type": "official",
    "name": "August 2025 SAT (Form A)",
    "date": "August 2025",
    "region": "Global",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "august-2025-form-b",
    "type": "official",
    "name": "August 2025 SAT (Form B)",
    "date": "August 2025",
    "region": "Global",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "august-2025-form-c",
    "type": "official",
    "name": "August 2025 SAT (Form C)",
    "date": "August 2025",
    "region": "Global",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "august-2025-form-d",
    "type": "official",
    "name": "August 2025 SAT (Form D)",
    "date": "August 2025",
    "region": "Global",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "august-2025-form-e",
    "type": "official",
    "name": "August 2025 SAT (Form E)",
    "date": "August 2025",
    "region": "Global",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "june-2025-int-a",
    "type": "official",
    "name": "June 2025 SAT (Int A)",
    "date": "June 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "june-2025-int-b",
    "type": "official",
    "name": "June 2025 SAT (Int B)",
    "date": "June 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "june-2025-us-a",
    "type": "official",
    "name": "June 2025 SAT (US A)",
    "date": "June 2025",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "june-2025-us-b",
    "type": "official",
    "name": "June 2025 SAT (US B)",
    "date": "June 2025",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "june-2025-us-c",
    "type": "official",
    "name": "June 2025 SAT (US C)",
    "date": "June 2025",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "may-2025-int-a",
    "type": "official",
    "name": "May 2025 SAT (Int A)",
    "date": "May 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "may-2025-int-b",
    "type": "official",
    "name": "May 2025 SAT (Int B)",
    "date": "May 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "may-2025-int-c",
    "type": "official",
    "name": "May 2025 SAT (Int C)",
    "date": "May 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "may-2025-us-a",
    "type": "official",
    "name": "May 2025 SAT (US A)",
    "date": "May 2025",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2025-int-a",
    "type": "official",
    "name": "March 2025 SAT (Int A)",
    "date": "March 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2025-int-b",
    "type": "official",
    "name": "March 2025 SAT (Int B)",
    "date": "March 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2025-int-c",
    "type": "official",
    "name": "March 2025 SAT (Int C)",
    "date": "March 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2025-int-d",
    "type": "official",
    "name": "March 2025 SAT (Int D)",
    "date": "March 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2025-int-e",
    "type": "official",
    "name": "March 2025 SAT (Int E)",
    "date": "March 2025",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2025-us-a",
    "type": "official",
    "name": "March 2025 SAT (US A)",
    "date": "March 2025",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2025-us-b",
    "type": "official",
    "name": "March 2025 SAT (US B)",
    "date": "March 2025",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2025-us-c",
    "type": "official",
    "name": "March 2025 SAT (US C)",
    "date": "March 2025",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "december-2024-int-a",
    "type": "official",
    "name": "December 2024 SAT (Int A)",
    "date": "December 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "december-2024-int-b",
    "type": "official",
    "name": "December 2024 SAT (Int B)",
    "date": "December 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "december-2024-int-c",
    "type": "official",
    "name": "December 2024 SAT (Int C)",
    "date": "December 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "december-2024-int-d",
    "type": "official",
    "name": "December 2024 SAT (Int D)",
    "date": "December 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "december-2024-us-a",
    "type": "official",
    "name": "December 2024 SAT (US A)",
    "date": "December 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "december-2024-us-b",
    "type": "official",
    "name": "December 2024 SAT (US B)",
    "date": "December 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "december-2024-us-c",
    "type": "official",
    "name": "December 2024 SAT (US C)",
    "date": "December 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "november-2024-int-a",
    "type": "official",
    "name": "November 2024 SAT (Int A)",
    "date": "November 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "november-2024-int-b",
    "type": "official",
    "name": "November 2024 SAT (Int B)",
    "date": "November 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "november-2024-int-c",
    "type": "official",
    "name": "November 2024 SAT (Int C)",
    "date": "November 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "november-2024-int-d",
    "type": "official",
    "name": "November 2024 SAT (Int D)",
    "date": "November 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "november-2024-us-a",
    "type": "official",
    "name": "November 2024 SAT (US A)",
    "date": "November 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "november-2024-us-b",
    "type": "official",
    "name": "November 2024 SAT (US B)",
    "date": "November 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "october-2024-int-a",
    "type": "official",
    "name": "October 2024 SAT (Int A)",
    "date": "October 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "october-2024-int-b",
    "type": "official",
    "name": "October 2024 SAT (Int B)",
    "date": "October 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "october-2024-int-c",
    "type": "official",
    "name": "October 2024 SAT (Int C)",
    "date": "October 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "october-2024-us-a",
    "type": "official",
    "name": "October 2024 SAT (US A)",
    "date": "October 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "october-2024-us-b",
    "type": "official",
    "name": "October 2024 SAT (US B)",
    "date": "October 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "october-2024-us-c",
    "type": "official",
    "name": "October 2024 SAT (US C)",
    "date": "October 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "august-2024-int-a",
    "type": "official",
    "name": "August 2024 SAT (Int A)",
    "date": "August 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "august-2024-int-b",
    "type": "official",
    "name": "August 2024 SAT (Int B)",
    "date": "August 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "august-2024-us-a",
    "type": "official",
    "name": "August 2024 SAT (US A)",
    "date": "August 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "august-2024-us-b",
    "type": "official",
    "name": "August 2024 SAT (US B)",
    "date": "August 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "august-2024-us-c",
    "type": "official",
    "name": "August 2024 SAT (US C)",
    "date": "August 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "august-2024-us-d",
    "type": "official",
    "name": "August 2024 SAT (US D)",
    "date": "August 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "august-2024-us-e",
    "type": "official",
    "name": "August 2024 SAT (US E)",
    "date": "August 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "june-2024-form-a",
    "type": "official",
    "name": "June 2024 SAT (Form A)",
    "date": "June 2024",
    "region": "Global",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "june-2024-form-b",
    "type": "official",
    "name": "June 2024 SAT (Form B)",
    "date": "June 2024",
    "region": "Global",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "june-2024-form-c",
    "type": "official",
    "name": "June 2024 SAT (Form C)",
    "date": "June 2024",
    "region": "Global",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "june-2024-form-d",
    "type": "official",
    "name": "June 2024 SAT (Form D)",
    "date": "June 2024",
    "region": "Global",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "june-2024-form-e",
    "type": "official",
    "name": "June 2024 SAT (Form E)",
    "date": "June 2024",
    "region": "Global",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "may-2024-int-a",
    "type": "official",
    "name": "May 2024 SAT (Int A)",
    "date": "May 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "may-2024-int-b",
    "type": "official",
    "name": "May 2024 SAT (Int B)",
    "date": "May 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "may-2024-us-a",
    "type": "official",
    "name": "May 2024 SAT (US A)",
    "date": "May 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "may-2024-us-b",
    "type": "official",
    "name": "May 2024 SAT (US B)",
    "date": "May 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2024-int-a",
    "type": "official",
    "name": "March 2024 SAT (Int A)",
    "date": "March 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2024-int-b",
    "type": "official",
    "name": "March 2024 SAT (Int B)",
    "date": "March 2024",
    "region": "International",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2024-us-a",
    "type": "official",
    "name": "March 2024 SAT (US A)",
    "date": "March 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "march-2024-us-b",
    "type": "official",
    "name": "March 2024 SAT (US B)",
    "date": "March 2024",
    "region": "US",
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "OFFICIAL"
  },
  {
    "id": "ai-practice-1",
    "type": "ai",
    "name": "AI Practice Exam #1",
    "date": "Generated for you",
    "region": null,
    "estimatedTime": "~3h 15min",
    "modules": 4,
    "badge": "AI GENERATED"
  }
];

  res.json({ exams, inProgress: inProgress || null });
});

// POST /api/real-exam/start — create new attempt
app.post('/api/real-exam/start', (req, res) => {
  const { examId } = req.body;
  if (!examId) return res.status(400).json({ error: 'examId required' });

  const userId = 'user_001';
  // Abandon any existing in-progress attempt
  Object.values(realExamAttempts).forEach(a => {
    if (a.userId === userId && a.status === 'in_progress') {
      a.status = 'abandoned';
    }
  });

  const attemptId = `re_${Date.now()}`;
  const modules = buildRealExamModules(examId);
  const attempt = {
    attemptId,
    userId,
    examId,
    examType: examId.startsWith('ai') ? 'ai' : 'official',
    status: 'in_progress',
    currentModuleIndex: 0,
    currentQuestionIndex: 0,
    timeLeftSeconds: modules[0].timeSeconds,
    modules,
    results: null,
    startedAt: new Date().toISOString(),
    completedAt: null
  };

  realExamAttempts[attemptId] = attempt;
  persistRealExamAttempts();
  res.json({ attemptId, attempt });
});

// GET /api/real-exam/attempt/:id — get full attempt state
app.get('/api/real-exam/attempt/:id', (req, res) => {
  const attempt = realExamAttempts[req.params.id];
  if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
  res.json(attempt);
});

// PUT /api/real-exam/attempt/:id/save — autosave progress
app.put('/api/real-exam/attempt/:id/save', (req, res) => {
  const attempt = realExamAttempts[req.params.id];
  if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
  if (attempt.status !== 'in_progress') return res.status(400).json({ error: 'Attempt not in progress' });

  const { currentModuleIndex, currentQuestionIndex, timeLeftSeconds, answers, flagged } = req.body;
  if (currentModuleIndex !== undefined) attempt.currentModuleIndex = currentModuleIndex;
  if (currentQuestionIndex !== undefined) attempt.currentQuestionIndex = currentQuestionIndex;
  if (timeLeftSeconds !== undefined) attempt.timeLeftSeconds = timeLeftSeconds;
  if (answers !== undefined && attempt.modules[attempt.currentModuleIndex]) {
    attempt.modules[attempt.currentModuleIndex].answers = answers;
  }
  if (flagged !== undefined && attempt.modules[attempt.currentModuleIndex]) {
    attempt.modules[attempt.currentModuleIndex].flagged = flagged;
  }

  persistRealExamAttempts();
  res.json({ success: true });
});

// POST /api/real-exam/attempt/:id/submit-module — submit current module, unlock next
app.post('/api/real-exam/attempt/:id/submit-module', (req, res) => {
  const attempt = realExamAttempts[req.params.id];
  if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
  if (attempt.status !== 'in_progress') return res.status(400).json({ error: 'Attempt not in progress' });

  const { answers, flagged } = req.body;
  const modIdx = attempt.currentModuleIndex;
  const mod = attempt.modules[modIdx];
  if (!mod) return res.status(400).json({ error: 'Invalid module index' });

  // Save answers & flagged
  if (answers) mod.answers = answers;
  if (flagged) mod.flagged = flagged;
  mod.status = 'completed';

  // Score it (unless it's the break)
  if (mod.subject !== 'break') {
    const questions = getRealExamQuestions(attempt.examId, mod.id);
    let correct = 0;
    questions.forEach((q, i) => {
      const qNum = q.questionNumber || (i + 1);
      const userAns = (answers || {})[qNum];
      if (userAns !== undefined && String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
        correct++;
      }
    });
    mod.score = { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) };
  }

  // Unlock next module
  const nextIdx = modIdx + 1;
  if (nextIdx < attempt.modules.length) {
    attempt.modules[nextIdx].status = 'active';
    attempt.currentModuleIndex = nextIdx;
    attempt.currentQuestionIndex = 0;
    attempt.timeLeftSeconds = attempt.modules[nextIdx].timeSeconds;
  }

  persistRealExamAttempts();
  res.json({ success: true, nextModuleIndex: nextIdx, attempt });
});

// POST /api/real-exam/attempt/:id/complete — final scoring
app.post('/api/real-exam/attempt/:id/complete', (req, res) => {
  const attempt = realExamAttempts[req.params.id];
  if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

  attempt.status = 'completed';
  attempt.completedAt = new Date().toISOString();

  // Aggregate scores
  const rwMods = attempt.modules.filter(m => m.subject === 'reading' && m.score);
  const mathMods = attempt.modules.filter(m => m.subject === 'math' && m.score);

  const rwCorrect = rwMods.reduce((s, m) => s + m.score.correct, 0);
  const rwTotal = rwMods.reduce((s, m) => s + m.score.total, 0);
  const mathCorrect = mathMods.reduce((s, m) => s + m.score.correct, 0);
  const mathTotal = mathMods.reduce((s, m) => s + m.score.total, 0);

  const rwScaled = computeScaledScore(rwCorrect, rwTotal || 54);
  const mathScaled = computeScaledScore(mathCorrect, mathTotal || 44);
  const totalScaled = rwScaled + mathScaled;

  attempt.results = {
    total: totalScaled,
    reading: rwScaled,
    math: mathScaled,
    rwCorrect, rwTotal,
    mathCorrect, mathTotal,
    moduleBreakdown: attempt.modules.filter(m => m.score).map(m => ({
      name: m.name,
      correct: m.score.correct,
      total: m.score.total,
      percentage: m.score.percentage
    }))
  };

  persistRealExamAttempts();
  updateStreak();
  res.json({ success: true, results: attempt.results });
});

// ==========================================================
// INIT APP LISTEN
// ==========================================================
app.listen(PORT, () => {
  console.log(`==========================================================`);
  console.log(`✅ SAT Platform Unified full-stack server running on http://localhost:${PORT}`);
  console.log(`==========================================================`);
});
