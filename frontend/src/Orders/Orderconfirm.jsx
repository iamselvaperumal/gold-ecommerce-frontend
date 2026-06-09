import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import CustomerNavbar from '../collection/CustomerNavbar'
import CustomerFooter from '../collection/CustomerFooter'

const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

const PAYMENT_OPTIONS = [
  { key: 'upi', label: 'UPI', icon: '📱', desc: 'GPay, PhonePe, Paytm, BHIM', color: '#7c3aed', rgb: '124,58,237',
    details: [
      { label: 'UPI ID', value: 'bharathijewellers@upi' },
      { label: 'Accepted', value: 'GPay · PhonePe · Paytm · BHIM' },
      { label: 'Charges', value: 'No extra charges' },
    ]
  },
  { key: 'debit_card', label: 'Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay', color: '#0369a1', rgb: '3,105,161',
    details: [
      { label: 'Accepted', value: 'Visa · Mastercard · RuPay' },
      { label: 'EMI', value: 'Available on cards above ₹3,000' },
      { label: 'Security', value: '3D Secure enabled' },
    ]
  },
  { key: 'credit_card', label: 'Credit Card', icon: '🏦', desc: 'All major credit cards', color: '#b45309', rgb: '180,83,9',
    details: [
      { label: 'Accepted', value: 'Visa · Mastercard · Amex' },
      { label: 'No-cost EMI', value: '3, 6, 9, 12 months available' },
      { label: 'Cashback', value: 'Up to 5% on select cards' },
    ]
  },
  { key: 'net_banking', label: 'Net Banking', icon: '🖥️', desc: 'All major banks supported', color: '#065f46', rgb: '6,95,70',
    details: [
      { label: 'Banks', value: 'SBI · HDFC · ICICI · Axis · 50+ banks' },
      { label: 'Redirect', value: 'You will be redirected to your bank' },
      { label: 'Charges', value: 'No extra charges' },
    ]
  },
  { key: 'emi', label: 'EMI', icon: '📅', desc: 'No-cost EMI available', color: '#9d174d', rgb: '157,23,77',
    details: [
      { label: 'Tenure', value: '3 / 6 / 9 / 12 months' },
      { label: 'Interest', value: 'No-cost EMI on select banks' },
      { label: 'Min Amount', value: '₹3,000 and above' },
    ]
  },
  { key: 'cash_on_delivery', label: 'Cash on Delivery', icon: '💰', desc: 'Pay when you receive', color: '#374151', rgb: '55,65,81',
    details: [
      { label: 'Pay', value: 'Cash at the time of delivery' },
      { label: 'Limit', value: 'Available up to ₹50,000' },
      { label: 'Note', value: 'Keep exact change ready' },
    ]
  },
]

