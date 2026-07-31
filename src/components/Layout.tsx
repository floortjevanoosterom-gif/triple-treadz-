import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { WA_NUMBER, PHONE_DISPLAY, EMAIL } from '../lib/data';

export default function Layout() {
  const { lang, setLang, cart } = useStore();
  const t = useTranslation(lang);
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // Close drawer on navigation
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Expose toast to global window for easy access from anywhere
  useEffect(() => {
    (window as any).showToast = (msg: string) => {
      setToastMsg(msg);
      setTimeout(() => setToastMsg(''), 2600);
    };
  }, []);

  const navItems = [
    { to: '/', label: t('nav_home') },
    { to: '/about', label: t('nav_about') },
    { to: '/shipping', label: t('nav_shipping') },
    { to: '/faq', label: t('nav_faq') },
    { to: '/contact', label: t('nav_contact') },
  ];

  return (
    <>
      <header>
        <div className="wrap header-inner">
          <Link to="/" className="logo">
            <span className="logo-number">010.6643</span>
            <span className="logo-name">TRIPLE TREADZ</span>
          </Link>
          
          <nav className="mainnav" id="mainnav">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>{t('nav_home')}</Link>
            
            <div className="dropdown">
              <span className={`dropdown-trigger ${location.pathname.startsWith('/shop') || location.pathname.startsWith('/laces') ? 'active' : ''}`} style={{ cursor: 'pointer', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 0' }}>
                {t('nav_shop')}
              </span>
              <div className="dropdown-content">
                <Link to="/shop">Shoes</Link>
                <Link to="/laces">Laces</Link>
              </div>
            </div>

            {navItems.slice(1).map(item => (
              <Link key={item.to} to={item.to} className={location.pathname === item.to ? 'active' : ''}>
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="header-right">
            <select 
              className="lang-select" 
              value={lang} 
              onChange={(e) => setLang(e.target.value as 'nl' | 'en' | 'de' | 'es')}
            >
              <option value="nl">NL</option>
              <option value="en">EN</option>
              <option value="de">DE</option>
              <option value="es">ES</option>
            </select>
            <Link to="/cart" className="cart-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
            <button className="burger" onClick={() => setDrawerOpen(true)}>☰</button>
          </div>
        </div>
      </header>

      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <button className="drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
        <nav style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link to="/">{t('nav_home')}</Link>
          <Link to="/shop">Shoes</Link>
          <Link to="/laces">Laces</Link>
          <Link to="/about">{t('nav_about')}</Link>
          <Link to="/shipping">{t('nav_shipping')}</Link>
          <Link to="/faq">{t('nav_faq')}</Link>
          <Link to="/contact">{t('nav_contact')}</Link>
        </nav>
      </div>

      <main id="app" className="fade-in">
        <Outlet />
      </main>

      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <div className="logo" style={{ marginBottom: '14px', alignItems: 'flex-start' }}>
                <span className="logo-number" style={{ fontSize: '26px' }}>010.6643</span>
                <span className="logo-name" style={{ fontSize: '11px' }}>TRIPLE TREADZ</span>
              </div>
              <p style={{ color: 'var(--fg-dim)', fontSize: '13px', maxWidth: '280px' }}>
                {t('footer_tag')}
              </p>
              <div className="socials">
                <a href="https://www.tiktok.com/@triplethreadz8" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M16.5 2c.4 2.2 2 3.9 4.5 4.2v3.1c-1.6 0-3.1-.5-4.5-1.4v6.9c0 3.6-2.9 6.2-6.3 6.2S4 18.4 4 14.8c0-3.5 2.7-6.1 6-6.2v3.2c-1.6.1-2.8 1.4-2.8 3 0 1.7 1.4 3 3.1 3s3.1-1.3 3.1-3V2h3.1z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4>{t('f_info')}</h4>
              <Link to="/about">{t('nav_about')}</Link>
              <Link to="/shipping">{t('nav_shipping')}</Link>
              <Link to="/faq">{t('nav_faq')}</Link>
              <Link to="/return">{t('legal_returns')}</Link>
            </div>
            <div>
              <h4>{t('f_contact')}</h4>
              <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a href={`tel:+${WA_NUMBER}`}>{PHONE_DISPLAY}</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 TripleThreadz. {t('f_rights')}</span>
            <span className="mono">KVK · BTW NL — handmade in NL</span>
          </div>
        </div>
      </footer>

      <a className="wa-fab" href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#0b0b0a"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.51 3.63 1.4 5.14L2 22l5.1-1.49a9.87 9.87 0 0 0 4.94 1.33c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.78 14.03c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.02.28-3.42-.71-2.9-1.2-4.77-4.12-4.92-4.32-.14-.2-1.17-1.56-1.17-2.98 0-1.42.75-2.11 1.02-2.4.27-.28.58-.35.78-.35h.55c.18 0 .42-.03.64.49.24.58.82 1.99.89 2.13.07.14.11.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.56.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.18-.28.36-.23.6-.14.24.09 1.55.73 1.81.86.26.14.44.2.5.32.06.12.06.68-.18 1.35z"/></svg>
      </a>

      <div className={`toast ${toastMsg ? 'show' : ''}`}>{toastMsg}</div>
    </>
  );
}
