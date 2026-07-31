const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf-8');

const regex = /      if \(res\.ok\) \{[\s\S]*?navigate\('\/'\);\s*\}/;

const newCode = `      if (res.ok) {
        setIsPaid(true); // Order successful
        clearCart();
        
        let msg = \`🛒 *NIEUWE BESTELLING*\\n\\n\`;
        msg += \`*Order:* #\${orderNumber}\\n\\n\`;
        msg += \`👤 *Klant*\\nNaam: \${orderData.name}\\nTelefoon: \${orderData.phone}\\nE-mail: \${orderData.email}\\n\\n\`;
        msg += \`📍 *Adres*\\n\${orderData.address}\\n\${orderData.postalCode} \${orderData.city}\\n\${orderData.country}\\n\\n\`;
        
        msg += \`🛍️ *Bestelling*\\n\`;
        msg += orderData.cart.map((item) => \`\${item.qty}x \${item.name} \${item.size ? \`(Maat: \${item.size})\` : ''} — €\${(item.price * item.qty).toFixed(2)}\`).join('\\n') + '\\n\\n';
        
        msg += \`💰 *Totaal: €\${orderData.total.toFixed(2)}*\\n\\n\`;
        
        msg += \`💳 *Gewenste betaalmethode: \${orderData.method === 'ideal' ? 'iDEAL' : 'PayPal'}*\\n\\n\`;
        msg += \`🟠 *Status: WACHT OP BETALING*\`;
        
        if (orderData.notes) {
          msg += \`\\n\\n📝 *Opmerking:* \\n\${orderData.notes}\`;
        }

        const waUrl = \`https://wa.me/31639741576?text=\${encodeURIComponent(msg)}\`;
        
        (window as any).showToast(t('success_order') || 'Bestelling succesvol geplaatst! Je wordt doorgestuurd naar WhatsApp...');
        
        setTimeout(() => {
          window.location.href = waUrl;
        }, 1500);
      }`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/pages/Checkout.tsx', code);
