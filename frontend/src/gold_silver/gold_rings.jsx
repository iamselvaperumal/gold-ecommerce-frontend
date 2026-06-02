import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { addToCart } from '../collection/card_section'
import CustomerNavbar from '../collection/CustomerNavbar'

const WEIGHTS = [
  { label: 'All Weights', grams: null },
  { label: '50 mg', grams: 0.05 },
  { label: '100 mg', grams: 0.10 },
  { label: '150 mg', grams: 0.15 },
  { label: '200 mg', grams: 0.20 },
  { label: '500 mg', grams: 0.50 },
  { label: '1 gm', grams: 1 },
  { label: '2 gm', grams: 2 },
  { label: '4 gm', grams: 4 },
  { label: '8 gm', grams: 8 },
]

// const GOLD_RINGS = [
//   { id: 1, name: 'Blossom Ring', desc: 'Floral petal design with a vintage soul', img: '/img/gold/gold-ring-1.png', tag: 'Bestseller' },
//   { id: 2, name: 'Solitaire Twist', desc: 'Classic twisted shank with a brilliant center stone', img: '/img/gold/gold-ring-2.png', tag: 'Bridal' },
//   { id: 3, name: 'Eternity Band', desc: 'Seamless band with continuous diamond-cut detailing', img: '/img/gold/gold-ring-3.png', tag: 'Premium' },
//   { id: 4, name: 'Crown Solitaire', desc: 'Six-prong crown setting for the statement piece', img: '/img/gold/gold-ring-4.png', tag: 'Statement' },
//   { id: 5, name: 'Duo Stack Ring', desc: 'Double-band stackable ring for everyday elegance', img: '/img/gold/gold-ring-5.png', tag: 'Stackable' },
// ]




const TAG_COLORS = {
  Bestseller: { bg: 'rgba(52,211,153,0.2)', border: 'rgba(52,211,153,0.5)', color: '#34d399' },
  Bridal: { bg: 'rgba(244,114,182,0.2)', border: 'rgba(244,114,182,0.5)', color: '#f472b6' },
  Premium: { bg: 'rgba(251,191,36,0.2)', border: 'rgba(251,191,36,0.5)', color: '#fbbf24' },
  Statement: { bg: 'rgba(167,139,250,0.2)', border: 'rgba(167,139,250,0.5)', color: '#a78bfa' },
  Stackable: { bg: 'rgba(34,211,238,0.2)', border: 'rgba(34,211,238,0.5)', color: '#22d3ee' },
}


export default function GoldRings() {
  const navigate = useNavigate()
  const [selectedWeight, setSelectedWeight] = useState('All Weights')
  const [hoveredRing, setHoveredRing] = useState(null)
  const [metalType, setMetalType] = useState('22k')   // '22k' | '24k'
  const [metalPrices, setMetalPrices] = useState({ gold22k: null, gold24k: null })
  const [goldRings, setGoldRings] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlistedIds, setWishlistedIds] = useState(new Set())
  const [selectedRing, setSelectedRing] = useState(null)


