import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { addToCart } from '../collection/card_section'
import CustomerNavbar from '../collection/CustomerNavbar'

const WEIGHTS = [
  { label: 'All Weights', grams: null },
  { label: '50 mg', grams: 0.05 },
  { label: '100 mg', grams: 0.1 },
  { label: '150 mg', grams: 0.15 },
  { label: '200 mg', grams: 0.2 },
  { label: '500 mg', grams: 0.5 },
  { label: '1 gm', grams: 1 },
  { label: '2 gm', grams: 2 },
  { label: '4 gm', grams: 4 },
  { label: '8 gm', grams: 8 },
]



const TAG_COLORS = {
  Bestseller: { bg: 'rgba(52,211,153,0.2)', border: 'rgba(52,211,153,0.5)', color: '#34d399' },
  Premium: { bg: 'rgba(251,191,36,0.22)', border: 'rgba(251,191,36,0.55)', color: '#fbbf24' },
  Minimal: { bg: 'rgba(34,211,238,0.2)', border: 'rgba(34,211,238,0.5)', color: '#22d3ee' },
  Statement: { bg: 'rgba(167,139,250,0.2)', border: 'rgba(167,139,250,0.5)', color: '#a78bfa' },
  New: { bg: 'rgba(244,114,182,0.2)', border: 'rgba(244,114,182,0.5)', color: '#f472b6' },
  Bridal: { bg: 'rgba(239,68,68,0.2)', border: 'rgba(239,68,68,0.5)', color: '#f87171' },
}

export default function GoldNecklaces() {
  const navigate = useNavigate()
  const [selectedWeight, setSelectedWeight] = useState('All Weights')
  const [hoveredItem, setHoveredItem] = useState(null)
  const [goldPrice, setGoldPrice] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [goldNecklaces, setGoldNecklaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlistedIds, setWishlistedIds] = useState(new Set())

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
  if (!img) return '/img/gold/gold-necklace-1.png'
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return `${API_BASE}/${img.replace(/^\/+/, '')}`
}

