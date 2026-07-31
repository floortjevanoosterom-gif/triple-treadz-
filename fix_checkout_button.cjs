const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf-8');

code = code.replace(/opacity: \(!isValid \|\| loading\) \? 0\.5 : 1, pointerEvents: \(!isValid \|\| loading\) \? 'none' : 'auto'/g, 
  "opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto'");

fs.writeFileSync('src/pages/Checkout.tsx', code);
