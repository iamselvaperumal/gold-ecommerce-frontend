import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/logo.png'
import { addToCartDB } from '../collection/card_section'
import CustomerNavbar from './CustomerNavbar'
import CustomerFooter from '../collection/CustomerFooter'

const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  size: Math.random() * 45 + 10,
  x: Math.random() * 100,
  delay: Math.random() * 8,
  duration: Math.random() * 12 + 15,
  opacity: Math.random() * 0.18 + 0.04,
}))

const CATEGORY_LABELS = {
  rings: 'Rings', bangles: 'Bangles', earrings: 'Earrings',
  chains: 'Chains', necklaces: 'Necklaces',
}

const METAL_LABELS = {
  gold: 'Gold', silver: 'Silver',
}

const PURITY_LABELS = {
  gold: { '22k': '91.6', '24k': '999' },
  silver: { '999': '999' },
  diamond: { '18k': '750', '22k': '916' },
  platinum: { '92': '920' },
}

const TAG_COLORS = {
  Bestseller: { bg: 'rgba(52,211,153,0.2)', border: 'rgba(52,211,153,0.5)', color: '#34d399' },
  Bridal: { bg: 'rgba(244,114,182,0.2)', border: 'rgba(244,114,182,0.5)', color: '#f472b6' },
  Premium: { bg: 'rgba(251,191,36,0.25)', border: 'rgba(251,191,36,0.6)', color: '#fbbf24' },
  Statement: { bg: 'rgba(167,139,250,0.2)', border: 'rgba(167,139,250,0.5)', color: '#a78bfa' },
  Minimal: { bg: 'rgba(34,211,238,0.2)', border: 'rgba(34,211,238,0.5)', color: '#22d3ee' },
  Stackable: { bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.4)', color: '#ffd700' },
  New: { bg: 'rgba(244,114,182,0.2)', border: 'rgba(244,114,182,0.5)', color: '#f472b6' },
  Antique: { bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.4)', color: '#fbbf24' },
}

