import React from 'react';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';

export default function About() {
const { lang } = useStore();
const t = useTranslation(lang);

return (
<section style={{ paddingTop: '56px' }}>
<div className="wrap">
<span className="eyebrow">{t('about_eyebrow')}</span>

    <h1
      style={{
        fontSize: 'clamp(38px, 6vw, 64px)',
        marginTop: '10px',
        maxWidth: '760px'
      }}
    >
      {t('about_h')}
    </h1>

    <div
      style={{
        width: '100%',
        height: 'clamp(280px, 45vw, 560px)',
        marginTop: '32px',
        marginBottom: '40px',
        backgroundImage:
          "url('/images/foto bij het proces en bij het stukje over ons.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    />

    <div className="two-col" style={{ marginTop: '40px' }}>
      <div>
        <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>
          Wie wij zijn & Onze passie
        </h3>

        <p
          style={{
            color: 'var(--fg-dim)',
            fontSize: '15px',
            lineHeight: '1.8',
            marginBottom: '20px'
          }}
        >
          TripleThreadz is ontstaan vanuit een diepe passie voor streetwear,
          zelfexpressie en echt ambacht. We maken custom sneakers die je
          nergens anders vindt. Van distressed denim en subtiel camo tot
          onze signature gele accenten; wij ontwerpen voor de bold, de
          creatieveling en iedereen die zijn eigen stijl durft te claimen.
        </p>

        <p
          style={{
            color: 'var(--fg-dim)',
            fontSize: '15px',
            lineHeight: '1.8'
          }}
        >
          We geloven niet in lopende banden en massaproductie. Bij ons draait
          het om aandacht voor detail, hoogwaardige materialen en de unieke
          touch die alleen handwerk kan bieden.
        </p>
      </div>

      <div>
        <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>
          Waarom iedere schoen uniek is
        </h3>

        <p
          style={{
            color: 'var(--fg-dim)',
            fontSize: '15px',
            lineHeight: '1.8',
            marginBottom: '20px'
          }}
        >
          Omdat we elke sneaker met de hand bewerken en opbouwen, is geen
          enkel paar exact hetzelfde. Het patroon van het denim, de slijtage
          op de randen en de verdeling van de kleuren hebben bij elk paar
          een eigen karakter. Dit is geen foutje; dit is het bewijs van
          handwerk.
        </p>

        <p
          style={{
            color: 'var(--fg-dim)',
            fontSize: '15px',
            lineHeight: '1.8'
          }}
        >
          Het productieproces kost gemiddeld drie weken. We nemen de tijd
          om jouw paar tot in de perfectie af te ronden. Het wachten wordt
          beloond met een meesterwerk dat speciaal voor jou is gemaakt.
        </p>
      </div>
    </div>
  </div>
</section>

);
}