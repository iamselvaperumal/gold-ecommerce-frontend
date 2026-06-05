import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/logo.png'
import { addToCartDB } from '../collection/card_section'
import CustomerNavbar from './CustomerNavbar'

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
  rings: 'Rings',
  bangles: 'Bangles',
  earrings: 'Earrings',
  chains: 'Chains',
  necklaces: 'Necklaces',
}

const METAL_LABELS = {
  gold: 'Gold',
  silver: 'Silver',
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#1c1410', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
          More from this collection
        </h2>
        <button
          onClick={() => navigate(`/collection/all?metal=${metal}${gender && gender !== 'all' ? `&gender=${gender}` : ''}${occasion ? `&occasion=${occasion}` : ''}`)}
          style={{ padding: '8px 22px', borderRadius: 999, border: '1.5px solid #1c1410', background: 'transparent', color: '#1c1410', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
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
              style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', border: '1px solid #f0e8e0' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(139,26,26,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
 <div style={{ height: 220, background: '#fdf8f4', overflow: 'hidden' }}
  onMouseEnter={e => {
    const secondImg = p.images?.[1] ? getImageUrl(p.images[1]) : null
    if (secondImg) e.currentTarget.querySelector('img').src = secondImg
  }}
  onMouseLeave={e => {
    if (firstImg) e.currentTarget.querySelector('img').src = firstImg
  }}
>
  {firstImg
    ? <img src={firstImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }} />
    : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 44 }}>💍</div>
  }
