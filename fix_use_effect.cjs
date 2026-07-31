const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf-8');
code = code.replace(/  useEffect\(\(\) => \{\n    if \(isPaid\) \{\n      window\.scrollTo\(0, 0\);\n    \}\n  \}, \[isPaid\]\);\n\n/g, '');
code = code.replace(/  useEffect\(\(\) => \{/, "  useEffect(() => {\n    if (isPaid) {\n      window.scrollTo(0, 0);\n    }\n  }, [isPaid]);\n\n  useEffect(() => {");
fs.writeFileSync('src/pages/Checkout.tsx', code);