function MoreFromCollection({ currentProductId, category, metal, gender, occasion, liveRate }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])

  const calcLivePrice = (p) => {
    if (!liveRate) return parseFloat(p.price) || null
    const netWt = parseFloat(p.net_weight) || 0
    const makingChargePct = parseFloat(p.making_charge) || 0
    const discountPct = parseFloat(p.wastage_charge) || 0
    const stoneVal = parseFloat(p.stone_value) || 0
    let todayRate = 0
    if (p.metal === 'gold') todayRate = p.grade === '24k' ? liveRate.gold_24k : liveRate.gold_22k
    else if (p.metal === 'silver') todayRate = liveRate.silver_999
    else if (p.metal === 'diamond') todayRate = p.grade === '18k' ? liveRate.diamond_18k : liveRate.diamond_22k
    else if (p.metal === 'platinum') todayRate = liveRate.platinum_92
    if (!todayRate || !netWt) return parseFloat(p.price) || null
    const makingPerGram = todayRate * (makingChargePct / 100)
    const rateWithMaking = todayRate + makingPerGram
    const discountPerGram = rateWithMaking * (discountPct / 100)
    const effectiveRate = rateWithMaking - discountPerGram
    return Math.round(((netWt * effectiveRate) + stoneVal) * 1.03)
  }

  const calcOriginalPrice = (p) => {
    if (!liveRate) return parseFloat(p.original_price) || null
    const netWt = parseFloat(p.net_weight) || 0
    const makingChargePct = parseFloat(p.making_charge) || 0
    const stoneVal = parseFloat(p.stone_value) || 0
    let todayRate = 0
    if (p.metal === 'gold') todayRate = p.grade === '24k' ? liveRate.gold_24k : liveRate.gold_22k
    else if (p.metal === 'silver') todayRate = liveRate.silver_999
    else if (p.metal === 'diamond') todayRate = p.grade === '18k' ? liveRate.diamond_18k : liveRate.diamond_22k
    else if (p.metal === 'platinum') todayRate = liveRate.platinum_92
    if (!todayRate || !netWt) return parseFloat(p.original_price) || null
    const makingPerGram = todayRate * (makingChargePct / 100)
    const rateWithMaking = todayRate + makingPerGram
    return Math.round(((netWt * rateWithMaking) + stoneVal) * 1.03)
  }

  useEffect(() => {
    import('../api').then(({ default: api }) => {
      api.get(`/jewelry-products/?category=${category}&metal=${metal}`)
        .then(res => {
          const list = Array.isArray(res.data) ? res.data : []
          const filtered = list.filter(p => String(p.id) !== String(currentProductId))
          setProducts(filtered.slice(0, 4))
        })
        .catch(() => {})
    })
  }, [category, metal, currentProductId, liveRate])

  if (products.length === 0) return null

  const getImageUrl = img => {
    if (!img) return null
    let p = typeof img === 'object' ? (img.image || img.url || '') : img
    if (!p) return null
    if (p.startsWith('http://') || p.startsWith('https://')) return p
    return `https://bitbyte-backend-f66f.onrender.com/${p.replace(/^\/+/, '')}`
  }

  return (
    <div style={{ position: 'relative', zIndex: 5, padding: '0 40px 80px', maxWidth: 1600, margin: '0 auto' }}>
      {/* ── section header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#b8860b' }}>✦ You May Also Like</p>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: '#1c1410', fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.3px' }}>
            More from this Collection
          </h2>
        </div>
        <button
          onClick={() => navigate(`/collection/all?metal=${metal}${gender && gender !== 'all' ? `&gender=${gender}` : ''}${occasion ? `&occasion=${occasion}` : ''}`)}
          style={{
            padding: '10px 24px', borderRadius: 2,
            border: '1.5px solid #1c1410', background: 'transparent',
            color: '#1c1410', fontWeight: 600, fontSize: 12,
            cursor: 'pointer', letterSpacing: '1.5px', textTransform: 'uppercase',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1c1410'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1c1410' }}
        >
          View All
        </button>
      </div>

      {/* 4 Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {products.map(p => {
          const firstImg = p.images?.[0] ? getImageUrl(p.images[0]) : null
          const price = calcLivePrice(p) || 0
          const originalPrice = calcOriginalPrice(p) || 0
          const discountPct = parseFloat(p.wastage_charge) || 0
          const hasDiscount = discountPct > 0 && originalPrice > price && price > 0

          return (
            <div key={p.id}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                navigate(`/product-display?category=${p.category}&metal=${p.metal}&id=${p.id}`)
              }}
              style={{
                background: '#fff', borderRadius: 4, overflow: 'hidden',
                cursor: 'pointer', transition: 'transform 0.25s, box-shadow 0.25s',
                border: '1px solid #ede9e3',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.10)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ height: 220, background: '#f7f4f0', overflow: 'hidden' }}
                onMouseEnter={e => {
                  const secondImg = p.images?.[1] ? getImageUrl(p.images[1]) : null
                  if (secondImg) e.currentTarget.querySelector('img').src = secondImg
                }}
                onMouseLeave={e => {
                  if (firstImg) e.currentTarget.querySelector('img').src = firstImg
                }}
              >
                {firstImg
                  ? <img src={firstImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                  : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 44 }}>💍</div>
                }
              </div>
              <div style={{ padding: '14px 16px' }}>
                {/* metal badge */}
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#b8860b', background: 'rgba(184,134,11,0.08)', border: '1px solid rgba(184,134,11,0.2)', borderRadius: 2, padding: '2px 8px', display: 'inline-block', marginBottom: 6 }}>
                  {p.metal?.toUpperCase()} {p.grade?.toUpperCase()}
                </span>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1c1410', marginBottom: 8, fontFamily: '"Cormorant Garamond", Georgia, serif', letterSpacing: '0.2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #f0ebe4', paddingTop: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#1c1410' }}>
                    {price > 0 ? `₹${price.toLocaleString('en-IN')}` : '—'}
                  </span>
                  {hasDiscount && (
                    <>
                      <span style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through' }}>₹{originalPrice.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#2ecc71', marginLeft: 'auto' }}>{discountPct}% Off</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


function ProductInfoAndBreakup({ product, metal }) {
  const [liveRate, setLiveRate] = useState(null)

  useEffect(() => {
    import('../api').then(({ default: api }) => {
      api.get('/metal-rates/').then(res => {
        const d = res.data
        setLiveRate({
          gold_22k: parseFloat(d.gold_22k) || 0,
          gold_24k: parseFloat(d.gold_24k) || 0,
          silver_999: parseFloat(d.silver_999) || 0,
          diamond_18k: parseFloat(d.diamond_18k) || 0,
          diamond_22k: parseFloat(d.diamond_22k) || 0,
          platinum_92: parseFloat(d.platinum_92) || 0,
        })
      }).catch(() => { })
    })
  }, [])

  if (!product) return null

  const PURITY_LABELS = {
    gold: { '22k': '91.6', '24k': '999' },
    silver: { '999': '999' },
    diamond: { '18k': '750', '22k': '916' },
    platinum: { '92': '920' },
  }

  const purityLabel = PURITY_LABELS[metal]?.[product.grade] || product.grade?.toUpperCase() || '—'
  const metalLabel = { gold: 'Gold', silver: 'Silver', diamond: 'Diamond', platinum: 'Platinum' }[metal] || metal

  const netWt = parseFloat(product.net_weight) || 0
  const crossWt = parseFloat(product.cross_weight) || 0
  const stoneWt = parseFloat(product.stone_weight) || 0
  const stoneVal = parseFloat(product.stone_value) || 0
  const makingChargePct = parseFloat(product.making_charge) || 0
  const discountPct = parseFloat(product.wastage_charge) || 0

  let todayRate = 0
  if (liveRate) {
    if (metal === 'gold') todayRate = product.grade === '24k' ? liveRate.gold_24k : liveRate.gold_22k
    else if (metal === 'silver') todayRate = liveRate.silver_999
    else if (metal === 'diamond') todayRate = product.grade === '18k' ? liveRate.diamond_18k : liveRate.diamond_22k
    else if (metal === 'platinum') todayRate = liveRate.platinum_92
  }

  const makingPerGram = todayRate * (makingChargePct / 100)
  const rateWithMaking = todayRate + makingPerGram
  const discountPerGram = rateWithMaking * (discountPct / 100)
  const effectiveRate = rateWithMaking - discountPerGram

  const goldValue = netWt ? Math.round(todayRate * netWt) : null
  const makingValue = netWt ? Math.round(makingPerGram * netWt) : null
  const discountOnMaking = netWt ? Math.round(discountPerGram * netWt) : 0
  const makingFinal = makingValue !== null ? makingValue - discountOnMaking : null

  const subtotalValue = (goldValue || 0) + stoneVal + (makingValue || 0)
  const subtotalDiscount = discountOnMaking || 0
  const subtotalFinal = (goldValue || 0) + stoneVal + (makingFinal || 0)
  const gstValue = Math.round(subtotalValue * 0.03)
  const gstFinal = Math.round(subtotalFinal * 0.03)
  const grandValue = subtotalValue + gstValue
  const grandFinal = subtotalFinal + gstFinal

  const inr = n => n !== null && n !== undefined ? `₹${Math.round(n).toLocaleString('en-IN')}` : '—'

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: '60px 40px 80px', position: 'relative', zIndex: 5 }}>

      {/* ── Product Information ── */}
      <div style={{ borderTop: '2px solid #ede9e3', paddingTop: 48, marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ width: 3, height: 36, background: 'linear-gradient(180deg,#b8860b,#e0c97a)' }} />
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: '#1c1410', fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.3px' }}>
            Product Information
          </h2>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde8c8 60%, #fef9f0 100%)',
          borderRadius: 8,
          padding: '36px 48px',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 6,
            padding: '36px 80px',
            display: 'inline-block',
            minWidth: 600,
            boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
            border: '1px solid rgba(184,134,11,0.12)',
          }}>
            <div style={{ color: '#7c2d12', fontWeight: 700, fontSize: 18, marginBottom: 4, fontFamily: '"Playfair Display", Georgia, serif' }}>Metal and Purity</div>
            <div style={{ color: '#92400e', fontSize: 16, marginBottom: 20, fontFamily: '"Montserrat", sans-serif' }}>{metalLabel} {purityLabel}</div>
            <div style={{ color: '#7c2d12', fontWeight: 700, fontSize: 18, marginBottom: 4, fontFamily: '"Playfair Display", Georgia, serif' }}>Weight</div>
            <div style={{ color: '#92400e', fontSize: 16, marginBottom: 20, fontFamily: '"Montserrat", sans-serif' }}>{netWt > 0 ? `${netWt}gms` : crossWt > 0 ? `${crossWt}gms` : '—'}</div>
            <div style={{ color: '#7c2d12', fontWeight: 700, fontSize: 18, marginBottom: 4, fontFamily: '"Playfair Display", Georgia, serif' }}>Product Description</div>
            <div style={{ color: '#92400e', fontSize: 16, lineHeight: 1.8, fontFamily: '"Montserrat", sans-serif' }}>
              {product?.desc || product?.description || product?.short_description || 'No description available.'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Price Breakup ── */}
      <div style={{ borderTop: '1px solid #ede9e3', paddingTop: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ width: 3, height: 36, background: 'linear-gradient(180deg,#b8860b,#e0c97a)' }} />
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: '#1c1410', fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.3px' }}>
            Price Breakup
          </h2>
          {!liveRate && <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400 }}>Loading rates...</span>}
        </div>

        <div style={{ background: '#fff', borderRadius: 8, padding: '0', border: '1px solid #ede9e3', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, fontFamily: '"Montserrat", sans-serif' }}>
            <thead>
              <tr style={{ background: '#fef9f0', borderBottom: '2px solid rgba(184,134,11,0.2)' }}>
                {['Component', 'Rate', 'Weight', 'Value', 'Discount', 'Final Value'].map((h, i) => (
                  <th key={h} style={{ textAlign: 'left', padding: '16px 20px', color: '#78350f', fontWeight: 700, fontSize: 13, minWidth: i === 0 ? 200 : 110, letterSpacing: '0.8px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} style={{ padding: '20px 20px 8px', color: '#92400e', fontWeight: 700, fontSize: 13, letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(184,134,11,0.04)' }}>
                  {metalLabel}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f5efe8' }}>
                <td style={{ padding: '14px 20px', color: '#78350f' }}>{purityLabel} {metalLabel}</td>
                <td style={{ padding: '14px 20px', color: '#78350f' }}>{todayRate ? todayRate.toLocaleString('en-IN') : '—'}</td>
                <td style={{ padding: '14px 20px', color: '#78350f' }}>{netWt || '—'}</td>
                <td style={{ padding: '14px 20px', color: '#78350f' }}>{inr(goldValue)}</td>
                <td style={{ padding: '14px 20px', color: '#78350f' }}>₹0</td>
                <td style={{ padding: '14px 20px', color: '#78350f', fontWeight: 600 }}>{inr(goldValue)}</td>
              </tr>
              {stoneVal > 0 && <>
                <tr>
                  <td colSpan={6} style={{ padding: '16px 20px 8px', color: '#92400e', fontWeight: 700, fontSize: 13, letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(184,134,11,0.04)' }}>Stone Details</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f5efe8' }}>
                  <td style={{ padding: '14px 20px', color: '#78350f' }}>Stone</td>
                  <td style={{ padding: '14px 20px', color: '#78350f' }}>—</td>
                  <td style={{ padding: '14px 20px', color: '#78350f' }}>{stoneWt > 0 ? stoneWt : '—'}</td>
                  <td style={{ padding: '14px 20px', color: '#78350f' }}>{inr(stoneVal)}</td>
                  <td style={{ padding: '14px 20px', color: '#78350f' }}>-</td>
                  <td style={{ padding: '14px 20px', color: '#78350f', fontWeight: 600 }}>{inr(stoneVal)}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f5efe8' }}>
                  <td style={{ padding: '14px 20px', color: '#78350f' }}>Total Stone Value</td>
                  <td /><td />
                  <td style={{ padding: '14px 20px', color: '#78350f' }}>{inr(stoneVal)}</td>
                  <td style={{ padding: '14px 20px', color: '#78350f' }}>-</td>
                  <td style={{ padding: '14px 20px', color: '#78350f', fontWeight: 600 }}>{inr(stoneVal)}</td>
                </tr>
              </>}
              <tr style={{ borderBottom: '2px solid rgba(184,134,11,0.15)', background: 'rgba(184,134,11,0.03)' }}>
                <td style={{ padding: '16px 20px', color: '#7c2d12', fontWeight: 700 }}>Making Charges</td>
                <td /><td />
                <td style={{ padding: '14px 20px', color: '#78350f' }}>{inr(makingValue)}</td>
                <td style={{ padding: '14px 20px', color: '#78350f' }}>{discountOnMaking ? inr(discountOnMaking) : '₹0'}</td>
                <td style={{ padding: '14px 20px', color: '#78350f', fontWeight: 600 }}>{inr(makingFinal)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f5efe8', background: '#fef9f0' }}>
                <td style={{ padding: '16px 20px', color: '#7c2d12', fontWeight: 700, fontSize: 14 }}>Total</td>
                <td /><td />
                <td style={{ padding: '14px 20px', color: '#7c2d12', fontWeight: 700 }}>{inr(subtotalValue)}</td>
                <td style={{ padding: '14px 20px', color: '#7c2d12', fontWeight: 700 }}>{subtotalDiscount ? inr(subtotalDiscount) : '₹0'}</td>
                <td style={{ padding: '14px 20px', color: '#7c2d12', fontWeight: 700 }}>{inr(subtotalFinal)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f5efe8' }}>
                <td style={{ padding: '16px 20px', color: '#78350f' }}>GST (3%)</td>
                <td /><td />
                <td style={{ padding: '14px 20px', color: '#78350f' }}>{inr(gstValue)}</td>
                <td />
                <td style={{ padding: '14px 20px', color: '#78350f' }}>{inr(gstFinal)}</td>
              </tr>
              <tr style={{ background: 'linear-gradient(135deg,#fef3c7,#fde8c8)' }}>
                <td style={{ padding: '20px 20px', color: '#7c2d12', fontWeight: 800, fontSize: 16 }}>Grand Total</td>
                <td /><td />
                <td style={{ padding: '18px 20px', color: '#7c2d12', fontWeight: 800, fontSize: 15 }}>{inr(grandValue)}</td>
                <td />
                <td style={{ padding: '18px 20px', color: '#7c2d12', fontWeight: 800, fontSize: 15 }}>{inr(grandFinal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function ProductDisplay() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const canvasRef = useRef(null)

  const productId = searchParams.get('id')
  const category = searchParams.get('category') || 'rings'
  const metal = searchParams.get('metal') || 'gold'

  const [dark, setDark] = useState(true)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [qty, setQty] = useState(1)
  const [mainImage, setMainImage] = useState(null)
  const [showAdded, setShowAdded] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [showZoom, setShowZoom] = useState(false)
  const [zoomPixel, setZoomPixel] = useState({ x: 0, y: 0 })
  const [wishlisted, setWishlisted] = useState(false)
  const [liveRate, setLiveRate] = useState(null)
  const imageRef = useRef(null)

  const isGold = metal === 'gold'
  const accentColor = isGold ? '#fbbf24' : '#c0c0c0'
  const accentSoft = isGold ? 'rgba(251,191,36,0.18)' : 'rgba(192,192,192,0.18)'
  const accentGlow = isGold ? 'rgba(251,191,36,0.32)' : 'rgba(192,192,192,0.32)'

  const bg = '#FDF5EE'
  const text = '#1c1410'
  const subtext = '#de8856'
  const border = 'rgba(180, 130, 80, 0.18)'
  const glass = '#f0e9de'
  const cardBg = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.035)'
  const inputBg = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'

  const getImageUrl = img => {
    if (!img) return null
    let imagePath = typeof img === 'object'
      ? (img.image || img.url || img.file || img.path || img.image_url || img.product_image || '')
      : img
    if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') return null
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
    return `${API_BASE}/${imagePath.replace(/^\/+/, '')}`
  }

  useEffect(() => {
    if (!productId) return
    import('../api').then(({ default: api }) => {
      api.get('/wishlist/').then(res => {
        const found = res.data.items.find(i => i.product_id === parseInt(productId))
        setWishlisted(!!found)
      }).catch(() => { })
    })
  }, [productId])

  useEffect(() => {
    import('../api').then(({ default: api }) => {
      api.get('/metal-rates/').then(res => {
        const d = res.data
        setLiveRate({
          gold_22k: parseFloat(d.gold_22k) || 0,
          gold_24k: parseFloat(d.gold_24k) || 0,
          silver_999: parseFloat(d.silver_999) || 0,
          diamond_18k: parseFloat(d.diamond_18k) || 0,
          diamond_22k: parseFloat(d.diamond_22k) || 0,
          platinum_92: parseFloat(d.platinum_92) || 0,
        })
      }).catch(() => {})
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    import('../api').then(({ default: api }) => {
      api.get(`/jewelry-products/?category=${category}&metal=${metal}`)
        .then(res => {
          setProducts(Array.isArray(res.data) ? res.data : [])
          setLoading(false)
        })
        .catch(err => {
          setProducts([])
          setLoading(false)
        })
    })
  }, [category, metal])

  const product = useMemo(() => {
    if (!products.length) return null
    if (productId) {
      const found = products.find(item => String(item.id) === String(productId))
      if (found) return found
    }
    return products[0]
  }, [products, productId])

  const productImages = useMemo(() => {
    if (!product) return []
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map(img => getImageUrl(img)).filter(Boolean)
    }
    return []
  }, [product, metal])

  useEffect(() => {
    if (productImages.length > 0) setMainImage(productImages[0])
  }, [productImages])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId, particles = []
    const mouse = { x: null, y: null, radius: 150 }
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    const mouseMove = e => { mouse.x = e.x; mouse.y = e.y }
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', mouseMove)
    resize()
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height
        this.size = Math.random() * 4 + 2
        this.speedX = (Math.random() - 0.5) * 0.3; this.speedY = (Math.random() - 0.5) * 0.3
      }
      update() {
        this.x += this.speedX; this.y += this.speedY
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x; const dy = mouse.y - this.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < mouse.radius && dist > 0) {
            const f = (mouse.radius - dist) / mouse.radius
            this.x += (dx / dist) * f * 2; this.y += (dy / dist) * f * 2
          }
        }
      }
      draw() {
        ctx.fillStyle = isGold ? (dark ? 'rgba(251,191,36,0.75)' : 'rgba(217,119,6,0.6)') : (dark ? 'rgba(192,192,192,0.75)' : 'rgba(100,116,139,0.6)')
        ctx.save(); ctx.translate(this.x, this.y); ctx.beginPath()
        const spikes = 5; const outerR = this.size; const innerR = this.size * 0.4
        for (let i = 0; i < spikes * 2; i++) {
          const r = i % 2 === 0 ? outerR : innerR; const a = (i * Math.PI) / spikes - Math.PI / 2
          if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
          else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
        }
        ctx.closePath(); ctx.fill(); ctx.restore()
      }
    }
    const init = () => { particles = []; for (let i = 0; i < 60; i++) particles.push(new Particle()) }
    const connect = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x; const dy = particles[a].y - particles[b].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 150) {
            ctx.strokeStyle = isGold ? `rgba(251,191,36,${(1 - d / 150) * 0.35})` : `rgba(192,192,192,${(1 - d / 150) * 0.35})`
            ctx.lineWidth = 0.5; ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke()
          }
        }
      }
    }
    const animate = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw() }); connect(); animId = requestAnimationFrame(animate) }
    init(); animate()
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('mousemove', mouseMove); cancelAnimationFrame(animId) }
  }, [dark, metal])

  // const loadRazorpay = () => new Promise(resolve => {
  //   const script = document.createElement('script')
  //   script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  //   script.onload = () => resolve(true); script.onerror = () => resolve(false)
  //   document.body.appendChild(script)
  // })

