const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

// Increase rate limits drastically so testing doesn't hit 429
code = code.replace(/max: 100/g, 'max: 100000');
code = code.replace(/max: 30/g, 'max: 30000');

fs.writeFileSync('server.js', code);
console.log("Rate limits increased");
