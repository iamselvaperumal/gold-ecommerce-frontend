import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/logo.png'
import CustomerNavbar from './CustomerNavbar'

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
      <div style={{ textAlign: 'center', padding: '40px 20px 24px' }}>
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
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 32px 60px' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, animation: 'fadeIn 0.4s ease' }}>
            {products.map(p => {
              const firstImg = p.images?.[0] ? getImageUrl(p.images[0]) : null
              const price = parseFloat(p.price) || 0
              return (
                <div key={p.id}
                  onClick={() => navigate(`/product-display?category=${p.category}&metal=${p.metal}&id=${p.id}`)}
                  style={{ background: '#fff', border: '1px solid #e8ddd5', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 2px 8px rgba(139,26,26,0.06)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(139,26,26,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(139,26,26,0.06)' }}
                >
                  {/* Image */}
                  <div style={{ height: 200, background: '#f5f0e8', position: 'relative', overflow: 'hidden' }}>
                    {firstImg
                      ? <img src={firstImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => e.currentTarget.style.display = 'none'} />
                      : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 44 }}>{CATEGORY_ICONS[p.category] || '💍'}</div>
                    }
                    {p.tag && (
                      <div style={{ position: 'absolute', top: 10, left: 10, background: '#8B1A1A', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 800 }}>
                        {p.tag}
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: 10, right: 10, background: p.metal === 'gold' ? 'rgba(251,191,36,0.9)' : 'rgba(192,192,192,0.9)', color: '#000', borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 800 }}>
                      {p.metal === 'gold' ? '🥇' : '🥈'} {p.grade?.toUpperCase()}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, color: '#7c5c4a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                      {CATEGORY_ICONS[p.category]} {p.category}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a0a0a', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 900, color: p.metal === 'gold' ? '#b8860b' : '#9ca3af', fontFamily: 'monospace' }}>
                        {price > 0 ? `₹${price.toLocaleString('en-IN')}` : '—'}
                      </div>
                      <div style={{ fontSize: 11, color: '#7c5c4a' }}>
                        {p.net_weight ? `${p.net_weight}g` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}