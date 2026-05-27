import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { addToCart } from '../collection/card_section'

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i, size: Math.random() * 50 + 8, x: Math.random() * 100,
  delay: Math.random() * 8, duration: Math.random() * 12 + 15, opacity: Math.random() * 0.18 + 0.04,
}))

const TAG_COLORS = {
  Bestseller: { bg: 'rgba(52,211,153,0.2)', border: 'rgba(52,211,153,0.5)', color: '#34d399' },
  Minimal:    { bg: 'rgba(34,211,238,0.2)', border: 'rgba(34,211,238,0.5)', color: '#22d3ee' },
  Premium:    { bg: 'rgba(192,192,192,0.25)', border: 'rgba(192,192,192,0.6)', color: '#e2e8f0' },
  Statement:  { bg: 'rgba(167,139,250,0.2)', border: 'rgba(167,139,250,0.5)', color: '#a78bfa' },
  Stackable:  { bg: 'rgba(244,114,182,0.2)', border: 'rgba(244,114,182,0.5)', color: '#f472b6' },
  New:        { bg: 'rgba(244,114,182,0.2)', border: 'rgba(244,114,182,0.5)', color: '#f472b6' },
  Limited:    { bg: 'rgba(167,139,250,0.2)', border: 'rgba(167,139,250,0.5)', color: '#a78bfa' },
}

