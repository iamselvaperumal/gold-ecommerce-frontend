import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { getCartCountDB } from '../collection/card_section'


function TodayRateDropdown() {
  const [show, setShow] = useState(false)
  const [rates, setRates] = useState(null)

useEffect(() => {
  const token = localStorage.getItem('token')
  fetch('https://bitbyte-backend-f66f.onrender.com/api/metal-rates/', {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(r => r.json())
    .then(d => {
      const rateData = Array.isArray(d) ? d[0] : d
      if (rateData && rateData.gold_22k) setRates(rateData)
    })
    .catch(() => {})
}, [])

  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
<button style={{
  background: 'linear-gradient(90deg,#b8860b,#d4a017)', color: '#fff',
  border: 'none', borderRadius: 22, padding: '10px 20px',
  fontSize: 13, fontWeight: 700, cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
  boxShadow: '0 2px 8px rgba(184,134,11,0.3)',
  fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.3px',
}}>
  <svg width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="6" width="24" height="22" rx="2"/>
    <path d="M4 12h24"/><path d="M10 4v4"/><path d="M22 4v4"/>
    <path d="M10 18h4"/><path d="M10 23h8"/>
  </svg>
  Today's Gold Rate 22K —{' '}
  {rates?.gold_22k ? `Rs. ${parseFloat(rates.gold_22k).toFixed(0)}/-` : '...'} ▾
</button>

      {show && (
        <div style={{
          position: 'absolute', top: '110%', right: 0,
          background: '#fff', borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid #f0e8e0',
          minWidth: 260, zIndex: 999,
          overflow: 'hidden',
        }}>
          {[
{ icon: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#b8860b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="7"/><path d="M16 9v2"/><path d="M16 21v2"/><path d="M9 16h2"/><path d="M21 16h2"/><polygon points="16,11 17.5,14.5 21,15 18.5,17.5 19,21 16,19.5 13,21 13.5,17.5 11,15 14.5,14.5" strokeWidth="1.2"/></svg>, label: 'Gold 24K ', value: rates?.gold_24k },
{ icon: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="7"/><path d="M16 9v2"/><path d="M16 21v2"/><path d="M9 16h2"/><path d="M21 16h2"/></svg>, label: 'Silver', value: rates?.silver_999 },
{ icon: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#60a5fa" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4l10 8-10 16L6 12z"/><path d="M6 12h20"/><path d="M11 12l5 16"/><path d="M21 12l-5 16"/><path d="M6 12l5-8"/><path d="M26 12l-5-8"/></svg>, label: 'Diamond 18K', value: rates?.diamond_18k },
{ icon: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#93c5fd" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4l10 8-10 16L6 12z"/><path d="M6 12h20"/><path d="M11 12l5 16"/><path d="M21 12l-5 16"/><path d="M6 12l5-8"/><path d="M26 12l-5-8"/></svg>, label: 'Diamond 22K', value: rates?.diamond_22k },
{ icon: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="6"/><circle cx="16" cy="16" r="2"/><line x1="16" y1="6" x2="16" y2="4"/><line x1="16" y1="28" x2="16" y2="26"/><line x1="6" y1="16" x2="4" y2="16"/><line x1="28" y1="16" x2="26" y2="16"/></svg>, label: 'Platinum', value: rates?.platinum_92 },
          ].map((item, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 18px',
              borderBottom: i < arr.length - 1 ? '1px solid #f5f0e8' : 'none',
              background: '#fff', transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#fdf8f4'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ flexShrink: 0 }}>{item.icon}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
                <span style={{ color: '#4b3a2a', fontSize: 13, fontFamily: '"Montserrat", sans-serif', fontWeight: 500, letterSpacing: '0.3px' }}>{item.label}</span>
                <span style={{ color: item.value ? '#b8860b' : '#9ca3af', fontWeight: 700, fontSize: 14 }}>
                  {item.value ? `Rs. ${parseFloat(item.value).toFixed(0)}/-` : 'Not set'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CustomerNavbar() {
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeFilter, setActiveFilter] = useState('category')
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    const updateCount = async () => {
      const count = await getCartCountDB()
      setCartCount(count)
    }
    updateCount()
    const handler = () => updateCount()
    window.addEventListener('bb_cart_update', handler)
    return () => window.removeEventListener('bb_cart_update', handler)
  }, [])

  useEffect(() => {
    const updateWishCount = async () => {
      try {
        const res = await api.get('/wishlist/')
        setWishlistCount(res.data.count)
      } catch {}
    }
    updateWishCount()
    const handler = () => updateWishCount()
    window.addEventListener('bb_wishlist_update', handler)
    return () => window.removeEventListener('bb_wishlist_update', handler)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@400;500;600;700&display=swap');
        @keyframes borderSlide {
          from { width: 0; left: 50%; }
          to   { width: 100%; left: 0; }
        }
        .cat-item { position: relative; }
        .cat-item::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%;
          width: 0; height: 3px;
          background: linear-gradient(90deg, #8B1A1A, #b8860b);
          border-radius: 2px 2px 0 0;
          transition: width 0.3s ease, left 0.3s ease;
        }
        .cat-item:hover::after,
        .cat-item.active::after {
          width: 100%; left: 0;
        }
        .cat-item:hover .cat-icon {
          transform: translateY(-3px) scale(1.18);
          filter: drop-shadow(0 4px 8px rgba(139,26,26,0.35));
        }
        .cat-item:hover .cat-label {
          color: #8B1A1A;
          font-weight: 700;
        }
        .cat-item.active .cat-label {
          color: #8B1A1A;
          font-weight: 700;
        }
      `}</style>

      {/* ── TOP NAV ── */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #f0e8e0',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 300,
        height: '100px',
        boxShadow: '0 2px 12px rgba(139,26,26,0.06)',
        gap: '20px',
      }}>

<div
  onClick={() => navigate('/')}
  style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'flex-start', 
    cursor: 'pointer', 
    flexShrink: 0,
    minWidth: 200,
    gap: 0,
    paddingTop: '10px',
    paddingBottom: '50px',
  }}
>
  <img
    src="/BJ-logo.png"
    alt="Bharathi Jewellers"
    style={{ 
      height: '180px',      
      width: '195px',       
      objectFit: 'contain',
      display: 'block',
      marginBottom: '-30px',
    }}
  />
  <span style={{
    color: '#b8860b', 
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '2.5px', 
    textTransform: 'uppercase',
    fontFamily: '"Montserrat", sans-serif', 
    display: 'block',
    marginTop: '-28px',
    whiteSpace: 'nowrap',
  }}>✦ Bharathi Jewellers ✦</span>
</div>

        {/* Search */}
         <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', maxWidth: 640, marginLeft: '-20px' }}>
          <div style={{ width: '100%', position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 16, top: '50%',
              transform: 'translateY(-50%)', color: '#8B1A1A',
              display: 'flex', alignItems: 'center',
            }}>
              <svg width="17" height="17" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="14" cy="14" r="9"/>
                <path d="M21 21l7 7"/>
              </svg>
            </span>
            <input
              placeholder="Search gold & diamond jewellery..."
              style={{
                width: '100%', border: '1.5px solid #e8ddd5', borderRadius: 32,
                padding: '11px 18px 11px 46px', fontSize: 15, outline: 'none',
                color: '#374151', boxSizing: 'border-box', background: '#fdf8f4',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                fontFamily: '"Cormorant Garamond", Georgia, serif',
              }}
              onFocus={e => { e.target.style.borderColor = '#8B1A1A'; e.target.style.boxShadow = '0 0 0 3px rgba(139,26,26,0.08)' }}
              onBlur={e => { e.target.style.borderColor = '#e8ddd5'; e.target.style.boxShadow = 'none' }}
            />
          </div>
        </div>

        {/* Right Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>

<TodayRateDropdown />

          {/* Order Summary */}
          <button
            style={{
              background: 'linear-gradient(90deg,#8B1A1A,#b91c1c)', color: '#fff',
              border: 'none', borderRadius: 22, padding: '8px 16px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(139,26,26,0.25)', transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(139,26,26,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(139,26,26,0.25)' }}
            onClick={() => navigate('/order-summary')}
          >
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>
            </svg>
            Order Summary
          </button>

          {/* Wishlist */}
          <span
            style={{ cursor: 'pointer', position: 'relative', color: wishlistCount > 0 ? '#e11d48' : '#8B1A1A', transition: 'transform 0.2s, color 0.2s', display: 'flex', alignItems: 'center' }}
            onClick={() => navigate('/wishlist')}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.color = '#e11d48' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = wishlistCount > 0 ? '#e11d48' : '#8B1A1A' }}
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill={wishlistCount > 0 ? '#e11d48' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 27s-11-7.5-11-14.5a6.5 6.5 0 0111-4.7 6.5 6.5 0 0111 4.7c0 7-11 14.5-11 14.5z"/>
            </svg>
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-8px',
                background: '#e11d48', color: '#fff', borderRadius: '50%',
                width: '16px', height: '16px', fontSize: '9px', fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{wishlistCount}</span>
            )}
          </span>

          {/* Profile */}
          <span
            style={{ cursor: 'pointer', color: '#8B1A1A', transition: 'transform 0.2s, color 0.2s', display: 'flex', alignItems: 'center' }}
            onClick={() => navigate('/profile')}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.color = '#6b1212' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = '#8B1A1A' }}
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="16" cy="10" r="5"/>
              <path d="M4 28c0-6.6 5.4-12 12-12s12 5.4 12 12"/>
            </svg>
          </span>

          {/* Cart */}
          <span
            style={{ cursor: 'pointer', position: 'relative', color: '#8B1A1A', transition: 'transform 0.2s, color 0.2s', display: 'flex', alignItems: 'center' }}
            onClick={() => navigate('/cart')}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.color = '#6b1212' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = '#8B1A1A' }}
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h3l3 14h14l3-10H8"/>
              <circle cx="13" cy="26" r="1.5" fill="currentColor"/>
              <circle cx="23" cy="26" r="1.5" fill="currentColor"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-8px',
                background: '#8B1A1A', color: '#fff', borderRadius: '50%',
                width: '16px', height: '16px', fontSize: '9px', fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cartCount}</span>
            )}
          </span>

        </div>
      </div>

      {/* ── CATEGORY NAV ── */}
      <div style={{ position: 'sticky', top: '100px', zIndex: 250, background: '#fff' }} onMouseLeave={() => setShowDropdown(false)}>
        <div style={{
          borderBottom: '1px solid #f0e8e0', padding: '0 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', minHeight: 72, width: '100%', boxSizing: 'border-box',
        }}>
          {[
            { name: 'All Jewellery', key: 'all', svg: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12l10-6 10 6v10l-10 6-10-6z"/><path d="M6 12l10 6 10-6"/><line x1="16" y1="18" x2="16" y2="28"/></svg> },
            { name: 'Gold', key: 'gold', svg: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><polygon points="16,4 19.5,12.5 28,13.5 22,19.5 23.5,28 16,24 8.5,28 10,19.5 4,13.5 12.5,12.5"/></svg> },
            { name: 'Diamond', key: 'diamond', svg: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4l10 8-10 16L6 12z"/><path d="M6 12h20"/><path d="M11 12l5 16"/><path d="M21 12l-5 16"/><path d="M6 12l5-8"/><path d="M26 12l-5-8"/></svg> },
            { name: 'Platinum', key: 'platinum', svg: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="6"/><circle cx="16" cy="16" r="2"/><line x1="16" y1="6" x2="16" y2="4"/><line x1="16" y1="28" x2="16" y2="26"/><line x1="6" y1="16" x2="4" y2="16"/><line x1="28" y1="16" x2="26" y2="16"/></svg> },
            { name: 'Silver', key: 'silver', svg: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10h20v12a4 4 0 01-4 4H10a4 4 0 01-4-4V10z"/><path d="M6 10l3-5h14l3 5"/><path d="M12 10v16"/><path d="M20 10v16"/><path d="M6 16h20"/></svg> },
            { name: 'Coins', key: 'coins', svg: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="7"/><path d="M16 9v2"/><path d="M16 21v2"/><path d="M9 16h2"/><path d="M21 16h2"/><path d="M16 13v3l2 2"/></svg> },
            { name: 'Offers', key: 'offers', svg: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16L16 4l12 12v12H20v-7h-8v7H4z"/><circle cx="12" cy="13" r="1.5" fill="currentColor"/><circle cx="20" cy="13" r="1.5" fill="currentColor"/></svg> },
            { name: 'Wedding', key: 'wedding', svg: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 27s-11-7-11-14a7 7 0 0111-5.7A7 7 0 0127 13c0 7-11 14-11 14z"/><circle cx="11" cy="10" r="2.5"/><circle cx="21" cy="10" r="2.5"/><path d="M11 12.5v3"/><path d="M21 12.5v3"/></svg> },
            { name: 'BJ-LIVE', key: 'bjlive', svg: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="5"/><circle cx="16" cy="16" r="10" strokeDasharray="3 2"/><path d="M8 8l2 2"/><path d="M22 8l-2 2"/><path d="M8 24l2-2"/><path d="M22 24l-2-2"/><circle cx="16" cy="16" r="2" fill="currentColor"/></svg> },
            { name: 'Gifting', key: 'gifting', svg: <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="13" width="24" height="4" rx="1"/><rect x="6" y="17" width="20" height="11" rx="1"/><path d="M16 13v15"/><path d="M16 13c0 0-4-6 0-8 2-1 4 1 4 4s-2 4-4 4z"/><path d="M16 13c0 0 4-6 0-8-2-1-4 1-4 4s2 4 4 4z"/></svg> },
          ].map(cat => {
            const isActive = showDropdown && activeCategory === cat.key
            return (
              <div
                key={cat.key}
                className={`cat-item${isActive ? ' active' : ''}`}
                onMouseEnter={() => {
                  if (cat.key === 'bjlive') { setShowDropdown(false); return }
                  setShowDropdown(true)
                  setActiveCategory(cat.key)
                  const defaults = { all: 'category', gold: 'category', diamond: 'category', platinum: 'category', silver: 'category', coins: 'silver', wedding: 'category', gifting: 'giftsfor', offers: 'alloffers' }
                  setActiveFilter(defaults[cat.key] || 'category')
                }}
                onClick={() => { if (cat.key === 'bjlive') navigate('/bj-live') }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 14px', cursor: 'pointer', userSelect: 'none', minWidth: 64 }}
              >
                <div className="cat-icon" style={{
                  width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isActive ? '#8B1A1A' : '#6b5c4a',
                  transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  transform: isActive ? 'translateY(-4px) scale(1.15)' : 'translateY(0) scale(1)',
                  filter: isActive ? 'drop-shadow(0 4px 8px rgba(139,26,26,0.3))' : 'none',
                }}>{cat.svg}</div>
                <span className="cat-label" style={{
                  fontSize: 11, fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#8B1A1A' : '#4b3a2a',
                  whiteSpace: 'nowrap', transition: 'color 0.25s',
                  letterSpacing: isActive ? '0.8px' : '0.3px',
                  fontFamily: '"Montserrat", sans-serif', textTransform: 'uppercase',
                }}>{cat.name}</span>
              </div>
            )
          })}
        </div>

        {/* ── DROPDOWN ── */}
        {showDropdown && (() => {
          const DROPDOWN_CONFIG = {
            all: {
              filters: ['Category', 'Price', 'Occasion', 'Gender'],
              filterKeys: ['category', 'price', 'occasion', 'gender'],
              panels: {
                category: { type: 'icon-grid', items: ['Earrings', 'Finger Rings', 'Chains', 'Necklaces', 'Bangles', 'Bracelets'] },
                price: { type: 'price-grid', items: [{ label: '< ₹25K' }, { label: '₹25K – ₹50K' }, { label: '₹50K – ₹1L' }, { label: '₹1L & Above' }] },
                occasion: { type: 'occasion-grid', items: [{ label: 'Office Wear' }, { label: 'Modern Wear' }, { label: 'Casual Wear' }, { label: 'Traditional Wear' }] },
                gender: { type: 'gender-grid', items: [{ label: 'Women' }, { label: 'Men' }, { label: 'Kids & Teens' }] },
              }
            },
            gold: {
              filters: ['Category', 'Price', 'Occasion', 'Gender'],
              filterKeys: ['category', 'price', 'occasion', 'gender'],
              panels: {
                category: { type: 'icon-grid', items: ['Gold Bracelets', 'Gold Earrings', 'Gold Chains', 'Gold Rings', 'Gold Bangles', 'Gold Necklaces'] },
                price: { type: 'price-grid', items: [{ label: '< ₹25K' }, { label: '₹25K – ₹50K' }, { label: '₹50K – ₹1L' }, { label: '₹1L & Above' }] },
                occasion: { type: 'occasion-grid', items: [{ label: 'Office Wear' }, { label: 'Modern Wear' }, { label: 'Casual Wear' }, { label: 'Traditional Wear' }] },
                gender: { type: 'gender-grid', items: [{ label: 'Women' }, { label: 'Men' }, { label: 'Kids & Teens' }] },
              }
            },
            diamond: {
              filters: ['Category', 'Price', 'Occasion', 'Gender'],
              filterKeys: ['category', 'price', 'occasion', 'gender'],
              panels: {
                category: { type: 'icon-grid', items: ['Diamond Earrings', 'Diamond Rings', 'Diamond Chains', 'Diamond Necklaces', 'Diamond Bangles', 'Diamond Bracelets'] },
                price: { type: 'price-grid', items: [{ label: '< ₹25K' }, { label: '₹25K – ₹50K' }, { label: '₹50K – ₹1L' }, { label: '₹1L & Above' }] },
                occasion: { type: 'occasion-grid', items: [{ label: 'Office Wear' }, { label: 'Modern Wear' }, { label: 'Casual Wear' }, { label: 'Traditional Wear' }] },
                gender: { type: 'gender-grid', items: [{ label: 'Women' }, { label: 'Men' }, { label: 'Kids & Teens' }] },
              }
            },
            platinum: {
              filters: ['Category', 'Price', 'Occasion', 'Gender'],
              filterKeys: ['category', 'price', 'occasion', 'gender'],
              panels: {
                category: { type: 'icon-grid', items: ['Platinum Rings', 'Platinum Necklaces', 'Platinum Chains', 'Platinum Bangles', 'Platinum Bracelets', 'Platinum Earrings'] },
                price: { type: 'price-grid', items: [{ label: '< ₹25K' }, { label: '₹25K – ₹50K' }, { label: '₹50K – ₹1L' }, { label: '₹1L & Above' }] },
                occasion: { type: 'occasion-grid', items: [{ label: 'Office Wear' }, { label: 'Modern Wear' }, { label: 'Casual Wear' }, { label: 'Traditional Wear' }] },
                gender: { type: 'gender-grid', items: [{ label: 'Women' }, { label: 'Men' }, { label: 'Kids & Teens' }] },
              }
            },
            silver: {
              filters: ['Category', 'Price', 'Occasion', 'Gender'],
              filterKeys: ['category', 'price', 'occasion', 'gender'],
              panels: {
                category: { type: 'icon-grid', items: ['Silver Bangles', 'Silver Bracelets', 'Silver Earrings', 'Silver Chains', 'Silver Rings', 'Silver Necklaces', 'Silver Anklets'] },
                price: { type: 'price-grid', items: [{ label: '< ₹25K' }, { label: '₹25K – ₹50K' }, { label: '₹50K – ₹1L' }, { label: '₹1L & Above' }] },
                occasion: { type: 'occasion-grid', items: [{ label: 'Office Wear' }, { label: 'Modern Wear' }, { label: 'Casual Wear' }, { label: 'Traditional Wear' }] },
                gender: { type: 'gender-grid', items: [{ label: 'Women' }, { label: 'Men' }, { label: 'Kids & Teens' }] },
              }
            },
            coins: {
              filters: ['Silver', 'Gold 22K', 'Gold 24K', 'Price'],
              filterKeys: ['silver', 'gold22k', 'gold24k', 'price'],
              panels: {
                silver: { type: 'coin-nav-grid', metal: 'silver', items: [{ label: 'All Silver', grams: null }, { label: '500 mg', grams: 0.50 }, { label: '1 gm', grams: 1 }, { label: '2 gm', grams: 2 }, { label: '5 gm', grams: 5 }, { label: '10 gm', grams: 10 }, { label: '20 gm', grams: 20 }, { label: '50 gm', grams: 50 }, { label: '100 gm', grams: 100 }] },
                gold22k: { type: 'coin-nav-grid', metal: 'gold22k', items: [{ label: 'All Gold', grams: null }, { label: '100 mg', grams: 0.10 }, { label: '200 mg', grams: 0.20 }, { label: '500 mg', grams: 0.50 }, { label: '1 gm', grams: 1 }, { label: '2 gm', grams: 2 }, { label: '4 gm', grams: 4 }, { label: '8 gm', grams: 8 }, { label: '16 gm', grams: 16 }, { label: '40 gm', grams: 40 }] },
                gold24k: { type: 'coin-nav-grid', metal: 'gold24k', items: [{ label: 'All Gold', grams: null }, { label: '100 mg', grams: 0.10 }, { label: '200 mg', grams: 0.20 }, { label: '500 mg', grams: 0.50 }, { label: '1 gm', grams: 1 }, { label: '2 gm', grams: 2 }, { label: '4 gm', grams: 4 }, { label: '8 gm', grams: 8 }, { label: '16 gm', grams: 16 }, { label: '40 gm', grams: 40 }] },
                price: { type: 'price-grid', items: [{ label: '< ₹25K' }, { label: '₹25K – ₹50K' }, { label: '₹50K – ₹1L' }, { label: '₹1L & Above' }] },
              }
            },
            wedding: {
              filters: ['Category', 'Community'],
              filterKeys: ['category', 'community'],
              panels: {
                category: { type: 'image-grid', items: [{ label: 'Wedding Ring', emoji: '💍' }, { label: 'Wedding Necklaces', emoji: '📿' }, { label: 'Wedding Chain', emoji: '✨' }, { label: 'Wedding Bangles', emoji: '💛' }, { label: 'Wedding Earring', emoji: '👂' }] },
                community: { type: 'community-grid', items: ['Tamil Bride', 'Kerala Bride', 'Karnataka Bride', 'Andhra Bride', 'Punjabi Bride'] },
              }
            },
            gifting: {
              filters: ['Gifts for', 'Gift Card', 'Price', 'Occasion', 'Corporate Gifting'],
              filterKeys: ['giftsfor', 'giftcard', 'price', 'occasion', 'corporate'],
              panels: {
                giftsfor: { type: 'gender-grid', items: [{ label: 'Her' }, { label: 'Him' }, { label: 'Kids' }] },
                giftcard: { type: 'giftcard-grid', items: [{ label: 'BitByte Gift Card', emoji: '🎁' }, { label: 'BitByte E-Gift Card', emoji: '💌' }] },
                price: { type: 'price-grid', items: [{ label: '< ₹25K' }, { label: '₹25K – ₹50K' }, { label: '₹50K – ₹1L' }, { label: '₹1L & Above' }] },
                occasion: { type: 'occasion-grid', items: [{ label: 'Wedding', emoji: '💍' }, { label: 'Birthday', emoji: '🎂' }, { label: 'Anniversary', emoji: '❤️' }, { label: 'Auspicious', emoji: '🪔' }] },
                corporate: { type: 'icon-grid', items: ['Corporate Gifts', 'Bulk Orders', 'Custom Engraving'] },
              }
            },
            offers: {
              filters: ['All Offers', 'Gold Offers', 'Diamond Offers', 'Festive Deals'],
              filterKeys: ['alloffers', 'goldoffers', 'diamondoffers', 'festive'],
              panels: {
                alloffers: { type: 'offers-grid', items: [{ label: 'Making Charge Off', emoji: '🏷️', badge: 'UPTO 20%' }, { label: 'Exchange Bonus', emoji: '🔄', badge: 'EXTRA ₹500' }, { label: 'New Arrivals', emoji: '✨', badge: 'FRESH STOCK' }, { label: 'Clearance Sale', emoji: '🔥', badge: 'LIMITED' }] },
                goldoffers: { type: 'offers-grid', items: [{ label: 'Gold Making Off', emoji: '🥇', badge: 'UPTO 15%' }, { label: 'Gold Exchange', emoji: '🔄', badge: 'BONUS ₹300' }, { label: 'BIS Hallmark Gold', emoji: '✅', badge: 'CERTIFIED' }, { label: 'Gold Coins Deal', emoji: '🪙', badge: 'SPECIAL PRICE' }] },
                diamondoffers: { type: 'offers-grid', items: [{ label: 'Diamond Making Off', emoji: '💎', badge: 'UPTO 25%' }, { label: 'Solitaire Special', emoji: '💍', badge: 'EXCLUSIVE' }, { label: 'Certified Diamond', emoji: '✅', badge: 'IGI/GIA' }, { label: 'Buy 1 Get 1', emoji: '🎁', badge: 'LIMITED' }] },
                festive: { type: 'offers-grid', items: [{ label: 'Akshaya Tritiya', emoji: '🪔', badge: 'SPECIAL' }, { label: 'Dhanteras Offer', emoji: '🏮', badge: 'DIWALI' }, { label: 'Wedding Season', emoji: '💒', badge: 'BRIDAL' }, { label: 'Anniversary Deals', emoji: '❤️', badge: 'COUPLE' }] },
              }
            },
          }

          const cfg = DROPDOWN_CONFIG[activeCategory] || DROPDOWN_CONFIG['all']
          const panel = cfg.panels[activeFilter] || cfg.panels[cfg.filterKeys[0]]

          const CATEGORY_ROUTES = {
            'Earrings': '/collection/earrings', 'Chains': '/collection/chains',
            'Necklaces': '/collection/necklaces', 'Bangles': '/collection/bangles',
            'Finger Rings': '/collection/rings', 'Bracelets': '/collection/bracelets',
            'Gold Earrings': '/gold-earrings', 'Gold Chains': '/gold-chain',
            'Gold Rings': '/gold-rings', 'Gold Bangles': '/gold-bangles',
            'Gold Necklaces': '/gold-necklaces', 'Gold Bracelets': '/gold-bracelets',
            'Silver Bangles': '/silver-bangles', 'Silver Earrings': '/silver-earrings',
            'Silver Chains': '/silver-chain', 'Silver Rings': '/silver-rings',
            'Silver Necklaces': '/silver-necklaces', 'Silver Bracelets': '/silver-bracelets',
            'Silver Anklets': '/collection/all?metal=silver',
                // Diamond  ← CHANGE THESE
    'Diamond Earrings': '/diamond-earrings',
    'Diamond Rings': '/diamond-rings',
    'Diamond Chains': '/diamond-chain',
    'Diamond Necklaces': '/diamond-necklaces',
    'Diamond Bangles': '/diamond-bangles',
    'Diamond Bracelets': '/diamond-bracelets',

     // Platinum  ← THESE ARE ALREADY CORRECT
    'Platinum Rings': '/platinum-rings',
    'Platinum Necklaces': '/platinum-necklaces',
    'Platinum Chains': '/platinum-chain',
    'Platinum Bangles': '/platinum-bangles',
    'Platinum Bracelets': '/platinum-bracelets',
    'Platinum Earrings': '/platinum-earrings',

          }

          const ITEM_ICONS = {
            'Earrings': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="7" r="2.5"/><path d="M11 9.5v4"/><path d="M8.5 13.5h5l-1.2 6-1.3 3-1.3-3-1.2-6z"/><circle cx="21" cy="7" r="2.5"/><path d="M21 9.5v4"/><path d="M18.5 13.5h5l-1.2 6-1.3 3-1.3-3-1.2-6z"/></svg>,
            'Finger Rings': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="19" r="8"/><circle cx="16" cy="19" r="4.5"/><path d="M13 11l-2-4h10l-2 4"/></svg>,
            'Chains': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="10" cy="10" rx="4" ry="2.5" transform="rotate(-45 10 10)"/><ellipse cx="16" cy="16" rx="4" ry="2.5" transform="rotate(-45 16 16)"/><ellipse cx="22" cy="22" rx="4" ry="2.5" transform="rotate(-45 22 22)"/></svg>,
            'Necklaces': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6c0 10 4 16 10 18 6-2 10-8 10-18"/><circle cx="16" cy="26" r="2.5"/></svg>,
            'Bangles': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="6.5"/></svg>,
            'Bracelets': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12c0-4.4 3.6-8 8-8s8 3.6 8 8"/><path d="M8 20c0 4.4 3.6 8 8 8s8-3.6 8-8"/><rect x="5" y="12" width="6" height="8" rx="2"/><rect x="21" y="12" width="6" height="8" rx="2"/></svg>,
            'Gold Earrings': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="7" r="2.5"/><path d="M11 9.5v4"/><path d="M8.5 13.5h5l-1.2 6-1.3 3-1.3-3-1.2-6z"/><circle cx="21" cy="7" r="2.5"/><path d="M21 9.5v4"/><path d="M18.5 13.5h5l-1.2 6-1.3 3-1.3-3-1.2-6z"/></svg>,
            'Gold Chains': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="10" cy="10" rx="4" ry="2.5" transform="rotate(-45 10 10)"/><ellipse cx="16" cy="16" rx="4" ry="2.5" transform="rotate(-45 16 16)"/><ellipse cx="22" cy="22" rx="4" ry="2.5" transform="rotate(-45 22 22)"/></svg>,
            'Gold Rings': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="19" r="8"/><circle cx="16" cy="19" r="4.5"/><path d="M13 11l-2-4h10l-2 4"/></svg>,
            'Gold Bangles': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="6.5"/></svg>,
            'Gold Necklaces': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6c0 10 4 16 10 18 6-2 10-8 10-18"/><circle cx="16" cy="26" r="2.5"/></svg>,
            'Gold Bracelets': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12c0-4.4 3.6-8 8-8s8 3.6 8 8"/><path d="M8 20c0 4.4 3.6 8 8 8s8-3.6 8-8"/><rect x="5" y="12" width="6" height="8" rx="2"/><rect x="21" y="12" width="6" height="8" rx="2"/></svg>,
            'Diamond Earrings': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="7" r="2"/><path d="M11 9v3"/><path d="M8 12h6l-3 8z"/><circle cx="21" cy="7" r="2"/><path d="M21 9v3"/><path d="M18 12h6l-3 8z"/></svg>,
            'Diamond Rings': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="20" r="7"/><circle cx="16" cy="20" r="3.5"/><path d="M12 13l-2-5h12l-2 5"/><path d="M14 8l2 5 2-5"/></svg>,
            'Diamond Necklaces': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6c0 10 4 16 10 18 6-2 10-8 10-18"/><path d="M13 24l3 4 3-4"/></svg>,
            'Diamond Bangles': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="6"/><path d="M16 6l2 2-2 2-2-2z" fill="currentColor" stroke="none"/></svg>,
            'Diamond Bracelets': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12c0-4.4 3.6-8 8-8s8 3.6 8 8"/><path d="M8 20c0 4.4 3.6 8 8 8s8-3.6 8-8"/><rect x="5" y="12" width="6" height="8" rx="2"/><rect x="21" y="12" width="6" height="8" rx="2"/><circle cx="16" cy="4" r="1.5" fill="currentColor" stroke="none"/></svg>,
            'Silver Bangles': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="6.5"/></svg>,
            'Silver Bracelets': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12c0-4.4 3.6-8 8-8s8 3.6 8 8"/><path d="M8 20c0 4.4 3.6 8 8 8s8-3.6 8-8"/><rect x="5" y="12" width="6" height="8" rx="2"/><rect x="21" y="12" width="6" height="8" rx="2"/></svg>,
            'Silver Earrings': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="7" r="2.5"/><path d="M11 9.5v4"/><path d="M8.5 13.5h5l-2.5 9z"/><circle cx="21" cy="7" r="2.5"/><path d="M21 9.5v4"/><path d="M18.5 13.5h5l-2.5 9z"/></svg>,
            'Silver Chains': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="10" cy="10" rx="4" ry="2.5" transform="rotate(-45 10 10)"/><ellipse cx="16" cy="16" rx="4" ry="2.5" transform="rotate(-45 16 16)"/><ellipse cx="22" cy="22" rx="4" ry="2.5" transform="rotate(-45 22 22)"/></svg>,
            'Silver Rings': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="19" r="8"/><circle cx="16" cy="19" r="4.5"/><path d="M13 11l-2-4h10l-2 4"/></svg>,
            'Silver Necklaces': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6c0 10 4 16 10 18 6-2 10-8 10-18"/><circle cx="16" cy="26" r="2.5"/></svg>,
            'Silver Anklets': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="18" r="9"/><circle cx="16" cy="18" r="5.5"/><path d="M12 28l4 2 4-2"/></svg>,
            'Platinum Rings': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="19" r="8"/><circle cx="16" cy="19" r="4.5"/><path d="M13 11l-2-4h10l-2 4"/></svg>,
            'Platinum Necklaces': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6c0 10 4 16 10 18 6-2 10-8 10-18"/><circle cx="16" cy="26" r="2.5"/></svg>,
            'Platinum Coins': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="7"/><line x1="16" y1="9" x2="16" y2="23"/><line x1="9" y1="16" x2="23" y2="16"/></svg>,
            'Platinum Bangles': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="6.5"/></svg>,
            'Platinum Bracelets': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12c0-4.4 3.6-8 8-8s8 3.6 8 8"/><path d="M8 20c0 4.4 3.6 8 8 8s8-3.6 8-8"/><rect x="5" y="12" width="6" height="8" rx="2"/><rect x="21" y="12" width="6" height="8" rx="2"/></svg>,
            'Platinum Earrings': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="7" r="2.5"/><path d="M11 9.5v4"/><path d="M8.5 13.5h5l-1.2 6-1.3 3-1.3-3-1.2-6z"/><circle cx="21" cy="7" r="2.5"/><path d="M21 9.5v4"/><path d="M18.5 13.5h5l-1.2 6-1.3 3-1.3-3-1.2-6z"/></svg>,
            'Corporate Gifts': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="13" width="24" height="4" rx="1"/><rect x="6" y="17" width="20" height="11" rx="1"/><path d="M16 13v15"/><path d="M16 13c0 0-3-5 0-7 1.5-1 3.5 1 3 3s-3 4-3 4z"/><path d="M16 13c0 0 3-5 0-7-1.5-1-3.5 1-3 3s3 4 3 4z"/></svg>,
            'Bulk Orders': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="10" height="10" rx="1"/><rect x="13" y="8" width="10" height="10" rx="1"/><rect x="8" y="18" width="10" height="10" rx="1"/></svg>,
            'Custom Engraving': <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 26l4-4 12-12-4-4L6 18z"/><path d="M22 6l4 4"/><path d="M6 26l-2 2"/></svg>,
          }

          const sectionTitles = {
            category: 'Browse by Category', price: 'Shop by Price', occasion: 'Shop by Occasion',
            gender: 'Shop by Gender', community: 'Shop by Community', giftsfor: 'Gifts for',
            giftcard: 'Gift Cards', corporate: 'Corporate Gifting',
            alloffers: 'All Offers', goldoffers: 'Gold Offers', diamondoffers: 'Diamond Offers', festive: 'Festive Deals',
            silver: '✦ Silver Coins', gold22k: '✦ Gold 22K Coins', gold24k: '✦ Gold 24K Coins',
          }

          const renderPanel = () => {
            if (!panel) return null

            if (panel.type === 'icon-grid') return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {panel.items.map(item => (
                  <div key={item}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.18s ease', border: '1px solid transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fdf2f2'; e.currentTarget.style.borderColor = 'rgba(139,26,26,0.15)'; e.currentTarget.querySelector('.cii').style.color = '#8B1A1A'; e.currentTarget.querySelector('.cii').style.borderColor = '#8B1A1A'; e.currentTarget.querySelector('.cil').style.color = '#8B1A1A' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.querySelector('.cii').style.color = '#6b5c4a'; e.currentTarget.querySelector('.cii').style.borderColor = '#e8e0d0'; e.currentTarget.querySelector('.cil').style.color = '#1f2937' }}
                    onClick={() => { const route = CATEGORY_ROUTES[item]; if (route) { setShowDropdown(false); navigate(route) } }}
                  >
                    <div className="cii" style={{ width: 36, height: 36, borderRadius: '50%', background: '#faf6f0', border: '1px solid #e8e0d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#6b5c4a', transition: 'all 0.18s ease' }}>
                      {ITEM_ICONS[item] || <svg width="18" height="18" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="16" cy="16" r="10"/></svg>}
                    </div>
                    <span className="cil" style={{ fontSize: 13, color: '#1f2937', fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600, letterSpacing: '0.3px', transition: 'color 0.18s ease', lineHeight: 1.3 }}>{item}</span>
                  </div>
                ))}
              </div>
            )

            if (panel.type === 'price-grid') {
              const priceImgMap = { '< ₹25K': '/25k below.jpg', '₹25K – ₹50K': '/25k-50k.jpg', '₹50K – ₹1L': '/50k-1L.jpg', '₹1L & Above': '/1L above.jpg' }
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                  {panel.items.map(p => (
                    <div key={p.label} style={{ textAlign: 'center', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.querySelector('.ph-box').style.borderColor = '#8B1A1A'; e.currentTarget.querySelector('.ph-label').style.color = '#8B1A1A' }}
                      onMouseLeave={e => { e.currentTarget.querySelector('.ph-box').style.borderColor = '#e8e0d0'; e.currentTarget.querySelector('.ph-label').style.color = '#1f2937' }}
onClick={() => {
  const priceMap = { '< ₹25K': 'below25k', '₹25K – ₹50K': '25k-50k', '₹50K – ₹1L': '50k-1L', '₹1L & Above': 'above1L' }
  const metalParam = activeCategory !== 'all' && activeCategory !== 'coins' && activeCategory !== 'wedding' && activeCategory !== 'gifting' && activeCategory !== 'offers'
    ? `&metal=${activeCategory}` : ''
  setShowDropdown(false)
  navigate(`/collection/all?price=${priceMap[p.label]}${metalParam}`)
}}>
                      <div className="ph-box" style={{ width: '90%', height: '190px', borderRadius: 12, background: '#f5f0e8', border: '0.5px solid #e8e0d0', overflow: 'hidden', marginBottom: 8, transition: 'border-color 0.15s' }}>
                        {priceImgMap[p.label] ? <img src={priceImgMap[p.label]} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                      </div>
                      <div className="ph-label" style={{ fontSize: 14, color: '#1f2937', transition: 'color 0.15s', fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600, letterSpacing: '0.3px' }}>{p.label}</div>
                    </div>
                  ))}
                </div>
              )
            }

            if (panel.type === 'occasion-grid') {
              const occasionImgMap = { 'Office Wear': '/Office Wear.jpg', 'Modern Wear': '/Modern Wear.jpg', 'Casual Wear': '/Casual Wear.jpg', 'Traditional Wear': '/Traditional Wear.jpg', 'Wedding': null, 'Birthday': null, 'Anniversary': null, 'Auspicious': null }
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                  {panel.items.map(o => (
                    <div key={o.label} style={{ textAlign: 'center', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.querySelector('.oh-box').style.borderColor = '#8B1A1A'}
                      onMouseLeave={e => e.currentTarget.querySelector('.oh-box').style.borderColor = '#e8e0d0'}
                     onClick={() => {
  const metalParam = activeCategory !== 'all' && activeCategory !== 'coins' && activeCategory !== 'wedding' && activeCategory !== 'gifting' && activeCategory !== 'offers'
    ? `&metal=${activeCategory}` : ''
  setShowDropdown(false)
  navigate(`/collection/all?occasion=${encodeURIComponent(o.label)}${metalParam}`)
}}>
                      <div className="oh-box" style={{ width: '100%', height: '190px', borderRadius: 12, background: '#f5f0e8', border: '0.5px solid #e8e0d0', overflow: 'hidden', marginBottom: 8, transition: 'border-color 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                        {occasionImgMap[o.label] ? <img src={occasionImgMap[o.label]} alt={o.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{o.emoji}</span>}
                      </div>
                      <div style={{ fontSize: 14, color: '#1f2937', fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600, letterSpacing: '0.3px' }}>{o.label}</div>
                    </div>
                  ))}
                </div>
              )
            }

            if (panel.type === 'gender-grid') {
              const genderImgMap = { 'Women': "/Woman's Jewlley.jpg", 'Her': "/Woman's Jewlley.jpg", 'Men': "/Men's Jewellery.jpg", 'Him': "/Men's Jewellery.jpg", 'Kids & Teens': "/Kids Jewllery.jpg", 'Kids': "/Kids Jewllery.jpg" }
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, maxWidth: 460 }}>
                  {panel.items.map(g => (
                    <div key={g.label} style={{ textAlign: 'center', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.querySelector('.gh-box').style.borderColor = '#8B1A1A'}
                      onMouseLeave={e => e.currentTarget.querySelector('.gh-box').style.borderColor = '#e8e0d0'}
                      onClick={() => {
  const gMap = { 'Women': 'women', 'Her': 'women', 'Men': 'men', 'Him': 'men', 'Kids & Teens': 'kids', 'Kids': 'kids' }
  const g2 = gMap[g.label]
  const metalParam = activeCategory !== 'all' && activeCategory !== 'coins' && activeCategory !== 'wedding' && activeCategory !== 'gifting' && activeCategory !== 'offers'
    ? `&metal=${activeCategory}` : ''
  if (g2) { setShowDropdown(false); navigate(`/collection/all?gender=${g2}${metalParam}`) }
}}>
                      <div className="gh-box" style={{ width: '100%', aspectRatio: '0.85', borderRadius: 12, background: '#f5f0e8', border: '0.5px solid #e8e0d0', overflow: 'hidden', marginBottom: 8, transition: 'border-color 0.15s' }}>
                        {genderImgMap[g.label] ? <img src={genderImgMap[g.label]} alt={g.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                      </div>
                      <div style={{ fontSize: 14, color: '#1f2937', fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600, letterSpacing: '0.3px' }}>{g.label}</div>
                    </div>
                  ))}
                </div>
              )
            }

            if (panel.type === 'image-grid') {
              const weddingImgMap = { 'Wedding Ring': '/wedding_ring.jpg', 'Wedding Necklaces': '/wedding_necklaces.jpg', 'Wedding Chain': '/wedding_chain.jpg', 'Wedding Bangles': '/wedding_bangesh.jpg', 'Wedding Earring': '/wedding_earring.jpg' }
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                  {panel.items.map(item => (
                    <div key={item.label} style={{ textAlign: 'center', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.querySelector('.wh-box').style.borderColor = '#8B1A1A'}
                      onMouseLeave={e => e.currentTarget.querySelector('.wh-box').style.borderColor = '#e8e0d0'}
                      onClick={() => { setShowDropdown(false); navigate(`/collection/all?wedding_category=${encodeURIComponent(item.label)}`) }}>
                      <div className="wh-box" style={{ width: '90%', height: '190px', borderRadius: 12, background: '#f5f0e8', border: '0.5px solid #e8e0d0', overflow: 'hidden', marginBottom: 8, transition: 'border-color 0.15s' }}>
                        {weddingImgMap[item.label] ? <img src={weddingImgMap[item.label]} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>{item.emoji}</span>}
                      </div>
                      <div style={{ fontSize: 14, color: '#1f2937', fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600, letterSpacing: '0.3px' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              )
            }

            if (panel.type === 'community-grid') return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
                {panel.items.map(item => (
                  <div key={item} style={{ textAlign: 'center', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.querySelector('.ch-box').style.borderColor = '#8B1A1A'; e.currentTarget.querySelector('.ch-label').style.color = '#8B1A1A' }}
                    onMouseLeave={e => { e.currentTarget.querySelector('.ch-box').style.borderColor = '#e8e0d0'; e.currentTarget.querySelector('.ch-label').style.color = '#1f2937' }}>
                    <div className="ch-box" style={{ width: '100%', aspectRatio: '0.75', borderRadius: 10, background: 'linear-gradient(135deg,#fdf2f2,#f5f0e8)', border: '0.5px solid #e8e0d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 6, transition: 'border-color 0.15s' }}>👰</div>
                    <div className="ch-label" style={{ fontSize: 13, color: '#1f2937', transition: 'color 0.15s', lineHeight: 1.3, fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600 }}>{item}</div>
                  </div>
                ))}
              </div>
            )

            if (panel.type === 'giftcard-grid') return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, maxWidth: 360 }}>
                {panel.items.map(item => (
                  <div key={item.label} style={{ cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.querySelector('.gc-box').style.borderColor = '#8B1A1A'}
                    onMouseLeave={e => e.currentTarget.querySelector('.gc-box').style.borderColor = '#c9a0a0'}>
                    <div className="gc-box" style={{ width: '100%', aspectRatio: '1.6', borderRadius: 12, background: 'linear-gradient(135deg,#6b0f0f,#8B1A1A)', border: '2px solid #c9a0a0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8, transition: 'border-color 0.15s' }}>
                      <span style={{ fontSize: 28 }}>{item.emoji}</span>
                      <span style={{ fontSize: 11, color: '#fff', fontStyle: 'italic', letterSpacing: '0.5px', fontWeight: 300 }}>BitByte</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#1f2937', textAlign: 'center' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            )

            if (panel.type === 'coin-nav-grid') return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {panel.items.map(item => (
                  <div key={item.label}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fdf2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => {
                      setShowDropdown(false)
                      if (panel.metal === 'silver') navigate(item.grams ? `/silver-coins?weight=${encodeURIComponent(item.label)}` : '/silver-coins')
                      else { const grade = panel.metal === 'gold24k' ? '24k' : '22k'; navigate(item.grams ? `/gold-coins?weight=${encodeURIComponent(item.label)}&grade=${grade}` : `/gold-coins?grade=${grade}`) }
                    }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: panel.metal === 'silver' ? 'rgba(192,192,192,0.1)' : 'rgba(184,134,11,0.08)', border: panel.metal === 'silver' ? '1px solid rgba(192,192,192,0.4)' : '1px solid rgba(184,134,11,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: panel.metal === 'silver' ? '#9ca3af' : '#b8860b' }}>
                      {panel.metal === 'silver'
                        ? <svg width="18" height="18" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="7"/><path d="M16 9v2"/><path d="M16 21v2"/><path d="M9 16h2"/><path d="M21 16h2"/></svg>
                        : <svg width="18" height="18" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="7"/><path d="M16 9v2"/><path d="M16 21v2"/><path d="M9 16h2"/><path d="M21 16h2"/><polygon points="16,11 17.5,14.5 21,15 18.5,17.5 19,21 16,19.5 13,21 13.5,17.5 11,15 14.5,14.5" strokeWidth="1.2"/></svg>
                      }
                    </div>
                    <span style={{ fontSize: 14, color: '#1f2937', fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600, letterSpacing: '0.3px' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            )

            if (panel.type === 'offers-grid') return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
                {panel.items.map(o => (
                  <div key={o.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, background: '#fdf2f2', border: '0.5px solid #f3d5d5', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f7e0e0'; e.currentTarget.style.borderColor = '#8B1A1A' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fdf2f2'; e.currentTarget.style.borderColor = '#f3d5d5' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', border: '1px solid #f3d5d5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{o.emoji}</div>
                    <div>
                      <div style={{ fontSize: 13, color: '#1f2937', fontWeight: 500 }}>{o.label}</div>
                      <div style={{ fontSize: 10, color: '#8B1A1A', fontWeight: 700, letterSpacing: '0.5px', marginTop: 3, background: '#fce8e8', display: 'inline-block', padding: '2px 8px', borderRadius: 20 }}>{o.badge}</div>
                    </div>
                  </div>
                ))}
              </div>
            )

            return null
          }

          return (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200, background: '#fff', borderBottom: '0.5px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'flex', minHeight: '260px' }}>
              <div style={{ width: 190, borderRight: '0.5px solid #f3f4f6', padding: '20px 0', flexShrink: 0 }}>
                {cfg.filters.map((f, i) => (
                  <div key={cfg.filterKeys[i]} onMouseEnter={() => setActiveFilter(cfg.filterKeys[i])}
                    style={{ padding: '11px 22px', cursor: 'pointer', margin: '2px 10px', borderRadius: 8, color: activeFilter === cfg.filterKeys[i] ? '#8B1A1A' : '#4b5563', background: activeFilter === cfg.filterKeys[i] ? '#fdf2f2' : 'transparent', fontWeight: activeFilter === cfg.filterKeys[i] ? 700 : 400, fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 15, letterSpacing: '0.3px', transition: 'all 0.15s' }}
                  >{f}</div>
                ))}
              </div>
              <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', maxHeight: '420px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#8B1A1A', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '0.5px solid #fce8e8', fontFamily: '"Montserrat", sans-serif' }}>
                  {sectionTitles[activeFilter] || activeFilter}
                </div>
                {renderPanel()}
              </div>
            </div>
          )
        })()}
      </div>
    </>
  )
}