import React, { useEffect, Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

const Home = React.lazy(() => import('./Home'));
const Shop = React.lazy(() => import('./Shop'));
const Laces = React.lazy(() => import('./Laces'));
const Product = React.lazy(() => import('./Product'));
const Cart = React.lazy(() => import('./Cart'));
const Checkout = React.lazy(() => import('./Checkout'));
const About = React.lazy(() => import('./About'));
const Shipping = React.lazy(() => import('./Shipping'));
const Faq = React.lazy(() => import('./Faq'));
const Contact = React.lazy(() => import('./Contact'));
const Admin = React.lazy(() => import('./Admin'));
const ReturnPolicy = React.lazy(() => import('./Return'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Suspense fallback={<div style={{ paddingTop: '100px', textAlign: 'center' }}>Laden...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="laces" element={<Laces />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="about" element={<About />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="faq" element={<Faq />} />
            <Route path="contact" element={<Contact />} />
            <Route path="return" element={<ReturnPolicy />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}