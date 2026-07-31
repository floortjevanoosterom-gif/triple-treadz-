const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// Find the stray "const session = await stripe...});"
code = code.replace(/const session = await stripe\.checkout\.sessions\.create\([\s\S]*?\}\);\s*res\.json\(\{ url: session\.url \}\);\s*\} catch \(error: any\) \{\s*console\.error\("Error creating checkout session:", error\);\s*res\.status\(500\)\.json\(\{ error: error\.message \}\);\s*\}\s*\}\);\s*/, '');
// And the `});        }` before it
code = code.replace(/\s*\}\);\s*\}\s*const session = await stripe/, ''); // Wait, let's just do a string replacement if possible

fs.writeFileSync('server.ts', code);
