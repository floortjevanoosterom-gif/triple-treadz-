const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const oldMsgBlock = /let msg = \`Nieuwe Bestelling #\$\{order\.orderNumber\}!\\n\`;[\s\S]*?msg \+= \`Betaalmethode: \$\{order\.method\}\`;/g;

const newMsgBlock = `let msg = \`🛒 NIEUWE BESTELLING\\n\\n\`;
        msg += \`Ordernummer: \${order.orderNumber}\\n\\n\`;
        msg += \`Klant:\\n\${order.name}\\n\\n\`;
        msg += \`E-mail:\\n\${order.email}\\n\\n\`;
        msg += \`Telefoon:\\n\${order.phone}\\n\\n\`;
        msg += \`Producten:\\n\${order.cart.map((item) => \`\${item.name} \${item.size ? \`(Maat: \${item.size})\` : ''} x \${item.qty}\`).join('\\n')}\\n\\n\`;
        msg += \`Totaal:\\n€\${order.total.toFixed(2)}\\n\\n\`;
        msg += \`Betaalmethode:\\n\${order.method}\\n\\n\`;
        msg += \`Bezorgadres:\\n\${order.address}\\n\${order.postalCode} \${order.city}\\n\${order.country}\\n\\n\`;
        msg += \`Datum/tijd:\\n\${new Date().toLocaleString('nl-NL')}\`;`;

code = code.replace(oldMsgBlock, newMsgBlock);
fs.writeFileSync('server.ts', code);
