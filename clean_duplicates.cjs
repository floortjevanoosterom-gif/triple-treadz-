const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

const lines = code.split('\n');
const newLines = lines.filter((line, i) => {
  return ![73, 203, 333, 463].includes(i); // 0-indexed, so 74 is 73
});

fs.writeFileSync('src/lib/i18n.ts', newLines.join('\n'));
