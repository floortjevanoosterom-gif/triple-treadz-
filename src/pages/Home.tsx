import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS, PRICE } from '../lib/data';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';

export default function Home() {
const { lang, stock } = useStore();
const t = useTranslation(lang);

const ProductCard = ({ p }: { p: any }) => {
const stockCount = Object.values(stock[p.id] || {}).reduce(
(a, b) => a + b,
0
);

return (
  <Link to={`/product/${p.id}`} className="card">
    {p.limited && <span className="tag">Limited</span>}

    {stockCount === 0 && (
      <span className="tag soldout">{t('sold_out')}</span>
    )}

    <div className="thumb">
      <img
        src={p.img}
        loading="lazy"
        alt={p.name[lang]}
      />
    </div>

    <div className="card-body">
      <h3>{p.name[lang]}</h3>

      <div className="price">
        {PRICE(p.price)}
      </div>

      <div className="cta">
        <span>{t('view_product')}</span>
      </div>
    </div>
  </Link>
);

};

return (
<div>
<section
className="hero"
style={{
padding: 0,
minHeight: '85vh',
display: 'flex',
flexDirection: 'column'
}}
>
<div
className="hero-grid"
style={{
display: 'grid',
gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
minHeight: '85vh',
width: '100%'
}}
>
<div
style={{
backgroundImage: "url('/images/foto hoofdpagina links.jpg')",
backgroundSize: 'cover',
backgroundPosition: 'center'
}}
/>

      <div
        style={{
          backgroundColor: '#000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px',
          color: '#fff',
          alignItems: 'flex-start',
          textAlign: 'left'
        }}
      >
        <span
          className="eyebrow no-dash"
          style={{
            color: '#aaa',
            margin: 0
          }}
        >
          TripleThreadz — Atelier
        </span>

        <h1
          style={{
            marginTop: '14px',
            color: '#fff',
            fontSize: 'clamp(32px, 5vw, 60px)',
            lineHeight: '1.1',
            fontFamily: 'Times New Roman'
          }}
        >
          {t('hero_title')}
        </h1>

        <p
          className="lead"
          style={{
            color: '#ccc',
            margin: '22px 0 0',
            fontSize: '15px',
            lineHeight: '1.5'
          }}
        >
          {t('hero_sub')}
        </p>

        <div
          className="hero-actions"
          style={{
            justifyContent: 'flex-start',
            margin: '36px 0 0'
          }}
        >
          <Link
            to="/shop"
            className="btn btn-solid"
            style={{
              backgroundColor: '#fff',
              color: '#000',
              borderColor: '#fff'
            }}
          >
            {t('hero_cta1')}
          </Link>

          <Link
            to="/shop"
            className="btn"
            style={{
              borderColor: '#fff',
              color: '#fff'
            }}
          >
            {t('hero_cta2')}
          </Link>
        </div>
      </div>

      <div
        style={{
          backgroundImage: "url('/images/foto hoofdpagina rechts.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    </div>
  </section>

  <div
    className="benefits wrap"
    style={{ padding: 0 }}
  >
    <div className="benefit">
      <div className="mark">✓</div>
      <p>{t('benefit1')}</p>
    </div>

    <div className="benefit">
      <div className="mark">✓</div>
      <p>{t('benefit2')}</p>
    </div>

    <div className="benefit">
      <div className="mark">✓</div>
      <p>{t('benefit3')}</p>
    </div>

    <div className="benefit">
      <div className="mark">✓</div>
      <p>{t('benefit4')}</p>
    </div>
  </div>

  <section>
    <div className="wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow">
            {t('featured')}
          </span>

          <h2>{t('featured_h')}</h2>
        </div>

        <Link
          to="/shop"
          className="btn btn-sm"
        >
          {t('shop_h')} →
        </Link>
      </div>

      <div className="grid">
        {PRODUCTS
          .filter((p) => !p.limited)
          .map((p) => (
            <ProductCard
              key={p.id}
              p={p}
            />
          ))}
      </div>
    </div>
  </section>

  <section
    style={{
      background: 'var(--bg-alt)',
      borderTop: '1px solid var(--line-soft)',
      borderBottom: '1px solid var(--line-soft)'
    }}
  >
    <div className="wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow">Limited</span>

          <h2>{t('limited_h')}</h2>

          <p
            style={{
              color: 'var(--fg-dim)',
              fontSize: '14px',
              marginTop: '10px',
              maxWidth: '480px'
            }}
          >
            {t('limited_sub')}
          </p>
        </div>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(2, 1fr)'
        }}
      >
        {PRODUCTS
          .filter((p) => p.limited)
          .map((p) => (
            <ProductCard
              key={p.id}
              p={p}
            />
          ))}
      </div>
    </div>
  </section>

  <section>
    <div className="wrap craft">
      <div
        className="craft-img"
        style={{
          backgroundImage:
            "url('/images/foto bij het proces en bij het stukje over ons.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div>
        <span className="eyebrow">
          {t('craft_eyebrow')}
        </span>

        <h2
          style={{
            fontSize: 'clamp(30px, 4vw, 46px)',
            marginTop: '10px'
          }}
        >
          {t('craft_h')}
        </h2>

        <p>{t('craft_body')}</p>

        <ol>
          <li>
            <div>
              <b>{t('step1_t')}</b>
              <span>{t('step1_s')}</span>
            </div>
          </li>

          <li>
            <div>
              <b>{t('step2_t')}</b>
              <span>{t('step2_s')}</span>
            </div>
          </li>

          <li>
            <div>
              <b>{t('step3_t')}</b>
              <span>{t('step3_s')}</span>
            </div>
          </li>

          <li>
            <div>
              <b>{t('step4_t')}</b>
              <span>{t('step4_s')}</span>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</div>

);
}