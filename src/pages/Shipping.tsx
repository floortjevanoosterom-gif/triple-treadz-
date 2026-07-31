import React from 'react';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { PRICE } from '../lib/data';

export default function Shipping() {
  const { lang } = useStore();
  const t = useTranslation(lang);

  return (
    <section style={{ paddingTop: '56px' }}>
      <div className="wrap">
        <span className="eyebrow">{t('nav_shipping')}</span>
        <h1 style={{ fontSize: 'clamp(38px, 6vw, 64px)', marginTop: '10px' }}>{t('shipping_h')}</h1>
        <p style={{ color: 'var(--fg-dim)', marginTop: '10px' }}>{t('shipping_sub')}</p>
        
        <div className="two-col" style={{ marginTop: '50px' }}>
          <div>
            <h3 style={{ fontSize: '22px', marginBottom: '16px' }}>{t('ship_process_h')}</h3>
            <ol style={{ counterReset: 'step' }} className="craft-list">
              <li style={{ counterIncrement: 'step', padding: '14px 0', borderTop: '1px solid var(--line-soft)', display: 'flex', gap: '16px' }}>
                <span style={{ fontFamily: 'Space Mono', color: 'var(--mustard)' }}>01</span>
                <div>
                  <b style={{ display: 'block' }}>{t('step1_t')}</b>
                  <span style={{ color: 'var(--fg-dim)', fontSize: '13px' }}>{t('step1_s')}</span>
                </div>
              </li>
              <li style={{ counterIncrement: 'step', padding: '14px 0', borderTop: '1px solid var(--line-soft)', display: 'flex', gap: '16px' }}>
                <span style={{ fontFamily: 'Space Mono', color: 'var(--mustard)' }}>02</span>
                <div>
                  <b style={{ display: 'block' }}>{t('step2_t')}</b>
                  <span style={{ color: 'var(--fg-dim)', fontSize: '13px' }}>{t('step2_s')}</span>
                </div>
              </li>
              <li style={{ counterIncrement: 'step', padding: '14px 0', borderTop: '1px solid var(--line-soft)', display: 'flex', gap: '16px' }}>
                <span style={{ fontFamily: 'Space Mono', color: 'var(--mustard)' }}>03</span>
                <div>
                  <b style={{ display: 'block' }}>{t('step3_t')}</b>
                  <span style={{ color: 'var(--fg-dim)', fontSize: '13px' }}>{t('step3_s')}</span>
                </div>
              </li>
              <li style={{ counterIncrement: 'step', padding: '14px 0', borderTop: '1px solid var(--line-soft)', borderBottom: '1px solid var(--line-soft)', display: 'flex', gap: '16px' }}>
                <span style={{ fontFamily: 'Space Mono', color: 'var(--mustard)' }}>04</span>
                <div>
                  <b style={{ display: 'block' }}>{t('step4_t')}</b>
                  <span style={{ color: 'var(--fg-dim)', fontSize: '13px' }}>{t('step4_s')}</span>
                </div>
              </li>
            </ol>
            <div className="info-box" style={{ marginTop: '30px' }}>
              <div className="h">{t('delivery_h')}</div>
              <p>{t('delivery_body')}</p>
            </div>
          </div>
          
          <div>
            <h3 style={{ fontSize: '22px', marginBottom: '16px' }}>{t('ship_costs_h')}</h3>
            <div className="info-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span>{t('ship_nl_lbl')}</span>
                <span className="mono">{PRICE(8)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid var(--line-soft)' }}>
                <span>{t('ship_eu_lbl')}</span>
                <span className="mono">{PRICE(14.50)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid var(--line-soft)' }}>
                <span>{t('ship_ukus_lbl')}</span>
                <span className="mono">{PRICE(33)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid var(--line-soft)' }}>
                <span>{t('ship_rest_lbl')}</span>
                <span className="mono">{PRICE(20)}</span>
              </div>
              
              <p style={{ marginTop: '14px', color: 'var(--mustard)' }}>{t('ship_free')}</p>
              <div style={{ marginTop: '24px', fontSize: '13px', color: 'var(--fg-dim)' }}>
                <strong style={{ color: 'var(--fg)', display: 'block', marginBottom: '8px' }}>{t('customs_h')}</strong>
                <p style={{ marginBottom: '8px' }}>{t('customs_p')}</p>
                <ul style={{ paddingLeft: '16px', listStyleType: 'disc', marginBottom: '8px' }}>
                  <li>{t('customs_l1')}</li>
                  <li>{t('customs_l2')}</li>
                  <li>{t('customs_l3')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