const handleBuy = () => {
    if (!product || !displayPrice) return
    navigate('/order-confirm', {
      state: {
        product,
        qty,
        displayPrice,
        metal,
        category,
      }
    })
  }

  const basePrice = Number(product?.price) || 0
  const displayPrice = basePrice > 0 ? basePrice : null
  const calculatedWeightText = product?.net_weight ? `${parseFloat(product.net_weight)} gm` : '—'
  const productName = product?.name || product?.title || 'Jewellery Product'
  const productDesc = product?.desc || product?.description || product?.short_description || 'Premium handcrafted jewellery from BitByte Jewellers.'
  const productTag = product?.tag || product?.label || (isGold ? 'Premium' : 'Minimal')
  const tagStyle = TAG_COLORS[productTag] || { bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.2)', color: text }

  const handleMouseMove = (e) => {
    const rect = imageRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = e.clientX - rect.left; const py = e.clientY - rect.top
    setZoomPos({ x: Math.max(0, Math.min(100, (px / rect.width) * 100)), y: Math.max(0, Math.min(100, (py / rect.height) * 100)) })
    setZoomPixel({ x: px, y: py })
  }

  const handleAddToCart = async () => {
    if (!product) return
    const result = await addToCartDB(product.id, qty)
    if (result) { setShowAdded(true); setTimeout(() => setShowAdded(false), 1600) }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: '"Montserrat", sans-serif', position: 'relative', overflow: 'hidden', transition: 'background 0.8s ease, color 0.4s ease' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 70, height: 70, borderRadius: '50%', border: `4px solid ${border}`, borderTopColor: accentColor, margin: '0 auto 18px', animation: 'spin 0.9s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h2 style={{ margin: 0, color: accentColor }}>Loading product...</h2>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: '#FDF5EE', color: text, display: 'grid', placeItems: 'center', fontFamily: '"Inter",system-ui,sans-serif', padding: 20 }}>
        <div style={{ maxWidth: 520, textAlign: 'center', background: glass, border: `1px solid ${border}`, borderRadius: 28, padding: 35, backdropFilter: 'blur(18px)' }}>
          <h1 style={{ color: accentColor, marginTop: 0 }}>Product not found</h1>
          <p style={{ color: subtext }}>This product is not available now. Please go back and select another product.</p>
          <button onClick={() => { const role = localStorage.getItem('role'); if (role === 'customer') navigate('/customer'); else if (role === 'admin') navigate('/admin'); else if (role === 'super_admin') navigate('/super-admin'); else navigate('/') }}
            style={{ border: 'none', borderRadius: 999, padding: '13px 24px', background: accentColor, color: isGold ? '#111827' : '#020617', fontWeight: 900, cursor: 'pointer' }}>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: '"Inter",system-ui,sans-serif', position: 'relative', overflow: 'hidden', transition: 'background 0.8s ease, color 0.4s ease' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@400;500;600;700&display=swap');
        @keyframes float-orb { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes antigravity { 0%{transform:translateY(110vh) rotate(0deg);opacity:0} 10%{opacity:var(--op)} 90%{opacity:var(--op)} 100%{transform:translateY(-20vh) rotate(360deg);opacity:0} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shine { 0%{left:-80%} 100%{left:120%} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 20px ${accentGlow}} 50%{box-shadow:0 0 45px ${accentGlow}} }
        .pd-main { animation:fadeInUp 0.55s ease both; }
        .pd-image-card:hover .pd-main-img { transform:scale(1.06) rotate(1deg); }
        .pd-shine { position:absolute;top:0;left:-80%;width:40%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);transform:skewX(-20deg);opacity:0; }
        .pd-image-card:hover .pd-shine { opacity:1;animation:shine 0.7s ease; }
        .thumb:hover { transform:translateY(-4px) scale(1.03); }
        .weight-btn:hover,.action-btn:hover,.top-btn:hover { transform:translateY(-2px); }
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }
        input[type=number] { -moz-appearance:textfield;appearance:textfield; }

        /* ── PREMIUM PRODUCT PAGE STYLES ── */

        /* breadcrumb */
        .pd-breadcrumb { display:flex;align-items:center;gap:8px;margin-bottom:28px; }
