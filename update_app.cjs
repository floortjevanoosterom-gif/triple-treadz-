const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import Home from '\.\/pages\/Home';/g, "const Home = React.lazy(() => import('./pages/Home'));");
code = code.replace(/import Shop from '\.\/pages\/Shop';/g, "const Shop = React.lazy(() => import('./pages/Shop'));");
code = code.replace(/import Laces from '\.\/pages\/Laces';/g, "const Laces = React.lazy(() => import('./pages/Laces'));");
code = code.replace(/import Product from '\.\/pages\/Product';/g, "const Product = React.lazy(() => import('./pages/Product'));");
code = code.replace(/import Cart from '\.\/pages\/Cart';/g, "const Cart = React.lazy(() => import('./pages/Cart'));");
code = code.replace(/import Checkout from '\.\/pages\/Checkout';/g, "const Checkout = React.lazy(() => import('./pages/Checkout'));");
code = code.replace(/import About from '\.\/pages\/About';/g, "const About = React.lazy(() => import('./pages/About'));");
code = code.replace(/import Shipping from '\.\/pages\/Shipping';/g, "const Shipping = React.lazy(() => import('./pages/Shipping'));");
code = code.replace(/import Faq from '\.\/pages\/Faq';/g, "const Faq = React.lazy(() => import('./pages/Faq'));");
code = code.replace(/import Contact from '\.\/pages\/Contact';/g, "const Contact = React.lazy(() => import('./pages/Contact'));");
code = code.replace(/import ReturnPolicy from '\.\/pages\/Return';/g, "const ReturnPolicy = React.lazy(() => import('./pages/Return'));");

if (!code.includes('import React, { Suspense')) {
   code = code.replace(/import \{ useEffect \}/, "import React, { useEffect, Suspense }");
}

if (!code.includes('<Suspense fallback')) {
    code = code.replace(/<Routes>/, '<Suspense fallback={<div style={{ paddingTop: "100px", textAlign: "center" }}>Laden...</div>}>\n      <Routes>');
    code = code.replace(/<\/Routes>/, '</Routes>\n      </Suspense>');
}

fs.writeFileSync('src/App.tsx', code);
