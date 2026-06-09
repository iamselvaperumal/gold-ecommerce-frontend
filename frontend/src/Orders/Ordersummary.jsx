import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomerNavbar from '../collection/CustomerNavbar'
import CustomerFooter from '../collection/CustomerFooter'

const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

const STATUS_COLORS = {
  pending:    { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.4)', color: '#d97706', label: '⏳ Pending' },
  confirmed:  { bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.4)', color: '#0891b2', label: '✅ Confirmed' },
  processing: { bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.4)', color: '#7c3aed', label: '⚙️ Processing' },
  shipped:    { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.4)', color: '#2563eb', label: '🚚 Shipped' },
  delivered:  { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.4)', color: '#16a34a', label: '✓ Delivered' },
  cancelled:  { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.4)', color: '#dc2626', label: '✗ Cancelled' },
}

const PAYMENT_ICONS = {
  upi: '📱', debit_card: '💳', credit_card: '🏦',
  net_banking: '🖥️', emi: '📅', cash_on_delivery: '💰',
}

export default function OrderSummary() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const GOLD = '#b8860b', DARK = '#1c1410', CREAM = '#FDF5EE', MUTED = '#92400e'

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { default: api } = await import('../api')
        const res = await api.get('/orders/')
        setOrders(Array.isArray(res.data) ? res.data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)) : [])
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const getImageUrl = url => {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${API_BASE}/${url.replace(/^\/+/, '')}`
  }

  const inr = n => `₹${Math.round(n).toLocaleString('en-IN')}`

  const formatDate = d => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: CREAM, fontFamily: '"Montserrat", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;500;600;700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .order-card{transition:all 0.2s ease;cursor:pointer;}
        .order-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.08);}
      `}</style>
      <CustomerNavbar />

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 80px', animation: 'fadeUp 0.4s ease both' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD }}>✦ My Account</p>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700, color: DARK, fontFamily: '"Playfair Display",Georgia,serif' }}>Order History</h1>
          <div style={{ width: 56, height: 2, background: `linear-gradient(90deg,${GOLD},#e0c97a)`, marginTop: 14 }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 48, height: 48, border: `3px solid rgba(184,134,11,0.2)`, borderTop: `3px solid ${GOLD}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ color: MUTED, fontSize: 14 }}>Loading your orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: '#fff', borderRadius: 12, border: '1px solid #ede9e3' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🛍️</div>
            <h2 style={{ color: DARK, fontFamily: '"Playfair Display",serif', fontSize: 26, marginBottom: 12 }}>No Orders Yet</h2>
            <p style={{ color: MUTED, fontSize: 14, marginBottom: 32 }}>You haven't placed any orders. Start shopping to see your orders here.</p>
            <button onClick={() => navigate('/customer')} style={{ padding: '14px 32px', background: `linear-gradient(135deg,${GOLD},#e0c97a)`, border: 'none', borderRadius: 2, color: '#1a1a1a', fontWeight: 700, fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((order, i) => {
              const st = STATUS_COLORS[order.status] || STATUS_COLORS.pending
              const img = getImageUrl(order.product_image_url)
              return (
                <div key={order.id}
                  className="order-card"
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  style={{ background: '#fff', border: `1px solid ${selectedOrder?.id === order.id ? GOLD : '#ede9e3'}`, borderRadius: 12, overflow: 'hidden', animation: `fadeUp 0.4s ${i * 0.06}s ease both`, opacity: 0 }}>

                  {/* Main row */}
                  <div style={{ padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'center' }}>

                    {/* Product image */}
                    <div style={{ width: 80, height: 80, borderRadius: 8, border: '1px solid #ede9e3', background: '#f7f4f0', overflow: 'hidden', flexShrink: 0 }}>
                      {img ? <img src={img} alt={order.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 32 }}>💍</div>}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: GOLD, background: 'rgba(184,134,11,0.08)', border: '1px solid rgba(184,134,11,0.2)', borderRadius: 2, padding: '2px 8px' }}>
                          {order.product_metal?.toUpperCase()} · {order.product_grade?.toUpperCase()}
                        </span>
                        <span style={{ fontSize: 11, color: '#aaa' }}>{formatDate(order.created_at)}</span>
                      </div>
                      <div style={{ fontSize: 17, fontWeight: 600, color: DARK, fontFamily: '"Playfair Display",serif', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.product_name}
                      </div>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, color: MUTED }}>Qty: <strong>{order.quantity}</strong></span>
                        <span style={{ fontSize: 13, color: MUTED }}>{PAYMENT_ICONS[order.payment_method] || '💳'} {order.payment_method?.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {/* Right side */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: DARK, marginBottom: 8 }}>{inr(order.total_price)}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: st.bg, border: `1px solid ${st.border}`, color: st.color, display: 'inline-block' }}>
                        {st.label}
                      </div>
                    </div>

                    <div style={{ color: '#aaa', fontSize: 14, marginLeft: 8, transform: selectedOrder?.id === order.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</div>
                  </div>

                  {/* Order ID bar */}
                  <div style={{ padding: '8px 24px', background: 'rgba(184,134,11,0.04)', borderTop: '1px solid rgba(184,134,11,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#aaa', fontFamily: 'monospace' }}>Order ID: <strong style={{ color: GOLD }}>{order.order_id}</strong></span>
                    <span style={{ fontSize: 11, color: '#aaa' }}>Category: {order.product_category}</span>
                  </div>

                  {/* Expanded details */}
                  {selectedOrder?.id === order.id && (
                    <div style={{ padding: '24px', borderTop: '1px solid #f0ebe4', background: '#fef9f5', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, animation: 'fadeUp 0.25s ease both' }}>

                      {/* Delivery address */}
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>📦 Delivery Address</div>
                        <div style={{ background: '#fff', border: '1px solid #ede9e3', borderRadius: 8, padding: '14px 18px' }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 6 }}>{order.customer_name}</div>
                          <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
                            📞 {order.customer_phone}{order.customer_alt_phone ? ` / ${order.customer_alt_phone}` : ''}<br/>
                            {order.address_line1}{order.address_line2 ? `, ${order.address_line2}` : ''}<br/>
                            {order.city}, {order.state} – {order.pincode}
                          </div>
                        </div>
                      </div>

                      {/* Order details */}
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>💰 Price Details</div>
                        <div style={{ background: '#fff', border: '1px solid #ede9e3', borderRadius: 8, padding: '14px 18px' }}>
                          {[
                            { label: 'Unit Price', value: inr(order.unit_price) },
                            { label: 'Quantity', value: `× ${order.quantity}` },
                            { label: 'GST', value: 'Included (3%)' },
                            { label: 'Shipping', value: 'FREE', color: '#22c55e' },
                          ].map(r => (
                            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <span style={{ fontSize: 13, color: MUTED }}>{r.label}</span>
                              <span style={{ fontSize: 13, fontWeight: 600, color: r.color || DARK }}>{r.value}</span>
                            </div>
                          ))}
                          <div style={{ borderTop: '1px dashed #ede9e3', paddingTop: 10, marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: DARK }}>Total Paid</span>
                            <span style={{ fontSize: 16, fontWeight: 800, color: DARK }}>{inr(order.total_price)}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
      <CustomerFooter />
    </div>
  )
}