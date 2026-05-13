import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: Math.random() * 50 + 8,
  x: Math.random() * 100,
  delay: Math.random() * 8,
  duration: Math.random() * 12 + 15,
  opacity: Math.random() * 0.18 + 0.04,
}))

export default function NecklacesCollection() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(true)
  const [hoveredCard, setHoveredCard] = useState(null)
  const canvasRef = useRef(null)

  const bg = dark ? '#020617' : '#f8fafc'
  const text = dark ? '#f8fafc' : '#020617'
  const subtext = dark ? '#94a3b8' : '#64748b'
  const accent = dark ? '#22d3ee' : '#2563eb'
  const border = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  const glass = dark ? 'rgba(15,23,42,0.65)' : 'rgba(255,255,255,0.7)'
  const cardBg = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particlesArray = []
    const mouse = { x: null, y: null, radius: 150 }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleMouseMove = e => {
      mouse.x = e.x
      mouse.y = e.y
    }

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
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouse.radius && distance > 0) {
            const force = (mouse.radius - distance) / mouse.radius
            this.x += (dx / distance) * force * 2
            this.y += (dy / distance) * force * 2
          }
        }
      }

      draw() {
        ctx.fillStyle = dark ? 'rgba(34,211,238,0.9)' : 'rgba(37,99,235,0.8)'
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.beginPath()

        const spikes = 5
        const outerR = this.size
        const innerR = this.size * 0.4

        for (let i = 0; i < spikes * 2; i++) {
          const r = i % 2 === 0 ? outerR : innerR
          const angle = (i * Math.PI) / spikes - Math.PI / 2

          if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
          else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
        }

        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
    }

    function init() {
      particlesArray = []
      for (let i = 0; i < 60; i++) particlesArray.push(new Particle())
    }

    function connect() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x
          const dy = particlesArray[a].y - particlesArray[b].y
          const d = Math.sqrt(dx * dx + dy * dy)

          if (d < 150) {
            ctx.strokeStyle = dark
              ? `rgba(34,211,238,${1 - d / 150})`
              : `rgba(37,99,235,${0.5 - d / 300})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
            ctx.stroke()
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesArray.forEach(p => {
        p.update()
        p.draw()
      })
      connect()
      animationFrameId = requestAnimationFrame(animate)
    }

    init()
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [dark])

  const collections = [
    {
      id: 'gold',
      title: 'Gold Necklaces',
      subtitle: '7 Exclusive Designs',
      description: 'Premium gold necklaces with bridal, heritage, festive and modern collections.',
      color: '#fbbf24',
      glow: 'rgba(251,191,36,0.35)',
      border: 'rgba(251,191,36,0.4)',
      bg: 'rgba(251,191,36,0.06)',
      img: '/img/gold/gold-necklace-5.png',
      tag: '22K & 24K',
      route: '/gold-necklaces',
      icon: '🏅',
      shimmer: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.15), transparent)',
    },
    {
      id: 'silver',
      title: 'Silver Necklaces',
      subtitle: '6 Exclusive Designs',
      description: 'Handcrafted silver necklaces with elegant shine and premium everyday style.',
      color: '#c0c0c0',
      glow: 'rgba(192,192,192,0.25)',
      border: 'rgba(192,192,192,0.4)',
      bg: 'rgba(192,192,192,0.05)',
      img: '/img/silver/silver-necklace-3.png',
      tag: 'Silver 999',
      route: '/silver-necklaces',
      icon: '🥈',
      shimmer: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.15), transparent)',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: '"Inter",system-ui,sans-serif', position: 'relative', overflow: 'hidden', transition: 'background 0.8s ease, color 0.4s ease' }}>
      <style>{`
        @keyframes float-orb { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes antigravity { 0%{transform:translateY(110vh) rotate(0deg);opacity:0} 10%{opacity:var(--op)} 90%{opacity:var(--op)} 100%{transform:translateY(-20vh) rotate(360deg);opacity:0} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes pulse-ring { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.05)} }
        @keyframes sparkle { 0%,100%{opacity:0;transform:scale(0) rotate(0deg)} 50%{opacity:1;transform:scale(1) rotate(180deg)} }

        .necklace-card { animation: fadeInUp 0.6s ease both; }
        .necklace-card:nth-child(1) { animation-delay: 0.1s; }
        .necklace-card:nth-child(2) { animation-delay: 0.25s; }

        .card-shimmer {
          position:absolute;
          top:0;
          left:-100%;
          width:60%;
          height:100%;
          background:var(--shimmer);
          transform:skewX(-15deg);
          animation:shimmer 2.5s ease infinite;
          opacity:0;
          transition:opacity 0.3s;
        }

        .necklace-card-wrap:hover .card-shimmer { opacity:1; }

        .explore-btn { position:relative; overflow:hidden; }
        .explore-btn::after {
          content:'';
          position:absolute;
          inset:0;
          background:rgba(255,255,255,0.1);
          transform:translateX(-100%);
          transition:transform 0.3s ease;
        }
        .explore-btn:hover::after { transform:translateX(0); }
        .sparkle-dot { animation:sparkle 2s ease infinite; }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.4 }} />

      <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', animation: 'float-orb 20s infinite ease-in-out', zIndex: 0, top: '8%', left: '8%', width: '380px', height: '380px', background: dark ? 'rgba(251,191,36,0.06)' : 'rgba(251,191,36,0.06)' }} />
      <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', animation: 'float-orb 20s infinite ease-in-out', zIndex: 0, bottom: '10%', right: '4%', width: '460px', height: '460px', background: dark ? 'rgba(192,192,192,0.05)' : 'rgba(192,192,192,0.05)', animationDelay: '-5s' }} />

      {PARTICLES.map(p => (
        <div key={p.id} style={{ position: 'absolute', left: `${p.x}%`, bottom: '-100px', width: p.size, height: p.size, borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%', border: `1px solid ${accent}44`, opacity: p.opacity, animation: `antigravity ${p.duration}s ${p.delay}s infinite linear`, '--op': p.opacity, pointerEvents: 'none', zIndex: 0 }} />
      ))}

      <div style={{ position: 'relative', zIndex: 10, background: glass, borderBottom: `1px solid ${border}`, padding: '18px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(16px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logo} alt="BitByte Logo" style={{ width: 60, height: 50, borderRadius: '10px', objectFit: 'contain' }} />
          <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '14px' }}>📿 Necklaces Collections</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={() => navigate('/customer')} style={{ padding: '8px 18px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.35)', color: '#34d399', borderRadius: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
            ← Back to Dashboard
          </button>

          <button onClick={() => setDark(!dark)} style={{ padding: '8px 16px', borderRadius: '16px', border: `1px solid ${border}`, background: 'transparent', color: text, cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, padding: '60px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px', animation: 'fadeInUp 0.5s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '30px', padding: '6px 20px', marginBottom: '20px' }}>
            <span className="sparkle-dot" style={{ fontSize: '12px' }}>✦</span>
            <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Our Collections</span>
            <span className="sparkle-dot" style={{ fontSize: '12px', animationDelay: '1s' }}>✦</span>
          </div>

          <h1 style={{ color: text, fontSize: '42px', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-1px' }}>
            📿 <span style={{ background: 'linear-gradient(90deg,#fbbf24,#e5e7eb,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Necklaces Collections</span>
          </h1>

          <p style={{ color: subtext, fontSize: '15px', margin: 0, maxWidth: '560px', marginInline: 'auto', lineHeight: '1.6' }}>
            Explore premium gold and silver necklaces with bridal, heritage, modern and traditional craftsmanship.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
          {collections.map((col, idx) => (
            <div key={col.id} className="necklace-card" onClick={() => navigate(col.route)} style={{ animationDelay: `${idx * 0.15}s` }}>
              <div
                className="necklace-card-wrap"
                onMouseEnter={() => setHoveredCard(col.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: `1px solid ${hoveredCard === col.id ? col.border : border}`,
                  background: hoveredCard === col.id ? col.bg : cardBg,
                  boxShadow: hoveredCard === col.id ? `0 20px 60px ${col.glow}` : 'none',
                  transform: hoveredCard === col.id ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
                  transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  '--shimmer': col.shimmer,
                }}
              >
                <div className="card-shimmer" />

                <div style={{ position: 'relative', height: '280px', overflow: 'hidden', background: dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)' }}>
                  <img src={col.img} alt={col.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hoveredCard === col.id ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.5s ease' }} />

                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.1) 60%, transparent 100%)' }} />

                  <div style={{ position: 'absolute', top: '14px', right: '14px', background: `rgba(${col.id === 'gold' ? '251,191,36' : '192,192,192'},0.2)`, border: `1px solid ${col.border}`, borderRadius: '20px', padding: '4px 12px', color: col.color, fontSize: '10px', fontWeight: 800, letterSpacing: '1px', backdropFilter: 'blur(8px)' }}>
                    {col.tag}
                  </div>

                  {hoveredCard === col.id && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: `2px solid ${col.color}`, animation: 'pulse-ring 1.5s ease infinite', opacity: 0.5 }} />
                    </div>
                  )}
                </div>

                <div style={{ padding: '22px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <div style={{ color: col.color, fontWeight: 900, fontSize: '20px', marginBottom: '3px' }}>{col.title}</div>
                      <div style={{ color: subtext, fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>{col.subtitle}</div>
                    </div>

                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `rgba(${col.id === 'gold' ? '251,191,36' : '192,192,192'},0.12)`, border: `1px solid ${col.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                      {col.icon}
                    </div>
                  </div>

                  <p style={{ color: dark ? '#94a3b8' : '#64748b', fontSize: '12px', lineHeight: '1.6', margin: '0 0 18px' }}>
                    {col.description}
                  </p>

                  <button
                    className="explore-btn"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: hoveredCard === col.id
                        ? col.id === 'gold'
                          ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
                          : 'linear-gradient(90deg,#9ca3af,#e5e7eb)'
                        : `rgba(${col.id === 'gold' ? '251,191,36' : '192,192,192'},0.1)`,
                      border: `1px solid ${col.border}`,
                      borderRadius: '12px',
                      color: hoveredCard === col.id ? '#000' : col.color,
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {hoveredCard === col.id ? '→ Explore Now' : `View ${col.title}`}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '60px', animation: 'fadeInUp 0.8s ease 0.4s both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', color: subtext, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
            <div style={{ width: '40px', height: '1px', background: `linear-gradient(90deg,transparent,${subtext})` }} />
            BitByte Jewellers • Premium Necklaces
            <div style={{ width: '40px', height: '1px', background: `linear-gradient(90deg,${subtext},transparent)` }} />
          </div>
        </div>
      </div>
    </div>
  )
}