import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { addToCart } from '../collection/card_section'
import CustomerNavbar from '../collection/CustomerNavbar'

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i, size: Math.random() * 50 + 8, x: Math.random() * 100,
  delay: Math.random() * 8, duration: Math.random() * 12 + 15, opacity: Math.random() * 0.18 + 0.04,
}))

const TAG_COLORS = {
  Bestseller: { bg: 'rgba(52,211,153,0.2)', border: 'rgba(52,211,153,0.5)', color: '#34d399' },
  Bridal: { bg: 'rgba(244,114,182,0.2)', border: 'rgba(244,114,182,0.5)', color: '#f472b6' },
  Premium: { bg: 'rgba(251,191,36,0.2)', border: 'rgba(251,191,36,0.5)', color: '#fbbf24' },
  Statement: { bg: 'rgba(167,139,250,0.2)', border: 'rgba(167,139,250,0.5)', color: '#a78bfa' },
  Stackable: { bg: 'rgba(34,211,238,0.2)', border: 'rgba(34,211,238,0.5)', color: '#22d3ee' },
  New: { bg: 'rgba(244,114,182,0.2)', border: 'rgba(244,114,182,0.5)', color: '#f472b6' },
  Limited: { bg: 'rgba(167,139,250,0.2)', border: 'rgba(167,139,250,0.5)', color: '#a78bfa' },
}

export default function GoldBracelets() {
  const navigate = useNavigate()
  
  const [hoveredBracelet, setHoveredBracelet] = useState(null)
  const [metalType, setMetalType] = useState('22k')
  const [metalPrices, setMetalPrices] = useState({ gold22k: null, gold24k: null })
  const [goldBracelets, setGoldBracelets] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlistedIds, setWishlistedIds] = useState(new Set())
  

const bg = '#fdf6f0'
const text = '#020617'
const subtext = '#64748b'
const border = 'rgba(0,0,0,0.1)'
const glass = 'rgba(255,255,255,0.7)'
const cardBg = 'rgba(0,0,0,0.03)'
const inpBg = 'rgba(0,0,0,0.05)'
const inpBorder = '#d1d5db'

  const goldColor = metalType === '22k' ? '#fbbf24' : '#ffd700'

  const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

  const getImageUrl = (img) => {
    if (!img) return '/img/gold/gold_bracelet.jpg'
    if (img.startsWith('http://') || img.startsWith('https://')) return img
    return `${API_BASE}/${img.replace(/^\/+/, '')}`
  }

  useEffect(() => {
    import('../api').then(({ default: api }) => {
      api.get('/jewelry-products/?category=bracelets&metal=gold')
        .then(res => { setGoldBracelets(res.data); setLoading(false) })
        .catch(() => setLoading(false))
    })
  }, [])

  useEffect(() => {
    import('../api').then(({ default: api }) => {
      api.get('/metal-rates/').then(res => {
        setMetalPrices({ gold22k: parseFloat(res.data.gold_22k), gold24k: parseFloat(res.data.gold_24k) })
      }).catch(() => {})
    })
  }, [])

  useEffect(() => {
    import('../api').then(({ default: api }) => {
      api.get('/wishlist/').then(res => {
        setWishlistedIds(new Set(res.data.items.map(i => i.product_id)))
      }).catch(() => {})
    })
  }, [])

  const toggleWishlist = async (e, productId) => {
    e.stopPropagation()
    const api = (await import('../api')).default
    try {
      const res = await api.post('/wishlist/', { product_id: productId })
      setWishlistedIds(prev => {
        const next = new Set(prev)
        if (res.data.action === 'added') next.add(productId)
        else next.delete(productId)
        return next
      })
      window.dispatchEvent(new Event('bb_wishlist_update'))
    } catch {}
  }

  



  const currentRate = metalType === '22k' ? metalPrices.gold22k : metalPrices.gold24k
  const tagStyle = (tag) => TAG_COLORS[tag] || { bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.2)', color: '#fff' }

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: '"Inter",system-ui,sans-serif', position: 'relative', overflow: 'hidden', transition: 'background 0.8s ease, color 0.4s ease' }}>
      <style>{`
        @keyframes float-orb { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes antigravity { 0%{transform:translateY(110vh) rotate(0deg);opacity:0} 10%{opacity:var(--op)} 90%{opacity:var(--op)} 100%{transform:translateY(-20vh) rotate(360deg);opacity:0} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes goldShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(251,191,36,0.1)} 50%{box-shadow:0 0 40px rgba(251,191,36,0.35)} }
        @keyframes shine { 0%{left:-80%} 100%{left:120%} }
        @keyframes fadeImg { from{opacity:0;transform:scale(1.03)} to{opacity:1;transform:scale(1)} }
        @keyframes sparkle { 0%,100%{opacity:0;transform:scale(0) rotate(0deg)} 50%{opacity:1;transform:scale(1) rotate(180deg)} }
        .bracelet-card { animation: fadeInUp 0.5s ease both; }
        .bracelet-card:nth-child(1){animation-delay:0.05s}
        .bracelet-card:nth-child(2){animation-delay:0.12s}
        .bracelet-card:nth-child(3){animation-delay:0.19s}
        .bracelet-card:nth-child(4){animation-delay:0.26s}
        .bracelet-card:nth-child(5){animation-delay:0.33s}
        .bracelet-img-wrap { overflow:hidden; }
        .bracelet-img-wrap img { transition: transform 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        .bracelet-card:hover .bracelet-img-wrap img { transform: scale(1.12) translateY(-4px) !important; }

        .sparkle-dot { animation: sparkle 2s ease infinite; }
      `}</style>



      {/* Navbar */}
