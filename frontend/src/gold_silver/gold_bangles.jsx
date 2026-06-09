import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { addToCart } from '../collection/card_section'
import CustomerNavbar from '../collection/CustomerNavbar'
import CustomerFooter from '../collection/CustomerFooter'


const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i, size: Math.random() * 50 + 8, x: Math.random() * 100,
  delay: Math.random() * 8, duration: Math.random() * 12 + 15, opacity: Math.random() * 0.18 + 0.04,
}))

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
  Bridal:     { bg: 'rgba(244,114,182,0.2)',  border: 'rgba(244,114,182,0.5)',  color: '#f472b6' },
  Premium:    { bg: 'rgba(251,191,36,0.25)',  border: 'rgba(251,191,36,0.6)',   color: '#fbbf24' },
  Statement:  { bg: 'rgba(167,139,250,0.2)',  border: 'rgba(167,139,250,0.5)',  color: '#a78bfa' },
  Minimal:    { bg: 'rgba(34,211,238,0.2)',   border: 'rgba(34,211,238,0.5)',   color: '#22d3ee' },
  Stackable:  { bg: 'rgba(251,191,36,0.15)',  border: 'rgba(251,191,36,0.4)',   color: '#ffd700' },
}

export default function GoldBangles() {
  const navigate = useNavigate()
  
  const [selectedWeight, setSelectedWeight] = useState('All Weights')
  const [hoveredBangle, setHoveredBangle]   = useState(null)
  const [goldPrice, setGoldPrice]           = useState(null)
  const [selectedBangle, setSelectedBangle] = useState(null)
  const [goldBangles, setGoldBangles] = useState([])
const [loading, setLoading] = useState(true)
  const [metalType, setMetalType]           = useState('gold_22k') // '22k' | '24k'
  const [wishlistedIds, setWishlistedIds] = useState(new Set())
 

const bg        = '#fdf6f0'
const text      = '#020617'
const subtext   = '#64748b'
const border    = 'rgba(0,0,0,0.1)'
const glass     = 'rgba(255,255,255,0.7)'
const cardBg    = 'rgba(0,0,0,0.03)'
const inpBg     = 'rgba(0,0,0,0.05)'
const inpBorder = '#d1d5db'
const optionBg  = '#ffffff'

  const goldColor = metalType === 'gold_24k' ? '#ffd700' : '#fbbf24'
  const goldGlow  = metalType === 'gold_24k' ? 'rgba(255,215,0,0.28)' : 'rgba(251,191,36,0.28)'

const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

const getImageUrl = (img) => {
  if (!img) return '/img/gold/gold-bangles-1.png'
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return `${API_BASE}/${img.replace(/^\/+/, '')}`
}

useEffect(() => {
  import('../api').then(({ default: api }) => {
    api.get('/jewelry-products/?category=bangles&metal=gold')
      .then(res => { setGoldBangles(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  })
}, [])


useEffect(() => {
    import('../api').then(({ default: api }) => {
      api.get('/wishlist/').then(res => {
        const ids = new Set(res.data.items.map(i => i.product_id))
        setWishlistedIds(ids)
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
    } catch (err) { console.error(err) }
  }



  const currentRate = goldPrice ? (metalType === 'gold_24k' ? goldPrice.gold24k : goldPrice.gold22k) : null


  



  /* ── helpers ── */
  const selectedW  = WEIGHTS.find(w => w.label === selectedWeight)
  const unitPrice  = selectedW?.grams && currentRate ? selectedW.grams * currentRate : null
  const tagStyle   = (tag) => TAG_COLORS[tag] || { bg:'rgba(255,255,255,0.1)', border:'rgba(255,255,255,0.2)', color:'#fff' }

  return (
<div style={{ minHeight:'100vh', background:bg, color:text, fontFamily:'"Montserrat", sans-serif', position:'relative', overflow:'hidden', transition:'background 0.8s ease, color 0.4s ease' }}>
      <style>{`


        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@400;500;600;700&display=swap');

          /* ── SCROLLBAR STYLE ── */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #FDF5EE; }
  ::-webkit-scrollbar-thumb { background: #edd3a3; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #f3d54f; }
        @keyframes float-orb    { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes antigravity  { 0%{transform:translateY(110vh) rotate(0deg);opacity:0} 10%{opacity:var(--op)} 90%{opacity:var(--op)} 100%{transform:translateY(-20vh) rotate(360deg);opacity:0} }
        @keyframes fadeInUp     { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes goldShimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes glow-pulse   { 0%,100%{box-shadow:0 0 20px rgba(251,191,36,0.1)} 50%{box-shadow:0 0 40px rgba(251,191,36,0.4)} }
        @keyframes shine        { 0%{left:-80%} 100%{left:120%} }
        @keyframes fadeImg      { from{opacity:0;transform:scale(1.03)} to{opacity:1;transform:scale(1)} }
        @keyframes sparkle      { 0%,100%{opacity:0;transform:scale(0) rotate(0deg)} 50%{opacity:1;transform:scale(1) rotate(180deg)} }

        .gb-card { animation: fadeInUp 0.5s ease both; }
        .gb-card:nth-child(1){animation-delay:0.05s}
        .gb-card:nth-child(2){animation-delay:0.10s}
        .gb-card:nth-child(3){animation-delay:0.15s}
        .gb-card:nth-child(4){animation-delay:0.20s}
        .gb-card:nth-child(5){animation-delay:0.25s}
        .gb-card:nth-child(6){animation-delay:0.30s}

        .gb-img-wrap { overflow:hidden; }
        .gb-img-wrap img { transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        .gb-card:hover .gb-img-wrap img { transform:scale(1.12) translateY(-4px) !important; }

        .gb-shine { position:absolute;top:0;left:-80%;width:40%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,220,100,0.2),transparent);transform:skewX(-20deg);opacity:0;transition:opacity 0.3s; }
        .gb-card:hover .gb-shine { opacity:1; animation:shine 0.6s ease; }

        .sparkle-dot { animation:sparkle 2s ease infinite; }
        .weight-chip { transition:all 0.2s ease; }
        .weight-chip:hover { transform:translateY(-2px); }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }
        input[type=number] { -moz-appearance:textfield; appearance:textfield; }
      `}</style>

      

      

      {/* ── Navbar ── */}
<CustomerNavbar />

{/* ── Category Banner ── */}
<div style={{ width:'100%', height:'460px', position:'relative', overflow:'hidden', }}>
  <img
src="/banners/sample4.jpeg"
alt="Chain Banner"
    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
  />
  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 60%)' }} />
  <div style={{ position:'absolute', bottom:40, left:60 }}>
    <div style={{ color:'rgba(255,255,255,0.75)', fontSize:14, marginBottom:6 }}>Home / Bangles</div>
    <div style={{ color:'#fff', fontSize:42, fontWeight:800, fontFamily:'"Playfair Display", Georgia, serif' }}>Bangles</div>
  </div>
</div>


      <div style={{ position:'relative', zIndex:10, padding:'0px 40px', maxWidth:'100%', margin:'0 auto' }}>

        {/* ── Page Header ── */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'32px', animation:'fadeInUp 0.4s ease both', flexWrap:'wrap', gap:'16px' }}>

        </div>


        {/* ── Bangle Cards — 6 cards, 3 columns ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', padding: '0 40px', gap:'20px' }}>
          {loading ? (
  <div style={{ gridColumn:'span 3', textAlign:'center', color:subtext, padding:'60px 0' }}>
    ⏳ Loading products...
  </div>
) : goldBangles.length === 0 ? (
  <div style={{ gridColumn:'span 4', textAlign:'center', color:subtext, padding:'60px 0' }}>
    No gold bangles added yet.
  </div>
) : goldBangles.map((product) => {
  const images = product.images?.map(img => {
    const src = typeof img === 'object' ? (img.image || '') : img
    if (!src) return null
    if (src.startsWith('http')) return src
    return `${API_BASE}/${src.replace(/^\/+/, '')}`
  }).filter(Boolean) || []
  const isHovered = hoveredBangle === product.id
  const displayIndex = isHovered && images.length > 1 ? 1 : 0
  const price = parseFloat(product.price) || 0
  const discountPct = parseFloat(product.wastage_charge) || 0
  const originalAmt = parseFloat(product.original_price) || 0
  const hasDiscount = discountPct > 0 && originalAmt > price && price > 0

  return (
    <div key={product.id} className="gb-card"
      onClick={() => navigate(`/product-display?category=bangles&metal=gold&id=${product.id}`)}
      onMouseEnter={() => setHoveredBangle(product.id)}
      onMouseLeave={() => setHoveredBangle(null)}
      style={{
        borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative',
        border: '1px solid #e8e8e8', background: '#fff',
        boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.25s ease',
      }}>
      <div style={{ height: 320, background: '#f0f0f0', position: 'relative', overflow: 'hidden', marginBottom: 10 }}>
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
    <span style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a' }}>
      {price > 0 ? `₹${price.toLocaleString('en-IN')}` : '—'}
    </span>
    {hasDiscount && (
      <span style={{ fontSize: 15, color: '#999', textDecoration: 'line-through' }}>
        ₹{originalAmt.toLocaleString('en-IN')}
      </span>
    )}
  </div>
  {hasDiscount && (
    <div style={{ fontSize: 13, color: '#2ecc71', fontWeight: 700, marginBottom: 6 }}>
      {discountPct}% Off
    </div>
  )}
  <div style={{ fontSize: 18, color: '#1a1a1a', fontWeight: 600,
    fontFamily: '"Cormorant Garamond", Georgia, serif' }}>{product.name}
  </div>
</div>
    </div>
  )
})}

        </div>

        {/* footer line */}
        <div style={{ marginTop:'48px', textAlign:'center', animation:'fadeInUp 0.6s ease 0.4s both' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'16px', color:subtext, fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:600 }}>
            <div style={{ width:'40px', height:'1px', background:`linear-gradient(90deg,transparent,${goldColor})` }} />
            Bharathi Jewellers • Gold Bangle Collection
            <div style={{ width:'40px', height:'1px', background:`linear-gradient(90deg,${goldColor},transparent)` }} />
          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedBangle && (
        <div onClick={() => setSelectedBangle(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', backdropFilter:'blur(14px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#f8fafc', border:'1px solid rgba(251,191,36,0.35)', borderRadius:'28px', width:'95%', maxWidth:'560px', overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,0.8)', animation:'fadeInUp 0.3s ease' }}>

            {/* image */}
            <div style={{ position:'relative', height:'180px', overflow:'hidden' }}>
              <img
  src={getImageUrl(selectedBangle.images?.[0]?.image)}
  alt={selectedBangle.name}
  onError={(e) => { e.currentTarget.src = '/img/gold/gold-bangles-1.png' }}
  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
/>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(2,6,23,0.9) 0%,transparent 60%)' }} />
              <button onClick={() => setSelectedBangle(null)} style={{ position:'absolute', top:'16px', right:'16px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.4)', color:'#f87171', borderRadius:'10px', padding:'6px 14px', cursor:'pointer', fontSize:'12px', backdropFilter:'blur(8px)' }}>✕ Close</button>
              <div style={{ position:'absolute', top:'16px', left:'16px', background:tagStyle(selectedBangle.tag).bg, border:`1px solid ${tagStyle(selectedBangle.tag).border}`, borderRadius:'20px', padding:'5px 14px', color:tagStyle(selectedBangle.tag).color, fontSize:'11px', fontWeight:800, backdropFilter:'blur(8px)' }}>{selectedBangle.tag}</div>
            </div>

            {/* details */}
            <div style={{ padding:'28px 32px' }}>
              <div style={{ color:goldColor, fontWeight:900, fontSize:'24px', marginBottom:'6px', fontFamily:'"Playfair Display", Georgia, serif' }}>{selectedBangle.name}</div>
              <div style={{ color:subtext, fontSize:'13px', lineHeight:'1.6', marginBottom:'24px' }}>{selectedBangle.description}</div>

              {/* Metal type toggle in modal */}
              <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
                {[{key:'gold_22k', label:'Gold 22K'}, {key:'gold_24k', label:'Gold 24K'}].map(m => (
                  <button key={m.key} onClick={() => setMetalType(m.key)}
                    style={{ flex:1, padding:'8px', borderRadius:'10px', border:`1px solid ${metalType===m.key ? goldColor : border}`, background: metalType===m.key ? 'rgba(251,191,36,0.15)' : 'transparent', color: metalType===m.key ? goldColor : subtext, fontWeight:800, fontSize:'12px', cursor:'pointer', transition:'all 0.2s ease' }}>
                    🏅 {m.label}
                  </button>
                ))}
              </div>


           <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
  <button
    onClick={() => {
      addToCart({
        id: selectedBangle.id,
        name: selectedBangle.name,
       desc: selectedBangle.description,
       img: getImageUrl(selectedBangle.images?.[0]?.image),
        tag: selectedBangle.tag,
        metal: metalType,
        metalLabel: metalType === 'gold_24k' ? 'Gold 24K' : 'Gold 22K',
        ringType: 'Gold Bangle',
      })

      setSelectedBangle(null)
      navigate('/cart')
    }}
    style={{
      width:'100%',
      padding:'14px',
      background:'linear-gradient(90deg,#f59e0b,#fbbf24)',
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
      background:'rgba(251,191,36,0.08)',
      border:'1px solid rgba(251,191,36,0.3)',
      borderRadius:'14px',
      color:'#fbbf24',
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

              {/* ── FOOTER ── */}
              <CustomerFooter />
    </div>
  )
}