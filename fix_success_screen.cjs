const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf-8');

// Update finalizeOrder to save waUrl to localStorage
code = code.replace(/const waUrl = \`https:\/\/wa\.me\/31639741576\?text=\$\{encodeURIComponent\(msg\)\}\`;/,
  `const waUrl = \`https://wa.me/31639741576?text=\${encodeURIComponent(msg)}\`;
        localStorage.setItem('lastOrder', JSON.stringify({ orderNumber, method: overrideMethod || formData.method, waUrl }));`);

// Update success screen rendering
const oldSuccessScreen = `  if (isPaid) {
    const pendingStr = localStorage.getItem('lastOrder');
    let orderNum = '';
    let method = '';
    if (pendingStr) {
      try {
         const o = JSON.parse(pendingStr);
         orderNum = o.orderNumber;
         method = o.method;
      } catch(e) {}
    }
    return (
      <section style={{ paddingTop: '56px', minHeight: '60vh' }}>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>Bedankt voor je bestelling! 🎉</h1>
          <hr className="stitch" style={{ margin: '26px auto', maxWidth: '100px' }} />
          <p style={{ fontSize: '18px', marginBottom: '16px' }}>Je bestelling <strong>#{orderNum}</strong> is succesvol ontvangen.</p>
          <p style={{ fontSize: '18px', marginBottom: '16px' }}>Je hebt gekozen voor <strong>{method === 'ideal' ? 'iDEAL' : 'PayPal'}</strong> als betaalmethode.</p>
          <p style={{ fontSize: '18px', marginBottom: '16px' }}>Je ontvangt zo snel mogelijk via WhatsApp een betaalverzoek.</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Je bestelling wordt pas verwerkt nadat de betaling is ontvangen.</p>
        </div>
      </section>
    );
  }`;

const newSuccessScreen = `  if (isPaid) {
    const pendingStr = localStorage.getItem('lastOrder');
    let orderNum = '';
    let method = '';
    let waUrl = '';
    if (pendingStr) {
      try {
         const o = JSON.parse(pendingStr);
         orderNum = o.orderNumber;
         method = o.method;
         waUrl = o.waUrl;
      } catch(e) {}
    }
    return (
      <section style={{ paddingTop: '56px', minHeight: '60vh' }}>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>Je bestelling wordt verwerkt... 🎉</h1>
          <hr className="stitch" style={{ margin: '26px auto', maxWidth: '100px' }} />
          <p style={{ fontSize: '18px', marginBottom: '16px' }}>Bedankt! Je bestelling <strong>#{orderNum}</strong> is succesvol ontvangen.</p>
          <p style={{ fontSize: '18px', marginBottom: '16px' }}>We sturen je nu door naar WhatsApp om de bestelling aan ons door te geven.</p>
          <p style={{ fontSize: '18px', marginBottom: '16px' }}>Zodra wij dit hebben ontvangen, sturen we je een betaalverzoek via <strong>{method === 'ideal' ? 'iDEAL' : 'PayPal'}</strong>.</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>Je bestelling wordt pas verwerkt nadat de betaling is ontvangen.</p>
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-mustard" style={{ padding: '16px 32px', fontSize: '18px', display: 'inline-block', color: '#fff' }}>
              Ga naar WhatsApp
            </a>
          )}
        </div>
      </section>
    );
  }`;

code = code.replace(oldSuccessScreen, newSuccessScreen);

fs.writeFileSync('src/pages/Checkout.tsx', code);
