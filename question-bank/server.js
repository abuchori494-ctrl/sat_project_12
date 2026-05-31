const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==========================================================
// IN-MEMORY STORAGE AND DATABASE SEEDS
// ==========================================================
const store = {
  questions: [
    // --------------------------------------------------------
    // MATH: ALGEBRA - LINEAR EQUATIONS IN ONE VARIABLE (5 Qs)
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // MATH: ALGEBRA - LINEAR FUNCTIONS (5 Qs)
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // MATH: GEOMETRY - AREA AND VOLUME (5 Qs)
    // --------------------------------------------------------
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
      id: "q_math_geom_03",
      subject: "math",
      topic: "Geometry and Trigonometry",
      subtopic: "Area and volume",
      difficulty: "easy",
      type: "multiple-choice",
      passage: null,
      question: "What is the area of a circle with radius 6? (Use π ≈ 3.14)",
      choices: [
        { letter: "A", text: "18.84" },
        { letter: "B", text: "37.68" },
        { letter: "C", text: "113.04" },
        { letter: "D", text: "226.08" }
      ],
      correctAnswer: "C",
      explanation: "Area = πr² ≈ 3.14 × (6)² = 3.14 × 36 = 113.04. Answer C is correct.",
      explanationSteps: [
        { step: 1, text: "Formula: A = πr²" },
        { step: 2, text: "Substitute: 3.14 × 36" },
        { step: 3, text: "Compute: 113.04" }
      ],
      timeLimit: 90
    },
    {
      id: "q_math_geom_04",
      subject: "math",
      topic: "Geometry and Trigonometry",
      subtopic: "Area and volume",
      difficulty: "medium",
      type: "multiple-choice",
      passage: null,
      question: "A cylinder has radius 3 and height 10. What is its volume? (Use π ≈ 3.14)",
      choices: [
        { letter: "A", text: "94.2" },
        { letter: "B", text: "188.4" },
        { letter: "C", text: "282.6" },
        { letter: "D", text: "376.8" }
      ],
      correctAnswer: "C",
      explanation: "Volume of a cylinder is V = πr²h ≈ 3.14 × (3)² × 10 = 3.14 × 9 × 10 = 282.6. Answer C is correct.",
      explanationSteps: [
        { step: 1, text: "Formula: V = πr²h" },
        { step: 2, text: "Substitute: 3.14 × 9 × 10" },
        { step: 3, text: "Calculate: 282.6" }
      ],
      timeLimit: 90
    },
    {
      id: "q_math_geom_05",
      subject: "math",
      topic: "Geometry and Trigonometry",
      subtopic: "Area and volume",
      difficulty: "easy",
      type: "multiple-choice",
      passage: null,
      question: "A triangle has base 8 and height 5. What is its area?",
      choices: [
        { letter: "A", text: "13" },
        { letter: "B", text: "20" },
        { letter: "C", text: "40" },
        { letter: "D", text: "80" }
      ],
      correctAnswer: "B",
      explanation: "Area of a triangle is 0.5 × base × height = 0.5 × 8 × 5 = 20. Answer B is correct.",
      explanationSteps: [
        { step: 1, text: "Formula: Area = 0.5 × b × h" },
        { step: 2, text: "Compute: 0.5 × 8 × 5 = 20" }
      ],
      timeLimit: 90
    },

    // --------------------------------------------------------
    // ENGLISH: BOUNDARIES (5 Qs)
    // --------------------------------------------------------
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
      id: "q_eng_bound_03",
      subject: "reading",
      topic: "Standard English Conventions",
      subtopic: "Boundaries",
      difficulty: "medium",
      type: "multiple-choice",
      passage: null,
      question: "Select the correctly punctuated option:",
      choices: [
        { letter: "A", text: "My brother who is a doctor lives in New York." },
        { letter: "B", text: "My brother, who is a doctor, lives in New York." },
        { letter: "C", text: "My brother; who is a doctor; lives in New York." },
        { letter: "D", text: "My brother: who is a doctor: lives in New York." }
      ],
      correctAnswer: "B",
      explanation: "'who is a doctor' is a nonessential clause and must be enclosed in commas. Answer B is correct.",
      explanationSteps: [
        { step: 1, text: "Identify parenthetical: 'who is a doctor'" },
        { step: 2, text: "Enclose with commas: 'My brother, who is a doctor, lives'" }
      ],
      timeLimit: 90
    },
    {
      id: "q_eng_bound_04",
      subject: "reading",
      topic: "Standard English Conventions",
      subtopic: "Boundaries",
      difficulty: "easy",
      type: "multiple-choice",
      passage: null,
      question: "Which option correctly uses a colon?",
      choices: [
        { letter: "A", text: "I need: eggs, milk, and bread." },
        { letter: "B", text: "I need the following: eggs, milk, and bread." },
        { letter: "C", text: "I need, eggs: milk and bread." },
        { letter: "D", text: "I: need eggs milk and bread." }
      ],
      correctAnswer: "B",
      explanation: "A colon must be preceded by a complete independent clause. 'I need the following' is independent. Answer B is correct.",
      explanationSteps: [
        { step: 1, text: "Check clause before colon: 'I need the following' is independent" },
        { step: 2, text: "List follows colon." }
      ],
      timeLimit: 90
    },
    {
      id: "q_eng_bound_05",
      subject: "reading",
      topic: "Standard English Conventions",
      subtopic: "Boundaries",
      difficulty: "easy",
      type: "multiple-choice",
      passage: null,
      question: "The sentence reads: \"Running through the park she felt free.\"\nWhich punctuation mark is needed after 'park'?",
      choices: [
        { letter: "A", text: "semicolon" },
        { letter: "B", text: "colon" },
        { letter: "C", text: "comma" },
        { letter: "D", text: "period" }
      ],
      correctAnswer: "C",
      explanation: "An introductory participial phrase ('Running through the park') must be separated from the main independent clause by a comma. Answer C is correct.",
      explanationSteps: [
        { step: 1, text: "Identify introductory phrase: 'Running through the park'" },
        { step: 2, text: "Add comma: 'park, she'" }
      ],
      timeLimit: 90
    },

    // --------------------------------------------------------
    // ENGLISH: CENTRAL IDEAS AND DETAILS (5 Qs)
    // --------------------------------------------------------
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
      id: "q_eng_idea_02",
      subject: "reading",
      topic: "Information and Ideas",
      subtopic: "Central Ideas and Details",
      difficulty: "easy",
      type: "passage",
      passage: "Bees play a crucial role in agriculture by pollinating crops. Without bees, many plants cannot reproduce, which would devastate food supplies worldwide. Scientists estimate that one-third of all food consumed by humans depends on pollination by bees.",
      question: "According to the passage, what fraction of human food depends on bee pollination?",
      choices: [
        { letter: "A", text: "One-half" },
        { letter: "B", text: "One-quarter" },
        { letter: "C", text: "One-third" },
        { letter: "D", text: "Two-thirds" }
      ],
      correctAnswer: "C",
      explanation: "The text directly states: 'one-third of all food consumed by humans depends on pollination by bees.' Answer C is correct.",
      explanationSteps: [
        { step: 1, text: "Scan text for quantitative figures." },
        { step: 2, text: "Locate 'one-third' and select C." }
      ],
      timeLimit: 90
    },
    {
      id: "q_eng_idea_03",
      subject: "reading",
      topic: "Information and Ideas",
      subtopic: "Central Ideas and Details",
      difficulty: "medium",
      type: "passage",
      passage: "In 1912, Alfred Wegener proposed the continental drift theory. He argued that the continents were once joined as a single supercontinent, which he named Pangaea. Over millions of years, this supercontinent fragmented and drifted apart.",
      question: "Which of the following best summarizes Alfred Wegener's continental drift proposal?",
      choices: [
        { letter: "A", text: "Pangaea is currently forming." },
        { letter: "B", text: "Continents were once connected as a single landmass." },
        { letter: "C", text: "Earthquakes cause tectonic movement." },
        { letter: "D", text: "Alfred Wegener traveled across New York." }
      ],
      correctAnswer: "B",
      explanation: "Wegener argued that continents were once joined in a supercontinent (Pangaea) and drifted apart. Answer B is correct.",
      explanationSteps: [
        { step: 1, text: "Identify key term: 'continents once joined'" },
        { step: 2, text: "Select B." }
      ],
      timeLimit: 90
    },
    {
      id: "q_eng_idea_04",
      subject: "reading",
      topic: "Information and Ideas",
      subtopic: "Central Ideas and Details",
      difficulty: "easy",
      type: "passage",
      passage: "In 1912, Alfred Wegener proposed the continental drift theory. He argued that the continents were once joined as a single supercontinent, which he named Pangaea. Over millions of years, this supercontinent fragmented and drifted apart.",
      question: "According to the passage, what was the name of Alfred Wegener's supercontinent?",
      choices: [
        { letter: "A", text: "Wegeneria" },
        { letter: "B", text: "Pangaea" },
        { letter: "C", text: "Atlantis" },
        { letter: "D", text: "Laurasia" }
      ],
      correctAnswer: "B",
      explanation: "The passage states Wegener named the supercontinent 'Pangaea'. Answer B is correct.",
      explanationSteps: [
        { step: 1, text: "Locate named entity in passage." },
        { step: 2, text: "Confirm 'Pangaea' (B)." }
      ],
      timeLimit: 90
    },
    {
      id: "q_eng_idea_05",
      subject: "reading",
      topic: "Information and Ideas",
      subtopic: "Central Ideas and Details",
      difficulty: "medium",
      type: "passage",
      passage: "Deep-sea hydrothermal vents emit toxic minerals and heat, yet support specialized ecosystems. Bacteria in these vents convert hydrogen sulfide into organic matter via chemosynthesis. This organic matter forms the base of the food chain for tube worms and crabs.",
      question: "Based on the passage, what serves as the organic foundation of the deep-sea hydrothermal vent ecosystem?",
      choices: [
        { letter: "A", text: "Sunlight filtering down" },
        { letter: "B", text: "Bacteria converting sulfide" },
        { letter: "C", text: "Crabs migrating" },
        { letter: "D", text: "Hydrothermal vents cooling" }
      ],
      correctAnswer: "B",
      explanation: "Bacteria utilizing chemosynthesis convert hydrogen sulfide into organic matter, which forms the base of the food chain. Answer B is correct.",
      explanationSteps: [
        { step: 1, text: "Locate base of food chain: organic matter made by bacteria." },
        { step: 2, text: "Select B." }
      ],
      timeLimit: 90
    },

    // --------------------------------------------------------
    // ENGLISH: TRANSITIONS (5 Qs)
    // --------------------------------------------------------
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
    },
    {
      id: "q_eng_trans_02",
      subject: "reading",
      topic: "Expression of Ideas",
      subtopic: "Transitions",
      difficulty: "easy",
      type: "multiple-choice",
      passage: null,
      question: "She thoroughly loved mountain hiking. ________, she intensely disliked outdoor camping.",
      choices: [
        { letter: "A", text: "Furthermore" },
        { letter: "B", text: "Therefore" },
        { letter: "C", text: "However" },
        { letter: "D", text: "Similarly" }
      ],
      correctAnswer: "C",
      explanation: "The second sentence introduces an opposing idea to the first. 'However' introduces this contrast. Answer C is correct.",
      explanationSteps: [
        { step: 1, text: "Contrast 'hiking' (positive) with 'camping' (negative)." },
        { step: 2, text: "Use contrast transition: 'However' (C)." }
      ],
      timeLimit: 90
    },
    {
      id: "q_eng_trans_03",
      subject: "reading",
      topic: "Expression of Ideas",
      subtopic: "Transitions",
      difficulty: "medium",
      type: "multiple-choice",
      passage: null,
      question: "The library ordered three hundred new science fiction books. ________, it expanded its digital audiobook collection.",
      choices: [
        { letter: "A", text: "Instead" },
        { letter: "B", text: "In addition" },
        { letter: "C", text: "Nevertheless" },
        { letter: "D", text: "Consequently" }
      ],
      correctAnswer: "B",
      explanation: "The second sentence adds another related item to the library's expansion. 'In addition' represents additive flow. Answer B is correct.",
      explanationSteps: [
        { step: 1, text: "Relationship: additive (ordering books + audiobooks)" },
        { step: 2, text: "Use addition transition: 'In addition'" }
      ],
      timeLimit: 90
    },
    {
      id: "q_eng_trans_04",
      subject: "reading",
      topic: "Expression of Ideas",
      subtopic: "Transitions",
      difficulty: "medium",
      type: "multiple-choice",
      passage: null,
      question: "Ancient Greek democracy excluded women and enslaved persons from voting. ________, it was highly restrictive compared to modern republics.",
      choices: [
        { letter: "A", text: "In contrast" },
        { letter: "B", text: "Thus" },
        { letter: "C", text: "On the other hand" },
        { letter: "D", text: "First" }
      ],
      correctAnswer: "B",
      explanation: "The second sentence draws a conclusion or summary from the fact in the first sentence. 'Thus' serves as a concluding adverb. Answer B is correct.",
      explanationSteps: [
        { step: 1, text: "Analyze logic: Fact leads to conclusion." },
        { step: 2, text: "Select 'Thus' (B)." }
      ],
      timeLimit: 90
    },
    {
      id: "q_eng_trans_05",
      subject: "reading",
      topic: "Expression of Ideas",
      subtopic: "Transitions",
      difficulty: "easy",
      type: "multiple-choice",
      passage: null,
      question: "We must leave for the airport immediately. ________, we will miss our flight to Rome.",
      choices: [
        { letter: "A", text: "Otherwise" },
        { letter: "B", text: "For example" },
        { letter: "C", text: "Similarly" },
        { letter: "D", text: "Consequently" }
      ],
      correctAnswer: "A",
      explanation: "The second sentence outlines what will happen if the action in the first is not taken. 'Otherwise' introduces this negative alternative. Answer A is correct.",
      explanationSteps: [
        { step: 1, text: "Logic: Alternative scenario if action isn't taken." },
        { step: 2, text: "Select 'Otherwise' (A)." }
      ],
      timeLimit: 90
    }
  ],
  
  // User activity records
  userProgress: {},
  savedQuestions: {},
  stats: {
    streak: 0,
    orbs: 80
  }
};

