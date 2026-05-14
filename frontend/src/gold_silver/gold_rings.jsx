import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { addToCart } from '../collection/card_section'

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i, size: Math.random() * 50 + 8, x: Math.random() * 100,
  delay: Math.random() * 8, duration: Math.random() * 12 + 15, opacity: Math.random() * 0.18 + 0.04,
}))

const WEIGHTS = [
  { label: 'All Weights', grams: null },
  { label: '50 mg',  grams: 0.05 },
  { label: '100 mg', grams: 0.10 },
  { label: '150 mg', grams: 0.15 },
  { label: '200 mg', grams: 0.20 },
  { label: '500 mg', grams: 0.50 },
  { label: '1 gm',   grams: 1    },
  { label: '2 gm',   grams: 2    },
  { label: '4 gm',   grams: 4    },
  { label: '8 gm',   grams: 8    },
]

// const GOLD_RINGS = [
//   { id: 1, name: 'Blossom Ring', desc: 'Floral petal design with a vintage soul', img: '/img/gold/gold-ring-1.png', tag: 'Bestseller' },
//   { id: 2, name: 'Solitaire Twist', desc: 'Classic twisted shank with a brilliant center stone', img: '/img/gold/gold-ring-2.png', tag: 'Bridal' },
//   { id: 3, name: 'Eternity Band', desc: 'Seamless band with continuous diamond-cut detailing', img: '/img/gold/gold-ring-3.png', tag: 'Premium' },
//   { id: 4, name: 'Crown Solitaire', desc: 'Six-prong crown setting for the statement piece', img: '/img/gold/gold-ring-4.png', tag: 'Statement' },
//   { id: 5, name: 'Duo Stack Ring', desc: 'Double-band stackable ring for everyday elegance', img: '/img/gold/gold-ring-5.png', tag: 'Stackable' },
// ]




const TAG_COLORS = {
  Bestseller: { bg: 'rgba(52,211,153,0.2)', border: 'rgba(52,211,153,0.5)', color: '#34d399' },
  Bridal:     { bg: 'rgba(244,114,182,0.2)', border: 'rgba(244,114,182,0.5)', color: '#f472b6' },
  Premium:    { bg: 'rgba(251,191,36,0.2)', border: 'rgba(251,191,36,0.5)', color: '#fbbf24' },
  Statement:  { bg: 'rgba(167,139,250,0.2)', border: 'rgba(167,139,250,0.5)', color: '#a78bfa' },
  Stackable:  { bg: 'rgba(34,211,238,0.2)', border: 'rgba(34,211,238,0.5)', color: '#22d3ee' },
}


export default function GoldRings() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(true)
  const [selectedWeight, setSelectedWeight] = useState('All Weights')
  const [hoveredRing, setHoveredRing] = useState(null)
  const [metalType, setMetalType] = useState('22k')   // '22k' | '24k'
  const [metalPrices, setMetalPrices] = useState({ gold22k: null, gold24k: null })
const [goldRings, setGoldRings] = useState([])
const [loading, setLoading] = useState(true)
  const [selectedRing, setSelectedRing] = useState(null)
  const canvasRef = useRef(null)

  const bg       = dark ? '#020617' : '#f8fafc'
  const text     = dark ? '#f8fafc' : '#020617'
  const subtext  = dark ? '#94a3b8' : '#64748b'
  const accent   = dark ? '#22d3ee' : '#2563eb'
  const border   = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  const glass    = dark ? 'rgba(15,23,42,0.65)' : 'rgba(255,255,255,0.7)'
  const cardBg   = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
  const inpBg    = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const inpBorder= dark ? '#374151' : '#d1d5db'
  const optionBg = dark ? '#1a2035' : '#ffffff'
  const goldColor = metalType === '22k' ? '#fbbf24' : '#ffd700'
  const goldGlow  = metalType === '22k' ? 'rgba(251,191,36,0.3)' : 'rgba(255,215,0,0.3)'

  // Try to get prices from API (optional — works even without)
