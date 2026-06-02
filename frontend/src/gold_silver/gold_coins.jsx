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
      .gc-shine { position:absolute; top:0; left:-80%; width:40%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent); transform:skewX(-20deg); opacity:0; transition:opacity 0.3s; }
      .gc-card:hover .gc-shine { opacity:1; animation:shine 0.6s ease; }
    `}</style>

    <CustomerNavbar />

      <div style={{ position:'relative', zIndex:10, padding:'40px', maxWidth:'1300px', margin:'0 auto' }}>

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
              const firstImg = p.images?.[0] ? getImageUrl(p.images[0]) : null
              const displayPrice = getProductPrice(p)
              const isHovered = hoveredId === p.id

              return (
                <div key={p.id}
                  className="gc-card"
                  onClick={() => navigate(`/product-display?category=coins&metal=gold&id=${p.id}`)}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    borderRadius:'20px', overflow:'hidden', cursor:'pointer', position:'relative',
                    border: `1px solid ${isHovered ? 'rgba(251,191,36,0.6)' : 'rgba(251,191,36,0.18)'}`,
                    background: isHovered ? 'rgba(251,191,36,0.07)' : cardBg,
                    transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                    boxShadow: isHovered ? '0 20px 50px rgba(251,191,36,0.28)' : 'none',
                    transition:'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                >
                  <div className="gc-shine" />

                  {/* Image */}
                  <div style={{
                    height:'200px', position:'relative', overflow:'hidden',
                    background: 'linear-gradient(135deg,#fff8e7,#fef3c7)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    {firstImg
                      ? <img src={firstImg} alt={p.name}
                          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transform: isHovered ? 'scale(1.08)' : 'scale(1)', transition:'transform 0.4s ease' }}
                          onError={e => e.currentTarget.style.display='none'} />
                      : <img src={goldCoin} alt={p.name}
                          style={{ width:110, height:110, objectFit:'contain', filter:`drop-shadow(0 8px 20px rgba(251,191,36,0.8))`, animation: isHovered ? 'coinFloat 1.5s ease-in-out infinite' : 'none' }} />
                    }
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />

                   {/* heart + Grade badge */}
                    <div style={{ position:'absolute', top:'10px', right:'10px', display:'flex', alignItems:'center', gap:'6px', zIndex:10 }}>
                      <button onClick={e => toggleWishlist(e, p.id)} style={{ width:'28px', height:'28px', borderRadius:'50%', border: wishlistedIds.has(p.id) ? '1.5px solid #e11d48' : '1.5px solid rgba(255,255,255,0.35)', background: wishlistedIds.has(p.id) ? 'rgba(225,29,72,0.18)' : 'rgba(0,0,0,0.4)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'13px', transition:'all 0.2s ease' }}>
                        {wishlistedIds.has(p.id) ? '❤️' : '🤍'}
                      </button>
                      <div style={{ background: p.grade==='24k' ? 'rgba(255,215,0,0.9)' : 'rgba(251,191,36,0.9)', color:'#000', borderRadius:20, padding:'3px 10px', fontSize:10, fontWeight:900 }}>
                        {p.grade?.toUpperCase() || '22K'}
                      </div>
                    </div>

                    {/* Tag */}
                    {p.tag && (
                      <div style={{ position:'absolute', top:'10px', left:'10px', background:'rgba(139,26,26,0.9)', color:'#fff', borderRadius:20, padding:'3px 10px', fontSize:9, fontWeight:800 }}>
                        {p.tag}
                      </div>
                    )}

                    {/* Hover glow */}
                    {isHovered && (
                      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                        <div style={{ width:'80px', height:'80px', borderRadius:'50%', border:`2px solid rgba(251,191,36,0.7)`, animation:'glow-pulse 1.5s ease infinite' }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding:'14px 16px' }}>
                    <div style={{ color: isHovered ? goldColor : text, fontWeight:800, fontSize:'13px', marginBottom:'4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', transition:'color 0.3s' }}>
                      {p.name}
                    </div>
                    {p.net_weight && (
                      <div style={{ color:subtext, fontSize:'10px', marginBottom:'8px' }}>⚖️ {p.net_weight}g net weight</div>
                    )}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ color: goldColor, fontWeight:900, fontSize:'14px', fontFamily:'monospace' }}>
                        {displayPrice ? `₹${displayPrice.toLocaleString('en-IN')}` : '—'}
                      </div>
                      <div style={{ fontSize:'9px', color:subtext }}>incl. 3% GST</div>
                    </div>
                  </div>

                  {/* Hover CTA */}
                  {isHovered && (
                    <div style={{ padding:'0 16px 14px', animation:'fadeInUp 0.2s ease' }}>
                      <div style={{ width:'100%', padding:'8px', background:'linear-gradient(90deg,#f59e0b,#fbbf24)', borderRadius:'10px', color:'#000', fontWeight:800, fontSize:'11px', textAlign:'center', cursor:'pointer' }}>
                        👁 View Details
                      </div>
                    </div>
                  )}
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