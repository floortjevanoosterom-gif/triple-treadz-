const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf-8');

code = code.replace(/onApprove={\(data, actions\) => \{\s*return actions\.order!\.capture\(\)\.then\(async \(details\) => \{\s*const preSubmitValid = await handlePreSubmit\(\);\s*if \(preSubmitValid\) \{\s*finalizeOrder\('paypal'\);\s*\}\s*\}\);\s*\}\}/,
`onApprove={(data, actions) => {
  return actions.order!.capture().then((details) => {
    finalizeOrder('paypal');
  });
}}`);

fs.writeFileSync('src/pages/Checkout.tsx', code);
