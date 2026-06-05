import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/logo.png'
import goldCoin from '../assets/gold-coin-transparent.png'
import { addToCart } from '../collection/card_section'
import CustomerNavbar from '../collection/CustomerNavbar'

const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

const getImageUrl = img => {
  if (!img) return null
  let p = typeof img === 'object' ? (img.image || img.url || '') : img
  if (!p) return null
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  return `${API_BASE}/${p.replace(/^\/+/, '')}`
}

// Weight label → grams mapping
const WEIGHT_GRAMS = {
  '100 mg': 0.10, '200 mg': 0.20, '500 mg': 0.50,
  '1 gm': 1, '2 gm': 2, '4 gm': 4,
  '8 gm': 8, '16 gm': 16, '40 gm': 40,
}

export default function GoldCoins() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const weightFilter = searchParams.get('weight')   // e.g. "8 gm"
  const gradeFilter  = searchParams.get('grade')    // '22k' or '24k'

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [metalPrices, setMetalPrices] = useState({ gold22k: null, gold24k: null })
  const [hoveredId, setHoveredId] = useState(null)
  const [wishlistedIds, setWishlistedIds] = useState(new Set())
  const [metalType, setMetalType] = useState(gradeFilter === '24k' ? '24k' : '22k')


const bg = '#FDF5EE'
const text = '#020617'
const subtext = '#64748b'
const border = 'rgba(0,0,0,0.1)'
const cardBg = 'rgba(0,0,0,0.03)'
const goldColor = metalType === '22k' ? '#fbbf24' : '#ffd700'
const inpBg = 'rgba(0,0,0,0.05)'
const inpBorder = '#d1d5db'

  // Fetch metal rates
  useEffect(() => {
    import('../api').then(({ default: api }) => {
      api.get('/metal-rates/').then(res => {
        setMetalPrices({ gold22k: parseFloat(res.data.gold_22k), gold24k: parseFloat(res.data.gold_24k) })
      }).catch(() => {})
    })
  }, [])

  // Fetch products
useEffect(() => {
    setLoading(true)
    const grade = gradeFilter || metalType
    let url = `${API_BASE}/api/jewelry-products/?category=coins&metal=gold&grade=${grade}`
    fetch(url)
      .then(r => r.json())
      .then(data => {
        let list = Array.isArray(data) ? data : []
        // Filter by weight if specified
        if (weightFilter) {
          list = list.filter(p => {
            const name = (p.name || '').toLowerCase()
            const wf   = weightFilter.toLowerCase()
            return name.includes(wf)
          })
        }
        setProducts(list)
        setLoading(false)
      })
      .catch(() => { setProducts([]); setLoading(false) })
  }, [weightFilter, gradeFilter, metalType])

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

  const getProductPrice = (p) => {
    // Use saved price first
    if (p.price && parseFloat(p.price) > 0) return parseFloat(p.price)
    // Calculate from net_weight + rate
    const nw = parseFloat(p.net_weight) || 0
    if (nw && currentRate) return parseFloat((nw * currentRate * 1.03).toFixed(2))
    return null
  }

