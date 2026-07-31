import React from 'react';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';

export default function ReturnPolicy() {
  const { lang } = useStore();
  const t = useTranslation(lang);

  return (
    <section style={{ paddingTop: '56px' }}>
      <div className="wrap" style={{ maxWidth: '840px' }}>
        <h1 style={{ fontSize: 'clamp(38px, 6vw, 64px)' }}>{t('ret_title')}</h1>
        <hr className="stitch" style={{ margin: '26px 0' }} />
        
        <div style={{ marginTop: '40px', color: 'var(--fg-dim)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '20px' }}>{t('ret_intro')}</p>

          <h3 style={{ fontSize: '20px', color: 'var(--fg)', marginTop: '30px', marginBottom: '12px' }}>{t('ret_h1')}</h3>
          <p style={{ marginBottom: '20px' }}>{t('ret_p1')}</p>

          <h3 style={{ fontSize: '20px', color: 'var(--fg)', marginTop: '30px', marginBottom: '12px' }}>{t('ret_h2')}</h3>
          <p style={{ marginBottom: '20px' }}>{t('ret_p2')}</p>

          <h3 style={{ fontSize: '20px', color: 'var(--fg)', marginTop: '30px', marginBottom: '12px' }}>{t('ret_h3')}</h3>
          <p style={{ marginBottom: '20px' }}>{t('ret_p3')}</p>
        </div>
      </div>
    </section>
  );
}
