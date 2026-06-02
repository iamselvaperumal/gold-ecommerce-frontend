import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import CustomerNavbar from './CustomerNavbar'



export default function EarringsCollection() {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState(null)
 


const bg = '#FDF5EE'
const text = '#020617'
const subtext = '#64748b'
const border = 'rgba(0,0,0,0.1)'
const cardBg = 'rgba(0,0,0,0.03)'



const collections = [
  {
    id: 'gold',
    title: 'Gold Earrings',
    subtitle: '5 Exclusive Designs',
    description: 'Premium gold earrings with bridal, festive, and everyday elegant designs.',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.35)',
    border: 'rgba(251,191,36,0.4)',
    bg: 'rgba(251,191,36,0.06)',
    img: '/img/gold/gold-earrings-2.png',
    tag: '22K & 24K',
    route: '/gold-earrings',
    icon: '🏅',
    shimmer: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.15), transparent)',
    iconBg: '251,191,36',
  },
  {
    id: 'silver',
    title: 'Silver Earrings',
    subtitle: '5 Exclusive Designs',
    description: 'Handcrafted silver earrings with modern, traditional, and premium styles.',
    color: '#c0c0c0',
    glow: 'rgba(192,192,192,0.25)',
    border: 'rgba(192,192,192,0.4)',
    bg: 'rgba(192,192,192,0.05)',
    img: '/img/silver/silver-Earrings-4.png',
    tag: 'Silver 999',
    route: '/silver-earrings',
    icon: '🥈',
    shimmer: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.15), transparent)',
    iconBg: '192,192,192',
  },
  {
    id: 'diamond',
    title: 'Diamond Earrings',
    subtitle: '5 Exclusive Designs',
    description: 'Stunning diamond earrings with brilliant cuts and luxury craftsmanship.',
    color: '#a5f3fc',
    glow: 'rgba(165,243,252,0.3)',
    border: 'rgba(165,243,252,0.4)',
    bg: 'rgba(165,243,252,0.05)',
    img: '/diamond Earings.jpg',
    tag: 'VVS & VS1',
    route: '/diamond-earrings',
    icon: '💎',
    shimmer: 'linear-gradient(90deg, transparent, rgba(165,243,252,0.15), transparent)',
    iconBg: '165,243,252',
  },
  {
    id: 'platinum',
    title: 'Platinum Earrings',
    subtitle: '5 Exclusive Designs',
    description: 'Rare platinum earrings with superior strength and timeless elegance.',
    color: '#e2e8f0',
    glow: 'rgba(226,232,240,0.25)',
    border: 'rgba(226,232,240,0.4)',
    bg: 'rgba(226,232,240,0.05)',
    img: '/platinam_Earrings.jpg',
    tag: 'Pt 950',
    route: '/platinum-earrings',
    icon: '⭐',
    shimmer: 'linear-gradient(90deg, transparent, rgba(226,232,240,0.15), transparent)',
    iconBg: '226,232,240',
  },
]

return (
  <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: '"Inter",system-ui,sans-serif', position: 'relative', overflow: 'hidden' }}>
    <style>{`
      @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
      @keyframes pulse-ring { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.05)} }

      .earring-card { animation: fadeInUp 0.6s ease both; }
      .earring-card:nth-child(1) { animation-delay: 0.1s; }
      .earring-card:nth-child(2) { animation-delay: 0.2s; }
      .earring-card:nth-child(3) { animation-delay: 0.3s; }
      .earring-card:nth-child(4) { animation-delay: 0.4s; }

      .card-shimmer {
        position:absolute; top:0; left:-100%; width:60%; height:100%;
        background:var(--shimmer); transform:skewX(-15deg);
        animation:shimmer 2.5s ease infinite; opacity:0; transition:opacity 0.3s;
      }
      .earring-card-wrap:hover .card-shimmer { opacity:1; }
      .explore-btn { position:relative; overflow:hidden; }
      .explore-btn::after {
        content:''; position:absolute; inset:0;
        background:rgba(255,255,255,0.1);
        transform:translateX(-100%); transition:transform 0.3s ease;
      }
      .explore-btn:hover::after { transform:translateX(0); }
    `}</style>

    <CustomerNavbar />

      <div style={{ position: 'relative', zIndex: 10, padding: '60px 40px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px', animation: 'fadeInUp 0.5s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '30px', padding: '6px 20px', marginBottom: '20px' }}>
            <span className="sparkle-dot" style={{ fontSize: '12px' }}>✦</span>
            <span style={{ color: '#a78bfa', fontSize: '11px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Our Collections</span>
            <span className="sparkle-dot" style={{ fontSize: '12px', animationDelay: '1s' }}>✦</span>
          </div>

          <h1 style={{ color: text, fontSize: '42px', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-1px' }}>
            💎 <span style={{ background: 'linear-gradient(90deg,#a78bfa,#fbbf24,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Earrings Collections</span>
          </h1>

          <p style={{ color: subtext, fontSize: '15px', margin: 0, maxWidth: '520px', marginInline: 'auto', lineHeight: '1.6' }}>
            Explore handcrafted gold and silver earrings with premium finishing and elegant designs.
          </p>
        </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', maxWidth: '1400px', margin: '0 auto' }}>
          {collections.map((col, idx) => (
            <div
              key={col.id}
              className="earring-card"
              onClick={() => navigate(col.route)}
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              <div
                className="earring-card-wrap"
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

                <div style={{ position: 'relative', height: '280px', overflow: 'hidden', background: 'rgba(0,0,0,0.05)' }}>
                  <img
                    src={col.img}
                    alt={col.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transform: hoveredCard === col.id ? 'scale(1.08)' : 'scale(1)',
                      transition: 'transform 0.5s ease',
                    }}
                  />

                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.1) 60%, transparent 100%)' }} />

                  <div style={{ position: 'absolute', top: '14px', right: '14px', background: `rgba(${col.iconBg},0.2)`, border: `1px solid ${col.border}`, borderRadius: '20px', padding: '4px 12px', color: col.color, fontSize: '10px', fontWeight: 800, letterSpacing: '1px', backdropFilter: 'blur(8px)' }}>
                    {col.tag}
                  </div>

                  {hoveredCard === col.id && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: `2px solid ${col.color}`, animation: 'pulse-ring 1.5s ease infinite', opacity: 0.5 }} />
                    </div>
                  )}
                </div>

                <div style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <div style={{ color: col.color, fontWeight: 900, fontSize: '16px', marginBottom: '3px' }}>{col.title}</div>
                      <div style={{ color: subtext, fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>{col.subtitle}</div>
                    </div>

                    <div style={{ width: '36px', height: '36px', borderRadius: '10px',background: `rgba(${col.iconBg},0.12)`, border: `1px solid ${col.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                      {col.icon}
                    </div>
                  </div>

                  <p style={{ color: '#64748b', fontSize: '12px', lineHeight: '1.6', margin: '0 0 18px' }}>
                    {col.description}
                  </p>

                  <button
                    className="explore-btn"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: hoveredCard === col.id
                      ? `linear-gradient(90deg, ${col.color}, ${col.color}cc)`
                      : `rgba(${col.iconBg},0.1)`,
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
            BitByte Jewellers • Premium Earrings
            <div style={{ width: '40px', height: '1px', background: `linear-gradient(90deg,${subtext},transparent)` }} />
          </div>
        </div>
      </div>
    </div>
  )
}