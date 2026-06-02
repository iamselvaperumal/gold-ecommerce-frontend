import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/logo.png'
import silverCoin from '../assets/silver-coin-transparent.png'
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

export default function SilverCoins() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const weightFilter = searchParams.get('weight')  // e.g. "500 mg" or "1 gm"

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [silverPrice, setSilverPrice] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [wishlistedIds, setWishlistedIds] = useState(new Set())


const bg = '#FDF5EE'
const text = '#020617'
const subtext = '#64748b'
const border = 'rgba(0,0,0,0.1)'
const cardBg = 'rgba(0,0,0,0.03)'
const silverColor = '#c0c0c0'

  // Fetch silver rate
  useEffect(() => {
    import('../api').then(({ default: api }) => {
      api.get('/metal-rates/').then(res => {
        setSilverPrice(parseFloat(res.data.silver_999))
      }).catch(() => {})
    })
  }, [])

  // Fetch products
  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/api/jewelry-products/?category=coins&metal=silver`)
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
  }, [weightFilter])


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


  const getProductPrice = (p) => {
    if (p.price && parseFloat(p.price) > 0) return parseFloat(p.price)
    const nw = parseFloat(p.net_weight) || 0
    if (nw && silverPrice) return parseFloat((nw * silverPrice * 1.03).toFixed(2))
    return null
  }

return (
  <div style={{ minHeight:'100vh', background:bg, color:text, fontFamily:'"Inter",system-ui,sans-serif', position:'relative', overflow:'hidden' }}>
    <style>{`
      @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      @keyframes silverShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes coinFloat { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(-5deg)} }
      @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(192,192,192,0.1)} 50%{box-shadow:0 0 50px rgba(192,192,192,0.5)} }
      @keyframes shine { 0%{left:-80%} 100%{left:120%} }
      @keyframes spin { to{transform:rotate(360deg)} }
      .sc-card { animation: fadeInUp 0.5s ease both; }
      .sc-card:nth-child(1){animation-delay:0.05s} .sc-card:nth-child(2){animation-delay:0.1s}
      .sc-card:nth-child(3){animation-delay:0.15s} .sc-card:nth-child(4){animation-delay:0.2s}
      .sc-card:nth-child(5){animation-delay:0.25s} .sc-card:nth-child(6){animation-delay:0.3s}
      .sc-shine { position:absolute; top:0; left:-80%; width:40%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent); transform:skewX(-20deg); opacity:0; transition:opacity 0.3s; }
      .sc-card:hover .sc-shine { opacity:1; animation:shine 0.6s ease; }
    `}</style>

    <CustomerNavbar />

      <div style={{ position:'relative', zIndex:10, padding:'40px', maxWidth:'1300px', margin:'0 auto' }}>

        {/* PAGE HEADER */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'40px', animation:'fadeInUp 0.4s ease both' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(192,192,192,0.08)', border:'1px solid rgba(192,192,192,0.25)', borderRadius:'20px', padding:'5px 14px', marginBottom:'14px' }}>
              <span className="sparkle-dot" style={{ color:silverColor, fontSize:'11px' }}>✦</span>
              <span style={{ color:silverColor, fontSize:'10px', fontWeight:800, letterSpacing:'2px', textTransform:'uppercase' }}>Premium Silver Coins</span>
            </div>
            <h1 style={{ margin:0, fontSize:'36px', fontWeight:900, letterSpacing:'-0.5px' }}>
              🥈{' '}
              <span style={{ background:'linear-gradient(90deg,#9ca3af,#c0c0c0,#e2e8f0,#c0c0c0)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'silverShimmer 3s linear infinite' }}>
                Silver Coins {weightFilter ? `— ${weightFilter}` : ''}
              </span>
            </h1>
            <p style={{ color:subtext, fontSize:'13px', margin:'8px 0 0', fontWeight:500 }}>{loading ? 'Loading...' : `${products.length} coins available`} · Silver 999</p>
          </div>

          {/* Live rate */}
          {silverPrice && (
            <div style={{ background:'rgba(192,192,192,0.08)', border:'1px solid rgba(192,192,192,0.25)', borderRadius:'10px', padding:'12px 20px', textAlign:'right' }}>
              <div style={{ color:subtext, fontSize:'10px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Live Rate (Silver 999)</div>
              <div style={{ color:silverColor, fontWeight:900, fontSize:'18px', fontFamily:'monospace' }}>₹{silverPrice.toFixed(2)}/gm</div>
            </div>
          )}
        </div>

        {/* Weight filter badge */}
        {weightFilter && (
          <div style={{ marginBottom:'24px', display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ background:'rgba(192,192,192,0.12)', border:'1px solid rgba(192,192,192,0.4)', color:silverColor, borderRadius:20, padding:'6px 16px', fontSize:13, fontWeight:700 }}>
              ⚖️ Filtered: {weightFilter}
            </span>
            <button onClick={() => navigate('/silver-coins')}
              style={{ background:'transparent', border:`1px solid ${border}`, color:subtext, borderRadius:20, padding:'6px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
              ✕ Show All
            </button>
          </div>
        )}

        {/* PRODUCT GRID */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ width:44, height:44, border:'3px solid rgba(192,192,192,0.2)', borderTop:'3px solid #c0c0c0', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 16px' }} />
            <div style={{ color:subtext }}>Loading silver coins...</div>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <img src={silverCoin} alt="" style={{ width:80, height:80, objectFit:'contain', opacity:0.3, marginBottom:16 }} />
            <div style={{ fontSize:18, fontWeight:700, color:text, marginBottom:8 }}>No silver coins found</div>
            <div style={{ fontSize:14, color:subtext, marginBottom:24 }}>
              {weightFilter ? `${weightFilter} silver coins not added yet` : 'No silver coins available yet'}
            </div>
            <button onClick={() => navigate('/customer')}
              style={{ padding:'12px 28px', background:'linear-gradient(90deg,#9ca3af,#e5e7eb)', border:'none', borderRadius:12, fontWeight:700, cursor:'pointer', color:'#000' }}>
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
                  className="sc-card"
                  onClick={() => navigate(`/product-display?category=coins&metal=silver&id=${p.id}`)}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    borderRadius:'20px', overflow:'hidden', cursor:'pointer', position:'relative',
                    border: `1px solid ${isHovered ? 'rgba(192,192,192,0.6)' : 'rgba(192,192,192,0.18)'}`,
                    background: isHovered ? 'rgba(192,192,192,0.07)' : cardBg,
                    transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                    boxShadow: isHovered ? '0 20px 50px rgba(192,192,192,0.25)' : 'none',
                    transition:'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                >
                  <div className="sc-shine" />

                  {/* Image */}
                  <div style={{
                    height:'200px', position:'relative', overflow:'hidden',
                    background: 'linear-gradient(135deg,#f8f9fa,#e9ecef)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    {firstImg
                      ? <img src={firstImg} alt={p.name}
                          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transform: isHovered ? 'scale(1.08)' : 'scale(1)', transition:'transform 0.4s ease' }}
                          onError={e => e.currentTarget.style.display='none'} />
                      : <img src={silverCoin} alt={p.name}
                          style={{ width:110, height:110, objectFit:'contain', filter:'drop-shadow(0 8px 20px rgba(192,192,192,0.8))', animation: isHovered ? 'coinFloat 1.5s ease-in-out infinite' : 'none' }} />
                    }
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />

                  {/* heart + Grade badge */}
                    <div style={{ position:'absolute', top:'10px', right:'10px', display:'flex', alignItems:'center', gap:'6px', zIndex:10 }}>
                      <button onClick={e => toggleWishlist(e, p.id)} style={{ width:'28px', height:'28px', borderRadius:'50%', border: wishlistedIds.has(p.id) ? '1.5px solid #e11d48' : '1.5px solid rgba(255,255,255,0.35)', background: wishlistedIds.has(p.id) ? 'rgba(225,29,72,0.18)' : 'rgba(0,0,0,0.4)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'13px', transition:'all 0.2s ease' }}>
                        {wishlistedIds.has(p.id) ? '❤️' : '🤍'}
                      </button>
                      {/* <div style={{ background:'rgba(192,192,192,0.9)', color:'#000', borderRadius:20, padding:'3px 10px', fontSize:10, fontWeight:900 }}>
                        999
                      </div> */}
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
                        <div style={{ width:'80px', height:'80px', borderRadius:'50%', border:'2px solid rgba(192,192,192,0.7)', animation:'glow-pulse 1.5s ease infinite' }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding:'14px 16px' }}>
                    <div style={{ color: isHovered ? silverColor : text, fontWeight:800, fontSize:'13px', marginBottom:'4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', transition:'color 0.3s' }}>
                      {p.name}
                    </div>
                    {p.net_weight && (
                      <div style={{ color:subtext, fontSize:'10px', marginBottom:'8px' }}>⚖️ {p.net_weight}g net weight</div>
                    )}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ color:silverColor, fontWeight:900, fontSize:'14px', fontFamily:'monospace' }}>
                        {displayPrice ? `₹${displayPrice.toLocaleString('en-IN')}` : '—'}
                      </div>
                      <div style={{ fontSize:'9px', color:subtext }}>incl. 3% GST</div>
                    </div>
                  </div>

                  {/* Hover CTA */}
                  {isHovered && (
                    <div style={{ padding:'0 16px 14px', animation:'fadeInUp 0.2s ease' }}>
                      <div style={{ width:'100%', padding:'8px', background:'linear-gradient(90deg,#9ca3af,#e2e8f0)', borderRadius:'10px', color:'#000', fontWeight:800, fontSize:'11px', textAlign:'center', cursor:'pointer' }}>
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
            <div style={{ width:'40px', height:'1px', background:`linear-gradient(90deg,transparent,${silverColor})` }} />
            BitByte Jewellers • Silver Coins
            <div style={{ width:'40px', height:'1px', background:`linear-gradient(90deg,${silverColor},transparent)` }} />
          </div>
        </div>
      </div>
    </div>
  )
}