import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/logo.png'
import CustomerNavbar from './CustomerNavbar'
import CustomerFooter from '../collection/CustomerFooter'


function ProductCard({ p, navigate }) {
  const images = p.images?.map(img => getImageUrl(img)).filter(Boolean) || []
  const [imgIndex, setImgIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const price = parseFloat(p.price) || 0
  const discountPct = parseFloat(p.wastage_charge) || 0
  const originalAmt = parseFloat(p.original_price) || 0
  const hasDiscount = discountPct > 0 && originalAmt > price && price > 0
  const displayIndex = hovered && images.length > 1 ? 1 : imgIndex

  return (
<div
  onClick={() => navigate(`/product-display?category=${p.category}&metal=${p.metal}&id=${p.id}`)}
  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; setHovered(true) }}
  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; setHovered(false) }}
  style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s ease', marginBottom: '75px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
>
      <div style={{ height: 280, background: '#f0f0f0', position: 'relative', overflow: 'hidden' }}>

        {p.tag && (
          <div style={{ position: 'absolute', top: 12, left: 0, background: '#2ecc71', color: '#fff', padding: '5px 12px 5px 10px', fontSize: 11, fontWeight: 700, clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)', zIndex: 2 }}>
            {p.tag}
          </div>
        )}

        <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 10, right: 10, fontSize: 20, cursor: 'pointer', zIndex: 2 }}>🤍</div>

{images.length > 0
  ? 
  <img 
  key={displayIndex}
  src={images[displayIndex]}
  alt={p.name} 
  style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'fadeImg 0.5s ease' }} 
  onError={e => e.currentTarget.style.display = 'none'} 
/>
  : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 44 }}>💍</div>
}

        {/* {images.length > 1 && (
          <button onClick={e => { e.stopPropagation(); setImgIndex(i => (i - 1 + images.length) % images.length) }}
            style={{ position: 'absolute', left: 2, top: '50%', transform: 'translateY(-50%)', border: 'none', borderRadius: '50%', width: 48, height: 48, fontSize: 38, cursor: 'pointer', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ‹
          </button>
        )}

        {images.length > 1 && (
          <button onClick={e => { e.stopPropagation(); setImgIndex(i => (i + 1) % images.length) }}
            style={{ position: 'absolute', right: 2, top: '50%', transform: 'translateY(-50%)', border: 'none', borderRadius: '50%', width: 48, height: 48, fontSize: 38, cursor: 'pointer', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ›
          </button>
        )} */}

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
    fontFamily: '"Cormorant Garamond", Georgia, serif' }}>{p.name}
  </div>
</div>
    </div>
  )
}

const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

const getImageUrl = img => {
  if (!img) return null
  let p = typeof img === 'object' ? (img.image || img.url || '') : img
  if (!p) return null
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  return `${API_BASE}/${p.replace(/^\/+/, '')}`
}

const CATEGORY_ICONS = {
  rings: '💍', earrings: '✨', bangles: '⭕',
  chains: '⛓️', necklaces: '📿', coins: '🪙'
}

const PRICE_LABELS = {
  'below25k': '< ₹25K',
  '25k-50k': '₹25K – ₹50K',
  '50k-1L': '₹50K – ₹1L',
  'above1L': '₹1L & Above',
}

export default function AllCollection() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const priceFilter = searchParams.get('price')
  const metalFilter = searchParams.get('metal')
  const genderFilter = searchParams.get('gender')
  const occasionFilter = searchParams.get('occasion')
  const searchFilter = searchParams.get('search') 
  const weddingCategoryFilter = searchParams.get('wedding_category')
  const isWedding = searchParams.get('wedding') === 'true'
  const isDailywear = searchParams.get('dailywear') === 'true'

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [weddingTab, setWeddingTab] = useState('all')

  // Diamond la coins vendam — filter out
const displayProducts = (() => {
  let list = isWedding && weddingTab !== 'all'
    ? products.filter(p => p.wedding_category === weddingTab)
    : products

  // Diamond click panna coins hide pannu
  if (metalFilter === 'diamond') {
    list = list.filter(p => p.category !== 'coins')
  }

  // Dailywear la coins vendam
  if (isDailywear) {
    list = list.filter(p => p.category !== 'coins')
  }

  return list
})()

