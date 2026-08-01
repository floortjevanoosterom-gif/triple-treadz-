import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { PRICE, getShippingCost, FREE_FROM, COUNTRIES } from '../lib/data';

export default function Checkout() {
  const { lang, cart, clearCart } = useStore();
  const t = useTranslation(lang);

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
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const shoePairs = cart
    .filter((c) => c.type === 'shoe')
    .reduce((a, c) => a + c.qty, 0);

  const subtotal = cart.reduce(
    (a, c) => a + c.price * c.qty,
    0
  );

  const shipCost =
    shoePairs >= FREE_FROM
      ? 0
      : getShippingCost(formData.country);

  const total = subtotal + shipCost;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [orderPlaced]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        t('err_first') || 'Verplicht';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        t('err_last') || 'Verplicht';
    }

    if (!formData.email.trim()) {
      newErrors.email =
        t('err_email') || 'Verplicht';
    } else if (
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        t('err_email_invalid') ||
        'Ongeldig e-mailadres';
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        t('err_phone') || 'Verplicht';
    }

    if (!formData.street.trim()) {
      newErrors.street =
        t('err_street') || 'Verplicht';
    }

    if (!formData.houseNumber.trim()) {
      newErrors.houseNumber =
        t('err_house') || 'Verplicht';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode =
        t('err_postal') || 'Verplicht';
    } else if (
      formData.country === 'Nederland' &&
      !/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(
        formData.postalCode
      )
    ) {
      newErrors.postalCode =
        t('err_postal_invalid') ||
        'Ongeldige postcode (bijv. 1234 AB)';
    }

    if (!formData.city.trim()) {
      newErrors.city =
        t('err_city') || 'Verplicht';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (attemptedSubmit) {
      setTimeout(() => {
        validate();
      }, 0);
    }
  };

  const placeOrder = async () => {
    setAttemptedSubmit(true);

    if (!validate()) {
      return;
    }

    if (cart.length === 0) {
      return;
    }

    setLoading(true);

    const generatedOrderNumber = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    const orderData = {
      orderNumber: generatedOrderNumber,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.street} ${formData.houseNumber}`,
      postalCode: formData.postalCode,
      city: formData.city,
      country: formData.country,
      method: formData.method,
      notes: formData.notes,
      cart,
      subtotal,
      shipCost,
      total
    };

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(
          'Order request failed'
        );
      }

      /*
       * De server doet nu alles wat nodig is:
       *
       * 1. Bestelling opslaan
       * 2. Status WAITING_FOR_PAYMENT
       * 3. paymentStatus UNPAID
       * 4. Twilio WhatsApp-bericht naar jou
       *
       * De klant hoeft dus NIET meer zelf
       * een WhatsApp-bericht te versturen.
       */

      setOrderNumber(generatedOrderNumber);
      setOrderPlaced(true);

      clearCart();

      if ((window as any).showToast) {
        (window as any).showToast(
          'Bestelling aangemaakt!'
        );
      }
    } catch (error) {
      console.error(
        'Order error:',
        error
      );

      if ((window as any).showToast) {
        (window as any).showToast(
          t('err_order') ||
            'Er is een fout opgetreden bij het plaatsen van de bestelling.'
        );
      } else {
        alert(
          t('err_order') ||
            'Er is een fout opgetreden bij het plaatsen van de bestelling.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /*
   * BEDANKPAGINA
   */
  if (orderPlaced) {
    return (
      <section
        style={{
          paddingTop: '80px',
          minHeight: '70vh'
        }}
      >
        <div
          className="wrap"
          style={{
            maxWidth: '760px',
            textAlign: 'center'
          }}
        >
          <span className="eyebrow">
            TripleThreadz
          </span>

          <h1
            style={{
              fontSize:
                'clamp(40px, 6vw, 64px)',
              fontFamily:
                'Times New Roman',
              marginTop: '12px'
            }}
          >
            Bedankt voor je bestelling!
          </h1>

          <hr
            className="stitch"
            style={{
              margin: '26px auto',
              maxWidth: '100px'
            }}
          />

          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.7',
              marginBottom: '12px'
            }}
          >
            We hebben je bestelling
            goed ontvangen.
          </p>

          <p
            style={{
              fontSize: '17px',
              lineHeight: '1.7',
              color: 'var(--fg-dim)',
              marginBottom: '12px'
            }}
          >
            Je bestelnummer is{' '}
            <strong>
              #{orderNumber}
            </strong>.
          </p>

          <div
            style={{
              marginTop: '28px',
              marginBottom: '28px',
              padding: '24px',
              border:
                '1px solid var(--line-soft)',
              background:
                'var(--bg)'
            }}
          >
            <p
              style={{
                fontSize: '18px',
                lineHeight: '1.7',
                margin: 0
              }}
            >
              Je bestelling wordt
              verwerkt zodra de
              betaling is ontvangen.
            </p>

            <p
              style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color:
                  'var(--fg-dim)',
                marginTop: '12px',
                marginBottom: 0
              }}
            >
              We nemen contact met je
              op met het
              betaalverzoek.
            </p>
          </div>

          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: 'var(--fg-dim)'
            }}
          >
            Je hoeft niets meer te
            doen op deze pagina.
          </p>
        </div>
      </section>
    );
  }

  /*
   * LEGE WINKELWAGEN
   */
  if (cart.length === 0) {
    return (
      <section
        style={{
          paddingTop: '56px',
          minHeight: '60vh'
        }}
      >
        <div className="wrap">
          <h1
            style={{
              fontSize:
                'clamp(40px, 6vw, 64px)'
            }}
          >
            {t('cart_h')}
          </h1>

          <hr
            className="stitch"
            style={{
              margin: '26px 0'
            }}
          />

          <div className="empty-state">
            <p>
              {t('cart_empty') ||
                'Je winkelwagen is leeg.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  /*
   * CHECKOUT
   */
  return (
    <section
      style={{
        paddingTop: '56px',
        minHeight: '60vh'
      }}
    >
      <div className="wrap">
        <h1
          style={{
            fontSize:
              'clamp(40px, 6vw, 64px)'
          }}
        >
          {t('checkout_h')}
        </h1>

        <hr
          className="stitch"
          style={{
            margin: '26px 0'
          }}
        />

        <div className="two-col">
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              placeOrder();
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: '16px'
              }}
            >
              <div className="form-field">
                <label>
                  {t('form_firstname')}
                </label>

                <input
                  name="firstName"
                  type="text"
                  value={
                    formData.firstName
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    errors.firstName
                      ? {
                          borderColor:
                            'red'
                        }
                      : {}
                  }
                />

                {errors.firstName && (
                  <span
                    style={{
                      color: 'red',
                      fontSize: '12px',
                      marginTop: '4px',
                      display: 'block'
                    }}
                  >
                    {
                      errors.firstName
                    }
                  </span>
                )}
              </div>

              <div className="form-field">
                <label>
                  {t('form_lastname')}
                </label>

                <input
                  name="lastName"
                  type="text"
                  value={
                    formData.lastName
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    errors.lastName
                      ? {
                          borderColor:
                            'red'
                        }
                      : {}
                  }
                />

                {errors.lastName && (
                  <span
                    style={{
                      color: 'red',
                      fontSize: '12px',
                      marginTop: '4px',
                      display: 'block'
                    }}
                  >
                    {
                      errors.lastName
                    }
                  </span>
                )}
              </div>
            </div>

            <div className="form-field">
              <label>
                {t('form_email')}
              </label>

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                style={
                  errors.email
                    ? {
                        borderColor: 'red'
                      }
                    : {}
                }
              />

              {errors.email && (
                <span
                  style={{
                    color: 'red',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'block'
                  }}
                >
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-field">
              <label>
                {t('form_phone')}
              </label>

              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                style={
                  errors.phone
                    ? {
                        borderColor: 'red'
                      }
                    : {}
                }
              />

              {errors.phone && (
                <span
                  style={{
                    color: 'red',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'block'
                  }}
                >
                  {errors.phone}
                </span>
              )}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '2fr 1fr',
                gap: '16px'
              }}
            >
              <div className="form-field">
                <label>
                  {t('form_street')}
                </label>

                <input
                  name="street"
                  type="text"
                  value={
                    formData.street
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    errors.street
                      ? {
                          borderColor:
                            'red'
                        }
                      : {}
                  }
                />

                {errors.street && (
                  <span
                    style={{
                      color: 'red',
                      fontSize: '12px',
                      marginTop: '4px',
                      display: 'block'
                    }}
                  >
                    {errors.street}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label>
                  {t(
                    'form_housenumber'
                  )}
                </label>

                <input
                  name="houseNumber"
                  type="text"
                  value={
                    formData.houseNumber
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    errors.houseNumber
                      ? {
                          borderColor:
                            'red'
                        }
                      : {}
                  }
                />

                {errors.houseNumber && (
                  <span
                    style={{
                      color: 'red',
                      fontSize: '12px',
                      marginTop: '4px',
                      display: 'block'
                    }}
                  >
                    {
                      errors.houseNumber
                    }
                  </span>
                )}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 2fr',
                gap: '16px'
              }}
            >
              <div className="form-field">
                <label>
                  {t('form_postal')}
                </label>

                <input
                  name="postalCode"
                  type="text"
                  value={
                    formData.postalCode
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    errors.postalCode
                      ? {
                          borderColor:
                            'red'
                        }
                      : {}
                  }
                />

                {errors.postalCode && (
                  <span
                    style={{
                      color: 'red',
                      fontSize: '12px',
                      marginTop: '4px',
                      display: 'block'
                    }}
                  >
                    {
                      errors.postalCode
                    }
                  </span>
                )}
              </div>

              <div className="form-field">
                <label>
                  {t('form_city')}
                </label>

                <input
                  name="city"
                  type="text"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    errors.city
                      ? {
                          borderColor:
                            'red'
                        }
                      : {}
                  }
                />

                {errors.city && (
                  <span
                    style={{
                      color: 'red',
                      fontSize: '12px',
                      marginTop: '4px',
                      display: 'block'
                    }}
                  >
                    {errors.city}
                  </span>
                )}
              </div>
            </div>

            <div className="form-field">
              <label>
                {t('ship_to')}
              </label>

              <select
                name="country"
                value={
                  formData.country
                }
                onChange={
                  handleChange
                }
              >
                {COUNTRIES.map(
                  (country) => (
                    <option
                      key={country}
                      value={country}
                    >
                      {country}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* BETAALMETHODE */}
            <div
              style={{
                marginTop: '24px',
                padding: '18px',
                border:
                  '1px solid var(--line-soft)'
              }}
            >
              <strong
                style={{
                  display: 'block',
                  marginBottom: '14px',
                  fontSize: '18px'
                }}
              >
                {t(
                  'co_pay_method'
                )}
              </strong>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              >
                <input
                  type="radio"
                  name="method"
                  value="ideal"
                  checked={
                    formData.method ===
                    'ideal'
                  }
                  onChange={
                    handleChange
                  }
                />

                <span>
                  iDEAL
                </span>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="method"
                  value="paypal"
                  checked={
                    formData.method ===
                    'paypal'
                  }
                  onChange={
                    handleChange
                  }
                />

                <span>
                  PayPal
                </span>
              </label>

              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  background:
                    'var(--line-soft)',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}
              >
                Je betaalt nog niet
                direct.

                <br />

                Na het plaatsen van je
                bestelling ontvang je
                een betaalverzoek.
              </div>
            </div>

            <div
              className="form-field"
              style={{
                marginTop: '20px'
              }}
            >
              <label>
                Opmerking (optioneel)
              </label>

              <textarea
                name="notes"
                value={
                  formData.notes
                }
                onChange={
                  handleChange
                }
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  border:
                    '1px solid var(--line-soft)',
                  background:
                    'var(--bg)',
                  color:
                    'var(--fg)',
                  resize: 'vertical'
                }}
              />
            </div>

            {attemptedSubmit &&
              Object.keys(errors)
                .length > 0 && (
                <div
                  style={{
                    color: 'red',
                    fontSize: '14px',
                    marginTop: '16px'
                  }}
                >
                  {t(
                    'co_err_fields'
                  ) ||
                    'Controleer de ingevulde gegevens.'}
                </div>
              )}

            <button
              type="submit"
              className="btn btn-solid"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '20px',
                background: '#000',
                color: '#fff',
                opacity: loading
                  ? 0.5
                  : 1,
                cursor: loading
                  ? 'not-allowed'
                  : 'pointer'
              }}
            >
              {loading
                ? 'Bestelling wordt geplaatst...'
                : t(
                    'co_place_order'
                  ) ||
                  'Bestelling plaatsen'}
            </button>
          </form>

          {/* BESTELOVERZICHT */}
          <div>
            <div
              className="cart-summary"
              style={{
                marginTop: 0
              }}
            >
              <div className="row">
                <span>
                  {t('subtotal')}
                </span>

                <span className="mono">
                  {PRICE(subtotal)}
                </span>
              </div>

              <div className="row">
                <span>
                  {t('shipping')}
                </span>

                <span className="mono">
                  {shipCost === 0
                    ? t('free')
                    : PRICE(shipCost)}
                </span>
              </div>

              <div className="row total">
                <span>
                  {t('total')}
                </span>

                <span className="mono">
                  {PRICE(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