useEffect(() => {
  import('../api').then(({ default: api }) => {
    api.get('/jewelry-products/?category=necklaces&metal=gold')
      .then(res => {
        setGoldNecklaces(res.data)
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

  const selectedW = WEIGHTS.find(w => w.label === selectedWeight)
  const unitPrice = selectedW?.grams && goldPrice ? selectedW.grams * goldPrice : null
  const tagStyle = tag => TAG_COLORS[tag] || { bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.2)', color: '#fff' }

return (
  <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: '"Inter",system-ui,sans-serif', position: 'relative', overflow: 'hidden' }}>
    <style>{`
      @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      @keyframes goldShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(251,191,36,0.1)} 50%{box-shadow:0 0 40px rgba(251,191,36,0.35)} }
      @keyframes shine { 0%{left:-80%} 100%{left:120%} }
      .gn-card { animation: fadeInUp 0.5s ease both; }
      .gn-img-wrap { overflow:hidden; }
      .gn-img-wrap img { transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1); }
      .gn-card:hover .gn-img-wrap img { transform:scale(1.12) translateY(-4px) !important; }
      .gn-shine { position:absolute; top:0; left:-80%; width:40%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent); transform:skewX(-20deg); opacity:0; transition:opacity 0.3s; }
      .gn-card:hover .gn-shine { opacity:1; animation:shine 0.6s ease; }
    `}</style>
    <CustomerNavbar />

      <div style={{ position: 'relative', zIndex: 10, padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', animation: 'fadeInUp 0.4s ease both' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '20px', padding: '5px 14px', marginBottom: '14px' }}>
              <span className="sparkle-dot" style={{ color: goldColor, fontSize: '11px' }}>✦</span>
              <span style={{ color: goldColor, fontSize: '10px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Premium Gold Collection</span>
            </div>

            <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              🏅{' '}
              <span style={{ background: 'linear-gradient(90deg,#d97706,#fbbf24,#fde68a,#fbbf24)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'goldShimmer 3s linear infinite' }}>
                Gold Necklaces
              </span>
            </h1>

            <p style={{ color: subtext, fontSize: '13px', margin: '8px 0 0', fontWeight: 500 }}>7 exclusive designs · Handcrafted Gold 22K</p>
          </div>

          {goldPrice && (
            <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '10px', padding: '12px 20px', textAlign: 'right' }}>
              <div style={{ color: subtext, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Rate Gold 22K</div>
              <div style={{ color: goldColor, fontWeight: 900, fontSize: '18px', fontFamily: 'monospace' }}>₹{goldPrice.toFixed(2)}/gm</div>
            </div>
          )}
        </div>

     

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {loading ? (
  <div style={{ gridColumn:'span 3', textAlign:'center', color:subtext, padding:'60px 0' }}>
    ⏳ Loading...
  </div>
) : goldNecklaces.length === 0 ? (
  <div style={{ gridColumn:'span 3', textAlign:'center', color:subtext, padding:'60px 0' }}>
    No gold necklaces yet.
  </div>
) : goldNecklaces.map((item) => {
            const isHovered = hoveredItem === item.id
            const tag = tagStyle(item.tag)

            return (
            <div
  key={item.id}
  className="gn-card"
  onClick={() =>
    navigate(`/product-display?category=necklaces&metal=gold&id=${item.id}`)
  }
  onMouseEnter={() => setHoveredItem(item.id)}
  onMouseLeave={() => setHoveredItem(null)}
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  border: `1px solid ${isHovered ? 'rgba(251,191,36,0.55)' : 'rgba(251,191,36,0.18)'}`,
                  background: isHovered ? 'rgba(251,191,36,0.07)' : cardBg,
                  transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: isHovered ? '0 20px 50px rgba(251,191,36,0.22), 0 0 0 1px rgba(251,191,36,0.1)' : 'none',
                  transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              >
                <div className="gn-shine" />

                <div className="gn-img-wrap" style={{ position: 'relative', height: '190px', background: 'rgba(0,0,0,0.04)' }}>
<img
  src={getImageUrl(item.images?.[0]?.image)}
  alt={item.name}
  onError={(e) => { e.currentTarget.src = '/img/gold/gold-necklace-1.png' }}
  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
/>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.8) 0%, transparent 60%)' }} />

                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: tag.bg, border: `1px solid ${tag.border}`, borderRadius: '16px', padding: '3px 10px', color: tag.color, fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(8px)' }}>
                    {item.tag}
                  </div>

                  <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10 }}>
                    <button onClick={e => toggleWishlist(e, item.id)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: wishlistedIds.has(item.id) ? '1.5px solid #e11d48' : '1.5px solid rgba(255,255,255,0.35)', background: wishlistedIds.has(item.id) ? 'rgba(225,29,72,0.18)' : 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s ease' }}>
                      {wishlistedIds.has(item.id) ? '❤️' : '🤍'}
                    </button>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: goldColor, fontSize: '10px', fontWeight: 900 }}>
                      {item.id}
                    </div>
                  </div>

                  {isHovered && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid rgba(251,191,36,0.6)', animation: 'glow-pulse 1.5s ease infinite' }} />
                    </div>
                  )}
                </div>

                <div style={{ padding: '14px 14px' }}>
                  <div style={{ color: isHovered ? goldColor : text, fontWeight: 800, fontSize: '12px', marginBottom: '4px', transition: 'color 0.3s' }}>{item.name}</div>
                  <div style={{ color: subtext, fontSize: '10px', lineHeight: '1.5', marginBottom: '10px' }}>{item.description}</div>


                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedItem && (
        <div onClick={() => setSelectedItem(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(14px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#f8fafc', border: '1px solid rgba(251,191,36,0.35)', borderRadius: '28px', width: '95%', maxWidth: '560px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', animation: 'fadeInUp 0.3s ease' }}>
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
<img
  src={getImageUrl(selectedItem.images?.[0]?.image)}
  alt={selectedItem.name}
  onError={(e) => { e.currentTarget.src = '/img/gold/gold-necklace-1.png' }}
  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
/>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(2,6,23,0.9) 0%,transparent 60%)' }} />

              <button onClick={() => setSelectedItem(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', borderRadius: '10px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px', backdropFilter: 'blur(8px)' }}>
                ✕ Close
              </button>

              <div style={{ position: 'absolute', top: '16px', left: '16px', background: tagStyle(selectedItem.tag).bg, border: `1px solid ${tagStyle(selectedItem.tag).border}`, borderRadius: '20px', padding: '5px 14px', color: tagStyle(selectedItem.tag).color, fontSize: '11px', fontWeight: 800, backdropFilter: 'blur(8px)' }}>
                {selectedItem.tag}
              </div>
            </div>

            <div style={{ padding: '28px 32px' }}>
              <div style={{ color: goldColor, fontWeight: 900, fontSize: '24px', marginBottom: '6px' }}>{selectedItem.name}</div>
              <div style={{ color: subtext, fontSize: '13px', lineHeight: '1.6', marginBottom: '24px' }}>{selectedItem.description}</div>



          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
  <button
    onClick={() => {
      addToCart({
        id: selectedItem.id,
        name: selectedItem.name,
       desc: selectedItem.description,
  img: getImageUrl(selectedItem.images?.[0]?.image),
        tag: selectedItem.tag,
        metal: 'gold_22k',
        metalLabel: 'Gold 22K',
        ringType: 'Gold Necklace',
      })

      setSelectedItem(null)
      navigate('/cart')
    }}
    style={{
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(90deg,#f59e0b,#fbbf24)',
      border: 'none',
      borderRadius: '14px',
      color: '#000',
      fontWeight: 900,
      fontSize: '14px',
      cursor: 'pointer',
    }}
  >
    🛒 Add to Cart
  </button>

  <button
    onClick={() => {
      setSelectedItem(null)
      navigate('/customer')
    }}
    style={{
      width: '100%',
      padding: '12px',
      background: 'rgba(251,191,36,0.08)',
      border: '1px solid rgba(251,191,36,0.3)',
      borderRadius: '14px',
      color: '#fbbf24',
      fontWeight: 700,
      fontSize: '13px',
      cursor: 'pointer',
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