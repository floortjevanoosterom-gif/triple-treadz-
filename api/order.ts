import twilio from "twilio";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const order = req.body;

    if (!order?.name || !order?.email || !order?.phone || !order?.cart) {
      return res.status(400).json({
        success: false,
        error: "Ontbrekende bestelgegevens"
      });
    }

    const {
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
      TWILIO_WHATSAPP_TO,
      TWILIO_WHATSAPP_FROM
    } = process.env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_TO) {
      console.error("Twilio environment variables ontbreken");

      return res.status(500).json({
        success: false,
        error: "Twilio is niet correct ingesteld"
      });
    }

    const client = twilio(
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN
    );

    const items = Array.isArray(order.cart)
      ? order.cart
          .map((item: any) => {
            const size = item.size
              ? ` (Maat: ${item.size})`
              : "";

            const price =
              Number(item.price || 0) *
              Number(item.qty || 0);

            return `${item.qty}x ${item.name}${size} — €${price.toFixed(2)}`;
          })
          .join("\n")
      : "Geen producten";

    const method =
      order.method === "paypal"
        ? "PayPal"
        : "iDEAL";

    let message = `🛒 *NIEUWE BESTELLING*\n\n`;

    message += `*Order:* #${order.orderNumber}\n\n`;

    message += `👤 *KLANTGEGEVENS*\n`;
    message += `Naam: ${order.name}\n`;
    message += `Telefoon: ${order.phone}\n`;
    message += `E-mail: ${order.email}\n\n`;

    message += `📍 *ADRES*\n`;
    message += `${order.address}\n`;
    message += `${order.postalCode} ${order.city}\n`;
    message += `${order.country}\n\n`;

    message += `🛍️ *BESTELLING*\n`;
    message += `${items}\n\n`;

    message += `💰 *Subtotaal:* €${Number(order.subtotal || 0).toFixed(2)}\n`;
    message += `🚚 *Verzending:* €${Number(order.shipCost || 0).toFixed(2)}\n`;
    message += `💰 *TOTAAL:* €${Number(order.total || 0).toFixed(2)}\n\n`;

    message += `💳 *Betaalkeuze:* ${method}\n`;
    message += `🟠 *Status:* WACHT OP BETALING\n\n`;

    if (order.notes) {
      message += `📝 *Opmerking:*\n${order.notes}\n\n`;
    }

    message += `📲 Stuur de klant een Tikkie via: ${order.phone}`;

    await client.messages.create({
body: message,
  from: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
  to: `whatsapp:${TWILIO_WHATSAPP_TO}`
});

    return res.status(200).json({
      success: true,
      message: "Bestelling ontvangen"
    });

  } catch (error) {
    console.error("Order/Twilio error:", error);

    return res.status(500).json({
      success: false,
      error: "Bestelling kon niet worden verwerkt"
    });
  }
}
