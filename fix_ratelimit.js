const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const rateLimitCode = `
const rateLimit = require('express-rate-limit');
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', globalLimiter);
const submitLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
`;

if (!code.includes("require('express-rate-limit')")) {
  code = code.replace(/(const app = express\(\);)/, "$1" + rateLimitCode);
  fs.writeFileSync('server.js', code);
  console.log('Fixed rate limiters');
}
