const { JSDOM } = require("jsdom");
const fs = require("fs");

const html = fs.readFileSync('past-exams.html', 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

// We need to parse englishHtml and mathHtml manually
const scriptMatch = html.match(/const englishHtml = `([\s\S]*?)`;/);
if (scriptMatch) {
  try {
    const el = document.createElement('div');
    el.innerHTML = scriptMatch[1]; // JSDOM uses innerHTML which parses similarly to insertAdjacentHTML
    console.log("English HTML parsed successfully.");
  } catch (e) {
    console.error("English HTML parse error:", e);
  }
}

const mathMatch = html.match(/const mathHtml = `([\s\S]*?)`;/);
if (mathMatch) {
  try {
    const el = document.createElement('div');
    el.innerHTML = mathMatch[1];
    console.log("Math HTML parsed successfully.");
  } catch (e) {
    console.error("Math HTML parse error:", e);
  }
}