</div>

              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1c1410', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 11, color: '#92400e', marginBottom: 6, opacity: 0.75 }}>
                  {p.metal?.toUpperCase()} {p.grade?.toUpperCase()}{p.net_weight ? ` • ${parseFloat(p.net_weight)}gm` : ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: '#1c1410', fontFamily: 'monospace' }}>
                    {price > 0 ? `₹${price.toLocaleString('en-IN')}` : '—'}
                  </span>
                  {hasDiscount && (
                    <span style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <div style={{ fontSize: 11, color: '#8B1A1A', fontWeight: 700, marginTop: 3 }}>
                    {discountPct}% Off
                  </div>
                )}
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

  // ── Exact same as AddProduct calcAll ──
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
    <div style={{
      maxWidth: 1600,
      margin: '0 auto',
      padding: '100px 40px 80px',
      position: 'relative',
      zIndex: 5,
    }}>

      {/* ── Product Information ── */}
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde8c8 60%, #fef9f0 100%)',
        borderRadius: 16,
        padding: '36px 48px',
        marginBottom: 20,
      }}>
        <div style={{ color: '#7c2d12', fontWeight: 700, fontSize: 40, marginBottom: 20 }}>
          Product Information
        </div>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: '30px 70px',
          display: 'inline-block',
          minWidth: 300,
          boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
        }}>
          <div style={{ color: '#7c2d12', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Metal and Purity</div>
          <div style={{ color: '#92400e', fontSize: 16, marginBottom: 16 }}>{metalLabel} {purityLabel}</div>
          <div style={{ color: '#7c2d12', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Weight</div>
          <div style={{ color: '#92400e', fontSize: 16 }}>{netWt > 0 ? `${netWt}gms` : crossWt > 0 ? `${crossWt}gms` : '—'}</div>
        </div>
      </div>

      {/* ── Price Breakup ── */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '36px 48px',
        marginBottom: 60,
        boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}>
        <div style={{ color: '#7c2d12', fontWeight: 700, fontSize: 40, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
          Price Breakup
          {!liveRate && <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400 }}>Loading rates...</span>}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 18 }}>
          <thead>
            <tr style={{ borderBottom: '1.5px solid rgba(120,53,15,0.15)' }}>
              {['Component', 'Rate', 'Weight', 'Value', 'Discount', 'Final Value'].map((h, i) => (
                <th key={h} style={{
                  textAlign: 'left', padding: '10px 16px',
                  color: '#78350f', fontWeight: 600, fontSize: 20,
                  minWidth: i === 0 ? 200 : 110,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>

            {/* Metal header */}
            <tr>
              <td colSpan={6} style={{ padding: '28px 16px 12px', color: '#92400e', fontWeight: 600, fontSize: 18 }}>
                {metalLabel}
              </td>
            </tr>

            {/* Metal row */}
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <td style={{ padding: '10px 16px', color: '#78350f' }}>{purityLabel} {metalLabel}</td>
              <td style={{ padding: '10px 16px', color: '#78350f' }}>{todayRate ? todayRate.toLocaleString('en-IN') : '—'}</td>
              <td style={{ padding: '10px 16px', color: '#78350f' }}>{netWt || '—'}</td>
              <td style={{ padding: '10px 16px', color: '#78350f' }}>{inr(goldValue)}</td>
              <td style={{ padding: '10px 16px', color: '#78350f' }}>₹0</td>
              <td style={{ padding: '10px 16px', color: '#78350f', fontWeight: 500 }}>{inr(goldValue)}</td>
            </tr>

            {/* Stone */}
            {stoneVal > 0 && <>
              <tr>
                <td colSpan={6} style={{ padding: '18px 16px 6px', color: '#92400e', fontWeight: 600, fontSize: 14 }}>Stone details</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <td style={{ padding: '10px 16px', color: '#78350f' }}>Stone</td>
                <td style={{ padding: '10px 16px', color: '#78350f' }}>—</td>
                <td style={{ padding: '10px 16px', color: '#78350f' }}>{stoneWt > 0 ? stoneWt : '—'}</td>
                <td style={{ padding: '10px 16px', color: '#78350f' }}>{inr(stoneVal)}</td>
                <td style={{ padding: '10px 16px', color: '#78350f' }}>-</td>
                <td style={{ padding: '10px 16px', color: '#78350f', fontWeight: 500 }}>{inr(stoneVal)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <td style={{ padding: '10px 16px', color: '#78350f' }}>Total Stone Value</td>
                <td /><td />
                <td style={{ padding: '10px 16px', color: '#78350f' }}>{inr(stoneVal)}</td>
                <td style={{ padding: '10px 16px', color: '#78350f' }}>-</td>
                <td style={{ padding: '10px 16px', color: '#78350f', fontWeight: 500 }}>{inr(stoneVal)}</td>
              </tr>
            </>}

            {/* Making Charges */}
            <tr style={{ borderBottom: '1.5px solid rgba(120,53,15,0.15)' }}>
              <td style={{ padding: '18px 10px 16px ', color: '#7c2d12', fontWeight: 600 }}>Making Charges</td>
              <td /><td />
              <td style={{ padding: '10px 16px', color: '#78350f' }}>{inr(makingValue)}</td>
              <td style={{ padding: '10px 16px', color: '#78350f' }}>{discountOnMaking ? inr(discountOnMaking) : '₹0'}</td>
              <td style={{ padding: '10px 16px', color: '#78350f', fontWeight: 500 }}>{inr(makingFinal)}</td>
            </tr>

            {/* Total */}
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <td style={{ padding: '18px 10px 16px', color: '#7c2d12', fontWeight: 700, fontSize: 18 }}>Total</td>
              <td /><td />
              <td style={{ padding: '12px 16px', color: '#7c2d12', fontWeight: 700 }}>{inr(subtotalValue)}</td>
              <td style={{ padding: '12px 16px', color: '#7c2d12', fontWeight: 700 }}>{subtotalDiscount ? inr(subtotalDiscount) : '₹0'}</td>
              <td style={{ padding: '12px 16px', color: '#7c2d12', fontWeight: 700 }}>{inr(subtotalFinal)}</td>
            </tr>

            {/* GST */}
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <td style={{ padding: '18px 10px 16px', color: '#78350f' }}>GST(3%)</td>
              <td /><td />
              <td style={{ padding: '10px 16px', color: '#78350f' }}>{inr(gstValue)}</td>
              <td />
              <td style={{ padding: '10px 16px', color: '#78350f' }}>{inr(gstFinal)}</td>
            </tr>

            {/* Grand Total */}
            <tr>
              <td style={{ padding: '18px 10px 16px', color: '#7c2d12', fontWeight: 800, fontSize: 20 }}>Grand Total</td>
              <td /><td />
              <td style={{ padding: '14px 16px', color: '#7c2d12', fontWeight: 800, fontSize: 16 }}>{inr(grandValue)}</td>
              <td />
              <td style={{ padding: '14px 16px', color: '#7c2d12', fontWeight: 800, fontSize: 16 }}>{inr(grandFinal)}</td>
            </tr>

          </tbody>
        </table>
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

      api
        .get(`/jewelry-products/?category=${category}&metal=${metal}`)
        .then(res => {
          setProducts(Array.isArray(res.data) ? res.data : [])
          setLoading(false)
        })
        .catch(err => {
          console.error('Product display fetch error:', err)
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
    if (productImages.length > 0) {
      setMainImage(productImages[0])
    }
  }, [productImages])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animId
    let particles = []
    const mouse = { x: null, y: null, radius: 150 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const mouseMove = e => {
      mouse.x = e.x
      mouse.y = e.y
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', mouseMove)
    resize()

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 4 + 2
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < mouse.radius && dist > 0) {
            const f = (mouse.radius - dist) / mouse.radius
            this.x += (dx / dist) * f * 2
            this.y += (dy / dist) * f * 2
          }
        }
      }

      draw() {
        ctx.fillStyle = isGold
          ? dark ? 'rgba(251,191,36,0.75)' : 'rgba(217,119,6,0.6)'
          : dark ? 'rgba(192,192,192,0.75)' : 'rgba(100,116,139,0.6)'

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.beginPath()

        const spikes = 5
        const outerR = this.size
        const innerR = this.size * 0.4

        for (let i = 0; i < spikes * 2; i++) {
          const r = i % 2 === 0 ? outerR : innerR
          const a = (i * Math.PI) / spikes - Math.PI / 2

          if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
          else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
        }

        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
    }

    const init = () => {
      particles = []
      for (let i = 0; i < 60; i++) particles.push(new Particle())
    }

    const connect = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const d = Math.sqrt(dx * dx + dy * dy)

          if (d < 150) {
            ctx.strokeStyle = isGold
              ? `rgba(251,191,36,${(1 - d / 150) * 0.35})`
              : `rgba(192,192,192,${(1 - d / 150) * 0.35})`

            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.update()
        p.draw()
      })
      connect()
      animId = requestAnimationFrame(animate)
    }

    init()
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', mouseMove)
      cancelAnimationFrame(animId)
    }
  }, [dark, metal])


  const loadRazorpay = () => new Promise(resolve => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  const handleBuy = async () => {
    if (!product || !displayPrice) return
    const loaded = await loadRazorpay()
    if (!loaded) { alert('Razorpay load failed'); return }

    const options = {
      key: 'rzp_test_SqmXZHA3RWz5ua',
      amount: Math.round(displayPrice * qty * 100),
      currency: 'INR',
      name: 'BitByte Jewellers',
      description: productName,
      handler: function (response) {
        alert('✅ Payment Successful! ID: ' + response.razorpay_payment_id)
      },
      prefill: { name: '', email: '', contact: '' },
      theme: { color: accentColor },
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }


  const basePrice = Number(product?.price) || 0

  const displayPrice = basePrice > 0 ? basePrice : null
  const calculatedWeightText = product?.net_weight ? `${parseFloat(product.net_weight)} gm` : '—'

  const productName = product?.name || product?.title || 'Jewellery Product'
  const productDesc =
    product?.desc ||
    product?.description ||
    product?.short_description ||
    'Premium handcrafted jewellery from BitByte Jewellers.'

  const productTag = product?.tag || product?.label || (isGold ? 'Premium' : 'Minimal')
  const tagStyle = TAG_COLORS[productTag] || {
    bg: 'rgba(255,255,255,0.1)',
    border: 'rgba(255,255,255,0.2)',
    color: text,
  }

  const handleMouseMove = (e) => {
    const rect = imageRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    setZoomPos({
      x: Math.max(0, Math.min(100, (px / rect.width) * 100)),
      y: Math.max(0, Math.min(100, (py / rect.height) * 100)),
    })
    setZoomPixel({ x: px, y: py })
  }

  const handleAddToCart = async () => {
    if (!product) return
    const result = await addToCartDB(product.id, qty)
    if (result) {
      setShowAdded(true)
      setTimeout(() => setShowAdded(false), 1600)
    }
  }


  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FDF5EE', color: text, display: 'grid', placeItems: 'center', fontFamily: '"Inter",system-ui,sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              border: `4px solid ${border}`,
              borderTopColor: accentColor,
              margin: '0 auto 18px',
              animation: 'spin 0.9s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h2 style={{ margin: 0, color: accentColor }}>Loading product...</h2>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: '#FDF5EE', color: text, display: 'grid', placeItems: 'center', fontFamily: '"Inter",system-ui,sans-serif', padding: 20 }}>
        <div
          style={{
            maxWidth: 520,
            textAlign: 'center',
            background: glass,
            border: `1px solid ${border}`,
            borderRadius: 28,
            padding: 35,
            backdropFilter: 'blur(18px)',
          }}
        >
          <h1 style={{ color: accentColor, marginTop: 0 }}>Product not found</h1>
          <p style={{ color: subtext }}>
            This product is not available now. Please go back and select another product.
          </p>
          <button
            onClick={() => {
              const role = localStorage.getItem('role')
              if (role === 'customer') navigate('/customer')
              else if (role === 'admin') navigate('/admin')
              else if (role === 'super_admin') navigate('/super-admin')
              else navigate('/')
            }}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '13px 24px',
              background: accentColor,
              color: isGold ? '#111827' : '#020617',
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: bg,
        color: text,
        fontFamily: '"Inter",system-ui,sans-serif',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.8s ease, color 0.4s ease',
      }}
    >
      <style>{`
        @keyframes float-orb {
          0% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-50px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
          100% { transform: translate(0,0) scale(1); }
        }

        @keyframes antigravity {
          0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          10% { opacity: var(--op); }
          90% { opacity: var(--op); }
          100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shine {
          0% { left: -80%; }
          100% { left: 120%; }
        }

        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 20px ${accentGlow}; }
          50% { box-shadow: 0 0 45px ${accentGlow}; }
        }

        .pd-main {
          animation: fadeInUp 0.55s ease both;
        }

        .pd-image-card:hover .pd-main-img {
          transform: scale(1.06) rotate(1deg);
        }

        .pd-shine {
          position: absolute;
          top: 0;
          left: -80%;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: skewX(-20deg);
          opacity: 0;
        }

        .pd-image-card:hover .pd-shine {
          opacity: 1;
          animation: shine 0.7s ease;
        }

        .thumb:hover {
          transform: translateY(-4px) scale(1.03);
        }

        .weight-btn:hover,
        .action-btn:hover,
        .top-btn:hover {
          transform: translateY(-2px);
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }

        input[type=number] {
          -moz-appearance: textfield;
          appearance: textfield;
        }

        @media (max-width: 900px) {
          .pd-grid {
            grid-template-columns: 1fr !important;
          }

          .pd-navbar {
            padding: 16px 18px !important;
          }

          .pd-wrap {
            padding: 26px 18px 70px !important;
          }

          .pd-title {
            font-size: 38px !important;
          }
        }
      `}</style>

      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.4,
        }}
      />

      <div
        style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(90px)',
          animation: 'float-orb 20s infinite ease-in-out',
          zIndex: 0,
          top: '5%',
          left: '5%',
          width: 420,
          height: 420,
          background: accentSoft,
        }}
      />

      <div
        style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(90px)',
          animation: 'float-orb 20s infinite ease-in-out',
          animationDelay: '-7s',
          zIndex: 0,
          bottom: '5%',
          right: '5%',
          width: 500,
          height: 500,
          background: accentSoft,
        }}
      />

      {PARTICLES.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: '-100px',
            width: p.size,
            height: p.size,
            borderRadius: '40% 60% 60% 40%/40% 40% 60% 60%',
            border: `1px solid ${accentColor}55`,
            opacity: p.opacity,
            animation: `antigravity ${p.duration}s ${p.delay}s infinite linear`,
            '--op': p.opacity,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}

      {/* Navbar */}
      <CustomerNavbar />

      <main
        className="pd-wrap"
        style={{
          position: 'relative',
          zIndex: 5,
          padding: '48px 40px 80px',
          maxWidth: 1250,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 16px',
            borderRadius: 999,
            background: text,
            border: `1px solid ${accentColor}55`,
            color: accentColor,
            fontWeight: 950,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontSize: 12,
            marginBottom: 22,
          }}
        >
          ✦ {METAL_LABELS[metal] || metal} {CATEGORY_LABELS[category] || category}
        </div>

        <section
  className="pd-grid pd-main"
  style={{
    display: 'grid',
    gridTemplateColumns: '600px 600px',
    gap: 34,
    alignItems: 'start',
  }}
