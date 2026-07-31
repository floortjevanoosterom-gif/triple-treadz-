const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf-8');

code = code.replace(
  /<h1 style={{ fontSize: 'clamp\(40px, 6vw, 64px\)', fontFamily: 'Times New Roman' }}>Je bestelling wordt verwerkt\.\.\.<\/h1>/,
  `<h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontFamily: 'Times New Roman' }}>{t('co_success_h')}</h1>`
);

code = code.replace(
  /<p style={{ fontSize: '18px', marginBottom: '16px' }}>Bedankt! Je bestelling <strong>#\{orderNum\}<\/strong> is succesvol ontvangen\.<\/p>/,
  `<p style={{ fontSize: '18px', marginBottom: '16px' }}>{t('co_success_p1a')}<strong>#{orderNum}</strong>{t('co_success_p1b')}</p>`
);

code = code.replace(
  /<p style={{ fontSize: '18px', marginBottom: '16px' }}>Klik op de onderstaande knop om je bestelling via WhatsApp aan ons door te geven\.<\/p>/,
  `<p style={{ fontSize: '18px', marginBottom: '16px' }}>{t('co_success_wa_p')}</p>`
);

code = code.replace(
  /<p style={{ fontSize: '18px', marginBottom: '16px' }}>Zodra wij dit hebben ontvangen, sturen we je een betaalverzoek via <strong>\{method === 'ideal' \? 'iDEAL' : 'PayPal'\}<\/strong>\.<\/p>/,
  `<p style={{ fontSize: '18px', marginBottom: '16px' }}>{t('co_success_pay_p1')}<strong>{method === 'ideal' ? 'iDEAL' : 'PayPal'}</strong>{t('co_success_pay_p2')}</p>`
);

code = code.replace(
  /<p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>Je bestelling wordt pas verwerkt nadat de betaling is ontvangen\.<\/p>/,
  `<p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>{t('co_success_wait')}</p>`
);

code = code.replace(
  /Ga naar WhatsApp\s*<\/a>/,
  `{t('co_success_wa_btn')}\n            </a>`
);

code = code.replace(
  /<strong style={{ display: 'block', marginBottom: '12px', fontSize: '18px' }}>Kies je betaalmethode<\/strong>/,
  `<strong style={{ display: 'block', marginBottom: '12px', fontSize: '18px' }}>{t('co_pay_method')}</strong>`
);

code = code.replace(
  /<p style={{ fontSize: '14px', color: 'var\(--fg-dim\)', fontStyle: 'italic', marginBottom: '16px' }}>\s*"Je betaalt nog niet direct\. Nadat je bestelling is geplaatst, ontvang je van ons een betaalverzoek via WhatsApp\."\s*<\/p>/,
  `<p style={{ fontSize: '14px', color: 'var(--fg-dim)', fontStyle: 'italic', marginBottom: '16px' }}>"{t('co_pay_info')}"</p>`
);

code = code.replace(
  /\{!isValid && attemptedSubmit && <div style={{ color: 'red', fontSize: '14px', marginBottom: '12px' }}>Vul eerst alle velden correct in\.<\/div>\}/,
  `{!isValid && attemptedSubmit && <div style={{ color: 'red', fontSize: '14px', marginBottom: '12px' }}>{t('co_err_fields')}</div>}`
);

code = code.replace(
  /\{loading \? 'Laden\.\.\.' : 'Bestelling plaatsen'\}/,
  `{loading ? t('co_loading') : t('co_place_order')}`
);

fs.writeFileSync('src/pages/Checkout.tsx', code);