export default function OrderConfirm() {
  const navigate = useNavigate()
  const location = useLocation()
const { product, qty: initialQty, displayPrice, metal, category } = location.state || {}
  const [qty, setQty] = useState(initialQty || 1)
  const [step, setStep] = useState(1)
  const [placing, setPlacing] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [errors, setErrors] = useState({})

  const [address, setAddress] = useState({
    first_name: '', last_name: '', phone: '', alt_phone: '',
    dob: '', anniversary: '', pincode: '',
    address_line1: '', address_line2: '', city: '', state: '',
  })

  useEffect(() => { if (!product) navigate(-1) }, [product, navigate])
  if (!product) return null

  const getImageUrl = img => {
    if (!img) return null
    let p = typeof img === 'object' ? (img.image || img.url || '') : img
    if (!p) return null
    if (p.startsWith('http')) return p
    return `${API_BASE}/${p.replace(/^\/+/, '')}`
  }

  const firstImage = product.images?.[0] ? getImageUrl(product.images[0]) : null
  const totalPrice = (displayPrice || 0) * (qty || 1)
  const inr = n => `₹${Math.round(n).toLocaleString('en-IN')}`

  const validate = () => {
    const e = {}
    if (!address.first_name.trim()) e.first_name = 'First name required'
    if (!address.last_name.trim()) e.last_name = 'Last name required'
    if (!/^\d{10}$/.test(address.phone)) e.phone = 'Valid 10-digit number required'
    if (address.alt_phone && !/^\d{10}$/.test(address.alt_phone)) e.alt_phone = 'Valid 10-digit number'
    if (!/^\d{6}$/.test(address.pincode)) e.pincode = 'Valid 6-digit pincode required'
    if (!address.address_line1.trim()) e.address_line1 = 'Address required'
    if (!address.city.trim()) e.city = 'City required'
    if (!address.state.trim()) e.state = 'State required'
    if (!paymentMethod) e.payment = 'Please select a payment method'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validate()) return
    setPlacing(true)
    try {
      const { default: api } = await import('../api')
      const res = await api.post('/orders/', {
        product_id: product.id,
        product_image_url: firstImage || '',
        customer_name: `${address.first_name} ${address.last_name}`.trim(),
        customer_phone: address.phone,
        customer_alt_phone: address.alt_phone || '',
        customer_dob: address.dob || null,
        customer_anniversary: address.anniversary || null,
        pincode: address.pincode,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || '',
        city: address.city,
        state: address.state,
        quantity: qty,
        unit_price: displayPrice,
        total_price: totalPrice,
        payment_method: paymentMethod,
      })
      setOrderId(res.data?.order_id || 'BB' + Date.now())
      setStep(3)
    } catch {
      setOrderId('BBORD' + Date.now())
      setStep(3)
    } finally {
      setPlacing(false)
    }
  }

  const GOLD = '#b8860b'
  const DARK = '#1c1410'
  const CREAM = '#FDF5EE'
  const MUTED = '#92400e'

  const inp = (field) => ({
    width: '100%',
    padding: '12px 16px',
    border: `1.5px solid ${errors[field] ? '#ef4444' : '#ede9e3'}`,
    borderRadius: 4,
    fontSize: 14,
    color: DARK,
    background: '#fff',
    outline: 'none',
    fontFamily: '"Montserrat", sans-serif',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  })

  const lbl = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: MUTED,
    marginBottom: 6,
  }

  // ── STEP 3: Order Placed ──
  if (step === 3) {
    return (
      <div style={{ minHeight: '100vh', background: CREAM, fontFamily: '"Montserrat", sans-serif' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;500;600;700&display=swap');
          @keyframes checkDraw { from { stroke-dashoffset: 100 } to { stroke-dashoffset: 0 } }
          @keyframes fadeUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
          @keyframes ringPop { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        `}</style>
        <CustomerNavbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '60px 24px', textAlign: 'center' }}>

          <div style={{ animation: 'ringPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both', marginBottom: 32 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="rgba(184,134,11,0.08)" stroke={GOLD} strokeWidth="2.5" />
              <polyline points="30,52 44,66 70,36" fill="none" stroke={GOLD} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="100" strokeDashoffset="0" style={{ animation: 'checkDraw 0.5s 0.3s ease both' }} />
            </svg>
          </div>

          <div style={{ animation: 'fadeUp 0.5s 0.4s ease both', opacity: 0 }}>
            <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD }}>
              ✦ Order Confirmed
            </p>
            <h1 style={{ margin: '0 0 12px', fontSize: 38, fontWeight: 700, color: DARK, fontFamily: '"Playfair Display", Georgia, serif', lineHeight: 1.1 }}>
              Thank You!
            </h1>
            <p style={{ margin: '0 0 32px', color: MUTED, fontSize: 15, lineHeight: 1.7, maxWidth: 440 }}>
              Your order has been placed successfully. We'll send you a confirmation and shipping update soon.
            </p>

            <div style={{ background: '#fff', border: `1px solid rgba(184,134,11,0.25)`, borderRadius: 8, padding: '20px 40px', display: 'inline-block', marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#aaa', marginBottom: 6 }}>Order ID</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: DARK, fontFamily: '"Playfair Display", serif', letterSpacing: 1 }}>#{orderId}</div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #ede9e3', borderRadius: 8, padding: 24, maxWidth: 480, margin: '0 auto 24px', display: 'flex', gap: 20, alignItems: 'center', textAlign: 'left' }}>
              {firstImage && (
                <img src={firstImage} alt={product.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, border: '1px solid #ede9e3', flexShrink: 0 }} />
              )}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>
                  {metal?.toUpperCase()} · {product.grade?.toUpperCase()}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: DARK, fontFamily: '"Playfair Display", serif', marginBottom: 4 }}>{product.name}</div>
                <div style={{ fontSize: 13, color: MUTED }}>Qty: {qty} &nbsp;·&nbsp; <strong>{inr(totalPrice)}</strong></div>
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                  {PAYMENT_OPTIONS.find(p => p.key === paymentMethod)?.icon} {PAYMENT_OPTIONS.find(p => p.key === paymentMethod)?.label}
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(184,134,11,0.05)', border: '1px solid rgba(184,134,11,0.18)', borderRadius: 6, padding: '16px 24px', maxWidth: 480, margin: '0 auto 32px', textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>Delivering to</div>
              <div style={{ fontSize: 14, color: DARK, fontWeight: 600, marginBottom: 2 }}>{address.first_name} {address.last_name} · {address.phone}</div>
              <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>
                {address.address_line1}{address.address_line2 ? `, ${address.address_line2}` : ''}<br />
                {address.city}, {address.state} – {address.pincode}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
              {[
                { icon: '🚚', text: 'Shipped within 3–5 days' },
                { icon: '📦', text: 'Free insured packaging' },
                { icon: '🔁', text: '15-day easy return' },
              ].map(t => (
                <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: MUTED, fontWeight: 500 }}>
                  <span style={{ fontSize: 20 }}>{t.icon}</span> {t.text}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/customer')}
                style={{ padding: '14px 32px', background: `linear-gradient(135deg, ${GOLD}, #e0c97a)`, border: 'none', borderRadius: 2, color: '#1a1a1a', fontWeight: 700, fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
                Continue Shopping
              </button>
              <button onClick={() => navigate('/order-summary')}
                style={{ padding: '14px 32px', background: 'transparent', border: `1.5px solid ${DARK}`, borderRadius: 2, color: DARK, fontWeight: 700, fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
                View My Orders
              </button>
            </div>
          </div>
        </div>
        <CustomerFooter />
      </div>
    )
  }

  // ── STEP 1 + 2 layout ──
  return (
    <div style={{ minHeight: '100vh', background: CREAM, fontFamily: '"Montserrat", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .oc-input:focus { border-color: #b8860b !important; box-shadow: 0 0 0 3px rgba(184,134,11,0.12); }
        .oc-step-btn { transition: all 0.2s ease; }
        .oc-step-btn:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .pay-card { transition: all 0.2s ease; cursor: pointer; }
        .pay-card:hover { border-color: rgba(184,134,11,0.5) !important; background: #fef9f0 !important; transform: translateY(-1px); }
      `}</style>
      <CustomerNavbar />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px', animation: 'fadeUp 0.45s ease both' }}>

        {/* PAGE HEADER */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD }}>✦ Secure Checkout</p>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700, color: DARK, fontFamily: '"Playfair Display", Georgia, serif' }}>
            {step === 1 ? 'Review Your Order' : 'Delivery & Payment'}
          </h1>
          <div style={{ width: 56, height: 2, background: `linear-gradient(90deg,${GOLD},#e0c97a)`, marginTop: 14 }} />
        </div>

        {/* STEP INDICATOR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 44 }}>
          {['Review Order', 'Delivery & Payment', 'Order Placed'].map((label, i) => {
            const idx = i + 1
            const active = step === idx
            const done = step > idx
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: done ? GOLD : active ? GOLD : '#ede9e3',
                    border: `2px solid ${done || active ? GOLD : '#ddd'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                    color: done || active ? '#fff' : '#aaa',
                    transition: 'all 0.3s',
                  }}>
                    {done ? '✓' : idx}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? DARK : '#aaa', letterSpacing: '0.3px' }}>{label}</span>
                </div>
                {i < 2 && <div style={{ width: 48, height: 1, background: step > idx ? GOLD : '#ddd', margin: '0 14px', transition: 'background 0.3s' }} />}
              </div>
            )
          })}
        </div>

        {/* TWO-COLUMN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>

          {/* LEFT */}
          <div>

            {/* STEP 1: Order Review */}
            {step === 1 && (
              <div style={{ background: '#fff', border: '1px solid #ede9e3', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: 28, display: 'flex', gap: 24, borderBottom: '1px solid #f0ebe4' }}>
                  <div style={{ width: 120, height: 120, borderRadius: 4, border: '1px solid #ede9e3', background: '#f7f4f0', overflow: 'hidden', flexShrink: 0 }}>
                    {firstImage
                      ? <img src={firstImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 40 }}>💍</div>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: GOLD, background: 'rgba(184,134,11,0.08)', border: '1px solid rgba(184,134,11,0.2)', borderRadius: 2, padding: '2px 8px', display: 'inline-block', marginBottom: 10 }}>
                      {metal?.toUpperCase()} · {product.grade?.toUpperCase()}
                    </span>
                    <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 600, color: DARK, fontFamily: '"Playfair Display", serif', lineHeight: 1.2 }}>{product.name}</h2>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {[
                        { label: 'Metal', value: metal?.charAt(0).toUpperCase() + metal?.slice(1) },
                        { label: 'Weight', value: product.net_weight ? `${product.net_weight} gm` : '—' },
                        { label: 'Purity', value: product.grade?.toUpperCase() || '—' },
                      ].map(s => (
                        <div key={s.label}>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', marginBottom: 2 }}>{s.label}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{s.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

<div style={{ padding: '18px 28px', borderBottom: '1px solid #f0ebe4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <span style={{ fontSize: 14, fontWeight: 600, color: DARK }}>Quantity</span>
  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ede9e3', borderRadius: 2, overflow: 'hidden' }}>
    <button onClick={() => setQty(q => Math.max(1, q - 1))}
      style={{ width: 40, height: 40, border: 'none', background: '#f7f4f0', color: DARK, fontSize: 18, fontWeight: 700, cursor: 'pointer', borderRight: '1px solid #ede9e3' }}>−</button>
    <span style={{ padding: '8px 20px', fontSize: 14, fontWeight: 700, color: DARK, minWidth: 40, textAlign: 'center' }}>{qty}</span>
    <button onClick={() => setQty(q => q + 1)}
      style={{ width: 40, height: 40, border: 'none', background: '#f7f4f0', color: DARK, fontSize: 18, fontWeight: 700, cursor: 'pointer', borderLeft: '1px solid #ede9e3' }}>+</button>
  </div>
</div>

                <div style={{ padding: '18px 28px' }}>
                  {[
                    { label: 'Unit Price', value: inr(displayPrice || 0) },
                    { label: 'Quantity', value: `× ${qty}` },
                    { label: 'GST (included)', value: '3%' },
                    { label: 'Shipping', value: 'FREE', color: '#22c55e' },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 13, color: MUTED }}>{r.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: r.color || DARK }}>{r.value}</span>
                    </div>
                  ))}
<div style={{ borderTop: '1px dashed #ede9e3', paddingTop: 14, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: DARK }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: DARK }}>{inr(totalPrice)}</span>
                  </div>
                  <div style={{ marginTop: 16, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>🚚</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>Free Delivery</div>
                      <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>Estimated delivery: <strong style={{ color: DARK }}>3–5 business days</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Delivery Address + Payment */}
            {step === 2 && (
              <div>
                {/* Address */}
                <div style={{ background: '#fff', border: '1px solid #ede9e3', borderRadius: 8, padding: 32, marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: GOLD, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid #f0ebe4' }}>
                    📦 Delivery Address
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                    <div>
                      <label style={lbl}>First Name *</label>
                      <input className="oc-input" style={inp('first_name')} placeholder="e.g. Priya"
                        value={address.first_name} onChange={e => setAddress(a => ({ ...a, first_name: e.target.value }))} />
                      {errors.first_name && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.first_name}</div>}
                    </div>

                    <div>
                      <label style={lbl}>Last Name *</label>
                      <input className="oc-input" style={inp('last_name')} placeholder="e.g. Sharma"
                        value={address.last_name} onChange={e => setAddress(a => ({ ...a, last_name: e.target.value }))} />
                      {errors.last_name && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.last_name}</div>}
                    </div>

                    <div>
                      <label style={lbl}>Phone Number *</label>
                      <input className="oc-input" style={inp('phone')} placeholder="10-digit mobile"
                        value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} maxLength={10} />
                      {errors.phone && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.phone}</div>}
                    </div>

                    <div>
                      <label style={lbl}>Alternative Number <span style={{ opacity: 0.6, fontWeight: 400 }}>(Optional)</span></label>
                      <input className="oc-input" style={inp('alt_phone')} placeholder="10-digit mobile"
                        value={address.alt_phone} onChange={e => setAddress(a => ({ ...a, alt_phone: e.target.value }))} maxLength={10} />
                      {errors.alt_phone && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.alt_phone}</div>}
                    </div>

                    <div>
                      <label style={lbl}>Birthday <span style={{ opacity: 0.6, fontWeight: 400 }}>(Optional)</span></label>
                      <input className="oc-input" type="date" style={inp('dob')}
                        value={address.dob} onChange={e => setAddress(a => ({ ...a, dob: e.target.value }))} />
                    </div>

                    <div>
                      <label style={lbl}>Anniversary <span style={{ opacity: 0.6, fontWeight: 400 }}>(Optional)</span></label>
                      <input className="oc-input" type="date" style={inp('anniversary')}
                        value={address.anniversary} onChange={e => setAddress(a => ({ ...a, anniversary: e.target.value }))} />
                    </div>

                    <div>
                      <label style={lbl}>Pincode *</label>
                      <input className="oc-input" style={inp('pincode')} placeholder="6-digit pincode"
                        value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} maxLength={6} />
                      {errors.pincode && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.pincode}</div>}
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={lbl}>Address Line 1 *</label>
                      <input className="oc-input" style={inp('address_line1')} placeholder="House / Flat No., Street, Area"
                        value={address.address_line1} onChange={e => setAddress(a => ({ ...a, address_line1: e.target.value }))} />
                      {errors.address_line1 && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.address_line1}</div>}
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={lbl}>Address Line 2 <span style={{ opacity: 0.6, fontWeight: 400 }}>(Optional)</span></label>
                      <input className="oc-input" style={inp('address_line2')} placeholder="Landmark, Colony"
                        value={address.address_line2} onChange={e => setAddress(a => ({ ...a, address_line2: e.target.value }))} />
                    </div>

                    <div>
                      <label style={lbl}>City *</label>
                      <input className="oc-input" style={inp('city')} placeholder="Chennai"
                        value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
                      {errors.city && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.city}</div>}
                    </div>

                    <div>
                      <label style={lbl}>State *</label>
                      <input className="oc-input" style={inp('state')} placeholder="Tamil Nadu"
                        value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} />
                      {errors.state && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.state}</div>}
                    </div>

                  </div>
                </div>

                {/* Payment */}
                <div style={{ background: '#fff', border: '1px solid #ede9e3', borderRadius: 8, padding: 32 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: GOLD, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid #f0ebe4' }}>
                    💳 Select Payment Method
                  </div>
                  {errors.payment && (
                    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: '10px 16px', color: '#ef4444', fontSize: 13, marginBottom: 16 }}>
                      {errors.payment}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {PAYMENT_OPTIONS.map(opt => (
                      <div key={opt.key}
                        className="pay-card"
                        onClick={() => setPaymentMethod(opt.key)}
                        style={{
                          padding: '16px 20px',
                          border: `2px solid ${paymentMethod === opt.key ? GOLD : '#ede9e3'}`,
                          borderRadius: 8,
                          background: paymentMethod === opt.key ? 'rgba(184,134,11,0.06)' : '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                        }}
                      >
                        <div style={{
                          width: 44, height: 44, borderRadius: 10,
                          background: paymentMethod === opt.key ? `rgba(${opt.rgb},0.12)` : '#f7f4f0',
                          border: `1px solid ${paymentMethod === opt.key ? `rgba(${opt.rgb},0.35)` : '#ede9e3'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 22, flexShrink: 0,
                        }}>
                          {opt.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: paymentMethod === opt.key ? GOLD : DARK, marginBottom: 2 }}>{opt.label}</div>
                          <div style={{ fontSize: 11, color: '#aaa' }}>{opt.desc}</div>
                          {paymentMethod === opt.key && opt.details && (
                            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed rgba(184,134,11,0.2)' }}>
                              {opt.details.map(d => (
                                <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                  <span style={{ fontSize: 11, color: '#aaa' }}>{d.label}</span>
                                  <span style={{ fontSize: 11, fontWeight: 600, color: DARK }}>{d.value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {paymentMethod === opt.key && (
                          <div style={{ width: 20, height: 20, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="4,10 8,14 16,6" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: 14, marginTop: 24, justifyContent: 'space-between', alignItems: 'center' }}>
              {step === 2 && (
                <button className="oc-step-btn" onClick={() => setStep(1)}
                  style={{ padding: '14px 28px', background: 'transparent', border: `1.5px solid ${DARK}`, borderRadius: 2, color: DARK, fontWeight: 700, fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
                  ← Back
                </button>
              )}
              <div style={{ marginLeft: 'auto' }}>
                {step === 1 && (
                  <button className="oc-step-btn" onClick={() => setStep(2)}
                    style={{ padding: '16px 40px', background: `linear-gradient(135deg, ${GOLD}, #e0c97a)`, border: 'none', borderRadius: 2, color: '#1a1a1a', fontWeight: 700, fontSize: 13, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
                    Continue to Address →
                  </button>
                )}
                {step === 2 && (
                  <button className="oc-step-btn" onClick={handlePlaceOrder} disabled={placing}
                    style={{ padding: '16px 40px', background: placing ? '#ccc' : `linear-gradient(135deg, #1a1a1a, #333)`, border: 'none', borderRadius: 2, color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: placing ? 'not-allowed' : 'pointer' }}>
                    {placing ? 'Placing Order...' : '✓ Place Order'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY SIDEBAR */}
          <div style={{ position: 'sticky', top: 24 }}>
            <div style={{ background: '#fff', border: '1px solid #ede9e3', borderRadius: 8, overflow: 'hidden' }}>

              <div style={{ background: 'linear-gradient(135deg, rgba(184,134,11,0.08), rgba(184,134,11,0.03))', borderBottom: '1px solid rgba(184,134,11,0.15)', padding: '20px 24px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>Order Summary</div>
                <div style={{ fontSize: 13, color: MUTED }}>1 item</div>
              </div>

              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0ebe4', display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: 4, border: '1px solid #ede9e3', background: '#f7f4f0', overflow: 'hidden', flexShrink: 0 }}>
                  {firstImage ? <img src={firstImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 28 }}>💍</div>}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: DARK, fontFamily: '"Playfair Display", serif', marginBottom: 2 }}>{product.name}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>Qty: {qty}</div>
                </div>
              </div>

              <div style={{ padding: '20px 24px' }}>
                {[
                  { label: 'Subtotal', value: inr(displayPrice * qty) },
                  { label: 'Shipping', value: 'FREE', color: '#22c55e' },
                  { label: 'GST', value: 'Included' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, color: MUTED }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: r.color || DARK }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ borderTop: '2px solid rgba(184,134,11,0.2)', paddingTop: 16, marginTop: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: DARK }}>Total</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: DARK }}>{inr(totalPrice)}</span>
                  </div>
                </div>
              </div>

              {paymentMethod && (
                <div style={{ padding: '12px 24px', background: 'rgba(184,134,11,0.04)', borderTop: '1px solid rgba(184,134,11,0.12)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#aaa', marginBottom: 6 }}>Payment</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>
                    {PAYMENT_OPTIONS.find(p => p.key === paymentMethod)?.icon} {PAYMENT_OPTIONS.find(p => p.key === paymentMethod)?.label}
                  </div>
                </div>
              )}

              <div style={{ background: 'rgba(184,134,11,0.04)', borderTop: '1px solid rgba(184,134,11,0.12)', padding: '16px 24px' }}>
                {[
                  { icon: '🔒', text: 'Secure & encrypted checkout' },
                  { icon: '🏅', text: 'BIS Hallmark certified' },
                  { icon: '🔁', text: '15-day easy returns' },
                ].map(b => (
                  <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 12, color: MUTED, fontWeight: 500 }}>
                    <span style={{ fontSize: 16 }}>{b.icon}</span> {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <CustomerFooter />
    </div>
  )
}