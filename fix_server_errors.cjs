const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const regex = /      const transporter = nodemailer\.createTransport\(\{[\s\S]*?      res\.json\(\{ success: true, message: "Order placed, stored in DB, and email sent" \}\);/g;

const newBlock = `      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: process.env.SMTP_FROM || 'info@triplethreadz.com',
          to: order.email,
          subject: 'Je bestelling is ontvangen',
          text: 'Bedankt voor je bestelling!'
        };
        
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
          await transporter.sendMail(mailOptions);
        }
      } catch (e) {
        console.error("Email send failed", e);
      }
      
      try {
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_TO) {
          const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
          
          let msg = \`🛒 *NIEUWE BESTELLING*\\n\\n\`;
          msg += \`*Order:* #\${order.orderNumber}\\n\\n\`;
          msg += \`👤 *Klant*\\nNaam: \${order.name}\\nTelefoon: \${order.phone}\\nE-mail: \${order.email}\\n\\n\`;
          msg += \`📍 *Adres*\\n\${order.address}\\n\${order.postalCode} \${order.city}\\n\${order.country}\\n\\n\`;
          
          msg += \`🛍️ *Bestelling*\\n\`;
          msg += order.cart.map((item) => \`\${item.qty}x \${item.name} \${item.size ? \`(Maat: \${item.size})\` : ''} — €\${(item.price * item.qty).toFixed(2)}\`).join('\\n') + '\\n\\n';
          
          msg += \`💰 *Totaal: €\${order.total.toFixed(2)}*\\n\\n\`;
          
          msg += \`💳 *Gewenste betaalmethode: \${order.method === 'ideal' ? 'iDEAL' : 'PayPal'}*\\n\\n\`;
          msg += \`🟠 *Status: WACHT OP BETALING*\`;
          
          if (order.notes) {
            msg += \`\\n\\n📝 *Opmerking:* \\n\${order.notes}\`;
          }

          await client.messages.create({ 
            body: msg, 
            from: 'whatsapp:' + (process.env.TWILIO_WHATSAPP_FROM || '+14155238886'), 
            to: 'whatsapp:' + process.env.TWILIO_WHATSAPP_TO
          });
        }
      } catch (e) {
        console.error("Twilio WhatsApp Error:", e);
      }

      res.json({ success: true, message: "Order placed" });`;

code = code.replace(regex, newBlock);

fs.writeFileSync('server.ts', code);
