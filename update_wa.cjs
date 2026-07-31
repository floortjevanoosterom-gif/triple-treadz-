const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(/msg \+= \`Klant: \$\{order\.name\}\\n\`;/g, 
  "msg += `Klant: ${order.name}\\n`;\n        msg += `Telefoon: ${order.phone}\\n`;");

fs.writeFileSync('server.ts', code);
