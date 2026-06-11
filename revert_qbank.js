const fs = require('fs');
let html = fs.readFileSync('question-bank/index.html', 'utf8');

// 1. Restore mock data
const mockData = `const RW_CATEGORIES = [
      {
        id: "craft-and-structure", label: "Craft and Structure", desc: "Analyze how authors build arguments", icon: "✦", accentHex: "#8B5CF6",
        subTopics: [
          { id: "cross-text", label: "Cross-Text Connections", completed: 10, total: 57 },
          { id: "text-structure", label: "Text Structure and Purpose", completed: 115, total: 115 },
          { id: "words-in-context", label: "Words in Context", completed: 0, total: 219 },
        ]
      },
      {
        id: "expression-of-ideas", label: "Expression of Ideas", desc: "Improve clarity and flow of writing", icon: "✎", accentHex: "#3B82F6",
        subTopics: [
          { id: "rhetorical-synthesis", label: "Rhetorical Synthesis", completed: 0, total: 171 },
          { id: "transitions", label: "Transitions", completed: 0, total: 139 },
        ]
      },
      {
        id: "information-and-ideas", label: "Information and Ideas", desc: "Interpret and analyze informational texts", icon: "◈", accentHex: "#EC4899",
        subTopics: [
          { id: "central-ideas", label: "Central Ideas and Details", completed: 0, total: 142 },
          { id: "command-of-evidence", label: "Command of Evidence", completed: 0, total: 128 },
          { id: "inferences", label: "Inferences", completed: 0, total: 91 },
        ]
      },
      {
        id: "standard-english-conventions", label: "Standard English Conventions", desc: "Master grammar, punctuation, and sentence structure", icon: "¶", accentHex: "#F59E0B",
        subTopics: [
          { id: "boundaries", label: "Boundaries", completed: 0, total: 103 },
          { id: "form-structure", label: "Form, Structure, and Sense", completed: 0, total: 117 },
        ]
      }
    ];

    const MATH_CATEGORIES = [
      {
        id: "algebra", label: "Algebra", desc: "Master linear equations and inequalities", icon: "∑", accentHex: "#0EA5E9",
        subTopics: [
          { id: "lin1", label: "Linear equations in one variable", completed: 0, total: 159 },
          { id: "linf", label: "Linear functions", completed: 0, total: 225 },
          { id: "lin2", label: "Linear equations in two variables", completed: 0, total: 179 },
          { id: "sys", label: "Systems of two linear equations in two variables", completed: 0, total: 161 },
          { id: "ineq", label: "Linear inequalities in one or two variables", completed: 0, total: 100 },
        ]
      },
      {
        id: "advanced-math", label: "Advanced Math", desc: "Navigate complex nonlinear equations and functions", icon: "ƒ", accentHex: "#10B981",
        subTopics: [
          { id: "equiv", label: "Equivalent expressions", completed: 0, total: 158 },
          { id: "nonlin1", label: "Nonlinear equations in one variable and systems of equations", completed: 0, total: 211 },
          { id: "nonlinf", label: "Nonlinear functions", completed: 0, total: 320 },
        ]
      },
      {
        id: "problem-solving", label: "Problem-Solving and Data Analysis", desc: "Interpret data, rates, and probabilities", icon: "📊", accentHex: "#F59E0B",
        subTopics: [
          { id: "ratios", label: "Ratios, rates, proportional relationships, and units", completed: 0, total: 119 },
          { id: "percent", label: "Percentages", completed: 0, total: 101 },
          { id: "dist", label: "One-variable data: Distributions and measures of center", completed: 0, total: 103 },
          { id: "scatter", label: "Two-variable data: Models and scatterplots", completed: 0, total: 74 },
          { id: "prob", label: "Probability and conditional probability", completed: 0, total: 56 },
          { id: "infer", label: "Inference from sample statistics", completed: 0, total: 33 },
          { id: "eval", label: "Evaluating statistical claims", completed: 0, total: 12 },
        ]
      },
      {
        id: "geometry", label: "Geometry and Trigonometry", desc: "Understand shapes, angles, and trigonometric ratios", icon: "△", accentHex: "#EC4899",
        subTopics: [
          { id: "area", label: "Area and volume", completed: 0, total: 113 },
          { id: "lines", label: "Lines, angles, and triangles", completed: 0, total: 110 },
          { id: "trig", label: "Right triangles and trigonometry", completed: 0, total: 83 },
          { id: "circles", label: "Circles", completed: 0, total: 73 },
        ]
      }
    ];`;

html = html.replace(/let RW_CATEGORIES = \[\];\s+let MATH_CATEGORIES = \[\];/, mockData);

// 2. Restore hardcoded headers
html = html.replace(/<p id="rw-subtitle" class="text-\[14px\] text-\[#6B7280\]"><\/p>/g, '<p class="text-[14px] text-[#6B7280]">1492 questions across 10 skills</p>');
html = html.replace(/<p id="math-subtitle" class="text-\[14px\] text-\[#6B7280\]"><\/p>/g, '<p class="text-[14px] text-[#6B7280]">2390 questions across 28 skills</p>');

// 3. Remove Empty State Renderer and fetchQuestionBankStats
html = html.replace(/function renderEmptyState[\s\S]*?async function fetchQuestionBankStats[\s\S]*?\}\n/, '');

// 4. Restore initialization
html = html.replace(/document\.addEventListener\('DOMContentLoaded', \(\) => \{[\s\S]*?\}\);/m, `document.addEventListener('DOMContentLoaded', () => {
      checkTips();
      renderPageLayout();
      renderList('rw');
      renderList('math');
      runCountUp();
      
      // Global click handler to attach confetti trigger loosely.
      // (When clicking a row that is close to complete, or testing... here we just mock it)
      window.triggerConfetti = triggerConfetti;
    });`);

fs.writeFileSync('question-bank/index.html', html);
console.log('Successfully reverted question-bank/index.html');
