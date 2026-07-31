import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS, PRICE } from '../lib/data';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';

export default function Product() {
  const { id } = useParams();
  const { lang, stock, addToCart } = useStore();
  const t = useTranslation(lang);
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];

  const sizes = stock[p.id];
  const sizeKeys = ['36', '36.5', '37', '38', '38.5', '39', '39.5', '40', '40.5', '41', '41.5', '42', '43', '44'];
  const stockTotal = Object.values(sizes).reduce((a, b) => a + b, 0);

  const galleryImages = p.images?.length ? p.images : [p.img];

  const [selected, setSelected] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [restockEmail, setRestockEmail] = useState('');
  const [loadingRestock, setLoadingRestock] = useState(false);

  const handleAdd = () => {
    if (!selected) {
      (window as any).showToast(t('select_size'));
      return;
    }

    if ((sizes[selected] || 0) <= 0) {
      return;
    }

    addToCart({
      key: `shoe-${p.id}-${selected}`,
      type: 'shoe',
      productId: p.id,
      name: p.name[lang],
      price: p.price,
      size: selected,
      qty: 1,
      ph: p.ph,
      img: p.img
    });

    (window as any).showToast(t('added_to_cart'));
    setSelected(null);
  };

  const handleRestock = async () => {
    if (!restockEmail || !selected) return;

    setLoadingRestock(true);

    try {
      const res = await fetch('/api/restock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: restockEmail,
          productId: p.id,
          productName: p.name,
          size: selected
        })
      });

      if (res.ok) {
        (window as any).showToast(t('restock_success'));
        setRestockEmail('');
      } else {
        const data = await res.json().catch(() => null);
        (window as any).showToast(
          data && data.error
            ? data.error
            : (t('restock_err') || 'Fout bij aanmelden.')
        );
      }
    } catch (err) {
      (window as any).showToast(
        t('restock_err') || 'Fout bij aanmelden.'
      );
    } finally {
      setLoadingRestock(false);
    }
  };

  const currentSizeStock = selected ? (sizes[selected] || 0) : null;
  const isSoldOut = currentSizeStock !== null && currentSizeStock <= 0;
  const isLowStock =
    currentSizeStock !== null &&
    currentSizeStock > 0 &&
    currentSizeStock <= 2;

  return (
    <section>
      <div className="wrap">

        <div
          style={{
            fontSize: '12px',
            color: 'var(--fg-dim)',
            marginBottom: '6px'
          }}
        >
          <Link
            to="/shop"
            style={{ color: 'var(--fg-dim)' }}
          >
            {t('shop_h')}
          </Link>{' '}
          / {p.name[lang]}
        </div>

        <div className="pdp">

          {/* PRODUCTFOTO'S */}
          <div>
            <div
              className="gallery-main"
              style={{
                backgroundImage: `url("${selectedImage}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />

            <div className="gallery-thumbs">
              {galleryImages.map((image) => (
                <div
                  key={image}
                  className={`th ${
                    selectedImage === image ? 'active' : ''
                  }`}
                  onClick={() => setSelectedImage(image)}
                  style={{
                    backgroundImage: `url("${image}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

          {/* PRODUCT INFORMATIE */}
          <div className="pdp-info">

            <span className="cat">
              {p.limited ? 'Limited Edition · ' : ''}
              Custom Adidas Superstar
            </span>

            <h1>{p.name[lang]}</h1>

            <div className="price">
              {PRICE(p.price)}
            </div>

            <p className="desc">
              {t('about_body1')}
            </p>

            <div className="badge-row">
              <span className="pill">
                {t('benefit1')}
              </span>

              <span className="pill">
                {t('benefit4')}
              </span>

              {p.limited && (
                <span
                  className="pill"
                  style={{
                    color: 'var(--mustard)',
                    borderColor: 'var(--mustard)'
                  }}
                >
                  Limited
                </span>
              )}
            </div>

            <div className="size-label-row">
              <span
                style={{
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--fg-dim)'
                }}
              >
                {t('select_size')}
              </span>
            </div>

            <div className="sizes">
              {sizeKeys.map(s => {
                const n = sizes[s] || 0;
                const out = n <= 0;

                return (
                  <button
                    key={s}
                    className={`size-btn ${
                      selected === s ? 'selected' : ''
                    } ${out ? 'out-of-stock' : ''}`}
                    onClick={() => setSelected(s)}
                  >
                    <span>{s.replace('.', ',')}</span>

                    {out && (
                      <span
                        style={{
                          display: 'block',
                          fontSize: '9px',
                          marginTop: '2px',
                          color: 'var(--fg-dim)'
                        }}
                      >
                        {t('sold_out')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div
              className="size-chart"
              style={{ marginTop: '30px' }}
            >
              <button
                onClick={() => setShowSizeChart(!showSizeChart)}
                className="btn"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{t('size_chart_btn')}</span>
                <span>{showSizeChart ? '−' : '+'}</span>
              </button>

              {showSizeChart && (
                <div
                  style={{
                    marginTop: '20px',
                    padding: '16px',
                    border: '1px solid var(--line-soft)'
                  }}
                >
                  <div
                    style={{
                      marginBottom: '20px',
                      fontSize: '14px',
                      lineHeight: '1.6'
                    }}
                  >
                    <ul
                      style={{
                        listStyleType: 'disc',
                        paddingLeft: '16px'
                      }}
                    >
                      <li>
                        <strong>{t('size_note1')}:</strong>{' '}
                        {t('size_note1_b')}
                      </li>
                      <li>
                        <strong>{t('size_note2')}:</strong>{' '}
                        {t('size_note2_b')}
                      </li>
                      <li>
                        <strong>{t('size_note3')}:</strong>{' '}
                        {t('size_note3_b')}
                      </li>
                    </ul>
                  </div>

                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '14px',
                      textAlign: 'left'
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom:
                            '1px solid var(--line-soft)'
                        }}
                      >
                        <th style={{ padding: '8px' }}>
                          {t('size_chart_eu')}
                        </th>
                        <th style={{ padding: '8px' }}>
                          {t('size_chart_uk')}
                        </th>
                        <th style={{ padding: '8px' }}>
                          {t('size_chart_us')}
                        </th>
                        <th style={{ padding: '8px' }}>
                          CM
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td style={{ padding: '8px' }}>36</td>
                        <td style={{ padding: '8px' }}>3.5</td>
                        <td style={{ padding: '8px' }}>5</td>
                        <td style={{ padding: '8px' }}>22.1</td>
                      </tr>

                      <tr>
                        <td style={{ padding: '8px' }}>36 2/3</td>
                        <td style={{ padding: '8px' }}>4</td>
                        <td style={{ padding: '8px' }}>5.5</td>
                        <td style={{ padding: '8px' }}>22.5</td>
                      </tr>

                      <tr>
                        <td style={{ padding: '8px' }}>37 1/3</td>
                        <td style={{ padding: '8px' }}>4.5</td>
                        <td style={{ padding: '8px' }}>6</td>
                        <td style={{ padding: '8px' }}>22.9</td>
                      </tr>

                      <tr>
                        <td style={{ padding: '8px' }}>38</td>
                        <td style={{ padding: '8px' }}>5</td>
                        <td style={{ padding: '8px' }}>6.5</td>
                        <td style={{ padding: '8px' }}>23.3</td>
                      </tr>

                      <tr>
                        <td style={{ padding: '8px' }}>38 2/3</td>
                        <td style={{ padding: '8px' }}>5.5</td>
                        <td style={{ padding: '8px' }}>7</td>
                        <td style={{ padding: '8px' }}>23.8</td>
                      </tr>

                      <tr>
                        <td style={{ padding: '8px' }}>39 1/3</td>
                        <td style={{ padding: '8px' }}>6</td>
                        <td style={{ padding: '8px' }}>7.5</td>
                        <td style={{ padding: '8px' }}>24.2</td>
                      </tr>

                      <tr>
                        <td style={{ padding: '8px' }}>40</td>
                        <td style={{ padding: '8px' }}>6.5</td>
                        <td style={{ padding: '8px' }}>8</td>
                        <td style={{ padding: '8px' }}>24.6</td>
                      </tr>

                      <tr>
                        <td style={{ padding: '8px' }}>40 2/3</td>
                        <td style={{ padding: '8px' }}>7</td>
                        <td style={{ padding: '8px' }}>8.5</td>
                        <td style={{ padding: '8px' }}>25</td>
                      </tr>

                      <tr>
                        <td style={{ padding: '8px' }}>41 1/3</td>
                        <td style={{ padding: '8px' }}>7.5</td>
                        <td style={{ padding: '8px' }}>9</td>
                        <td style={{ padding: '8px' }}>25.5</td>
                      </tr>

                      <tr>
                        <td style={{ padding: '8px' }}>42</td>
                        <td style={{ padding: '8px' }}>8</td>
                        <td style={{ padding: '8px' }}>9.5</td>
                        <td style={{ padding: '8px' }}>25.9</td>
                      </tr>

                      <tr>
                        <td style={{ padding: '8px' }}>42 2/3</td>
                        <td style={{ padding: '8px' }}>8.5</td>
                        <td style={{ padding: '8px' }}>10</td>
                        <td style={{ padding: '8px' }}>26.3</td>
                      </tr>

                      <tr>
                        <td style={{ padding: '8px' }}>43 1/3</td>
                        <td style={{ padding: '8px' }}>9</td>
                        <td style={{ padding: '8px' }}>10.5</td>
                        <td style={{ padding: '8px' }}>26.7</td>
                      </tr>

                      <tr>
                        <td style={{ padding: '8px' }}>44</td>
                        <td style={{ padding: '8px' }}>9.5</td>
                        <td style={{ padding: '8px' }}>11</td>
                        <td style={{ padding: '8px' }}>27.1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div
              className={`stock-note ${
                isSoldOut
                  ? 'out'
                  : isLowStock
                  ? 'low'
                  : ''
              }`}
            >
              {isSoldOut
                ? t('sold_out')
                : isLowStock
                ? t('last_pairs').replace(
                    '{n}',
                    currentSizeStock.toString()
                  )
                : ''}
            </div>

            {isSoldOut && (
              <div
                style={{
                  marginTop: '16px',
                  background: 'var(--bg-card)',
                  padding: '16px',
                  border: '1px solid var(--line-soft)'
                }}
              >
                <strong
                  style={{
                    display: 'block',
                    marginBottom: '12px'
                  }}
                >
                  {t('restock_label')}
                </strong>

                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--fg-dim)',
                    marginBottom: '12px'
                  }}
                >
                  {t('restock_desc')}
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRestock();
                  }}
                  style={{
                    display: 'flex',
                    gap: '8px'
                  }}
                >
                  <input
                    type="email"
                    placeholder={t('restock_email')}
                    required
                    value={restockEmail}
                    onChange={e =>
                      setRestockEmail(e.target.value)
                    }
                    style={{
                      flex: 1,
                      padding: '10px',
                      border:
                        '1px solid var(--line-soft)',
                      background: 'var(--bg)',
                      color: 'var(--fg)'
                    }}
                  />

                  <button
                    type="submit"
                    disabled={loadingRestock}
                    className="btn btn-solid"
                    style={{
                      background: '#000',
                      color: '#fff'
                    }}
                  >
                    {loadingRestock
                      ? t('loading')
                      : t('restock_btn')}
                  </button>
                </form>
              </div>
            )}

            <div className="pdp-actions">
              <button
                className="btn btn-solid"
                style={{
                  flex: 1,
                  background: '#000',
                  color: '#fff'
                }}
                disabled={
                  stockTotal === 0 || isSoldOut
                }
                onClick={handleAdd}
              >
                {t('add_cart')}
              </button>
            </div>

            <div className="info-box">
              <div className="h">
                {t('delivery_h')}
              </div>
              <p>{t('delivery_body')}</p>
            </div>

            <div className="info-box">
              <div className="h">
                {t('care_h')}
              </div>
              <p>{t('care_body')}</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
} 