const bg = '#FDF5EE'
const text = '#020617'
const subtext = '#64748b'
const border = 'rgba(0,0,0,0.1)'
const cardBg = 'rgba(0,0,0,0.03)'
const inpBg = 'rgba(0,0,0,0.05)'
const inpBorder = '#d1d5db'
const goldColor = '#fbbf24'



  const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

  const getImageUrl = (img) => {
    if (!img) return '/img/gold/gold-ring-1.png'

    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img
    }

    return `${API_BASE}/${img.replace(/^\/+/, '')}`
  }

  // Try to get prices from API (optional — works even without)
  // Add this useEffect in GoldRings.jsx (after the metalPrices useEffect)
  useEffect(() => {
    import('../api').then(({ default: api }) => {
      api.get('/jewelry-products/?category=rings&metal=gold')
        .then(res => {
          console.log('PRODUCT DATA:', res.data)
          console.log('FIRST IMAGE:', res.data?.[0]?.images?.[0]?.image)
          setGoldRings(res.data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
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
  const selectedW = WEIGHTS.find(w => w.label === selectedWeight)
  const unitPrice = selectedW?.grams && currentRate ? selectedW.grams * currentRate : null

  const tagStyle = (tag) => TAG_COLORS[tag] || { bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.2)', color: '#fff' }

return (
  <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: '"Inter",system-ui,sans-serif', position: 'relative', overflow: 'hidden' }}>
    <style>{`
      @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      @keyframes goldShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(251,191,36,0.1)} 50%{box-shadow:0 0 40px rgba(251,191,36,0.35)} }
      @keyframes shine { 0%{left:-80%} 100%{left:120%} }
      .ring-card { animation: fadeInUp 0.5s ease both; }
      .ring-card:nth-child(1){animation-delay:0.05s} .ring-card:nth-child(2){animation-delay:0.12s}
      .ring-card:nth-child(3){animation-delay:0.19s} .ring-card:nth-child(4){animation-delay:0.26s}
      .ring-img-wrap { overflow:hidden; }
      .ring-img-wrap img { transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1); }
      .ring-card:hover .ring-img-wrap img { transform:scale(1.12) translateY(-4px) !important; }
      .shine-overlay { position:absolute; top:0; left:-80%; width:40%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); transform:skewX(-20deg); opacity:0; transition:opacity 0.3s; }
      .ring-card:hover .shine-overlay { opacity:1; animation:shine 0.6s ease; }
    `}</style>
    <CustomerNavbar />

      <div style={{ position: 'relative', zIndex: 10, padding: '40px 40px', maxWidth: '1300px', margin: '0 auto' }}>

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', animation: 'fadeInUp 0.4s ease both' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '20px', padding: '5px 14px', marginBottom: '14px' }}>
              <span className="sparkle-dot" style={{ color: goldColor, fontSize: '11px' }}>✦</span>
              <span style={{ color: goldColor, fontSize: '10px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Premium Gold Collection</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              🏅 <span style={{ background: `linear-gradient(90deg,#f59e0b,#fbbf24,#ffd700)`, backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'goldShimmer 3s linear infinite' }}>Gold Rings</span>
            </h1>
            <p style={{ color: subtext, fontSize: '13px', margin: '8px 0 0', fontWeight: 500 }}>{goldRings.length} exclusive designs · Handcrafted excellence</p>
          </div>

          {/* Rate + Controls Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>

            {/* Metal Type Toggle */}
            <div style={{ display: 'flex', background: inpBg, border: `1px solid ${inpBorder}`, borderRadius: '12px', overflow: 'hidden' }}>
              {[{ val: '22k', label: '🏅 22K' }, { val: '24k', label: '🥇 24K' }].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setMetalType(val)}
                  style={{
                    padding: '9px 20px',
                    border: 'none',
                    background: metalType === val ? (val === '22k' ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#d97706,#ffd700)') : 'transparent',
                    color: metalType === val ? '#000' : subtext,
                    fontWeight: 800, fontSize: '12px', cursor: 'pointer', transition: 'all 0.25s ease',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Rate Display */}
            {currentRate && (
              <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '10px', padding: '8px 16px', textAlign: 'right' }}>
                <div style={{ color: subtext, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Rate ({metalType.toUpperCase()})</div>
                <div style={{ color: goldColor, fontWeight: 900, fontSize: '16px', fontFamily: 'monospace' }}>₹{currentRate.toFixed(2)}/gm</div>
              </div>
            )}
          </div>
        </div>


        {/* Ring Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          {loading ? (
            <div style={{
              gridColumn: 'span 3', textAlign: 'center',
              color: subtext, padding: '60px 0', fontSize: '15px'
            }}>
              ⏳ Loading products...
            </div>
          ) : goldRings.length === 0 ? (
            <div style={{
              gridColumn: 'span 3', textAlign: 'center',
              color: subtext, padding: '60px 0', fontSize: '15px'
            }}>
              No gold rings added yet.
            </div>
          ) : (
  goldRings.map((ring) => {
    const isHovered = hoveredRing === ring.id
    const tag = tagStyle(ring.tag)

    return (
      <div
        key={ring.id}
        className="ring-card"
        onClick={() =>
          navigate(`/product-display?category=rings&metal=gold&id=${ring.id}`)
        }
        onMouseEnter={() => setHoveredRing(ring.id)}
        onMouseLeave={() => setHoveredRing(null)}
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          border: `1px solid ${isHovered ? 'rgba(251,191,36,0.5)' : 'rgba(251,191,36,0.15)'}`,
          background: isHovered ? 'rgba(251,191,36,0.07)' : cardBg,
          cursor: 'pointer',
          position: 'relative',
          transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: isHovered ? `0 20px 50px rgba(251,191,36,0.25), 0 0 0 1px rgba(251,191,36,0.1)` : 'none',
          transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          animation: isHovered ? 'none' : undefined,
        }}
      >

                {/* Shine overlay */}
                <div className="shine-overlay" />

                {/* Image */}
                <div className="ring-img-wrap" style={{ position: 'relative', height: '200px', background: 'rgba(0,0,0,0.04)' }}>
                  <img
                    src={getImageUrl(ring.images?.[0]?.image)}
                    alt={ring.name}
                    onError={(e) => {
                      console.log('Image failed:', e.currentTarget.src)
                      e.currentTarget.src = '/img/gold/gold-ring-1.png'
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.8) 0%, transparent 60%)' }} />

                  {/* Tag */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: tag.bg, border: `1px solid ${tag.border}`, borderRadius: '16px', padding: '3px 10px', color: tag.color, fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(8px)' }}>
                    {ring.tag}
                  </div>

                 {/* heart + Ring number */}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10 }}>
                    <button onClick={e => toggleWishlist(e, ring.id)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: wishlistedIds.has(ring.id) ? '1.5px solid #e11d48' : '1.5px solid rgba(255,255,255,0.35)', background: wishlistedIds.has(ring.id) ? 'rgba(225,29,72,0.18)' : 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s ease' }}>
                      {wishlistedIds.has(ring.id) ? '❤️' : '🤍'}
                    </button>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: goldColor, fontSize: '10px', fontWeight: 900 }}>
                      {ring.id}
                    </div>
                  </div>

                  {/* Hover glow ring */}
                  {isHovered && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: `2px solid rgba(251,191,36,0.6)`, animation: 'glow-pulse 1.5s ease infinite' }} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ color: isHovered ? goldColor : text, fontWeight: 800, fontSize: '13px', marginBottom: '4px', transition: 'color 0.3s' }}>{ring.name}</div>
                  <div style={{ color: subtext, fontSize: '10px', lineHeight: '1.5', marginBottom: '10px' }}>{ring.description}</div>


                </div>

                {/* Bottom hover CTA */}
                {isHovered && (
                  <div style={{ padding: '0 16px 14px', animation: 'fadeInUp 0.2s ease' }}>
                    <div style={{ width: '100%', padding: '8px', background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', borderRadius: '10px', color: '#000', fontWeight: 800, fontSize: '11px', textAlign: 'center', cursor: 'pointer' }}>
                      👁 View Details
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
        </div>

        {/* Bottom info */}
        <div style={{ marginTop: '48px', textAlign: 'center', animation: 'fadeInUp 0.6s ease 0.4s both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', color: subtext, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
            <div style={{ width: '40px', height: '1px', background: `linear-gradient(90deg,transparent,${goldColor})` }} />
            BitByte Jewellers • Gold Ring Collection
            <div style={{ width: '40px', height: '1px', background: `linear-gradient(90deg,${goldColor},transparent)` }} />
          </div>
        </div>
      </div>


    </div>
  )
}