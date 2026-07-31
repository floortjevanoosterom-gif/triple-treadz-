const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// The restock endpoint
const oldRestock = `  app.post("/api/restock", async (req, res) => {
    try {
      const { email, productId, productName, size } = req.body;
      
      const db = getDb();
      db.restockSubscriptions.push({ email, productId, productName, size });
      saveDb(db);`;

const newRestock = `  app.post("/api/restock", async (req, res) => {
    try {
      const { email, productId, productName, size } = req.body;
      
      // Prevent crash if productName is object
      const safeProductName = typeof productName === 'object' ? (productName.nl || productName.en || 'Product') : productName;

      const db = getDb();
      
      // Check for duplicates
      const exists = db.restockSubscriptions.some(sub => 
        sub.email === email && sub.productId === productId && sub.size === String(size)
      );
      
      if (!exists) {
        db.restockSubscriptions.push({ email, productId, productName: safeProductName, size: String(size) });
        saveDb(db);
      } else {
        // Return success even if duplicate to not confuse user
        return res.json({ success: true, message: "Je bent al aangemeld voor deze restock!" });
      }`;

code = code.replace(oldRestock, newRestock);

// In restock we should also change the mailOptions to use safeProductName
code = code.replace(/subject: \`Restock aanmelding: \$\{productName\} \(Maat \$\{size\}\)\`,/g, 'subject: `Restock aanmelding: ${safeProductName} (Maat ${size})`,');
code = code.replace(/<p>We sturen je automatisch een e-mail zodra de <strong>\$\{productName\}<\/strong> in maat <strong>\$\{size\}<\/strong> weer op voorraad is\.<\/p>/g, '<p>We sturen je automatisch een e-mail zodra de <strong>${safeProductName}</strong> in maat <strong>${size}</strong> weer op voorraad is.</p>');
code = code.replace(/subject: \`Nieuwe Restock Aanvraag: \$\{productName\} - Maat \$\{size\}\`,/g, 'subject: `Nieuwe Restock Aanvraag: ${safeProductName} - Maat ${size}`,');
code = code.replace(/Heeft zich aangemeld voor een restock van product: \$\{productName\} \(\$\{productId\}\) in maat: \$\{size\}/g, 'Heeft zich aangemeld voor een restock van product: ${safeProductName} (${productId}) in maat: ${size}');

fs.writeFileSync('server.ts', code);
