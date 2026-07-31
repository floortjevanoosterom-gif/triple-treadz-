const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

// The backticks were escaped as \\\` which produced \\\` instead of \`
code = code.replace(/\\`/g, '`');
code = code.replace(/\\\\n/g, '\\n');
// Also $ needs fixing probably?
code = code.replace(/\\\$/g, '$');

fs.writeFileSync('src/pages/Admin.tsx', code);
