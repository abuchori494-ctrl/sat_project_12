const fs = require('fs');
const path = 'C:/Users/user/sat_project_12/past-exams.html';
let html = fs.readFileSync(path, 'utf8');

// Empty ring SVG (no rotation needed, just the track)
const emptyRingEbrw  = `<div class="progress-ring-box"><svg width="54" height="54" viewBox="0 0 54 54"><circle cx="27" cy="27" r="22" fill="none" stroke="#e0e0e0" stroke-width="5"/></svg></div>`;
const emptyRingMath  = `<div class="progress-ring-box math-ring"><svg width="54" height="54" viewBox="0 0 54 54"><circle cx="27" cy="27" r="22" fill="none" stroke="#e0e0e0" stroke-width="5"/></svg></div>`;

// Full ring templates (track + progress arc)
const fullRingEbrw = (p) => `<div class="progress-ring-box"><svg width="54" height="54" viewBox="0 0 54 54" style="transform:rotate(-90deg)"><circle cx="27" cy="27" r="22" fill="none" stroke="#e0e0e0" stroke-width="5"/><circle cx="27" cy="27" r="22" fill="none" stroke="#6C63FF" stroke-width="5" stroke-dasharray="138.2" stroke-dashoffset="\${138.2*(1-${p}/100)}" stroke-linecap="round"/></svg><span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#6C63FF;font-size:11px;font-weight:700;">\${${p}}%</span></div>`;
const fullRingMath = (p) => `<div class="progress-ring-box math-ring"><svg width="54" height="54" viewBox="0 0 54 54" style="transform:rotate(-90deg)"><circle cx="27" cy="27" r="22" fill="none" stroke="#e0e0e0" stroke-width="5"/><circle cx="27" cy="27" r="22" fill="none" stroke="#6C63FF" stroke-width="5" stroke-dasharray="138.2" stroke-dashoffset="\${138.2*(1-${p}/100)}" stroke-linecap="round"/></svg><span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#6C63FF;font-size:11px;font-weight:700;">\${${p}}%</span></div>`;

// Build replacement expressions for each module
// Pattern: ${pVar === 0 ? '<old empty>' : `<old full>`}
// We replace the entire ternary expression with a clean new one.

// For each of the 4 modules, find and replace the entire ring ternary block.
// We use a function to build the new ternary string.
function makeRingExpr(pVar, emptyHtml, fullHtmlFn) {
  return `\${${pVar} === 0 ? '${emptyHtml}' : \`${fullHtmlFn}\`}`;
}

const fullEbrw1 = `<div class="progress-ring-box"><svg width="54" height="54" viewBox="0 0 54 54" style="transform:rotate(-90deg)"><circle cx="27" cy="27" r="22" fill="none" stroke="#e0e0e0" stroke-width="5"/><circle cx="27" cy="27" r="22" fill="none" stroke="#6C63FF" stroke-width="5" stroke-dasharray="138.2" stroke-dashoffset="\${138.2*(1-p_ebrw1/100)}" stroke-linecap="round"/></svg><span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#6C63FF;font-size:11px;font-weight:700;">\${p_ebrw1}%</span></div>`;
const fullEbrw2 = `<div class="progress-ring-box"><svg width="54" height="54" viewBox="0 0 54 54" style="transform:rotate(-90deg)"><circle cx="27" cy="27" r="22" fill="none" stroke="#e0e0e0" stroke-width="5"/><circle cx="27" cy="27" r="22" fill="none" stroke="#6C63FF" stroke-width="5" stroke-dasharray="138.2" stroke-dashoffset="\${138.2*(1-p_ebrw2/100)}" stroke-linecap="round"/></svg><span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#6C63FF;font-size:11px;font-weight:700;">\${p_ebrw2}%</span></div>`;
const fullMath1 = `<div class="progress-ring-box math-ring"><svg width="54" height="54" viewBox="0 0 54 54" style="transform:rotate(-90deg)"><circle cx="27" cy="27" r="22" fill="none" stroke="#e0e0e0" stroke-width="5"/><circle cx="27" cy="27" r="22" fill="none" stroke="#6C63FF" stroke-width="5" stroke-dasharray="138.2" stroke-dashoffset="\${138.2*(1-p_math1/100)}" stroke-linecap="round"/></svg><span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#6C63FF;font-size:11px;font-weight:700;">\${p_math1}%</span></div>`;
const fullMath2 = `<div class="progress-ring-box math-ring"><svg width="54" height="54" viewBox="0 0 54 54" style="transform:rotate(-90deg)"><circle cx="27" cy="27" r="22" fill="none" stroke="#e0e0e0" stroke-width="5"/><circle cx="27" cy="27" r="22" fill="none" stroke="#6C63FF" stroke-width="5" stroke-dasharray="138.2" stroke-dashoffset="\${138.2*(1-p_math2/100)}" stroke-linecap="round"/></svg><span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#6C63FF;font-size:11px;font-weight:700;">\${p_math2}%</span></div>`;

// Find and replace each ternary ring block. 
// Each block starts with ${pVar === 0 ? and ends with the closing `}
// Strategy: find the index of each marker and replace the entire block character by character.

function replaceRingBlock(src, pVar, emptyHtml, fullHtml) {
  const marker = `\${${pVar} === 0 ? '`;
  const idx = src.indexOf(marker);
  if (idx === -1) { console.log(`MARKER NOT FOUND for ${pVar}`); return src; }

  // Find the end of this ternary: look for the backtick-brace closing `}`
  // The structure is: ${pVar === 0 ? '...' : `...`}
  // We need to find the closing `}` that terminates the outer ${}
  let i = idx + marker.length;
  // Skip the empty string content (single-quoted)
  while (i < src.length && !(src[i] === "'" && src[i+1] === ' ' && src[i+2] === ':')) i++;
  i += 4; // skip ' : `
  // Now skip the backtick-quoted full ring (need to track template literal depth)
  let depth = 1;
  while (i < src.length && depth > 0) {
    if (src[i] === '`') depth--;
    else if (src[i] === '$' && src[i+1] === '{') { /* inner expr, skip */ }
    i++;
  }
  // Now src[i] should be `}` — closing the outer ${}
  if (src[i] === '}') i++;

  const before = src.substring(0, idx);
  const after = src.substring(i);
  const newBlock = `\${${pVar} === 0 ? '${emptyHtml}' : \`${fullHtml}\`}`;
  console.log(`Replaced ring for ${pVar}, chars removed: ${i - idx}`);
  return before + newBlock + after;
}

html = replaceRingBlock(html, 'p_ebrw1', emptyRingEbrw, fullEbrw1);
html = replaceRingBlock(html, 'p_ebrw2', emptyRingEbrw, fullEbrw2);
html = replaceRingBlock(html, 'p_math1', emptyRingMath, fullMath1);
html = replaceRingBlock(html, 'p_math2', emptyRingMath, fullMath2);

fs.writeFileSync(path, html, 'utf8');
console.log('Done — all 4 rings replaced.');
