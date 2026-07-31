const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// Remove import
code = code.replace(/import Stripe from 'stripe';\n?/g, '');

// Remove instance
code = code.replace(/const stripe = process\.env\.STRIPE_SECRET_KEY\s*\n?\s*\? new Stripe\(process\.env\.STRIPE_SECRET_KEY as string, {[\s\S]*?}\)\s*\n?\s*: null;\n?/g, '');
// Handle alternative instantiation
code = code.replace(/const stripe =[\s\S]*?;/g, (match) => {
    if (match.includes('Stripe(')) return '';
    return match;
});

// Remove checkout session endpoint
code = code.replace(/\/\/ Stripe Checkout Session[\s\S]*?app\.post\("\/api\/create-checkout-session"[\s\S]*?\}\);/g, '');

fs.writeFileSync('server.ts', code);
