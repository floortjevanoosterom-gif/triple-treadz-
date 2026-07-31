const fs = require('fs');
let code = fs.readFileSync('src/pages/Faq.tsx', 'utf-8');

code = code.replace(
  /\{ q: "Kan ik mijn bestelling volgen\?", a: "Ja, zodra je bestelling ons atelier verlaat, ontvang je een e-mail met een Track & Trace code waarmee je de zending tot aan je voordeur kunt volgen." \},\s*\{ q: "Zijn de schoenen echt handgemaakt\?", a: "Absoluut. Wij geloven niet in massaproductie. Elk paar wordt pas na je bestelling door ons team in ons atelier met de hand bewerkt en afgebouwd." \}/,
  `{ q: t('faq7_q'), a: t('faq7_a') },
    { q: t('faq8_q'), a: t('faq8_a') }`
);

fs.writeFileSync('src/pages/Faq.tsx', code);
