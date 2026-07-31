const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf-8');

const regex = /\(window as any\)\.showToast\(t\('success_order'\) \|\| 'Bestelling succesvol geplaatst! Je wordt doorgestuurd naar WhatsApp\.\.\.'\);\s*setTimeout\(\(\) => \{\s*window\.location\.href = waUrl;\s*\}, 3000\);/g;

const newCode = `(window as any).showToast(t('success_order') || 'Bestelling succesvol geplaatst!');`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/pages/Checkout.tsx', code);
