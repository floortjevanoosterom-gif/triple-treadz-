const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

code = code.replace(/err_order: 'Fout bij plaatsen bestelling.',/, `err_order: 'Fout bij plaatsen bestelling.',\n  restock_success: 'Je bent succesvol aangemeld! Controleer je inbox voor de bevestigingsmail.',`);
code = code.replace(/err_order: 'Error placing order.',/, `err_order: 'Error placing order.',\n  restock_success: 'You have been successfully registered! Check your inbox for the confirmation email.',`);
code = code.replace(/err_order: 'Fehler bei der Bestellung.',/, `err_order: 'Fehler bei der Bestellung.',\n  restock_success: 'Du hast dich erfolgreich angemeldet! Überprüfe deinen Posteingang auf die Bestätigungs-E-Mail.',`);
code = code.replace(/err_order: 'Error al realizar el pedido.',/, `err_order: 'Error al realizar el pedido.',\n  restock_success: '¡Te has registrado con éxito! Revisa tu bandeja de entrada para ver el correo de confirmación.',`);

fs.writeFileSync('src/lib/i18n.ts', code);
