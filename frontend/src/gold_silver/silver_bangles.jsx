import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { addToCart } from '../collection/card_section'
import CustomerNavbar from '../collection/CustomerNavbar'

const WEIGHTS = [
  { label: 'All Weights', grams: null },
  { label: '50 mg',  grams: 0.05 },
  { label: '100 mg', grams: 0.10 },
  { label: '150 mg', grams: 0.15 },
  { label: '200 mg', grams: 0.20 },
  { label: '500 mg', grams: 0.50 },
  { label: '1 gm',   grams: 1    },
  { label: '2 gm',   grams: 2    },
  { label: '4 gm',   grams: 4    },
  { label: '8 gm',   grams: 8    },
]

const TAG_COLORS = {
  Bestseller: { bg: 'rgba(52,211,153,0.2)',   border: 'rgba(52,211,153,0.5)',   color: '#34d399' },
  Antique:    { bg: 'rgba(251,191,36,0.15)',  border: 'rgba(251,191,36,0.4)',   color: '#fbbf24' },
  Premium:    { bg: 'rgba(192,192,192,0.25)', border: 'rgba(192,192,192,0.6)',  color: '#e2e8f0' },
  Minimal:    { bg: 'rgba(34,211,238,0.2)',   border: 'rgba(34,211,238,0.5)',   color: '#22d3ee' },
  Stackable:  { bg: 'rgba(167,139,250,0.2)',  border: 'rgba(167,139,250,0.5)',  color: '#a78bfa' },
}

export default function SilverBangles() {
  const navigate = useNavigate()
  const [selectedWeight, setSelectedWeight] = useState('All Weights')
  const [hoveredBangle, setHoveredBangle]   = useState(null)
  const [silverPrice, setSilverPrice]       = useState(null)
  const [selectedBangle, setSelectedBangle] = useState(null)
  const [silverBangles, setSilverBangles] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlistedIds, setWishlistedIds] = useState(new Set())

const bg        = '#FDF5EE'
const text      = '#020617'
const subtext   = '#64748b'
const border    = 'rgba(0,0,0,0.1)'
const cardBg    = 'rgba(0,0,0,0.03)'
const inpBg     = 'rgba(0,0,0,0.05)'
const inpBorder = '#d1d5db'
const silverColor = '#c0c0c0'
const silverGlow  = 'rgba(192,192,192,0.28)'

const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

const getImageUrl = (img) => {
  if (!img) return '/img/silver/silver-bangle-1.png'
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return `${API_BASE}/${img.replace(/^\/+/, '')}`
}