.pd-breadcrumb span { font-size:12px;letter-spacing:0.2px;text-transform:none;font-weight:400;cursor:pointer;color:#aaa;transition:color 0.2s; }
.pd-breadcrumb span:last-child { color:#555;cursor:default;font-weight:500; }
        .pd-breadcrumb span:not(:last-child):hover { color:#555; }
        .pd-breadcrumb-sep { font-size:11px;color:#ddd; }

        /* image frame */
        .pd-img-frame {
          border: 1px solid #ede9e3;
          border-radius: 4px;
          overflow: hidden;
          background: #f7f4f0;
          position: relative;
        }

        /* thumbnail strip */
        .pd-thumb {
          width: 78px; height: 78px;
          border-radius: 4px;
          border: 1.5px solid #ede9e3;
          background: #f7f4f0;
          padding: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          overflow: hidden;
        }
        .pd-thumb:hover { border-color: #b8860b; transform: translateY(-2px); }
        .pd-thumb.active { border-color: #b8860b; box-shadow: 0 0 0 3px rgba(184,134,11,0.15); }

        /* spec pills */
        .pd-spec {
          background: #fff;
          border: 1px solid #ede9e3;
          border-radius: 4px;
          padding: 14px 18px;
          transition: border-color 0.2s;
        }
        .pd-spec:hover { border-color: rgba(184,134,11,0.4); }

        /* price box */
        .pd-price-box {
          background: linear-gradient(135deg, rgba(184,134,11,0.06), rgba(184,134,11,0.02));
          border: 1px solid rgba(184,134,11,0.2);
          border-radius: 6px;
          padding: 20px 24px;
          margin-bottom: 24px;
        }

        /* CTA buttons */
        .pd-btn-cart {
          flex: 1;
          border: none;
          border-radius: 2px;
          padding: 16px 24px;
          background: linear-gradient(135deg, ${accentColor}, ${isGold ? '#f59e0b' : '#94a3b8'});
          color: #1a1a1a;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          animation: pulseGlow 2.2s ease-in-out infinite;
        }
        .pd-btn-cart:hover { transform: translateY(-2px); filter: brightness(1.05); }

        .pd-btn-buy {
          flex: 1;
          border: none;
          border-radius: 2px;
          padding: 16px 24px;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pd-btn-buy:hover { transform: translateY(-2px); filter: brightness(1.05); }

        /* trust badges */
        .pd-trust-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          border-top: 1px solid #ede9e3;
          border-bottom: 1px solid #ede9e3;
          margin: 60px 0 0;
          position: relative;
          z-index: 5;
          background: #fff;
        }
        .pd-trust-item {
          padding: 32px 24px;
          text-align: center;
          border-right: 1px solid #ede9e3;
          transition: background 0.2s;
        }
        .pd-trust-item:last-child { border-right: none; }
        .pd-trust-item:hover { background: #fef9f0; }

        @media (max-width:900px) {
          .pd-grid { grid-template-columns: 1fr !important; }
          .pd-trust-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.4 }} />
      <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(90px)', animation: 'float-orb 20s infinite ease-in-out', zIndex: 0, top: '5%', left: '5%', width: 420, height: 420, background: accentSoft }} />
      <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(90px)', animation: 'float-orb 20s infinite ease-in-out', animationDelay: '-7s', zIndex: 0, bottom: '5%', right: '5%', width: 500, height: 500, background: accentSoft }} />
      {PARTICLES.map(p => (
        <div key={p.id} style={{ position: 'absolute', left: `${p.x}%`, bottom: '-100px', width: p.size, height: p.size, borderRadius: '40% 60% 60% 40%/40% 40% 60% 60%', border: `1px solid ${accentColor}55`, opacity: p.opacity, animation: `antigravity ${p.duration}s ${p.delay}s infinite linear`, '--op': p.opacity, pointerEvents: 'none', zIndex: 0 }} />
      ))}

      <CustomerNavbar />

      <main style={{ position: 'relative', zIndex: 5, padding: '40px 48px 80px', maxWidth: 1300, margin: '0 auto' }}>

        {/* ── BREADCRUMB ── */}
        <div className="pd-breadcrumb">
          <span onClick={() => navigate('/customer')}>Home</span>
          <span className="pd-breadcrumb-sep">›</span>
          <span onClick={() => navigate(`/collection/all?metal=${metal}`)}>{METAL_LABELS[metal] || metal}</span>
          <span className="pd-breadcrumb-sep">›</span>
          <span onClick={() => navigate(`/collection/all?metal=${metal}&category=${category}`)}>{CATEGORY_LABELS[category] || category}</span>
          <span className="pd-breadcrumb-sep">›</span>
          <span>{productName}</span>
        </div>

        <section className="pd-grid pd-main" style={{ display: 'grid', gridTemplateColumns: '580px 1fr', gap: 48, alignItems: 'start' }}>

          {/* ── IMAGE SIDE ── */}
          <div className="pd-image-card" style={{ position: 'relative' }}>
            <div className="pd-shine" />

            {/* Main image frame */}
            <div className="pd-img-frame" ref={imageRef} onMouseMove={handleMouseMove} onMouseEnter={() => setShowZoom(true)} onMouseLeave={() => setShowZoom(false)} style={{ height: 480, display: 'grid', placeItems: 'center', cursor: 'none' }}>

              {/* Tag ribbon */}
              {productTag && (
                <div style={{ position: 'absolute', top: 16, left: 0, background: '#8B1A1A', color: '#fff', padding: '5px 16px 5px 12px', fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', clipPath: 'polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)', zIndex: 2 }}>
                  {productTag}
                </div>
              )}

              {/* Wishlist */}
              <button
                onClick={async () => {
                  if (!product) return
                  const api = (await import('../api')).default
                  try {
                    const res = await api.post('/wishlist/', { product_id: product.id })
                    setWishlisted(res.data.action === 'added')
                    window.dispatchEvent(new Event('bb_wishlist_update'))
                  } catch (err) { console.error(err) }
                }}
                style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: '50%', border: wishlisted ? '1.5px solid #c0392b' : '1px solid #ddd', background: wishlisted ? 'rgba(192,57,43,0.1)' : 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2, transition: 'all 0.2s ease' }}
                title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg width="18" height="18" viewBox="0 0 32 32" fill={wishlisted ? '#c0392b' : 'none'} stroke={wishlisted ? '#c0392b' : '#aaa'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 27s-11-7.5-11-14.5a6.5 6.5 0 0111-4.7 6.5 6.5 0 0111 4.7c0 7-11 14.5-11 14.5z"/>
                </svg>
              </button>

              {mainImage && (
                <img className="pd-main-img" src={mainImage} onError={e => { e.currentTarget.style.display = 'none' }}
                  style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', filter: 'drop-shadow(0 20px 36px rgba(0,0,0,0.14))', transition: 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)' }} />
              )}

              {showZoom && mainImage && (
                <div style={{ position: 'absolute', left: zoomPixel.x - 100, top: zoomPixel.y - 100, width: 200, height: 200, borderRadius: '50%', border: `2px solid ${accentColor}`, boxShadow: `0 0 0 1px rgba(255,255,255,0.4), 0 8px 32px rgba(0,0,0,0.4)`, backgroundImage: `url(${mainImage})`, backgroundSize: '400%', backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`, backgroundRepeat: 'no-repeat', pointerEvents: 'none', zIndex: 20 }} />
              )}
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              {productImages.map((img, index) => (
                <button key={index} className={`pd-thumb${mainImage === img ? ' active' : ''}`} onClick={() => setMainImage(img)}>
                  <img src={img} alt={`${productName} ${index + 1}`}
                    onError={e => { const fb = isGold ? '/img/gold/gold-ring-1.png' : '/img/silver/silver-ring-1.png'; if (e.currentTarget.src !== window.location.origin + fb) e.currentTarget.src = fb }}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          </div>

          {/* ── DETAIL SIDE ── */}
          <div style={{ paddingTop: 8 }}>

            {/* Metal + Category eyebrow */}
            <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#b8860b' }}>
              ✦ {METAL_LABELS[metal] || metal} {CATEGORY_LABELS[category] || category}
            </p>

            {/* Product name */}
            <h1 className="pd-title" style={{ margin: '0 0 20px', fontSize: 34, lineHeight: 1.1, fontWeight: 600, letterSpacing: '-0.3px', color: text, fontFamily: '"Playfair Display", Georgia, serif' }}>
              {productName}
            </h1>

            {/* Thin gold divider */}
            <div style={{ width: 56, height: 2, background: 'linear-gradient(90deg,#b8860b,#e0c97a)', marginBottom: 24 }} />

            {/* Spec pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Metal', value: METAL_LABELS[metal] || metal },
                { label: 'Category', value: CATEGORY_LABELS[category] || category },
                { label: 'Weight', value: calculatedWeightText },
              ].map(s => (
                <div key={s.label} className="pd-spec">
                  <div style={{ color: '#aaa', fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ color: text, fontSize: 18, fontWeight: 600, fontFamily: '"Cormorant Garamond", Georgia, serif' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Price box */}
            <div className="pd-price-box">
              <div style={{ color: '#aaa', fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>Price</div>

              {(() => {
                const discountPct = parseFloat(product?.wastage_charge) || 0
                const originalAmt = parseFloat(product?.original_price) || 0
                const hasDiscount = discountPct > 0 && originalAmt > 0 && displayPrice
                return (
                  <>
                    {hasDiscount && (
                      <div style={{ marginBottom: 8 }}>
                        <span style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.35)', color: '#4ade80', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 2, letterSpacing: '0.5px' }}>
                          {discountPct}% Off
                        </span>
                      </div>
                    )}
<div style={{ color: text, fontSize: 28, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.1, fontFamily: '"Montserrat", sans-serif' }}>
  {displayPrice ? `₹${displayPrice.toLocaleString('en-IN')}` : 'Contact for Price'}
</div>
                    {hasDiscount && (
                      <>
                        <div style={{ color: '#e76b12', fontSize: 16, fontWeight: 400, textDecoration: 'line-through', marginTop: 4, opacity: 0.8 }}>
                          ₹{originalAmt.toLocaleString('en-IN')}
                        </div>
                        <div style={{ color: '#4ade80', fontSize: 12, fontWeight: 700, marginTop: 4, letterSpacing: '0.3px' }}>
                          You save ₹{(originalAmt - displayPrice).toLocaleString('en-IN')}
                        </div>
                      </>
                    )}
                  </>
                )
              })()}

              {!product.is_active && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 4, padding: '10px 16px', marginTop: 12, color: '#f87171', fontWeight: 700, fontSize: 12, textAlign: 'center', letterSpacing: '0.5px' }}>
                  ⚠️ Currently Unavailable
                </div>
              )}
            </div>

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${border}`, borderRadius: 2, overflow: 'hidden', background: inputBg }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 44, height: 44, border: 'none', background: 'transparent', color: text, fontSize: 20, fontWeight: 700, cursor: 'pointer' }}>-</button>
                <input type="number" min="1" value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value) || 1))} style={{ width: 55, height: 44, border: 'none', outline: 'none', textAlign: 'center', background: 'transparent', color: text, fontWeight: 700, fontSize: 16 }} />
                <button onClick={() => setQty(q => q + 1)} style={{ width: 44, height: 44, border: 'none', background: 'transparent', color: text, fontSize: 20, fontWeight: 700, cursor: 'pointer' }}>+</button>
              </div>
              <span style={{ color: subtext, fontWeight: 600, fontSize: 13, letterSpacing: '0.5px' }}>Quantity</span>
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="pd-btn-cart" onClick={handleAddToCart}>
                {showAdded ? '✓ Added to Cart' : '🛒 Add to Cart'}
              </button>
              <button className="pd-btn-buy" disabled={!product.is_active}
                onClick={handleBuy}
                style={{ background: product.is_active ? 'linear-gradient(135deg,#1a1a1a,#333)' : 'rgba(100,100,100,0.3)', color: product.is_active ? '#fff' : '#888', cursor: product.is_active ? 'pointer' : 'not-allowed' }}>
                💳 Buy Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── TRUST BADGES ── */}
      <div className="pd-trust-grid">
        {[
          {
            label: 'BIS Hallmark Jewellery',
            sub: 'Authenticity Guaranteed, Purity Assured',
            svg: (
              <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                <polygon points="32,5 42,17 57,17 57,32 42,47 32,59 22,47 7,32 7,17 22,17" fill="rgba(251,191,36,0.15)" stroke="#d97706" strokeWidth="2.5"/>
                <polygon points="32,12 40,22 52,22 52,32 40,42 32,52 24,42 12,32 12,22 24,22" fill="rgba(251,191,36,0.08)" stroke="#d97706" strokeWidth="1.5"/>
                <polyline points="22,32 28,38 42,24" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="50" x2="48" y2="50" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            ),
          },
          {
            label: 'Fast Shipping',
            sub: 'Swift & Secure Delivery to Your Doorstep',
            svg: (
              <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                <rect x="4" y="24" width="36" height="22" rx="4" fill="rgba(251,191,36,0.15)" stroke="#d97706" strokeWidth="2.5"/>
                <path d="M40 30 L56 30 L56 46 L40 46 Z" fill="rgba(251,191,36,0.15)" stroke="#d97706" strokeWidth="2.5"/>
                <path d="M40 36 L52 36" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="16" cy="50" r="5" fill="#d97706"/>
                <circle cx="46" cy="50" r="5" fill="#d97706"/>
              </svg>
            ),
          },
          {
            label: 'Free Insured Shipping',
            sub: 'Your Precious Jewellery, Protected Every Step',
            svg: (
              <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                <path d="M32 6 C32 6 12 14 12 30 L12 44 C12 50 22 57 32 60 C42 57 52 50 52 44 L52 30 C52 14 32 6 32 6Z" fill="rgba(251,191,36,0.15)" stroke="#d97706" strokeWidth="2.5"/>
                <path d="M22 34 C25 39 29 44 32 47 C35 44 41 37 44 30" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="44" cy="22" r="9" fill="rgba(251,191,36,0.2)" stroke="#d97706" strokeWidth="2"/>
                <polyline points="40,22 43,25 49,18" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
          },
          {
            label: 'Return Policy',
            sub: '15 Days Easy Returns Guaranteed',
            svg: (
              <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="25" fill="rgba(251,191,36,0.15)" stroke="#d97706" strokeWidth="2.5"/>
                <path d="M32 16 A16 16 0 1 1 16 32" stroke="#d97706" strokeWidth="3" strokeLinecap="round" fill="none"/>
                <polyline points="14,26 16,32 22,29" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="32" y="37" textAnchor="middle" fontSize="14" fontWeight="900" fill="#d97706">15</text>
              </svg>
            ),
          },
        ].map((item, i) => (
          <div key={i} className="pd-trust-item">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>{item.svg}</div>
            <div style={{ color: '#7c2d12', fontWeight: 700, fontSize: 13, marginBottom: 6, letterSpacing: '0.3px', fontFamily: '"Playfair Display", Georgia, serif' }}>{item.label}</div>
            <div style={{ color: '#92400e', fontSize: 12, lineHeight: 1.6, opacity: 0.75, maxWidth: 160, margin: '0 auto', fontFamily: '"Montserrat", sans-serif' }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* ── PRODUCT INFO + PRICE BREAKUP ── */}
      <ProductInfoAndBreakup product={product} metal={metal} />

      {/* ── MORE FROM THIS COLLECTION ── */}
      <MoreFromCollection currentProductId={productId} category={category} metal={metal} gender={product?.gender} occasion={product?.occasion} liveRate={liveRate} />

      {/* ── ZOOM PANEL ── */}
      {showZoom && mainImage && (
        <div style={{ position: 'fixed', top: '50%', right: 160, transform: 'translateY(-50%)', width: 470, height: 470, borderRadius: 8, border: `1px solid ${accentColor}55`, background: glass, backdropFilter: 'blur(18px)', overflow: 'hidden', boxShadow: `0 24px 80px ${accentGlow}, 0 0 0 1px ${border}`, zIndex: 100, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, background: accentSoft, border: `1px solid ${accentColor}44`, borderRadius: 2, padding: '4px 12px', color: accentColor, fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>🔍 Zoom View</div>
          <div style={{ width: '100%', height: '100%', backgroundImage: `url(${mainImage})`, backgroundSize: '300%', backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`, backgroundRepeat: 'no-repeat', transition: 'background-position 0.05s ease' }} />
        </div>
      )}

      <CustomerFooter />
    </div>
  )
}