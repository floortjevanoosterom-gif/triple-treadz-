import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';

export default function Faq() {
  const { lang } = useStore();
  const t = useTranslation(lang);
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggle = (i: number) => {
    setOpenItems(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const faqs = [
    { q: t('faq1_q'), a: t('faq1_a') },
    { q: t('faq3_q'), a: t('faq3_a') },
    { q: t('faq4_q'), a: t('faq4_a') },
    { q: t('faq5_q'), a: t('faq5_a') },
    { q: t('faq6_q'), a: t('faq6_a') },
    { q: t('faq7_q'), a: t('faq7_a') },
    { q: t('faq8_q'), a: t('faq8_a') }
  ];

  return (
    <section style={{ paddingTop: '56px' }}>
      <div className="wrap" style={{ maxWidth: '840px' }}>
        <span className="eyebrow">FAQ</span>
        <h1 style={{ fontSize: 'clamp(38px, 6vw, 64px)', marginTop: '10px' }}>{t('faq_h')}</h1>
        
        <div style={{ marginTop: '40px' }}>
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${openItems.includes(i) ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => toggle(i)}>
                <span>{faq.q}</span>
                <span className="plus">+</span>
              </button>
              <div className="faq-a">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
