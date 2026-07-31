const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf-8');

// 1. Remove Paypal imports
code = code.replace(/import \{ PayPalScriptProvider, PayPalButtons \} from '@paypal\/react-paypal-js';\n/g, '');

// 2. Add 'notes' and change default method to 'ideal'
code = code.replace(/country: 'Nederland',\s*method: 'paypal'\s*\}/, "country: 'Nederland',\n    method: 'ideal',\n    notes: ''\n  }");

// 3. Update finalizeOrder to match new fields
const oldFinalize = `const orderData = {
      orderNumber,
      name: \`\${formData.firstName} \${formData.lastName}\`,
      email: formData.email,
      phone: formData.phone,
      address: \`\${formData.street} \${formData.houseNumber}\`,
      postalCode: formData.postalCode,
      city: formData.city,
      country: formData.country,
      method: overrideMethod || formData.method,
      cart: cart,
      subtotal,
      shipCost,
      total
    };`;

const newFinalize = `const orderData = {
      orderNumber,
      name: \`\${formData.firstName} \${formData.lastName}\`,
      email: formData.email,
      phone: formData.phone,
      address: \`\${formData.street} \${formData.houseNumber}\`,
      postalCode: formData.postalCode,
      city: formData.city,
      country: formData.country,
      method: overrideMethod || formData.method,
      notes: formData.notes,
      cart: cart,
      subtotal,
      shipCost,
      total
    };`;

code = code.replace(oldFinalize, newFinalize);

// Change success routing to a clear success state instead of /
// We can just add a success screen in the same component.
const successReturn = `  if (isPaid) {
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

// Find empty state return
code = code.replace(/if \(cart\.length === 0 && !isPaid\) \{/, successReturn + "\n\n  if (cart.length === 0 && !isPaid) {");

// Save lastOrder in finalizeOrder before calling api/order
code = code.replace(/const orderNumber = Math\.floor\(100000 \+ Math\.random\(\) \* 900000\);/g, "const orderNumber = Math.floor(100000 + Math.random() * 900000);\n    localStorage.setItem('lastOrder', JSON.stringify({ orderNumber, method: overrideMethod || formData.method }));");

// Now rewrite the payment buttons part in the JSX
const oldPaymentBlockRegex = /\{\/\* PAYMENT BUTTONS DELEGATION \*\/\}[\s\S]*?(?=<\/form>)/;
const newPaymentBlock = `{/* BETALEN (HANDMATIG) */}
            <div style={{ marginTop: '20px' }}>
              <div className="form-field">
                <label>Opmerking (optioneel)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', border: '1px solid var(--line-soft)', background: 'var(--bg)', color: 'var(--fg)', resize: 'vertical' }}></textarea>
              </div>

              <div style={{ marginTop: '24px', padding: '16px', border: '1px solid var(--line-soft)' }}>
                <strong style={{ display: 'block', marginBottom: '12px', fontSize: '18px' }}>Kies je betaalmethode</strong>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                  <input type="radio" name="method" value="ideal" checked={formData.method === 'ideal'} onChange={handleChange} />
                  <span>iDEAL</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px' }}>
                  <input type="radio" name="method" value="paypal" checked={formData.method === 'paypal'} onChange={handleChange} />
                  <span>PayPal</span>
                </label>
                
                <p style={{ fontSize: '14px', color: 'var(--fg-dim)', fontStyle: 'italic', marginBottom: '16px' }}>
                  "Je betaalt nog niet direct. Nadat je bestelling is geplaatst, ontvang je van ons een betaalverzoek via WhatsApp."
                </p>
                
                {!isValid && attemptedSubmit && <div style={{ color: 'red', fontSize: '14px', marginBottom: '12px' }}>Vul eerst alle velden correct in.</div>}
                
                <button 
                  type="button" 
                  className="btn btn-solid" 
                  style={{ width: '100%', background: '#000', color: '#fff', opacity: (!isValid || loading) ? 0.5 : 1, pointerEvents: (!isValid || loading) ? 'none' : 'auto' }}
                  onClick={async () => {
                    const valid = await handlePreSubmit();
                    if (valid) {
                      finalizeOrder(formData.method);
                    }
                  }}
                >
                  {loading ? 'Laden...' : 'Bestelling plaatsen'}
                </button>
              </div>
            </div>
            `;

code = code.replace(oldPaymentBlockRegex, newPaymentBlock);

fs.writeFileSync('src/pages/Checkout.tsx', code);
