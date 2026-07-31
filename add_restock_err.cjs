const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

code = code.replace(/restock_success: 'Je bent succesvol aangemeld! Controleer je inbox voor de bevestigingsmail.',/, `restock_success: 'Je bent succesvol aangemeld! Controleer je inbox voor de bevestigingsmail.',\n  restock_err: 'Fout bij aanmelden.',`);
code = code.replace(/restock_success: 'You have been successfully registered! Check your inbox for the confirmation email.',/, `restock_success: 'You have been successfully registered! Check your inbox for the confirmation email.',\n  restock_err: 'Error signing up.',`);
code = code.replace(/restock_success: 'Du hast dich erfolgreich angemeldet! Überprüfe deinen Posteingang auf die Bestätigungs-E-Mail.',/, `restock_success: 'Du hast dich erfolgreich angemeldet! Überprüfe deinen Posteingang auf die Bestätigungs-E-Mail.',\n  restock_err: 'Fehler bei der Anmeldung.',`);
code = code.replace(/restock_success: '¡Te has registrado con éxito! Revisa tu bandeja de entrada para ver el correo de confirmación.',/, `restock_success: '¡Te has registrado con éxito! Revisa tu bandeja de entrada para ver el correo de confirmación.',\n  restock_err: 'Error al registrarse.',`);

fs.writeFileSync('src/lib/i18n.ts', code);