// Add this useEffect in GoldRings.jsx (after the metalPrices useEffect)
useEffect(() => {
  import('../api').then(({ default: api }) => {
    api.get('/jewelry-products/?category=rings&metal=gold')
      .then(res => {
        setGoldRings(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  })
}, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId, particlesArray = []
    const mouse = { x: null, y: null, radius: 150 }
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    const handleMouseMove = (e) => { mouse.x = e.x; mouse.y = e.y }
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    handleResize()

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 4 + 2
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
      }
      update() {
        this.x += this.speedX; this.y += this.speedY
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x, dy = mouse.y - this.y
          let dist = Math.sqrt(dx*dx+dy*dy)
          if (dist < mouse.radius) {
            const f = (mouse.radius - dist) / mouse.radius
            this.x += (dx/dist)*f*2; this.y += (dy/dist)*f*2
          }
        }
      }
      draw() {
        ctx.fillStyle = dark ? 'rgba(251,191,36,0.7)' : 'rgba(217,119,6,0.6)'
        ctx.save(); ctx.translate(this.x, this.y); ctx.beginPath()
        const spikes = 5, outerR = this.size, innerR = this.size * 0.4
        for (let i = 0; i < spikes * 2; i++) {
          const r = i % 2 === 0 ? outerR : innerR
          const angle = (i * Math.PI) / spikes - Math.PI / 2
          if (i === 0) ctx.moveTo(Math.cos(angle)*r, Math.sin(angle)*r)
          else ctx.lineTo(Math.cos(angle)*r, Math.sin(angle)*r)
        }
        ctx.closePath(); ctx.fill(); ctx.restore()
      }
    }

    function init() { particlesArray = []; for (let i = 0; i < 60; i++) particlesArray.push(new Particle()) }
    function connect() {
      for (let a = 0; a < particlesArray.length; a++) for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x-particlesArray[b].x, dy = particlesArray[a].y-particlesArray[b].y, d = Math.sqrt(dx*dx+dy*dy)
        if (d < 150) { ctx.strokeStyle = `rgba(251,191,36,${(1-d/150)*0.4})`; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(particlesArray[a].x,particlesArray[a].y); ctx.lineTo(particlesArray[b].x,particlesArray[b].y); ctx.stroke() }
      }
    }
    function animate() { ctx.clearRect(0,0,canvas.width,canvas.height); particlesArray.forEach(p=>{p.update();p.draw()}); connect(); animationFrameId = requestAnimationFrame(animate) }
    init(); animate()
    return () => { window.removeEventListener('resize',handleResize); window.removeEventListener('mousemove',handleMouseMove); cancelAnimationFrame(animationFrameId) }
  }, [dark])

  const currentRate = metalType === '22k' ? metalPrices.gold22k : metalPrices.gold24k
  const selectedW = WEIGHTS.find(w => w.label === selectedWeight)
  const unitPrice = selectedW?.grams && currentRate ? selectedW.grams * currentRate : null

  const tagStyle = (tag) => TAG_COLORS[tag] || { bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.2)', color: '#fff' }

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: '"Inter",system-ui,sans-serif', position: 'relative', overflow: 'hidden', transition: 'background 0.8s ease, color 0.4s ease' }}>
      <style>{`
        @keyframes float-orb { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes antigravity { 0%{transform:translateY(110vh) rotate(0deg);opacity:0} 10%{opacity:var(--op)} 90%{opacity:var(--op)} 100%{transform:translateY(-20vh) rotate(360deg);opacity:0} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes goldShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes floatRing { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(251,191,36,0.1)} 50%{box-shadow:0 0 40px rgba(251,191,36,0.35)} }
        @keyframes shine { 0%{left:-80%} 100%{left:120%} }
        @keyframes sparkle { 0%,100%{opacity:0;transform:scale(0) rotate(0deg)} 50%{opacity:1;transform:scale(1) rotate(180deg)} }
        .ring-card { animation: fadeInUp 0.5s ease both; }
        .ring-card:nth-child(1){animation-delay:0.05s}
        .ring-card:nth-child(2){animation-delay:0.12s}
        .ring-card:nth-child(3){animation-delay:0.19s}
        .ring-card:nth-child(4){animation-delay:0.26s}
        .ring-card:nth-child(5){animation-delay:0.33s}
        .ring-img-wrap { overflow:hidden; }
        .ring-img-wrap img { transition: transform 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        .ring-card:hover .ring-img-wrap img { transform: scale(1.12) translateY(-4px) !important; }
        .shine-overlay { position:absolute; top:0; left:-80%; width:40%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); transform:skewX(-20deg); opacity:0; transition:opacity 0.3s; }
        .ring-card:hover .shine-overlay { opacity:1; animation: shine 0.6s ease; }
        .sparkle-dot { animation: sparkle 2s ease infinite; }
        .weight-chip { transition: all 0.2s ease; }
        .weight-chip:hover { transform: translateY(-2px); }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; appearance: textfield; }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.4 }} />

      {/* Floating orbs */}
      <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(90px)', animation: 'float-orb 20s infinite ease-in-out', zIndex: 0, top: '5%', left: '5%', width: '420px', height: '420px', background: 'rgba(251,191,36,0.07)' }} />
      <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(90px)', animation: 'float-orb 20s infinite ease-in-out', zIndex: 0, bottom: '5%', right: '5%', width: '500px', height: '500px', background: 'rgba(245,158,11,0.05)', animationDelay: '-7s' }} />

      {PARTICLES.map(p => (
        <div key={p.id} style={{ position: 'absolute', left: `${p.x}%`, bottom: '-100px', width: p.size, height: p.size, borderRadius: '40% 60% 60% 40%/40% 40% 60% 60%', border: `1px solid ${goldColor}44`, opacity: p.opacity, animation: `antigravity ${p.duration}s ${p.delay}s infinite linear`, '--op': p.opacity, pointerEvents: 'none', zIndex: 0 }} />
      ))}

      {/* Navbar */}
      <div style={{ position: 'relative', zIndex: 10, background: glass, borderBottom: `1px solid ${border}`, padding: '18px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(16px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logo} alt="BitByte Logo" style={{ width: 60, height: 50, borderRadius: '10px', objectFit: 'contain' }} />
          <span style={{ color: goldColor, fontWeight: 700, fontSize: '14px' }}>🏅 Gold Rings Collection</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => navigate('/collection/rings')} style={{ padding: '8px 16px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.35)', color: '#fbbf24', borderRadius: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
            ← Back
          </button>
          <button onClick={() => navigate('/customer')} style={{ padding: '8px 16px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.35)', color: '#34d399', borderRadius: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
            Dashboard
          </button>
          <button onClick={() => setDark(!dark)} style={{ padding: '8px 14px', borderRadius: '14px', border: `1px solid ${border}`, background: 'transparent', color: text, cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, padding: '40px 40px', maxWidth: '1300px', margin: '0 auto' }}>

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', animation: 'fadeInUp 0.4s ease both' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '20px', padding: '5px 14px', marginBottom: '14px' }}>
              <span className="sparkle-dot" style={{ color: goldColor, fontSize: '11px' }}>✦</span>
              <span style={{ color: goldColor, fontSize: '10px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Premium Gold Collection</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              🏅 <span style={{ background: `linear-gradient(90deg,#f59e0b,#fbbf24,#ffd700)`, backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'goldShimmer 3s linear infinite' }}>Gold Rings</span>
            </h1>
            <p style={{ color: subtext, fontSize: '13px', margin: '8px 0 0', fontWeight: 500 }}>{goldRings.length} exclusive designs · Handcrafted excellence</p>
          </div>

          {/* Rate + Controls Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>

            {/* Metal Type Toggle */}
            <div style={{ display: 'flex', background: inpBg, border: `1px solid ${inpBorder}`, borderRadius: '12px', overflow: 'hidden' }}>
              {[{ val: '22k', label: '🏅 22K' }, { val: '24k', label: '🥇 24K' }].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setMetalType(val)}
                  style={{
                    padding: '9px 20px',
                    border: 'none',
                    background: metalType === val ? (val === '22k' ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#d97706,#ffd700)') : 'transparent',
                    color: metalType === val ? '#000' : subtext,
                    fontWeight: 800, fontSize: '12px', cursor: 'pointer', transition: 'all 0.25s ease',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Rate Display */}
            {currentRate && (
              <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '10px', padding: '8px 16px', textAlign: 'right' }}>
                <div style={{ color: subtext, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Rate ({metalType.toUpperCase()})</div>
                <div style={{ color: goldColor, fontWeight: 900, fontSize: '16px', fontFamily: 'monospace' }}>₹{currentRate.toFixed(2)}/gm</div>
              </div>
            )}
          </div>
        </div>


        {/* Ring Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
{loading ? (
  <div style={{ gridColumn: 'span 3', textAlign: 'center', 
    color: subtext, padding: '60px 0', fontSize: '15px' }}>
    ⏳ Loading products...
  </div>
) : goldRings.length === 0 ? (
  <div style={{ gridColumn: 'span 3', textAlign: 'center', 
    color: subtext, padding: '60px 0', fontSize: '15px' }}>
    No gold rings added yet.
  </div>
) : goldRings.map((ring) => {
            const isHovered = hoveredRing === ring.id
            const tag = tagStyle(ring.tag)
            return (
              <div
                key={ring.id}
                className="ring-card"
                onClick={() => setSelectedRing(ring)}
                onMouseEnter={() => setHoveredRing(ring.id)}
                onMouseLeave={() => setHoveredRing(null)}
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: `1px solid ${isHovered ? 'rgba(251,191,36,0.5)' : 'rgba(251,191,36,0.15)'}`,
                  background: isHovered ? 'rgba(251,191,36,0.07)' : cardBg,
                  cursor: 'pointer',
                  position: 'relative',
                  transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: isHovered ? `0 20px 50px rgba(251,191,36,0.25), 0 0 0 1px rgba(251,191,36,0.1)` : 'none',
                  transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  animation: isHovered ? 'none' : undefined,
                }}
              >
                {/* Shine overlay */}
                <div className="shine-overlay" />

                {/* Image */}
                <div className="ring-img-wrap" style={{ position: 'relative', height: '200px', background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)' }}>
                  <img
                    src={ring.images?.[0]?.image 
  ? `https://bitbyte-backend-f66f.onrender.com${ring.images[0].image}` 
  : '/img/gold/gold-ring-1.png'}
                    alt={ring.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.8) 0%, transparent 60%)' }} />

                  {/* Tag */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: tag.bg, border: `1px solid ${tag.border}`, borderRadius: '16px', padding: '3px 10px', color: tag.color, fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(8px)' }}>
                    {ring.tag}
                  </div>

                  {/* Ring number */}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: goldColor, fontSize: '10px', fontWeight: 900 }}>
                    {ring.id}
                  </div>

                  {/* Hover glow ring */}
                  {isHovered && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: `2px solid rgba(251,191,36,0.6)`, animation: 'glow-pulse 1.5s ease infinite' }} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ color: isHovered ? goldColor : text, fontWeight: 800, fontSize: '13px', marginBottom: '4px', transition: 'color 0.3s' }}>{ring.name}</div>
                  <div style={{ color: subtext, fontSize: '10px', lineHeight: '1.5', marginBottom: '10px' }}>{ring.description}</div>


                </div>

                {/* Bottom hover CTA */}
                {isHovered && (
                  <div style={{ padding: '0 16px 14px', animation: 'fadeInUp 0.2s ease' }}>
                    <div style={{ width: '100%', padding: '8px', background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', borderRadius: '10px', color: '#000', fontWeight: 800, fontSize: '11px', textAlign: 'center', cursor: 'pointer' }}>
                      👁 View Details
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom info */}
        <div style={{ marginTop: '48px', textAlign: 'center', animation: 'fadeInUp 0.6s ease 0.4s both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', color: subtext, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
            <div style={{ width: '40px', height: '1px', background: `linear-gradient(90deg,transparent,${goldColor})` }} />
            BitByte Jewellers • Gold Ring Collection
            <div style={{ width: '40px', height: '1px', background: `linear-gradient(90deg,${goldColor},transparent)` }} />
          </div>
        </div>
      </div>

      {/* ── RING DETAIL MODAL ── */}
      {selectedRing && (
        <div onClick={() => setSelectedRing(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(14px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: dark ? 'linear-gradient(145deg,#0a1628,#060e1c)' : '#f8fafc', border: '1px solid rgba(251,191,36,0.35)', borderRadius: '28px', width: '95%', maxWidth: '560px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', animation: 'fadeInUp 0.3s ease' }}>

            {/* Ring Image */}
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
              <img src={selectedRing.images?.[0]?.image 
  ? `https://bitbyte-backend-f66f.onrender.com${selectedRing.images[0].image}` 
  : '/img/gold/gold-ring-1.png'} alt={selectedRing.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.9) 0%, transparent 60%)' }} />
              <button onClick={() => setSelectedRing(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', borderRadius: '10px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px', backdropFilter: 'blur(8px)' }}>✕ Close</button>
              <div style={{ position: 'absolute', top: '16px', left: '16px', background: tagStyle(selectedRing.tag).bg, border: `1px solid ${tagStyle(selectedRing.tag).border}`, borderRadius: '20px', padding: '5px 14px', color: tagStyle(selectedRing.tag).color, fontSize: '11px', fontWeight: 800, backdropFilter: 'blur(8px)' }}>{selectedRing.tag}</div>
            </div>

            {/* Details */}
            <div style={{ padding: '28px 32px' }}>
              <div style={{ color: goldColor, fontWeight: 900, fontSize: '24px', marginBottom: '6px' }}>{selectedRing.name}</div>
              <div style={{ color: subtext, fontSize: '13px', lineHeight: '1.6', marginBottom: '24px' }}>{selectedRing.description}</div>



              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                <button
                  onClick={() => {
                 addToCart({
  id: selectedRing.id,
  name: selectedRing.name,
  desc: selectedRing.description,
  img: selectedRing.images?.[0]?.image 
    ? `https://bitbyte-backend-f66f.onrender.com${selectedRing.images[0].image}` 
    : '/img/gold/gold-ring-1.png',
  tag: selectedRing.tag,
  metal: metalType,
  metalLabel: `Gold ${metalType.toUpperCase()}`,
  ringType: 'Gold Ring',
})
                    setSelectedRing(null)
                    navigate('/cart')
                  }}
                  style={{ width:'100%', padding:'14px', background:'linear-gradient(90deg,#f59e0b,#fbbf24)', border:'none', borderRadius:'14px', color:'#000', fontWeight:900, fontSize:'14px', cursor:'pointer' }}
                >
                  🛒 Add to Cart
                </button>
                <button
                  onClick={() => { setSelectedRing(null); navigate('/customer') }}
                  style={{ width:'100%', padding:'12px', background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.3)', borderRadius:'14px', color:'#fbbf24', fontWeight:700, fontSize:'13px', cursor:'pointer' }}
                >
                  ⚡ Place Order on Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}