import React from 'react';
import { LACES, LACE_PRICE, PRICE } from '../lib/data';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';

export default function Laces() {
  const { lang, addToCart } = useStore();
  const t = useTranslation(lang);

  const handleAdd = (l: any) => {
    addToCart({
      key: `lace-${l.id}`,
      type: 'lace',
      productId: l.id,
      name: l.color[lang] || l.color.nl,
      price: LACE_PRICE,
      qty: 1,
      ph: 'ph-lace',
      c1: l.c1,
      c2: l.c2
    });
    (window as any).showToast(t('added_to_cart'));
  };

  return (
    <section style={{ paddingTop: '56px' }}>
      <div className="wrap">
        <span className="eyebrow">{t('nav_laces')}</span>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginTop: '10px' }}>{t('laces_h')}</h1>
        <p style={{ color: 'var(--fg-dim)', marginTop: '10px' }}>{t('laces_sub')}</p>
        <hr className="stitch" style={{ margin: '36px 0' }} />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {LACES.map(l => (
            <div key={l.id} className="card">
              <div className="thumb">
                <div className="ph ph-lace" style={{ '--lc1': l.c1, '--lc2': l.c2, position: 'absolute', inset: 0 } as React.CSSProperties}></div>
              </div>
              <div className="card-body">
                <h3 style={{ fontSize: '17px' }}>{l.color[lang] || l.color.nl}</h3>
                <div className="price">{PRICE(LACE_PRICE)}</div>
                <div className="cta">
                  <button className="btn btn-sm btn-solid" style={{ width: '100%' }} onClick={() => handleAdd(l)}>
                    {t('add_cart')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