>
          {/* Image Side */}
          <div
            className="pd-image-card"
            style={{
              position: 'relative',
              background: glass,
              border: `1px solid ${border}`,
              borderRadius: 34,
              overflow: 'hidden',
              width: '600px',
              height: '700px',
              flexShrink: 0,
              backdropFilter: 'blur(18px)',
              boxShadow: `0 24px 80px ${dark ? 'rgba(0,0,0,0.35)' : 'rgba(15,23,42,0.12)'}`,
            }}
          >
            <div className="pd-shine" />

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at center, ${accentSoft}, transparent 55%)`,
              }}
            />

            <div
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              style={{
                position: 'relative',
                height: 430,
                display: 'grid',
                placeItems: 'center',
                padding: 30,
                cursor: 'none',
              }}
            >

              {mainImage && (
                <img
                  className="pd-main-img"
                  src={mainImage}
                  onError={e => { e.currentTarget.style.display = 'none' }}

                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    filter: `drop-shadow(0 30px 45px ${dark ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.22)'})`,
                    transition: 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                />

              )}

              {showZoom && mainImage && (
                <div style={{
                  position: 'absolute',
                  left: zoomPixel.x - 100,
                  top: zoomPixel.y - 100,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  border: `3px solid ${accentColor}`,
                  boxShadow: `0 0 0 2px ${dark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'}, 0 8px 32px rgba(0,0,0,0.6)`,
                  backgroundImage: `url(${mainImage})`,
                  backgroundSize: '400%',
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundRepeat: 'no-repeat',
                  pointerEvents: 'none',
                  zIndex: 20,
                }} />
              )}
            </div>


            <div style={{
  position: 'absolute',
  bottom: '16px',
  left: 0,
  right: 0,
  padding: '12px 24px',
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
  justifyContent: 'center',
}}>
              {productImages.map((img, index) => (
                <button
                  key={index}
                  className="thumb"
                  onClick={() => setMainImage(img)}
                  style={{
                    width: 82,
                    height: 82,
                    borderRadius: 20,
                    border: mainImage === img ? `2px solid ${accentColor}` : `1px solid ${border}`,
                    background: cardBg,
                    padding: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: mainImage === img ? `0 0 25px ${accentGlow}` : 'none',
                  }}
                >
                  <img
                    src={img}
                    alt={`${productName} ${index + 1}`}
                    onError={e => {
                      const fallback = isGold
                        ? '/img/gold/gold-ring-1.png'
                        : '/img/silver/silver-ring-1.png'
                      if (e.currentTarget.src !== window.location.origin + fallback) {
                        e.currentTarget.src = fallback
                      }
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </button>
              ))}
            </div>
          </div>

        {/* Detail Side Zoom Corecion*/}
<div
  style={{
    background: glass,
    border: `1px solid ${border}`,
    borderRadius: 34,
    padding: 32,
    backdropFilter: 'blur(18px)',
    boxShadow: `0 24px 80px ${dark ? 'rgba(0,0,0,0.28)' : 'rgba(15,23,42,0.10)'}`,
    width: '600px',
    height: '700px',
    
  }}
>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div
                style={{
                  display: 'inline-flex',
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: tagStyle.bg,
                  border: `1px solid ${tagStyle.border}`,
                  color: tagStyle.color,
                  fontWeight: 950,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {productTag}
              </div>

              {/* Heart / Wishlist button */}
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
                style={{
                  width: 42, height: 42, borderRadius: '50%',
                  border: wishlisted ? '1.5px solid #e11d48' : `1.5px solid ${border}`,
                  background: wishlisted ? 'rgba(225,29,72,0.15)' : inputBg,
                  backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '20px', transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
                title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {wishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            <h1
              className="pd-title"
              style={{
                margin: '0 0 10px',
                fontSize: 32,
                lineHeight: 1.1,
                fontWeight: 950,
                letterSpacing: '-0.02em',
                color: text,
              }}
            >
              {productName}
            </h1>

            <p
              style={{
                margin: '0 0 24px',
                color: subtext,
                fontSize: 16,
                lineHeight: 1.7,
                maxWidth: 620,
              }}
            >
              {productDesc}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
                marginBottom: 26,
              }}
            >
              <div
                style={{
                  background: cardBg,
                  border: `1px solid ${border}`,
                  borderRadius: 20,
                  padding: 16,
                }}
              >
                <div style={{ color: subtext, fontSize: 12, fontWeight: 800 }}>Metal</div>
                <div style={{ color: text, fontSize: 18, fontWeight: 950 }}>
                  {METAL_LABELS[metal] || metal}
                </div>
              </div>

              <div
                style={{
                  background: cardBg,
                  border: `1px solid ${border}`,
                  borderRadius: 20,
                  padding: 16,
                }}
              >
                <div style={{ color: subtext, fontSize: 12, fontWeight: 800 }}>Category</div>
                <div style={{ color: text, fontSize: 18, fontWeight: 950 }}>
                  {CATEGORY_LABELS[category] || category}
                </div>
              </div>

              <div
                style={{
                  background: cardBg,
                  border: `1px solid ${border}`,
                  borderRadius: 20,
                  padding: 16,
                }}
              >
                <div style={{ color: subtext, fontSize: 12, fontWeight: 800 }}>Weight</div>
                <div style={{ color: text, fontSize: 18, fontWeight: 950 }}>
                  {calculatedWeightText}
                </div>
              </div>
            </div>

            <div
              style={{
                background: `linear-gradient(135deg, ${accentSoft}, transparent)`,
                border: `1px solid ${accentColor}44`,
                borderRadius: 24,
                padding: 22,
                marginBottom: 24,
              }}
            >
              <div style={{ color: subtext, fontSize: 13, fontWeight: 800, marginBottom: 8 }}>
                Price
              </div>

              {(() => {
                const discountPct = parseFloat(product?.wastage_charge) || 0
                const originalAmt = parseFloat(product?.original_price) || 0
                const hasDiscount = discountPct > 0 && originalAmt > 0 && displayPrice

                return (
                  <>
                    {/* % Off badge */}
                    {hasDiscount && (
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{
                          background: 'rgba(74,222,128,0.15)',
                          border: '1px solid rgba(74,222,128,0.4)',
                          color: '#4ade80',
                          fontSize: '12px', fontWeight: 800,
                          padding: '4px 12px', borderRadius: '999px'
                        }}>
                          {discountPct}% Off
                        </span>
                      </div>
                    )}

                    {/* Final price big */}
                    <div style={{
                      color: text,
                      fontSize: 36, fontWeight: 950,
                      letterSpacing: '-0.03em', lineHeight: 1.1
                    }}>
                      {displayPrice ? `₹${displayPrice.toLocaleString('en-IN')}` : 'Contact for Price'}
                    </div>

                    {/* Original struck + savings — only if discount */}
                    {hasDiscount && (
                      <>
                        <div style={{
                          color: '#e76b12', fontSize: 17,
                          fontWeight: 500, textDecoration: 'line-through',
                          marginTop: '5px', opacity: 0.85
                        }}>
                          ₹{originalAmt.toLocaleString('en-IN')}
                        </div>
                        <div style={{
                          color: '#4ade80', fontSize: 13,
                          fontWeight: 700, marginTop: '5px'
                        }}>
                          You save ₹{(originalAmt - displayPrice).toLocaleString('en-IN')}
                        </div>
                      </>
                    )}
                  </>
                )
              })()}


              {!product.is_active && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '10px 16px', marginBottom: '16px', color: '#f87171', fontWeight: 700, fontSize: '13px', textAlign: 'center' }}>
                  ⚠️ Currently Unavailable
                </div>
              )}

              {/* <div style={{ color: subtext, marginTop: 6, fontSize: 13 }}>
                Final price may vary based on live metal rate, making charge and selected weight.
              </div> */}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 26,
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: `1px solid ${border}`,
                  borderRadius: 999,
                  overflow: 'hidden',
                  background: inputBg,
                }}
              >
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    width: 44,
                    height: 44,
                    border: 'none',
                    background: 'transparent',
                    color: text,
                    fontSize: 20,
                    fontWeight: 950,
                    cursor: 'pointer',
                  }}
                >
                  -
                </button>

                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={e => setQty(Math.max(1, Number(e.target.value) || 1))}
                  style={{
                    width: 55,
                    height: 44,
                    border: 'none',
                    outline: 'none',
                    textAlign: 'center',
                    background: 'transparent',
                    color: text,
                    fontWeight: 950,
                    fontSize: 16,
                  }}
                />

                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{
                    width: 44,
                    height: 44,
                    border: 'none',
                    background: 'transparent',
                    color: text,
                    fontSize: 20,
                    fontWeight: 950,
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>

              <span style={{ color: subtext, fontWeight: 700 }}>
                Quantity
              </span>
            </div>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button
                className="action-btn"
                onClick={handleAddToCart}
                style={{
                  flex: '1 1 220px',
                  border: 'none',
                  borderRadius: 999,
                  padding: '16px 24px',
                  background: `linear-gradient(135deg, ${accentColor}, ${isGold ? '#f59e0b' : '#94a3b8'})`,
                  color: '#020617',
                  fontWeight: 950,
                  fontSize: 15,
                  cursor: 'pointer',
                  boxShadow: `0 18px 42px ${accentGlow}`,
                  animation: 'pulseGlow 2.2s ease-in-out infinite',
                  transition: 'all 0.2s ease',
                }}
              >
                {showAdded ? '✓ Added to Cart' : '🛒 Add to Cart'}
              </button>

              <button
                className="action-btn"
                onClick={handleBuy}
                disabled={!product.is_active}
                style={{
                  flex: '1 1 180px', border: 'none', borderRadius: 999,
                  padding: '16px 24px',
                  background: product.is_active ? `linear-gradient(135deg, #22c55e, #16a34a)` : 'rgba(100,100,100,0.3)',
                  color: '#fff', fontWeight: 950, fontSize: 15,
                  cursor: product.is_active ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                }}
              >
                💳 Buy
              </button>
            </div>
          </div>
        </section>
      </main>


      {/* ── TRUST BADGES ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 0,
        marginTop: 80,
        padding: '40px 0 20px',
        borderTop: '2px solid rgba(146,64,14,0.10)',
        position: 'relative',
        zIndex: 5,
      }}>
        {[
          {
            label: 'BIS Hallmark Jewellery',
            sub: 'Authenticity Guaranteed, Purity Assured',
            svg: (
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <polygon points="32,5 42,17 57,17 57,32 42,47 32,59 22,47 7,32 7,17 22,17"
                  fill="rgba(251,191,36,0.15)" stroke="#d97706" strokeWidth="2.5" />
                <polygon points="32,12 40,22 52,22 52,32 40,42 32,52 24,42 12,32 12,22 24,22"
                  fill="rgba(251,191,36,0.08)" stroke="#d97706" strokeWidth="1.5" />
                <polyline points="22,32 28,38 42,24"
                  stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="16" y1="50" x2="48" y2="50" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            ),
          },
          {
            label: 'Fast Shipping',
            sub: 'Swift & Secure Delivery to Your Doorstep',
            svg: (
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="4" y="24" width="36" height="22" rx="4"
                  fill="rgba(251,191,36,0.15)" stroke="#d97706" strokeWidth="2.5" />
                <path d="M40 30 L56 30 L56 46 L40 46 Z"
                  fill="rgba(251,191,36,0.15)" stroke="#d97706" strokeWidth="2.5" />
                <path d="M40 36 L52 36" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="50" r="5" fill="#d97706" />
                <circle cx="46" cy="50" r="5" fill="#d97706" />
                <path d="M10 32 L6 32" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M10 26 L14 26" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            ),
          },
          {
            label: 'Free Insured Shipping',
            sub: 'Your Precious Jewellery, Protected Every Step of the Way',
            svg: (
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path d="M32 6 C32 6 12 14 12 30 L12 44 C12 50 22 57 32 60 C42 57 52 50 52 44 L52 30 C52 14 32 6 32 6Z"
                  fill="rgba(251,191,36,0.15)" stroke="#d97706" strokeWidth="2.5" />
                <path d="M22 34 C25 39 29 44 32 47 C35 44 41 37 44 30"
                  stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="44" cy="22" r="9"
                  fill="rgba(251,191,36,0.2)" stroke="#d97706" strokeWidth="2" />
                <polyline points="40,22 43,25 49,18"
                  stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
          },
          {
            label: 'Return Policy',
            sub: '15 Days Easy Returns Guaranteed',
            svg: (
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="25"
                  fill="rgba(251,191,36,0.15)" stroke="#d97706" strokeWidth="2.5" />
                <path d="M32 16 A16 16 0 1 1 16 32"
                  stroke="#d97706" strokeWidth="3" strokeLinecap="round" fill="none" />
                <polyline points="14,26 16,32 22,29"
                  stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <text x="32" y="37" textAnchor="middle" fontSize="14" fontWeight="900" fill="#d97706">15</text>
              </svg>
            ),
          },
        ].map((item, i) => (
          <div key={i} style={{
            textAlign: 'center',
            padding: '24px 20px',
            borderRight: i < 3 ? '1px solid rgba(146,64,14,0.10)' : 'none',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              {item.svg}
            </div>
            <div style={{ color: '#92400e', fontWeight: 800, fontSize: 15, marginBottom: 8 }}>
              {item.label}
            </div>
            <div style={{ color: '#78350f', fontSize: 13, lineHeight: 1.6, opacity: 0.75, maxWidth: 180, margin: '0 auto' }}>
              {item.sub}
            </div>
          </div>
        ))}
      </div>


      {/* ── PRODUCT INFORMATION + PRICE BREAKUP ── */}
      <ProductInfoAndBreakup product={product} metal={metal} />

      {/* ── MORE FROM THIS COLLECTION ── */}
<MoreFromCollection
  currentProductId={productId}
  category={category}
  metal={metal}
  gender={product?.gender}
  occasion={product?.occasion}
  liveRate={liveRate}
/>

      {/* Zoom Panel */}
      {showZoom && mainImage && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            right: 160,
            transform: 'translateY(-50%)',
            width: 470,
            height: 470,
            borderRadius: 24,
            border: `1px solid ${accentColor}55`,
            background: glass,
            backdropFilter: 'blur(18px)',
            overflow: 'hidden',
            boxShadow: `0 24px 80px ${accentGlow}, 0 0 0 1px ${border}`,
            zIndex: 100,
            pointerEvents: 'none',
          }}
        >
          {/* Zoom label */}
          <div style={{
            position: 'absolute', top: 12, left: 12, zIndex: 2,
            background: accentSoft, border: `1px solid ${accentColor}44`,
            borderRadius: 999, padding: '4px 12px',
            color: accentColor, fontSize: 11, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            🔍 Zoom View
          </div>

          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${mainImage})`,
              backgroundSize: '300%',
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundRepeat: 'no-repeat',
              transition: 'background-position 0.05s ease',
            }}
          />



        </div>
      )}

    </div>

  )

}