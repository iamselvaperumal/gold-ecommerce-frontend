import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

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
      <div style={{ background: '#fff', borderBottom: '0.5px solid #e5e7eb', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ color: '#8B1A1A', fontWeight: 800, fontSize: '24px', letterSpacing: '3px' }}>BitByte Jewels</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ padding: '8px 18px', background: 'rgba(139,26,26,0.08)', border: '1px solid rgba(139,26,26,0.25)', color: '#8B1A1A', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>← Back</button>
          <button onClick={() => navigate('/customer')} style={{ padding: '8px 18px', background: '#8B1A1A', border: 'none', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Dashboard</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px' }}>

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {items.map(item => (
              <div key={item.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e8ddd5',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(139,26,26,0.06)',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(139,26,26,0.14)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(139,26,26,0.06)' }}
                onClick={() => navigate(`/product-display?category=${item.product_category}&id=${item.product_id}`)}
              >
                {/* Image */}
                <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={item.product_image || '/img/gold/gold-bangles-1.png'}
                    alt={item.product_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  {/* Remove heart button */}
                  <button
                    onClick={e => { e.stopPropagation(); removeFromWishlist(item.product_id) }}
                    style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 34, height: 34, borderRadius: '50%',
                      border: '1.5px solid #e11d48',
                      background: 'rgba(225,29,72,0.15)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', fontSize: 16, transition: 'all 0.2s ease',
                      zIndex: 5,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(225,29,72,0.35)'; e.currentTarget.style.transform = 'scale(1.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(225,29,72,0.15)'; e.currentTarget.style.transform = 'scale(1)' }}
                    title="Remove from wishlist"
                  >
                    ❤️
                  </button>
                </div>

                {/* Info */}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1a0a0a', marginBottom: 4 }}>{item.product_name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 12, color: '#7c5c4a', textTransform: 'capitalize' }}>{item.product_metal} · {item.product_category}</div>
                    {item.product_price && (
                      <div style={{ color: '#b8860b', fontWeight: 800, fontSize: 13, fontFamily: 'monospace' }}>
                        ₹{Number(item.product_price).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>

                {/* View button */}
                <div style={{ padding: '0 16px 14px' }}>
                  <div style={{ width: '100%', padding: '8px', background: 'linear-gradient(90deg,#8B1A1A,#b91c1c)', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 12, textAlign: 'center' }}>
                    View Product →
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