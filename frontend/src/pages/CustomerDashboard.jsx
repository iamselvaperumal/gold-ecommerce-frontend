import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import logo from '../assets/logo.png'
// import goldCoin from '../assets/gold-coin.png'
// import silverCoin from '../assets/silver-coin.png'

import goldCoin from '../assets/gold-coin-transparent.png'
import silverCoin from '../assets/silver-coin-transparent.png'

import { getCartCountDB, addToCartDB } from '../collection/card_section'

// const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
//   id: i, size: Math.random() * 60 + 10, x: Math.random() * 100,
//   delay: Math.random() * 8, duration: Math.random() * 12 + 15, opacity: Math.random() * 0.2 + 0.05,
// }))



// ── BANNER SLIDER COMPONENT ──
function HomeBannerSlider() {
  const [banners, setBanners] = useState([])
  const [current, setCurrent] = useState(0)
  const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

  const getUrl = img => {
    if (!img) return null
    if (img.startsWith('http://') || img.startsWith('https://')) return img
    return `${API_BASE}/${img.replace(/^\/+/, '')}`
  }

  useEffect(() => {
    fetch(`${API_BASE}/api/home-banners/`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length) setBanners(data) })
      .catch(() => { })
  }, [])

  useEffect(() => {
    if (banners.length < 2) return
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % banners.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [banners])

  if (!banners.length) return null

  return (
    <div style={{ width: '100%', overflow: 'hidden', position: 'relative', height: '850px', background: '#f5f0e8' }}>
      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .bb-banner-exit  { animation: slideLeft    0.6s ease forwards; position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        .bb-banner-enter { animation: slideInRight 0.6s ease forwards; position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
      `}</style>

      {banners.map((b, i) => {
        const url = getUrl(b.image)
        if (!url) return null
        const isActive = i === current
        const isPrev = i === (current - 1 + banners.length) % banners.length

        return (
          <div
            key={b.id}
            className={isActive ? 'bb-banner-enter' : isPrev ? 'bb-banner-exit' : ''}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: (isActive || isPrev) ? 1 : 0, zIndex: isActive ? 2 : isPrev ? 1 : 0 }}
          >
            <img src={url} alt={`Banner ${b.slot}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )
      })}

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
        {banners.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)}
            style={{ width: i === current ? '24px' : '8px', height: '8px', borderRadius: '20px', background: i === current ? '#8B1A1A' : 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.3s ease' }} />
        ))}
      </div>
    </div>
  )
}

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [profile, setProfile] = useState(null)
  const [showAnnouncements, setShowAnnouncements] = useState(false)
  const [updateMessage, setUpdateMessage] = useState('')
  const [proofDocument, setProofDocument] = useState(null)

  const [announcements, setAnnouncements] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showProfile, setShowProfile] = useState(false)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [updateForm, setUpdateForm] = useState({})

  const [metalPrices, setMetalPrices] = useState({ gold24k: null, gold22k: null, silver: null })
  const [metalLoading, setMetalLoading] = useState(false)
  const [usdToInr, setUsdToInr] = useState(null)
  const [dbRateDate, setDbRateDate] = useState(null)


  const [replyAnn, setReplyAnn] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)
  const [replyMsg, setReplyMsg] = useState('')
  const [repliedIds, setRepliedIds] = useState(new Set())
  const [annReplies, setAnnReplies] = useState({})
  const [replyPopupAnnId, setReplyPopupAnnId] = useState(null)
  const [replyPopupPos, setReplyPopupPos] = useState({ top: 0, left: 0 })
  const wishTimerRef = useRef(null)

  const [orderSummary, setOrderSummary] = useState(null)
  const [summaryPeriod, setSummaryPeriod] = useState('today') // 'today'|'week'|'month'

  // Place Order popup states — add these after existing useState lines
  const [orderPopup, setOrderPopup] = useState(false)
  const [orderMetal, setOrderMetal] = useState(null)  // 'gold_22k' | 'gold_24k' | 'silver_999'
  const [orderWeight, setOrderWeight] = useState('')
  const [orderCount, setOrderCount] = useState(1)
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderMsg, setOrderMsg] = useState('')
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('')
  const [hoveredJewel, setHoveredJewel] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeFilter, setActiveFilter] = useState('category')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showOrderSummary, setShowOrderSummary] = useState(false)
  const [showTodayRate, setShowTodayRate] = useState(false)
  const [showChatWidget, setShowChatWidget] = useState(true)
  const [wishlistCount, setWishlistCount] = useState(0)
  // const canvasRef = useRef(null)

  const bg = '#FDF5EE'
  const text = dark ? '#f8fafc' : '#020617'
  const subtext = dark ? '#94a3b8' : '#64748b'
  const accent = dark ? '#22d3ee' : '#2563eb'
  const border = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  const glass = dark ? 'rgba(15, 23, 42, 0.65)' : 'rgba(255, 255, 255, 0.7)'
  const cardBg = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
  const cardBorder = dark ? '1px solid rgba(103,232,249,0.1)' : '1px solid rgba(0,0,0,0.1)'
  const inpBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const inpBorder = dark ? '#374151' : '#d1d5db'
  const optionBg = dark ? '#1a2035' : '#ffffff'
  const selectInput = { width: '100%', background: inpBg, border: `1px solid ${inpBorder}`, borderRadius: '10px', padding: '12px 16px', color: text, fontSize: '14px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }


  // useEffect(() => {
  //   const canvas = canvasRef.current
  //   const ctx = canvas.getContext('2d')
  //   let animationFrameId, particlesArray = []
  //   const mouse = { x: null, y: null, radius: 150 }
  //   const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
  //   const handleMouseMove = (e) => { mouse.x = e.x; mouse.y = e.y }
  //   window.addEventListener('resize', handleResize)
  //   window.addEventListener('mousemove', handleMouseMove)
  //   handleResize()
  //   class Particle {
  //     constructor() {
  //       this.x = Math.random() * canvas.width
  //       this.y = Math.random() * canvas.height
  //       this.size = Math.random() * 4 + 2
  //       this.speedX = (Math.random() - 0.5) * 0.3
  //       this.speedY = (Math.random() - 0.5) * 0.3
  //     }

  //     update() {
  //       this.x += this.speedX
  //       this.y += this.speedY
  //       if (this.x > canvas.width || this.x < 0) this.speedX *= -1
  //       if (this.y > canvas.height || this.y < 0) this.speedY *= -1

  //       if (mouse.x !== null && mouse.y !== null) {
  //         let dx = mouse.x - this.x
  //         let dy = mouse.y - this.y
  //         let distance = Math.sqrt(dx * dx + dy * dy)
  //         if (distance < mouse.radius) {
  //           const forceDirectionX = dx / distance
  //           const forceDirectionY = dy / distance
  //           const force = (mouse.radius - distance) / mouse.radius
  //           this.x += forceDirectionX * force * 2
  //           this.y += forceDirectionY * force * 2
  //         }
  //       }
  //     }                          // ← update() ends here

  //     draw() {
  //       ctx.fillStyle = dark ? 'rgba(34, 211, 238, 0.9)' : 'rgba(37, 99, 235, 0.8)'
  //       ctx.save()
  //       ctx.translate(this.x, this.y)
  //       ctx.beginPath()

  //       const spikes = 5
  //       const outerRadius = this.size * 1
  //       const innerRadius = this.size * 0.4

  //       for (let i = 0; i < spikes * 2; i++) {
  //         const radius = i % 2 === 0 ? outerRadius : innerRadius
  //         const angle = (i * Math.PI) / spikes - Math.PI / 2
  //         if (i === 0) ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
  //         else ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
  //       }

  //       ctx.closePath()
  //       ctx.fill()
  //       ctx.restore()
  //     }

  //   }
  //   function init() { particlesArray = []; for (let i = 0; i < 60; i++)particlesArray.push(new Particle()) }
  //   function connect() {
  //     for (let a = 0; a < particlesArray.length; a++) for (let b = a; b < particlesArray.length; b++) {
  //       let dx = particlesArray[a].x - particlesArray[b].x, dy = particlesArray[a].y - particlesArray[b].y, d = Math.sqrt(dx * dx + dy * dy)
  //       if (d < 150) { ctx.strokeStyle = dark ? `rgba(34,211,238,${1 - d / 150})` : `rgba(37,99,235,${0.5 - d / 300})`; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke() }
  //     }
  //   }
  //   function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); particlesArray.forEach(p => { p.update(); p.draw() }); connect(); animationFrameId = requestAnimationFrame(animate) }
  //   init(); animate()
  //   return () => { window.removeEventListener('resize', handleResize); window.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(animationFrameId) }
  // }, [dark])


useEffect(() => {
    const updateCount = async () => {
      const count = await getCartCountDB()
      setCartCount(count)
    }
    updateCount()
    const handler = () => updateCount()
    window.addEventListener('bb_cart_update', handler)
    return () => window.removeEventListener('bb_cart_update', handler)
  }, [])



  useEffect(() => {
    const updateWishCount = async () => {
      try {
        const res = await api.get('/wishlist/')
        setWishlistCount(res.data.count)
      } catch {}
    }
    updateWishCount()
    const handler = () => updateWishCount()
    window.addEventListener('bb_wishlist_update', handler)
    return () => window.removeEventListener('bb_wishlist_update', handler)
  }, [])


  const WEIGHTS_SILVER = [
    { label: '500 mg', grams: 0.50 },
    { label: '1 gm', grams: 1 },
    { label: '2 gm', grams: 2 },
    { label: '5 gm', grams: 5 },
    { label: '10 gm', grams: 10 },
    { label: '20 gm', grams: 20 },
    { label: '50 gm', grams: 50 },
    { label: '100 gm', grams: 100 },
  ]

  const WEIGHTS_GOLD = [
    { label: '100 mg', grams: 0.10 },
    { label: '200 mg', grams: 0.20 },
    { label: '500 mg', grams: 0.50 },
    { label: '1 gm', grams: 1 },
    { label: '2 gm', grams: 2 },
    { label: '4 gm', grams: 4 },
    { label: '8 gm', grams: 8 },
    { label: '16 gm', grams: 16 },
    { label: '40 gm', grams: 40 },
  ]

  const PROFILE_FIELDS = [
    ['initial', 'Initial'],
    ['first_name', 'First Name'],
    ['last_name', 'Last Name'],
    ['email', 'Email'],
    ['mobile_number', 'Mobile Number'],
    ['gender', 'Gender'],
    ['dob', 'DOB'],
    ['married_status', 'Married Status'],
    ['anniversary_date', 'Anniversary Date'],
    ['door_no', 'Door No'],
    ['street_name', 'Street'],
    ['town_name', 'Town'],
    ['city_name', 'City'],
    ['district', 'District'],
    ['state', 'State'],
    ['aadhaar_no', 'Aadhaar No'],
    ['pan_no', 'PAN No'],
    ['occupation', 'Type'],
    ['occupation_detail', 'Detail'],
    ['annual_salary', 'Annual Salary'],
    ['customer_id', 'Customer ID'],
    ['promotor_id', 'Promotor ID'],
    ['promotor_name', 'Promotor Name'],
    ['promotor_contact_no', 'Contact No'],
  ]

  const openProfileEdit = () => {
    const next = {}
    PROFILE_FIELDS.forEach(([key]) => {
      next[key] = profile?.[key] || ''
    })

    setUpdateForm(next)
    setUpdateMessage('')
    setProofDocument(null)
    setShowProfileEdit(true)
  }

  const handleUpdateChange = e => {
    const { name, value } = e.target

    if (name === 'married_status' && value !== 'married') {
      setUpdateForm({ ...updateForm, married_status: value, anniversary_date: '' })
      return
    }

    setUpdateForm({ ...updateForm, [name]: value })
  }



  const submitProfileUpdate = async e => {
    e.preventDefault()

    if (!updateMessage.trim()) {
      alert('Please enter message / reason bro')
      return
    }

    if (!proofDocument) {
      alert('Please upload document proof bro')
      return
    }

    const fd = new FormData()

    PROFILE_FIELDS.forEach(([key]) => {
      if (
        !['email', 'admin_id', 'admin_name', 'admin_contact_no'].includes(key) &&
        updateForm[key] !== null &&
        updateForm[key] !== undefined
      ) {
        fd.append(key, updateForm[key])
      }
    })

    fd.append('message', updateMessage)
    fd.append('proof_document', proofDocument)

    try {
      await api.post('/profile-update-request/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setMsg('✅ Profile update request submitted successfully!')
      setMsgType('success')
      setShowProfileEdit(false)
      setUpdateMessage('')
      setProofDocument(null)
    } catch (err) {
      setMsg('❌ Error: ' + JSON.stringify(err.response?.data || err.message))
      setMsgType('error')
    }
  }

  const submitOrder = async () => {
    if (!orderWeight) { alert('Weight select pannunga'); return }
    if (!orderCount || orderCount < 1) { alert('Count enter pannunga'); return }

    const weightsArr = orderMetal === 'silver_999' ? WEIGHTS_SILVER : WEIGHTS_GOLD
    const w = weightsArr.find(x => x.label === orderWeight)
    if (!w) return

    const rateMap = {
      gold_22k: metalPrices.gold22k,
      gold_24k: metalPrices.gold24k,
      silver_999: metalPrices.silver,
    }
    const rate = rateMap[orderMetal]

    setOrderSubmitting(true)
    try {
      await api.post('/metal-orders/', {
        metal_type: orderMetal,
        weight_label: orderWeight,
        weight_grams: w.grams,
        count: orderCount,
        rate_per_gram: rate,
      })
      setOrderMsg('✅ Order placed successfully!')
    } catch (err) {
      setOrderMsg('❌ Failed: ' + JSON.stringify(err.response?.data || err.message))
    }
    setOrderSubmitting(false)
  }

  const fetchMetalPrices = async () => {
    setMetalLoading(true)
    try {
      const res = await api.get('/metal-rates/')
      const d = res.data
      setMetalPrices({
        gold22k: parseFloat(d.gold_22k),
        gold24k: parseFloat(d.gold_24k),
        silver: parseFloat(d.silver_999),
      })
      setDbRateDate(d.date)
    } catch (e) {
      setMetalPrices({ gold22k: null, gold24k: null, silver: null })
      setDbRateDate(null)
    }
    setMetalLoading(false)
  }

  const fetchOrderSummary = async () => {
    try {
      const res = await api.get('/metal-orders/summary/')
      setOrderSummary(res.data)
    } catch { }
  }

const addMetalToCart = async (metalType, metalLabel, weightObj, price, img) => {
    // Coin cart click → Order popup திற
    setOrderMetal(metalType)
    setOrderWeight(weightObj.label)
    setOrderCount(1)
    setOrderMsg('')
    setOrderPopup(true)
  }


  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements/')
      const sorted = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setAnnouncements(sorted)
      const lastSeen = parseInt(localStorage.getItem('customerAnnouncementSeen') || '0')
      setUnreadCount(sorted.filter(a => new Date(a.created_at).getTime() > lastSeen).length)
    } catch { }
  }



  function extractIdsFromTitle(title) {
    return title.match(/BB[A-Z]+\d+/g) || []
  }

  function isCurrentUserMentioned(title) {
    const myId = profile?.customer_id
    if (!myId) return false
    return extractIdsFromTitle(title).includes(myId)
  }

  async function fetchReplies(annId) {
    try {
      const res = await api.get(`/announcements/${annId}/replies/`)
      setAnnReplies(prev => ({ ...prev, [annId]: res.data }))
    } catch { }
  }

  async function submitReply() {
    if (!replyText.trim()) return
    setReplyLoading(true)
    try {
      await api.post(`/announcements/${replyAnn.id}/replies/`, { message: replyText })
      setRepliedIds(prev => new Set([...prev, replyAnn.id]))
      setReplyMsg('✅ Wish sent!')
      setReplyText('')
    } catch (err) {
      if (err.response?.data?.error === 'Already replied') {
        setRepliedIds(prev => new Set([...prev, replyAnn.id]))
        setReplyMsg('⚠️ Already sent!')
      } else { setReplyMsg('❌ Failed.') }
    }
    setReplyLoading(false)
  }

  useEffect(() => {
    api.get('/dashboard/').then(res => setProfile(res.data)).catch(() => { })
    fetchAnnouncements()
    fetchMetalPrices()
    fetchOrderSummary() // ← ADD THIS
    const interval = setInterval(() => {
      fetchAnnouncements()
      fetchMetalPrices()
      fetchOrderSummary() // ← ADD THIS
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const card = { background: cardBg, border: cardBorder, borderRadius: '20px', padding: '32px 36px', marginBottom: '20px' }
  const sHead = { color: '#34d399', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px', paddingBottom: '14px', borderBottom: cardBorder }
  const lbl = { color: subtext, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }
  const val = { color: text, fontSize: '15px' }
  const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }
  const g3 = { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }

  const Row = ({ label, value, mono }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={lbl}>{label}</span>
      <span style={{ ...val, ...(mono ? { fontFamily: 'monospace', letterSpacing: '0.05em' } : {}) }}>{value || '—'}</span>
    </div>
  )

  const Section = ({ title, children, grid }) => (
    <div style={card}>
      <p style={sHead}>{title}</p>
      <div style={grid}>{children}</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, transition: 'background 0.8s ease, color 0.4s ease', fontFamily: '"Inter",system-ui,sans-serif', position: 'relative', }}>
      <style>{`
        @keyframes float-orb{0%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-50px) scale(1.1)}66%{transform:translate(-20px,20px) scale(0.9)}100%{transform:translate(0,0) scale(1)}}
        @keyframes antigravity{0%{transform:translateY(110vh) rotate(0deg);opacity:0}10%{opacity:var(--op)}90%{opacity:var(--op)}100%{transform:translateY(-20vh) rotate(360deg);opacity:0}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        #sd-wish-popup::-webkit-scrollbar{width:5px}
#sd-wish-popup::-webkit-scrollbar-track{background:rgba(167,139,250,0.05);border-radius:10px;margin:4px 0}
#sd-wish-popup::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#a78bfa,#22d3ee);border-radius:10px}
#sd-wish-popup{scrollbar-color:rgba(167,139,250,0.5) rgba(167,139,250,0.03)}
@keyframes sdWishIn{from{opacity:0;transform:translate(-50%,calc(-100% + 8px)) scale(0.95)}to{opacity:1;transform:translate(-50%,calc(-100% - 10px)) scale(1)}}
@keyframes jewelGlow{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
@keyframes shimmerSlide{0%{left:-80%}100%{left:120%}}
.jewel-card-img{transition:transform 0.55s cubic-bezier(0.34,1.56,0.64,1);}
.jewel-card:hover .jewel-card-img{transform:scale(1.10) translateY(-4px) !important;}
.jewel-shine{position:absolute;top:0;left:-80%;width:40%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);transform:skewX(-20deg);opacity:0;transition:opacity 0.3s;}
.jewel-card:hover .jewel-shine{opacity:1;animation:shimmerSlide 0.65s ease;}


        .cu-fade{animation:fadeIn .45s ease both}
        input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance: textfield; appearance: textfield; }

  /* ── GLOBAL TYPOGRAPHY FOR #FDF5EE BACKGROUND ── */
  * { box-sizing: border-box; }

  body {
    background: #FDF5EE;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    color: #3d2b1f;
    -webkit-font-smoothing: antialiased;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    color: #1a0a0a;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.3;
  }

  /* Body paragraphs */
  p {
    color: #3d2b1f;
    line-height: 1.7;
    font-size: 14px;
  }

  /* Labels / captions */
  label, .caption {
    color: #7c5c4a;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  /* Price / highlight text */
  .price-text {
    color: #b8860b;
    font-weight: 800;
    font-family: 'monospace';
  }

  /* Primary button */
  .btn-primary {
    background: #8B1A1A;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  .btn-primary:hover {
    background: #6b1212;
  }

  /* Secondary/outline button */
  .btn-secondary {
    background: transparent;
    color: #8B1A1A;
    border: 1.5px solid #8B1A1A;
    border-radius: 12px;
    padding: 11px 24px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-secondary:hover {
    background: #8B1A1A;
    color: #fff;
  }

  /* Card on cream bg */
  .bb-card {
    background: #fff;
    border: 1px solid #e8ddd5;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(139,26,26,0.06);
  }

  /* Input fields */
  input, textarea, select {
    font-family: 'Inter', system-ui, sans-serif;
    color: #3d2b1f;
  }
  input::placeholder, textarea::placeholder {
    color: #b09080;
  }

  /* Divider */
  .bb-divider {
    border: none;
    border-top: 1px solid #e8ddd5;
    margin: 16px 0;
  }

  /* Section heading style */
  .section-title {
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #8B1A1A;
    margin-bottom: 16px;
  }

  /* Navbar stays white — no change needed */
      `}</style>



      {/* <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.45 }} />
      <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', animation: 'float-orb 20s infinite ease-in-out', zIndex: 0, top: '8%', left: '8%', width: '380px', height: '380px', background: dark ? 'rgba(52,211,153,0.08)' : 'rgba(16,185,129,0.08)' }} />
      <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', animation: 'float-orb 20s infinite ease-in-out', zIndex: 0, bottom: '10%', right: '4%', width: '460px', height: '460px', background: dark ? 'rgba(110,231,183,0.06)' : 'rgba(52,211,153,0.06)', animationDelay: '-5s' }} /> */}

      {/* {PARTICLES.map(p => (
        <div key={p.id} style={{ position: 'absolute', left: `${p.x}%`, bottom: '-100px', width: p.size, height: p.size, borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%', border: `1px solid ${accent}44`, opacity: p.opacity, animation: `antigravity ${p.duration}s ${p.delay}s infinite linear`, '--op': p.opacity, pointerEvents: 'none', zIndex: 0 }} />
      ))} */}

      {/* TOP NAV */}
      {/* TOP NAV */}
      <div
        style={{
          background: '#fff',
          borderBottom: '0.5px solid #e5e7eb',
          padding: '18px 40px',
          display: 'grid',
          gridTemplateColumns: '260px 1fr 260px',
          alignItems: 'center',
          gap: '24px',
          position: 'sticky',
          top: 0,
          zIndex: 300
        }}
      >
        {/* Logo */}
        <div
          style={{
            color: '#8B1A1A',
            fontWeight: 800,
            fontSize: '24px',
            letterSpacing: '3px'
          }}
        >
          BitByte Jewels
        </div>

        {/* Center Search bar */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 680, position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8B1A1A',
                fontSize: 18
              }}
            >
              🔍
            </span>

            <input
              placeholder="Search gold & diamond jewellery..."
              style={{
                width: '100%',
                border: '1px solid #d1d5db',
                borderRadius: 28,
                padding: '14px 18px 14px 48px',
                fontSize: 15,
                outline: 'none',
                color: '#374151',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16, color: '#8B1A1A', fontSize: 22 }}>

          <button
            onClick={() => setShowTodayRate(true)}
            style={{
              background: 'linear-gradient(90deg,#b8860b,#d4a017)',
              color: '#fff',
              border: 'none',
              borderRadius: 20,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(184,134,11,0.3)'
            }}
          >
            📅 Today Rate
          </button>

          <button
            onClick={() => setShowOrderSummary(true)}
            style={{
              background: 'linear-gradient(90deg,#8B1A1A,#b91c1c)',
              color: '#fff',
              border: 'none',
              borderRadius: 20,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(139,26,26,0.25)'
            }}
          >
            🏆 Order Summary
          </button>
          <span
  style={{ cursor: 'pointer', position: 'relative', fontSize: 22 }}
  onClick={() => navigate('/wishlist')}
>
  {wishlistCount > 0 ? '❤️' : '♡'}
  {wishlistCount > 0 && (
    <span style={{
      position: 'absolute', top: '-6px', right: '-8px',
      background: '#e11d48', color: '#fff',
      borderRadius: '50%', width: '16px', height: '16px',
      fontSize: '9px', fontWeight: 900,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      lineHeight: 1,
    }}>
      {wishlistCount}
    </span>
  )}
</span>

          <span style={{ cursor: 'pointer' }}>👤</span>
          <span
            style={{ cursor: 'pointer', position: 'relative' }}
            onClick={() => navigate('/cart')}
          >🛒</span>
        </div>

      </div>

      {/* CATEGORY NAV WITH DROPDOWN */}
      <div style={{ position: 'sticky', top: '73px', zIndex: 250, background: '#fff' }} onMouseLeave={() => { setShowDropdown(false) }}>

        {/* Top category bar */}
        <div
          style={{
            borderBottom: '0.5px solid #f0f0f0',
            padding: '0 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fff',
            minHeight: 64,
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {[

            { name: ' All Jewellery', key: 'all' },
            { name: '🥇 Gold', key: 'gold' },
            { name: '💎 Diamond', key: 'diamond' },
            { name: '🪞 Earrings', key: 'earrings' },
            { name: '💍 Rings', key: 'rings' },
            { name: '🥈 Silver', key: 'silver' },
            { name: '🪙 Coins', key: 'coins' },
            { name: '🏷️ Offers', key: 'offers' },
            { name: '💒 Wedding', key: 'wedding' },
            { name: '🎁 Gifting', key: 'gifting' },


          ].map(cat => (
            <div
              key={cat.key}
              onMouseEnter={() => {
                setShowDropdown(true)
                setActiveCategory(cat.key)
                // Set default filter for each category
                const defaults = { all: 'category', gold: 'category', diamond: 'category', earrings: 'category', rings: 'category', silver: 'category', coins: 'silver', wedding: 'category', gifting: 'giftsfor', offers: 'alloffers' }
                setActiveFilter(defaults[cat.key] || 'category')
              }}
              style={{
                padding: '20px 18px',
                fontSize: 18,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                color: (showDropdown && activeCategory === cat.key) ? '#8B1A1A' : '#374151',
                borderBottom: (showDropdown && activeCategory === cat.key) ? '3px solid #8B1A1A' : '3px solid transparent',
                fontWeight: (showDropdown && activeCategory === cat.key) ? 600 : 500,
                transition: 'all 0.15s',
              }}
            >{cat.name}</div>
          ))}
        </div>

        {/* Dropdown panel */}
        {showDropdown && (() => {

          // ── CONFIG for each category ──
          const DROPDOWN_CONFIG = {
            all: {
              filters: ['Category', 'Price', 'Occasion', 'Gender'],
              filterKeys: ['category', 'price', 'occasion', 'gender'],
              panels: {
                category: {
                  type: 'icon-grid',
                  items: ['Earrings', 'Finger Rings',
                    'Chains', 'Necklaces', 'Bangles', 'Bracelets'],
                },
                price: {
                  type: 'price-grid',
                  items: [{ label: '< ₹25K', emoji: '🪙' }, { label: '₹25K – ₹50K', emoji: '💛' }, { label: '₹50K – ₹1L', emoji: '💎' }, { label: '₹1L & Above', emoji: '👑' }],
                },
                occasion: {
                  type: 'occasion-grid',
                  items: [{ label: 'Office Wear', emoji: '💼' }, { label: 'Modern Wear', emoji: '🚗' }, { label: 'Casual Wear', emoji: '☀️' }, { label: 'Traditional Wear', emoji: '🪔' }],
                },
                gender: {
                  type: 'gender-grid',
                  items: [{ label: 'Women', emoji: '👩' }, { label: 'Men', emoji: '👨' }, { label: 'Kids & Teens', emoji: '👧' }],
                },
              }
            },
            gold: {
              filters: ['Category', 'Price', 'Occasion', 'Gender'],
              filterKeys: ['category', 'price', 'occasion', 'gender'],
              panels: {
                category: {
                  type: 'icon-grid',
                  items: ['Gold Bracelets', 'Gold Earrings', 'Gold Chains', 'Gold Rings', 'Gold Bangles', 'Gold Necklaces'],
                },
                price: {
                  type: 'price-grid',
                  items: [{ label: '< ₹25K', emoji: '🪙' }, { label: '₹25K – ₹50K', emoji: '💛' }, { label: '₹50K – ₹1L', emoji: '💎' }, { label: '₹1L & Above', emoji: '👑' }],
                },
                occasion: {
                  type: 'occasion-grid',
                  items: [{ label: 'Office Wear', emoji: '💼' }, { label: 'Modern Wear', emoji: '🚗' }, { label: 'Casual Wear', emoji: '☀️' }, { label: 'Traditional Wear', emoji: '🪔' }],
                },
                gender: {                          // 'men' block முழுவதும் இதை replace பண்ணு
      type: 'gender-grid',
      items: [{ label: 'Women', emoji: '👩' }, { label: 'Men', emoji: '👨' }, { label: 'Kids & Teens', emoji: '👧' }],
    },
              }
            },
            wedding: {
              filters: ['Category', 'Community'],
              filterKeys: ['category', 'community'],
              panels: {
                category: {
                  type: 'image-grid',
                  items: [
                    { label: 'Wedding Ring', emoji: '💍' },
                    { label: 'Wedding Necklaces', emoji: '📿' },
                    { label: 'Wedding Chain', emoji: '✨' },
                    { label: 'Wedding Bangles', emoji: '💛' },
                    { label: 'Wedding Earring', emoji: '👂' },
                    
                  ],
                },
                community: {
                  type: 'community-grid',
                  items: ['Tamil Bride', 'Kerala Bride', 'Karnataka Bride', 'Andhra Bride', 'Punjabi Bride'],
                },
              }
            },
            gifting: {
              filters: ['Gifts for', 'Gift Card', 'Price', 'Occasion', 'Corporate Gifting'],
              filterKeys: ['giftsfor', 'giftcard', 'price', 'occasion', 'corporate'],
              panels: {
                giftsfor: {
                  type: 'gender-grid',
                  items: [{ label: 'Her', emoji: '👩' }, { label: 'Him', emoji: '👨' }, { label: 'Kids', emoji: '👧' }],
                },
                giftcard: {
                  type: 'giftcard-grid',
                  items: [{ label: 'BitByte Gift Card', emoji: '🎁' }, { label: 'BitByte E-Gift Card', emoji: '💌' }],
                },
                price: {
                  type: 'price-grid',
                  items: [{ label: '< ₹25K', emoji: '🪙' }, { label: '₹25K – ₹50K', emoji: '💛' }, { label: '₹50K – ₹1L', emoji: '💎' }, { label: '₹1L & Above', emoji: '👑' }],
                },
                occasion: {
                  type: 'occasion-grid',
                  items: [{ label: 'Wedding', emoji: '💍' }, { label: 'Birthday', emoji: '🎂' }, { label: 'Anniversary', emoji: '❤️' }, { label: 'Auspicious', emoji: '🪔' }],
                },
                corporate: {
                  type: 'icon-grid',
                  items: ['Corporate Gifts', 'Bulk Orders', 'Custom Engraving'],
                  icon: '🏢',
                },
              }
            },

            diamond: {
              filters: ['Category', 'Price', 'Occasion', 'Gender'],
              filterKeys: ['category', 'price', 'occasion', 'gender'],
              panels: {
                category: {
                  type: 'icon-grid',
                  items: ['Diamond Earrings', 'Diamond Rings', 'Diamond Necklaces', 'Diamond Bangles', 'Diamond Bracelets'],
                  icon: '💎',
                },
                price: {
                  type: 'price-grid',
                  items: [{ label: '< ₹25K', emoji: '🪙' }, { label: '₹25K – ₹50K', emoji: '💛' }, { label: '₹50K – ₹1L', emoji: '💎' }, { label: '₹1L & Above', emoji: '👑' }],
                },
                occasion: {
                  type: 'occasion-grid',
                  items: [{ label: 'Office Wear', emoji: '💼' }, { label: 'Modern Wear', emoji: '🚗' }, { label: 'Casual Wear', emoji: '☀️' }, { label: 'Traditional Wear', emoji: '🪔' }],
                },
                gender: {
                  type: 'gender-grid',
                  items: [{ label: 'Women', emoji: '👩' }, { label: 'Men', emoji: '👨' }, { label: 'Kids & Teens', emoji: '👧' }],
                },
              }
            },

            earrings: {
              filters: ['Category', 'Price', 'Occasion', 'Gender',],
              filterKeys: ['category', 'price', 'occasion', 'gender',],
              panels: {
                category: {
                  type: 'icon-grid',
                  items: ['Men\'s Gold Earring', 'Women\'s Gold Earring', 'Kids Gold Earring', 'Gold Stud Earring', 'Gold Hoop Earring', 'Gold Drop Earring', 'Gold Stone Earring', 'Gold Plain Earring'],
                  icon: '💍',
                },
                price: {
                  type: 'price-grid',
                  items: [{ label: '< ₹25K', emoji: '🪙' }, { label: '₹25K – ₹50K', emoji: '💛' }, { label: '₹50K – ₹1L', emoji: '💎' }, { label: '₹1L & Above', emoji: '👑' }],
                },
                occasion: {
                  type: 'occasion-grid',
                  items: [{ label: 'Office Wear', emoji: '💼' }, { label: 'Modern Wear', emoji: '🚗' }, { label: 'Casual Wear', emoji: '☀️' }, { label: 'Traditional Wear', emoji: '🪔' }],
                },
                gender: {
                  type: 'gender-grid',
                  items: [{ label: 'Women', emoji: '👩' }, { label: 'Men', emoji: '👨' }, { label: 'Kids & Teens', emoji: '👧' }],
                },
              }
            },

            rings: {
              filters: ['Category', 'Price', 'Occasion', 'Gender',],
              filterKeys: ['category', 'price', 'occasion', 'gender',],
              panels: {
                category: {
                  type: 'icon-grid',
                  items: ['Casual Rings', 'Couple Rings', 'Diamond Engagement Rings', 'Engagement Rings', 'Gold Engagement Rings', 'Men\'s Rings', 'Platinum Engagement Rings'],
                  icon: '💍',
                },
                price: {
                  type: 'price-grid',
                  items: [{ label: '< ₹25K', emoji: '🪙' }, { label: '₹25K – ₹50K', emoji: '💛' }, { label: '₹50K – ₹1L', emoji: '💎' }, { label: '₹1L & Above', emoji: '👑' }],
                },
                occasion: {
                  type: 'occasion-grid',
                  items: [{ label: 'Office Wear', emoji: '💼' }, { label: 'Modern Wear', emoji: '🚗' }, { label: 'Casual Wear', emoji: '☀️' }, { label: 'Traditional Wear', emoji: '🪔' }],
                },
                gender: {
                  type: 'gender-grid',
                  items: [{ label: 'Women', emoji: '👩' }, { label: 'Men', emoji: '👨' }, { label: 'Kids & Teens', emoji: '👧' }],
                },
              }
            },

            silver: {
              filters: ['Category', 'Price', 'Occasion', 'Gender'],
              filterKeys: ['category', 'price', 'occasion', 'gender'],
              panels: {
                category: {
                  type: 'icon-grid',
                  items: ['Silver Bangles', 'Silver Bracelets', 'Silver Earrings', 'Silver Chains', 'Silver Rings', 'Silver Necklaces', 'Silver Anklets'],
                  icon: '🥈',
                },
                price: {
                  type: 'price-grid',
                  items: [{ label: '< ₹25K', emoji: '🪙' }, { label: '₹25K – ₹50K', emoji: '💛' }, { label: '₹50K – ₹1L', emoji: '💎' }, { label: '₹1L & Above', emoji: '👑' }],
                },
                occasion: {
                  type: 'occasion-grid',
                  items: [{ label: 'Office Wear', emoji: '💼' }, { label: 'Modern Wear', emoji: '🚗' }, { label: 'Casual Wear', emoji: '☀️' }, { label: 'Traditional Wear', emoji: '🪔' }],
                },
                gender: {
                  type: 'gender-grid',
                  items: [{ label: 'Women', emoji: '👩' }, { label: 'Men', emoji: '👨' }, { label: 'Kids & Teens', emoji: '👧' }],
                },
              }
            },
            coins: {
              filters: ['Silver', 'Gold 22K', 'Gold 24K', 'Price'],
              filterKeys: ['silver', 'gold22k', 'gold24k', 'price'],
              panels: {
                silver: {
                  type: 'coin-nav-grid',
                  metal: 'silver',
                  items: [
                    { label: 'All Silver', grams: null },
                    { label: '500 mg', grams: 0.50 },
                    { label: '1 gm', grams: 1 },
                    { label: '2 gm', grams: 2 },
                    { label: '5 gm', grams: 5 },
                    { label: '10 gm', grams: 10 },
                    { label: '20 gm', grams: 20 },
                    { label: '50 gm', grams: 50 },
                    { label: '100 gm', grams: 100 },
                  ],
                },
                gold22k: {
                  type: 'coin-nav-grid',
                  metal: 'gold22k',
                  items: [
                    { label: 'All Gold', grams: null },
                    { label: '100 mg', grams: 0.10 },
                    { label: '200 mg', grams: 0.20 },
                    { label: '500 mg', grams: 0.50 },
                    { label: '1 gm', grams: 1 },
                    { label: '2 gm', grams: 2 },
                    { label: '4 gm', grams: 4 },
                    { label: '8 gm', grams: 8 },
                    { label: '16 gm', grams: 16 },
                    { label: '40 gm', grams: 40 },
                  ],
                },
                gold24k: {
                  type: 'coin-nav-grid',
                  metal: 'gold24k',
                  items: [
                    { label: 'All Gold', grams: null },
                    { label: '100 mg', grams: 0.10 },
                    { label: '200 mg', grams: 0.20 },
                    { label: '500 mg', grams: 0.50 },
                    { label: '1 gm', grams: 1 },
                    { label: '2 gm', grams: 2 },
                    { label: '4 gm', grams: 4 },
                    { label: '8 gm', grams: 8 },
                    { label: '16 gm', grams: 16 },
                    { label: '40 gm', grams: 40 },
                  ],
                },
                price: {
                  type: 'price-grid',
                  items: [{ label: '< ₹25K', emoji: '🪙' }, { label: '₹25K – ₹50K', emoji: '💛' }, { label: '₹50K – ₹1L', emoji: '💎' }, { label: '₹1L & Above', emoji: '👑' }],
                },
              }
            },

            offers: {
              filters: ['All Offers', 'Gold Offers', 'Diamond Offers', 'Festive Deals'],
              filterKeys: ['alloffers', 'goldoffers', 'diamondoffers', 'festive'],
              panels: {
                alloffers: {
                  type: 'offers-grid',
                  items: [
                    { label: 'Making Charge Off', emoji: '🏷️', badge: 'UPTO 20%' },
                    { label: 'Exchange Bonus', emoji: '🔄', badge: 'EXTRA ₹500' },
                    { label: 'New Arrivals', emoji: '✨', badge: 'FRESH STOCK' },
                    { label: 'Clearance Sale', emoji: '🔥', badge: 'LIMITED' },
                  ],
                },
                goldoffers: {
                  type: 'offers-grid',
                  items: [
                    { label: 'Gold Making Off', emoji: '🥇', badge: 'UPTO 15%' },
                    { label: 'Gold Exchange', emoji: '🔄', badge: 'BONUS ₹300' },
                    { label: 'BIS Hallmark Gold', emoji: '✅', badge: 'CERTIFIED' },
                    { label: 'Gold Coins Deal', emoji: '🪙', badge: 'SPECIAL PRICE' },
                  ],
                },
                diamondoffers: {
                  type: 'offers-grid',
                  items: [
                    { label: 'Diamond Making Off', emoji: '💎', badge: 'UPTO 25%' },
                    { label: 'Solitaire Special', emoji: '💍', badge: 'EXCLUSIVE' },
                    { label: 'Certified Diamond', emoji: '✅', badge: 'IGI/GIA' },
                    { label: 'Buy 1 Get 1', emoji: '🎁', badge: 'LIMITED' },
                  ],
                },
                festive: {
                  type: 'offers-grid',
                  items: [
                    { label: 'Akshaya Tritiya', emoji: '🪔', badge: 'SPECIAL' },
                    { label: 'Dhanteras Offer', emoji: '🏮', badge: 'DIWALI' },
                    { label: 'Wedding Season', emoji: '💒', badge: 'BRIDAL' },
                    { label: 'Anniversary Deals', emoji: '❤️', badge: 'COUPLE' },
                  ],
                },
              }
            },
          }

          const cfg = DROPDOWN_CONFIG[activeCategory] || DROPDOWN_CONFIG['all']
          const panel = cfg.panels[activeFilter] || cfg.panels[cfg.filterKeys[0]]




          const renderPanel = () => {
            if (!panel) return null

            if (panel.type === 'icon-grid') {
              const CATEGORY_ROUTES = {
                'Earrings': '/collection/earrings',
                'Chains': '/collection/chains',
                'Necklaces': '/collection/necklaces',
                'Bangles': '/collection/bangles',
                'Finger Rings': '/collection/rings',
                'Bracelets': '/collection/bracelets',
                'Gold Bracelets': '/collection/bracelets',
                'Silver Bracelets': '/collection/bracelets',
                // Gold category routes
                'Gold Earrings': '/gold-earrings',
                'Gold Chains': '/gold-chains',
                'Gold Rings': '/gold-rings',
                'Gold Bangles': '/gold-bangles',
                'Gold Necklaces': '/gold-necklaces',
                'Gold Bracelets': '/gold-bracelets',
                // Silver category routes
                'Silver Bangles': '/silver-bangles',
                'Silver Earrings': '/silver-earrings',
                'Silver Chains': '/silver-chains',
                'Silver Rings': '/silver-rings',
                'Silver Necklaces': '/silver-necklaces',
                'Silver Bracelets': '/silver-bracelets',
                'Silver Anklets': '/collection/all?metal=silver',
                // Diamond category routes
                'Diamond Earrings': '/collection/earrings',
                'Diamond Rings': '/collection/rings',
                'Diamond Necklaces': '/collection/necklaces',
                'Diamond Bangles': '/collection/bangles',
                'Diamond Bracelets': '/collection/bracelets',
              }
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {panel.items.map(item => (
                    <div key={item}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fdf2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => {
                        const route = CATEGORY_ROUTES[item]
                        if (route) { setShowDropdown(false); navigate(route) }
                      }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: '#f5f0e8', border: '0.5px solid #e8e0d0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontSize: 14
                      }}>
                        {panel.icon || '💍'}
                      </div>
                      <span style={{ fontSize: 13, color: '#1f2937' }}>{item}</span>
                    </div>
                  ))}
                </div>
              )
            }

            // if (panel.type === 'silver-coin-grid') {
            //   return (
            //     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            //       {panel.items.map(item => {
            //         const w = WEIGHTS_SILVER.find(x => x.label === item)
            //         const price = w && metalPrices.silver != null ? (w.grams * metalPrices.silver).toFixed(2) : null
            //         return (
            //           <div key={item}
            //             style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            //               padding: '10px 8px', borderRadius: 12, cursor: 'pointer',
            //               border: '1px solid rgba(192,192,192,0.25)',
            //               background: 'rgba(192,192,192,0.05)',
            //               transition: 'all 0.2s' }}
            //             onMouseEnter={e => {
            //               e.currentTarget.style.background = 'rgba(192,192,192,0.18)'
            //               e.currentTarget.style.borderColor = 'rgba(192,192,192,0.85)'
            //               e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)'
            //               e.currentTarget.style.boxShadow = '0 8px 24px rgba(192,192,192,0.35)'
            //             }}
            //             onMouseLeave={e => {
            //               e.currentTarget.style.background = 'rgba(192,192,192,0.05)'
            //               e.currentTarget.style.borderColor = 'rgba(192,192,192,0.25)'
            //               e.currentTarget.style.transform = 'translateY(0) scale(1)'
            //               e.currentTarget.style.boxShadow = 'none'
            //             }}
            //           >
            //             <img src={silverCoin} alt={item}
            //               style={{ width: 54, height: 54, objectFit: 'contain',
            //                 filter: 'drop-shadow(0 2px 6px rgba(192,192,192,0.6))',
            //                 transition: 'all 0.25s' }} />
            //             <div style={{ fontSize: 10, fontWeight: 800, color: '#c0c0c0',
            //               background: 'rgba(192,192,192,0.12)', border: '1px solid rgba(192,192,192,0.3)',
            //               borderRadius: 20, padding: '2px 8px' }}>{item}</div>
            //             <div style={{ color: '#d1d5db', fontWeight: 700, fontSize: 11, fontFamily: 'monospace' }}>
            //               {price ? `₹${price}` : '—'}
            //             </div>
            //             <div style={{ display: 'flex', gap: 4, width: '100%' }}>
            //               <button
            //                 onClick={e => {
            //                   e.stopPropagation()
            //                   if (w) addMetalToCart('silver_999', 'Silver 999', w, price, silverCoin)
            //                   setShowDropdown(false)
            //                 }}
            //                 style={{ flex: 1, padding: '4px 0', background: 'rgba(192,192,192,0.15)',
            //                   border: '1px solid rgba(192,192,192,0.45)', borderRadius: 7,
            //                   color: '#c0c0c0', fontSize: 9, fontWeight: 800, cursor: 'pointer' }}
            //               >🪙 Cart</button>
            //               <button
            //                 onClick={e => {
            //                   e.stopPropagation()
            //                   setOrderMetal('silver_999'); setOrderWeight(item)
            //                   setOrderCount(1); setOrderMsg(''); setOrderPopup(true)
            //                   setShowDropdown(false)
            //                 }}
            //                 style={{ flex: 1, padding: '4px 0', background: 'linear-gradient(90deg,#9ca3af,#e5e7eb)',
            //                   border: 'none', borderRadius: 7,
            //                   color: '#000', fontSize: 9, fontWeight: 900, cursor: 'pointer' }}
            //               >🛒 Buy</button>
            //             </div>
            //           </div>
            //         )
            //       })}
            //     </div>
            //   )
            // }



            if (panel.type === 'price-grid') {
              const priceImgMap = {
                '< ₹25K': '/25k below.jpg',
                '₹25K – ₹50K': '/25k-50k.jpg',
                '₹50K – ₹1L': '/50k-1L.jpg',
                '₹1L & Above': '/1L above.jpg',
              }
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                  {panel.items.map(p => {
                    const imgSrc = priceImgMap[p.label]
                    return (
                      <div key={p.label} style={{ textAlign: 'center', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.querySelector('.ph-box').style.borderColor = '#8B1A1A'; e.currentTarget.querySelector('.ph-label').style.color = '#8B1A1A' }}
                        onMouseLeave={e => { e.currentTarget.querySelector('.ph-box').style.borderColor = '#e8e0d0'; e.currentTarget.querySelector('.ph-label').style.color = '#1f2937' }}
                        onClick={() => {
                          const priceMap = { '< ₹25K': 'below25k', '₹25K – ₹50K': '25k-50k', '₹50K – ₹1L': '50k-1L', '₹1L & Above': 'above1L' }
                          const metalMap = { gold: 'gold', silver: 'silver', diamond: 'gold', earrings: '', rings: '', all: '' }
                          const priceKey = priceMap[p.label]
                          const metalParam = metalMap[activeCategory] ? `&metal=${metalMap[activeCategory]}` : ''
                          setShowDropdown(false)
                          navigate(`/collection/all?price=${priceKey}${metalParam}`)
                        }}>
                        <div className="ph-box" style={{
                          width: '90%', height: '190px', borderRadius: 12,
                          background: '#f5f0e8', border: '0.5px solid #e8e0d0',
                          overflow: 'hidden', marginBottom: 8,
                          transition: 'border-color 0.15s'
                        }}>
                          {imgSrc
                            ? <img src={imgSrc} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            : <span style={{ fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>{p.emoji}</span>
                          }
                        </div>
                        <div className="ph-label" style={{ fontSize: 13, color: '#1f2937', transition: 'color 0.15s' }}>{p.label}</div>
                      </div>
                    )
                  })}
                </div>
              )
            }

            if (panel.type === 'occasion-grid') {
              const occasionImgMap = {
                'Office Wear': '/Office Wear.jpg',
                'Modern Wear': '/Modern Wear.jpg',
                'Casual Wear': '/Casual Wear.jpg',
                'Traditional Wear': '/Traditional Wear.jpg',
              }
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                  {panel.items.map(o => {
                    const imgSrc = occasionImgMap[o.label]
                    return (
                      <div key={o.label} style={{ textAlign: 'center', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.querySelector('.oh-box').style.borderColor = '#8B1A1A' }}
            onMouseLeave={e => { e.currentTarget.querySelector('.oh-box').style.borderColor = '#e8e0d0' }}
            onClick={() => {
              setShowDropdown(false)
              navigate(`/collection/all?occasion=${encodeURIComponent(o.label)}`)
            }}>
                        <div className="oh-box" style={{
                          width: '100%',
                          height: '190px',
                          borderRadius: 12,
                          background: '#f5f0e8',
                          border: '0.5px solid #e8e0d0',
                          overflow: 'hidden',
                          marginBottom: 8,
                          transition: 'border-color 0.15s'
                        }}>
                          {imgSrc
                            ? <img src={imgSrc} alt={o.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            : <span style={{ fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>{o.emoji}</span>
                          }
                        </div>
                        <div style={{ fontSize: 13, color: '#1f2937' }}>{o.label}</div>
                      </div>
                    )
                  })}
                </div>
              )
            }

            if (panel.type === 'gender-grid') return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, maxWidth: 460 }}>
                {panel.items.map(g => {
                  const genderImgMap = {
                    'Women': "/Woman's Jewlley.jpg",
                    'Her': "/Woman's Jewlley.jpg",
                    'Men': "/Men's Jewellery.jpg",
                    'Him': "/Men's Jewellery.jpg",
                    'Kids & Teens': "/Kids Jewllery.jpg",
                    'Kids': "/Kids Jewllery.jpg",
                  }
                  const imgSrc = genderImgMap[g.label]
                  return (
                    <div key={g.label} style={{ textAlign: 'center', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.querySelector('.gh-box').style.borderColor = '#8B1A1A' }}
                      onMouseLeave={e => { e.currentTarget.querySelector('.gh-box').style.borderColor = '#e8e0d0' }}
                      onClick={() => {
                        const gMap = { 'Women': 'women', 'Her': 'women', 'Men': 'men', 'Him': 'men', 'Kids & Teens': 'kids', 'Kids': 'kids' }
                        const g2 = gMap[g.label]
                        if (g2) { setShowDropdown(false); navigate(`/collection/all?gender=${g2}`) }
                      }}>
                      <div className="gh-box" style={{
                        width: '100%', aspectRatio: '0.85', borderRadius: 12,
                        background: '#f5f0e8', border: '0.5px solid #e8e0d0',
                        overflow: 'hidden', marginBottom: 8,
                        transition: 'border-color 0.15s'
                      }}>
                        {imgSrc
                          ? <img src={imgSrc} alt={g.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          : <span style={{ fontSize: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>{g.emoji}</span>
                        }
                      </div>
                      <div style={{ fontSize: 13, color: '#1f2937' }}>{g.label}</div>
                    </div>
                  )
                })}
              </div>
            )

if (panel.type === 'image-grid') {
  const weddingImgMap = {
    'Wedding Ring':      '/wedding_ring.jpg',
    'Wedding Necklaces': '/wedding_necklaces.jpg',
    'Wedding Chain':     '/wedding_chain.jpg',
    'Wedding Bangles':   '/wedding_bangesh.jpg',
    'Wedding Earring':   '/wedding_earring.jpg',
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
      {panel.items.map(item => {
        const imgSrc = weddingImgMap[item.label]
        return (
          <div key={item.label} style={{ textAlign: 'center', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.querySelector('.wh-box').style.borderColor = '#8B1A1A' }}
            onMouseLeave={e => { e.currentTarget.querySelector('.wh-box').style.borderColor = '#e8e0d0' }}
            onClick={() => {
              setShowDropdown(false)
              navigate(`/collection/all?wedding_category=${encodeURIComponent(item.label)}`)
            }}>
              
                        <div className="wh-box" style={{
                          width: '90%',
                          height: '190px',
                          borderRadius: 12,
                          background: '#f5f0e8',
                          border: '0.5px solid #e8e0d0',
                          overflow: 'hidden',
                          marginBottom: 8,
                          transition: 'border-color 0.15s'
                        }}>
                          {imgSrc
                            ? <img src={imgSrc} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            : <span style={{ fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>{item.emoji}</span>
                          }
                        </div>
                        <div style={{ fontSize: 13, color: '#1f2937' }}>{item.label}</div>
                      </div>
                    )
                  })}
                </div>
              )
            }

            if (panel.type === 'community-grid') return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
                {panel.items.map(item => (
                  <div key={item} style={{ textAlign: 'center', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.querySelector('.ch-box').style.borderColor = '#8B1A1A'; e.currentTarget.querySelector('.ch-label').style.color = '#8B1A1A' }}
                    onMouseLeave={e => { e.currentTarget.querySelector('.ch-box').style.borderColor = '#e8e0d0'; e.currentTarget.querySelector('.ch-label').style.color = '#1f2937' }}>
                    <div className="ch-box" style={{ width: '100%', aspectRatio: '0.75', borderRadius: 10, background: 'linear-gradient(135deg,#fdf2f2,#f5f0e8)', border: '0.5px solid #e8e0d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 6, transition: 'border-color 0.15s' }}>
                      👰
                    </div>
                    <div className="ch-label" style={{ fontSize: 11, color: '#1f2937', transition: 'color 0.15s', lineHeight: 1.3 }}>{item}</div>
                  </div>
                ))}
              </div>
            )

            if (panel.type === 'giftcard-grid') return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, maxWidth: 360 }}>
                {panel.items.map(item => (
                  <div key={item.label} style={{ cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.querySelector('.gc-box').style.borderColor = '#8B1A1A' }}
                    onMouseLeave={e => { e.currentTarget.querySelector('.gc-box').style.borderColor = '#c9a0a0' }}>
                    <div className="gc-box" style={{ width: '100%', aspectRatio: '1.6', borderRadius: 12, background: 'linear-gradient(135deg,#6b0f0f,#8B1A1A)', border: '2px solid #c9a0a0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8, transition: 'border-color 0.15s' }}>
                      <span style={{ fontSize: 28 }}>{item.emoji}</span>
                      <span style={{ fontSize: 11, color: '#fff', fontStyle: 'italic', letterSpacing: '0.5px', fontWeight: 300 }}>BitByte</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#1f2937', textAlign: 'center' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            )

            if (panel.type === 'coin-nav-grid') {
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {panel.items.map(item => (
                    <div key={item.label}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fdf2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      // coin-nav-grid onClick-ல
onClick={() => {
  setShowDropdown(false)
  if (panel.metal === 'silver') {
    navigate(item.grams ? `/silver-coins?weight=${encodeURIComponent(item.label)}` : '/silver-coins')
  } else {
    const grade = panel.metal === 'gold24k' ? '24k' : '22k'
    if (item.grams) {
      navigate(`/gold-coins?weight=${encodeURIComponent(item.label)}&grade=${grade}`)
    } else {
      // "All Gold" — grade pass பண்ணு
      navigate(`/gold-coins?grade=${grade}`)
    }
  }
}}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: '#f5f0e8', border: '0.5px solid #e8e0d0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontSize: 14
                      }}>
                        {panel.metal === 'silver' ? '🥈' : '🥇'}
                      </div>
                      <span style={{ fontSize: 13, color: '#1f2937' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              )
            }
            if (panel.type === 'offers-grid') return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
                {panel.items.map(o => (
                  <div key={o.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, background: '#fdf2f2', border: '0.5px solid #f3d5d5', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f7e0e0'; e.currentTarget.style.borderColor = '#8B1A1A' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fdf2f2'; e.currentTarget.style.borderColor = '#f3d5d5' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', border: '1px solid #f3d5d5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                      {o.emoji}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: '#1f2937', fontWeight: 500 }}>{o.label}</div>
                      <div style={{ fontSize: 10, color: '#8B1A1A', fontWeight: 700, letterSpacing: '0.5px', marginTop: 3, background: '#fce8e8', display: 'inline-block', padding: '2px 8px', borderRadius: 20 }}>{o.badge}</div>
                    </div>
                  </div>
                ))}
              </div>
            )



            return null
          }

          // Section title map
          const sectionTitles = {
            category: 'Browse by Category', price: 'Shop by Price', occasion: 'Shop by Occasion',
            gender: 'Shop by Gender', goldcoin: 'Gold Coins by Weight', silvercoin: 'Silver Coins by Weight', men: 'For Men',
            metal: 'By Metal & Stones', community: 'Shop by Community', giftsfor: 'Gifts for',
            giftcard: 'Gift Cards', corporate: 'Corporate Gifting', wedding: 'Wedding Collections',
            style: 'Shop by Style', alloffers: 'All Offers', goldoffers: 'Gold Offers',
            diamondoffers: 'Diamond Offers', festive: 'Festive Deals',
            silver: 'Silver Coins', gold22k: 'Gold 22K Coins', gold24k: 'Gold 24K Coins',
          }

          return (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200, background: '#fff', borderBottom: '0.5px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'flex', minHeight: '260px' }}>

              {/* Left filter tabs */}
              <div style={{ width: 190, borderRight: '0.5px solid #f3f4f6', padding: '20px 0', flexShrink: 0 }}>
                {cfg.filters.map((f, i) => (
                  <div
                    key={cfg.filterKeys[i]}
                    onMouseEnter={() => setActiveFilter(cfg.filterKeys[i])}
                    style={{
                      padding: '11px 22px', fontSize: 13, cursor: 'pointer',
                      margin: '2px 10px', borderRadius: 8,
                      color: activeFilter === cfg.filterKeys[i] ? '#8B1A1A' : '#4b5563',
                      background: activeFilter === cfg.filterKeys[i] ? '#fdf2f2' : 'transparent',
                      fontWeight: activeFilter === cfg.filterKeys[i] ? 600 : 400,
                      transition: 'all 0.15s',
                    }}
                  >{f}</div>
                ))}
              </div>

              {/* Right panel */}
              <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', maxHeight: '420px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#8B1A1A', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '0.5px solid #fce8e8' }}>
                  {sectionTitles[activeFilter] || activeFilter}
                </div>
                {renderPanel()}
              </div>

            </div>
          )
        })()}
      </div>

      <HomeBannerSlider />

      <div style={{ position: 'relative', zIndex: 10, padding: '28px 40px', maxWidth: '1400px', margin: '0 auto' }}>





        {/* ── CUSTOMER PROFILE MODAL ── */}
        {showProfile && (
          <div onClick={() => setShowProfile(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div onClick={e => e.stopPropagation()} style={{ background: dark ? 'linear-gradient(145deg,#0a1628,#060e1c)' : '#f8fafc', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '24px', width: '95%', maxWidth: '580px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>
              <div style={{ flexShrink: 0, padding: '24px 28px', borderBottom: '1px solid rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,rgba(52,211,153,0.25),rgba(34,211,238,0.15))', border: '2px solid rgba(52,211,153,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>👤</div>
                  <div>
                    <div style={{ color: '#34d399', fontWeight: 800, fontSize: '15px' }}>MY PROFILE</div>
                    <div style={{ color: subtext, fontSize: '11px', fontFamily: 'monospace' }}>{profile?.customer_id || '—'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

                  <button
                    onClick={openProfileEdit}
                    style={{
                      background: 'rgba(52,211,153,0.12)',
                      border: '1px solid rgba(52,211,153,0.35)',
                      color: '#34d399',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 800
                    }}
                  >
                    ✎ Edit
                  </button>

                  <button
                    onClick={() => setShowProfile(false)}
                    style={{
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: '#f87171',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕ Close
                  </button>

                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px', scrollbarWidth: 'thin' }}>
                {!profile ? <div style={{ textAlign: 'center', color: subtext, padding: '60px 0' }}>Loading...</div> : (
                  <>
                    {[
                      // REPLACE WITH:
                      {
                        title: 'ACCOUNT INFO', color: '#34d399', fields: [
                          { label: 'Customer ID', value: profile.customer_id, mono: true, color: '#34d399' },
                          { label: 'Initial', value: profile.initial },
                          { label: 'First Name', value: profile.first_name },
                          { label: 'Last Name', value: profile.last_name },
                          { label: 'Email', value: profile.email },
                          { label: 'Mobile', value: profile.mobile_number },
                          { label: 'Gender', value: profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : '—' },
                          { label: 'DOB', value: profile.dob ? new Date(profile.dob + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—' },
                          { label: 'Married Status', value: profile.married_status ? profile.married_status.charAt(0).toUpperCase() + profile.married_status.slice(1) : '—' },
                          { label: 'Anniversary', value: profile.anniversary_date ? new Date(profile.anniversary_date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—' },
                        ]
                      },
                      {
                        title: 'ADDRESS', color: '#22d3ee', fields: [
                          { label: 'Door No', value: profile.door_no },
                          { label: 'Street', value: profile.street_name },
                          { label: 'Town', value: profile.town_name },
                          { label: 'City', value: profile.city_name },
                          { label: 'District', value: profile.district },
                          { label: 'State', value: profile.state },
                        ]
                      },
                      {
                        title: 'IDENTITY', color: '#a78bfa', fields: [
                          { label: 'Aadhaar No', value: profile.aadhaar_no, mask: true },
                          { label: 'PAN No', value: profile.pan_no, pan: true, mono: true },
                        ]
                      },
                      {
                        title: 'OCCUPATION', color: '#f59e0b', fields: [
                          { label: 'Type', value: profile.occupation ? profile.occupation.charAt(0).toUpperCase() + profile.occupation.slice(1) : '—' },
                          { label: 'Detail', value: profile.occupation_detail },
                          { label: 'Annual Salary', value: profile.annual_salary ? `₹ ${Number(profile.annual_salary).toLocaleString('en-IN')}` : '—' },
                        ]
                      },
                      {
                        title: 'PROMOTOR INFO', color: '#f472b6', fields: [
                          { label: 'Promotor ID', value: profile.promotor_id, mono: true, color: '#f472b6' },
                          { label: 'Promotor Name', value: profile.promotor_name },
                          { label: 'Promotor Contact', value: profile.promotor_contact_no },
                          { label: 'Member Since', value: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—' },
                        ]
                      },
                    ].map(section => (
                      <div key={section.title} style={{ background: `rgba(${section.color === '#34d399' ? '52,211,153' : section.color === '#22d3ee' ? '34,211,238' : section.color === '#a78bfa' ? '167,139,250' : section.color === '#f59e0b' ? '245,158,11' : '244,114,182'},0.04)`, border: `1px solid rgba(${section.color === '#34d399' ? '52,211,153' : section.color === '#22d3ee' ? '34,211,238' : section.color === '#a78bfa' ? '167,139,250' : section.color === '#f59e0b' ? '245,158,11' : '244,114,182'},0.18)`, borderRadius: '16px', padding: '18px 20px' }}>
                        <div style={{ color: section.color, fontSize: '10px', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: section.color, display: 'inline-block' }} />{section.title}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: section.fields.length === 3 ? '1fr 1fr 1fr' : '1fr 1fr', gap: '12px' }}>
                          {section.fields.map(f => (
                            <div key={f.label}>
                              <div style={{ color: subtext, fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>{f.label}</div>
                              <div style={{ color: f.color || text, fontSize: '13px', fontWeight: f.mono ? 700 : 500, fontFamily: f.mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>
                                {f.mask && f.value ? `XXXX-XXXX-${f.value.slice(-4)}` : f.pan && f.value ? `XXXXXXX${f.value.slice(-4)}` : (f.value || '—')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {showProfileEdit && (
          <div onClick={() => setShowProfileEdit(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={submitProfileUpdate} onClick={e => e.stopPropagation()} style={{ background: dark ? 'linear-gradient(145deg,#0a1628,#060e1c)' : '#f8fafc', border: '1px solid rgba(52,211,153,0.35)', borderRadius: '24px', width: '96%', maxWidth: '1050px', maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 32px 90px rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column' }}>

              <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(52,211,153,0.16)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#34d399', fontWeight: 900, fontSize: '15px', letterSpacing: '1px' }}>✎ PROFILE UPDATE REQUEST</div>
                  <div style={{ color: subtext, fontSize: '12px', marginTop: '4px' }}>Existing details compare pannitu correct details full ah enter pannunga</div>
                </div>
                <button type="button" onClick={() => setShowProfileEdit(false)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer' }}>✕ Close</button>
              </div>

              <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(52,211,153,0.08)' }}>
                      {['Existing Details Description', 'Existing Details', 'Details To Updated'].map(h => (
                        <th key={h} style={{ padding: '14px', color: '#34d399', textAlign: 'left', border: '1px solid rgba(52,211,153,0.2)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {PROFILE_FIELDS.map(([key, label]) => (
                      <tr key={key}>
                        <td style={{ padding: '12px 14px', border: '1px solid rgba(255,255,255,0.08)', color: '#6ee7b7', fontWeight: 700 }}>{label}</td>

                        <td style={{ padding: '12px 14px', border: '1px solid rgba(255,255,255,0.08)', color: text, wordBreak: 'break-all' }}>
                          {profile?.[key] || '—'}
                        </td>

                        <td style={{ padding: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                          {key === 'gender' ? (
                            <select
                              name={key}
                              value={updateForm[key] || 'male'}
                              onChange={handleUpdateChange}
                              style={{ width: '100%', background: inpBg, border: `1px solid ${inpBorder}`, borderRadius: '9px', padding: '10px 12px', color: text, outline: 'none', boxSizing: 'border-box' }}
                            >
                              <option value="male" style={{ background: optionBg, color: text }}>Male</option>
                              <option value="female" style={{ background: optionBg, color: text }}>Female</option>
                              <option value="other" style={{ background: optionBg, color: text }}>Other</option>
                            </select>
                          ) : key === 'married_status' ? (
                            <select
                              name={key}
                              value={updateForm[key] || 'single'}
                              onChange={handleUpdateChange}
                              style={{ width: '100%', background: inpBg, border: `1px solid ${inpBorder}`, borderRadius: '9px', padding: '10px 12px', color: text, outline: 'none', boxSizing: 'border-box' }}
                            >
                              <option value="single" style={{ background: optionBg, color: text }}>Single</option>
                              <option value="married" style={{ background: optionBg, color: text }}>Married</option>
                              <option value="other" style={{ background: optionBg, color: text }}>Other</option>
                            </select>
                          ) : key === 'dob' ? (
                            <input
                              type="date"
                              name={key}
                              value={updateForm[key] || ''}
                              onChange={handleUpdateChange}
                              style={{ width: '100%', background: inpBg, border: `1px solid ${inpBorder}`, borderRadius: '9px', padding: '10px 12px', color: text, outline: 'none', boxSizing: 'border-box' }}
                            />
                          ) : key === 'anniversary_date' ? (
                            updateForm.married_status === 'married' ? (
                              <input
                                type="date"
                                name={key}
                                value={updateForm[key] || ''}
                                onChange={handleUpdateChange}
                                style={{ width: '100%', background: inpBg, border: `1px solid ${inpBorder}`, borderRadius: '9px', padding: '10px 12px', color: text, outline: 'none', boxSizing: 'border-box' }}
                              />
                            ) : (
                              <span style={{ color: subtext, fontSize: '12px' }}>Only married select panna show aagum</span>
                            )
                          ) : (
                            <input
                              name={key}
                              value={updateForm[key] || ''}
                              onChange={handleUpdateChange}
                              required
                              style={{ width: '100%', background: inpBg, border: `1px solid ${inpBorder}`, borderRadius: '9px', padding: '10px 12px', color: text, outline: 'none', boxSizing: 'border-box' }}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', color: subtext, fontSize: '12px', marginBottom: '8px', fontWeight: 700 }}>
                    Message / Reason
                  </label>

                  <textarea
                    value={updateMessage}
                    onChange={e => setUpdateMessage(e.target.value)}
                    placeholder="Example: My mobile number is wrong, please update it..."
                    rows={3}
                    style={{
                      width: '100%',
                      background: inpBg,
                      border: `1px solid ${inpBorder}`,
                      borderRadius: '10px',
                      padding: '12px 14px',
                      color: text,
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', color: subtext, fontSize: '12px', marginBottom: '8px', fontWeight: 700 }}>
                    Upload Proof Document
                  </label>

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => setProofDocument(e.target.files[0])}
                    style={{
                      width: '100%',
                      background: inpBg,
                      border: `1px solid ${inpBorder}`,
                      borderRadius: '10px',
                      padding: '10px 12px',
                      color: text,
                      boxSizing: 'border-box'
                    }}
                  />

                  {proofDocument && (
                    <div style={{ color: '#4ade80', fontSize: '12px', marginTop: '8px' }}>
                      ✅ Selected: {proofDocument.name}
                    </div>
                  )}



                </div>
              </div>

              <div style={{ padding: '18px 28px', borderTop: '1px solid rgba(52,211,153,0.14)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowProfileEdit(false)} style={{ padding: '12px 22px', background: inpBg, border: `1px solid ${border}`, borderRadius: '12px', color: subtext, cursor: 'pointer' }}>
                  Cancel
                </button>

                <button type="submit" style={{ padding: '12px 30px', background: 'linear-gradient(90deg,#34d399,#22d3ee)', border: 'none', borderRadius: '12px', color: '#003b40', fontWeight: 900, cursor: 'pointer' }}>
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── ANNOUNCEMENT VIEW MODAL (Customer) ── */}

        {showAnnouncements && (
          <div onClick={() => setShowAnnouncements(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div onClick={e => e.stopPropagation()} style={{ background: dark ? 'linear-gradient(145deg,#0a1628,#060e1c)' : '#f8fafc', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '24px', width: '95%', maxWidth: '560px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)', animation: 'fadeIn 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
              <div style={{ flexShrink: 0, padding: '24px 28px', borderBottom: '1px solid rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg,rgba(52,211,153,0.25),rgba(34,211,238,0.15))', border: '1px solid rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📢</div>
                  <div>
                    <div style={{ color: '#34d399', fontWeight: 800, fontSize: '14px' }}>ANNOUNCEMENTS</div>
                    <div style={{ color: subtext, fontSize: '11px', marginTop: '2px' }}>{announcements.length} total from Super Admin</div>
                  </div>
                </div>
                <button onClick={() => setShowAnnouncements(false)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px' }}>✕ Close</button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {announcements.length === 0 ? (
                  <div style={{ textAlign: 'center', color: subtext, padding: '60px 0', fontSize: '15px' }}>No announcements yet.</div>
                ) : announcements.map((ann, idx) => {
                  const isMentioned = isCurrentUserMentioned(ann.title)
                  const alreadyReplied = repliedIds.has(ann.id)
                  const replies = annReplies[ann.id] || []
                  return (
                    <div key={ann.id} style={{ background: idx === 0 ? (dark ? 'rgba(52,211,153,0.07)' : 'rgba(52,211,153,0.05)') : (dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'), border: `1px solid ${idx === 0 ? 'rgba(52,211,153,0.35)' : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)')}`, borderRadius: '14px', padding: '16px 18px', position: 'relative' }}>

                      {/* Title row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {idx === 0 && <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '20px', background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>● NEW</span>}
                          <span style={{ color: idx === 0 ? '#34d399' : text, fontWeight: 700, fontSize: '14px' }}>{ann.title}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: subtext, fontSize: '10px', whiteSpace: 'nowrap' }}>{new Date(ann.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          <button
                            disabled={alreadyReplied}
                            onClick={() => { setReplyAnn(ann); setReplyMsg(''); setReplyText('') }}
                            style={{ padding: '4px 12px', fontSize: '10px', fontWeight: 700, borderRadius: '20px', cursor: alreadyReplied ? 'not-allowed' : 'pointer', background: alreadyReplied ? 'rgba(255,255,255,0.05)' : 'rgba(52,211,153,0.15)', border: `1px solid ${alreadyReplied ? 'rgba(255,255,255,0.1)' : 'rgba(52,211,153,0.4)'}`, color: alreadyReplied ? subtext : '#34d399', whiteSpace: 'nowrap', transition: 'all 0.2s ease' }}
                          >{alreadyReplied ? '✓ Wished' : '💬 Reply'}</button>
                        </div>
                      </div>

                      {/* Message */}
                      <p style={{ color: dark ? '#cbd5e1' : '#475569', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{ann.message}</p>

                      {/* Hover popup — only if mentioned */}
                      {isMentioned && (
                        <div
                          onMouseEnter={e => {
                            clearTimeout(wishTimerRef.current)
                            const rect = e.currentTarget.getBoundingClientRect()
                            let left = rect.left + rect.width / 2
                            if (left - 160 < 12) left = 172
                            if (left + 160 > window.innerWidth - 12) left = window.innerWidth - 172
                            setReplyPopupPos({ top: rect.top, left })
                            setReplyPopupAnnId(ann.id)
                            fetchReplies(ann.id)
                          }}
                          onMouseLeave={() => { wishTimerRef.current = setTimeout(() => setReplyPopupAnnId(null), 220) }}
                          style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}
                        >
                          <div style={{ fontSize: '10px', color: '#4ade80', padding: '3px 14px', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '20px', cursor: 'default', background: 'rgba(74,222,128,0.06)', fontWeight: 600 }}>
                            🎂 You are mentioned · {replies.length} wish{replies.length !== 1 ? 'es' : ''} — hover to see
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── REPLY MODAL — Customer ── */}
        {replyAnn && (
          <div onClick={() => { setReplyAnn(null); setReplyMsg(''); setReplyText('') }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div onClick={e => e.stopPropagation()} style={{ background: dark ? 'linear-gradient(145deg,#0a1628,#060e1c)' : '#f8fafc', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '20px', padding: '28px', width: '95%', maxWidth: '460px', boxShadow: '0 32px 80px rgba(0,0,0,0.7)', animation: 'fadeIn 0.25s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={{ color: '#34d399', fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em' }}>💬 SEND YOUR WISH</div>
                  <div style={{ color: subtext, fontSize: '11px', marginTop: '4px' }}>Replying to: <span style={{ color: text, fontWeight: 600 }}>{replyAnn.title}</span></div>
                </div>
                <button onClick={() => setReplyAnn(null)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px' }}>✕</button>
              </div>
              {replyMsg && (
                <div style={{ background: replyMsg.includes('✅') ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${replyMsg.includes('✅') ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`, color: replyMsg.includes('✅') ? '#4ade80' : '#f87171', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>{replyMsg}</div>
              )}
              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4} placeholder="Type your wish or message..." style={{ width: '100%', background: inpBg, border: `1px solid ${inpBorder}`, borderRadius: '10px', padding: '12px 14px', color: text, fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#34d399'} onBlur={e => e.target.style.borderColor = inpBorder} />
              <button disabled={replyLoading || !replyText.trim()} onClick={submitReply} style={{ marginTop: '14px', width: '100%', padding: '13px', background: replyLoading || !replyText.trim() ? 'rgba(52,211,153,0.2)' : 'linear-gradient(90deg,#34d399,#22d3ee)', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '14px', color: replyLoading || !replyText.trim() ? '#34d399' : '#003b40', cursor: replyLoading || !replyText.trim() ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease' }}>
                {replyLoading ? '⏳ Sending...' : '💬 Send Wish'}
              </button>
            </div>
          </div>
        )}



        {/* ── TODAY RATE POPUP ── */}
        {showTodayRate && (
          <div
            onClick={() => setShowTodayRate(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 1100,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: '#fdf5ee',
                borderRadius: 24,
                width: '95%', maxWidth: 400,
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
                animation: 'fadeIn 0.3s ease'
              }}
            >
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg,#8B1A1A,#b91c1c)',
                padding: '20px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>📅 Today's Rate</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 3 }}>
                    📍 Chennai, India • ₹ per gram
                    {dbRateDate && <span style={{ marginLeft: 8, color: '#ffd700' }}>
                      {new Date(dbRateDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>}
                  </div>
                </div>
                <button
                  onClick={() => setShowTodayRate(false)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#fff', borderRadius: 8,
                    padding: '5px 12px', cursor: 'pointer', fontSize: 12
                  }}
                >✕</button>
              </div>

              {/* Rate Cards */}
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Silver 1g */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(192,192,192,0.08)',
                  border: '1px solid rgba(192,192,192,0.3)',
                  borderRadius: 14, padding: '14px 18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 28 }}>🥈</span>
                    <div>
                      <div style={{ color: '#9ca3af', fontWeight: 800, fontSize: 13 }}>SILVER 999</div>
                      <div style={{ color: '#7c5c4a', fontSize: 11, marginTop: 2 }}>1 gram rate</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#9ca3af', fontWeight: 900, fontSize: 22, fontFamily: 'monospace' }}>
                      {metalPrices.silver ? `₹${metalPrices.silver.toFixed(2)}` : '—'}
                    </div>
                    <div style={{ color: '#7c5c4a', fontSize: 10 }}>per gram</div>
                  </div>
                </div>

                {/* Gold 22K 1g */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(251,191,36,0.08)',
                  border: '1px solid rgba(251,191,36,0.4)',
                  borderRadius: 14, padding: '14px 18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 28 }}>🏅</span>
                    <div>
                      <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: 13 }}>GOLD 22K</div>
                      <div style={{ color: '#7c5c4a', fontSize: 11, marginTop: 2 }}>1 gram rate</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#fbbf24', fontWeight: 900, fontSize: 22, fontFamily: 'monospace' }}>
                      {metalPrices.gold22k ? `₹${metalPrices.gold22k.toFixed(2)}` : '—'}
                    </div>
                    <div style={{ color: '#7c5c4a', fontSize: 10 }}>per gram</div>
                  </div>
                </div>

                {/* Gold 24K 1g */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(255,215,0,0.08)',
                  border: '1px solid rgba(255,215,0,0.4)',
                  borderRadius: 14, padding: '14px 18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 28 }}>🥇</span>
                    <div>
                      <div style={{ color: '#ffd700', fontWeight: 800, fontSize: 13 }}>GOLD 24K</div>
                      <div style={{ color: '#7c5c4a', fontSize: 11, marginTop: 2 }}>1 gram rate</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#ffd700', fontWeight: 900, fontSize: 22, fontFamily: 'monospace' }}>
                      {metalPrices.gold24k ? `₹${metalPrices.gold24k.toFixed(2)}` : '—'}
                    </div>
                    <div style={{ color: '#7c5c4a', fontSize: 10 }}>per gram</div>
                  </div>
                </div>

                <div style={{ textAlign: 'center', fontSize: 10, color: '#b09080', marginTop: 4 }}>
                  Rates update every 30 seconds • BitByte Jewels
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ORDER SUMMARY POPUP ── */}
        {showOrderSummary && (
          <div
            onClick={() => setShowOrderSummary(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.82)',
              backdropFilter: 'blur(10px)',
              zIndex: 1100,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: '#fdf5ee',
                borderRadius: 24,
                width: '95%', maxWidth: 480,
                maxHeight: '88vh',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
                animation: 'fadeIn 0.3s ease'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e8ddd5',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#fff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>🏆</span>
                  <span style={{ color: '#8B1A1A', fontWeight: 800, fontSize: 15, letterSpacing: '0.5px' }}>
                    ORDER SUMMARY
                  </span>
                </div>
                <button
                  onClick={() => setShowOrderSummary(false)}
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: '#f87171', borderRadius: 8,
                    padding: '5px 14px', cursor: 'pointer', fontSize: 12
                  }}
                >✕ Close</button>
              </div>

              {/* Period Tabs */}
              <div style={{ display: 'flex', gap: 8, padding: '16px 24px 0', background: '#fff' }}>
                {['today', 'week', 'month'].map(p => (
                  <button
                    key={p}
                    onClick={() => setSummaryPeriod(p)}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 10,
                      border: summaryPeriod === p ? 'none' : '1px solid #e8ddd5',
                      background: summaryPeriod === p ? 'linear-gradient(90deg,#34d399,#22d3ee)' : 'transparent',
                      color: summaryPeriod === p ? '#003b40' : '#7c5c4a',
                      fontWeight: 800, fontSize: 12,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      cursor: 'pointer', transition: 'all 0.2s ease'
                    }}
                  >
                    {p === 'today' ? 'Today' : p === 'week' ? 'Week' : 'Month'}
                  </button>
                ))}
              </div>

              {/* Title */}
              <div style={{
                padding: '12px 24px 0', background: '#fff',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <span style={{ fontSize: 14 }}>📦</span>
                <span style={{ color: '#8B1A1A', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {summaryPeriod === 'today' ? "Today's" : summaryPeriod === 'week' ? "This Week's" : "This Month's"} Orders
                </span>
              </div>

              {/* Cards */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { key: 'gold_22k', label: 'GOLD 22K', icon: '🥇', color: '#fbbf24', rgba: '251,191,36' },
                  { key: 'gold_24k', label: 'GOLD 24K', icon: '🥇', color: '#ffd700', rgba: '255,215,0' },
                  { key: 'silver_999', label: 'SILVER 999', icon: '🥈', color: '#9ca3af', rgba: '156,163,175' },
                ].map(({ key, label, icon, color, rgba }) => {
                  const data = orderSummary?.[summaryPeriod]?.[key]
                  return (
                    <div key={key} style={{
                      background: `rgba(${rgba},0.08)`,
                      border: `1px solid rgba(${rgba},0.35)`,
                      borderRadius: 16, padding: '16px 20px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 18 }}>{icon}</span>
                        <span style={{ color, fontWeight: 800, fontSize: 13, letterSpacing: '1px' }}>{label}</span>
                      </div>
                      {[
                        { label: 'Orders', value: data ? `${data.orders}` : '0' },
                        { label: 'Grams', value: data ? (data.grams >= 1 ? `${data.grams.toFixed(2)} gm` : `${(data.grams * 1000).toFixed(2)} mg`) : '0.00 mg' },
                        { label: 'Total Amount', value: data ? `₹${Number(data.amount).toLocaleString('en-IN')}` : '₹0', highlight: true },
                      ].map(({ label: l, value, highlight }) => (
                        <div key={l} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '7px 0',
                          borderBottom: l !== 'Total Amount' ? `1px solid rgba(${rgba},0.15)` : 'none'
                        }}>
                          <span style={{ color: '#7c5c4a', fontSize: 13 }}>{l}</span>
                          <span style={{
                            color: highlight ? '#16a34a' : color,
                            fontWeight: highlight ? 800 : 700,
                            fontSize: highlight ? 15 : 13,
                            fontFamily: 'monospace'
                          }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  )
                })}

                <button
                  onClick={fetchOrderSummary}
                  style={{
                    width: '100%', padding: 10,
                    background: 'rgba(139,26,26,0.06)',
                    border: '1px solid rgba(139,26,26,0.2)',
                    borderRadius: 12, color: '#8B1A1A',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 4
                  }}
                >🔄 Refresh</button>
              </div>
            </div>
          </div>
        )}


        {/* ── PLACE ORDER POPUP ── */}
        {orderPopup && (() => {
          const metalLabels = { gold_22k: '🏅 Gold 22K', gold_24k: '🥇 Gold 24K', silver_999: '🥈 Silver 999' }
          const metalColors = { gold_22k: '#fbbf24', gold_24k: '#ffd700', silver_999: '#c0c0c0' }
          const rateMap = { gold_22k: metalPrices.gold22k, gold_24k: metalPrices.gold24k, silver_999: metalPrices.silver }

          const selectedW = (orderMetal === 'silver_999' ? WEIGHTS_SILVER : WEIGHTS_GOLD).find(x => x.label === orderWeight)
          const rate = rateMap[orderMetal] || 0
          const unitPrice = selectedW ? (selectedW.grams * rate) : 0
          const totalAmt = unitPrice * (orderCount || 0)
          const col = metalColors[orderMetal]

          return (
            <div onClick={() => setOrderPopup(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div onClick={e => e.stopPropagation()} style={{ background: dark ? 'linear-gradient(145deg,#0a1628,#060e1c)' : '#f8fafc', border: `1px solid ${col}55`, borderRadius: '24px', width: '95%', maxWidth: '480px', padding: '28px', boxShadow: '0 32px 90px rgba(0,0,0,0.8)', animation: 'fadeIn 0.25s ease' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <div style={{ color: col, fontWeight: 900, fontSize: '16px' }}>{metalLabels[orderMetal]}</div>
                    <div style={{ color: subtext, fontSize: '11px', marginTop: '3px' }}>Rate: ₹{rate?.toFixed(2)}/gm</div>
                  </div>
                  <button onClick={() => setOrderPopup(false)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px' }}>✕ Close</button>
                </div>

                {/* Weight Dropdown + Display */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ color: subtext, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>SELECT WEIGHT</label>
                    <select
                      value={orderWeight}
                      onChange={e => setOrderWeight(e.target.value)}
                      style={{ width: '100%', background: inpBg, border: `1px solid ${inpBorder}`, borderRadius: '10px', padding: '12px 14px', color: text, fontSize: '14px', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="" style={{ background: optionBg }}>-- Select --</option>
                      {(orderMetal === 'silver_999' ? WEIGHTS_SILVER : WEIGHTS_GOLD).map(w => (
                        <option key={w.label} value={w.label} style={{ background: optionBg }}>{w.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ color: subtext, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>WEIGHT (DISPLAY)</label>
                    <div style={{ background: inpBg, border: `1px solid ${col}44`, borderRadius: '10px', padding: '12px 14px', color: col, fontWeight: 700, fontSize: '14px', fontFamily: 'monospace', minHeight: '46px', display: 'flex', alignItems: 'center' }}>
                      {orderWeight || '—'}
                    </div>
                  </div>
                </div>

                {/* Count Input + Display */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ color: subtext, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>COUNT</label>
                    <input
                      type="number"
                      min="1"
                      value={orderCount}
                      onChange={e => setOrderCount(e.target.value)}
                      style={{ width: '100%', background: inpBg, border: `1px solid ${inpBorder}`, borderRadius: '10px', padding: '12px 14px', color: text, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ color: subtext, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>COUNT (DISPLAY)</label>
                    <div style={{ background: inpBg, border: `1px solid ${col}44`, borderRadius: '10px', padding: '12px 14px', color: col, fontWeight: 700, fontSize: '14px', fontFamily: 'monospace', minHeight: '46px', display: 'flex', alignItems: 'center' }}>
                      {orderCount || '—'}
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div style={{ background: `rgba(${orderMetal === 'silver_999' ? '192,192,192' : '251,191,36'},0.06)`, border: `1px solid ${col}33`, borderRadius: '14px', padding: '16px 18px', marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <div style={{ color: subtext, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Unit Price</div>
                      <div style={{ color: col, fontWeight: 700, fontSize: '15px', fontFamily: 'monospace' }}>
                        {unitPrice > 0 ? `₹${unitPrice.toFixed(2)}` : '—'}
                      </div>
                      <div style={{ color: subtext, fontSize: '10px', marginTop: '2px' }}>{orderWeight} × ₹{rate?.toFixed(2)}/gm</div>
                    </div>
                    <div>
                      <div style={{ color: subtext, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Total Amount</div>
                      <div style={{ color: '#4ade80', fontWeight: 800, fontSize: '18px', fontFamily: 'monospace' }}>
                        {totalAmt > 0 ? `₹${totalAmt.toFixed(2)}` : '—'}
                      </div>
                      <div style={{ color: subtext, fontSize: '10px', marginTop: '2px' }}>₹{unitPrice.toFixed(2)} × {orderCount}</div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {orderMsg && (
                  <div style={{ background: orderMsg.includes('✅') ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${orderMsg.includes('✅') ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`, color: orderMsg.includes('✅') ? '#4ade80' : '#f87171', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>
                    {orderMsg}
                  </div>
                )}

                {/* Confirm Button */}
                <button
                  disabled={orderSubmitting || !orderWeight || !orderCount}
                  onClick={submitOrder}
                  style={{ width: '100%', padding: '14px', background: orderSubmitting || !orderWeight ? 'rgba(52,211,153,0.2)' : `linear-gradient(90deg,${col},${col}cc)`, border: 'none', borderRadius: '12px', fontWeight: 900, fontSize: '14px', color: '#000', cursor: orderSubmitting || !orderWeight ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease' }}
                >
                  {orderSubmitting ? '⏳ Placing Order...' : '✅ Confirm Order'}
                </button>
              </div>
            </div>
          )
        })()}

        {/* ── WISH HOVER POPUP — Admin ── */}
        {replyPopupAnnId && (
          <div
            id="ad-wish-popup"
            onMouseEnter={() => clearTimeout(wishTimerRef.current)}
            onMouseLeave={() => { wishTimerRef.current = setTimeout(() => setReplyPopupAnnId(null), 220) }}
            style={{
              position: 'fixed',
              top: `${replyPopupPos.top}px`,
              left: `${replyPopupPos.left}px`,
              transform: 'translate(-50%, calc(-100% - 10px))',
              background: dark ? 'rgba(5,10,20,0.97)' : 'rgba(248,250,252,0.98)',
              border: '1px solid rgba(74,222,128,0.35)',
              borderRadius: '16px', padding: '16px 18px',
              minWidth: '270px', maxWidth: '340px', maxHeight: '280px',
              overflowY: 'auto', zIndex: 9999,
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
              backdropFilter: 'blur(24px)',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(74,222,128,0.5) rgba(74,222,128,0.03)',
              animation: 'adWishIn 0.25s cubic-bezier(0.22,1,0.36,1) both',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid rgba(74,222,128,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>💬</div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#4ade80', letterSpacing: '1.5px' }}>WISHES</span>
              </div>
              <div style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '20px', padding: '2px 10px', fontSize: '10px', color: '#4ade80', fontWeight: 800 }}>
                {(annReplies[replyPopupAnnId] || []).length}
              </div>
            </div>
            {(annReplies[replyPopupAnnId] || []).length === 0 ? (
              <div style={{ color: subtext, fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>No wishes yet</div>
            ) : (annReplies[replyPopupAnnId] || []).map(r => (
              <div key={r.id} style={{ marginBottom: '8px', padding: '10px 12px', background: dark ? 'rgba(74,222,128,0.05)' : 'rgba(74,222,128,0.04)', borderRadius: '10px', border: '1px solid rgba(74,222,128,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80' }}>{r.replied_by_name}</span>
                  <span style={{ fontSize: '9px', color: subtext }}>{new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: dark ? '#cbd5e1' : '#475569', lineHeight: '1.5' }}>{r.message}</p>
              </div>
            ))}
            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(74,222,128,0.08)', textAlign: 'center', fontSize: '9px', color: dark ? '#334155' : '#cbd5e1', letterSpacing: '0.8px', fontWeight: 600 }}>
              BitByte Network • Wishes
            </div>
          </div>
        )}

        {/* Main wrapper - 2 column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', alignItems: 'start' }}>

          {/* ── LEFT COLUMN: Metal Rates ── */}
          <div>
            {(() => {
              return (
                <div style={{ background: cardBg, border: cardBorder, borderRadius: '20px', padding: '28px 32px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '22px' }}>⚖️</span>
                      <div>
                        <div style={{ color: '#a5f3fc', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Today's Gold & Silver Rates</div>
                        <div style={{ color: subtext, fontSize: '11px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📍 Chennai, India</span>
                          <span style={{ opacity: 0.4 }}>•</span>
                          <span>₹ per gram</span>
                          <span style={{ opacity: 0.4 }}>•</span>
                          {dbRateDate ? (
                            <span style={{ color: '#4ade80', fontSize: '10px', fontWeight: 700 }}>
                              📅 {new Date(dbRateDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </span>
                          ) : (
                            <span style={{ color: '#f87171', fontSize: '9px', fontWeight: 700 }}>No rate entered yet</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* SILVER 999 */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '16px' }}>🥈</span>
                      <span style={{ color: '#c0c0c0', fontWeight: 800, fontSize: '12px', letterSpacing: '1px' }}>SILVER 999</span>
                      {metalPrices.silver && <span style={{ color: 'rgba(192,192,192,0.55)', fontSize: '11px' }}>₹{metalPrices.silver.toFixed(2)}/gm</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap' }}>
                      {WEIGHTS_SILVER.map(w => {
                        const priceSilver = metalPrices.silver != null ? (w.grams * metalPrices.silver).toFixed(2) : null
                        const hoveredSilver = hoveredJewel === `sv_${w.label}`
                        return (
                          <div key={w.label}
                            onMouseEnter={() => setHoveredJewel(`sv_${w.label}`)}
                            onMouseLeave={() => setHoveredJewel(null)}
                            style={{ flex: 1, minWidth: 0, position: 'relative', background: hoveredSilver ? 'rgba(192,192,192,0.18)' : (dark ? 'rgba(192,192,192,0.04)' : 'rgba(192,192,192,0.07)'), border: hoveredSilver ? '1px solid rgba(192,192,192,0.85)' : '1px solid rgba(192,192,192,0.25)', borderRadius: '14px', overflow: 'hidden', transition: 'all 0.25s ease', transform: hoveredSilver ? 'translateY(-6px) scale(1.04)' : 'translateY(0) scale(1)', boxShadow: hoveredSilver ? '0 12px 32px rgba(192,192,192,0.3)' : 'none', cursor: 'pointer' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
                              <img src={silverCoin} alt="Silver 999" style={{ width: hoveredSilver ? '115px' : '70px', height: hoveredSilver ? '115px' : '70px', objectFit: 'contain', background: 'transparent', display: 'block', filter: hoveredSilver ? 'drop-shadow(0 6px 18px rgba(192,192,192,1)) brightness(1.4) contrast(1.1)' : 'drop-shadow(0 2px 6px rgba(192,192,192,0.45))', transition: 'all 0.3s ease' }} />
                            </div>
                            <div style={{ padding: '4px 6px 6px', textAlign: 'center' }}>
                              <div style={{ display: 'inline-block', fontSize: '9px', fontWeight: 800, color: hoveredSilver ? '#000' : '#c0c0c0', background: hoveredSilver ? '#c0c0c0' : 'rgba(192,192,192,0.1)', border: '1px solid rgba(192,192,192,0.25)', borderRadius: '20px', padding: '2px 6px', marginBottom: '4px', transition: 'all 0.2s' }}>{w.label}</div>
                              <div style={{ color: hoveredSilver ? '#e8e8e8' : '#c0c0c0', fontWeight: 900, fontSize: hoveredSilver ? '12px' : '11px', fontFamily: 'monospace', transition: 'all 0.2s' }}>
                                {priceSilver ? `₹${priceSilver}` : '—'}
                              </div>
                            </div>
                            {hoveredSilver && (
                              <div style={{ display: 'flex', gap: '4px', padding: '0 6px 8px', animation: 'fadeIn 0.2s ease' }}>
                                <button
                                  onClick={e => {
                                    e.stopPropagation()
                                    addMetalToCart(
                                      'silver_999',
                                      'Silver 999',
                                      w,
                                      priceSilver,
                                      silverCoin
                                    )
                                  }}
                                  style={{ flex: 1, padding: '5px 0', background: 'rgba(192,192,192,0.15)', border: '1px solid rgba(192,192,192,0.45)', borderRadius: '8px', color: '#c0c0c0', fontSize: '9px', fontWeight: 800, cursor: 'pointer' }}
                                >🪙 Cart</button>
                                <button
                                  onClick={e => { e.stopPropagation(); setOrderMetal('silver_999'); setOrderWeight(w.label); setOrderCount(1); setOrderMsg(''); setOrderPopup(true) }}
                                  style={{ flex: 1, padding: '5px 0', background: 'linear-gradient(90deg,#9ca3af,#e5e7eb)', border: 'none', borderRadius: '8px', color: '#000', fontSize: '9px', fontWeight: 900, cursor: 'pointer' }}
                                >🛒 Buy</button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                      <button onClick={() => { setOrderMetal('silver_999'); setOrderWeight(''); setOrderCount(''); setOrderMsg(''); setOrderPopup(true) }}
                        style={{ padding: '10px 32px', background: 'linear-gradient(90deg,#9ca3af,#e5e7eb)', border: 'none', borderRadius: '20px', color: '#000', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(192,192,192,0.2)' }}>
                        🛒 Place Order — Silver 999
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* GOLD 22K */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '16px' }}>🏅</span>
                        <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '12px', letterSpacing: '1px' }}>GOLD 22K</span>
                        {metalPrices.gold22k && <span style={{ color: 'rgba(251,191,36,0.55)', fontSize: '11px' }}>₹{metalPrices.gold22k.toFixed(2)}/gm</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap' }}>
                        {WEIGHTS_GOLD.map(w => {
                          const price22k = metalPrices.gold22k != null ? (w.grams * metalPrices.gold22k).toFixed(2) : null
                          const hovered22k = hoveredJewel === `g22_${w.label}`
                          return (
                            <div key={w.label}
                              onMouseEnter={() => setHoveredJewel(`g22_${w.label}`)}
                              onMouseLeave={() => setHoveredJewel(null)}
                              style={{ flex: 1, minWidth: 0, position: 'relative', background: hovered22k ? 'rgba(251,191,36,0.15)' : (dark ? 'rgba(251,191,36,0.05)' : 'rgba(251,191,36,0.07)'), border: hovered22k ? '1px solid rgba(251,191,36,0.8)' : '1px solid rgba(251,191,36,0.3)', borderRadius: '14px', overflow: 'hidden', transition: 'all 0.25s ease', transform: hovered22k ? 'translateY(-6px) scale(1.04)' : 'translateY(0) scale(1)', boxShadow: hovered22k ? '0 12px 32px rgba(251,191,36,0.35)' : 'none', cursor: 'pointer' }}
                            >
                              {/* Coin image */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
                                <img src={goldCoin} alt="Gold 22K" style={{ width: hovered22k ? '115px' : '70px', height: hovered22k ? '115px' : '70px', objectFit: 'contain', background: 'transparent', display: 'block', filter: hovered22k ? 'drop-shadow(0 6px 20px rgba(251,191,36,1)) brightness(1.3) saturate(1.4)' : 'drop-shadow(0 2px 6px rgba(251,191,36,0.5))', transition: 'all 0.3s ease' }} />
                              </div>

                              {/* Weight + Rate — highlight on hover */}
                              <div style={{ padding: '4px 6px 6px', textAlign: 'center' }}>
                                <div style={{ display: 'inline-block', fontSize: '9px', fontWeight: 800, color: hovered22k ? '#000' : '#fbbf24', background: hovered22k ? '#fbbf24' : 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '20px', padding: '2px 6px', marginBottom: '4px', transition: 'all 0.2s' }}>{w.label}</div>
                                <div style={{ color: hovered22k ? '#ffd700' : '#fbbf24', fontWeight: 900, fontSize: hovered22k ? '12px' : '11px', fontFamily: 'monospace', transition: 'all 0.2s' }}>
                                  {price22k ? `₹${price22k}` : '—'}
                                </div>
                              </div>

                              {/* Two buttons — visible on hover */}
                              {hovered22k && (
                                <div style={{ display: 'flex', gap: '4px', padding: '0 6px 8px', animation: 'fadeIn 0.2s ease' }}>
                                  <button
                                    onClick={e => {
                                      e.stopPropagation()
                                      addMetalToCart(
                                        'gold_22k',
                                        'Gold 22K',
                                        w,
                                        price22k,
                                        goldCoin
                                      )
                                    }}
                                    style={{ flex: 1, padding: '5px 0', background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.5)', borderRadius: '8px', color: '#fbbf24', fontSize: '9px', fontWeight: 800, cursor: 'pointer' }}
                                  >🪙 Cart</button>
                                  <button
                                    onClick={e => { e.stopPropagation(); setOrderMetal('gold_22k'); setOrderWeight(w.label); setOrderCount(1); setOrderMsg(''); setOrderPopup(true) }}
                                    style={{ flex: 1, padding: '5px 0', background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', border: 'none', borderRadius: '8px', color: '#000', fontSize: '9px', fontWeight: 900, cursor: 'pointer' }}
                                  >🛒 Buy</button>
                                </div>
                              )}
                            </div>
                          )
                        })}

                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                        <button onClick={() => { setOrderMetal('gold_22k'); setOrderWeight(''); setOrderCount(''); setOrderMsg(''); setOrderPopup(true) }}
                          style={{ padding: '10px 32px', background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', border: 'none', borderRadius: '20px', color: '#000', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(251,191,36,0.3)' }}>
                          🛒 Place Order — Gold 22K
                        </button>
                      </div>
                    </div>

                    {/* GOLD 24K */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '16px' }}>🥇</span>
                        <span style={{ color: '#ffd700', fontWeight: 800, fontSize: '12px', letterSpacing: '1px' }}>GOLD 24K</span>
                        {metalPrices.gold24k && <span style={{ color: 'rgba(255,215,0,0.55)', fontSize: '11px' }}>₹{metalPrices.gold24k.toFixed(2)}/gm</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap' }}>
                        {WEIGHTS_GOLD.map(w => {
                          const price24k = metalPrices.gold24k != null ? (w.grams * metalPrices.gold24k).toFixed(2) : null
                          const hovered24k = hoveredJewel === `g24_${w.label}`
                          return (
                            <div key={w.label}
                              onMouseEnter={() => setHoveredJewel(`g24_${w.label}`)}
                              onMouseLeave={() => setHoveredJewel(null)}
                              style={{ flex: 1, minWidth: 0, position: 'relative', background: hovered24k ? 'rgba(255,215,0,0.15)' : (dark ? 'rgba(255,215,0,0.05)' : 'rgba(255,215,0,0.07)'), border: hovered24k ? '1px solid rgba(255,215,0,0.8)' : '1px solid rgba(255,215,0,0.3)', borderRadius: '14px', overflow: 'hidden', transition: 'all 0.25s ease', transform: hovered24k ? 'translateY(-6px) scale(1.04)' : 'translateY(0) scale(1)', boxShadow: hovered24k ? '0 12px 32px rgba(255,215,0,0.35)' : 'none', cursor: 'pointer' }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
                                <img src={goldCoin} alt="Gold 24K" style={{ width: hovered24k ? '115px' : '70px', height: hovered24k ? '115px' : '70px', objectFit: 'contain', background: 'transparent', display: 'block', filter: hovered24k ? 'drop-shadow(0 6px 20px rgba(255,215,0,1)) brightness(1.3) saturate(1.5)' : 'drop-shadow(0 2px 6px rgba(255,215,0,0.5))', transition: 'all 0.3s ease' }} />
                              </div>
                              <div style={{ padding: '4px 6px 6px', textAlign: 'center' }}>
                                <div style={{ display: 'inline-block', fontSize: '9px', fontWeight: 800, color: hovered24k ? '#000' : '#ffd700', background: hovered24k ? '#ffd700' : 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '20px', padding: '2px 6px', marginBottom: '4px', transition: 'all 0.2s' }}>{w.label}</div>
                                <div style={{ color: hovered24k ? '#ffe44d' : '#ffd700', fontWeight: 900, fontSize: hovered24k ? '12px' : '11px', fontFamily: 'monospace', transition: 'all 0.2s' }}>
                                  {price24k ? `₹${price24k}` : '—'}
                                </div>
                              </div>
                              {hovered24k && (
                                <div style={{ display: 'flex', gap: '4px', padding: '0 6px 8px', animation: 'fadeIn 0.2s ease' }}>
                                  <button
                                    onClick={e => {
                                      e.stopPropagation()
                                      addMetalToCart(
                                        'gold_24k',
                                        'Gold 24K',
                                        w,
                                        price24k,
                                        goldCoin
                                      )
                                    }}
                                    style={{ flex: 1, padding: '5px 0', background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.5)', borderRadius: '8px', color: '#ffd700', fontSize: '9px', fontWeight: 800, cursor: 'pointer' }}
                                  >🪙 Cart</button>
                                  <button
                                    onClick={e => { e.stopPropagation(); setOrderMetal('gold_24k'); setOrderWeight(w.label); setOrderCount(1); setOrderMsg(''); setOrderPopup(true) }}
                                    style={{ flex: 1, padding: '5px 0', background: 'linear-gradient(90deg,#d97706,#ffd700)', border: 'none', borderRadius: '8px', color: '#000', fontSize: '9px', fontWeight: 900, cursor: 'pointer' }}
                                  >🛒 Buy</button>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                        <button onClick={() => { setOrderMetal('gold_24k'); setOrderWeight(''); setOrderCount(''); setOrderMsg(''); setOrderPopup(true) }}
                          style={{ padding: '10px 32px', background: 'linear-gradient(90deg,#d97706,#ffd700)', border: 'none', borderRadius: '20px', color: '#000', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,215,0,0.3)' }}>
                          🛒 Place Order — Gold 24K
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

 



        {/* ── BHARATHY WORLD SECTION ── */}
        <div style={{ marginBottom: '40px', marginTop: '40px', textAlign: 'center' }}>

          <div style={{ fontSize: 28, fontWeight: 700, color: '#1a0a0a', marginBottom: 6 }}>
            Bharathy World
          </div>
          <div style={{ fontSize: 14, color: '#7c5c4a', marginBottom: 32 }}>
            A companion for every occasion
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 1300, margin: '0 auto', padding: '0 40px' }}>

            {/* LEFT COLUMN — 2 stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Wedding */}
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: '300px', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.querySelector('.bw-img').style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.querySelector('.bw-img').style.transform = 'scale(1)'}
              >
                <img className="bw-img" src="/marriage_woman.jpg" alt="Wedding"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(139,26,26,0.65) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 22 }}>Wedding</div>
                </div>
              </div>

              {/* Gold */}
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: '420px', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.querySelector('.bw-img').style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.querySelector('.bw-img').style.transform = 'scale(1)'}
              >
                <img className="bw-img" src="/gold_Woman.jpg" alt="Gold"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(139,26,26,0.65) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 22 }}>Gold</div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN — 2 stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Diamond */}
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: '420px', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.querySelector('.bw-img').style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.querySelector('.bw-img').style.transform = 'scale(1)'}
              >
                <img className="bw-img" src="/diamond_woman.jpg" alt="Diamond"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(139,26,26,0.65) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 22 }}>Diamond</div>
                </div>
              </div>

              {/* Dailywear */}
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: '300px', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.querySelector('.bw-img').style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.querySelector('.bw-img').style.transform = 'scale(1)'}
              >
                <img className="bw-img" src="/dailywear_woman.jpg" alt="Dailywear"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(139,26,26,0.65) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 22 }}>Dailywear</div>
                </div>
              </div>

            </div>
          </div>
        </div>
        {/* ── END BHARATHY WORLD ── */}

        {/* ── JEWELRY SHOWCASE ── */}
        <div style={{ marginBottom: '28px', marginTop: '28px' }}>
          <div style={{ color: '#a5f3fc', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💍</span> Our Collections
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '270px 270px', gap: '12px' }}>

            {/* Big left card - Signature Rings */}
            <div
              className="jewel-card"
              onClick={() => navigate('/collection/rings')}
              onMouseEnter={() => setHoveredJewel('rings')}
              onMouseLeave={() => setHoveredJewel(null)}
              style={{
                gridRow: 'span 2', position: 'relative', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer',
                border: hoveredJewel === 'rings' ? '1px solid rgba(251,191,36,0.6)' : cardBorder,
                minHeight: '400px',
                transform: hoveredJewel === 'rings' ? 'scale(1.015)' : 'scale(1)',
                boxShadow: hoveredJewel === 'rings' ? '0 20px 60px rgba(251,191,36,0.25)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              <div className="jewel-shine" />
              <img src="/img/gold/gold-ring-1.png" alt="Signature Rings" className="jewel-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: hoveredJewel === 'rings' ? 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 55%)' : 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)', transition: 'background 0.4s ease' }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                <div style={{ color: hoveredJewel === 'rings' ? '#fbbf24' : '#fff', fontWeight: 800, fontSize: '18px', transition: 'color 0.3s ease' }}>Signature Rings</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', marginTop: '3px' }}>Bridal & Everyday</div>
                {hoveredJewel === 'rings' && (
                  <div style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.5)', borderRadius: '20px', padding: '4px 14px', color: '#fbbf24', fontSize: '11px', fontWeight: 800, animation: 'fadeIn 0.3s ease' }}>
                    → Explore Collection
                  </div>
                )}
              </div>
              {hoveredJewel === 'rings' && (
                <div style={{ position: 'absolute', top: '14px', right: '14px', width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(251,191,36,0.6)', animation: 'jewelGlow 1.5s ease infinite' }} />
              )}
            </div>

            {/* Heritage Necklaces */}
            <div
              className="jewel-card"
              onClick={() => navigate('/collection/necklaces')}
              onMouseEnter={() => setHoveredJewel('necklaces')}
              onMouseLeave={() => setHoveredJewel(null)}
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: hoveredJewel === 'necklaces' ? '1px solid rgba(251,191,36,0.6)' : cardBorder,
                transform: hoveredJewel === 'necklaces' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: hoveredJewel === 'necklaces' ? '0 16px 48px rgba(251,191,36,0.22)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              <div className="jewel-shine" />
              <img src="/img/silver/silver-necklace-2.png" alt="Heritage Necklaces" className="jewel-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: hoveredJewel === 'necklaces' ? 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 55%)' : 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)', transition: 'background 0.4s ease' }} />
              <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px' }}>
                <div style={{ color: hoveredJewel === 'necklaces' ? '#22d3ee' : '#fff', fontWeight: 800, fontSize: '14px', transition: 'color 0.3s ease' }}>Heritage Necklaces</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>Antique & Modern</div>
                {hoveredJewel === 'necklaces' && (
                  <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.4)', borderRadius: '20px', padding: '3px 12px', color: '#22d3ee', fontSize: '10px', fontWeight: 800, animation: 'fadeIn 0.3s ease' }}>
                    → Explore
                  </div>
                )}
              </div>
              {hoveredJewel === 'necklaces' && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '50%', border: '2px solid rgba(34,211,238,0.6)', animation: 'jewelGlow 1.5s ease infinite' }} />
              )}
            </div>

            {/* Eternal Bangles */}
            <div
              className="jewel-card"
              onClick={() => navigate('/collection/bangles')}
              onMouseEnter={() => setHoveredJewel('bangles')}
              onMouseLeave={() => setHoveredJewel(null)}
              style={{
                position: 'relative', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer',
                border: hoveredJewel === 'bangles' ? '1px solid rgba(251,191,36,0.6)' : cardBorder,
                minHeight: '200px',
                transform: hoveredJewel === 'bangles' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: hoveredJewel === 'bangles' ? '0 16px 48px rgba(251,191,36,0.2)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              <div className="jewel-shine" />
              <img src="/img/gold/gold-bangles-1.png" alt="Eternal Bangles" className="jewel-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: hoveredJewel === 'bangles' ? 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 55%)' : 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)', transition: 'background 0.4s ease' }} />
              <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px' }}>
                <div style={{ color: hoveredJewel === 'bangles' ? '#fbbf24' : '#fff', fontWeight: 800, fontSize: '14px', transition: 'color 0.3s ease' }}>Eternal Bangles</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>Kangan & Bracelets</div>
                {hoveredJewel === 'bangles' && (
                  <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', borderRadius: '20px', padding: '3px 12px', color: '#fbbf24', fontSize: '10px', fontWeight: 800, animation: 'fadeIn 0.3s ease' }}>
                    → Explore
                  </div>
                )}
              </div>
              {hoveredJewel === 'bangles' && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '50%', border: '2px solid rgba(251,191,36,0.6)', animation: 'jewelGlow 1.5s ease infinite' }} />
              )}
            </div>

            {/* Diamond Earrings */}
            <div
              className="jewel-card"
              onClick={() => navigate('/collection/earrings')}
              onMouseEnter={() => setHoveredJewel('earrings')}
              onMouseLeave={() => setHoveredJewel(null)}
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: hoveredJewel === 'earrings' ? '1px solid rgba(167,139,250,0.6)' : cardBorder,
                minHeight: '200px',
                transform: hoveredJewel === 'earrings' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: hoveredJewel === 'earrings' ? '0 16px 48px rgba(167,139,250,0.2)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >

              <div className="jewel-shine" />
              <img src="/img/silver/silver-Earrings-4.png" alt="Diamond Earrings" className="jewel-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: hoveredJewel === 'earrings' ? 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 55%)' : 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)', transition: 'background 0.4s ease' }} />
              <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px' }}>
                <div style={{ color: hoveredJewel === 'earrings' ? '#a78bfa' : '#fff', fontWeight: 800, fontSize: '14px', transition: 'color 0.3s ease' }}>Diamond Earrings</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>Studs & Drops</div>
                {hoveredJewel === 'earrings' && (
                  <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)', borderRadius: '20px', padding: '3px 12px', color: '#a78bfa', fontSize: '10px', fontWeight: 800, animation: 'fadeIn 0.3s ease' }}>
                    → Explore
                  </div>
                )}
              </div>
              {hoveredJewel === 'earrings' && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '50%', border: '2px solid rgba(167,139,250,0.6)', animation: 'jewelGlow 1.5s ease infinite' }} />
              )}
            </div>

            {/* Gold Chains */}
            <div
              className="jewel-card"
              onClick={() => navigate('/collection/chains')}
              onMouseEnter={() => setHoveredJewel('chains')}
              onMouseLeave={() => setHoveredJewel(null)}
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: hoveredJewel === 'chains' ? '1px solid rgba(251,191,36,0.6)' : cardBorder,
                transform: hoveredJewel === 'chains' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: hoveredJewel === 'chains' ? '0 16px 48px rgba(251,191,36,0.22)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              <div className="jewel-shine" />
              <img src="/img/gold/gold chain-1.png" alt="Gold Chains" className="jewel-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: hoveredJewel === 'chains' ? 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 55%)' : 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)', transition: 'background 0.4s ease' }} />
              <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px' }}>
                <div style={{ color: hoveredJewel === 'chains' ? '#ffd700' : '#fff', fontWeight: 800, fontSize: '14px', transition: 'color 0.3s ease' }}>Gold Chains</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>Minimal & Premium</div>
                {hoveredJewel === 'chains' && (
                  <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.4)', borderRadius: '20px', padding: '3px 12px', color: '#ffd700', fontSize: '10px', fontWeight: 800, animation: 'fadeIn 0.3s ease' }}>
                    → Explore
                  </div>
                )}
              </div>
              {hoveredJewel === 'chains' && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '50%', border: '2px solid rgba(255,215,0,0.6)', animation: 'jewelGlow 1.5s ease infinite' }} />
              )}
            </div>

          </div>
        </div>
        {/* ── END JEWELRY SHOWCASE ── */}





        {/* ── SHOP BY GENDER SECTION ── */}
        <div style={{ marginBottom: '40px', marginTop: '40px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg,transparent,#b8860b)' }} />
            <span style={{ fontSize: 18, color: '#b8860b' }}>💎</span>
            <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg,#b8860b,transparent)' }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1a0a0a', letterSpacing: 2, marginBottom: 6 }}>SHOP BY GENDER</div>
          <div style={{ fontSize: 14, color: '#7c5c4a', marginBottom: 28 }}>Find Jewelry for Women, Men, and Kids</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, maxWidth: 1300, margin: '0 auto', padding: '0 40px', alignItems: 'start' }}>
            {[
              { label: "Women's Jewellery", img: "/Woman's Jewlley.jpg", gender: 'women' },
              { label: "Men's Jewellery", img: "/Men's Jewellery.jpg", gender: 'men' },
              { label: "Kid's Jewellery", img: "/Kids Jewllery.jpg", gender: 'kids' },
            ].map((item, i) => (
              <div
                key={item.label}
                style={{ cursor: 'pointer', textAlign: 'center' }}
                onClick={() => navigate(`/collection/all?gender=${item.gender}`)}
                onMouseEnter={e => {
                  e.currentTarget.querySelector('.sbg-img').style.transform = 'scale(1.03)'
                  e.currentTarget.querySelector('.sbg-label').style.color = '#8B1A1A'
                }}
                onMouseLeave={e => {
                  e.currentTarget.querySelector('.sbg-img').style.transform = 'scale(1)'
                  e.currentTarget.querySelector('.sbg-label').style.color = '#b8860b'
                }}
              >
                <div style={{
                  borderRadius: 16, overflow: 'hidden',
                  border: '1px solid #e8ddd5',
                  boxShadow: '0 4px 16px rgba(139,26,26,0.08)',
                  marginBottom: 12,
                  height: i === 1 ? '460px' : '420px',
                  width: '100%',
                  marginTop: i === 1 ? '0px' : '40px',
                }}>
                  <img
                    className="sbg-img"
                    src={item.img}
                    alt={item.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                  />
                </div>
                <div className="sbg-label" style={{ fontSize: 14, fontWeight: 700, color: '#b8860b', transition: 'color 0.2s' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURED JEWELLERY COLLECTIONS ── */}
        <div style={{ marginBottom: '40px', marginTop: '40px', textAlign: 'center' }}>

          {/* Heading */}
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1a0a0a', letterSpacing: 1, marginBottom: 6, fontStyle: 'italic' }}>
            Featured Jewellery Collections
          </div>
          <div style={{ fontSize: 14, color: '#7c5c4a', marginBottom: 32 }}>
            A selection of jewellery designs across categories
          </div>

          {/* Layout: Left big + Right 2 stacked */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 1300, margin: '0 auto', padding: '0 40px', alignItems: 'stretch' }}>

            {/* LEFT — big tall image */}
            <div style={{
              position: 'relative', borderRadius: 16, overflow: 'hidden',
              height: '680px', cursor: 'pointer',
            }}>
              <img
                src="/black_woman.png"
                alt="Layered Luxe"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', bottom: 28, right: 28, textAlign: 'right' }}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 22, fontStyle: 'italic', letterSpacing: 1 }}>Layered Luxe</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4, fontStyle: 'italic' }}>Stack it. Style it. Own it.</div>
              </div>
            </div>

            {/* RIGHT — 2 stacked images */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '680px' }}>

              {/* Top right image */}
              <div style={{
                position: 'relative', borderRadius: 16, overflow: 'hidden',
                flex: 1, cursor: 'pointer',
              }}>
                <img
                  src="/black_necklaces.png"
                  alt="Ethnic Glow"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)' }} />
                <div style={{ position: 'absolute', bottom: 20, right: 20, textAlign: 'right' }}>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontStyle: 'italic', letterSpacing: 1 }}>Ethnic Glow</div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 3, fontStyle: 'italic' }}>Tradition with a twist.</div>
                </div>
              </div>

              {/* Bottom right image */}
              <div style={{
                position: 'relative', borderRadius: 16, overflow: 'hidden',
                flex: 1, cursor: 'pointer',
              }}>
                <img
                  src="/black_daimond.png"
                  alt="Diamond Whisper"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)' }} />
                <div style={{ position: 'absolute', bottom: 20, right: 20, textAlign: 'right' }}>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontStyle: 'italic', letterSpacing: 1 }}>Diamond Whisper</div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 3, fontStyle: 'italic' }}>Delicate shine. Big impression.</div>
                </div>
              </div>

            </div>
          </div>
        </div>
        {/* ── END FEATURED JEWELLERY ── */}


      </div>

      {/* ── FLOATING CHAT WIDGET ── */}
      {showChatWidget && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
        }}>
          {/* Bubble */}
          <div style={{
            background: '#fff',
            border: '1px solid #e8ddd5',
            borderRadius: '20px 20px 4px 20px',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#3d2b1f',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}>
            How can I help you?
            <button
              onClick={() => setShowChatWidget(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                fontSize: '14px',
                fontWeight: 700,
                padding: '0 0 0 4px',
                lineHeight: 1,
              }}
            >✕</button>
          </div>

          {/* Woman image - round */}
          <img
            src="/greating_woman.png"
            alt="Help"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #8B1A1A',
              boxShadow: '0 4px 16px rgba(139,26,26,0.25)',
              cursor: 'pointer',
            }}
          />
        </div>
      )}

    </div>



  )
}