useEffect(() => {
  setWeddingTab('all')
  const fetchAll = async () => {
    setLoading(true)
    try {

      // ── DAILYWEAR: Office Wear + Modern Wear + Casual Wear ──
      if (isDailywear) {
        const dailywearOccasions = ['Office Wear', 'Modern Wear', 'Casual Wear']
        const results = await Promise.all(
          dailywearOccasions.map(occ =>
            fetch(`${API_BASE}/api/jewelry-products/?occasion=${encodeURIComponent(occ)}`)
              .then(r => r.json())
              .catch(() => [])
          )
        )
        const merged = []
        const seen = new Set()
        results.flat().forEach(p => {
          if (!seen.has(p.id)) { seen.add(p.id); merged.push(p) }
        })
        setProducts(merged)
        setLoading(false)
        return
      }

      // ── WEDDING: wedding_category base panni fetch ──
      if (isWedding) {
        const weddingCats = [
          'Wedding Ring', 'Wedding Necklaces', 'Wedding Chain',
          'Wedding Bangles', 'Wedding Earring'
        ]
        const results = await Promise.all(
          weddingCats.map(cat =>
            fetch(`${API_BASE}/api/jewelry-products/?wedding_category=${encodeURIComponent(cat)}`)
              .then(r => r.json())
              .catch(() => [])
          )
        )
        const merged = []
        const seen = new Set()
        results.flat().forEach(p => {
          if (!seen.has(p.id)) { seen.add(p.id); merged.push(p) }
        })
        setProducts(merged)
        setLoading(false)
        return
      }

      // ── NORMAL fetch for all other filters ──
      let url = `${API_BASE}/api/jewelry-products/`
      const params = []
      if (metalFilter) params.push(`metal=${metalFilter}`)
      if (genderFilter) params.push(`gender=${genderFilter}`)
      if (occasionFilter) params.push(`occasion=${occasionFilter}`)
      if (weddingCategoryFilter) params.push(`wedding_category=${encodeURIComponent(weddingCategoryFilter)}`)
      if (searchFilter) params.push(`search=${encodeURIComponent(searchFilter)}`)
      if (params.length) url += `?${params.join('&')}`

      const res = await fetch(url)
      const data = await res.json()
      let list = Array.isArray(data) ? data : []

      if (metalFilter) {
        list = list.filter(p => p.metal?.toLowerCase() === metalFilter.toLowerCase())
      }

      if (priceFilter) {
        list = list.filter(p => {
          const price = parseFloat(p.price) || 0
          if (priceFilter === 'below25k')  return price > 0 && price < 25000
          if (priceFilter === '25k-50k')   return price >= 25000 && price < 50000
          if (priceFilter === '50k-1L')    return price >= 50000 && price < 100000
          if (priceFilter === 'above1L')   return price >= 100000
          return true
        })
      }

      setProducts(list)
    } catch {
      setProducts([])
    }
    setLoading(false)
  }
  fetchAll()
}, [priceFilter, metalFilter, genderFilter, occasionFilter, weddingCategoryFilter, isWedding, isDailywear, searchFilter])

  return (
    <div style={{ minHeight: '100vh', background: '#FDF5EE', fontFamily: '"Montserrat", sans-serif' }}>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@400;500;600;700&display=swap');
  @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeImg{from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:scale(1)}}
