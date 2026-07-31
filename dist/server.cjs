var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_twilio = __toESM(require("twilio"), 1);
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_config = require("dotenv/config");

// db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var DB_FILE = import_path.default.join(process.cwd(), "database.json");
function getDb() {
  if (!import_fs.default.existsSync(DB_FILE)) {
    return { restockSubscriptions: [], orders: [] };
  }
  return JSON.parse(import_fs.default.readFileSync(DB_FILE, "utf-8"));
}
function saveDb(db) {
  import_fs.default.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// server.ts
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/order", async (req, res) => {
    try {
      const order = req.body;
      const db = getDb();
      db.orders.push({ ...order, status: "WAITING_FOR_PAYMENT", paymentStatus: "UNPAID", date: (/* @__PURE__ */ new Date()).toISOString() });
      saveDb(db);
      try {
        const transporter = import_nodemailer.default.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        const mailOptions = {
          from: process.env.SMTP_FROM || "info@triplethreadz.com",
          to: order.email,
          subject: "Je bestelling is ontvangen",
          text: "Bedankt voor je bestelling!"
        };
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
          await transporter.sendMail(mailOptions);
        }
      } catch (e) {
        console.error("Email send failed", e);
      }
      try {
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_TO) {
          const client = (0, import_twilio.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
          let msg = `\u{1F6D2} *NIEUWE BESTELLING*

`;
          msg += `*Order:* #${order.orderNumber}

`;
          msg += `\u{1F464} *Klant*
Naam: ${order.name}
Telefoon: ${order.phone}
E-mail: ${order.email}

`;
          msg += `\u{1F4CD} *Adres*
${order.address}
${order.postalCode} ${order.city}
${order.country}

`;
          msg += `\u{1F6CD}\uFE0F *Bestelling*
`;
          msg += order.cart.map((item) => `${item.qty}x ${item.name} ${item.size ? `(Maat: ${item.size})` : ""} \u2014 \u20AC${(item.price * item.qty).toFixed(2)}`).join("\n") + "\n\n";
          msg += `\u{1F4B0} *Totaal: \u20AC${order.total.toFixed(2)}*

`;
          msg += `\u{1F4B3} *Gewenste betaalmethode: ${order.method === "ideal" ? "iDEAL" : "PayPal"}*

`;
          msg += `\u{1F7E0} *Status: WACHT OP BETALING*`;
          if (order.notes) {
            msg += `

\u{1F4DD} *Opmerking:* 
${order.notes}`;
          }
          await client.messages.create({
            body: msg,
            from: "whatsapp:" + (process.env.TWILIO_WHATSAPP_FROM || "+14155238886"),
            to: "whatsapp:" + process.env.TWILIO_WHATSAPP_TO
          });
        }
      } catch (e) {
        console.error("Twilio WhatsApp Error:", e);
      }
      res.json({ success: true, message: "Order placed" });
    } catch (error) {
      console.error("Error processing order:", error);
      res.status(500).json({ success: false, error: "Failed to process order" });
    }
  });
  app.get("/api/admin/orders", (req, res) => {
    const db = getDb();
    res.json(db.orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  });
  app.post("/api/admin/orders/:orderNumber/pay", (req, res) => {
    const db = getDb();
    const order = db.orders.find((o) => String(o.orderNumber) === req.params.orderNumber);
    if (order) {
      order.paymentStatus = "PAID";
      order.status = "PROCESSING";
      order.paidAt = (/* @__PURE__ */ new Date()).toISOString();
      saveDb(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });
  app.post("/api/admin/orders/:orderNumber/status", (req, res) => {
    const db = getDb();
    const order = db.orders.find((o) => String(o.orderNumber) === req.params.orderNumber);
    if (order) {
      order.status = req.body.status;
      saveDb(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });
  app.post("/api/return", async (req, res) => {
    try {
      const returnReq = req.body;
      const transporter = import_nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      const mailOptions = {
        from: process.env.SMTP_FROM || "info@triplethreadz.com",
        to: "floortjevanoosterom@hotmail.com",
        subject: `Nieuwe Retouraanvraag: Order #${returnReq.orderNumber}`,
        text: `
          Naam: ${returnReq.name}
          E-mail: ${returnReq.email}
          Ordernummer: ${returnReq.orderNumber}
          Reden voor retour: ${returnReq.reason}
        `
      };
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        await transporter.sendMail(mailOptions);
      } else {
        console.log("No SMTP settings found. Mocking return request email to floortjevanoosterom@hotmail.com");
      }
      res.json({ success: true, message: "Return request submitted" });
    } catch (error) {
      console.error("Error processing return request:", error);
      res.status(500).json({ success: false, error: "Failed to process return request" });
    }
  });
  app.post("/api/restock", async (req, res) => {
    try {
      const { email, productId, productName, size } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ success: false, error: "Ongeldig e-mailadres" });
      }
      const safeProductName = typeof productName === "object" ? productName.nl || productName.en || "Product" : productName;
      const db = getDb();
      const exists = db.restockSubscriptions.some(
        (sub) => sub.email === email && sub.productId === productId && sub.size === String(size)
      );
      if (!exists) {
        db.restockSubscriptions.push({ email, productId, productName: safeProductName, size: String(size) });
        saveDb(db);
      } else {
        return res.json({ success: true, message: "Je bent al aangemeld voor deze restock!" });
      }
      const transporter = import_nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      const userMailOptions = {
        from: process.env.SMTP_FROM || "info@triplethreadz.com",
        to: email,
        subject: `Restock aanmelding: ${safeProductName} (Maat ${size})`,
        html: `
          <h3>Je bent succesvol aangemeld!</h3>
          <p>We sturen je automatisch een e-mail zodra de <strong>${safeProductName}</strong> in maat <strong>${size}</strong> weer op voorraad is.</p>
          <p>Met vriendelijke groet,<br />Team TripleThreadz</p>
        `
      };
      const adminMailOptions = {
        from: process.env.SMTP_FROM || "info@triplethreadz.com",
        to: "floortjevanoosterom@hotmail.com",
        subject: `Nieuwe Restock Aanvraag: ${safeProductName} - Maat ${size}`,
        text: `Klant email: ${email}
Heeft zich aangemeld voor een restock van product: ${safeProductName} (${productId}) in maat: ${size}`
      };
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);
      } else {
        console.log("No SMTP settings. Mocking restock emails to:", email, "and admin.");
      }
      res.json({ success: true, message: "Restock requested and confirmation sent" });
    } catch (error) {
      console.error("Error processing restock request:", error);
      res.status(500).json({ success: false, error: "Failed to process restock request" });
    }
  });
  app.post("/api/admin/trigger-restock", async (req, res) => {
    try {
      const { productId, size, productUrl } = req.body;
      const db = getDb();
      const subscribers = db.restockSubscriptions.filter((sub) => sub.productId === productId && sub.size === String(size));
      if (subscribers.length === 0) {
        return res.json({ success: true, message: "No subscribers for this product/size." });
      }
      const transporter = import_nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      for (const sub of subscribers) {
        const mailOptions = {
          from: process.env.SMTP_FROM || "info@triplethreadz.com",
          to: sub.email,
          subject: `Je item is weer op voorraad! - ${sub.productName}`,
          html: `
            <h1>Goed nieuws!</h1>
            <p>De <strong>${sub.productName}</strong> in maat <strong>${sub.size}</strong> is weer op voorraad.</p>
            <p>Klik op de onderstaande link om het product te bekijken en direct te bestellen:</p>
            <a href="${productUrl || `https://triplethreadz.com/product/${sub.productId}`}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;margin-top:10px;font-weight:bold;">Bekijk Product</a>
            <br/><br/>
            <p>Wees er snel bij voordat het weer uitverkocht is!</p>
            <p>Met vriendelijke groet,<br />Team TripleThreadz</p>
          `
        };
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
          await transporter.sendMail(mailOptions);
        } else {
          console.log(`Mocking restock notification to ${sub.email} for ${sub.productName} size ${sub.size}`);
        }
      }
      db.restockSubscriptions = db.restockSubscriptions.filter((sub) => !(sub.productId === productId && sub.size === String(size)));
      saveDb(db);
      res.json({ success: true, message: `Restock notifications sent to ${subscribers.length} users.` });
    } catch (error) {
      console.error("Error triggering restock:", error);
      res.status(500).json({ success: false, error: "Failed to trigger restock notifications" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
