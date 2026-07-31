import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { PRICE, getShippingCost, FREE_FROM, COUNTRIES } from '../lib/data';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { lang, cart, clearCart } = useStore();
  const t = useTranslation(lang);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    street: '', 
    houseNumber: '', 
    postalCode: '', 
    city: '', 
    country: 'Nederland',
    method: 'ideal',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const shoePairs = cart.filter(c => c.type === 'shoe').reduce((a, c) => a + c.qty, 0);
  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const shipCost = shoePairs >= FREE_FROM ? 0 : getShippingCost(formData.country);
  const total = subtotal + shipCost;

  const validate = (data = formData, showErrors = attemptedSubmit) => {
    const newErrors: Record<string, string> = {};
    if (!data.firstName.trim()) newErrors.firstName = t('err_first') || 'Verplicht';
    if (!data.lastName.trim()) newErrors.lastName = t('err_last') || 'Verplicht';
    
    if (!data.email.trim()) {
      newErrors.email = t('err_email') || 'Verplicht';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
      newErrors.email = t('err_email_invalid') || 'Ongeldig e-mailadres';
    }

    if (!data.phone.trim()) newErrors.phone = t('err_phone') || 'Verplicht';
    if (!data.street.trim()) newErrors.street = t('err_street') || 'Verplicht';
    if (!data.houseNumber.trim()) newErrors.houseNumber = t('err_house') || 'Verplicht';
    
    if (!data.postalCode.trim()) {
      newErrors.postalCode = t('err_postal') || 'Verplicht';
    } else if (data.country === 'Nederland' && !/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(data.postalCode)) {
      newErrors.postalCode = t('err_postal_invalid') || 'Ongeldige postcode (bijv. 1234 AB)';
    }

    if (!data.city.trim()) newErrors.city = t('err_city') || 'Verplicht';

    if (showErrors) {
      setErrors(newErrors);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isPaid) {
      window.scrollTo(0, 0);
    }
  }, [isPaid]);

  useEffect(() => {
    setIsValid(validate(formData, attemptedSubmit));
  }, [formData, attemptedSubmit, lang]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (attemptedSubmit) {
       validate({ ...formData, [e.target.name]: e.target.value }, true);
    }
  };

  const finalizeOrder = async (overrideMethod?: string) => {
    setLoading(true);
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem('lastOrder', JSON.stringify({ orderNumber, method: overrideMethod || formData.method }));
    
    const orderData = {
      orderNumber,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.street} ${formData.houseNumber}`,
      postalCode: formData.postalCode,
      city: formData.city,
      country: formData.country,
      method: overrideMethod || formData.method,
      notes: formData.notes,
      cart: cart,
      subtotal,
      shipCost,
      total
    };

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        setIsPaid(true); // Order successful
        clearCart();
        
        let msg = `🛒 *NIEUWE BESTELLING*\n\n`;
        msg += `*Order:* #${orderNumber}\n\n`;
        msg += `👤 *Klant*\nNaam: ${orderData.name}\nTelefoon: ${orderData.phone}\nE-mail: ${orderData.email}\n\n`;
        msg += `📍 *Adres*\n${orderData.address}\n${orderData.postalCode} ${orderData.city}\n${orderData.country}\n\n`;
        
        msg += `🛍️ *Bestelling*\n`;
        msg += orderData.cart.map((item) => `${item.qty}x ${item.name} ${item.size ? `(Maat: ${item.size})` : ''} — €${(item.price * item.qty).toFixed(2)}`).join('\n') + '\n\n';
        
        msg += `💰 *Totaal: €${orderData.total.toFixed(2)}*\n\n`;
        
        msg += `💳 *Gewenste betaalmethode: ${orderData.method === 'ideal' ? 'iDEAL' : 'PayPal'}*\n\n`;
        msg += `🟠 *Status: WACHT OP BETALING*`;
        
        if (orderData.notes) {
          msg += `\n\n📝 *Opmerking:* \n${orderData.notes}`;
        }

        const waUrl = `https://wa.me/31639741576?text=${encodeURIComponent(msg)}`;
        localStorage.setItem('lastOrder', JSON.stringify({ orderNumber, method: overrideMethod || formData.method, waUrl }));
        
        (window as any).showToast(t('success_order') || 'Bestelling succesvol geplaatst!');
      } else {
        (window as any).showToast(t('err_order') || 'Er is een fout opgetreden.');
      }
    } catch (err) {
      (window as any).showToast(t('err_order') || 'Er is een fout opgetreden.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAttemptedSubmit(true);
    
    if (!validate(formData, true)) {
      return false;
    }
    
    try {
      setLoading(true);
      const query = encodeURIComponent(`${formData.street} ${formData.houseNumber}, ${formData.postalCode} ${formData.city}`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${query}`);
      const data = await res.json();
      
      let isValidAddress = false;
      if (data && data.length > 0) {
        isValidAddress = data.some((d) => {
          if (!d.address) return false;
          const normalize = (s) => (s || '').toLowerCase().trim();
          const countryName = normalize(formData.country);
          const resCountry = normalize(d.address.country);
          const resCode = normalize(d.address.country_code);
          
          if (countryName === resCountry) return true;
          
                    const codeMap: Record<string, string> = {
            "nederland": "nl", "belgië": "be", "duitsland": "de", "frankrijk": "fr", "verenigd koninkrijk": "gb", "spanje": "es", "italië": "it", "verenigde staten": "us", "canada": "ca", "australië": "au",
            "afghanistan": "af", "albanië": "al", "algerije": "dz", "andorra": "ad", "angola": "ao", "antigua en barbuda": "ag", "argentinië": "ar", "armenië": "am", "azerbeidzjan": "az", "bahama's": "bs", "bahrein": "bh", "bangladesh": "bd", "barbados": "bb", "belize": "bz", "benin": "bj", "bhutan": "bt", "bolivia": "bo", "bosnië en herzegovina": "ba", "botswana": "bw", "brazilië": "br", "brunei": "bn", "bulgarije": "bg", "burkina faso": "bf", "burundi": "bi", "cambodja": "kh", "centraal-afrikaanse republiek": "cf", "chili": "cl", "china": "cn", "colombia": "co", "comoren": "km", "congo-brazzaville": "cg", "congo-kinshasa": "cd", "costa rica": "cr", "cuba": "cu", "cyprus": "cy", "denemarken": "dk", "djibouti": "dj", "dominica": "dm", "dominicaanse republiek": "do", "ecuador": "ec", "egypte": "eg", "el salvador": "sv", "equatoriaal-guinea": "gq", "eritrea": "er", "estland": "ee", "eswatini": "sz", "ethiopië": "et", "fiji": "fj", "filipijnen": "ph", "finland": "fi", "gabon": "ga", "gambia": "gm", "georgië": "ge", "ghana": "gh", "grenada": "gd", "griekenland": "gr", "guatemala": "gt", "guinee": "gn", "guinee-bissau": "gw", "guyana": "gy", "haïti": "ht", "honduras": "hn", "hongarije": "hu", "ierland": "ie", "ijsland": "is", "india": "in", "indonesië": "id", "irak": "iq", "iran": "ir", "israël": "il", "ivoorkust": "ci", "jamaica": "jm", "japan": "jp", "jemen": "ye", "jordanië": "jo", "kaapverdië": "cv", "kameroen": "cm", "kazachstan": "kz", "kenia": "ke", "kirgizië": "kg", "kiribati": "ki", "koeweit": "kw", "kroatië": "hr", "laos": "la", "lesotho": "ls", "letland": "lv", "libanon": "lb", "liberia": "lr", "libië": "ly", "liechtenstein": "li", "litouwen": "lt", "luxemburg": "lu", "madagaskar": "mg", "malawi": "mw", "malediven": "mv", "maleisië": "my", "mali": "ml", "malta": "mt", "marokko": "ma", "marshalleilanden": "mh", "mauritanië": "mr", "mauritius": "mu", "mexico": "mx", "micronesië": "fm", "moldavië": "md", "monaco": "mc", "mongolië": "mn", "montenegro": "me", "mozambique": "mz", "myanmar": "mm", "namibië": "na", "nauru": "nr", "nepal": "np", "nicaragua": "ni", "nieuw-zeeland": "nz", "niger": "ne", "nigeria": "ng", "noord-korea": "kp", "noord-macedonië": "mk", "noorwegen": "no", "oeganda": "ug", "oekraïne": "ua", "oezbekistan": "uz", "oman": "om", "oostenrijk": "at", "oost-timor": "tl", "pakistan": "pk", "palau": "pw", "panama": "pa", "papoea-nieuw-guinea": "pg", "paraguay": "py", "peru": "pe", "polen": "pl", "portugal": "pt", "qatar": "qa", "roemenië": "ro", "rusland": "ru", "rwanda": "rw", "saint kitts en nevis": "kn", "saint lucia": "lc", "saint vincent en de grenadines": "vc", "salomonseilanden": "sb", "samoa": "ws", "san marino": "sm", "sao tomé en principe": "st", "saoedi-arabië": "sa", "senegal": "sn", "servië": "rs", "seychellen": "sc", "sierra leone": "sl", "singapore": "sg", "slovenië": "si", "slowakije": "sk", "soedan": "sd", "somalië": "so", "sri lanka": "lk", "suriname": "sr", "syrië": "sy", "tadzjikistan": "tj", "tanzania": "tz", "thailand": "th", "togo": "tg", "tonga": "to", "trinidad en tobago": "tt", "tsjaad": "td", "tsjechië": "cz", "tunesië": "tn", "turkije": "tr", "turkmenistan": "tm", "tuvalu": "tv", "uruguay": "uy", "vanuatu": "vu", "vaticaanstad": "va", "venezuela": "ve", "verenigde arabische emiraten": "ae", "vietnam": "vn", "wit-rusland": "by", "zambia": "zm", "zimbabwe": "zw", "zuid-afrika": "za", "zuid-korea": "kr", "zuid-soedan": "ss", "zweden": "se", "zwitserland": "ch"
          };
          if (codeMap[countryName] === resCode) return true;
          if (!codeMap[countryName]) return true; // Accept if not strictly in map
          return false;
        });
      }
      
      setLoading(false);
      
      if (!isValidAddress) {
        alert(t('err_address_match') || 'Het ingevoerde adres komt niet overeen met het geselecteerde land. Controleer je adres en land.');
        return false;
      }
      
    } catch (err) {
      setLoading(false);
      console.warn("Geocoding failed", err);
    }

    return true;
  };

  

  // Check URL for Stripe return_url logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      const pendingStr = localStorage.getItem('pendingOrder');
      if (pendingStr) {
        const pending = JSON.parse(pendingStr);
        localStorage.removeItem('pendingOrder');
        
        // Finalize
        fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber: pending.orderNumber,
            name: `${pending.formData.firstName} ${pending.formData.lastName}`,
            email: pending.formData.email,
            phone: pending.formData.phone,
            address: `${pending.formData.street} ${pending.formData.houseNumber}`,
            postalCode: pending.formData.postalCode,
            city: pending.formData.city,
            country: pending.formData.country,
            method: 'paypal',
            cart: pending.cart,
            subtotal: pending.subtotal,
            shipCost: pending.shipCost,
            total: pending.total
          })
        }).then(res => {
          if (res.ok) {
            setIsPaid(true);
            (window as any).showToast(t('success_order') || 'Bestelling succesvol geplaatst!');
            clearCart();
            // navigate to clean URL
            navigate('/');
          }
        });
      }
    }
  }, []);

    if (isPaid) {
    const pendingStr = localStorage.getItem('lastOrder');
    let orderNum = '';
    let method = '';
    let waUrl = '';
    if (pendingStr) {
      try {
         const o = JSON.parse(pendingStr);
         orderNum = o.orderNumber;
         method = o.method;
         waUrl = o.waUrl;
      } catch(e) {}
    }
    return (
      <section style={{ paddingTop: '56px', minHeight: '60vh' }}>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontFamily: 'Times New Roman' }}>{t('co_success_h')}</h1>
          <hr className="stitch" style={{ margin: '26px auto', maxWidth: '100px' }} />
          <p style={{ fontSize: '18px', marginBottom: '16px' }}>{t('co_success_p1a')}<strong>#{orderNum}</strong>{t('co_success_p1b')}</p>
          <p style={{ fontSize: '18px', marginBottom: '16px' }}>{t('co_success_wa_p')}</p>
          <p style={{ fontSize: '18px', marginBottom: '16px' }}>{t('co_success_pay_p1')}<strong>{method === 'ideal' ? 'iDEAL' : 'PayPal'}</strong>{t('co_success_pay_p2')}</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>{t('co_success_wait')}</p>
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-solid" style={{ padding: '16px 32px', fontSize: '18px', display: 'inline-block', background: '#000', color: '#fff', border: 'none' }}>
              {t('co_success_wa_btn')}
            </a>
          )}
        </div>
      </section>
    );
  }

  if (cart.length === 0 && !isPaid) {
    return (
      <section style={{ paddingTop: '56px', minHeight: '60vh' }}>
        <div className="wrap">
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>{t('cart_h')}</h1>
          <hr className="stitch" style={{ margin: '26px 0' }} />
          <div className="empty-state">
            <p>{t('cart_empty') || 'Je winkelwagen is leeg.'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ paddingTop: '56px', minHeight: '60vh' }}>
      <div className="wrap">
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>{t('checkout_h')}</h1>
        <hr className="stitch" style={{ margin: '26px 0' }} />
        
        <div className="two-col">
          <form  noValidate>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-field">
                <label>{t('form_firstname')}</label>
                <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} style={errors.firstName ? { borderColor: 'red' } : {}} />
                {errors.firstName && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.firstName}</span>}
              </div>
              <div className="form-field">
                <label>{t('form_lastname')}</label>
                <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} style={errors.lastName ? { borderColor: 'red' } : {}} />
                {errors.lastName && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-field">
              <label>{t('form_email')}</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} style={errors.email ? { borderColor: 'red' } : {}} />
              {errors.email && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
            </div>

            <div className="form-field">
              <label>{t('form_phone')}</label>
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} style={errors.phone ? { borderColor: 'red' } : {}} />
              {errors.phone && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div className="form-field">
                <label>{t('form_street')}</label>
                <input name="street" type="text" value={formData.street} onChange={handleChange} style={errors.street ? { borderColor: 'red' } : {}} />
                {errors.street && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.street}</span>}
              </div>
              <div className="form-field">
                <label>{t('form_housenumber')}</label>
                <input name="houseNumber" type="text" value={formData.houseNumber} onChange={handleChange} style={errors.houseNumber ? { borderColor: 'red' } : {}} />
                {errors.houseNumber && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.houseNumber}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
              <div className="form-field">
                <label>{t('form_postal')}</label>
                <input name="postalCode" type="text" value={formData.postalCode} onChange={handleChange} style={errors.postalCode ? { borderColor: 'red' } : {}} />
                {errors.postalCode && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.postalCode}</span>}
              </div>
              <div className="form-field">
                <label>{t('form_city')}</label>
                <input name="city" type="text" value={formData.city} onChange={handleChange} style={errors.city ? { borderColor: 'red' } : {}} />
                {errors.city && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.city}</span>}
              </div>
            </div>
            
            <div className="form-field">
              <label>{t('ship_to')}</label>
              <select name="country" value={formData.country} onChange={handleChange}>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            

            {/* BETALEN (HANDMATIG) */}
            <div style={{ marginTop: '20px' }}>
              <div className="form-field">
                <label>Opmerking (optioneel)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', border: '1px solid var(--line-soft)', background: 'var(--bg)', color: 'var(--fg)', resize: 'vertical' }}></textarea>
              </div>

              <div style={{ marginTop: '24px', padding: '16px', border: '1px solid var(--line-soft)' }}>
                <strong style={{ display: 'block', marginBottom: '12px', fontSize: '18px' }}>{t('co_pay_method')}</strong>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                  <input type="radio" name="method" value="ideal" checked={formData.method === 'ideal'} onChange={handleChange} />
                  <span>iDEAL</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px' }}>
                  <input type="radio" name="method" value="paypal" checked={formData.method === 'paypal'} onChange={handleChange} />
                  <span>PayPal</span>
                </label>
                
                <p style={{ fontSize: '14px', color: 'var(--fg-dim)', fontStyle: 'italic', marginBottom: '16px' }}>"{t('co_pay_info')}"</p>
                
                {!isValid && attemptedSubmit && <div style={{ color: 'red', fontSize: '14px', marginBottom: '12px' }}>{t('co_err_fields')}</div>}
                
                <button 
                  type="button" 
                  className="btn btn-solid" 
                  style={{ width: '100%', background: '#000', color: '#fff', opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}
                  onClick={async () => {
                    const valid = await handlePreSubmit();
                    if (valid) {
                      finalizeOrder(formData.method);
                    }
                  }}
                >
                  {loading ? t('co_loading') : t('co_place_order')}
                </button>
              </div>
            </div>
            </form>

          <div>
            <div className="cart-summary" style={{ marginTop: 0 }}>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
