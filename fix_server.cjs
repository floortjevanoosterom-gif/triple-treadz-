const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// The route /api/create-checkout-session seems to be broken. Let's find its start and end.
const startStr = 'app.post("/api/create-checkout-session"';
const startIndex = code.indexOf(startStr);
if (startIndex !== -1) {
    let braceCount = 0;
    let foundFirstBrace = false;
    let endIndex = -1;
    for (let i = startIndex; i < code.length; i++) {
        if (code[i] === '{') {
            braceCount++;
            foundFirstBrace = true;
        } else if (code[i] === '}') {
            braceCount--;
        }
        if (foundFirstBrace && braceCount === 0) {
            endIndex = i;
            break;
        }
    }
    if (endIndex !== -1) {
        // Also remove the `});` after it
        code = code.substring(0, startIndex) + code.substring(endIndex + 3);
    }
}

// Clean up remaining comments
code = code.replace(/\/\/ Stripe Checkout Session\s*/, '');

fs.writeFileSync('server.ts', code);
