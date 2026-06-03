const fs = require('fs');
const data = [
  { month: 'March 2026', int: ['A','B','C'], us: ['A','B'] },
  { month: 'December 2025', int: ['A','B','C','D'], us: ['A','B','C'] },
  { month: 'November 2025', int: ['A','B','C'], us: ['A'] },
  { month: 'October 2025', int: ['A','B'], us: ['A','B'] },
  { month: 'August 2025', overall: 5 },
  { month: 'June 2025', int: ['A','B'], us: ['A','B','C'] },
  { month: 'May 2025', int: ['A','B','C'], us: ['A'] },
  { month: 'March 2025', int: ['A','B','C','D','E'], us: ['A','B','C'] },
  { month: 'December 2024', int: ['A','B','C','D'], us: ['A','B','C'] },
  { month: 'November 2024', int: ['A','B','C','D'], us: ['A','B'] },
  { month: 'October 2024', int: ['A','B','C'], us: ['A','B','C'] },
  { month: 'August 2024', int: ['A','B'], us: ['A','B','C','D','E'] },
  { month: 'June 2024', overall: 5 },
  { month: 'May 2024', int: ['A','B'], us: ['A','B'] },
  { month: 'March 2024', int: ['A','B'], us: ['A','B'] },
];

let exams = [];
for (const row of data) {
  const m = row.month.toLowerCase().replace(/,?\s+/g, '-');
  if (row.overall) {
    const letters = ['A','B','C','D','E'];
    for (let i=0; i<row.overall; i++) {
      exams.push({
        id: `${m}-form-${letters[i].toLowerCase()}`,
        type: 'official',
        name: `${row.month} SAT (Form ${letters[i]})`,
        date: row.month,
        region: 'Global',
        estimatedTime: '~3h 15min',
        modules: 4,
        badge: 'OFFICIAL'
      });
    }
  } else {
    for (const l of row.int) {
      exams.push({
        id: `${m}-int-${l.toLowerCase()}`,
        type: 'official',
        name: `${row.month} SAT (Int ${l})`,
        date: row.month,
        region: 'International',
        estimatedTime: '~3h 15min',
        modules: 4,
        badge: 'OFFICIAL'
      });
    }
    for (const l of row.us) {
      exams.push({
        id: `${m}-us-${l.toLowerCase()}`,
        type: 'official',
        name: `${row.month} SAT (US ${l})`,
        date: row.month,
        region: 'US',
        estimatedTime: '~3h 15min',
        modules: 4,
        badge: 'OFFICIAL'
      });
    }
  }
}

exams.push({
  id: 'ai-practice-1',
  type: 'ai',
  name: 'AI Practice Exam #1',
  date: 'Generated for you',
  region: null,
  estimatedTime: '~3h 15min',
  modules: 4,
  badge: 'AI GENERATED'
});

fs.writeFileSync('exams_array.json', JSON.stringify(exams, null, 2));
console.log('Wrote', exams.length, 'exams to exams_array.json');
