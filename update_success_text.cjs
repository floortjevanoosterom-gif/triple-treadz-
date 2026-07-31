const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf-8');

code = code.replace(
  /<p style={{ fontSize: '18px', marginBottom: '16px' }}>We sturen je nu door naar WhatsApp om de bestelling aan ons door te geven\.<\/p>/,
  "<p style={{ fontSize: '18px', marginBottom: '16px' }}>Klik op de onderstaande knop om je bestelling via WhatsApp aan ons door te geven.</p>"
);

fs.writeFileSync('src/pages/Checkout.tsx', code);
