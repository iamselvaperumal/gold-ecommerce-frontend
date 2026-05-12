import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

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

const GOLD_BANGLES = [
  { id: 1, name: 'Royal Kangan',      desc: 'Traditional kangan with intricate gold filigree work',          img: '/src/assets/img/gold/gold-bangles-1.png', tag: 'Bestseller' },
  { id: 2, name: 'Bridal Splendour',  desc: 'Heavy bridal bangle with gemstone accents — made for queens',  img: '/src/assets/img/gold/gold-bangles-2.png', tag: 'Bridal'     },
  { id: 3, name: 'Temple Heritage',   desc: 'South Indian temple-style bangle with divine motifs',           img: '/src/assets/img/gold/gold-bangles-3.png', tag: 'Premium'   },
  { id: 4, name: 'Floral Kada',       desc: 'Floral pattern kada — perfect for festivals and occasions',     img: '/src/assets/img/gold/gold-bangles-4.png', tag: 'Statement' },
  { id: 5, name: 'Slim Elegance',     desc: 'Minimalist slim bangle for everyday gold elegance',             img: '/src/assets/img/gold/gold-bangles-5.png', tag: 'Minimal'   },
  { id: 6, name: 'Antique Duo Stack', desc: 'Antique-finish stackable duo — layer them your way',            img: '/src/assets/img/gold/gold-bangles-6.png', tag: 'Stackable' },
]

const TAG_COLORS = {
  Bestseller: { bg: 'rgba(52,211,153,0.2)',   border: 'rgba(52,211,153,0.5)',   color: '#34d399' },
  Bridal:     { bg: 'rgba(244,114,182,0.2)',  border: 'rgba(244,114,182,0.5)',  color: '#f472b6' },
  Premium:    { bg: 'rgba(251,191,36,0.25)',  border: 'rgba(251,191,36,0.6)',   color: '#fbbf24' },
  Statement:  { bg: 'rgba(167,139,250,0.2)',  border: 'rgba(167,139,250,0.5)',  color: '#a78bfa' },
  Minimal:    { bg: 'rgba(34,211,238,0.2)',   border: 'rgba(34,211,238,0.5)',   color: '#22d3ee' },
  Stackable:  { bg: 'rgba(251,191,36,0.15)',  border: 'rgba(251,191,36,0.4)',   color: '#ffd700' },
}

