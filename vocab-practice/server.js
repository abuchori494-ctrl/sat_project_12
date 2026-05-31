const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==========================================================
// SEED DATA (30 HIGH-QUALITY SAT VOCABULARY WORDS)
// ==========================================================
let wordsDb = [
  {
    id: 1,
    word: "Aberrant",
    definition: "Departing from an accepted standard or normal course.",
    example: "The aberrant behavior of the computer program puzzled the developers.",
    difficulty: "hard",
    mastered: false
  },
  {
    id: 2,
    word: "Benevolent",
    definition: "Well meaning and kindly.",
    example: "The benevolent king donated half of his fortune to the poor.",
    difficulty: "easy",
    mastered: false
  },
  {
    id: 3,
    word: "Cacophony",
    definition: "A harsh, discordant mixture of sounds.",
    example: "The cacophony of car horns in New York City kept her awake all night.",
    difficulty: "medium",
    mastered: false
  },
  {
    id: 4,
    word: "Didactic",
    definition: "Intended to teach, particularly in having moral instruction.",
    example: "The classroom was filled with didactic posters explaining algebra rules.",
    difficulty: "hard",
    mastered: false
  },
  {
    id: 5,
    word: "Ephemeral",
    definition: "Lasting for a very short time; transient.",
    example: "Fame in the digital age is often ephemeral, lasting only a few days.",
    difficulty: "medium",
    mastered: false
  },
  {
    id: 6,
    word: "Fallacious",
    definition: "Based on a mistaken belief or unsound argument.",
    example: "The argument was based on fallacious reasoning that ignored the scientific facts.",
    difficulty: "medium",
    mastered: false
  },
  {
    id: 7,
    word: "Garrulous",
    definition: "Excessively talkative, especially on trivial matters.",
    example: "The garrulous passenger kept talking about his cat for three hours.",
    difficulty: "hard",
    mastered: false
  },
  {
    id: 8,
    word: "Hegemony",
    definition: "Leadership or dominance, especially by one country or group.",
    example: "The empire struggled to maintain its political hegemony over the surrounding states.",
    difficulty: "hard",
    mastered: false
  },
  {
    id: 9,
    word: "Iconoclast",
    definition: "A person who attacks cherished beliefs or institutions.",
    example: "The young filmmaker was hailed as an iconoclast who challenged Hollywood conventions.",
    difficulty: "hard",
    mastered: false
  },
  {
    id: 10,
    word: "Juxtapose",
    definition: "Place or deal with close together for contrasting effect.",
    example: "The gallery exhibition juxtaposed classic renaissance paintings with modern street art.",
    difficulty: "medium",
    mastered: false
  },
  {
    id: 11,
    word: "Kinetic",
    definition: "Relating to or resulting from motion.",
    example: "The kinetic energy of the roller coaster peaked at the bottom of the track.",
    difficulty: "easy",
    mastered: false
  },
  {
    id: 12,
    word: "Loquacious",
    definition: "Tending to talk a great deal; talkative.",
    example: "The loquacious host made sure that none of the guests felt left out.",
    difficulty: "hard",
    mastered: false
  },
  {
    id: 13,
    word: "Melancholy",
    definition: "A feeling of pensive sadness, typically with no obvious cause.",
    example: "The rainy afternoon filled her with a sense of quiet melancholy.",
    difficulty: "easy",
    mastered: false
  },
  {
    id: 14,
    word: "Nefarious",
    definition: "Wicked, impious, or criminal.",
    example: "The hacker's nefarious plans to steal credit card details were thwarted by security.",
    difficulty: "hard",
    mastered: false
  },
  {
    id: 15,
    word: "Obfuscate",
    definition: "Render obscure, unclear, or unintelligible.",
    example: "The politician tried to obfuscate the real issues with long, winded speeches.",
    difficulty: "hard",
    mastered: false
  },
  {
    id: 16,
    word: "Paradigm",
    definition: "A typical example or pattern of something; a model.",
    example: "The discovery of gravity caused a major paradigm shift in physics.",
    difficulty: "medium",
    mastered: false
  },
  {
    id: 17,
    word: "Querulous",
    definition: "Complaining in a petulant or whining manner.",
    example: "The querulous patient demanded to see the doctor immediately.",
    difficulty: "hard",
    mastered: false
  },
  {
    id: 18,
    word: "Reticent",
    definition: "Not revealing one's thoughts or feelings readily.",
    example: "She was extremely reticent about her personal life during the interview.",
    difficulty: "medium",
    mastered: false
  },
  {
    id: 19,
    word: "Sycophant",
    definition: "A person who acts obsequiously toward someone important in order to gain advantage.",
    example: "The CEO was surrounded by sycophants who agreed with his every word.",
    difficulty: "hard",
    mastered: false
  },
  {
    id: 20,
    word: "Taciturn",
    definition: "Reserved or uncommunicative in speech; saying little.",
    example: "My grandfather was a taciturn man who rarely spoke unless spoken to.",
    difficulty: "hard",
    mastered: false
  },
  {
    id: 21,
    word: "Ubiquitous",
    definition: "Present, appearing, or found everywhere.",
    example: "Smartphones have become ubiquitous in modern society.",
    difficulty: "easy",
    mastered: false
  },
  {
    id: 22,
    word: "Vacuous",
    definition: "Having or showing a lack of thought or intelligence; mindless.",
    example: "The movie was criticized for its vacuous plot and generic dialogue.",
    difficulty: "medium",
    mastered: false
  },
  {
    id: 23,
    word: "Wane",
    definition: "Decrease in vigor, power, or extent; become weaker.",
    example: "Support for the new tax plan began to wane as prices rose.",
    difficulty: "easy",
    mastered: false
  },
  {
    id: 24,
    word: "Xenophobia",
    definition: "Dislike of or prejudice against people from other countries.",
    example: "The local government launched campaigns to combat the rise of xenophobia.",
    difficulty: "medium",
    mastered: false
  },
  {
    id: 25,
    word: "Zealot",
    definition: "A person who is fanatical and uncompromising in pursuit of ideals.",
    example: "The environmental activist was a zealot who refused to accept any compromises.",
    difficulty: "hard",
    mastered: false
  },
  {
    id: 26,
    word: "Ambiguous",
    definition: "Open to more than one interpretation; having a double meaning.",
    example: "The instructions were so ambiguous that nobody knew what to do.",
    difficulty: "easy",
    mastered: false
  },
  {
    id: 27,
    word: "Brevity",
    definition: "Concise and exact use of words in writing or speech.",
    example: "The brevity of the speech was appreciated by the tired audience.",
    difficulty: "easy",
    mastered: false
  },
  {
    id: 28,
    word: "Cogent",
    definition: "Clear, logical, and convincing.",
    example: "She presented a cogent argument that won over the entire board.",
    difficulty: "medium",
    mastered: false
  },
  {
    id: 29,
    word: "Diligent",
    definition: "Having or showing care and conscientiousness in one's work.",
    example: "The diligent student studied four hours every night for the SAT.",
    difficulty: "easy",
    mastered: false
  },
  {
    id: 30,
    word: "Eloquent",
    definition: "Fluent or persuasive in speaking or writing.",
    example: "His eloquent eulogy moved many in the audience to tears.",
    difficulty: "easy",
    mastered: false
  }
];

