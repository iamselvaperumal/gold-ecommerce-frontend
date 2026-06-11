import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import CustomerNavbar from './CustomerNavbar'
import CustomerFooter from '../collection/CustomerFooter'

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

export function getCart() { return [] }
export function saveCart() { }
export function addToCart() { }
export function getCartCount() { return 0 }

export default function CardSection() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])

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

  const totalItems = cart.reduce((acc, i) => acc + (i.qty || 1), 0)
  const totalPrice = cart.reduce((acc, i) => acc + (Number(i.product_price) || 0) * (i.qty || 1), 0)

  return (
<div style={{
  minHeight: '100vh',
  background: '#FDF5EE',
  fontFamily: '"Montserrat", sans-serif',
}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Montserrat:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }

        .cart-item {
          animation: fadeUp 0.5s ease both;
          background: #fff;
          border: 1px solid #E8E0D5;
          border-radius: 2px;
          display: flex;
          align-items: stretch;
          overflow: hidden;
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .cart-item:hover {
          box-shadow: 0 8px 40px rgba(139,90,43,0.10);
          border-color: #C9A96E;
        }

        .cart-img {
          width: 130px;
          height: 130px;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
          flex-shrink: 0;
        }

        .cart-item:hover .cart-img {
          transform: scale(1.06);
        }

        .qty-btn {
          width: 32px;
          height: 32px;
          border: 1px solid #D4C5B0;
          background: transparent;
          color: #5C3D1E;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-family: 'Montserrat', sans-serif;
        }

        .qty-btn:hover {
          background: #5C3D1E;
          color: #fff;
          border-color: #5C3D1E;
        }

        .remove-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #B8A99A;
          font-size: 11px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 4px 0;
          transition: color 0.2s;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .remove-btn:hover { color: #8B1A1A; }

        .primary-btn {
          background: #1C1410;
          color: #C9A96E;
          border: none;
          padding: 16px 40px;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primary-btn:hover {
          background: #C9A96E;
          color: #1C1410;
        }

        .secondary-btn {
          background: transparent;
          color: #1C1410;
          border: 1px solid #1C1410;
          padding: 15px 32px;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .secondary-btn:hover {
          background: #1C1410;
          color: #fff;
        }

        .gold-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #C9A96E, transparent);
          margin: 0;
          border: none;
        }
      `}</style>

      <CustomerNavbar />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px' }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: 56, animation: 'fadeUp 0.4s ease both' }}>
          <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#C9A96E',
            marginBottom: 12,
          }}>
            Bharathi Jewellers
          </div>
          <h1 style={{
            margin: 0,
            fontSize: 48,
            fontWeight: 600,
            color: '#1C1410',
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
            fontStyle: 'italic',
          }}>
            My Cart
          </h1>
          <div style={{
            marginTop: 10,
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 13,
            color: '#8B7355',
            fontWeight: 400,
          }}>
            {totalItems} {totalItems === 1 ? 'piece' : 'pieces'} selected
          </div>
          <hr className="gold-divider" style={{ marginTop: 28 }} />
        </div>

        {/* ── EMPTY STATE ── */}
        {cart.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 0', animation: 'fadeUp 0.5s ease both' }}>
            <div style={{ fontSize: 56, marginBottom: 20, opacity: 0.3 }}>◇</div>
            <div style={{
              fontSize: 30,
              fontWeight: 500,
              color: '#1C1410',
              marginBottom: 12,
              fontStyle: 'italic',
            }}>
              Your cart is empty
            </div>
            <div style={{
              fontFamily: 'Montserrat, sans-serif',
              color: '#8B7355',
              fontSize: 13,
              marginBottom: 40,
              lineHeight: 1.8,
            }}>
              Discover our curated collection of<br />handcrafted fine jewellery
            </div>
            <button className="primary-btn" onClick={() => navigate('/collection/all')}>
              Explore Collections
            </button>
          </div>
        )}

        {/* ── CART ITEMS ── */}
        {cart.length > 0 && (
          <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Left — Items List */}
            <div style={{ flex: '1 1 580px', display: 'flex', flexDirection: 'column', gap: 1 }}>

              {/* Column headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '130px 1fr 120px 100px',
                gap: 0,
                padding: '0 0 12px 0',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: 2.5,
                textTransform: 'uppercase',
                color: '#B8A99A',
              }}>
                <span></span>
                <span style={{ paddingLeft: 20 }}>Product</span>
                <span style={{ textAlign: 'center' }}>Quantity</span>
                <span style={{ textAlign: 'right', paddingRight: 20 }}>Price</span>
              </div>

              <hr className="gold-divider" style={{ marginBottom: 1 }} />

              {cart.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="cart-item"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  {/* Image */}
                  <div style={{ width: 130, height: 130, overflow: 'hidden', flexShrink: 0, background: '#F5F0EA' }}>
                    {item.product_image
                      ? <img
                          className="cart-img"
                          src={item.product_image}
                          alt={item.product_name}
                          onError={e => { e.currentTarget.style.display = 'none' }}
                        />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#C9A96E', opacity: 0.4 }}>◈</div>
                    }
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, padding: '20px 20px', display: 'flex', alignItems: 'center', gap: 0 }}>

                    {/* Name + meta */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: '#1C1410',
                        marginBottom: 6,
                        lineHeight: 1.2,
                      }}>
                        {item.product_name}
                      </div>
                      <div style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: 10,
                        color: '#8B7355',
                        fontWeight: 500,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        marginBottom: 14,
                      }}>
                        {item.product_metal && `${item.product_metal}`}
                        {item.product_category && ` · ${item.product_category}`}
                      </div>
                      <button className="remove-btn" onClick={() => removeItem(item.product)}>
                        Remove
                      </button>
                    </div>

                    {/* Qty */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 120, justifyContent: 'center' }}>
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.product, -1, item.qty || 1)}>−</button>
                      <div style={{
                        width: 44,
                        textAlign: 'center',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#1C1410',
                        border: '1px solid #D4C5B0',
                        borderLeft: 'none',
                        borderRight: 'none',
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {item.qty || 1}
                      </div>
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.product, 1, item.qty || 1)}>+</button>
                    </div>

                    {/* Price */}
                    <div style={{ width: 100, textAlign: 'right', paddingRight: 4 }}>
                      {Number(item.product_price) > 0 ? (
                        <>
                          <div style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: '#1C1410',
                            fontFamily: 'Montserrat, sans-serif',
                          }}>
                            ₹{(Number(item.product_price) * (item.qty || 1)).toLocaleString('en-IN')}
                          </div>
                          {(item.qty || 1) > 1 && (
                            <div style={{ fontSize: 11, color: '#B8A99A', fontFamily: 'Montserrat, sans-serif', marginTop: 2 }}>
                              ₹{Number(item.product_price).toLocaleString('en-IN')} each
                            </div>
                          )}
                        </>
                      ) : (
                        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#B8A99A', fontStyle: 'italic' }}>
                          On Request
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <hr className="gold-divider" style={{ marginTop: 1 }} />

              {/* Clear all */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                <button className="secondary-btn" onClick={() => navigate('/collection/all')}>
                  ← Continue Shopping
                </button>
                <button
                  onClick={clearCart}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    color: '#B8A99A',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Right — Order Summary */}
            <div style={{
              flex: '0 0 300px',
              background: '#1C1410',
              padding: '36px 32px',
              animation: 'fadeUp 0.5s ease 0.2s both',
            }}>
              <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: '#C9A96E',
                marginBottom: 24,
              }}>
                Order Summary
              </div>

              {/* Line items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{
                      flex: 1,
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: 15,
                      color: '#D4C5B0',
                      lineHeight: 1.3,
                    }}>
                      {item.product_name}
                      {(item.qty || 1) > 1 && (
                        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, color: '#8B7355', marginLeft: 6 }}>
                          ×{item.qty || 1}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#D4C5B0',
                      whiteSpace: 'nowrap',
                    }}>
                      {Number(item.product_price) > 0
                        ? `₹${(Number(item.product_price) * (item.qty || 1)).toLocaleString('en-IN')}`
                        : '—'
                      }
                    </div>
                  </div>
                ))}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #3A2E26', marginBottom: 20 }} />

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
                <div style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: '#8B7355',
                }}>
                  Total
                </div>
                <div style={{
                  fontSize: 26,
                  fontWeight: 600,
                  color: '#C9A96E',
                  fontFamily: 'Cormorant Garamond, serif',
                }}>
                  {totalPrice > 0 ? `₹${totalPrice.toLocaleString('en-IN')}` : '—'}
                </div>
              </div>

              <button
                className="primary-btn"
                style={{ width: '100%', padding: '18px', fontSize: 10, letterSpacing: 3 }}
                onClick={() => navigate('/customer')}
              >
                Place Order →
              </button>

              <div style={{
                marginTop: 20,
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 10,
                color: '#5C4A3A',
                textAlign: 'center',
                lineHeight: 1.8,
              }}>
                BIS Hallmarked · Free Insured Shipping<br />
                15-Day Easy Returns
              </div>
            </div>
          </div>
        )}
      </div>

              {/* ── FOOTER ── */}
        <CustomerFooter />
    </div>
  )
}