const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

const newKeysNl = `
  faq7_q: 'Kan ik mijn bestelling volgen?',
  faq7_a: 'Ja, zodra je bestelling ons atelier verlaat, ontvang je een e-mail met een Track & Trace code waarmee je de zending tot aan je voordeur kunt volgen.',
  faq8_q: 'Zijn de schoenen echt handgemaakt?',
  faq8_a: 'Absoluut. Wij geloven niet in massaproductie. Elk paar wordt pas na je bestelling door ons team in ons atelier met de hand bewerkt en afgebouwd.',
  co_success_h: 'Je bestelling wordt verwerkt...',
  co_success_p1a: 'Bedankt! Je bestelling ',
  co_success_p1b: ' is succesvol ontvangen.',
  co_success_wa_btn: 'Ga naar WhatsApp',
  co_success_wa_p: 'Klik op de onderstaande knop om je bestelling via WhatsApp aan ons door te geven.',
  co_success_pay_p1: 'Zodra wij dit hebben ontvangen, sturen we je een betaalverzoek via ',
  co_success_pay_p2: '.',
  co_success_wait: 'Je bestelling wordt pas verwerkt nadat de betaling is ontvangen.',
  co_pay_method: 'Kies je betaalmethode',
  co_pay_info: 'Je betaalt nog niet direct. Nadat je bestelling is geplaatst, ontvang je van ons een betaalverzoek via WhatsApp.',
  co_err_fields: 'Vul eerst alle velden correct in.',
  co_loading: 'Laden...',
  co_place_order: 'Bestelling plaatsen',
`;

const newKeysEn = `
  faq7_q: 'Can I track my order?',
  faq7_a: 'Yes, once your order leaves our workshop, you will receive an email with a Track & Trace code.',
  faq8_q: 'Are the shoes really handmade?',
  faq8_a: 'Absolutely. We do not believe in mass production. Each pair is handcrafted by our team in our workshop only after you order.',
  co_success_h: 'Your order is being processed...',
  co_success_p1a: 'Thank you! Your order ',
  co_success_p1b: ' has been successfully received.',
  co_success_wa_btn: 'Go to WhatsApp',
  co_success_wa_p: 'Click the button below to submit your order to us via WhatsApp.',
  co_success_pay_p1: 'As soon as we receive this, we will send you a payment request via ',
  co_success_pay_p2: '.',
  co_success_wait: 'Your order will only be processed after payment has been received.',
  co_pay_method: 'Choose your payment method',
  co_pay_info: 'You do not pay directly. After your order is placed, you will receive a payment request via WhatsApp.',
  co_err_fields: 'Please fill in all fields correctly.',
  co_loading: 'Loading...',
  co_place_order: 'Place order',
`;

const newKeysDe = `
  faq7_q: 'Kann ich meine Bestellung verfolgen?',
  faq7_a: 'Ja, sobald deine Bestellung unsere Werkstatt verlässt, erhältst du eine E-Mail mit einem Track & Trace-Code.',
  faq8_q: 'Sind die Schuhe wirklich handgefertigt?',
  faq8_a: 'Absolut. Wir glauben nicht an Massenproduktion. Jedes Paar wird erst nach deiner Bestellung von unserem Team in unserer Werkstatt handgefertigt.',
  co_success_h: 'Deine Bestellung wird bearbeitet...',
  co_success_p1a: 'Vielen Dank! Deine Bestellung ',
  co_success_p1b: ' wurde erfolgreich empfangen.',
  co_success_wa_btn: 'Gehe zu WhatsApp',
  co_success_wa_p: 'Klicke auf den Button unten, um uns deine Bestellung per WhatsApp zu übermitteln.',
  co_success_pay_p1: 'Sobald wir diese erhalten haben, senden wir dir eine Zahlungsaufforderung per ',
  co_success_pay_p2: '.',
  co_success_wait: 'Deine Bestellung wird erst nach Zahlungseingang bearbeitet.',
  co_pay_method: 'Wähle deine Zahlungsmethode',
  co_pay_info: 'Du zahlst nicht sofort. Nachdem deine Bestellung aufgegeben wurde, erhältst du eine Zahlungsaufforderung per WhatsApp.',
  co_err_fields: 'Bitte fülle zuerst alle Felder korrekt aus.',
  co_loading: 'Wird geladen...',
  co_place_order: 'Bestellung aufgeben',
`;

const newKeysEs = `
  faq7_q: '¿Puedo rastrear mi pedido?',
  faq7_a: 'Sí, una vez que tu pedido salga de nuestro taller, recibirás un correo electrónico con un código de seguimiento.',
  faq8_q: '¿Los zapatos están realmente hechos a mano?',
  faq8_a: 'Absolutamente. No creemos en la producción en masa. Cada par es hecho a mano por nuestro equipo en nuestro taller solo después de realizar el pedido.',
  co_success_h: 'Tu pedido está siendo procesado...',
  co_success_p1a: '¡Gracias! Tu pedido ',
  co_success_p1b: ' ha sido recibido con éxito.',
  co_success_wa_btn: 'Ir a WhatsApp',
  co_success_wa_p: 'Haz clic en el botón de abajo para enviarnos tu pedido a través de WhatsApp.',
  co_success_pay_p1: 'Tan pronto como lo recibamos, te enviaremos una solicitud de pago a través de ',
  co_success_pay_p2: '.',
  co_success_wait: 'Tu pedido solo se procesará después de recibir el pago.',
  co_pay_method: 'Elige tu método de pago',
  co_pay_info: 'No pagas directamente. Una vez realizado el pedido, recibirás una solicitud de pago por WhatsApp.',
  co_err_fields: 'Por favor, completa todos los campos correctamente.',
  co_loading: 'Cargando...',
  co_place_order: 'Realizar pedido',
`;

code = code.replace(/err_order: 'Fout bij plaatsen bestelling.',/, `err_order: 'Fout bij plaatsen bestelling.',\n${newKeysNl}`);
code = code.replace(/err_order: 'Error placing order.',/, `err_order: 'Error placing order.',\n${newKeysEn}`);
code = code.replace(/err_order: 'Fehler bei der Bestellung.',/, `err_order: 'Fehler bei der Bestellung.',\n${newKeysDe}`);
code = code.replace(/err_order: 'Error al realizar el pedido.',/, `err_order: 'Error al realizar el pedido.',\n${newKeysEs}`);

fs.writeFileSync('src/lib/i18n.ts', code);
