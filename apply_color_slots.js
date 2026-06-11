const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('question-bank/index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const slots = [
  { border: '#7F77DD', iconBg: '#EEEDFE', iconColor: '#534AB7', progBar: '#7F77DD', btnBg: '#7F77DD', btnText: '#EEEDFE' },
  { border: '#1D9E75', iconBg: '#E1F5EE', iconColor: '#0F6E56', progBar: '#1D9E75', btnBg: '#1D9E75', btnText: '#E1F5EE' },
  { border: '#D4537E', iconBg: '#FBEAF0', iconColor: '#993556', progBar: '#D4537E', btnBg: '#D4537E', btnText: '#FBEAF0' },
  { border: '#378ADD', iconBg: '#E6F1FB', iconColor: '#185FA5', progBar: '#378ADD', btnBg: '#378ADD', btnText: '#E6F1FB' }
];

// In the split-screen, columns are either .subject-column or we can find them by IDs.
// Let's get the two columns.
const columns = document.querySelectorAll('.qb-split-col');
if (columns.length < 2) {
  console.log("Could not find two split columns (.qb-split-col). Checking alternative class names.");
}

// Fallback logic if the columns have different class names like .subject-col
const col1 = document.querySelector('#rw-column, .subject-col:nth-child(1), .qb-split-col:nth-child(1)');
const col2 = document.querySelector('#math-column, .subject-col:nth-child(2), .qb-split-col:nth-child(2)');

if (col1 && col2) {
  const rwCards = col1.querySelectorAll('.qb-skill-card');
  const mathCards = col2.querySelectorAll('.qb-skill-card');
  
  const maxCards = Math.max(rwCards.length, mathCards.length);
  
  for (let i = 0; i < maxCards; i++) {
    const slot = slots[i % 4];
    
    // Apply to R&W card
    if (rwCards[i]) {
      applySlotToCard(rwCards[i], slot);
    }
    
    // Apply to Math card
    if (mathCards[i]) {
      applySlotToCard(mathCards[i], slot);
    }
  }
} else {
  console.log("Could not find the two columns.");
}

function applySlotToCard(card, slot) {
  // Border
  card.style.borderLeft = `4px solid ${slot.border}`;
  card.style.borderColor = ''; // clear any other inline border colors
  
  // Icon bg and icon color
  const icon = card.querySelector('.qb-skill-icon');
  if (icon) {
    icon.style.backgroundColor = slot.iconBg;
    icon.style.color = slot.iconColor;
  }
  
  // Progress bar fill
  const progFill = card.querySelector('.qb-progress-fill');
  if (progFill) {
    progFill.style.backgroundColor = slot.progBar;
  }
  
  // Start/Continue/Review button
  // Select buttons using typical classes
  const btns = card.querySelectorAll('.qb-start-btn, button');
  btns.forEach(btn => {
    // Only apply if it's the primary CTA in the card
    if (btn.textContent.toLowerCase().includes('start') || 
        btn.textContent.toLowerCase().includes('continue') || 
        btn.textContent.toLowerCase().includes('review') ||
        btn.classList.contains('qb-start-btn')) {
      btn.style.backgroundColor = slot.btnBg;
      btn.style.color = slot.btnText;
      btn.style.border = 'none'; // in case there was a border
    }
  });
}

fs.writeFileSync('question-bank/index.html', dom.serialize());
console.log('Colors applied successfully!');
