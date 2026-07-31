import React from 'react';
import { LACES, LACE_PRICE, PRICE } from '../lib/data';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';

const LACE_IMAGES: Record<string, string> = {
  'fluffy-white': '/images/fluffy veters wit.jpg',
  'fluffy-black': '/images/fluffy veters zwart.jpg',
  'fluffy-pink': '/images/fluffy veters roze.jpg',
  'white': '/images/veters wit.jpg',
  'black': '/images/veters zwart.jpg',
  'army-green': '/images/veters leger groen.jpg',
  'yellow': '/images/veters yellow.jpg',
  'light-pink': '/images/veters licht roze.jpg'
};

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

        <h1
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            marginTop: '10px'
          }}
        >
          {t('laces_h')}
        </h1>

        <p style={{ color: 'var(--fg-dim)', marginTop: '10px' }}>
          {t('laces_sub')}
        </p>

        <hr className="stitch" style={{ margin: '36px 0' }} />

        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)'
          }}
        >
          {LACES.map((l) => {
            const image = LACE_IMAGES[l.id];

            return (
              <div key={l.id} className="card">
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    overflow: 'hidden',
                    background: '#f5f5f5'
                  }}
                >
                  <img
                    src={image}
                    alt={l.color[lang] || l.color.nl}
                    loading="eager"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>

                <div className="card-body">
                  <h3 style={{ fontSize: '17px' }}>
                    {l.color[lang] || l.color.nl}
                  </h3>

                  <div className="price">
                    {PRICE(LACE_PRICE)}
                  </div>

                  <div className="cta">
                    <button
                      className="btn btn-sm btn-solid"
                      style={{ width: '100%' }}
                      onClick={() => handleAdd(l)}
                    >
                      {t('add_cart')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}