useEffect(() => {
  import('../api').then(({ default: api }) => {
    api.get('/jewelry-products/?category=bangles&metal=silver')
      .then(res => { setSilverBangles(res.data); setLoading(false) })
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

  /* ── helpers ── */
  const selectedW = WEIGHTS.find(w => w.label === selectedWeight)
  const unitPrice = selectedW?.grams && silverPrice ? selectedW.grams * silverPrice : null
  const tagStyle  = (tag) => TAG_COLORS[tag] || { bg:'rgba(255,255,255,0.1)', border:'rgba(255,255,255,0.2)', color:'#fff' }

return (
  <div style={{ minHeight:'100vh', background:bg, color:text, fontFamily:'"Inter",system-ui,sans-serif', position:'relative', overflow:'hidden' }}>
    <style>{`
      @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      @keyframes silverShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(192,192,192,0.1)} 50%{box-shadow:0 0 40px rgba(192,192,192,0.35)} }
      @keyframes shine { 0%{left:-80%} 100%{left:120%} }
      .sb-card { animation: fadeInUp 0.5s ease both; }
      .sb-card:nth-child(1){animation-delay:0.05s} .sb-card:nth-child(2){animation-delay:0.12s}
      .sb-card:nth-child(3){animation-delay:0.19s} .sb-card:nth-child(4){animation-delay:0.26s}
      .sb-img-wrap { overflow:hidden; }
      .sb-img-wrap img { transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1); }
      .sb-card:hover .sb-img-wrap img { transform:scale(1.12) translateY(-4px) !important; }
      .sb-shine { position:absolute;top:0;left:-80%;width:40%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);transform:skewX(-20deg);opacity:0;transition:opacity 0.3s; }
      .sb-card:hover .sb-shine { opacity:1; animation:shine 0.6s ease; }
    `}</style>
    <CustomerNavbar />
    
      <div style={{ position:'relative', zIndex:10, padding:'40px', maxWidth:'1300px', margin:'0 auto' }}>

        {/* ── Page Header ── */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'40px', animation:'fadeInUp 0.4s ease both' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(192,192,192,0.08)', border:'1px solid rgba(192,192,192,0.25)', borderRadius:'20px', padding:'5px 14px', marginBottom:'14px' }}>
              <span className="sparkle-dot" style={{ color:silverColor, fontSize:'11px' }}>✦</span>
              <span style={{ color:silverColor, fontSize:'10px', fontWeight:800, letterSpacing:'2px', textTransform:'uppercase' }}>Premium Silver Collection</span>
            </div>
            <h1 style={{ margin:0, fontSize:'36px', fontWeight:900, letterSpacing:'-0.5px' }}>
              🥈{' '}
              <span style={{ background:'linear-gradient(90deg,#9ca3af,#c0c0c0,#e2e8f0,#c0c0c0)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'silverShimmer 3s linear infinite' }}>
                Silver Bangles
              </span>
            </h1>
            <p style={{ color:subtext, fontSize:'13px', margin:'8px 0 0', fontWeight:500 }}>5 exclusive designs · Handcrafted Silver 999</p>
          </div>

          {/* Rate panel */}
          {silverPrice && (
            <div style={{ background:'rgba(192,192,192,0.08)', border:'1px solid rgba(192,192,192,0.25)', borderRadius:'10px', padding:'12px 20px', textAlign:'right' }}>
              <div style={{ color:subtext, fontSize:'10px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Live Rate (Silver 999)</div>
              <div style={{ color:silverColor, fontWeight:900, fontSize:'18px', fontFamily:'monospace' }}>₹{silverPrice.toFixed(2)}/gm</div>
            </div>
          )}
        </div>


        {/* ── Bangle Cards — 5 cards ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'18px' }}>
          {loading ? (
  <div style={{ gridColumn:'span 3', textAlign:'center', color:subtext, padding:'60px 0' }}>
    ⏳ Loading products...
  </div>
) : silverBangles.length === 0 ? (
  <div style={{ gridColumn:'span 3', textAlign:'center', color:subtext, padding:'60px 0' }}>
    No silver bangles added yet.
  </div>
) : silverBangles.map((bangle) => {
            const isHovered = hoveredBangle === bangle.id
            const tag = tagStyle(bangle.tag)
            return (
              <div key={bangle.id} className="sb-card"
                onClick={() => navigate(`/product-display?category=bangles&metal=silver&id=${bangle.id}`)}
                onMouseEnter={() => setHoveredBangle(bangle.id)}
                onMouseLeave={() => setHoveredBangle(null)}
                style={{
                  borderRadius:'20px', overflow:'hidden', cursor:'pointer', position:'relative',
                  border: `1px solid ${isHovered ? 'rgba(192,192,192,0.55)' : 'rgba(192,192,192,0.18)'}`,
                  background: isHovered ? 'rgba(192,192,192,0.07)' : cardBg,
                  transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: isHovered ? `0 20px 50px ${silverGlow}, 0 0 0 1px rgba(192,192,192,0.1)` : 'none',
                  transition:'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                <div className="sb-shine" />

                {/* Image */}
                <div className="sb-img-wrap" style={{ position:'relative', height:'200px', background: 'rgba(0,0,0,0.04)' }}>
                  <img src={getImageUrl(bangle.images?.[0]?.image)} alt={bangle.name}
                  onError={(e) => { e.currentTarget.src = '/img/silver/silver-bangle-1.png' }} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(2,6,23,0.8) 0%, transparent 60%)' }} />

                  {/* tag */}
                  <div style={{ position:'absolute', top:'10px', left:'10px', background:tag.bg, border:`1px solid ${tag.border}`, borderRadius:'16px', padding:'3px 10px', color:tag.color, fontSize:'9px', fontWeight:800, letterSpacing:'0.5px', backdropFilter:'blur(8px)' }}>
                    {bangle.tag}
                  </div>

                 {/* heart + number badge */}
                  <div style={{ position:'absolute', top:'10px', right:'10px', display:'flex', alignItems:'center', gap:'6px', zIndex:10 }}>
                    <button onClick={e => toggleWishlist(e, bangle.id)} style={{ width:'30px', height:'30px', borderRadius:'50%', border: wishlistedIds.has(bangle.id) ? '1.5px solid #e11d48' : '1.5px solid rgba(255,255,255,0.35)', background: wishlistedIds.has(bangle.id) ? 'rgba(225,29,72,0.18)' : 'rgba(0,0,0,0.4)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'14px', transition:'all 0.2s ease' }}>
                      {wishlistedIds.has(bangle.id) ? '❤️' : '🤍'}
                    </button>
                    <div style={{ width:'24px', height:'24px', borderRadius:'50%', background:'rgba(192,192,192,0.15)', border:'1px solid rgba(192,192,192,0.4)', display:'flex', alignItems:'center', justifyContent:'center', color:silverColor, fontSize:'10px', fontWeight:900 }}>
                      {bangle.id}
                    </div>
                  </div>

                  {/* hover glow ring */}
                  {isHovered && (
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                      <div style={{ width:'70px', height:'70px', borderRadius:'50%', border:'2px solid rgba(192,192,192,0.6)', animation:'glow-pulse 1.5s ease infinite' }} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding:'14px 16px' }}>
                  <div style={{ color: isHovered ? silverColor : text, fontWeight:800, fontSize:'13px', marginBottom:'4px', transition:'color 0.3s' }}>{bangle.name}</div>
                  <div style={{ color:subtext, fontSize:'10px', lineHeight:'1.5', marginBottom:'10px' }}>{bangle.description}</div>


                </div>

                {/* hover CTA */}
                {isHovered && (
                  <div style={{ padding:'0 16px 14px', animation:'fadeInUp 0.2s ease' }}>
                    <div style={{ width:'100%', padding:'8px', background:'linear-gradient(90deg,#9ca3af,#e2e8f0)', borderRadius:'10px', color:'#000', fontWeight:800, fontSize:'11px', textAlign:'center' }}>
                      👁 View Details
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* footer line */}
        <div style={{ marginTop:'48px', textAlign:'center', animation:'fadeInUp 0.6s ease 0.4s both' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'16px', color:subtext, fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:600 }}>
            <div style={{ width:'40px', height:'1px', background:`linear-gradient(90deg,transparent,${silverColor})` }} />
            BitByte Jewellers • Silver Bangle Collection
            <div style={{ width:'40px', height:'1px', background:`linear-gradient(90deg,${silverColor},transparent)` }} />
          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedBangle && (
        <div onClick={() => setSelectedBangle(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', backdropFilter:'blur(14px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div onClick={e => e.stopPropagation()} style={{background: '#f8fafc' , border:'1px solid rgba(192,192,192,0.35)', borderRadius:'28px', width:'95%', maxWidth:'560px', overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,0.8)', animation:'fadeInUp 0.3s ease' }}>

            {/* image */}
            <div style={{ position:'relative', height:'200px', overflow:'hidden' }}>
              <img src={getImageUrl(selectedBangle.images?.[0]?.image)} alt={selectedBangle.name}
  onError={(e) => { e.currentTarget.src = '/img/silver/silver-bangle-1.png' }} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(2,6,23,0.9) 0%,transparent 60%)' }} />
              <button onClick={() => setSelectedBangle(null)} style={{ position:'absolute', top:'16px', right:'16px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.4)', color:'#f87171', borderRadius:'10px', padding:'6px 14px', cursor:'pointer', fontSize:'12px', backdropFilter:'blur(8px)' }}>✕ Close</button>
              <div style={{ position:'absolute', top:'16px', left:'16px', background:tagStyle(selectedBangle.tag).bg, border:`1px solid ${tagStyle(selectedBangle.tag).border}`, borderRadius:'20px', padding:'5px 14px', color:tagStyle(selectedBangle.tag).color, fontSize:'11px', fontWeight:800, backdropFilter:'blur(8px)' }}>{selectedBangle.tag}</div>
            </div>

            {/* details */}
            <div style={{ padding:'28px 32px' }}>
              <div style={{ color:silverColor, fontWeight:900, fontSize:'24px', marginBottom:'6px' }}>{selectedBangle.name}</div>
              <div style={{ color:subtext, fontSize:'13px', lineHeight:'1.6', marginBottom:'24px' }}>{selectedBangle.description}</div>


             <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
  <button
    onClick={() => {
      addToCart({
        id: selectedBangle.id,
        name: selectedBangle.name,
        description: selectedBangle.description,
        img: getImageUrl(selectedBangle.images?.[0]?.image),
        tag: selectedBangle.tag,
        metal: 'silver',
        metalLabel: 'Silver 999',
        ringType: 'Silver Bangle',
      })

      setSelectedBangle(null)
      navigate('/cart')
    }}
    style={{
      width:'100%',
      padding:'14px',
      background:'linear-gradient(90deg,#9ca3af,#e5e7eb)',
      border:'none',
      borderRadius:'14px',
      color:'#000',
      fontWeight:900,
      fontSize:'14px',
      cursor:'pointer'
    }}
  >
    🛒 Add to Cart
  </button>

  <button
    onClick={() => {
      setSelectedBangle(null)
      navigate('/customer')
    }}
    style={{
      width:'100%',
      padding:'12px',
      background:'rgba(192,192,192,0.08)',
      border:'1px solid rgba(192,192,192,0.3)',
      borderRadius:'14px',
      color:'#c0c0c0',
      fontWeight:700,
      fontSize:'13px',
      cursor:'pointer'
    }}
  >
    ⚡ Place Order on Dashboard
  </button>
</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}