export default function GoldBangles() {
  const navigate = useNavigate()
  const [dark, setDark]                     = useState(true)
  const [selectedWeight, setSelectedWeight] = useState('All Weights')
  const [hoveredBangle, setHoveredBangle]   = useState(null)
  const [goldPrice, setGoldPrice]           = useState(null)
  const [selectedBangle, setSelectedBangle] = useState(null)
  const [metalType, setMetalType]           = useState('gold_22k') // '22k' | '24k'
  const canvasRef = useRef(null)

  /* ── theme tokens ── */
  const bg        = dark ? '#020617'                   : '#f8fafc'
  const text      = dark ? '#f8fafc'                   : '#020617'
  const subtext   = dark ? '#94a3b8'                   : '#64748b'
  const border    = dark ? 'rgba(255,255,255,0.1)'     : 'rgba(0,0,0,0.1)'
  const glass     = dark ? 'rgba(15,23,42,0.65)'       : 'rgba(255,255,255,0.7)'
  const cardBg    = dark ? 'rgba(255,255,255,0.03)'    : 'rgba(0,0,0,0.03)'
  const inpBg     = dark ? 'rgba(255,255,255,0.05)'    : 'rgba(0,0,0,0.05)'
  const inpBorder = dark ? '#374151'                   : '#d1d5db'
  const optionBg  = dark ? '#1a2035'                   : '#ffffff'

  const goldColor = metalType === 'gold_24k' ? '#ffd700' : '#fbbf24'
  const goldGlow  = metalType === 'gold_24k' ? 'rgba(255,215,0,0.28)' : 'rgba(251,191,36,0.28)'

  /* ── fetch gold price ── */
  useEffect(() => {
    import('../api').then(({ default: api }) => {
      api.get('/metal-rates/').then(res => {
        const d = res.data
        setGoldPrice({
          gold22k: parseFloat(d.gold_22k),
          gold24k: parseFloat(d.gold_24k),
        })
      }).catch(() => {})
    }).catch(() => {})
  }, [])

  const currentRate = goldPrice ? (metalType === 'gold_24k' ? goldPrice.gold24k : goldPrice.gold22k) : null

  /* ── canvas particle animation ── */
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let animId, particles = []
    const mouse = { x: null, y: null, radius: 150 }

    const resize    = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    const mouseMove = (e) => { mouse.x = e.x; mouse.y = e.y }
    window.addEventListener('resize',    resize)
    window.addEventListener('mousemove', mouseMove)
    resize()

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size   = Math.random() * 4 + 2
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
      }
      update() {
        this.x += this.speedX; this.y += this.speedY
        if (this.x > canvas.width  || this.x < 0) this.speedX *= -1
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
        ctx.fillStyle = dark ? 'rgba(251,191,36,0.75)' : 'rgba(180,130,20,0.6)'
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
          ctx.strokeStyle=`rgba(251,191,36,${(1-d/150)*0.3})`
          ctx.lineWidth=0.5; ctx.beginPath()
          ctx.moveTo(particles[a].x,particles[a].y); ctx.lineTo(particles[b].x,particles[b].y); ctx.stroke()
        }
      }
    }
    function animate() { ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.update();p.draw()}); connect(); animId=requestAnimationFrame(animate) }
    init(); animate()
    return () => { window.removeEventListener('resize',resize); window.removeEventListener('mousemove',mouseMove); cancelAnimationFrame(animId) }
  }, [dark])

  /* ── helpers ── */
  const selectedW  = WEIGHTS.find(w => w.label === selectedWeight)
  const unitPrice  = selectedW?.grams && currentRate ? selectedW.grams * currentRate : null
  const tagStyle   = (tag) => TAG_COLORS[tag] || { bg:'rgba(255,255,255,0.1)', border:'rgba(255,255,255,0.2)', color:'#fff' }

  return (
    <div style={{ minHeight:'100vh', background:bg, color:text, fontFamily:'"Inter",system-ui,sans-serif', position:'relative', overflow:'hidden', transition:'background 0.8s ease, color 0.4s ease' }}>
      <style>{`
        @keyframes float-orb    { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes antigravity  { 0%{transform:translateY(110vh) rotate(0deg);opacity:0} 10%{opacity:var(--op)} 90%{opacity:var(--op)} 100%{transform:translateY(-20vh) rotate(360deg);opacity:0} }
        @keyframes fadeInUp     { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes goldShimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes glow-pulse   { 0%,100%{box-shadow:0 0 20px rgba(251,191,36,0.1)} 50%{box-shadow:0 0 40px rgba(251,191,36,0.4)} }
        @keyframes shine        { 0%{left:-80%} 100%{left:120%} }
        @keyframes sparkle      { 0%,100%{opacity:0;transform:scale(0) rotate(0deg)} 50%{opacity:1;transform:scale(1) rotate(180deg)} }

        .gb-card { animation: fadeInUp 0.5s ease both; }
        .gb-card:nth-child(1){animation-delay:0.05s}
        .gb-card:nth-child(2){animation-delay:0.10s}
        .gb-card:nth-child(3){animation-delay:0.15s}
        .gb-card:nth-child(4){animation-delay:0.20s}
        .gb-card:nth-child(5){animation-delay:0.25s}
        .gb-card:nth-child(6){animation-delay:0.30s}

        .gb-img-wrap { overflow:hidden; }
        .gb-img-wrap img { transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        .gb-card:hover .gb-img-wrap img { transform:scale(1.12) translateY(-4px) !important; }

        .gb-shine { position:absolute;top:0;left:-80%;width:40%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,220,100,0.2),transparent);transform:skewX(-20deg);opacity:0;transition:opacity 0.3s; }
        .gb-card:hover .gb-shine { opacity:1; animation:shine 0.6s ease; }

        .sparkle-dot { animation:sparkle 2s ease infinite; }
        .weight-chip { transition:all 0.2s ease; }
        .weight-chip:hover { transform:translateY(-2px); }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }
        input[type=number] { -moz-appearance:textfield; appearance:textfield; }
      `}</style>

      <canvas ref={canvasRef} style={{ position:'fixed', top:0, left:0, pointerEvents:'none', zIndex:1, opacity:0.4 }} />

      {/* orbs */}
      <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(90px)', animation:'float-orb 20s infinite ease-in-out', zIndex:0, top:'5%', left:'5%', width:'420px', height:'420px', background:'rgba(251,191,36,0.07)' }} />
      <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(90px)', animation:'float-orb 20s infinite ease-in-out', zIndex:0, bottom:'5%', right:'5%', width:'500px', height:'500px', background:'rgba(255,215,0,0.05)', animationDelay:'-7s' }} />

      {PARTICLES.map(p => (
        <div key={p.id} style={{ position:'absolute', left:`${p.x}%`, bottom:'-100px', width:p.size, height:p.size, borderRadius:'40% 60% 60% 40%/40% 40% 60% 60%', border:`1px solid ${goldColor}44`, opacity:p.opacity, animation:`antigravity ${p.duration}s ${p.delay}s infinite linear`, '--op':p.opacity, pointerEvents:'none', zIndex:0 }} />
      ))}

      {/* ── Navbar ── */}
      <div style={{ position:'relative', zIndex:10, background:glass, borderBottom:`1px solid ${border}`, padding:'18px 40px', display:'flex', justifyContent:'space-between', alignItems:'center', backdropFilter:'blur(16px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <img src={logo} alt="BitByte" style={{ width:60, height:50, borderRadius:'10px', objectFit:'contain' }} />
          <span style={{ color:goldColor, fontWeight:700, fontSize:'14px' }}>🏅 Gold Bangles Collection</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <button onClick={() => navigate('/collection/bangles')} style={{ padding:'8px 16px', background:`rgba(251,191,36,0.1)`, border:`1px solid rgba(251,191,36,0.35)`, color:goldColor, borderRadius:'10px', fontSize:'13px', cursor:'pointer', fontWeight:600 }}>← Back</button>
          <button onClick={() => navigate('/customer')} style={{ padding:'8px 16px', background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.35)', color:'#34d399', borderRadius:'10px', fontSize:'13px', cursor:'pointer', fontWeight:600 }}>Dashboard</button>
          <button onClick={() => setDark(!dark)} style={{ padding:'8px 14px', borderRadius:'14px', border:`1px solid ${border}`, background:'transparent', color:text, cursor:'pointer', fontWeight:600, fontSize:'13px' }}>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      <div style={{ position:'relative', zIndex:10, padding:'40px', maxWidth:'1400px', margin:'0 auto' }}>

        {/* ── Page Header ── */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'32px', animation:'fadeInUp 0.4s ease both', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.25)', borderRadius:'20px', padding:'5px 14px', marginBottom:'14px' }}>
              <span className="sparkle-dot" style={{ color:goldColor, fontSize:'11px' }}>✦</span>
              <span style={{ color:goldColor, fontSize:'10px', fontWeight:800, letterSpacing:'2px', textTransform:'uppercase' }}>Premium Gold Collection</span>
            </div>
            <h1 style={{ margin:0, fontSize:'36px', fontWeight:900, letterSpacing:'-0.5px' }}>
              🏅{' '}
              <span style={{ background:'linear-gradient(90deg,#f59e0b,#fbbf24,#ffd700,#fbbf24)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'goldShimmer 3s linear infinite' }}>
                Gold Bangles
              </span>
            </h1>
            <p style={{ color:subtext, fontSize:'13px', margin:'8px 0 0', fontWeight:500 }}>6 exclusive designs · Handcrafted 22K & 24K Gold</p>
          </div>

          {/* Rate panel */}
          <div style={{ display:'flex', flexDirection:'column', gap:'10px', alignItems:'flex-end' }}>
            {/* Metal type toggle */}
            <div style={{ display:'flex', gap:'8px' }}>
              {[{key:'gold_22k', label:'22K', color:'#fbbf24'}, {key:'gold_24k', label:'24K', color:'#ffd700'}].map(m => (
                <button key={m.key} onClick={() => setMetalType(m.key)}
                  style={{ padding:'7px 18px', borderRadius:'20px', border:`1px solid ${metalType===m.key ? m.color : border}`, background: metalType===m.key ? `rgba(${m.key==='gold_22k'?'251,191,36':'255,215,0'},0.15)` : 'transparent', color: metalType===m.key ? m.color : subtext, fontWeight:800, fontSize:'12px', cursor:'pointer', transition:'all 0.2s ease' }}>
                  {m.label}
                </button>
              ))}
            </div>
            {currentRate && (
              <div style={{ background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.25)', borderRadius:'10px', padding:'12px 20px', textAlign:'right' }}>
                <div style={{ color:subtext, fontSize:'10px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Live Rate ({metalType === 'gold_24k' ? '24K' : '22K'})</div>
                <div style={{ color:goldColor, fontWeight:900, fontSize:'18px', fontFamily:'monospace' }}>₹{currentRate.toFixed(2)}/gm</div>
              </div>
            )}
          </div>
        </div>

        {/* ── Weight Filter Chips ── */}
        <div style={{ marginBottom:'32px', animation:'fadeInUp 0.5s ease 0.1s both' }}>
          <div style={{ color:subtext, fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px' }}>Filter by Weight</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
            {WEIGHTS.map(w => {
              const isActive = selectedWeight === w.label
              const price    = w.grams && currentRate ? `₹${(w.grams * currentRate).toFixed(0)}` : null
              return (
                <button key={w.label} className="weight-chip" onClick={() => setSelectedWeight(w.label)}
                  style={{
                    padding:'7px 16px', borderRadius:'20px',
                    border: isActive ? `1px solid ${goldColor}` : `1px solid ${border}`,
                    background: isActive ? 'rgba(251,191,36,0.15)' : 'transparent',
                    color: isActive ? goldColor : subtext,
                    fontWeight: isActive ? 800 : 500, fontSize:'12px', cursor:'pointer',
                    display:'flex', alignItems:'center', gap:'6px',
                    boxShadow: isActive ? '0 0 12px rgba(251,191,36,0.25)' : 'none',
                    transition:'all 0.2s ease',
                  }}>
                  {w.label}
                  {price && isActive && <span style={{ fontSize:'10px', opacity:0.8, fontFamily:'monospace' }}>{price}</span>}
                </button>
              )
            })}
          </div>

          {selectedWeight !== 'All Weights' && unitPrice && (
            <div style={{ marginTop:'14px', display:'inline-flex', alignItems:'center', gap:'12px', background:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.25)', borderRadius:'12px', padding:'10px 18px' }}>
              <div>
                <div style={{ color:subtext, fontSize:'10px', fontWeight:600, textTransform:'uppercase' }}>Price for {selectedWeight}</div>
                <div style={{ color:'#4ade80', fontWeight:900, fontSize:'18px', fontFamily:'monospace' }}>₹{unitPrice.toFixed(2)}</div>
              </div>
              <div style={{ width:'1px', height:'32px', background:'rgba(251,191,36,0.2)' }} />
              <div>
                <div style={{ color:subtext, fontSize:'10px', fontWeight:600, textTransform:'uppercase' }}>Rate Used</div>
                <div style={{ color:goldColor, fontWeight:700, fontSize:'13px', fontFamily:'monospace' }}>₹{currentRate?.toFixed(2)}/gm</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Bangle Cards — 6 cards, 3 columns ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' }}>
          {GOLD_BANGLES.map(bangle => {
            const isHovered = hoveredBangle === bangle.id
            const tag = tagStyle(bangle.tag)
            return (
              <div key={bangle.id} className="gb-card"
                onClick={() => setSelectedBangle(bangle)}
                onMouseEnter={() => setHoveredBangle(bangle.id)}
                onMouseLeave={() => setHoveredBangle(null)}
                style={{
                  borderRadius:'20px', overflow:'hidden', cursor:'pointer', position:'relative',
                  border: `1px solid ${isHovered ? 'rgba(251,191,36,0.55)' : 'rgba(251,191,36,0.18)'}`,
                  background: isHovered ? 'rgba(251,191,36,0.07)' : cardBg,
                  transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: isHovered ? `0 20px 50px ${goldGlow}, 0 0 0 1px rgba(251,191,36,0.1)` : 'none',
                  transition:'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                <div className="gb-shine" />

                {/* Image */}
                <div className="gb-img-wrap" style={{ position:'relative', height:'240px', background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)' }}>
                  <img src={bangle.img} alt={bangle.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(2,6,23,0.8) 0%, transparent 60%)' }} />

                  {/* tag */}
                  <div style={{ position:'absolute', top:'10px', left:'10px', background:tag.bg, border:`1px solid ${tag.border}`, borderRadius:'16px', padding:'3px 10px', color:tag.color, fontSize:'9px', fontWeight:800, letterSpacing:'0.5px', backdropFilter:'blur(8px)' }}>
                    {bangle.tag}
                  </div>

                  {/* number badge */}
                  <div style={{ position:'absolute', top:'10px', right:'10px', width:'24px', height:'24px', borderRadius:'50%', background:'rgba(251,191,36,0.15)', border:'1px solid rgba(251,191,36,0.4)', display:'flex', alignItems:'center', justifyContent:'center', color:goldColor, fontSize:'10px', fontWeight:900 }}>
                    {bangle.id}
                  </div>

                  {/* hover glow ring */}
                  {isHovered && (
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                      <div style={{ width:'70px', height:'70px', borderRadius:'50%', border:'2px solid rgba(251,191,36,0.6)', animation:'glow-pulse 1.5s ease infinite' }} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding:'14px 16px' }}>
                  <div style={{ color: isHovered ? goldColor : text, fontWeight:800, fontSize:'14px', marginBottom:'4px', transition:'color 0.3s' }}>{bangle.name}</div>
                  <div style={{ color:subtext, fontSize:'11px', lineHeight:'1.5', marginBottom:'10px' }}>{bangle.desc}</div>

                  {selectedWeight !== 'All Weights' ? (
                    <div style={{ background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:'8px', padding:'8px 10px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span style={{ color:subtext, fontSize:'10px' }}>{selectedWeight} ({metalType === 'gold_24k' ? '24K' : '22K'})</span>
                        <span style={{ color:'#4ade80', fontWeight:800, fontSize:'12px', fontFamily:'monospace' }}>
                          {unitPrice ? `₹${unitPrice.toFixed(2)}` : '—'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color:subtext, fontSize:'10px', fontStyle:'italic', textAlign:'center' }}>Select weight to see price</div>
                  )}
                </div>

                {/* hover CTA */}
                {isHovered && (
                  <div style={{ padding:'0 16px 14px', animation:'fadeInUp 0.2s ease' }}>
                    <div style={{ width:'100%', padding:'8px', background:'linear-gradient(90deg,#f59e0b,#fbbf24)', borderRadius:'10px', color:'#000', fontWeight:800, fontSize:'11px', textAlign:'center' }}>
                      👁 View Details
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* footer line */}
        <div style={{ marginTop:'48px', textAlign:'center', animation:'fadeInUp 0.6s ease 0.4s both' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'16px', color:subtext, fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:600 }}>
            <div style={{ width:'40px', height:'1px', background:`linear-gradient(90deg,transparent,${goldColor})` }} />
            BitByte Jewellers • Gold Bangle Collection
            <div style={{ width:'40px', height:'1px', background:`linear-gradient(90deg,${goldColor},transparent)` }} />
          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedBangle && (
        <div onClick={() => setSelectedBangle(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', backdropFilter:'blur(14px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: dark ? 'linear-gradient(145deg,#0a1628,#060e1c)' : '#f8fafc', border:'1px solid rgba(251,191,36,0.35)', borderRadius:'28px', width:'95%', maxWidth:'560px', overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,0.8)', animation:'fadeInUp 0.3s ease' }}>

            {/* image */}
            <div style={{ position:'relative', height:'200px', overflow:'hidden' }}>
              <img src={selectedBangle.img} alt={selectedBangle.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(2,6,23,0.9) 0%,transparent 60%)' }} />
              <button onClick={() => setSelectedBangle(null)} style={{ position:'absolute', top:'16px', right:'16px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.4)', color:'#f87171', borderRadius:'10px', padding:'6px 14px', cursor:'pointer', fontSize:'12px', backdropFilter:'blur(8px)' }}>✕ Close</button>
              <div style={{ position:'absolute', top:'16px', left:'16px', background:tagStyle(selectedBangle.tag).bg, border:`1px solid ${tagStyle(selectedBangle.tag).border}`, borderRadius:'20px', padding:'5px 14px', color:tagStyle(selectedBangle.tag).color, fontSize:'11px', fontWeight:800, backdropFilter:'blur(8px)' }}>{selectedBangle.tag}</div>
            </div>

            {/* details */}
            <div style={{ padding:'28px 32px' }}>
              <div style={{ color:goldColor, fontWeight:900, fontSize:'24px', marginBottom:'6px' }}>{selectedBangle.name}</div>
              <div style={{ color:subtext, fontSize:'13px', lineHeight:'1.6', marginBottom:'24px' }}>{selectedBangle.desc}</div>

              {/* Metal type toggle in modal */}
              <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
                {[{key:'gold_22k', label:'Gold 22K'}, {key:'gold_24k', label:'Gold 24K'}].map(m => (
                  <button key={m.key} onClick={() => setMetalType(m.key)}
                    style={{ flex:1, padding:'8px', borderRadius:'10px', border:`1px solid ${metalType===m.key ? goldColor : border}`, background: metalType===m.key ? 'rgba(251,191,36,0.15)' : 'transparent', color: metalType===m.key ? goldColor : subtext, fontWeight:800, fontSize:'12px', cursor:'pointer', transition:'all 0.2s ease' }}>
                    🏅 {m.label}
                  </button>
                ))}
              </div>

              {/* price calculator */}
              <div style={{ background:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:'16px', padding:'18px 20px', marginBottom:'20px' }}>
                <div style={{ color:goldColor, fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'14px' }}>Price Calculator</div>
                <div>
                  <div style={{ color:subtext, fontSize:'10px', fontWeight:600, marginBottom:'6px', textTransform:'uppercase' }}>Weight</div>
                  <select value={selectedWeight} onChange={e => setSelectedWeight(e.target.value)}
                    style={{ width:'100%', background:inpBg, border:`1px solid ${inpBorder}`, borderRadius:'8px', padding:'10px 14px', color:text, fontSize:'13px', outline:'none', cursor:'pointer' }}>
                    {WEIGHTS.map(w => <option key={w.label} value={w.label} style={{ background:optionBg }}>{w.label}</option>)}
                  </select>
                </div>

                {unitPrice && (
                  <div style={{ marginTop:'16px', display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'14px', borderTop:'1px solid rgba(251,191,36,0.15)' }}>
                    <div style={{ color:subtext, fontSize:'12px' }}>Estimated Price</div>
                    <div style={{ color:'#4ade80', fontWeight:900, fontSize:'22px', fontFamily:'monospace' }}>₹{unitPrice.toFixed(2)}</div>
                  </div>
                )}

                {currentRate && (
                  <div style={{ marginTop:'8px', color:subtext, fontSize:'10px', fontFamily:'monospace' }}>
                    Rate: ₹{currentRate.toFixed(2)}/gm ({metalType === 'gold_24k' ? 'Gold 24K' : 'Gold 22K'})
                  </div>
                )}
              </div>

              <button onClick={() => { setSelectedBangle(null); navigate('/customer') }}
                style={{ width:'100%', padding:'14px', background:'linear-gradient(90deg,#f59e0b,#fbbf24)', border:'none', borderRadius:'14px', color:'#000', fontWeight:900, fontSize:'14px', cursor:'pointer' }}>
                🛒 Place Order on Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}