// In-Memory Progress Records
let progressDb = {}; // { wordId: "mastered" | "learning" }
let scoresDb = [];   // [{ game: "match", time: 42, date: "..." }]
let settingsDb = {
  dailyGoal: 10,
  notifications: true,
  difficulty: "medium"
};
let customBanksDb = []; // [{ id: "...", name: "...", words: [...] }]

// Sync seed mastered states based on progressDb
function syncMasteredStates() {
  wordsDb.forEach(w => {
    if (progressDb[w.id] === 'mastered') {
      w.mastered = true;
    } else {
      w.mastered = false;
    }
  });
  customBanksDb.forEach(bank => {
    bank.words.forEach(w => {
      if (progressDb[w.id] === 'mastered') {
        w.mastered = true;
      } else {
        w.mastered = false;
      }
    });
  });
}

// Helper to get all current words (core + custom)
function getAllWords() {
  syncMasteredStates();
  let all = [...wordsDb];
  customBanksDb.forEach(bank => {
    all = [...all, ...bank.words];
  });
  return all;
}

// ==========================================================
// API ENDPOINTS
// ==========================================================

// GET /api/vocab/sets
app.get('/api/vocab/sets', (req, res) => {
  syncMasteredStates();
  const allWords = getAllWords();
  
  // Calculate core set progress
  const coreWords = wordsDb;
  const coreMastered = coreWords.filter(w => progressDb[w.id] === 'mastered').length;
  const coreProgress = coreWords.length > 0 ? Math.round((coreMastered / coreWords.length) * 100) : 0;

  const sets = [
    {
      id: "core_sat",
      name: "Core SAT Vocabulary",
      wordCount: coreWords.length,
      progress: coreProgress,
      lastStudied: scoresDb.length > 0 ? scoresDb[scoresDb.length - 1].date : "2026-05-29"
    }
  ];

  // Add custom user banks
  customBanksDb.forEach(bank => {
    const bankMastered = bank.words.filter(w => progressDb[w.id] === 'mastered').length;
    const bankProgress = bank.words.length > 0 ? Math.round((bankMastered / bank.words.length) * 100) : 0;
    sets.push({
      id: bank.id,
      name: bank.name,
      wordCount: bank.words.length,
      progress: bankProgress,
      lastStudied: "2026-05-29"
    });
  });

  res.json(sets);
});

