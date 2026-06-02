import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import api from '../api'
import CustomerNavbar from './CustomerNavbar'

export async function getCartFromDB() {
  try {
    const res = await api.get('/cart/')
    return Array.isArray(res.data) ? res.data : []
  } catch {
    return []
  }
}

export async function addToCartDB(productId, qty = 1) {
  try {
    const res = await api.post('/cart/', { product_id: productId, qty })
    window.dispatchEvent(new Event('bb_cart_update'))
    return res.data
  } catch (err) {
    console.error('Add to cart failed:', err)
    return null
  }
}

export async function removeFromCartDB(productId) {
  try {
    await api.delete('/cart/', { data: { product_id: productId } })
    window.dispatchEvent(new Event('bb_cart_update'))
  } catch (err) {
    console.error('Remove failed:', err)
  }
}

export async function updateQtyDB(cartItemId, qty) {
  try {
    const res = await api.patch(`/cart/${cartItemId}/qty/`, { qty })
    window.dispatchEvent(new Event('bb_cart_update'))
    return res.data
  } catch (err) {
    console.error('Qty update failed:', err)
    return null
  }
}

export async function getCartCountDB() {
  const items = await getCartFromDB()
  return items.reduce((acc, i) => acc + (i.qty || 1), 0)
}

// பழைய functions - error வராம இருக்க வச்சிரு
export function getCart() { return [] }
export function saveCart() { }
export function addToCart() { }
export function getCartCount() { return 0 }


export default function CardSection() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])

const bg = '#FDF5EE'
const text = '#020617'
const subtext = '#64748b'
const border = 'rgba(0,0,0,0.1)'
const cardBg = 'rgba(0,0,0,0.03)'

  const fetchCart = async () => {
    const items = await getCartFromDB()
    setCart(items)
  }

  useEffect(() => {
    fetchCart()
    const handler = () => fetchCart()
    window.addEventListener('bb_cart_update', handler)
    return () => window.removeEventListener('bb_cart_update', handler)
  }, [])

  const removeItem = async (productId) => {
    await removeFromCartDB(productId)
    setCart(prev => prev.filter(i => i.product !== productId))
  }

  const updateQty = async (cartItemId, productId, delta, currentQty) => {
    const newQty = currentQty + delta
    if (newQty < 1) {
      await removeFromCartDB(productId)
      setCart(prev => prev.filter(i => i.id !== cartItemId))
      return
    }
    await updateQtyDB(cartItemId, newQty)
    setCart(prev => prev.map(i =>
      i.id === cartItemId ? { ...i, qty: newQty } : i
    ))
  }

  const clearCart = async () => {
    for (const item of cart) {
      await removeFromCartDB(item.product)
    }
    setCart([])
  }

  const metalColor = (metal) => {
    if (!metal) return '#fbbf24'
    if (metal.includes('22k') || metal.includes('22K')) return '#fbbf24'
    if (metal.includes('24k') || metal.includes('24K')) return '#ffd700'
    if (metal.includes('silver') || metal.includes('Silver')) return '#c0c0c0'
    return '#fbbf24'
  }

  const metalLabel = (item) => item.metalLabel || item.metal || ''

  const totalItems = cart.reduce((acc, i) => acc + (i.qty || 1), 0)