export default function SilverBracelets() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(true)
  const [hoveredBracelet, setHoveredBracelet] = useState(null)
  const [silverPrice, setSilverPrice] = useState(null)
  const [silverBracelets, setSilverBracelets] = useState([])
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef(null)

  const bg = dark ? '#020617' : '#f8fafc'
  const text = dark ? '#f8fafc' : '#020617'
  const subtext = dark ? '#94a3b8' : '#64748b'
  const border = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  const glass = dark ? 'rgba(15,23,42,0.65)' : 'rgba(255,255,255,0.7)'
  const cardBg = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
  const inpBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const inpBorder = dark ? '#374151' : '#d1d5db'

  const silverColor = '#c0c0c0'

  const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

  const getImageUrl = (img) => {
  if (!img) return '/img/silver/silver_bracelet.jpg'
    if (img.startsWith('http://') || img.startsWith('https://')) return img
    return `${API_BASE}/${img.replace(/^\/+/, '')}`
  }

  useEffect(() => {
    import('../api').then(({ default: api }) => {
      api.get('/jewelry-products/?category=bracelets&metal=silver')
        .then(res => { setSilverBracelets(res.data); setLoading(false) })
        .catch(() => setLoading(false))
    })
  }, [])

  useEffect(() => {
    import('../api').then(({ default: api }) => {
      api.get('/metal-rates/').then(res => {
        setSilverPrice(parseFloat(res.data.silver_999))
      }).catch(() => {})
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId, particles = []
    const mouse = { x: null, y: null, radius: 150 }
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    const mouseMove = (e) => { mouse.x = e.x; mouse.y = e.y }
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
        this.x += this.speedX; this.y += this.speedY
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1
        if (mouse.x !== null) {
          const dx = mouse.x - this.x, dy = mouse.y - this.y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < mouse.radius) {
            const f = (mouse.radius - dist) / mouse.radius
            this.x += (dx/dist)*f*2; this.y += (dy/dist)*f*2
          }
        }
      }
      draw() {
        ctx.fillStyle = dark ? 'rgba(192,192,192,0.75)' : 'rgba(100,116,139,0.6)'
        ctx.save(); ctx.translate(this.x, this.y); ctx.beginPath()
        const spikes = 5, outerR = this.size, innerR = this.size * 0.4
        for (let i = 0; i < spikes*2; i++) {
          const r = i%2===0 ? outerR : innerR
          const a = (i*Math.PI)/spikes - Math.PI/2
          if (i===0) ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r)
          else       ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r)
        }
        ctx.closePath(); ctx.fill(); ctx.restore()
      }
    }

    function init()    { particles = []; for (let i=0;i<60;i++) particles.push(new Particle()) }
    function connect() {
      for (let a=0;a<particles.length;a++) for (let b=a;b<particles.length;b++) {
        const dx=particles[a].x-particles[b].x, dy=particles[a].y-particles[b].y, d=Math.sqrt(dx*dx+dy*dy)
        if (d<150) {
          ctx.strokeStyle=`rgba(192,192,192,${(1-d/150)*0.35})`
          ctx.lineWidth=0.5; ctx.beginPath()
          ctx.moveTo(particles[a].x,particles[a].y); ctx.lineTo(particles[b].x,particles[b].y); ctx.stroke()
        }
      }
    }
    function animate() { ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.update();p.draw()}); connect(); animId=requestAnimationFrame(animate) }
    init(); animate()
    return () => { window.removeEventListener('resize',resize); window.removeEventListener('mousemove',mouseMove); cancelAnimationFrame(animId) }
  }, [dark])

  const tagStyle = (tag) => TAG_COLORS[tag] || { bg:'rgba(255,255,255,0.1)', border:'rgba(255,255,255,0.2)', color:'#fff' }

  return (
    <div style={{ minHeight:'100vh', background:bg, color:text, fontFamily:'"Inter",system-ui,sans-serif', position:'relative', overflow:'hidden', transition:'background 0.8s ease, color 0.4s ease' }}>
      <style>{`
        @keyframes float-orb    { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes antigravity  { 0%{transform:translateY(110vh) rotate(0deg);opacity:0} 10%{opacity:var(--op)} 90%{opacity:var(--op)} 100%{transform:translateY(-20vh) rotate(360deg);opacity:0} }
        @keyframes fadeInUp     { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes silverShimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes glow-pulse   { 0%,100%{box-shadow:0 0 20px rgba(192,192,192,0.1)} 50%{box-shadow:0 0 40px rgba(192,192,192,0.35)} }
        @keyframes shine        { 0%{left:-80%} 100%{left:120%} }
        @keyframes sparkle      { 0%,100%{opacity:0;transform:scale(0) rotate(0deg)} 50%{opacity:1;transform:scale(1) rotate(180deg)} }
        .sb-card { animation: fadeInUp 0.5s ease both; }
        .sb-card:nth-child(1){animation-delay:0.05s}
        .sb-card:nth-child(2){animation-delay:0.12s}
        .sb-card:nth-child(3){animation-delay:0.19s}
        .sb-card:nth-child(4){animation-delay:0.26s}
        .sb-card:nth-child(5){animation-delay:0.33s}
        .sb-img-wrap { overflow:hidden; }
        .sb-img-wrap img { transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        .sb-card:hover .sb-img-wrap img { transform:scale(1.12) translateY(-4px) !important; }
        .sb-shine { position:absolute;top:0;left:-80%;width:40%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);transform:skewX(-20deg);opacity:0;transition:opacity 0.3s; }
        .sb-card:hover .sb-shine { opacity:1; animation:shine 0.6s ease; }
        .sparkle-dot { animation:sparkle 2s ease infinite; }
      `}</style>

      <canvas ref={canvasRef} style={{ position:'fixed', top:0, left:0, pointerEvents:'none', zIndex:1, opacity:0.4 }} />

      {/* Orbs */}
      <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(90px)', animation:'float-orb 20s infinite ease-in-out', zIndex:0, top:'5%', left:'5%', width:'420px', height:'420px', background:'rgba(192,192,192,0.06)' }} />
      <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(90px)', animation:'float-orb 20s infinite ease-in-out', zIndex:0, bottom:'5%', right:'5%', width:'500px', height:'500px', background:'rgba(148,163,184,0.05)', animationDelay:'-7s' }} />

      {PARTICLES.map(p => (
        <div key={p.id} style={{ position:'absolute', left:`${p.x}%`, bottom:'-100px', width:p.size, height:p.size, borderRadius:'40% 60% 60% 40%/40% 40% 60% 60%', border:`1px solid ${silverColor}44`, opacity:p.opacity, animation:`antigravity ${p.duration}s ${p.delay}s infinite linear`, '--op':p.opacity, pointerEvents:'none', zIndex:0 }} />
      ))}

      {/* Navbar */}
      <div style={{ position:'relative', zIndex:10, background:glass, borderBottom:`1px solid ${border}`, padding:'18px 40px', display:'flex', justifyContent:'space-between', alignItems:'center', backdropFilter:'blur(16px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <img src={logo} alt="BitByte" style={{ width:60, height:50, borderRadius:'10px', objectFit:'contain' }} />
          <span style={{ color:silverColor, fontWeight:700, fontSize:'14px' }}>🥈 Silver Bracelets Collection</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <button onClick={() => navigate('/collection/bracelets')} style={{ padding:'8px 16px', background:'rgba(192,192,192,0.1)', border:'1px solid rgba(192,192,192,0.35)', color:silverColor, borderRadius:'10px', fontSize:'13px', cursor:'pointer', fontWeight:600 }}>← Back</button>
          <button onClick={() => navigate('/customer')} style={{ padding:'8px 16px', background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.35)', color:'#34d399', borderRadius:'10px', fontSize:'13px', cursor:'pointer', fontWeight:600 }}>Dashboard</button>
          <button onClick={() => setDark(!dark)} style={{ padding:'8px 14px', borderRadius:'14px', border:`1px solid ${border}`, background:'transparent', color:text, cursor:'pointer', fontWeight:600, fontSize:'13px' }}>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      <div style={{ position:'relative', zIndex:10, padding:'40px', maxWidth:'1300px', margin:'0 auto' }}>

        {/* Page Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'40px', animation:'fadeInUp 0.4s ease both' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(192,192,192,0.08)', border:'1px solid rgba(192,192,192,0.25)', borderRadius:'20px', padding:'5px 14px', marginBottom:'14px' }}>
              <span className="sparkle-dot" style={{ color:silverColor, fontSize:'11px' }}>✦</span>
              <span style={{ color:silverColor, fontSize:'10px', fontWeight:800, letterSpacing:'2px', textTransform:'uppercase' }}>Premium Silver Collection</span>
            </div>
            <h1 style={{ margin:0, fontSize:'36px', fontWeight:900, letterSpacing:'-0.5px' }}>
              🥈{' '}
              <span style={{ background:'linear-gradient(90deg,#9ca3af,#c0c0c0,#e2e8f0,#c0c0c0)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'silverShimmer 3s linear infinite' }}>
                Silver Bracelets
              </span>
            </h1>
            <p style={{ color:subtext, fontSize:'13px', margin:'8px 0 0', fontWeight:500 }}>{silverBracelets.length} exclusive designs · Handcrafted Silver 999</p>
          </div>

          {/* Rate panel */}
          {silverPrice && (
            <div style={{ background:'rgba(192,192,192,0.08)', border:'1px solid rgba(192,192,192,0.25)', borderRadius:'10px', padding:'12px 20px', textAlign:'right' }}>
              <div style={{ color:subtext, fontSize:'10px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Live Rate (Silver 999)</div>
              <div style={{ color:silverColor, fontWeight:900, fontSize:'18px', fontFamily:'monospace' }}>₹{silverPrice.toFixed(2)}/gm</div>
            </div>
          )}
        </div>

        {/* Bracelet Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'18px' }}>
          {loading ? (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', color: subtext, padding: '60px 0' }}>
              ⏳ Loading products...
            </div>
          ) : silverBracelets.length === 0 ? (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', color: subtext, padding: '60px 0' }}>
              No silver bracelets added yet.
            </div>
          ) : silverBracelets.map((bracelet) => {
            const isHovered = hoveredBracelet === bracelet.id
            const tag = tagStyle(bracelet.tag)
            return (
              <div
                key={bracelet.id}
                className="sb-card"
                onClick={() => navigate(`/product-display?category=bracelets&metal=silver&id=${bracelet.id}`)}
                onMouseEnter={() => setHoveredBracelet(bracelet.id)}
                onMouseLeave={() => setHoveredBracelet(null)}
                style={{
                  borderRadius:'20px', overflow:'hidden', cursor:'pointer', position:'relative',
                  border: `1px solid ${isHovered ? 'rgba(192,192,192,0.55)' : 'rgba(192,192,192,0.18)'}`,
                  background: isHovered ? 'rgba(192,192,192,0.07)' : cardBg,
                  transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: isHovered ? '0 20px 50px rgba(192,192,192,0.22), 0 0 0 1px rgba(192,192,192,0.1)' : 'none',
                  transition:'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              >
                <div className="sb-shine" />

                {/* Image */}
                <div className="sb-img-wrap" style={{ position:'relative', height:'200px', background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)' }}>
                  <img
                    src={getImageUrl(bracelet.images?.[0]?.image)}
                    alt={bracelet.name}
                    onError={(e) => { e.currentTarget.src = '/img/silver/silver_bracelet.jpg' }}
                    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                  />
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(2,6,23,0.8) 0%, transparent 60%)' }} />

                  {/* Tag */}
                  <div style={{ position:'absolute', top:'10px', left:'10px', background:tag.bg, border:`1px solid ${tag.border}`, borderRadius:'16px', padding:'3px 10px', color:tag.color, fontSize:'9px', fontWeight:800, letterSpacing:'0.5px', backdropFilter:'blur(8px)' }}>
                    {bracelet.tag}
                  </div>

                  {/* ID badge */}
                  <div style={{ position:'absolute', top:'10px', right:'10px', width:'24px', height:'24px', borderRadius:'50%', background:'rgba(192,192,192,0.15)', border:'1px solid rgba(192,192,192,0.4)', display:'flex', alignItems:'center', justifyContent:'center', color:silverColor, fontSize:'10px', fontWeight:900 }}>
                    {bracelet.id}
                  </div>

                  {/* Hover glow ring */}
                  {isHovered && (
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                      <div style={{ width:'70px', height:'70px', borderRadius:'50%', border:'2px solid rgba(192,192,192,0.6)', animation:'glow-pulse 1.5s ease infinite' }} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding:'14px 16px' }}>
                  <div style={{ color: isHovered ? silverColor : text, fontWeight:800, fontSize:'13px', marginBottom:'4px', transition:'color 0.3s' }}>{bracelet.name}</div>
                  <div style={{ color:subtext, fontSize:'10px', lineHeight:'1.5', marginBottom:'10px' }}>{bracelet.description}</div>
                </div>

                {/* Hover CTA */}
                {isHovered && (
                  <div style={{ padding:'0 16px 14px', animation:'fadeInUp 0.2s ease' }}>
                    <div style={{ width:'100%', padding:'8px', background:'linear-gradient(90deg,#9ca3af,#e2e8f0)', borderRadius:'10px', color:'#000', fontWeight:800, fontSize:'11px', textAlign:'center' }}>
                      👁 View Details
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop:'48px', textAlign:'center', animation:'fadeInUp 0.6s ease 0.4s both' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'16px', color:subtext, fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:600 }}>
            <div style={{ width:'40px', height:'1px', background:`linear-gradient(90deg,transparent,${silverColor})` }} />
            BitByte Jewellers • Silver Bracelet Collection
            <div style={{ width:'40px', height:'1px', background:`linear-gradient(90deg,${silverColor},transparent)` }} />
          </div>
        </div>
      </div>
    </div>
  )
}