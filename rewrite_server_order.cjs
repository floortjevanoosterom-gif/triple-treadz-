const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// Update order saving to use UNPAID and WAITING_FOR_PAYMENT
code = code.replace(/db\.orders\.push\(\{ \.\.\.order, status: 'Paid', date: new Date\(\)\.toISOString\(\) \}\);/, 
  "db.orders.push({ ...order, status: 'WAITING_FOR_PAYMENT', paymentStatus: 'UNPAID', date: new Date().toISOString() });");

// Update whatsapp message
const oldMsg = /let msg = \`🛒 NIEUWE BESTELLING\\n\\n\`;[\s\S]*?msg \+= \`Datum\/tijd:\\n\$\{new Date\(\)\.toLocaleString\('nl-NL'\)\}\`;/g;

const newMsg = `let msg = \`🛒 *NIEUWE BESTELLING*\\n\\n\`;
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
        }`;

code = code.replace(oldMsg, newMsg);

// Add admin API routes
const adminRoutes = `
  // Admin routes
  app.get("/api/admin/orders", (req, res) => {
    // In a real app, protect this with auth!
    const db = getDb();
    res.json(db.orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  });

  app.post("/api/admin/orders/:orderNumber/pay", (req, res) => {
    const db = getDb();
    const order = db.orders.find(o => String(o.orderNumber) === req.params.orderNumber);
    if (order) {
      order.paymentStatus = 'PAID';
      order.status = 'PROCESSING';
      order.paidAt = new Date().toISOString();
      saveDb(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  });

  app.post("/api/admin/orders/:orderNumber/status", (req, res) => {
    const db = getDb();
    const order = db.orders.find(o => String(o.orderNumber) === req.params.orderNumber);
    if (order) {
      order.status = req.body.status;
      saveDb(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  });
`;

// Insert admin routes before app.post("/api/return"
code = code.replace(/app\.post\("\/api\/return",/, adminRoutes + '\n  app.post("/api/return",');

fs.writeFileSync('server.ts', code);
