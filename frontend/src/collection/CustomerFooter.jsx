import { useNavigate } from 'react-router-dom'

const logo = '/logo.png'

export default function CustomerFooter() {
  const navigate = useNavigate()

  return (
    <footer style={{ background: '#fdf8f2', fontFamily: "'Montserrat', sans-serif", marginTop: 0, width: '100%', boxSizing: 'border-box' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap');

        .bjl-gold-line { height: 2px; background: linear-gradient(90deg, transparent, #8a6020 15%, #c9a96e 40%, #e8b840 50%, #c9a96e 60%, #8a6020 85%, transparent); }

        .bjl-badge { display:flex; align-items:center; gap:7px; padding:7px 11px; border:1px solid rgba(180,140,60,0.18); border-radius:6px; background:rgba(180,140,60,0.05); }
        .bjl-badge:hover { border-color: rgba(180,140,60,0.4); background: rgba(180,140,60,0.09); }

        .bjl-footer-link { display:flex; align-items:center; padding:3.5px 0; color:#9a7850; font-size:12px; font-weight:400; cursor:pointer; gap:0; font-family:'Montserrat',sans-serif; transition:color 0.2s; }
        .bjl-footer-link::before { content:''; display:inline-block; width:0; height:1px; background:#c9a96e; margin-right:0; transition:width 0.2s, margin-right 0.2s; flex-shrink:0; }
        .bjl-footer-link:hover { color:#7a4e10; }
        .bjl-footer-link:hover::before { width:11px; margin-right:6px; }

        .bjl-social-btn { width:32px; height:32px; border-radius:50%; border:1px solid rgba(180,140,60,0.2); background:transparent; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.25s; text-decoration:none; color:#a07030; }
        .bjl-social-btn:hover { background:rgba(180,140,60,0.1); border-color:#c9a96e; transform:translateY(-3px); }

        .bjl-nl-input { background:#fff; border:1px solid rgba(180,140,60,0.25); border-right:none; border-radius:4px 0 0 4px; padding:9px 13px; color:#3d2a10; font-size:12px; font-family:'Montserrat',sans-serif; width:160px; outline:none; transition:border-color 0.2s; }
        .bjl-nl-input::placeholder { color:#c9b090; }
        .bjl-nl-input:focus { border-color:rgba(180,140,60,0.5); }
        .bjl-nl-btn { background:linear-gradient(135deg,#c9a96e,#9a7040); border:none; border-radius:0 4px 4px 0; padding:9px 14px; color:#fff; font-size:10px; font-weight:700; font-family:'Montserrat',sans-serif; letter-spacing:1.5px; cursor:pointer; transition:opacity 0.2s; }
        .bjl-nl-btn:hover { opacity:0.85; }

        .bjl-shimmer { height:1px; background:linear-gradient(90deg, transparent, rgba(180,140,60,0.1) 20%, rgba(180,140,60,0.35) 50%, rgba(180,140,60,0.1) 80%, transparent); }

        .bjl-pol-link { color:#c9b090; font-size:10px; cursor:pointer; transition:color 0.2s; }
        .bjl-pol-link:hover { color:#a07030; }
      `}</style>

      {/* Top Gold Line */}
      <div className="bjl-gold-line" />

      {/* ── TOP STRIP ── */}
      <div style={{ borderBottom: '1px solid rgba(180,140,60,0.15)', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', background: '#fdf8f2' }}>

{/* Brand */}
<div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
<img src={logo} alt="Bharathi Jewellers" style={{ 
  width: 80, height: 45, objectFit: 'contain', 
  filter: 'drop-shadow(0 0 8px rgba(180,140,60,0.2))',
  transform: 'scale(2.6)', 
  transformOrigin: 'center center', marginTop:'10px',
}} />
  <div style={{ paddingTop: 8 }}>   {/* ← text vertical center */}
    <div style={{fontFamily: 'sans-serif', fontSize: 32, fontWeight: 700,  marginTop:'7px', color: 'red', letterSpacing: 1.5, fontStyle: 'italic', lineHeight: 1 }}>Team 369</div>
    {/* <div style={{ fontSize: 8, fontWeight: 600, color: '#b89050', letterSpacing: 3.5, textTransform: 'uppercase', marginTop: 4 }}>✦ Jewellers ✦</div> */}
  </div>
</div>

        {/* Trust Badges */}
        <div style={{ display: 'flex', gap: 38, flexWrap: 'wrap' }}>
          {[
            { icon: <svg width="30" height="16" viewBox="0 0 32 32" fill="none" stroke="#a07030" strokeWidth="1.6"><polygon points="16,3 20,11 29,12 23,18 24.5,27 16,23 7.5,27 9,18 3,12 12,11"/></svg>, label: 'BIS Hallmark', sub: 'Certified' },
            { icon: <svg width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="#a07030" strokeWidth="1.6"><rect x="2" y="10" width="28" height="16" rx="2"/><path d="M2 16h28"/><path d="M8 4l-2 6"/><path d="M24 4l2 6"/></svg>, label: 'Free Shipping', sub: 'Insured Delivery' },
            { icon: <svg width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="#a07030" strokeWidth="1.6"><path d="M6 6l4 20h12l4-20"/><path d="M4 10h24"/><path d="M12 10v16"/><path d="M20 10v16"/></svg>, label: '15-Day Returns', sub: 'Easy Exchange' },
            { icon: <svg width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="#a07030" strokeWidth="1.6"><rect x="4" y="13" width="24" height="15" rx="2"/><path d="M10 13V9a6 6 0 0112 0v4"/><circle cx="16" cy="20" r="2" fill="#a07030"/></svg>, label: 'Secure Pay', sub: '100% Safe' },
          ].map(b => (
            <div key={b.label} className="bjl-badge">
              {b.icon}
              <div>
                <span style={{ color: '#7a5020', fontSize: 11, fontWeight: 600, display: 'block', lineHeight: 1.2 }}>{b.label}</span>
                <span style={{ color: '#b89a70', fontSize: 9, display: 'block', marginTop: 1 }}>{b.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ fontSize: 8, color: '#b89050', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600 }}>✦ Exclusive Offers</div>
          <div style={{ display: 'flex' }}>
            <input className="bjl-nl-input" placeholder="Your email address" />
            <button className="bjl-nl-btn">JOIN</button>
          </div>
          <div style={{ fontSize: 9, color: '#c9b090' }}>New arrivals &amp; festive deals first</div>
        </div>
      </div>

      {/* ── MAIN COLUMNS ── */}
      <div style={{ padding: '40px 40px 32px', display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1.1fr', gap: 36, background: '#fdf8f2' }}>

        {/* Col 1 — About */}
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: '#8a5a18', letterSpacing: 1, fontStyle: 'italic', marginBottom: 4 }}>About Us</div>
          <div style={{ width: 30, height: 1, background: 'linear-gradient(90deg,#c9a96e,transparent)', marginBottom: 16 }} />
          <p style={{ color: '#8a7060', fontSize: 12, lineHeight: 1.9, fontWeight: 300, marginBottom: 18 }}>
            Crafting timeless jewellery with purity and passion since generations. Every piece tells a story of tradition, elegance, and trust passed down through time.
          </p>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', border: '1px solid rgba(180,140,60,0.15)', borderRadius: 6, background: 'rgba(180,140,60,0.04)', marginBottom: 18 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="11" height="11" viewBox="0 0 32 32" fill="#c9a96e"><polygon points="16,3 20,11 29,12 23,18 24.5,27 16,23 7.5,27 9,18 3,12 12,11"/></svg>
              ))}
            </div>
            <span style={{ color: '#8a5a18', fontSize: 14, fontWeight: 700 }}>4.9</span>
            <span style={{ color: '#9a8060', fontSize: 10 }}>/ 5 · 2,400+ reviews</span>
          </div>

          {/* Social */}
          <div style={{ color: '#b89a70', fontSize: 8, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 9 }}>Connect with us</div>
          <div style={{ display: 'flex', gap: 7 }}>
            {[
              { href: 'https://wa.me/916385257541', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.526 5.845L.057 23.882l6.19-1.624A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.368l-.36-.214-3.726.977.995-3.634-.234-.373A9.818 9.818 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z"/></svg> },
              { href: 'https://instagram.com', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="url(#ig3)" strokeWidth="2" strokeLinecap="round"><defs><linearGradient id="ig3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="50%" stopColor="#dc2743"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#dc2743" stroke="none"/></svg> },
              { href: 'https://facebook.com', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
              { href: 'https://youtube.com', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer" className="bjl-social-btn">{s.icon}</a>
            ))}
          </div>
        </div>

        {/* Col 2 — Quick Links */}
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: '#8a5a18', letterSpacing: 1, fontStyle: 'italic', marginBottom: 4 }}>Quick Links</div>
          <div style={{ width: 30, height: 1, background: 'linear-gradient(90deg,#c9a96e,transparent)', marginBottom: 16 }} />
          {[
            { label: 'Home', path: '/customer' },
            { label: 'All Collections', path: '/collection/all' },
            { label: 'Rings', path: '/collection/rings' },
            { label: 'Necklaces', path: '/collection/necklaces' },
            { label: 'Earrings', path: '/collection/earrings' },
            { label: 'Bangles', path: '/collection/bangles' },
            { label: 'Chains', path: '/collection/chains' },
            { label: 'Bracelets', path: '/collection/bracelets' },
            { label: 'Coins', path: '/collection/coins' },
          ].map(({ label, path }) => (
            <span key={label} className="bjl-footer-link" onClick={() => { navigate(path); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100) }}>{label}</span>
          ))}
        </div>

        {/* Col 3 — Collections */}
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: '#8a5a18', letterSpacing: 1, fontStyle: 'italic', marginBottom: 4 }}>Collections</div>
          <div style={{ width: 30, height: 1, background: 'linear-gradient(90deg,#c9a96e,transparent)', marginBottom: 16 }} />
          {[
            { label: 'Wedding Collection', path: '/collection/all?wedding=true' },
            { label: 'Dailywear', path: '/collection/all?dailywear=true' },
            { label: 'Gold Jewellery', path: '/collection/all?metal=gold' },
            { label: 'Silver Jewellery', path: '/collection/all?metal=silver' },
            { label: 'Diamond Jewellery', path: '/collection/all?metal=diamond' },
            { label: 'Platinum Jewellery', path: '/collection/all?metal=platinum' },
            { label: "Women's Jewellery", path: '/collection/all?gender=women' },
            { label: "Men's Jewellery", path: '/collection/all?gender=men' },
            { label: "Kids' Jewellery", path: '/collection/all?gender=kids' },
          ].map(({ label, path }) => (
            <span key={label} className="bjl-footer-link" onClick={() => { navigate(path); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100) }}>{label}</span>
          ))}
        </div>

        {/* Col 4 — Contact */}
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: '#8a5a18', letterSpacing: 1, fontStyle: 'italic', marginBottom: 4 }}>Visit Us</div>
          <div style={{ width: 30, height: 1, background: 'linear-gradient(90deg,#c9a96e,transparent)', marginBottom: 16 }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 12 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <div style={{ color: '#8a7060', fontSize: 12, lineHeight: 1.8, fontWeight: 300 }}>44 Annai Indhira Nagar,<br />Ammapet, Salem — 636003,<br />Tamil Nadu, India</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 13a19.79 19.79 0 01-3.07-8.67A2 2 0 013.6 2.24l3-.01a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 9.91a16 16 0 006.13 6.13l1.27-.88a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            <a href="tel:+916385257541" style={{ color: '#a07030', fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>+91 63852 57541</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <a href="mailto:bharathi@gmail.com" style={{ color: '#a07030', fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>bharathi@gmail.com</a>
          </div>

          {/* Store Hours */}
          <div style={{ padding: '11px 13px', border: '1px solid rgba(180,140,60,0.14)', borderRadius: 6, background: 'rgba(180,140,60,0.03)' }}>
            <div style={{ color: '#a07030', fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Store Hours</div>
            {[
              { day: 'Mon – Sat', time: '9:00 AM – 9:00 PM' },
              { day: 'Sunday', time: '10:00 AM – 7:00 PM' },
            ].map(h => (
              <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ color: '#8a7060', fontSize: 11 }}>{h.day}</span>
                <span style={{ color: '#9a8060', fontSize: 11, fontWeight: 500 }}>{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shimmer */}
      <div className="bjl-shimmer" />

      {/* ── BOTTOM BAR ── */}
      <div style={{ padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, background: '#faf4ec' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={logo} alt="BJ" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          <span style={{ color: '#b89a70', fontSize: 8, fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase' }}>✦ Bharathi Jewellers ✦</span>
        </div>
        <div style={{ color: '#c9b090', fontSize: 11, textAlign: 'center' }}>
          © {new Date().getFullYear()} Bharathi Jewellers, Salem. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Privacy Policy', 'Terms of Service', 'Sitemap'].map(l => (
            <span key={l} className="bjl-pol-link">{l}</span>
          ))}
        </div>
      </div>

      {/* Bottom Gold Line */}
      <div className="bjl-gold-line" />
    </footer>
  )
}