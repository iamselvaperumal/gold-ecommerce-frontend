import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/logo.png'
import goldCoin from '../assets/gold-coin-transparent.png'
import silverCoin from '../assets/silver-coin-transparent.png'
import CustomerNavbar from './CustomerNavbar'
import CustomerFooter from '../collection/CustomerFooter'

const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

const getImageUrl = img => {
  if (!img) return null
  let p = typeof img === 'object' ? (img.image || img.url || '') : img
  if (!p) return null
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  return `${API_BASE}/${p.replace(/^\/+/, '')}`
}

export default function CoinsCollection() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const metalFilter = searchParams.get('metal') || 'silver'
  const gradeFilter = searchParams.get('grade')
  const weightFilter = searchParams.get('weight')

const [products, setProducts] = useState([])
const [loading, setLoading] = useState(true)
const [metalPrices, setMetalPrices] = useState({ gold22k: null, gold24k: null, silver: null })
const [hoveredId, setHoveredId] = useState(null)


  const isGold = metalFilter === 'gold'
  const coinImg = isGold ? goldCoin : silverCoin
  const accentColor = isGold ? '#fbbf24' : '#c0c0c0'
  const accentGrad = isGold ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#9ca3af,#e5e7eb)'

  useEffect(() => {
    fetch(`${API_BASE}/api/metal-rates/`)
      .then(r => r.json())
      .then(d => setMetalPrices({ gold22k: parseFloat(d.gold_22k), gold24k: parseFloat(d.gold_24k), silver: parseFloat(d.silver_999) }))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    let url = `${API_BASE}/api/jewelry-products/?category=coins&metal=${metalFilter}`
    if (gradeFilter) url += `&grade=${gradeFilter}`
    fetch(url)
      .then(r => r.json())
      .then(data => {
        let list = Array.isArray(data) ? data : []
        // Weight filter — match by product name containing weight
        if (weightFilter) {
          list = list.filter(p => p.name?.toLowerCase().includes(weightFilter.toLowerCase()) || p.tag?.toLowerCase().includes(weightFilter.toLowerCase()))
        }
        setProducts(list)
        setLoading(false)
      })
      .catch(() => { setProducts([]); setLoading(false) })
  }, [metalFilter, gradeFilter, weightFilter])

  const getRate = (grade) => {
    if (!isGold) return metalPrices.silver
    if (grade === '24k') return metalPrices.gold24k
    return metalPrices.gold22k
  }

  return (
   <div style={{ minHeight: '100vh', background: '#FDF5EE', fontFamily: '"Montserrat", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@400;500;600;700&display=swap');

        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes goldShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .coin-card:hover { transform: translateY(-8px) scale(1.02) !important; }
      `}</style>

      {/* NAVBAR */}
  <CustomerNavbar />

      {/* HEADER BANNER */}
      <div style={{
        background: isGold
          ? 'linear-gradient(135deg, #1a0a00 0%, #3d1f00 50%, #1a0a00 100%)'
          : 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0a0a1a 100%)',
        padding: '40px 40px 36px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background coin images */}
        {[...Array(6)].map((_, i) => (
          <img key={i} src={coinImg} alt="" style={{
            position: 'absolute',
            width: 80, height: 80, objectFit: 'contain', opacity: 0.06,
            left: `${10 + i * 16}%`, top: `${10 + (i % 2) * 40}%`,
            animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 2 }}>
          <img src={coinImg} alt="coin" style={{
            width: 100, height: 100, objectFit: 'contain',
            filter: `drop-shadow(0 8px 24px ${accentColor}88)`,
            animation: 'float 3s ease-in-out infinite',
            marginBottom: 16,
          }} />
          <div style={{
  fontSize: 36, fontWeight: 900, letterSpacing: -1,
  background: isGold
    ? 'linear-gradient(90deg,#f59e0b,#fbbf24,#ffd700,#fbbf24)'
    : 'linear-gradient(90deg,#9ca3af,#c0c0c0,#e2e8f0,#c0c0c0)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  animation: 'goldShimmer 3s linear infinite',
  marginBottom: 8,
  fontFamily: '"Playfair Display", Georgia, serif',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
}}>
  <svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="16" r="11"/>
    <circle cx="16" cy="16" r="7"/>
    <path d="M16 9v2"/><path d="M16 21v2"/>
    <path d="M9 16h2"/><path d="M21 16h2"/>
  </svg>
  {isGold ? 'Gold Coins' : 'Silver Coins'}
</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            {loading ? 'Loading...' : `${products.length} products`}
            {weightFilter && <span style={{ color: accentColor, fontWeight: 700, marginLeft: 8 }}>• {weightFilter}</span>}
          </div>

          {/* Live rates */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            {!isGold && metalPrices.silver && (
              <div style={{ background: 'rgba(192,192,192,0.15)', border: '1px solid rgba(192,192,192,0.4)', borderRadius: 20, padding: '6px 18px', color: '#c0c0c0', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
                🥈 Silver 999: ₹{metalPrices.silver.toFixed(2)}/gm
              </div>
            )}
            {isGold && metalPrices.gold22k && (
              <div style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', borderRadius: 20, padding: '6px 18px', color: '#fbbf24', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
                🏅 22K: ₹{metalPrices.gold22k.toFixed(2)}/gm
              </div>
            )}
            {isGold && metalPrices.gold24k && (
              <div style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.4)', borderRadius: 20, padding: '6px 18px', color: '#ffd700', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
                🥇 24K: ₹{metalPrices.gold24k.toFixed(2)}/gm
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8ddd5', padding: '14px 40px', display: 'flex', gap: 10, alignItems: 'center', overflowX: 'auto' }}>
        <span style={{ color: '#7c5c4a', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>Metal:</span>
        {[
          { label: '🥈 Silver', metal: 'silver', grade: null },
          { label: '🏅 Gold 22K', metal: 'gold', grade: '22k' },
          { label: '🥇 Gold 24K', metal: 'gold', grade: '24k' },
        ].map(opt => {
          const isActive = metalFilter === opt.metal && (!opt.grade || gradeFilter === opt.grade)
          return (
            <button key={opt.label}
              onClick={() => {
                let url = `/collection/coins?metal=${opt.metal}`
                if (opt.grade) url += `&grade=${opt.grade}`
                if (weightFilter) url += `&weight=${weightFilter}`
                navigate(url)
              }}
              style={{
                padding: '8px 18px', borderRadius: 20, fontWeight: 700, fontSize: 13, cursor: 'pointer', border: 'none',
                background: isActive ? '#8B1A1A' : '#f5f0e8',
                color: isActive ? '#fff' : '#7c5c4a',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >{opt.label}</button>
          )
        })}

        {weightFilter && (
          <>
            <span style={{ color: '#e8ddd5' }}>|</span>
            <span style={{ background: '#fce8e8', color: '#8B1A1A', border: '1px solid #f3a0a0', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
              ⚖️ {weightFilter}
            </span>
            <button
              onClick={() => {
                let url = `/collection/coins?metal=${metalFilter}`
                if (gradeFilter) url += `&grade=${gradeFilter}`
                navigate(url)
              }}
              style={{ background: 'transparent', border: '1px solid #8B1A1A', color: '#8B1A1A', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >✕ Clear weight</button>
          </>
        )}
      </div>

      {/* PRODUCTS */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 40px 60px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 44, height: 44, border: `3px solid ${accentColor}33`, borderTop: `3px solid ${accentColor}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <div style={{ color: '#7c5c4a' }}>Loading coins...</div>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <img src={coinImg} alt="" style={{ width: 80, height: 80, objectFit: 'contain', opacity: 0.3, marginBottom: 16 }} />
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a0a0a', marginBottom: 8 }}>No coins found</div>
            <div style={{ fontSize: 14, color: '#7c5c4a', marginBottom: 24 }}>
              {weightFilter ? `${weightFilter} weight coins not added yet` : 'No coins available yet'}
            </div>
            <button onClick={() => navigate('/customer')}
              style={{ padding: '12px 28px', background: '#8B1A1A', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
              ← Go Back
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, animation: 'fadeIn 0.4s ease' }}>
            {products.map(p => {
              const firstImg = p.images?.[0] ? getImageUrl(p.images[0]) : null
              const price = parseFloat(p.price) || 0
              const rate = getRate(p.grade)
              const netW = parseFloat(p.net_weight) || 0
              const livePrice = rate && netW ? (netW * rate * 1.03).toFixed(2) : null
              const isHovered = hoveredId === p.id

              return (
                <div key={p.id}
  className="coin-card"
  onClick={() => navigate(`/product-display?category=coins&metal=${metalFilter}&id=${p.id}`)}
  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; e.currentTarget.querySelector('img')?.style && (e.currentTarget.querySelector('img').style.transform = 'scale(1.08)') }}
  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; e.currentTarget.querySelector('img')?.style && (e.currentTarget.querySelector('img').style.transform = 'scale(1)') }}
  style={{
    background: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: 10,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  }}
>
  {/* Image */}
  <div style={{ height: 280, background: '#f0f0f0', position: 'relative', overflow: 'hidden' }}>
    {firstImg
      ? <img src={firstImg} alt={p.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onError={e => e.currentTarget.style.display = 'none'} />
      : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 44 }}>🪙</div>
    }

    {p.tag && (
      <div style={{ position: 'absolute', top: 12, left: 0, background: '#2ecc71', color: '#fff', padding: '5px 12px 5px 10px', fontSize: 11, fontWeight: 700, clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)', zIndex: 2 }}>
        {p.tag}
      </div>
    )}

    <div style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 16, color: '#999', zIndex: 2 }}>🔗</div>
  </div>

  {/* Info */}
<div style={{ padding: '12px 14px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
    <span style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a' }}>
      {price > 0 ? `₹${price.toLocaleString('en-IN')}` : livePrice ? `₹${Number(livePrice).toLocaleString('en-IN')}` : '—'}
    </span>
  </div>
  <div style={{ fontSize: 18, color: '#1a1a1a', fontWeight: 600,
    fontFamily: '"Cormorant Garamond", Georgia, serif' }}>{p.name}
  </div>
  {p.net_weight && (
    <div style={{ fontSize: 11, color: '#999', marginTop: 3 }}>⚖️ {p.net_weight}g · incl. 3% GST</div>
  )}
</div>
</div>
              )
            })}
          </div>
        )}
      </div>

              {/* ── FOOTER ── */}
        <CustomerFooter />
    </div>
  )
}