// GET /api/vocab/learn?limit=10
app.get('/api/vocab/learn', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const allWords = getAllWords();
  
  // Filter unmastered words
  let unmastered = allWords.filter(w => progressDb[w.id] !== 'mastered');
  
  // If we run out of unmastered words, fallback to all words
  if (unmastered.length === 0) {
    unmastered = allWords;
  }

  // Shuffle and slice
  const shuffled = unmastered.sort(() => 0.5 - Math.random());
  res.json(shuffled.slice(0, limit));
});

// GET /api/vocab/match?count=6
app.get('/api/vocab/match', (req, res) => {
  const count = parseInt(req.query.count) || 6;
  const allWords = getAllWords();
  
  // Shuffle and get N random words
  const shuffled = allWords.sort(() => 0.5 - Math.random());
  res.json(shuffled.slice(0, count));
});

// GET /api/vocab/flashcards
app.get('/api/vocab/flashcards', (req, res) => {
  res.json(getAllWords());
});

// POST /api/vocab/progress
app.post('/api/vocab/progress', (req, res) => {
  const { wordId, status } = req.body;
  if (!wordId || !status) {
    return res.status(400).json({ error: "Missing wordId or status" });
  }

  progressDb[wordId] = status; // "mastered" or "learning"
  syncMasteredStates();
  
  res.json({ success: true, progress: progressDb });
});

// POST /api/vocab/score
app.post('/api/vocab/score', (req, res) => {
  const { game, time, date } = req.body;
  if (!game || time === undefined) {
    return res.status(400).json({ error: "Missing game or time" });
  }

  scoresDb.push({
    game,
    time,
    date: date || new Date().toISOString().split('T')[0]
  });

  res.json({ success: true, scores: scoresDb });
});

// GET /api/vocab/stats
app.get('/api/vocab/stats', (req, res) => {
  const allWords = getAllWords();
  const totalWords = allWords.length;
  const mastered = allWords.filter(w => progressDb[w.id] === 'mastered').length;
  
  // Calculate average accuracy and current streak
  const accuracy = totalWords > 0 ? Math.round((mastered / totalWords) * 100) : 0;
  const streak = scoresDb.length > 0 ? Math.min(scoresDb.length, 5) : 0; // Simulated streak

  res.json({
    totalWords,
    mastered,
    accuracy,
    streak
  });
});

// POST /api/vocab/settings
app.post('/api/vocab/settings', (req, res) => {
  const { dailyGoal, notifications, difficulty } = req.body;
  
  if (dailyGoal !== undefined) settingsDb.dailyGoal = parseInt(dailyGoal);
  if (notifications !== undefined) settingsDb.notifications = !!notifications;
  if (difficulty !== undefined) settingsDb.difficulty = difficulty;

  res.json({ success: true, settings: settingsDb });
});

// GET /api/vocab/settings
app.get('/api/vocab/settings', (req, res) => {
  res.json(settingsDb);
});

// POST /api/vocab/bank
app.post('/api/vocab/bank', (req, res) => {
  const { name, words } = req.body;
  if (!name || !words || !Array.isArray(words)) {
    return res.status(400).json({ error: "Name and words array are required" });
  }

  const newBankId = `custom_${Date.now()}`;
  const parsedWords = words.map((w, index) => ({
    id: `c_${Date.now()}_${index}`,
    word: w.word,
    definition: w.definition,
    example: w.example || "Custom user-defined word.",
    difficulty: "medium",
    mastered: false
  }));

  const newBank = {
    id: newBankId,
    name,
    words: parsedWords
  };

  customBanksDb.push(newBank);
  res.json({ success: true, bank: newBank });
});

// GET /api/vocab/bank
app.get('/api/vocab/bank', (req, res) => {
  res.json(customBanksDb);
});

// DELETE /api/vocab/bank/:id
app.delete('/api/vocab/bank/:id', (req, res) => {
  const id = req.params.id;
  customBanksDb = customBanksDb.filter(bank => bank.id !== id);
  res.json({ success: true });
});

// Reset progress route for convenience
app.post('/api/vocab/reset', (req, res) => {
  progressDb = {};
  scoresDb = [];
  syncMasteredStates();
  res.json({ success: true });
});

// Start Server
app.listen(PORT, () => {
  console.log(`==========================================================`);
  console.log(`🚀 OnePrep Vocabulary Practice API Server running on port ${PORT}`);
  console.log(`   Local Address: http://localhost:${PORT}`);
  console.log(`==========================================================`);
});