// ==========================================================
// PRE-BUILT REMIX DATA VARIATIONS
// ==========================================================
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
  },
  "q_math_geom_01": {
    question: "Which of the following is closest to the liquid level in the container 4 hours after it began to leak?",
    choices: [
      { letter: "A", text: "49 cm" },
      { letter: "B", text: "60 cm" },
      { letter: "C", text: "78 cm" },
      { letter: "D", text: "90 cm" }
    ],
    correctAnswer: "A",
    explanation: "Looking at the graph at x = 4 hours, the curve intersects at approximately y = 49 cm. Answer A is correct."
  }
};

// ==========================================================
// ROUTES
// ==========================================================

// GET /api/questions/:subject/:topic
app.get('/api/questions/:subject/:topic', (req, res) => {
  const { subject, topic } = req.params;
  const filtered = store.questions.filter(q => 
    q.subject.toLowerCase() === subject.toLowerCase() && 
    q.topic.toLowerCase() === topic.toLowerCase()
  );

  res.json(filtered);
});

// GET /api/questions/remix/:questionId
app.get('/api/questions/remix/:questionId', (req, res) => {
  const qId = req.params.questionId;
  const original = store.questions.find(q => q.id === qId);

  if (!original) {
    return res.status(404).json({ error: "Original question not found" });
  }

  // Find variation
  const variation = remixDb[qId];
  if (variation) {
    res.json({
      ...original,
      id: `${qId}_remix`,
      question: variation.question,
      choices: variation.choices,
      correctAnswer: variation.correctAnswer,
      explanation: variation.explanation
    });
  } else {
    // Generate simple standard mathematical duplicate variation
    res.json({
      ...original,
      id: `${qId}_remix`,
      question: `${original.question} (Remixed duplicate variant)`,
      choices: original.choices,
      correctAnswer: original.correctAnswer,
      explanation: `${original.explanation} (Same solving steps apply)`
    });
  }
});

