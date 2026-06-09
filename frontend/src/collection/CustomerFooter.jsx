import { useNavigate } from 'react-router-dom'

const logo = '/BJ-logo.png'

export default function CustomerFooter() {
   const navigate = useNavigate()

  return (
<footer style={{
  background: 'linear-gradient(135deg, #151a00 0%, #2d1200 50%, #1a1500 100%)',
  color: '#e8d5b7',
  fontFamily: '"Montserrat", sans-serif',
  marginTop: 0,
  width: '100%',
  boxSizing: 'border-box',
}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@400;500;600;700&display=swap');
.footer-link {
  color: #c9a96e;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.2s ease;
  display: block;
  margin-bottom: 10px;
  cursor: pointer;
}
        .footer-link:hover { color: #fbbf24; padding-left: 6px; }
        .social-btn {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid rgba(201,169,110,0.3);
          background: rgba(201,169,110,0.08);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.25s ease; text-decoration: none;
        }
        .social-btn:hover {
          background: rgba(201,169,110,0.25);
          border-color: #c9a96e;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(201,169,110,0.2);
        }
        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a96e55, transparent);
          border: none; margin: 0;
        }
        @keyframes footerShimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>

      {/* Top Gold Line */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #c9a96e, #fbbf24, #c9a96e, transparent)' }} />

      {/* Main Content */}
<div style={{ maxWidth: '100%', margin: '0 auto', marginTop: -30, padding: '0 90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontFamily: '"Montserrat", sans-serif' }}>

        {/* Column 1 — Logo + About */}
        <div>
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, marginBottom: 16 }}>
  <img src={logo} alt="Bharathi Jewellers"
  style={{ width: 250, height: 250, objectFit: 'contain', marginTop: 0, marginBottom: -70, marginLeft: -40, filter: 'drop-shadow(0 2px 12px rgba(201,169,110,0.5))' }} />
 <div style={{ color: '#c9a96e', fontSize: 15, letterSpacing: 3, fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>✦ Bharathi Jewellers ✦</div>
<div style={{ color: '#fef3c7', fontSize: 30, fontWeight: 700, fontFamily: '"Cormorant Garamond", Georgia, serif', lineHeight: 1.2, fontStyle: 'italic' }}>
  Bharathi Jewellers
</div>
</div>

          <hr className="footer-divider" style={{ margin: '16px 0 20px' }} />

          <p style={{ color: '#a08060', fontSize: 15, lineHeight: 1.9, marginBottom: 24, maxWidth: 290, fontFamily: '"Montserrat", sans-serif' }}>
            Crafting timeless jewellery with purity and passion since generations. Every piece tells a story of tradition, elegance, and trust.
          </p>

          {/* BIS Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.25)', borderRadius: 20, padding: '6px 14px', marginBottom: 24 }}>
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="#c9a96e" strokeWidth="2">
              <polygon points="16,3 20,11 29,12 23,18 24.5,27 16,23 7.5,27 9,18 3,12 12,11"/>
            </svg>
            <span style={{ color: '#c9a96e', fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>BIS Hallmark Certified</span>
          </div>

          {/* Social Icons */}
          <div>
            <div style={{ color: '#6b4c2a', fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Follow Us</div>
            <div style={{ display: 'flex', gap: 10 }}>

              {/* WhatsApp */}
              <a href="https://wa.me/916385257541" target="_blank" rel="noreferrer" className="social-btn" title="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25d366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.526 5.845L.057 23.882l6.19-1.624A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.368l-.36-.214-3.726.977.995-3.634-.234-.373A9.818 9.818 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#ig)" strokeWidth="2" strokeLinecap="round">
                  <defs>
                    <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f09433"/>
                      <stop offset="25%" stopColor="#e6683c"/>
                      <stop offset="50%" stopColor="#dc2743"/>
                      <stop offset="75%" stopColor="#cc2366"/>
                      <stop offset="100%" stopColor="#bc1888"/>
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="#dc2743" stroke="none"/>
                </svg>
              </a>

              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-btn" title="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff0000">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <div style={{ color: '#fef3c7', fontSize: 18, fontWeight: 700, fontFamily: '"Playfair Display", Georgia, serif', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(201,169,110,0.2)' }}>
            Quick Links
          </div>
          <span className="footer-link" onClick={() => {
  navigate('/customer')
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
}}>Home</span>
{[
  { label: 'All Collections', path: '/collection/all' },
  { label: 'Rings', path: '/collection/rings' },
  { label: 'Necklaces', path: '/collection/necklaces' },
  { label: 'Earrings', path: '/collection/earrings' },
  { label: 'Bangles', path: '/collection/bangles' },
  { label: 'Chains', path: '/collection/chains' },
  { label: 'Bracelets', path: '/collection/bracelets' },
  { label: 'Coins', path: '/collection/coins' },
].map(({ label, path }) => (
  <span key={label} className="footer-link" onClick={() => {
    navigate(path)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
  }}>{label}</span>
))}
        </div>

        {/* Column 3 — Collections */}
        <div>
          <div style={{ color: '#fef3c7', fontSize: 18, fontWeight: 700, fontFamily: '"Playfair Display", Georgia, serif', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(201,169,110,0.2)' }}>
            Collections
          </div>
{[
  { label: 'Wedding Collection', path: '/collection/all?wedding=true' },
  { label: 'Dailywear Collection', path: '/collection/all?dailywear=true' },
  { label: 'Gold Jewellery', path: '/collection/all?metal=gold' },
  { label: 'Silver Jewellery', path: '/collection/all?metal=silver' },
  { label: 'Diamond Jewellery', path: '/collection/all?metal=diamond' },
  { label: 'Platinum Jewellery', path: '/collection/all?metal=platinum' },
  { label: "Women's Jewellery", path: '/collection/all?gender=women' },
  { label: "Men's Jewellery", path: '/collection/all?gender=men' },
  { label: "Kids' Jewellery", path: '/collection/all?gender=kids' },
].map(({ label, path }) => (
  <span key={label} className="footer-link" onClick={() => {
    navigate(path)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
  }}>{label}</span>
))}
        </div>

        {/* Column 4 — Contact */}
        <div>
          <div style={{ color: '#fef3c7', fontSize: 18, fontWeight: 700, fontFamily: '"Playfair Display", Georgia, serif', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(201,169,110,0.2)' }}>
            Contact Us
          </div>

          {/* Address */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <div style={{ color: '#a08060', fontSize: 15, lineHeight: 1.8 }}>
              44 Annai Indhira Nagar,<br />
              Ammapet, Salem — 636003,<br />
              Tamil Nadu, India
            </div>
          </div>

          {/* Phone */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.24l3-.01a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.13 6.13l1.27-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <a href="tel:+916385257541" style={{ color: '#c9a96e', fontSize: 15, textDecoration: 'none', fontWeight: 600 }}>
              +91 63852 57541
            </a>
          </div>

          {/* Email */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            <a href="mailto:bharathi@gmail.com" style={{ color: '#c9a96e', fontSize: 15, textDecoration: 'none', fontWeight: 600 }}>
              bharathi@gmail.com
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: '🏅', text: 'BIS Hallmark Certified' },
              { icon: '🚚', text: 'Free Insured Shipping' },
              { icon: '↩️', text: '15 Day Easy Returns' },
              { icon: '🔒', text: 'Secure Payments' },
            ].map(b => (
              <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>{b.icon}</span>
                <span style={{ color: '#a08060', fontSize: 12, fontWeight: 500 }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Divider */}
      <hr className="footer-divider" />

      {/* Bottom Bar */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>

        {/* Left — Logo small + brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logo} alt="BJ" style={{ width: 32, height: 32, objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(201,169,110,0.4))' }} />
         <span style={{ color: '#c9a96e', fontSize: 11, fontWeight: 700, letterSpacing: 2, fontFamily: '"Montserrat", sans-serif' }}>✦ Bharathi Jewellers ✦</span>
        </div>

        {/* Center — Copyright */}
        <div style={{ color: '#5c3d1e', fontSize: 15, textAlign: 'center' }}>
          © {new Date().getFullYear()} Bharathi Jewellers. All rights reserved.
        </div>

        {/* Right — Links */}
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy Policy', 'Terms of Service', 'Sitemap'].map(l => (
            <span key={l} style={{ color: '#5c3d1e', fontSize: 15, cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#c9a96e'}
              onMouseLeave={e => e.target.style.color = '#5c3d1e'}>
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Gold Line */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #c9a96e, #fbbf24, #c9a96e, transparent)' }} />
    </footer>
  )
}