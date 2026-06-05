import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import CustomerNavbar from './CustomerNavbar'

const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

export default function WishlistPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist/')
      setItems(res.data.items)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchWishlist() }, [])

  const removeFromWishlist = async (productId) => {
    try {
      await api.post('/wishlist/', { product_id: productId })
      setItems(prev => prev.filter(i => i.product_id !== productId))
      window.dispatchEvent(new Event('bb_wishlist_update'))
    } catch {}
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDF5EE', fontFamily: '"Inter",system-ui,sans-serif' }}>

      {/* Navbar */}
     <CustomerNavbar />

      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '40px' }}>

        {/* Heading */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#1a0a0a', display: 'flex', alignItems: 'center', gap: 10 }}>
            ❤️ My Wishlist
          </div>
          <div style={{ color: '#7c5c4a', fontSize: 14, marginTop: 6 }}>
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#7c5c4a', padding: '80px 0', fontSize: 16 }}>⏳ Loading...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🤍</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1a0a0a', marginBottom: 8 }}>Your wishlist is empty</div>
            <div style={{ color: '#7c5c4a', marginBottom: 24 }}>Browse our collections and heart the ones you love</div>
            <button onClick={() => navigate('/collection/all')} style={{ padding: '12px 28px', background: '#8B1A1A', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Browse Collections
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {items.map(item => (
<div key={item.id}
  style={{
    background: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    position: 'relative',
  }}
  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; e.currentTarget.querySelector('img').style.transform = 'scale(1.08)' }}
  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; e.currentTarget.querySelector('img').style.transform = 'scale(1)' }}
  onClick={() => navigate(`/product-display?category=${item.product_category}&id=${item.product_id}`)}
>
               {/* Image */}
<div style={{ height: 280, background: '#f0f0f0', overflow: 'hidden', position: 'relative' }}>
  <img
    src={item.product_image || '/img/gold/gold-bangles-1.png'}
    alt={item.product_name}
    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
    onError={e => e.currentTarget.style.display = 'none'}
  />
  {/* Tag ribbon */}
  {item.product_metal && (
    <div style={{ position: 'absolute', top: 12, left: 0, background: '#2ecc71', color: '#fff', padding: '5px 12px 5px 10px', fontSize: 11, fontWeight: 700, clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)', zIndex: 2 }}>
      {item.product_metal.toUpperCase()}
    </div>
  )}
  {/* Remove heart button */}
  <button
    onClick={e => { e.stopPropagation(); removeFromWishlist(item.product_id) }}
    style={{
      position: 'absolute', top: 10, right: 10,
      width: 30, height: 30, borderRadius: '50%',
      border: '1.5px solid #e11d48',
      background: 'rgba(225,29,72,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: 14, transition: 'all 0.2s ease',
      zIndex: 5,
    }}
    title="Remove from wishlist"
  >
    ❤️
  </button>
  <div style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 16, color: '#999', zIndex: 2 }}>🔗</div>
</div>

{/* Info */}
<div style={{ padding: '12px 14px' }}>
  {item.product_price && (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <span style={{ fontSize: 15, fontWeight: 800, color: '#1a1a1a' }}>
        ₹{Number(item.product_price).toLocaleString('en-IN')}
      </span>
    </div>
  )}
  <div style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 600 }}>{item.product_name}</div>
  <div style={{ fontSize: 11, color: '#7c5c4a', marginTop: 3, textTransform: 'capitalize' }}>
    {item.product_metal} · {item.product_category}
  </div>
</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}