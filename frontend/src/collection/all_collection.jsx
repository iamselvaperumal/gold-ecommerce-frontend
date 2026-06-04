import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/logo.png'
import CustomerNavbar from './CustomerNavbar'


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
  style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
>
      <div style={{ height: 280, background: '#f0f0f0', position: 'relative', overflow: 'hidden' }}>

        {p.tag && (
          <div style={{ position: 'absolute', top: 12, left: 0, background: '#2ecc71', color: '#fff', padding: '5px 12px 5px 10px', fontSize: 11, fontWeight: 700, clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)', zIndex: 2 }}>
            {p.tag}
          </div>
        )}

        <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 10, right: 10, fontSize: 20, cursor: 'pointer', zIndex: 2 }}>🤍</div>

{images.length > 0
  ? <img 
      src={images[displayIndex]}  // ← இங்க மாத்து
      alt={p.name} 
      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }} 
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
        <div style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 600 }}>{p.name}</div>
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
  const weddingCategoryFilter = searchParams.get('wedding_category')

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
  let url = `${API_BASE}/api/jewelry-products/`
  const params = []
  if (metalFilter) params.push(`metal=${metalFilter}`)
  if (genderFilter) params.push(`gender=${genderFilter}`)
  if (occasionFilter) params.push(`occasion=${occasionFilter}`)
  if (weddingCategoryFilter) params.push(`wedding_category=${encodeURIComponent(weddingCategoryFilter)}`)
  if (params.length) url += `?${params.join('&')}`

  const res = await fetch(url)
  const data = await res.json()
  let list = Array.isArray(data) ? data : []

  // Metal filter — frontend la also apply
  if (metalFilter) {
    list = list.filter(p => p.metal?.toLowerCase() === metalFilter.toLowerCase())
  }

  // Price filter — frontend la apply
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
  }, [priceFilter, metalFilter, genderFilter, occasionFilter, weddingCategoryFilter])

  return (
    <div style={{ minHeight: '100vh', background: '#FDF5EE', fontFamily: '"Inter",system-ui,sans-serif' }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

<CustomerNavbar />

      {/* HEADER */}
      <div style={{ textAlign: 'center', padding: '40px 16px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#8B1A1A', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
          {metalFilter ? `${metalFilter.toUpperCase()} JEWELLERY` : 'ALL JEWELLERY'}
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#1a0a0a', marginBottom: 6 }}>
          {priceFilter ? PRICE_LABELS[priceFilter] : 'All Products'}
        </div>
        <div style={{ fontSize: 14, color: '#7c5c4a' }}>
          {loading ? 'Loading...' : `${products.length} products found`}
        </div>

        {/* Filter badges */}
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          {priceFilter && (
            <span style={{ background: '#fce8e8', color: '#8B1A1A', border: '1px solid #f3a0a0', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700 }}>
              💰 {PRICE_LABELS[priceFilter]}
            </span>
          )}

          {genderFilter && (
  <span style={{ background: 'rgba(139,26,26,0.1)', color: '#8B1A1A', border: '1px solid #8B1A1A', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700 }}>
    👤 {genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1)}
  </span>
)}
          {metalFilter && (
            <span style={{ background: metalFilter === 'gold' ? 'rgba(251,191,36,0.15)' : 'rgba(192,192,192,0.15)', color: metalFilter === 'gold' ? '#b8860b' : '#9ca3af', border: `1px solid ${metalFilter === 'gold' ? '#fbbf24' : '#c0c0c0'}`, borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700 }}>
              {metalFilter === 'gold' ? '🥇' : '🥈'} {metalFilter.toUpperCase()}
            </span>
          )}
          <button onClick={() => navigate('/collection/all')}
            style={{ background: 'transparent', color: '#8B1A1A', border: '1px solid #8B1A1A', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            ✕ Clear filters
          </button>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 16px 60px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #f3d5d5', borderTop: '3px solid #8B1A1A', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <div style={{ color: '#7c5c4a', fontSize: 15 }}>Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
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
  {products.map(p => (
    <ProductCard key={p.id} p={p} navigate={navigate} />
  ))}
</div>
         
        )}
      </div>
    </div>
  )
}