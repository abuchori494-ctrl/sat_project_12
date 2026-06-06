const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");

const html = fs.readFileSync('past-exams.html', 'utf-8');

const dom = new JSDOM(html, { runScripts: "outside-only" });
const window = dom.window;
const document = window.document;

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const scriptContent = scriptMatch[1];

window.pastExamsData = [
  {
    id: "march-2026", month: "March", year: 2026,
    regions: [{
      name: "International", versions: [{name: "Int A", id: "int-a"}]
    }]
  }
];
window.userAttempts = {};
window.searchQuery = "";

const originalGetElementById = document.getElementById.bind(document);
document.getElementById = function(id) {
  if (id === 'exam-search') return { value: '' };
  return originalGetElementById(id);
};

try {
  window.eval(`
    let currentFilters = { year: 'all', region: 'all', status: 'all' };
    let currentPage = 1;
    let totalPages = 1;
    ${scriptContent.replace(/document\.addEventListener[\s\S]*?\}\);/, '')}
    
    try {
      renderExams();
    } catch (e) {
      console.log("INNER ERROR:", e.name, e.message, e.stack);
    }
  `);
} catch (e) {
  console.error("OUTER ERROR:", e);
}
