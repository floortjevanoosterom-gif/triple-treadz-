const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const oldCheck = `    try {
      const { email, productId, productName, size } = req.body;
      
      // Prevent crash if productName is object`;

const newCheck = `    try {
      const { email, productId, productName, size } = req.body;
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, error: 'Ongeldig e-mailadres' });
      }

      // Prevent crash if productName is object`;

code = code.replace(oldCheck, newCheck);

fs.writeFileSync('server.ts', code);
