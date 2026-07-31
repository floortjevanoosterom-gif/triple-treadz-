const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

code = code.replace(/err_order: 'Fout bij plaatsen bestelling.',/, `err_order: 'Fout bij plaatsen bestelling.',\n  err_address_match: 'Het ingevoerde adres komt niet overeen met het geselecteerde land. Controleer je adres en land.',`);
code = code.replace(/err_order: 'Error placing order.',/, `err_order: 'Error placing order.',\n  err_address_match: 'The entered address does not match the selected country. Please check your address and country.',`);
code = code.replace(/err_order: 'Fehler bei der Bestellung.',/, `err_order: 'Fehler bei der Bestellung.',\n  err_address_match: 'Die eingegebene Adresse stimmt nicht mit dem ausgewählten Land überein. Bitte überprüfen Sie Ihre Adresse und das Land.',`);
code = code.replace(/err_order: 'Error al realizar el pedido.',/, `err_order: 'Error al realizar el pedido.',\n  err_address_match: 'La dirección ingresada no coincide con el país seleccionado. Por favor, revisa tu dirección y país.',`);

fs.writeFileSync('src/lib/i18n.ts', code);
