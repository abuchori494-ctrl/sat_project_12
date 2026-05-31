const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==========================================================
// DATABASE: 100 TOP US COLLEGES SEEDED ACCURATELY
// ==========================================================
let colleges = [
  // IVY LEAGUE & TOP ELITE
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

  // TOP LIBERAL ARTS & RESEARCH
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

  // TOP PUBLIC UNIVERSITIES
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

  // MORE TOP SCHOOLS
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

  { id: 91,  name: "Abilene Christian University",  city: "Abilene",     state: "TX", type: "Private Nonprofit", acceptanceRate: 64, medianSAT: 1170, logo: "ACU",logoColor: "#5B2C8D" },
  { id: 92,  name: "Adelphi University",             city: "Garden City", state: "NY", type: "Private Nonprofit", acceptanceRate: 78, medianSAT: 1210, logo: "A",  logoColor: "#B45309" },
  { id: 93,  name: "Agnes Scott College",            city: "Decatur",     state: "GA", type: "Private Nonprofit", acceptanceRate: 62, medianSAT: 1250, logo: "A",  logoColor: "#6B7280" },
  { id: 94,  name: "Alabama A&M University",         city: "Normal",      state: "AL", type: "Public",            acceptanceRate: 66, medianSAT: 940,  logo: "A",  logoColor: "#8B0000" },
  { id: 95,  name: "Alabama State University",       city: "Montgomery",  state: "AL", type: "Public",            acceptanceRate: 96, medianSAT: 900,  logo: "ASU",logoColor: "#000000" },
  { id: 96,  name: "Alaska Pacific University",      city: "Anchorage",   state: "AK", type: "Private Nonprofit", acceptanceRate: 86, medianSAT: 1020, logo: "A",  logoColor: "#1E3A5F" },
  { id: 97,  name: "Abraham Baldwin Agricultural",   city: "Tifton",      state: "GA", type: "Public",            acceptanceRate: 77, medianSAT: 1000, logo: "A",  logoColor: "#374151" },
  { id: 98,  name: "Adrian College",                 city: "Adrian",      state: "MI", type: "Private Nonprofit", acceptanceRate: 68, medianSAT: 1000, logo: "A",  logoColor: "#8B6914" },
  { id: 99,  name: "Florida State University",       city: "Tallahassee", state: "FL", type: "Public",            acceptanceRate: 25, medianSAT: 1310, logo: "FSU",logoColor: "#782F40" },
  { id: 100, name: "Arizona State University",       city: "Tempe",       state: "AZ", type: "Public",            acceptanceRate: 88, medianSAT: 1210, logo: "ASU",logoColor: "#8C1D40" }
];

// Enrich colleges with accurate ranking, tags, and ranges
colleges.forEach((c) => {
  c.ranking = c.id; // ranking matches alphabetical/tier seed ID
  c.saved = false;
  c.satRange = { low: c.medianSAT - 80, high: c.medianSAT + 80 };
  
  // Tagging
  const tags = [];
  if (c.id <= 10) tags.push("Ivy League");
  if (c.type === "Public") tags.push("Public");
  if (c.type === "Private Nonprofit") tags.push("Private");
  if (c.medianSAT >= 1500) tags.push("STEM");
  if (c.id > 70 && c.id <= 90) tags.push("Liberal Arts");
  if (c.id <= 50) tags.push("Research");
  c.tags = tags;
});

// Bookmark storage tracking
let savedIds = new Set();

// ==========================================================
// API ENDPOINTS
// ==========================================================

// GET /api/colleges
app.get('/api/colleges', (req, res) => {
  let { search, type, minSAT, maxSAT, minRate, maxRate, sort, state } = req.query;
  let list = [...colleges];

  // Apply filters
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

  if (minSAT) {
    list = list.filter(c => c.medianSAT >= parseInt(minSAT));
  }
  if (maxSAT) {
    list = list.filter(c => c.medianSAT <= parseInt(maxSAT));
  }

  if (minRate) {
    list = list.filter(c => c.acceptanceRate >= parseInt(minRate));
  }
  if (maxRate) {
    list = list.filter(c => c.acceptanceRate <= parseInt(maxRate));
  }

  if (state && state !== '') {
    const states = state.split(',');
    list = list.filter(c => states.includes(c.state));
  }

  // Update dynamic saved indicators
  list.forEach(c => {
    c.saved = savedIds.has(c.id);
  });

  // Apply Sort
  if (sort) {
    if (sort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'rate-low-high') {
      list.sort((a, b) => a.acceptanceRate - b.acceptanceRate);
    } else if (sort === 'rate-high-low') {
      list.sort((a, b) => b.acceptanceRate - a.acceptanceRate);
    } else if (sort === 'sat-high-low') {
      list.sort((a, b) => b.medianSAT - a.medianSAT);
    } else if (sort === 'sat-low-high') {
      list.sort((a, b) => a.medianSAT - b.medianSAT);
    } else if (sort === 'ranking') {
      list.sort((a, b) => a.ranking - b.ranking);
    }
  }

  res.json({
    colleges: list,
    total: colleges.length,
    filtered: list.length
  });
});

// GET /api/colleges/:id
app.get('/api/colleges/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const college = colleges.find(c => c.id === id);

  if (!college) {
    return res.status(404).json({ error: "College not found" });
  }

  // Inject saved flag
  college.saved = savedIds.has(college.id);

  // Generate 4 similar colleges: same type + acceptanceRate within ±15%
  const similar = colleges
    .filter(c => c.id !== college.id && c.type === college.type && Math.abs(c.acceptanceRate - college.acceptanceRate) <= 15)
    .slice(0, 4);

  res.json({
    college,
    similar
  });
});

// POST /api/colleges/:id/save
app.post('/api/colleges/:id/save', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (savedIds.has(id)) {
    savedIds.delete(id);
  } else {
    savedIds.add(id);
  }

  res.json({
    saved: savedIds.has(id),
    collegeId: id
  });
});

// GET /api/colleges/saved
app.get('/api/colleges/saved', (req, res) => {
  const list = colleges.filter(c => savedIds.has(c.id));
  list.forEach(c => c.saved = true);
  res.json({ colleges: list });
});

// GET /api/colleges/stats
app.get('/api/colleges/stats', (req, res) => {
  const total = colleges.length;
  const savedCount = savedIds.size;
  
  const sumRate = colleges.reduce((sum, c) => sum + c.acceptanceRate, 0);
  const sumSAT = colleges.reduce((sum, c) => sum + c.medianSAT, 0);

  res.json({
    totalColleges: total,
    savedCount: savedCount,
    avgAcceptanceRate: Math.round(sumRate / total),
    avgMedianSAT: Math.round(sumSAT / total)
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`==========================================================`);
  console.log(`🚀 OnePrep College Browser API Server running on port ${PORT}`);
  console.log(`   Local Address: http://localhost:${PORT}`);
  console.log(`==========================================================`);
});
