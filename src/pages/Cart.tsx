import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { PRICE, getShippingCost, FREE_FROM, COUNTRIES } from '../lib/data';

export default function Cart() {
  const { lang, cart, removeFromCart } = useStore();
  const t = useTranslation(lang);
  const [country, setCountry] = useState<string>('Nederland');

  if (cart.length === 0) {
    return (
      <section style={{ paddingTop: '56px', minHeight: '60vh' }}>
        <div className="wrap">
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>{t('cart_h')}</h1>
          <hr className="stitch" style={{ margin: '26px 0' }} />
          <div className="empty-state">
            <p>{t('cart_empty')}</p>
            <Link to="/shop" className="btn" style={{ marginTop: '20px' }}>{t('cart_shop')}</Link>
          </div>
        </div>
      </section>
    );
  }

  const shoePairs = cart.filter(c => c.type === 'shoe').reduce((a, c) => a + c.qty, 0);
  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const shipCost = shoePairs >= FREE_FROM ? 0 : getShippingCost(country);
  const total = subtotal + shipCost;

  return (
    <section style={{ paddingTop: '56px', minHeight: '60vh' }}>
      <div className="wrap">
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>{t('cart_h')}</h1>
        <hr className="stitch" style={{ margin: '26px 0' }} />
        <div>
          <div>
            {cart.map(item => (
              <div key={item.key} className="cart-line">
                {item.type === 'shoe' ? (
                  <div className="thumb" style={{ backgroundImage: `url(${item.img})` }}></div>
                ) : (
                  <div className="thumb ph-lace" style={{ '--lc1': item.c1, '--lc2': item.c2 } as React.CSSProperties}></div>
                )}
                <div>
                  <div style={{ fontSize: '15px' }}>{item.name}</div>
                  {item.size ? (
                    <div style={{ fontSize: '12px', color: 'var(--fg-dim)', marginTop: '4px' }}>
                      {t('size_lbl')}: {item.size} · x{item.qty}
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px', color: 'var(--fg-dim)', marginTop: '4px' }}>
                      x{item.qty}
                    </div>
                  )}
                </div>
                <div className="mono">{PRICE(item.price * item.qty)}</div>
                <button className="rm" onClick={() => removeFromCart(item.key)}>{t('remove')}</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="form-field" style={{ marginBottom: '20px' }}>
              <label>{t('ship_to')}</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="row">
              <span>{t('subtotal')}</span>
              <span className="mono">{PRICE(subtotal)}</span>
            </div>
            <div className="row">
              <span>{t('shipping')}</span>
              <span className="mono">{shipCost === 0 ? t('free') : PRICE(shipCost)}</span>
            </div>
            <div className="row total">
              <span>{t('total')}</span>
              <span className="mono">{PRICE(total)}</span>
            </div>
            <Link to="/checkout" className="btn btn-solid" style={{ width: '100%', marginTop: '18px', textAlign: 'center', background: '#000', color: '#fff', border: 'none' }}>
              {t('checkout')}
            </Link>
            <p style={{ fontSize: '11px', color: 'var(--fg-faint)', marginTop: '14px' }}>{t('cart_note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
