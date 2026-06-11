import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import CustomerNavbar from '../collection/CustomerNavbar'
import CustomerFooter from '../collection/CustomerFooter'

const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'
const GOLD = '#b8860b'
const DARK = '#1c1410'
const CREAM = '#FDF5EE'
const MUTED = '#92400e'
const RED = '#7B1F2E'

const COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
]

const BANKS = [
  { name: 'State Bank of India', color: '#1a5276', initial: 'SBI' },
  { name: 'HDFC Bank', color: '#004c91', initial: 'HDFC' },
  { name: 'ICICI Netbanking', color: '#f96b1b', initial: 'ICICI' },
  { name: 'Axis Bank', color: '#800000', initial: 'AXIS' },
  { name: 'AU Small Finance Bank', color: '#f5a623', initial: 'AU' },
  { name: 'Kotak Mahindra Bank', color: '#ed1c24', initial: 'KMB' },
  { name: 'Bank of Baroda', color: '#f47920', initial: 'BOB' },
  { name: 'Punjab National Bank', color: '#003f7f', initial: 'PNB' },
  { name: 'Canara Bank', color: '#00539c', initial: 'CNB' },
  { name: 'IndusInd Bank', color: '#672f7e', initial: 'IIB' },
]

// ── SVG ICONS ──
const IconLocation = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
)
const IconCard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
)
const IconUPI = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
  </svg>
)
const IconBank = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/>
    <line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/>
    <line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>
  </svg>
)
const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
)
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

export default function OrderConfirm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { product, qty: initialQty, displayPrice, metal } = location.state || {}

  const [qty, setQty] = useState(initialQty || 1)
  const [step, setStep] = useState(1)
  const [placing, setPlacing] = useState(false)
  const [orderId, setOrderId] = useState(null)

  // Address popup
  const [showAddressPopup, setShowAddressPopup] = useState(false)
  const [savedAddress, setSavedAddress] = useState(null)
  const [addressType, setAddressType] = useState('Home')
  const [otherLabel, setOtherLabel] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [country, setCountry] = useState('IN')
  const [showCountryDrop, setShowCountryDrop] = useState(false)
  const [addressForm, setAddressForm] = useState({
    name: '', email: '', phone: '', pincode: '', city: '', state: '', address: '', locality: '',
  })
  const [addressErrors, setAddressErrors] = useState({})

  // Payment
  const [payTab, setPayTab] = useState('card')
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '' })
  const [upiId, setUpiId] = useState('')
  const [selectedBank, setSelectedBank] = useState(null)
  const [bankSearch, setBankSearch] = useState('')

  // Load customer profile to pre-fill
useEffect(() => {
    // Restore saved address from sessionStorage if exists
    const cached = sessionStorage.getItem('bb_saved_address')
    if (cached) {
      try { setSavedAddress(JSON.parse(cached)) } catch {}
    }
    const loadProfile = async () => {
      try {
        const { default: api } = await import('../api')
        const res = await api.get('/dashboard/')
        const d = res.data
        if (d.first_name) {
          setAddressForm(f => ({
            ...f,
            name: `${d.initial ? d.initial + ' ' : ''}${d.first_name} ${d.last_name || ''}`.trim(),
            phone: d.mobile_number || '',
            city: d.city_name || '',
            state: d.state || '',
            address: d.door_no ? `${d.door_no}, ${d.street_name || ''}, ${d.town_name || ''}`.replace(/,\s*,/g, ',').trim() : '',
          }))
        }
      } catch {}
    }
    loadProfile()
  }, [])

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
  const totalPrice = (displayPrice || 0) * qty
  const inr = n => `₹${Math.round(n).toLocaleString('en-IN')}`

  const validateAddress = () => {
    const e = {}
    if (!addressForm.name.trim()) e.name = 'Required'
    if (!/^\d{10}$/.test(addressForm.phone)) e.phone = 'Valid 10-digit number'
    if (!/^\d{6}$/.test(addressForm.pincode)) e.pincode = 'Valid 6-digit pincode'
    if (!addressForm.city.trim()) e.city = 'Required'
    if (!addressForm.state.trim()) e.state = 'Required'
    if (!addressForm.address.trim()) e.address = 'Required'
    setAddressErrors(e)
    return Object.keys(e).length === 0
  }

  const handleUseAddress = () => {
    if (!validateAddress()) return
    const label = addressType === 'Other' && otherLabel.trim() ? otherLabel.trim() : addressType
    const addr = { ...addressForm, type: label, isDefault, country }
    setSavedAddress(addr)
    sessionStorage.setItem('bb_saved_address', JSON.stringify(addr))
    setShowAddressPopup(false)
  }

 // Razorpay Script Load Helper