// POST /api/questions/answer
app.post('/api/questions/answer', (req, res) => {
  const { questionId, selectedAnswer, timeSpent } = req.body;
  const question = store.questions.find(q => q.id === questionId);

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  const correct = question.correctAnswer === selectedAnswer;
  
  // Track progress count
  if (!store.userProgress[question.subtopic]) {
    store.userProgress[question.subtopic] = { answered: 0, total: 100, correct: 0 };
  }
  
  const prog = store.userProgress[question.subtopic];
  prog.answered++;
  if (correct) prog.correct++;
  
  const accuracy = Math.round((prog.correct / prog.answered) * 100);

  // Update study streaks
  store.stats.streak++;

  res.json({
    correct,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    explanationSteps: question.explanationSteps,
    updatedProgress: {
      answered: prog.answered,
      total: prog.total,
      accuracy: accuracy
    }
  });
});

// POST /api/questions/save/:questionId
app.post('/api/questions/save/:questionId', (req, res) => {
  const qId = req.params.questionId;
  store.savedQuestions[qId] = !store.savedQuestions[qId];
  res.json({ saved: store.savedQuestions[qId] });
});

// GET /api/questions/saved
app.get('/api/questions/saved', (req, res) => {
  const list = store.questions.filter(q => store.savedQuestions[q.id]);
  res.json(list);
});

// GET /api/questions/progress/:subject
app.get('/api/questions/progress/:subject', (req, res) => {
  res.json(store.userProgress);
});

// GET /api/questions/all (helper endpoints to retrieve entire catalog)
app.get('/api/questions/all', (req, res) => {
  res.json(store.questions);
});

// Start Server
app.listen(PORT, () => {
  console.log(`==========================================================`);
  console.log(`🚀 OnePrep Split-Panel Question Practice API Server running`);
  console.log(`   Port: ${PORT} | Local: http://localhost:${PORT}`);
  console.log(`==========================================================`);
});
