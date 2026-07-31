import React from 'react';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { WA_NUMBER, EMAIL, PHONE_DISPLAY } from '../lib/data';

export default function Contact() {
  const { lang } = useStore();
  const t = useTranslation(lang);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (window as any).showToast(t('form_send') + ' ✓');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section style={{ paddingTop: '56px' }}>
      <div className="wrap">
        <span className="eyebrow">{t('nav_contact')}</span>
        <h1 style={{ fontSize: 'clamp(38px, 6vw, 64px)', marginTop: '10px' }}>{t('contact_h')}</h1>
        <p style={{ color: 'var(--fg-dim)', marginTop: '10px', maxWidth: '480px' }}>{t('contact_sub')}</p>
        
        <div className="two-col" style={{ marginTop: '44px' }}>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>{t('form_name')}</label>
                <input required type="text" />
              </div>
              <div className="form-field">
                <label>{t('form_email')}</label>
                <input required type="email" />
              </div>
              <div className="form-field">
                <label>{t('form_message')}</label>
                <textarea required></textarea>
              </div>
              <button className="btn btn-solid" style={{ background: '#000', color: '#fff' }} type="submit">{t('form_send')}</button>
            </form>
          </div>
          
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '18px' }}>{t('contact_direct_h')}</h3>
            <div className="info-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line-soft)' }}>
                <span>{t('contact_wa')}</span>
                <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="mono" style={{ color: 'var(--mustard)' }}>{PHONE_DISPLAY}</a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line-soft)' }}>
                <span>{t('contact_phone')}</span>
                <a href={`tel:+${WA_NUMBER}`} className="mono">{PHONE_DISPLAY}</a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span>{t('contact_email')}</span>
                <a href={`mailto:${EMAIL}`} className="mono" style={{ wordBreak: 'break-all' }}>{EMAIL}</a>
              </div>
            </div>
            
            <div className="socials" style={{ marginTop: '20px' }}>
              <a href="https://www.tiktok.com/@triplethreadz8" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M16.5 2c.4 2.2 2 3.9 4.5 4.2v3.1c-1.6 0-3.1-.5-4.5-1.4v6.9c0 3.6-2.9 6.2-6.3 6.2S4 18.4 4 14.8c0-3.5 2.7-6.1 6-6.2v3.2c-1.6.1-2.8 1.4-2.8 3 0 1.7 1.4 3 3.1 3s3.1-1.3 3.1-3V2h3.1z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