return (
  <div style={{ minHeight:'100vh', background:bg, color:text, fontFamily:'"Inter",system-ui,sans-serif', position:'relative', overflow:'hidden' }}>
    <style>{`
      @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      @keyframes goldShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes coinFloat { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(5deg)} }
      @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(251,191,36,0.1)} 50%{box-shadow:0 0 50px rgba(251,191,36,0.5)} }
      @keyframes shine { 0%{left:-80%} 100%{left:120%} }
      @keyframes spin { to{transform:rotate(360deg)} }
      .gc-card { animation: fadeInUp 0.5s ease both; }
      .gc-card:nth-child(1){animation-delay:0.05s} .gc-card:nth-child(2){animation-delay:0.1s}
      .gc-card:nth-child(3){animation-delay:0.15s} .gc-card:nth-child(4){animation-delay:0.2s}
      .gc-card:nth-child(5){animation-delay:0.25s} .gc-card:nth-child(6){animation-delay:0.3s}
      @keyframes fadeImg { from{opacity:0;transform:scale(1.03)} to{opacity:1;transform:scale(1)} }

    `}</style>

    <CustomerNavbar />

      <div style={{ position:'relative', zIndex:10, padding:'40px', maxWidth:'100%', margin:'0 auto' }}>

        {/* PAGE HEADER */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'40px', animation:'fadeInUp 0.4s ease both' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.25)', borderRadius:'20px', padding:'5px 14px', marginBottom:'14px' }}>
              <span className="sparkle-dot" style={{ color:goldColor, fontSize:'11px' }}>✦</span>
              <span style={{ color:goldColor, fontSize:'10px', fontWeight:800, letterSpacing:'2px', textTransform:'uppercase' }}>Premium Gold Coins</span>
            </div>
            <h1 style={{ margin:0, fontSize:'36px', fontWeight:900, letterSpacing:'-0.5px' }}>
              🥇{' '}
              <span style={{ background:'linear-gradient(90deg,#f59e0b,#fbbf24,#ffd700,#fbbf24)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'goldShimmer 3s linear infinite' }}>
                Gold Coins {weightFilter ? `— ${weightFilter}` : ''}
              </span>
            </h1>
            <p style={{ color:subtext, fontSize:'13px', margin:'8px 0 0', fontWeight:500 }}>{loading ? 'Loading...' : `${products.length} coins available`} · Certified Gold</p>
          </div>

          {/* Grade Toggle + Rate */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px', alignItems:'flex-end' }}>
            <div style={{ display:'flex', background:inpBg, border:`1px solid ${inpBorder}`, borderRadius:'12px', overflow:'hidden' }}>
              {[{ val:'22k', label:'🏅 22K' }, { val:'24k', label:'🥇 24K' }].map(({ val, label }) => (
                <button key={val} onClick={() => {
  setMetalType(val)
  let url = `/gold-coins?grade=${val}`
  if (weightFilter) url += `&weight=${weightFilter}`
  navigate(url)
}}
                  style={{ padding:'9px 20px', border:'none', background: metalType===val ? (val==='22k' ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#d97706,#ffd700)') : 'transparent', color: metalType===val ? '#000' : subtext, fontWeight:800, fontSize:'12px', cursor:'pointer', transition:'all 0.25s ease' }}
                >{label}</button>
              ))}
            </div>
            {currentRate && (
              <div style={{ background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.25)', borderRadius:'10px', padding:'8px 16px', textAlign:'right' }}>
                <div style={{ color:subtext, fontSize:'10px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Live Rate ({metalType.toUpperCase()})</div>
                <div style={{ color:goldColor, fontWeight:900, fontSize:'16px', fontFamily:'monospace' }}>₹{currentRate.toFixed(2)}/gm</div>
              </div>
            )}
          </div>
        </div>

        {/* Weight filter badge */}
        {weightFilter && (
          <div style={{ marginBottom:'24px', display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ background:'rgba(251,191,36,0.12)', border:'1px solid rgba(251,191,36,0.4)', color:goldColor, borderRadius:20, padding:'6px 16px', fontSize:13, fontWeight:700 }}>
              ⚖️ Filtered: {weightFilter}
            </span>
            <button onClick={() => navigate('/gold-coins')}
              style={{ background:'transparent', border:`1px solid ${border}`, color:subtext, borderRadius:20, padding:'6px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
              ✕ Show All
            </button>
          </div>
        )}

        {/* PRODUCT GRID */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ width:44, height:44, border:'3px solid rgba(251,191,36,0.2)', borderTop:'3px solid #fbbf24', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 16px' }} />
            <div style={{ color:subtext }}>Loading gold coins...</div>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <img src={goldCoin} alt="" style={{ width:80, height:80, objectFit:'contain', opacity:0.3, marginBottom:16 }} />
            <div style={{ fontSize:18, fontWeight:700, color:text, marginBottom:8 }}>No gold coins found</div>
            <div style={{ fontSize:14, color:subtext, marginBottom:24 }}>
              {weightFilter ? `${weightFilter} gold coins not added yet` : 'No gold coins available yet'}
            </div>
            <button onClick={() => navigate('/customer')}
              style={{ padding:'12px 28px', background:'linear-gradient(90deg,#f59e0b,#fbbf24)', border:'none', borderRadius:12, fontWeight:700, cursor:'pointer', color:'#000' }}>
              ← Go Back
            </button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px' }}>
            {products.map(p => {
  const images = p.images?.map(img => getImageUrl(img)).filter(Boolean) || []
  const isHovered = hoveredId === p.id
  const displayIndex = isHovered && images.length > 1 ? 1 : 0
  const displayPrice = getProductPrice(p)
  const discountPct = parseFloat(p.wastage_charge) || 0
  const originalAmt = parseFloat(p.original_price) || 0
  const hasDiscount = discountPct > 0 && originalAmt > displayPrice && displayPrice > 0

  return (
    <div key={p.id}
      className="gc-card"
      onClick={() => navigate(`/product-display?category=coins&metal=gold&id=${p.id}`)}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; setHoveredId(p.id) }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; setHoveredId(null) }}
      style={{
        borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative',
        border: '1px solid #e8e8e8', background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.25s ease',
      }}
    >
      <div style={{ height: 280, background: '#f0f0f0', position: 'relative', overflow: 'hidden' }}>

        {p.tag && (
          <div style={{ position: 'absolute', top: 12, left: 0, background: '#2ecc71', color: '#fff', padding: '5px 12px 5px 10px', fontSize: 11, fontWeight: 700, clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)', zIndex: 2 }}>
            {p.tag}
          </div>
        )}

        <button onClick={e => toggleWishlist(e, p.id)}
          style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: '50%', border: wishlistedIds.has(p.id) ? '1.5px solid #e11d48' : '1px solid #ddd', background: wishlistedIds.has(p.id) ? 'rgba(225,29,72,0.15)' : 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, zIndex: 2 }}>
          {wishlistedIds.has(p.id) ? '❤️' : '🤍'}
        </button>

        {images.length > 0
          ? <img key={displayIndex} src={images[displayIndex]} alt={p.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'fadeImg 0.5s ease' }}
              onError={e => e.currentTarget.style.display = 'none'} />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 44 }}>🪙</div>
        }

        <div style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 16, color: '#999', zIndex: 2 }}>🔗</div>
      </div>

      <div style={{ padding: '12px 14px' }}>

  {/* Grade + Weight badges */}
  <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
    {p.grade && (
      <span style={{
        background: p.grade === '24k' ? 'rgba(255,215,0,0.15)' : 'rgba(251,191,36,0.15)',
        border: p.grade === '24k' ? '1px solid rgba(255,215,0,0.5)' : '1px solid rgba(251,191,36,0.5)',
        color: p.grade === '24k' ? '#b8860b' : '#92660a',
        borderRadius: 20, padding: '2px 10px',
        fontSize: 10, fontWeight: 800, letterSpacing: '0.5px'
      }}>
        {p.grade === '24k' ? '🥇 24K' : '🏅 22K'}
      </span>
    )}
    {p.net_weight && (
      <span style={{
        background: 'rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.1)',
        color: '#555',
        borderRadius: 20, padding: '2px 10px',
        fontSize: 10, fontWeight: 700
      }}>
        ⚖️ {p.net_weight}g
      </span>
    )}
  </div>

  {/* Price row */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
    <span style={{ fontSize: 15, fontWeight: 800, color: '#1a1a1a' }}>
      {displayPrice ? `₹${displayPrice.toLocaleString('en-IN')}` : '—'}
    </span>
    {hasDiscount && (
      <span style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>
        ₹{originalAmt.toLocaleString('en-IN')}
      </span>
    )}
  </div>

  {/* Discount */}
  {hasDiscount && (
    <div style={{ fontSize: 12, color: '#2ecc71', fontWeight: 700, marginBottom: 4 }}>
      {discountPct}% Off
    </div>
  )}

  {/* Product name */}
  <div style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 600 }}>{p.name}</div>

  {/* Live rate info */}
  {currentRate && p.net_weight && (
    <div style={{ fontSize: 10, color: '#999', marginTop: 3 }}>
      ₹{currentRate.toFixed(0)}/gm · incl. 3% GST
    </div>
  )}
</div>
    </div>
  )
})}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop:'48px', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'16px', color:subtext, fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:600 }}>
            <div style={{ width:'40px', height:'1px', background:`linear-gradient(90deg,transparent,${goldColor})` }} />
            BitByte Jewellers • Gold Coins
            <div style={{ width:'40px', height:'1px', background:`linear-gradient(90deg,${goldColor},transparent)` }} />
          </div>
        </div>
      </div>
    </div>
  )
}