<CustomerNavbar />

      <div style={{ position: 'relative', zIndex: 10, padding: '40px 40px', maxWidth: '100%', margin: '0 auto' }}>

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', animation: 'fadeInUp 0.4s ease both' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '20px', padding: '5px 14px', marginBottom: '14px' }}>
              <span className="sparkle-dot" style={{ color: goldColor, fontSize: '11px' }}>✦</span>
              <span style={{ color: goldColor, fontSize: '10px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Premium Gold Collection</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              🏅 <span style={{ background: `linear-gradient(90deg,#f59e0b,#fbbf24,#ffd700)`, backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'goldShimmer 3s linear infinite' }}>Gold Bracelets</span>
            </h1>
            <p style={{ color: subtext, fontSize: '13px', margin: '8px 0 0', fontWeight: 500 }}>{goldBracelets.length} exclusive designs · Handcrafted excellence</p>
          </div>

          {/* Metal Type Toggle + Rate */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', background: inpBg, border: `1px solid ${inpBorder}`, borderRadius: '12px', overflow: 'hidden' }}>
              {[{ val: '22k', label: '🏅 22K' }, { val: '24k', label: '🥇 24K' }].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setMetalType(val)}
                  style={{
                    padding: '9px 20px', border: 'none',
                    background: metalType === val ? (val === '22k' ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#d97706,#ffd700)') : 'transparent',
                    color: metalType === val ? '#000' : subtext,
                    fontWeight: 800, fontSize: '12px', cursor: 'pointer', transition: 'all 0.25s ease',
                  }}
                >{label}</button>
              ))}
            </div>
            {currentRate && (
              <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '10px', padding: '8px 16px', textAlign: 'right' }}>
                <div style={{ color: subtext, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Rate ({metalType.toUpperCase()})</div>
                <div style={{ color: goldColor, fontWeight: 900, fontSize: '16px', fontFamily: 'monospace' }}>₹{currentRate.toFixed(2)}/gm</div>
              </div>
            )}
          </div>
        </div>

        {/* Bracelet Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
          {loading ? (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', color: subtext, padding: '60px 0', fontSize: '15px' }}>
              ⏳ Loading products...
            </div>
          ) : goldBracelets.length === 0 ? (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', color: subtext, padding: '60px 0', fontSize: '15px' }}>
              No gold bracelets added yet.
            </div>
          ) : (
            goldBracelets.map((product) => {
  const images = product.images?.map(img => {
    const src = typeof img === 'object' ? (img.image || '') : img
    if (!src) return null
    if (src.startsWith('http')) return src
    return `${API_BASE}/${src.replace(/^\/+/, '')}`
  }).filter(Boolean) || []
  const isHovered = hoveredBracelet === product.id
  const displayIndex = isHovered && images.length > 1 ? 1 : 0
  const price = parseFloat(product.price) || 0
  const discountPct = parseFloat(product.wastage_charge) || 0
  const originalAmt = parseFloat(product.original_price) || 0
  const hasDiscount = discountPct > 0 && originalAmt > price && price > 0

  return (
    <div key={product.id} className="bracelet-card"
      onClick={() => navigate(`/product-display?category=bracelets&metal=gold&id=${product.id}`)}
      onMouseEnter={() => setHoveredBracelet(product.id)}
      onMouseLeave={() => setHoveredBracelet(null)}
      style={{
        borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative',
        border: '1px solid #e8e8e8', background: '#fff',
        boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.25s ease',
      }}>
      <div style={{ height: 280, background: '#f0f0f0', position: 'relative', overflow: 'hidden', marginBottom: 10 }}>
        {product.tag && (
          <div style={{ position: 'absolute', top: 12, left: 0, background: '#2ecc71', color: '#fff', padding: '5px 12px 5px 10px', fontSize: 11, fontWeight: 700, clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)', zIndex: 2 }}>
            {product.tag}
          </div>
        )}
        <button onClick={e => toggleWishlist(e, product.id)}
          style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: '50%', border: wishlistedIds.has(product.id) ? '1.5px solid #e11d48' : '1px solid #ddd', background: wishlistedIds.has(product.id) ? 'rgba(225,29,72,0.15)' : 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, zIndex: 2 }}>
          {wishlistedIds.has(product.id) ? '❤️' : '🤍'}
        </button>
        {images.length > 0
  ? <img key={displayIndex} src={images[displayIndex]} alt={product.name}
    style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'fadeImg 0.5s ease' }}
    onError={e => e.currentTarget.style.display = 'none'} />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 44 }}>💍</div>
        }
        <div style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 16, color: '#999', zIndex: 2 }}>🔗</div>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#1a1a1a' }}>
            {price > 0 ? `₹${price.toLocaleString('en-IN')}` : '—'}
          </span>
          {hasDiscount && (
            <span style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>
              ₹{originalAmt.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        {hasDiscount && (
          <div style={{ fontSize: 12, color: '#2ecc71', fontWeight: 700, marginBottom: 6 }}>
            {discountPct}% Off
          </div>
        )}
        <div style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 600 }}>{product.name}</div>
      </div>
    </div>
  )
})
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '48px', textAlign: 'center', animation: 'fadeInUp 0.6s ease 0.4s both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', color: subtext, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
            <div style={{ width: '40px', height: '1px', background: `linear-gradient(90deg,transparent,${goldColor})` }} />
            BitByte Jewellers • Gold Bracelet Collection
            <div style={{ width: '40px', height: '1px', background: `linear-gradient(90deg,${goldColor},transparent)` }} />
          </div>
        </div>
      </div>
    </div>
  )
}