const fs = require('fs');

const serverFile = 'server.js';
const examsFile = 'exams_array.json';

const serverCode = fs.readFileSync(serverFile, 'utf8');
const examsJson = fs.readFileSync(examsFile, 'utf8');

// Find the start and end of the exams array
const startMarker = 'const exams = [';
const endMarker = '  ];'; // We will find the end marker after startMarker

const startIndex = serverCode.indexOf(startMarker);
if (startIndex === -1) {
  console.error("Could not find start marker");
  process.exit(1);
}

const endIndex = serverCode.indexOf(endMarker, startIndex);
if (endIndex === -1) {
  console.error("Could not find end marker");
  process.exit(1);
}

const newExamsDeclaration = 'const exams = ' + examsJson + ';';

const newServerCode = serverCode.substring(0, startIndex) + newExamsDeclaration + serverCode.substring(endIndex + endMarker.length);

fs.writeFileSync(serverFile, newServerCode);
console.log('Successfully injected exams into server.js');
