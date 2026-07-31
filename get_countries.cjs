const fs = require('fs');
let code = fs.readFileSync('src/lib/data.ts', 'utf-8');
const match = code.match(/export const COUNTRIES = \[([\s\S]*?)\];/);
if (match) {
    console.log(match[1]);
}