return (
  <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: '"Inter",system-ui,sans-serif', position: 'relative', overflow: 'hidden' }}>
    <style>{`
      @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      .cart-card { animation: fadeInUp 0.4s ease both; transition: all 0.3s ease; }
      .cart-card:hover { transform: translateY(-3px); }
      .remove-btn:hover { background: rgba(239,68,68,0.25) !important; }
      .qty-btn:hover { background: rgba(34,211,238,0.2) !important; }
    `}</style>

    <CustomerNavbar />

      {/* Main */}
      <div style={{ position: 'relative', zIndex: 10, padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>


        <div style={{ animation: 'fadeInUp 0.4s ease both', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '30px', padding: '5px 16px', marginBottom: '12px' }}>
            <span className="sparkle-dot" style={{ color: '#34d399', fontSize: '11px' }}>✦</span>
            <span style={{ color: '#34d399', fontSize: '10px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Cart</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                🛒 <span style={{ background: 'linear-gradient(90deg,#34d399,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>My Cart</span>
              </h1>
              <p style={{ color: subtext, fontSize: '13px', margin: '6px 0 0' }}>
                {totalItems} item{totalItems !== 1 ? 's' : ''} saved
              </p>

              {/* ── TOTAL PRICE ── */}
              {cart.length > 0 && (() => {
                const totalPrice = cart.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.qty || 1), 0)
                return totalPrice > 0 ? (
                  <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '14px', padding: '8px 16px' }}>
                    <span style={{ color: subtext, fontSize: '11px', fontWeight: 600 }}>Total Value</span>
                    <span style={{ color: '#4ade80', fontWeight: 900, fontSize: '18px', fontFamily: 'monospace' }}>
                      ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ) : null
              })()}

              {/* ── CLEAR ALL — left side ── */}
              {cart.length > 0 && (
                <div style={{ marginTop: '14px' }}>
                  <button
                    onClick={clearCart}
                    style={{ padding: '8px 18px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🗑 Clear All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {cart.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', animation: 'fadeInUp 0.5s ease both' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
            <div style={{ color: text, fontWeight: 800, fontSize: '20px', marginBottom: '8px' }}>Your cart is empty</div>
            <div style={{ color: subtext, fontSize: '14px', marginBottom: '28px' }}>Browse our collections and add items you love</div>
            <button
              onClick={() => navigate('/customer')}
              style={{ padding: '12px 32px', background: 'linear-gradient(90deg,#34d399,#22d3ee)', border: 'none', borderRadius: '14px', color: '#003b40', fontWeight: 900, fontSize: '14px', cursor: 'pointer' }}
            >
              💍 Explore Collections
            </button>
          </div>
        )}

        {/* Cart Items */}
        {cart.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {cart.map((item, idx) => {
              const col = metalColor(item.product_metal)
              const delay = idx * 0.07
              return (
                <div
                  key={`${item.id}-${item.metal}-${item.ringType}-${idx}`}
                  className="cart-card"
                  style={{
                    animationDelay: `${delay}s`,
                    background: cardBg,
                    border: `1px solid rgba(${col === '#fbbf24' ? '251,191,36' : col === '#ffd700' ? '255,215,0' : '192,192,192'},0.2)`,
                    borderRadius: '20px',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                  }}
                >
                  {/* Image */}
                  <div style={{ width: '90px', height: '90px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0, border: `1px solid rgba(${col === '#fbbf24' ? '251,191,36' : col === '#ffd700' ? '255,215,0' : '192,192,192'},0.3)` }}>
                    <img src={item.product_image || ''} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ color: col, fontWeight: 800, fontSize: '15px' }}>{item.product_name}</span>
                    </div>
                    <div style={{ color: subtext, fontSize: '11px', marginBottom: '6px', lineHeight: '1.5' }}>
                      {item.product_category} • {item.product_metal}
                    </div>

<div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
  {item.product_metal && (
    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px', background: `rgba(${col === '#fbbf24' ? '251,191,36' : col === '#ffd700' ? '255,215,0' : '192,192,192'},0.1)`, color: col, border: `1px solid ${col}44` }}>
      {item.product_metal}
    </span>
  )}
  {item.product_price > 0 && (
    <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 800 }}>
      ₹{Number(item.product_price).toFixed(2)}
    </span>
  )}
</div>

                  </div>

                  {/* Qty Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.product, -1, item.qty || 1)}
                      style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.25)', color: '#22d3ee', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, transition: 'background 0.2s' }}
                    >−</button>
                    <span style={{ color: text, fontWeight: 800, fontSize: '15px', minWidth: '24px', textAlign: 'center' }}>{item.qty || 1}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.product, 1, item.qty || 1)}
                      style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.25)', color: '#22d3ee', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, transition: 'background 0.2s' }}
                    >+</button>
                  </div>

                  {/* Remove */}
                  <button className="remove-btn" onClick={() => removeItem(item.product)}
                    style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}
                    title="Remove"
                  >✕</button>
                </div>
              )
            })}
          </div>
        )}

        {/* Summary Bar */}
        {cart.length > 0 && (
          <div style={{ marginTop: '28px', background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '20px', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', animation: 'fadeInUp 0.5s ease 0.2s both' }}>
            <div>
              <div style={{ color: subtext, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total Items</div>
              <div style={{ color: '#34d399', fontWeight: 900, fontSize: '22px' }}>{totalItems}</div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => navigate('/customer')}
                style={{ padding: '12px 24px', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                + Add More
              </button>
              <button
                onClick={() => navigate('/customer')}
                style={{ padding: '12px 28px', background: 'linear-gradient(90deg,#34d399,#22d3ee)', border: 'none', borderRadius: '12px', color: '#003b40', fontSize: '13px', fontWeight: 900, cursor: 'pointer' }}
              >
                🛒 Place Order on Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '48px', animation: 'fadeInUp 0.6s ease 0.3s both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', color: subtext, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
            <div style={{ width: '40px', height: '1px', background: `linear-gradient(90deg,transparent,${subtext})` }} />
            BitByte Jewellers • My Cart
            <div style={{ width: '40px', height: '1px', background: `linear-gradient(90deg,${subtext},transparent)` }} />
          </div>
        </div>
      </div>
    </div>
  )
}