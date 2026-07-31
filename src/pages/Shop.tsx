import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS, PRICE } from '../lib/data';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';

export default function Shop() {
  const { lang, stock } = useStore();
  const t = useTranslation(lang);

  const ProductCard = ({ p }: { p: any }) => {
    const stockCount = Object.values(stock[p.id]).reduce((a, b) => a + b, 0);
    return (
      <Link to={`/product/${p.id}`} className="card">
        {p.limited && <span className="tag">Limited</span>}
        {stockCount === 0 && <span className="tag soldout">{t('sold_out')}</span>}
        <div className="thumb">
          <img src={p.img} loading="lazy" alt={p.name[lang]} />
        </div>
        <div className="card-body">
          <h3>{p.name[lang]}</h3>
          <div className="price">{PRICE(p.price)}</div>
          <div className="cta"><span>{t('view_product')}</span></div>
        </div>
      </Link>
    );
  };

  return (
    <section style={{ paddingTop: '56px' }}>
      <div className="wrap">
        <span className="eyebrow">{t('shop_h')}</span>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginTop: '10px' }}>{t('shop_h')}</h1>
        <p style={{ color: 'var(--fg-dim)', marginTop: '10px', maxWidth: '440px' }}>{t('shop_sub')}</p>
        <hr className="stitch" style={{ margin: '36px 0' }} />
        <div className="grid">
          {PRODUCTS.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
