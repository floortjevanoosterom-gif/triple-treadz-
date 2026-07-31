const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes('import twilio from "twilio"')) {
  code = 'import twilio from "twilio";\n' + code;
}

const twilioCode = `
      // WhatsApp notification via Twilio
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_TO) {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        
        let msg = \`Nieuwe Bestelling #\${order.orderNumber}!\\n\`;
        msg += \`Klant: \${order.name}\\n\`;
        msg += \`Items:\\n\${order.cart.map((item) => \`- \${item.qty}x \${item.name} \${item.size ? \`(Maat: \${item.size})\` : ''}\`).join('\\n')}\\n\`;
        msg += \`Totaalbedrag: €\${order.total.toFixed(2)}\\n\`;
        msg += \`Verzendadres: \${order.address}, \${order.postalCode} \${order.city}, \${order.country}\\n\`;
        msg += \`Betaalmethode: \${order.method}\`;

        await client.messages.create({
           body: msg,
           from: 'whatsapp:' + (process.env.TWILIO_WHATSAPP_FROM || '+14155238886'),
           to: 'whatsapp:' + process.env.TWILIO_WHATSAPP_TO
        }).catch((err) => console.error("Twilio WhatsApp Error:", err));
      } else {
        console.log("No Twilio credentials found. Mocking WhatsApp message for order:", order.orderNumber);
      }
`;

if (!code.includes('WhatsApp notification via Twilio')) {
  code = code.replace('res.json({ success: true, message: "Order placed, stored in DB, and email sent" });', twilioCode + '\n      res.json({ success: true, message: "Order placed, stored in DB, and email sent" });');
  fs.writeFileSync('server.ts', code);
}
