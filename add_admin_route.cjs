const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/const Contact = React\.lazy\(\(\) => import\('\.\/pages\/Contact'\)\);/, 
  "const Contact = React.lazy(() => import('./pages/Contact'));\nconst Admin = React.lazy(() => import('./pages/Admin'));");

code = code.replace(/<Route path="return" element=\{<ReturnPolicy \/>\} \/>/, 
  '<Route path="return" element={<ReturnPolicy />} />\n          <Route path="admin" element={<Admin />} />');

fs.writeFileSync('src/App.tsx', code);