`}</style>

<CustomerNavbar />

      {/* HEADER */}
<div style={{ textAlign: 'center', padding: '40px 16px 24px' }}>
  <div style={{ fontSize: 13, fontWeight: 700, color: '#8B1A1A', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
    {isWedding ? 'WEDDING COLLECTION' : isDailywear ? 'DAILYWEAR COLLECTION' : searchFilter ? `SEARCH RESULTS` : metalFilter ? `${metalFilter.toUpperCase()} JEWELLERY` : occasionFilter ? `${occasionFilter.toUpperCase()} COLLECTION` : 'ALL JEWELLERY'}
  </div>
<div style={{ fontSize: 28, fontWeight: 800, color: '#1a0a0a', marginBottom: 6, fontFamily: '"Playfair Display", Georgia, serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
  {isWedding ? (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 27s-11-7-11-14a7 7 0 0111-5.7A7 7 0 0127 13c0 7-11 14-11 14z"/>
    </svg>
  ) : isDailywear ? (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4l-5 6h20l-5-6"/><rect x="6" y="10" width="20" height="18" rx="2"/>
      <path d="M16 10v18"/>
    </svg>
  ) : metalFilter === 'diamond' ? (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4l10 8-10 16L6 12z"/><path d="M6 12h20"/>
      <path d="M11 12l5 16"/><path d="M21 12l-5 16"/>
      <path d="M6 12l5-8"/><path d="M26 12l-5-8"/>
    </svg>
  ) : metalFilter === 'gold' ? (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="16,4 19.5,12.5 28,13.5 22,19.5 23.5,28 16,24 8.5,28 10,19.5 4,13.5 12.5,12.5"/>
    </svg>
  ) : metalFilter === 'silver' ? (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="7"/>
      <path d="M16 9v2"/><path d="M16 21v2"/>
      <path d="M9 16h2"/><path d="M21 16h2"/>
    </svg>
  ) : occasionFilter ? (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4l10 8-10 16L6 12z"/><path d="M6 12h20"/>
    </svg>
  ) : priceFilter ? (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="11"/><path d="M16 9v14"/><path d="M11 12h7a3 3 0 010 6h-7"/>
    </svg>
  ) : (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12l10-6 10 6v10l-10 6-10-6z"/>
      <path d="M6 12l10 6 10-6"/><line x1="16" y1="18" x2="16" y2="28"/>
    </svg>
  )}
  {isWedding ? 'Wedding Jewellery'
    : isDailywear ? 'Dailywear Collection'
    : metalFilter === 'diamond' ? 'Diamond Jewellery'
    : metalFilter === 'gold' ? 'Gold Jewellery'
    : metalFilter === 'silver' ? 'Silver Jewellery'
    : occasionFilter ? `${occasionFilter.replace('+', ' ')} Collection`
    : priceFilter ? PRICE_LABELS[priceFilter]
    : 'All Products'}
</div>
  <div style={{ fontSize: 14, color: '#7c5c4a' }}>
    {loading ? 'Loading...' : `${displayProducts.length} products found`}
  </div>

        {/* Filter badges */}
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          {priceFilter && (
  <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#fce8e8', color: '#8B1A1A', border: '1px solid #f3a0a0', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700 }}>
  <svg width="12" height="12" viewBox="0 0 32 32" fill="none" stroke="#8B1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="16" r="11"/><path d="M16 9v14"/><path d="M11 12h7a3 3 0 010 6h-7"/>
  </svg>
  {PRICE_LABELS[priceFilter]}
</span>
          )}

          {genderFilter && (
<span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(139,26,26,0.1)', color: '#8B1A1A', border: '1px solid #8B1A1A', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700 }}>
  <svg width="12" height="12" viewBox="0 0 32 32" fill="none" stroke="#8B1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="10" r="5"/><path d="M4 28c0-6.6 5.4-12 12-12s12 5.4 12 12"/>
  </svg>
  {genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1)}
</span>
)}
          {metalFilter && (
<span style={{ display: 'flex', alignItems: 'center', gap: 5, background: metalFilter === 'gold' ? 'rgba(251,191,36,0.15)' : 'rgba(192,192,192,0.15)', color: metalFilter === 'gold' ? '#b8860b' : '#9ca3af', border: `1px solid ${metalFilter === 'gold' ? '#fbbf24' : '#c0c0c0'}`, borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700 }}>
  <svg width="12" height="12" viewBox="0 0 32 32" fill="none" stroke={metalFilter === 'gold' ? '#b8860b' : '#9ca3af'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {metalFilter === 'gold'
      ? <polygon points="16,4 19.5,12.5 28,13.5 22,19.5 23.5,28 16,24 8.5,28 10,19.5 4,13.5 12.5,12.5"/>
      : <><circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="7"/></>
    }
  </svg>
  {metalFilter.toUpperCase()}
</span>
          )}
          <button onClick={() => navigate('/collection/all')}
            style={{ background: 'transparent', color: '#8B1A1A', border: '1px solid #8B1A1A', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            ✕ Clear filters
          </button>
        </div>
      </div>

 {/* ── WEDDING TABS — only show when occasion=Wedding ── */}
{isWedding && !loading && (
  <div style={{
    background: '#fff',
    borderBottom: '1px solid #e8ddd5',
    padding: '14px 24px',
    display: 'flex', gap: 10,
    overflowX: 'auto', alignItems: 'center',
    justifyContent: 'center', flexWrap: 'wrap'
  }}>
    {[
  { key: 'all', label: 'All Wedding', svg: <svg width="14" height="14" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 27s-11-7-11-14a7 7 0 0111-5.7A7 7 0 0127 13c0 7-11 14-11 14z"/></svg> },
  { key: 'Wedding Ring', label: 'Wedding Ring', svg: <svg width="14" height="14" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="19" r="8"/><circle cx="16" cy="19" r="4.5"/><path d="M13 11l-2-4h10l-2 4"/></svg> },
  { key: 'Wedding Necklaces', label: 'Wedding Necklaces', svg: <svg width="14" height="14" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6c0 10 4 16 10 18 6-2 10-8 10-18"/><circle cx="16" cy="26" r="2.5"/></svg> },
  { key: 'Wedding Chain', label: 'Wedding Chain', svg: <svg width="14" height="14" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="11" y="2" width="10" height="7" rx="3.5"/><rect x="11" y="12" width="10" height="7" rx="3.5"/><rect x="11" y="22" width="10" height="7" rx="3.5"/><line x1="16" y1="9" x2="16" y2="12"/><line x1="16" y1="19" x2="16" y2="22"/></svg> },
  { key: 'Wedding Bangles', label: 'Wedding Bangles', svg: <svg width="14" height="14" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="6.5"/></svg> },
  { key: 'Wedding Earring', label: 'Wedding Earring', svg: <svg width="14" height="14" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="7" r="2.5"/><path d="M11 9.5v4"/><path d="M8.5 13.5h5l-1.2 6-1.3 3-1.3-3-1.2-6z"/><circle cx="21" cy="7" r="2.5"/><path d="M21 9.5v4"/><path d="M18.5 13.5h5l-1.2 6-1.3 3-1.3-3-1.2-6z"/></svg> },
].map(tab => {
      const count = tab.key === 'all'
        ? products.length
        : products.filter(p => p.wedding_category === tab.key).length
      return (
        <button key={tab.key}
          onClick={() => setWeddingTab(tab.key)}
          style={{
            padding: '9px 18px', borderRadius: 20, border: 'none',
            cursor: 'pointer', fontWeight: 700, fontSize: 13,
            whiteSpace: 'nowrap',
            background: weddingTab === tab.key
              ? 'linear-gradient(90deg,#8B1A1A,#b91c1c)'
              : '#f5f0e8',
            color: weddingTab === tab.key ? '#fff' : '#7c5c4a',
            transition: 'all 0.2s',
            boxShadow: weddingTab === tab.key ? '0 4px 12px rgba(139,26,26,0.3)' : 'none'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
  {tab.svg} {tab.label}
</span>
          <span style={{
            marginLeft: 6, fontSize: 10, fontWeight: 800,
            background: weddingTab === tab.key ? 'rgba(255,255,255,0.25)' : 'rgba(139,26,26,0.1)',
            color: weddingTab === tab.key ? '#fff' : '#8B1A1A',
            borderRadius: 20, padding: '1px 7px'
          }}>{count}</span>
        </button>
      )
    })}
  </div>
)}

{/* PRODUCTS GRID */}
<div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 16px 60px' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #f3d5d5', borderTop: '3px solid #8B1A1A', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <div style={{ color: '#7c5c4a', fontSize: 15 }}>Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ marginBottom: 16 }}>
  <svg width="52" height="52" viewBox="0 0 32 32" fill="none" stroke="#8B1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
    <circle cx="14" cy="14" r="9"/><path d="M21 21l7 7"/>
  </svg>
</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a0a0a', marginBottom: 8 }}>No products found</div>
            <div style={{ fontSize: 14, color: '#7c5c4a', marginBottom: 24 }}>
              {priceFilter ? `${PRICE_LABELS[priceFilter]} range la products illai` : 'No products available'}
            </div>
            <button onClick={() => navigate('/customer')}
              style={{ padding: '12px 28px', background: '#8B1A1A', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
              ← Go Back
            </button>
          </div>
        ) : (
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20, animation: 'fadeIn 0.4s ease' }}>
{displayProducts.map(p => (
  <ProductCard key={p.id} p={p} navigate={navigate} />
))}
</div>
         
        )}
      </div>

        {/* ── FOOTER ── */}
        <CustomerFooter />
    </div>
  )


}