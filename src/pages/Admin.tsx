import React, { useState, useEffect } from 'react';

export default function Admin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleMarkPaid = async (orderNumber: string) => {
    if (!confirm('Zeker weten dat deze bestelling is betaald?')) return;
    try {
      await fetch(`/api/admin/orders/${orderNumber}/pay`, { method: 'POST' });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (orderNumber: string, status: string) => {
    try {
      await fetch(`/api/admin/orders/${orderNumber}/status`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const getWhatsAppLink = (order: any) => {
    let msg = `🛒 *NIEUWE BESTELLING*\n\n`;
    msg += `*Order:* #${order.orderNumber}\n\n`;
    msg += `👤 *Klant*\nNaam: ${order.name}\nTelefoon: ${order.phone}\nE-mail: ${order.email}\n\n`;
    msg += `📍 *Adres*\n${order.address}\n${order.postalCode} ${order.city}\n${order.country}\n\n`;
    
    msg += `🛍️ *Bestelling*\n`;
    msg += order.cart.map((item: any) => `${item.qty}x ${item.name} ${item.size ? `(Maat: ${item.size})` : ''} — €${(item.price * item.qty).toFixed(2)}`).join('\n') + '\n\n';
    
    msg += `💰 *Totaal: €${order.total.toFixed(2)}*\n\n`;
    
    msg += `💳 *Gewenste betaalmethode: ${order.method === 'ideal' ? 'iDEAL' : 'PayPal'}*\n\n`;
    msg += `🟠 *Status: WACHT OP BETALING*`;
    
    if (order.notes) {
      msg += `\n\n📝 *Opmerking:* \n${order.notes}`;
    }

    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Laden...</div>;

  return (
    <section style={{ paddingTop: '56px', minHeight: '80vh', background: '#f9f9f9' }}>
      <div className="wrap" style={{ maxWidth: '1200px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>Beheeromgeving Bestellingen</h1>
        
        {orders.length === 0 ? (
          <p>Geen bestellingen gevonden.</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {orders.map(order => (
              <div key={order.orderNumber} style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <h3 style={{ margin: '0 0 12px 0' }}>Order #{order.orderNumber}</h3>
                  <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>{new Date(order.date).toLocaleString('nl-NL')}</p>
                  
                  <div style={{ marginTop: '16px' }}>
                    <strong>Klant:</strong><br />
                    {order.name}<br />
                    <a href={`mailto:${order.email}`}>{order.email}</a><br />
                    <a href={`tel:${order.phone}`}>{order.phone}</a>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <strong>Adres:</strong><br />
                    {order.address}<br />
                    {order.postalCode} {order.city}<br />
                    {order.country}
                  </div>
                  
                  {order.notes && (
                    <div style={{ marginTop: '16px', background: '#fff9c4', padding: '12px', borderRadius: '4px' }}>
                      <strong>Opmerking:</strong><br />
                      {order.notes}
                    </div>
                  )}
                </div>

                <div style={{ flex: '1 1 300px' }}>
                  <h4 style={{ margin: '0 0 12px 0' }}>Producten</h4>
                  <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px' }}>
                    {order.cart.map((item: any, i: number) => (
                      <li key={i} style={{ marginBottom: '6px' }}>
                        {item.qty}x {item.name} {item.size ? `(Maat: ${item.size})` : ''} - €{(item.price * item.qty).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  
                  <div style={{ marginTop: '16px', padding: '12px', background: '#f0f0f0', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Subtotaal:</span>
                      <span>€{order.subtotal?.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Verzending:</span>
                      <span>€{order.shipCost?.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ccc' }}>
                      <span>Totaal:</span>
                      <span>€{order.total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ddd' }}>
                    <strong>Betaalmethode:</strong> {order.method === 'ideal' ? 'iDEAL' : 'PayPal'}<br />
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong>Betaalstatus:</strong> 
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                        background: order.paymentStatus === 'PAID' ? '#c8e6c9' : '#ffcdd2',
                        color: order.paymentStatus === 'PAID' ? '#2e7d32' : '#c62828'
                      }}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    {order.paidAt && <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Betaald op: {new Date(order.paidAt).toLocaleString('nl-NL')}</div>}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <strong>Order Status:</strong>
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order.orderNumber, e.target.value)}
                      style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                      <option value="WAITING_FOR_PAYMENT">Wacht op betaling</option>
                      <option value="PROCESSING">Verwerken (Processing)</option>
                      <option value="SHIPPED">Verzonden (Shipped)</option>
                      <option value="COMPLETED">Afgerond (Completed)</option>
                      <option value="CANCELLED">Geannuleerd (Cancelled)</option>
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                    {order.paymentStatus === 'UNPAID' && (
                      <button 
                        onClick={() => handleMarkPaid(order.orderNumber)}
                        className="btn btn-solid"
                        style={{ background: '#2e7d32', color: '#fff', border: 'none', width: '100%' }}
                      >
                        ✅ Betaling ontvangen
                      </button>
                    )}
                    <a 
                      href={getWhatsAppLink(order)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn"
                      style={{ background: '#25D366', color: '#fff', borderColor: '#25D366', textAlign: 'center', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <span>WhatsApp-bestelling openen</span>
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
