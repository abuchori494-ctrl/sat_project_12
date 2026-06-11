const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('question-bank/index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

console.log("Time estimates:", document.querySelectorAll('*').length);
const nodes = document.querySelectorAll('*');
let timeNodes = [];
let readyNodes = [];
let subNames = [];
let cards = document.querySelectorAll('.cat-card');
let subRows = document.querySelectorAll('.sub-row');

nodes.forEach(el => {
  if (el.children.length === 0 && el.textContent.match(/~\s*\d+\s*min/)) {
    timeNodes.push(el.outerHTML);
  }
  if (el.children.length === 0 && el.textContent.includes('Ready to begin? Pick any skill below.')) {
    readyNodes.push(el.outerHTML);
  }
});

cards.forEach(c => {
  const badge = c.querySelector('.status-badge');
  const body = c.querySelector('.cat-card-body') || c.querySelector('.card-body');
  const title = c.querySelector('h2, h3, .card-title');
  // Find sub-names
  const rows = c.querySelectorAll('.sub-row');
  if (rows.length > 0) {
    const firstRowTextNodes = Array.from(rows[0].querySelectorAll('*')).filter(el => el.children.length === 0);
    subNames.push(firstRowTextNodes.map(n => n.outerHTML).join(', '));
  }
});

console.log('Time nodes found:', timeNodes.length, timeNodes[0]);
console.log('Ready nodes found:', readyNodes.length, readyNodes[0]);
console.log('Cards found:', cards.length);
console.log('Sub rows found:', subRows.length);
console.log('Sub names sample:', subNames.slice(0, 3));
