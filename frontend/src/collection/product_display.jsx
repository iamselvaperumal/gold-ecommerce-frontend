import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/logo.png'
import { addToCart } from './card_section'

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
const imageRef = useRef(null)

  const isGold = metal === 'gold'
  const accentColor = isGold ? '#fbbf24' : '#c0c0c0'
  const accentSoft = isGold ? 'rgba(251,191,36,0.18)' : 'rgba(192,192,192,0.18)'
  const accentGlow = isGold ? 'rgba(251,191,36,0.32)' : 'rgba(192,192,192,0.32)'

  const bg = dark ? '#020617' : '#f8fafc'
  const text = dark ? '#f8fafc' : '#020617'
  const subtext = dark ? '#94a3b8' : '#64748b'
  const border = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  const glass = dark ? 'rgba(15,23,42,0.72)' : 'rgba(255,255,255,0.78)'
  const cardBg = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.035)'
  const inputBg = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'

const getImageUrl = img => {
  if (!img) return null
  let imagePath = typeof img === 'object'
    ? (img.image || img.url || img.file || img.path || img.image_url || img.product_image || '')
    : img
  if (!imagePath || typeof imagePath !== 'string') return null
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
  return `${API_BASE}/${imagePath.replace(/^\/+/, '')}`
}

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
    handler: function(response) {
      alert('✅ Payment Successful! ID: ' + response.razorpay_payment_id)
    },
    prefill: { name: '', email: '', contact: '' },
    theme: { color: accentColor },
  }
  const rzp = new window.Razorpay(options)
  rzp.open()
}  


  const basePrice =
    Number(product?.price) ||
    Number(product?.selling_price) ||
    Number(product?.offer_price) ||
    Number(product?.amount) ||
    0

  const displayPrice = basePrice > 0 ? basePrice : null
  const calculatedWeightText = product?.weight_grams ? `${parseFloat(product.weight_grams)} gm` : '—'

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

  const handleAddToCart = () => {
    if (!product) return

    const cartProduct = {
      ...product,
      id: product.id,
      name: productName,
      title: productName,
      desc: productDesc,
      description: productDesc,
      img: mainImage,
      image: mainImage,
      metal,
      category,
      quantity: qty,
      price: displayPrice || 0,
    }

    addToCart(cartProduct)
    setShowAdded(true)

    setTimeout(() => {
      setShowAdded(false)
    }, 1600)
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: bg,
          color: text,
          display: 'grid',
          placeItems: 'center',
          fontFamily: '"Inter",system-ui,sans-serif',
        }}
      >
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
      <div
        style={{
          minHeight: '100vh',
          background: bg,
          color: text,
          display: 'grid',
          placeItems: 'center',
          fontFamily: '"Inter",system-ui,sans-serif',
          padding: 20,
        }}
      >
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
      <div
        className="pd-navbar"
        style={{
          position: 'relative',
          zIndex: 10,
          background: glass,
          borderBottom: `1px solid ${border}`,
          padding: '18px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={logo}
            alt="BitByte"
            style={{
              width: 60,
              height: 50,
              borderRadius: 10,
              objectFit: 'contain',
            }}
          />
          <div>
            <div style={{ color: accentColor, fontWeight: 900, fontSize: 18 }}>
              BITBYTE JEWELLERS
            </div>
            <div style={{ color: subtext, fontSize: 12, fontWeight: 700 }}>
              Product Details
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="top-btn"
            onClick={() => navigate(-1)}
            style={{
              border: `1px solid ${border}`,
              background: inputBg,
              color: text,
              borderRadius: 999,
              padding: '11px 16px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ← Back
          </button>

          <button
            className="top-btn"
            onClick={() => setDark(!dark)}
            style={{
              border: `1px solid ${border}`,
              background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              color: text,
              borderRadius: 999,
              padding: '11px 16px',
              fontWeight: 900,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {dark ? '☀ Light' : '🌙 Dark'}
          </button>

          <button
            className="top-btn"
            onClick={() => navigate('/cart')}
            style={{
              border: 'none',
              background: `linear-gradient(135deg, ${accentColor}, ${isGold ? '#f59e0b' : '#94a3b8'})`,
              color: '#020617',
              borderRadius: 999,
              padding: '11px 18px',
              fontWeight: 950,
              cursor: 'pointer',
              boxShadow: `0 12px 30px ${accentGlow}`,
              transition: 'all 0.2s ease',
            }}
          >
            🛒 Cart
          </button>
        </div>
      </div>

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
            background: accentSoft,
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
            gridTemplateColumns: '1fr 1fr',
            gap: 34,
            alignItems: 'stretch',
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
              minHeight: 540,
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
<img
  className="pd-main-img"
  src={mainImage || ''}
  onError={e => { e.currentTarget.style.display = 'none' }}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: `drop-shadow(0 30px 45px ${dark ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.22)'})`,
                  transition: 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              />

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

            <div
              style={{
                position: 'relative',
                padding: '0 24px 26px',
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
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

          {/* Detail Side */}
          <div
            style={{
              background: glass,
              border: `1px solid ${border}`,
              borderRadius: 34,
              padding: 32,
              backdropFilter: 'blur(18px)',
              boxShadow: `0 24px 80px ${dark ? 'rgba(0,0,0,0.28)' : 'rgba(15,23,42,0.10)'}`,
            }}
          >
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
                marginBottom: 18,
              }}
            >
              {productTag}
            </div>

            <h1
              className="pd-title"
              style={{
                margin: '0 0 14px',
                fontSize: 54,
                lineHeight: 1.02,
                fontWeight: 950,
                letterSpacing: '-0.04em',
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
                <div style={{ color: accentColor, fontSize: 18, fontWeight: 950 }}>
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

              <div
                style={{
                  color: accentColor,
                  fontSize: 36,
                  fontWeight: 950,
                  letterSpacing: '-0.03em',
                }}
              >
                {displayPrice ? `₹${displayPrice.toLocaleString('en-IN')}` : 'Contact for Price'}
              </div>

              {!product.is_active && (
  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '10px 16px', marginBottom: '16px', color: '#f87171', fontWeight: 700, fontSize: '13px', textAlign: 'center' }}>
    ⚠️ Currently Unavailable
  </div>
)}

              <div style={{ color: subtext, marginTop: 6, fontSize: 13 }}>
                Final price may vary based on live metal rate, making charge and selected weight.
              </div>
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