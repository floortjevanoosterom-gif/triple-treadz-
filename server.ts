import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import 'dotenv/config';
import { getDb, saveDb } from "./db";



async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Email route / Order completion
  app.post("/api/order", async (req, res) => {
    try {
      const order = req.body;
      const db = getDb();
      
      // Save order to DB
      db.orders.push({ ...order, status: 'WAITING_FOR_PAYMENT', paymentStatus: 'UNPAID', date: new Date().toISOString() });
      saveDb(db);
      
      try {
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
      

      res.json({ success: true, message: "Order placed" });
    } catch (error) {
      console.error("Error processing order:", error);
      res.status(500).json({ success: false, error: "Failed to process order" });
    }
  });

      
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

  app.post("/api/return", async (req, res) => {
    try {
      const returnReq = req.body;
      
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
        to: 'floortjevanoosterom@hotmail.com',
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
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, error: 'Ongeldig e-mailadres' });
      }

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
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // 1. Send confirmation to the user
      const userMailOptions = {
        from: process.env.SMTP_FROM || 'info@triplethreadz.com',
        to: email,
        subject: `Restock aanmelding: ${safeProductName} (Maat ${size})`,
        html: `
          <h3>Je bent succesvol aangemeld!</h3>
          <p>We sturen je automatisch een e-mail zodra de <strong>${safeProductName}</strong> in maat <strong>${size}</strong> weer op voorraad is.</p>
          <p>Met vriendelijke groet,<br />Team TripleThreadz</p>
        `
      };

      // 2. Send notification to the admin
      const adminMailOptions = {
        from: process.env.SMTP_FROM || 'info@triplethreadz.com',
        to: 'floortjevanoosterom@hotmail.com',
        subject: `Nieuwe Restock Aanvraag: ${safeProductName} - Maat ${size}`,
        text: `Klant email: ${email}\nHeeft zich aangemeld voor een restock van product: ${safeProductName} (${productId}) in maat: ${size}`
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

  // Admin endpoint to trigger a restock notification
  app.post("/api/admin/trigger-restock", async (req, res) => {
    try {
      const { productId, size, productUrl } = req.body;
      
      const db = getDb();
      
      // Find all subscribers for this product and size
      const subscribers = db.restockSubscriptions.filter(sub => sub.productId === productId && sub.size === String(size));
      
      if (subscribers.length === 0) {
        return res.json({ success: true, message: "No subscribers for this product/size." });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Send email to each subscriber
      for (const sub of subscribers) {
        const mailOptions = {
          from: process.env.SMTP_FROM || 'info@triplethreadz.com',
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

      // Remove the subscribers who were notified
      db.restockSubscriptions = db.restockSubscriptions.filter(sub => !(sub.productId === productId && sub.size === String(size)));
      saveDb(db);

      res.json({ success: true, message: `Restock notifications sent to ${subscribers.length} users.` });
    } catch (error) {
      console.error("Error triggering restock:", error);
      res.status(500).json({ success: false, error: "Failed to trigger restock notifications" });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