const loadRazorpay = () => {
  return new Promise((resolve) => {
    // Already loaded check
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const handlePlaceOrder = async () => {
  if (!savedAddress) return
  setPlacing(true)

  try {
    // ── STEP 1: Razorpay script load ──
    const loaded = await loadRazorpay()
    if (!loaded) {
      alert('Payment load ஆகலை. Internet check பண்ணு!')
      setPlacing(false)
      return
    }

    // ── STEP 2: Backend-ல Razorpay order create ──
    const { default: api } = await import('../api')
    const orderRes = await api.post('/create-razorpay-order/', {
      amount: totalPrice
    })
    const { razorpay_order_id, amount, currency, key } = orderRes.data

    // ── STEP 3: Razorpay Popup Options ──
    const options = {
      key: key,
      amount: parseInt(amount) * 100,
      currency: currency,
      name: "BitByte Jewels",
      description: product.name,
      image: firstImage || '',
      order_id: razorpay_order_id,

      // ✅ Payment Success Handler
      handler: async function (response) {
        try {
          const verifyRes = await api.post('/verify-payment/', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            product_id: product.id,
            customer_name: savedAddress.name,
            customer_phone: savedAddress.phone,
            pincode: savedAddress.pincode,
            address_line1: savedAddress.address,
            address_line2: savedAddress.locality || '',
            city: savedAddress.city,
            state: savedAddress.state,
            quantity: qty,
            unit_price: displayPrice,
            total_price: totalPrice,
          })

          if (verifyRes.data.status === 'success') {
            setOrderId(verifyRes.data.order_id)
            setStep(4)  // ✅ Order Confirmed Page
          } else {
            alert('Payment verify ஆகலை! Support-ஐ contact பண்ணு.')
          }
        } catch {
          alert('Something went wrong! Try again.')
        }
        setPlacing(false)
      },

      // ❌ Customer popup close பண்ணா
      modal: {
        ondismiss: function () {
          setPlacing(false)
        }
      },

      // Customer details pre-fill
      prefill: {
        name: savedAddress.name,
        contact: savedAddress.phone,
        email: savedAddress.email || '',
      },

      // Brand color
      theme: {
        color: "#7B1F2E"
      }
    }

    // ── STEP 4: Popup திற ──
    const rzp = new window.Razorpay(options)
    rzp.open()

  } catch (err) {
    alert('Order create பண்ண முடியலை! Try again.')
    setPlacing(false)
  }
}

  const selectedCountry = COUNTRIES.find(c => c.code === country) || COUNTRIES[0]
  const filteredBanks = BANKS.filter(b => b.name.toLowerCase().includes(bankSearch.toLowerCase()))

  const inp = (err) => ({
    width: '100%', padding: '13px 16px',
    border: `1px solid ${err ? '#e53e3e' : '#e2d9d0'}`,
    borderRadius: 6, fontSize: 14, color: DARK,
    background: '#fafafa', outline: 'none',
    fontFamily: '"Montserrat", sans-serif',
    boxSizing: 'border-box',
  })
  const lbl = { display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }

  // ── ORDER SIDEBAR ──
  const OrderSidebar = () => (
    <div style={{ background: '#f9f5f2', border: '1px solid #e2d9d0', borderRadius: 8, padding: 24, position: 'sticky', top: 24 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: DARK, letterSpacing: '1px', textTransform: 'uppercase', paddingBottom: 12, borderBottom: '1px solid #e2d9d0' }}>Order Summary</h3>
      <div style={{ display: 'flex', gap: 14, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #e2d9d0' }}>
        <div style={{ width: 56, height: 56, borderRadius: 6, border: '1px solid #e2d9d0', background: '#fff', overflow: 'hidden', flexShrink: 0 }}>
          {firstImage ? <img src={firstImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 22 }}>💍</div>}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: RED, fontFamily: '"Playfair Display", serif', marginBottom: 4 }}>{product.name}</div>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>{product.product_code || ''}</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>Qty: {qty}</div>
          {step === 3 && savedAddress && (
            <div style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>
              🚚 Delivery On <strong style={{ color: DARK }}>
                {(() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }) })()}
              </strong>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: '#777' }}>Sub Total</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{inr(totalPrice)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: '#777' }}>Delivery Charge</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>FREE</span>
        </div>
        <div style={{ borderTop: '1px solid #e2d9d0', paddingTop: 10, marginTop: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: RED }}>TOTAL <span style={{ fontSize: 10, fontWeight: 400 }}>(Incl of all Taxes.)</span></span>
            <span style={{ fontSize: 13, fontWeight: 700, color: RED }}>{inr(totalPrice)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: RED }}>AMOUNT PAYABLE <span style={{ fontSize: 9, fontWeight: 400 }}>(Incl of all Taxes.)</span></span>
            <span style={{ fontSize: 13, fontWeight: 800, color: RED }}>{inr(totalPrice)}</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, padding: '10px 14px', border: `1px dashed ${RED}`, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconShield /><span style={{ fontSize: 12, fontWeight: 600, color: RED }}>Delivery secured by BitByte</span>
      </div>
    </div>
  )

  // ── STEP 4: CONFIRMED ──
  if (step === 4) {
    return (
      <div style={{ minHeight: '100vh', background: CREAM, fontFamily: '"Montserrat", sans-serif' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;500;600;700&display=swap');@keyframes checkDraw{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}@keyframes ringPop{0%{transform:scale(0.6);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}`}</style>
        <CustomerNavbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ animation: 'ringPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both', marginBottom: 32 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="rgba(123,31,46,0.08)" stroke={RED} strokeWidth="2.5"/>
              <polyline points="30,52 44,66 70,36" fill="none" stroke={RED} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="100" strokeDashoffset="0" style={{ animation: 'checkDraw 0.5s 0.3s ease both' }}/>
            </svg>
          </div>
          <div style={{ animation: 'fadeUp 0.5s 0.4s ease both', opacity: 0 }}>
            <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: RED }}>Order Confirmed</p>
            <h1 style={{ margin: '0 0 12px', fontSize: 38, fontWeight: 700, color: DARK, fontFamily: '"Playfair Display", serif' }}>Thank You!</h1>
            <p style={{ margin: '0 0 32px', color: MUTED, fontSize: 15, maxWidth: 440 }}>Your order has been placed successfully. We'll send you updates soon.</p>
            <div style={{ background: '#fff', border: '1px solid #e2d9d0', borderRadius: 8, padding: '20px 40px', display: 'inline-block', marginBottom: 32 }}>
              <div style={{ fontSize: 11, color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6 }}>Order ID</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: RED, fontFamily: '"Playfair Display", serif' }}>#{orderId}</div>
            </div>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/customer')} style={{ padding: '14px 32px', background: RED, border: 'none', borderRadius: 2, color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>Continue Shopping</button>
              <button onClick={() => navigate('/order-summary')} style={{ padding: '14px 32px', background: 'transparent', border: `1.5px solid ${RED}`, borderRadius: 2, color: RED, fontWeight: 700, fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>View My Orders</button>
            </div>
          </div>
        </div>
        <div style={{ height: '80px' }} />
        <CustomerFooter />
      </div>
    )
  }

  // ── STEP 1: REVIEW ──
  if (step === 1) {
    return (
      <div style={{ minHeight: '100vh', background: CREAM, fontFamily: '"Montserrat", sans-serif' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;500;600;700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.oc-btn:hover{opacity:0.88}`}</style>
        <CustomerNavbar />
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px', animation: 'fadeUp 0.4s ease both' }}>
          <div style={{ marginBottom: 36 }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: RED }}>+ Secure Checkout</p>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: DARK, fontFamily: '"Playfair Display", serif' }}>Review Your Order</h1>
            <div style={{ width: 48, height: 2, background: RED, marginTop: 12 }} />
          </div>
          {/* Step bar */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
            {['Review Order', 'Delivery & Payment', 'Order Placed'].map((label, i) => {
              const active = i === 0
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: active ? RED : '#e2d9d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: active ? '#fff' : '#aaa' }}>{i + 1}</div>
                    <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? DARK : '#aaa' }}>{label}</span>
                  </div>
                  {i < 2 && <div style={{ width: 40, height: 1, background: '#e2d9d0', margin: '0 12px' }} />}
                </div>
              )
            })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
            <div>
              <div style={{ background: '#fff', border: '1px solid #e2d9d0', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: 24, display: 'flex', gap: 20, borderBottom: '1px solid #f0ebe4' }}>
                  <div style={{ width: 110, height: 110, borderRadius: 6, border: '1px solid #e2d9d0', overflow: 'hidden', flexShrink: 0 }}>
                    {firstImage ? <img src={firstImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 36 }}>💍</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 2, background: 'rgba(123,31,46,0.08)', border: '1px solid rgba(123,31,46,0.2)', color: RED, display: 'inline-block', marginBottom: 8, letterSpacing: '1px' }}>
                      {metal?.toUpperCase()} · {product.grade?.toUpperCase()}
                    </div>
                    <h2 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 600, color: DARK, fontFamily: '"Playfair Display", serif' }}>{product.name}</h2>
                    <div style={{ display: 'flex', gap: 20 }}>
                      {[{ label: 'METAL', value: metal?.charAt(0).toUpperCase() + metal?.slice(1) }, { label: 'WEIGHT', value: product.net_weight ? `${product.net_weight} gm` : '—' }, { label: 'PURITY', value: product.grade?.toUpperCase() || '—' }].map(s => (
                        <div key={s.label}><div style={{ fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '1px', marginBottom: 2 }}>{s.label}</div><div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{s.value}</div></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0ebe4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: DARK }}>Quantity</span>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2d9d0', borderRadius: 2, overflow: 'hidden' }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 38, height: 38, border: 'none', background: '#f7f4f0', color: DARK, fontSize: 18, fontWeight: 700, cursor: 'pointer', borderRight: '1px solid #e2d9d0' }}>−</button>
                    <span style={{ width: 40, textAlign: 'center', fontSize: 14, fontWeight: 700, color: DARK }}>{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} style={{ width: 38, height: 38, border: 'none', background: '#f7f4f0', color: DARK, fontSize: 18, fontWeight: 700, cursor: 'pointer', borderLeft: '1px solid #e2d9d0' }}>+</button>
                  </div>
                </div>
                <div style={{ padding: '16px 24px' }}>
                  {[{ label: 'Unit Price', value: inr(displayPrice || 0) }, { label: 'Quantity', value: `× ${qty}` }, { label: 'GST (included)', value: '3%' }, { label: 'Shipping', value: 'FREE', color: '#22c55e' }].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 13, color: MUTED }}>{r.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: r.color || DARK }}>{r.value}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #e2d9d0', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: DARK }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: DARK }}>{inr(totalPrice)}</span>
                  </div>
                  <div style={{ marginTop: 14, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 6, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>🚚</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>Free Delivery</div>
                      <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>Estimated delivery: <strong style={{ color: DARK }}>3–5 business days</strong></div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="oc-btn" onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) }}style={{ marginTop: 24, width: '100%', padding: '16px', background: RED, border: 'none', borderRadius: 2, color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
                CONTINUE TO ADDRESS →
              </button>
            </div>
            <OrderSidebar />
          </div>
        </main>
        <div style={{ height: '80px' }} />
        <CustomerFooter />
      </div>
    )
  }

  // ── STEP 2: DELIVER TO ──
  if (step === 2) {
    return (
      <div style={{ minHeight: '100vh', background: CREAM, fontFamily: '"Montserrat", sans-serif' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;500;600;700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.oc-btn:hover{opacity:0.88}.country-opt:hover{background:#f9f5f2}`}</style>
        <CustomerNavbar />

        {/* ── ADDRESS POPUP ── */}
        {showAddressPopup && (
          <div onClick={() => setShowAddressPopup(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 680, maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>
              {/* Header */}
              <div style={{ padding: '22px 28px', borderBottom: '1px solid #f0ebe4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: RED }}>Add Shipping Details</h2>
                <button onClick={() => setShowAddressPopup(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#999', lineHeight: 1 }}>×</button>
              </div>

              {/* Body */}
              <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>

                {/* Contact Details */}
                <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: DARK }}>Contact Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={lbl}>Name *</label>
                    <input style={inp(addressErrors.name)} placeholder="Full Name"
                      value={addressForm.name} onChange={e => setAddressForm(f => ({ ...f, name: e.target.value }))} />
                    {addressErrors.name && <div style={{ color: '#e53e3e', fontSize: 11, marginTop: 3 }}>{addressErrors.name}</div>}
                  </div>
                  <div>
                    <label style={lbl}>Email</label>
                    <input style={inp()} placeholder="Email (optional)"
                      value={addressForm.email} onChange={e => setAddressForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={lbl}>Contact Number *</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ padding: '13px 14px', border: '1px solid #e2d9d0', borderRadius: 6, background: '#fafafa', fontSize: 14, color: DARK, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      🇮🇳 +91
                    </div>
                    <input style={{ ...inp(addressErrors.phone), flex: 1 }} placeholder="10-digit mobile" maxLength={10}
                      value={addressForm.phone} onChange={e => setAddressForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  {addressErrors.phone && <div style={{ color: '#e53e3e', fontSize: 11, marginTop: 3 }}>{addressErrors.phone}</div>}
                </div>

                {/* Address Details */}
                <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: DARK }}>Address Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '0.65fr 1fr 1fr', gap: 12, marginBottom: 12 }}>

                  {/* Country dropdown */}
                  <div style={{ position: 'relative' }}>
                    <label style={lbl}>Country *</label>
                    <div onClick={() => setShowCountryDrop(v => !v)}
                      style={{ padding: '13px 14px', border: '1px solid #e2d9d0', borderRadius: 6, background: '#fafafa', fontSize: 14, color: DARK, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
                      <span>{selectedCountry.flag}</span>
                      <span>{selectedCountry.code}</span>
                      <span style={{ marginLeft: 'auto', color: '#aaa', fontSize: 12 }}>▾</span>
                    </div>
                    {showCountryDrop && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2d9d0', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, maxHeight: 220, overflowY: 'auto' }}>
                        {COUNTRIES.map(c => (
                          <div key={c.code} className="country-opt"
                            onClick={() => { setCountry(c.code); setShowCountryDrop(false) }}
                            style={{ padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', background: country === c.code ? 'rgba(123,31,46,0.06)' : '#fff', fontSize: 13, color: DARK, transition: 'background 0.15s' }}>
                            <span>{c.flag}</span>
                            <span style={{ fontWeight: country === c.code ? 700 : 400 }}>{c.name}</span>
                            <span style={{ color: '#aaa', fontSize: 11, marginLeft: 'auto' }}>{c.code}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={lbl}>Pincode *</label>
                    <input style={inp(addressErrors.pincode)} placeholder="6-digit pincode" maxLength={6}
                      value={addressForm.pincode} onChange={e => setAddressForm(f => ({ ...f, pincode: e.target.value }))} />
                    {addressErrors.pincode && <div style={{ color: '#e53e3e', fontSize: 11, marginTop: 3 }}>{addressErrors.pincode}</div>}
                  </div>
                  <div>
                    <label style={lbl}>City *</label>
                    <input style={inp(addressErrors.city)} placeholder="City"
                      value={addressForm.city} onChange={e => setAddressForm(f => ({ ...f, city: e.target.value }))} />
                    {addressErrors.city && <div style={{ color: '#e53e3e', fontSize: 11, marginTop: 3 }}>{addressErrors.city}</div>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={lbl}>State *</label>
                    <input style={inp(addressErrors.state)} placeholder="State"
                      value={addressForm.state} onChange={e => setAddressForm(f => ({ ...f, state: e.target.value }))} />
                    {addressErrors.state && <div style={{ color: '#e53e3e', fontSize: 11, marginTop: 3 }}>{addressErrors.state}</div>}
                  </div>
                  <div>
                    <label style={lbl}>Address (House No., Building, Street, Area) *</label>
                    <input style={inp(addressErrors.address)} placeholder="Address"
                      value={addressForm.address} onChange={e => setAddressForm(f => ({ ...f, address: e.target.value }))} />
                    {addressErrors.address && <div style={{ color: '#e53e3e', fontSize: 11, marginTop: 3 }}>{addressErrors.address}</div>}
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={lbl}>Locality / Town</label>
                  <input style={inp()} placeholder="Locality / Town (optional)"
                    value={addressForm.locality} onChange={e => setAddressForm(f => ({ ...f, locality: e.target.value }))} />
                </div>

                {/* Save Address As */}
                <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: DARK }}>Save Address As</h3>
                <div style={{ display: 'flex', gap: 12, marginBottom: addressType === 'Other' ? 12 : 16, flexWrap: 'wrap' }}>
                  {['Home', 'Work', 'Other'].map(t => (
                    <button key={t} onClick={() => setAddressType(t)}
                      style={{ padding: '8px 24px', borderRadius: 20, border: `1.5px solid ${addressType === t ? RED : '#e2d9d0'}`, background: addressType === t ? 'rgba(123,31,46,0.06)' : '#fff', color: addressType === t ? RED : '#777', fontWeight: addressType === t ? 700 : 400, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* Other label input */}
                {addressType === 'Other' && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={lbl}>Label Name (e.g. Parents, Office 2...)</label>
                    <input style={inp()} placeholder="Type address label..."
                      value={otherLabel} onChange={e => setOtherLabel(e.target.value)} />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" id="default-addr" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: RED }} />
                  <label htmlFor="default-addr" style={{ fontSize: 13, color: DARK, cursor: 'pointer' }}>Make This address default</label>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '16px 28px', borderTop: '1px solid #f0ebe4', display: 'flex', justifyContent: 'flex-end', gap: 12, flexShrink: 0 }}>
                <button onClick={() => setShowAddressPopup(false)} style={{ padding: '12px 28px', background: '#fff', border: `1.5px solid ${RED}`, borderRadius: 2, color: RED, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleUseAddress} style={{ padding: '12px 28px', background: RED, border: 'none', borderRadius: 2, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Use This Address</button>
              </div>
            </div>
          </div>
        )}

        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 100px', animation: 'fadeUp 0.4s ease both' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
            <div>
              {/* DELIVER TO */}
              <div style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f7f4f0', border: '1px solid #e2d9d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconLocation /></div>
                  <div style={{ width: 1, flex: 1, background: '#e2d9d0', marginTop: 8, minHeight: 40 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: DARK }}>DELIVER TO</h2>
                  {savedAddress ? (
                    <div style={{ background: '#fff', border: '1px solid #e2d9d0', borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0ebe4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#777', letterSpacing: '1px' }}>SAVED ADDRESSES</span>
                        <button onClick={() => setShowAddressPopup(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'transparent', border: `1px solid ${RED}`, borderRadius: 4, color: RED, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          <span style={{ fontSize: 16 }}>+</span> New Address
                        </button>
                      </div>
                      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{savedAddress.name.toUpperCase()}</span>
                            <span style={{ fontSize: 11, padding: '2px 10px', border: `1px solid ${RED}`, borderRadius: 20, color: RED, fontWeight: 600 }}>{savedAddress.type}</span>
                            {savedAddress.isDefault && <span style={{ fontSize: 11, padding: '2px 10px', border: '1px solid #aaa', borderRadius: 20, color: '#777', fontWeight: 600 }}>Default</span>}
                          </div>
                          <div style={{ fontSize: 13, color: MUTED }}>{savedAddress.address}{savedAddress.locality ? `, ${savedAddress.locality}` : ''} {savedAddress.city}, {savedAddress.state} {savedAddress.pincode}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, marginLeft: 16 }}>
                          <button onClick={() => setShowAddressPopup(true)} style={{ padding: '7px 18px', background: '#fff', border: '1px solid #e2d9d0', borderRadius: 4, color: DARK, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit Address</button>
                          <button onClick={() => setStep(3)} style={{ padding: '8px 18px', background: RED, border: 'none', borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Use This Address</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: '#fff', border: '1px solid #e2d9d0', borderRadius: 6, padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, color: '#aaa' }}>No saved address</span>
                      <button onClick={() => setShowAddressPopup(true)} style={{ padding: '10px 20px', background: RED, border: 'none', borderRadius: 4, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 18 }}>+</span> New Address
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* GIFTCARDS */}
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f7f4f0', border: '1px solid #e2d9d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: DARK }}>GIFTCARDS AND VOUCHERS</h3>
                  <p style={{ margin: '0 0 12px', fontSize: 13, color: MUTED }}>Apply DigiGold, NeuCoins, GiftCards/E-Gift Cards, E-Vouchers, Discount Vouchers etc.</p>
                  <div style={{ background: '#f7f4f0', border: '1px solid #e2d9d0', borderRadius: 6, padding: '14px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: MUTED }}>Coupons and Vouchers</span>
                    <span style={{ color: MUTED }}>›</span>
                  </div>
                </div>
              </div>
            </div>
            <OrderSidebar />
          </div>

          {/* Bottom bar */}
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e2d9d0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: RED }}>Total ({qty} Item{qty > 1 ? 's' : ''}) : {inr(totalPrice)}</div>
            <button className="oc-btn" disabled={!savedAddress} onClick={() => { if(savedAddress){ setStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}
              style={{ padding: '14px 32px', background: savedAddress ? RED : '#ccc', border: 'none', borderRadius: 2, color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '1px', textTransform: 'uppercase', cursor: savedAddress ? 'pointer' : 'not-allowed' }}>
              Proceed To Buy
            </button>
          </div>
          <div style={{ height: 80 }} />
        </main>
        <div style={{ height: '80px' }} />
        <CustomerFooter />
      </div>
    )
  }

  // ── STEP 3: PAYMENT ──
  if (step === 3) {
    return (
      <div style={{ minHeight: '100vh', background: CREAM, fontFamily: '"Montserrat", sans-serif' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;500;600;700&display=swap');
          @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
          .oc-btn:hover{opacity:0.88}
          .pay-tab:hover{background:rgba(123,31,46,0.03)}
          .bank-row:hover{background:#fdf8f6}
          input[type=radio]{accent-color:#7B1F2E}
        `}</style>
        <CustomerNavbar />
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 100px', animation: 'fadeUp 0.4s ease both' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>

            {/* Payment Box */}
            <div style={{ background: '#fff', border: '1px solid #e2d9d0', borderRadius: 8, overflow: 'hidden' }}>
              {/* Top bar */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0ebe4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>Order Amount</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: DARK }}>{inr(totalPrice)}</div>
                </div>
                <div style={{ padding: '8px 16px', border: `1px dashed ${RED}`, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IconShield />
                  <span style={{ fontSize: 12, fontWeight: 600, color: RED }}>Delivery secured by BitByte</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '195px 1fr', minHeight: 420 }}>
                {/* Sidebar tabs */}
                <div style={{ borderRight: '1px solid #f0ebe4' }}>
                  {[
                    { key: 'card', label: 'Debit / Credit Card', icon: <IconCard /> },
                    { key: 'upi', label: 'UPI', icon: <IconUPI /> },
                    { key: 'netbanking', label: 'Netbanking', icon: <IconBank /> },
                  ].map(tab => (
                    <div key={tab.key} className="pay-tab"
                      onClick={() => setPayTab(tab.key)}
                      style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderLeft: payTab === tab.key ? `3px solid ${RED}` : '3px solid transparent', background: payTab === tab.key ? 'rgba(123,31,46,0.04)' : 'transparent', transition: 'all 0.15s' }}>
                      <span style={{ color: payTab === tab.key ? RED : '#bbb' }}>{tab.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: payTab === tab.key ? 700 : 400, color: payTab === tab.key ? DARK : '#888' }}>{tab.label}</span>
                    </div>
                  ))}
                </div>

                {/* Content */}
                <div style={{ padding: 28 }}>

                  {/* CARD */}
                  {payTab === 'card' && (
                    <div>
                      <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 700, color: DARK }}>Enter Credit / Debit card details</h3>
                      <div style={{ marginBottom: 16 }}>
                        <label style={lbl}>Card Number</label>
                        <div style={{ position: 'relative' }}>
                          <input style={{ ...inp(), paddingRight: 48 }} placeholder="Enter Card Number"
                            value={cardForm.number} maxLength={19}
                            onChange={e => {
                              const v = e.target.value.replace(/\D/g, '').slice(0, 16)
                              setCardForm(f => ({ ...f, number: v.match(/.{1,4}/g)?.join(' ') || v }))
                            }} />
                          <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }}><IconCard /></div>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
                        <div>
                          <label style={lbl}>Expiry</label>
                          <input style={inp()} placeholder="MM/YY" maxLength={5}
                            value={cardForm.expiry}
                            onChange={e => {
                              let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                              if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2)
                              setCardForm(f => ({ ...f, expiry: v }))
                            }} />
                        </div>
                        <div>
                          <label style={lbl}>CVV</label>
                          <div style={{ position: 'relative' }}>
                            <input style={inp()} placeholder="CVV" maxLength={3} type="password"
                              value={cardForm.cvv} onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))} />
                            <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, borderRadius: '50%', background: '#e2d9d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#777', cursor: 'help' }}>?</span>
                          </div>
                        </div>
                      </div>
                      <button className="oc-btn" disabled={placing} onClick={handlePlaceOrder}
                        style={{ width: '100%', padding: '14px', background: placing ? '#ccc' : RED, border: 'none', borderRadius: 2, color: '#fff', fontWeight: 700, fontSize: 13, cursor: placing ? 'not-allowed' : 'pointer', letterSpacing: '1px' }}>
                        {placing ? 'Processing...' : 'Proceed to Pay'}
                      </button>
                    </div>
                  )}

                  {/* UPI */}
                  {payTab === 'upi' && (
                    <div>
                      <h3 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: DARK }}>Pay by any UPI app</h3>
                      <p style={{ margin: '0 0 20px', fontSize: 13, color: '#888' }}>Scan the QR using any UPI app on your mobile phone like PhonePe, Paytm, GooglePay, BHIM, etc</p>

                      {/* UPI app icons */}
                      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                        {[
                          { letter: 'P', color: '#5f259f', name: 'PhonePe' },
                          { letter: 'G', color: '#4285f4', name: 'GPay' },
                          { letter: 'Pt', color: '#002970', name: 'Paytm' },
                          { letter: 'B', color: '#004c8c', name: 'BHIM' },
                          { letter: 'A', color: '#ff9900', name: 'Amazon Pay' },
                          { letter: 'C', color: '#1a1a2e', name: 'Cred' },
                          { letter: '⋯', color: '#aaa', name: 'More' },
                        ].map(u => (
                          <div key={u.name} title={u.name}
                            style={{ width: 44, height: 44, borderRadius: 10, background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: u.letter.length > 1 ? 11 : 18, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'transform 0.15s' }}>
                            {u.letter}
                          </div>
                        ))}
                      </div>

                      <button className="oc-btn"
                        style={{ padding: '12px 28px', background: RED, border: 'none', borderRadius: 2, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginBottom: 24, letterSpacing: '1px' }}>
                        Generate QR Code
                      </button>

                      <div style={{ borderTop: '1px solid #f0ebe4', paddingTop: 20 }}>
                        <label style={{ ...lbl, marginBottom: 10, fontSize: 13 }}>Or enter UPI ID</label>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <input style={{ ...inp(), flex: 1 }} placeholder="yourname@upi"
                            value={upiId} onChange={e => setUpiId(e.target.value)} />
                          <button className="oc-btn" disabled={placing} onClick={handlePlaceOrder}
                            style={{ padding: '13px 20px', background: placing ? '#ccc' : RED, border: 'none', borderRadius: 2, color: '#fff', fontWeight: 700, fontSize: 13, cursor: placing ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
                            {placing ? '...' : 'Verify & Pay'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NETBANKING */}
                  {payTab === 'netbanking' && (
                    <div>
                      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: DARK }}>Net Banking</h3>
                      <div style={{ position: 'relative', marginBottom: 12 }}>
                        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><IconSearch /></span>
                        <input style={{ ...inp(), paddingLeft: 42 }} placeholder="Search banks"
                          value={bankSearch} onChange={e => setBankSearch(e.target.value)} />
                      </div>
                      <div style={{ border: '1px solid #e2d9d0', borderRadius: 6, overflow: 'hidden', maxHeight: 300, overflowY: 'auto' }}>
                        {filteredBanks.map((bank, i) => (
                          <div key={bank.name} className="bank-row"
                            onClick={() => setSelectedBank(bank.name)}
                            style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < filteredBanks.length - 1 ? '1px solid #f0ebe4' : 'none', cursor: 'pointer', background: selectedBank === bank.name ? 'rgba(123,31,46,0.04)' : '#fff', transition: 'background 0.15s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                              <div style={{ width: 38, height: 38, borderRadius: '50%', background: bank.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{bank.initial}</div>
                              <span style={{ fontSize: 14, color: DARK, fontWeight: selectedBank === bank.name ? 600 : 400 }}>{bank.name}</span>
                            </div>
                            <input type="radio" readOnly checked={selectedBank === bank.name} style={{ width: 16, height: 16 }} />
                          </div>
                        ))}
                        {filteredBanks.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#aaa', fontSize: 13 }}>No banks found</div>}
                      </div>
                      {selectedBank && (
                        <button className="oc-btn" disabled={placing} onClick={handlePlaceOrder}
                          style={{ marginTop: 16, width: '100%', padding: '14px', background: placing ? '#ccc' : RED, border: 'none', borderRadius: 2, color: '#fff', fontWeight: 700, fontSize: 13, cursor: placing ? 'not-allowed' : 'pointer', letterSpacing: '1px' }}>
                          {placing ? 'Processing...' : `Pay with ${selectedBank}`}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <OrderSidebar />
          </div>

          {/* Bottom bar */}
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e2d9d0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: RED }}>Total ({qty} Item{qty > 1 ? 's' : ''}) : {inr(totalPrice)}</div>
            <button onClick={() => setStep(2)} style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${RED}`, borderRadius: 2, color: RED, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>← Checkout Page</button>
          </div>
          <div style={{ height: 80 }} />
        </main>
        <div style={{ marginTop: '75px' }}></div>
        <CustomerFooter />
      </div>
    )
  }

  return null
}