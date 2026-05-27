import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import logo from '../assets/logo.png'

const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

const CATEGORIES = [
  { key: 'rings',      label: 'Rings',      emoji: '💍' },
  { key: 'necklaces',  label: 'Necklaces',  emoji: '📿' },
  { key: 'bangles',    label: 'Bangles',    emoji: '⭕' },
  { key: 'bracelets',  label: 'Bracelets',  emoji: '💎' },
  { key: 'earrings',   label: 'Earrings',   emoji: '✨' },
  { key: 'chains',     label: 'Chains',     emoji: '⛓️' },
  { key: 'coins',      label: 'Coins',      emoji: '🪙' },
]

const TAGS = ['Bestseller', 'Bridal', 'Premium', 'Statement', 'Stackable', 'New', 'Limited']

const OCCASIONS = ['Wedding', 'Birthday', 'Anniversary', 'Auspicious', 'Office Wear', 'Modern Wear', 'Casual Wear', 'Traditional Wear']

const WEDDING_CATEGORIES = ['Wedding Ring', 'Wedding Necklaces', 'Wedding Chain', 'Wedding Bangles', 'Wedding Earring']

const GENDERS = ['all', 'women', 'men', 'kids']


const SUBCATEGORIES = {
  rings: {
    gold: ["Men's Gold Ring","Women's Gold Ring","Couple Gold Ring","Kids Gold Ring","Gold Engagement Ring","Gold Wedding Ring","Gold Stone Ring","Gold Plain Ring"],
    silver: ["Men's Silver Ring","Women's Silver Ring","Couple Silver Ring","Kids Silver Ring","Silver Engagement Ring","Silver Wedding Ring","Silver Stone Ring","Silver Plain Ring"],
    diamond: ["Men's Diamond Ring","Women's Diamond Ring","Couple Diamond Ring","Kids Diamond Ring","Diamond Engagement Ring","Diamond Wedding Ring","Diamond Solitaire Ring","Diamond Eternity Ring"],
  },
  necklaces: {
    gold: ["Men's Gold Necklace","Women's Gold Necklace","Couple Gold Necklace","Kids Gold Necklace","Gold Bridal Necklace","Gold Wedding Necklace","Gold Stone Necklace","Gold Plain Necklace"],
    silver: ["Men's Silver Necklace","Women's Silver Necklace","Couple Silver Necklace","Kids Silver Necklace","Silver Bridal Necklace","Silver Wedding Necklace","Silver Stone Necklace","Silver Plain Necklace"],
    diamond: ["Women's Diamond Necklace","Diamond Bridal Necklace","Diamond Pendant Necklace","Diamond Wedding Necklace","Diamond Statement Necklace","Diamond Plain Necklace"],
  },
  bangles: {
    gold: ["Men's Gold Bangle","Women's Gold Bangle","Couple Gold Bangle","Kids Gold Bangle","Gold Bridal Bangle","Gold Wedding Bangle","Gold Stone Bangle","Gold Plain Bangle"],
    silver: ["Men's Silver Bangle","Women's Silver Bangle","Couple Silver Bangle","Kids Silver Bangle","Silver Bridal Bangle","Silver Wedding Bangle","Silver Stone Bangle","Silver Plain Bangle"],
    diamond: ["Women's Diamond Bangle","Diamond Bridal Bangle","Diamond Wedding Bangle","Diamond Stone Bangle","Diamond Plain Bangle"],
  },
  bracelets: {
    gold: ["Men's Gold Bracelet","Women's Gold Bracelet","Couple Gold Bracelet","Kids Gold Bracelet","Gold Bridal Bracelet","Gold Wedding Bracelet","Gold Stone Bracelet","Gold Plain Bracelet","Gold Charm Bracelet","Gold Kada Bracelet"],
    silver: ["Men's Silver Bracelet","Women's Silver Bracelet","Couple Silver Bracelet","Kids Silver Bracelet","Silver Bridal Bracelet","Silver Wedding Bracelet","Silver Stone Bracelet","Silver Plain Bracelet","Silver Charm Bracelet","Silver Kada Bracelet"],
    diamond: ["Women's Diamond Bracelet","Diamond Tennis Bracelet","Diamond Bridal Bracelet","Diamond Wedding Bracelet","Diamond Charm Bracelet","Diamond Plain Bracelet"],
  },
  earrings: {
    gold: ["Men's Gold Earring","Women's Gold Earring","Kids Gold Earring","Gold Stud Earring","Gold Hoop Earring","Gold Drop Earring","Gold Stone Earring","Gold Plain Earring"],
    silver: ["Men's Silver Earring","Women's Silver Earring","Kids Silver Earring","Silver Stud Earring","Silver Hoop Earring","Silver Drop Earring","Silver Stone Earring","Silver Plain Earring"],
    diamond: ["Women's Diamond Earring","Diamond Stud Earring","Diamond Hoop Earring","Diamond Drop Earring","Diamond Jhumka Earring","Diamond Plain Earring"],
  },
  chains: {
    gold: ["Men's Gold Chain","Women's Gold Chain","Kids Gold Chain","Gold Wedding Chain","Gold Rope Chain","Gold Box Chain","Gold Stone Chain","Gold Plain Chain"],
    silver: ["Men's Silver Chain","Women's Silver Chain","Kids Silver Chain","Silver Wedding Chain","Silver Rope Chain","Silver Box Chain","Silver Stone Chain","Silver Plain Chain"],
    diamond: ["Men's Diamond Chain","Women's Diamond Chain","Diamond Pendant Chain","Diamond Wedding Chain","Diamond Plain Chain"],
  },
  coins: {
    gold: ["Gold 1 Gram Coin","Gold 2 Gram Coin","Gold 5 Gram Coin","Gold 10 Gram Coin","Gold Lakshmi Coin","Gold Ganesha Coin","Gold Plain Coin","Gold Gift Coin"],
    silver: ["Silver 1 Gram Coin","Silver 2 Gram Coin","Silver 5 Gram Coin","Silver 10 Gram Coin","Silver Lakshmi Coin","Silver Ganesha Coin","Silver Plain Coin","Silver Gift Coin"],
    diamond: [],
  },
}

const getImageUrl = img => {
  if (!img) return null
  let p = typeof img === 'object' ? (img.image || img.url || '') : img
  if (!p) return null
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  return `${API_BASE}/${p.replace(/^\/+/, '')}`
}

export default function AddProduct() {
  const navigate = useNavigate()
  const [dark, setDark]                   = useState(true)
  const [activeCategory, setActiveCategory] = useState('rings')
  const [products, setProducts]           = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [showAddForm, setShowAddForm]     = useState(false)
  const [metalPrices, setMetalPrices]     = useState({ gold22k: null, gold24k: null, silver: null })

  // Add form

  const [productImages, setProductImages]     = useState([])
  const [productPreviewUrls, setProductPreviewUrls] = useState([])
  const [productMsg, setProductMsg]   = useState('')
  const [productForm, setProductForm] = useState({
  category: '', metal: '', grade: '', name: '', description: '',
  cross_weight: '', stone_weight: '', making_charge: '', stone_value: '',
  tag: '', occasion: '', wedding_category: '', gender: 'all', wastage_charge: ''
})
const [productSaving, setProductSaving] = useState(false)
const [livePrice, setLivePrice] = useState(null)   // final price with tax
const [netWeight, setNetWeight] = useState(null)    // cross - stone
const [baseMetalAmt, setBaseMetalAmt] = useState(null) // netWeight × rate

  // Edit modal
  const [editProduct, setEditProduct] = useState(null)
  const [editForm, setEditForm]       = useState({})
  const [editImages, setEditImages]   = useState([])
  const [editPreviews, setEditPreviews] = useState([])
  const [editMsg, setEditMsg]         = useState('')
  const [editSaving, setEditSaving]   = useState(false)
  const [editLivePrice, setEditLivePrice] = useState(null)

  // Lightbox
  const [lightboxUrl, setLightboxUrl] = useState(null)

  const bg       = dark ? '#020617' : '#f8fafc'
  const text     = dark ? '#f8fafc' : '#020617'
  const subtext  = dark ? '#94a3b8' : '#64748b'
  const border   = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  const glass    = dark ? 'rgba(15,23,42,0.75)' : 'rgba(255,255,255,0.8)'
  const inpBg    = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const inpBorder = dark ? '#374151' : '#d1d5db'
  const optionBg = dark ? '#1a2035' : '#ffffff'
  const cardBg   = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
  const cardBorder = dark ? '1px solid rgba(103,232,249,0.1)' : '1px solid rgba(0,0,0,0.1)'

  const inpStyle = { width: '100%', background: inpBg, border: `1px solid ${inpBorder}`, borderRadius: '10px', padding: '11px 14px', color: text, fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }
  const lblStyle = { display: 'block', color: subtext, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '7px' }

  useEffect(() => {
    api.get('/metal-rates/').then(res => {
      setMetalPrices({ gold22k: parseFloat(res.data.gold_22k), gold24k: parseFloat(res.data.gold_24k), silver: parseFloat(res.data.silver_999) })
    }).catch(() => {})
  }, [])

  useEffect(() => { fetchProducts() }, [activeCategory])

  const fetchProducts = async () => {
    setLoadingProducts(true)
    try {
      const res = await api.get(`/jewelry-products/?category=${activeCategory}`)
      setProducts(Array.isArray(res.data) ? res.data : [])
    } catch { setProducts([]) }
    setLoadingProducts(false)
  }

const calcAll = (crossW, stoneW, metal, grade, makingCharge, wastageCharge, stoneVal) => {
  const cw = parseFloat(crossW) || 0
  const sw = parseFloat(stoneW) || 0
  const mc = parseFloat(makingCharge) || 0
  const wc = parseFloat(wastageCharge) || 0
  const sv = parseFloat(stoneVal) || 0

  if (!cw || cw <= 0 || !metal) {
    setNetWeight(null); setBaseMetalAmt(null); setLivePrice(null); return
  }

  const nw = cw - sw
  if (nw <= 0) { setNetWeight(null); setBaseMetalAmt(null); setLivePrice(null); return }

  const rate = metal === 'gold'
    ? (grade === '22k' ? metalPrices.gold22k : metalPrices.gold24k)
    : metalPrices.silver

  if (!rate) { setNetWeight(nw); setBaseMetalAmt(null); setLivePrice(null); return }

  const base = nw * rate                        // net weight × today rate
  const sub  = base + mc + wc + sv                   // + making charge + westage charge +stone value
  const total = (sub * 1.03).toFixed(2)         // + 3% tax

  setNetWeight(nw)
  setBaseMetalAmt(base.toFixed(2))
  setLivePrice(total)
}

  // ── ADD ──
  const handleSave = async () => {
    if (!productForm.name.trim())    { setProductMsg('❌ Name required');     return }
    if (!productForm.cross_weight)   { setProductMsg('❌ Cross Weight required');   return }
    if (!productForm.category)       { setProductMsg('❌ Category required'); return }
    if (!productForm.metal)          { setProductMsg('❌ Metal required');    return }
    if (!productForm.grade)          { setProductMsg('❌ Grade required');    return }
    setProductSaving(true)
    try {
      const fd = new FormData()
      Object.entries(productForm).forEach(([k, v]) => fd.append(k, v))
//       fd.append('cross_weight', productForm.cross_weight || 0)
// fd.append('stone_weight', productForm.stone_weight || 0)
fd.append('net_weight', netWeight || 0)
// fd.append('making_charge', productForm.making_charge || 0)
// fd.append('stone_value', productForm.stone_value || 0)
if (livePrice) fd.append('price', livePrice)
      productImages.forEach(img => fd.append('uploaded_images', img))
      await api.post('/jewelry-products/', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setProductMsg('✅ Product added!')
      setProductForm({ category: '', metal: '', grade: '', name: '', description: '', cross_weight: '', stone_weight: '', making_charge: '', stone_value: '', tag: '' })
setProductImages([]); setProductPreviewUrls([]); setLivePrice(null); setNetWeight(null); setBaseMetalAmt(null)
      setShowAddForm(false)
      fetchProducts()
    } catch (err) { setProductMsg('❌ ' + JSON.stringify(err.response?.data || err.message)) }
    setProductSaving(false)
  }

  // ── EDIT OPEN ──
  const openEdit = p => {
    setEditProduct(p)
    setEditForm({ category: p.category, metal: p.metal, grade: p.grade, name: p.name, description: p.description || '', weight_grams: p.weight_grams || '', tag: p.tag || '' })
    setEditImages([]); setEditPreviews([]); setEditMsg('')
    setEditLivePrice(p.price ? String(p.price) : null)
  }

  // ── EDIT SAVE ──
  const handleEdit = async () => {
    if (!editForm.name.trim()) { setEditMsg('❌ Name required'); return }
    setEditSaving(true)
    try {
      const fd = new FormData()
      Object.entries(editForm).forEach(([k, v]) => fd.append(k, v))
      if (editLivePrice) fd.append('price', editLivePrice)
      editImages.forEach(img => fd.append('uploaded_images', img))
      const res = await api.patch(`/jewelry-products/${editProduct.id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setEditMsg('✅ Updated!')
      setEditProduct(res.data)   // refresh edit modal with new data
      fetchProducts()
    } catch (err) { setEditMsg('❌ ' + JSON.stringify(err.response?.data || err.message)) }
    setEditSaving(false)
  }

  // ── DELETE IMAGE ── 
  const deleteImage = async imgId => {
    try {
      await api.delete(`/jewelry-product-images/${imgId}/`)
      setEditProduct(prev => ({ ...prev, images: prev.images.filter(i => i.id !== imgId) }))
    } catch { setEditMsg('❌ Image delete failed') }
  }


  const handleToggleHide = async (p) => {
  try {
    await api.patch(`/jewelry-products/${p.id}/`, { is_active: !p.is_active })
    fetchProducts()
  } catch { alert('Failed to update') }
}

const handleDelete = async (id) => {
  if (!window.confirm('Delete this product permanently?')) return
  try {
    await api.delete(`/jewelry-products/${id}/`)
    fetchProducts()
  } catch { alert('Delete failed') }
}


  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: '"Inter",system-ui,sans-serif' }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin    { to { transform:rotate(360deg) } }
        .ap-card:hover .ap-hover { opacity:1 !important }
        .ap-card:hover .ap-edit-btn { opacity:1 !important; transform:translateY(0) !important }
        input:focus, textarea:focus, select:focus { border-color:#a78bfa !important }
      `}</style>

      {/* ── NAVBAR ── */}
      <div style={{ background: glass, borderBottom: `1px solid ${border}`, padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '12px', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap' }}>
        <img src={logo} alt="BB" style={{ width: 42, height: 36, borderRadius: '8px', objectFit: 'contain', flexShrink: 0 }} />

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setShowAddForm(false); setProductMsg('') }}
              style={{ padding: '7px 14px', borderRadius: '20px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', border: 'none', transition: 'all 0.2s',
                background: activeCategory === cat.key ? 'linear-gradient(90deg,#a78bfa,#22d3ee)' : (dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'),
                color: activeCategory === cat.key ? '#1a0040' : subtext,
              }}>{cat.emoji} {cat.label}</button>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

  {/* NEW: Add Banner button */}
  <button onClick={() => navigate('/add-banners')}
    style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', fontWeight: 800, fontSize: '12px', cursor: 'pointer', background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', color: '#1a0040' }}>
    🖼️ Add Banner
  </button>

  {/* NEW: Home Banner button */}
  <button onClick={() => navigate('/home-banner')}
    style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', fontWeight: 800, fontSize: '12px', cursor: 'pointer', background: 'linear-gradient(90deg,#34d399,#22d3ee)', color: '#003b40' }}>
    🏠 Home Banner
  </button>
          <button onClick={() => { setShowAddForm(s => !s); setProductMsg('') }}
            style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', fontWeight: 800, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
              background: showAddForm ? 'rgba(239,68,68,0.15)' : 'linear-gradient(90deg,#a78bfa,#22d3ee)',
              color: showAddForm ? '#f87171' : '#1a0040',
            }}>{showAddForm ? '✕ Close' : '+ Add Product'}</button>

          <button onClick={() => setDark(d => !d)} style={{ padding: '7px 13px', borderRadius: '10px', border: `1px solid ${border}`, background: 'transparent', color: text, cursor: 'pointer', fontSize: '13px' }}>
            {dark ? '☀️' : '🌙'}
          </button>
          <button onClick={() => navigate('/super-admin')} style={{ padding: '7px 13px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}>
            ← Back
          </button>
        </div>
      </div>

      {/* ── PAGE BODY ── */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '28px 24px' }}>

        {/* ── ADD FORM ── */}
        {showAddForm && (
          <div style={{ background: cardBg, border: '1px solid rgba(167,139,250,0.3)', borderRadius: '20px', padding: '26px', marginBottom: '28px', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ color: '#a78bfa', fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '18px' }}>➕ Add New Product</div>

            {productMsg && (
              <div style={{ background: productMsg.includes('✅') ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${productMsg.includes('✅') ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`, color: productMsg.includes('✅') ? '#4ade80' : '#f87171', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px' }}>
                {productMsg}
              </div>
            )}

 {/* Row 1 - category / Wedding Category / metal / grade */}
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
  <div>
    <label style={lblStyle}>Product *</label>
    <select value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))} style={{ ...inpStyle, cursor: 'pointer' }}>
      <option value="" style={{ background: optionBg }}>-- Select --</option>
      {CATEGORIES.map(c => <option key={c.key} value={c.key} style={{ background: optionBg }}>{c.emoji} {c.label}</option>)}
    </select>
  </div>
  <div>
    <label style={lblStyle}>Wedding Category</label>
    <select value={productForm.wedding_category} onChange={e => setProductForm(f => ({ ...f, wedding_category: e.target.value }))} style={{ ...inpStyle, cursor: 'pointer' }}>
      <option value="" style={{ background: optionBg }}>-- None --</option>
      {WEDDING_CATEGORIES.map(w => <option key={w} value={w} style={{ background: optionBg }}>{w}</option>)}
    </select>
  </div>
  <div>
    <label style={lblStyle}>Metal *</label>
    <select value={productForm.metal} onChange={e => setProductForm(f => ({ ...f, metal: e.target.value, grade: '' }))} style={{ ...inpStyle, cursor: 'pointer' }}>
      <option value="" style={{ background: optionBg }}>-- Select --</option>
      <option value="gold" style={{ background: optionBg }}>🏅 Gold</option>
      <option value="silver" style={{ background: optionBg }}>🥈 Silver</option>
      <option value="diamond" style={{ background: optionBg }}>💎 Diamond</option>
    </select>
  </div>
  {productForm.metal !== 'diamond' && (
    <div>
      <label style={lblStyle}>Grade *</label>
      <select value={productForm.grade} onChange={e => setProductForm(f => ({ ...f, grade: e.target.value }))} style={{ ...inpStyle, cursor: 'pointer' }}>
        <option value="" style={{ background: optionBg }}>-- Select --</option>
        {(productForm.metal === 'gold' ? ['22k', '24k'] : productForm.metal === 'silver' ? ['999'] : []).map(g => (
          <option key={g} value={g} style={{ background: optionBg }}>{g.toUpperCase()}</option>
        ))}
      </select>
    </div>
  )}
</div>

{/* Row 2 - Product Name / Occasion / Tag */}
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
  <div>
    <label style={lblStyle}>Product Name *</label>
    <select
      value={productForm.name}
      onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
      style={{ ...inpStyle, cursor: 'pointer' }}
    >
      <option value="" style={{ background: optionBg }}>-- Select --</option>
      {(SUBCATEGORIES[productForm.category]?.[productForm.metal] || []).map(n => (
        <option key={n} value={n} style={{ background: optionBg }}>{n}</option>
      ))}
    </select>
  </div>
  <div>
    <label style={lblStyle}>Occasion</label>
    <select value={productForm.occasion} onChange={e => setProductForm(f => ({ ...f, occasion: e.target.value }))} style={{ ...inpStyle, cursor: 'pointer' }}>
      <option value="" style={{ background: optionBg }}>-- None --</option>
      {OCCASIONS.map(o => <option key={o} value={o} style={{ background: optionBg }}>{o}</option>)}
    </select>
  </div>
  <div>
    <label style={lblStyle}>Tag</label>
    <select value={productForm.tag} onChange={e => setProductForm(f => ({ ...f, tag: e.target.value }))} style={{ ...inpStyle, cursor: 'pointer' }}>
      <option value="" style={{ background: optionBg }}>-- None --</option>
      {TAGS.map(t => <option key={t} value={t} style={{ background: optionBg }}>{t}</option>)}
    </select>
  </div>
</div>

{/* Row 3 - Gender only */}
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
  <div>
    <label style={lblStyle}>Gender</label>
    <select value={productForm.gender} onChange={e => setProductForm(f => ({ ...f, gender: e.target.value }))} style={{ ...inpStyle, cursor: 'pointer' }}>
      {GENDERS.map(g => <option key={g} value={g} style={{ background: optionBg }}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
    </select>
  </div>
</div>
  
            {/* Description */}
            <div style={{ marginBottom: '14px' }}>
              <label style={lblStyle}>Description</label>
              <textarea value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Product description..." style={{ ...inpStyle, resize: 'vertical' }} />
            </div>

{/* Weight Section */}
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
  {/* Cross Weight */}
  <div>
    <label style={lblStyle}>Cross Weight (g) *</label>
    <input type="number" step="0.0001" value={productForm.cross_weight}
      onChange={e => {
        const v = e.target.value
        setProductForm(f => ({ ...f, cross_weight: v }))
       calcAll(v, productForm.stone_weight, productForm.metal, productForm.grade, productForm.making_charge, productForm.wastage_charge, productForm.stone_value)
      }}
      placeholder="e.g. 10" style={inpStyle} />
  </div>

  {/* Stone Weight */}
  <div>
    <label style={lblStyle}>Stone Weight (g)</label>
    <input type="number" step="0.0001" value={productForm.stone_weight}
      onChange={e => {
        const v = e.target.value
        setProductForm(f => ({ ...f, stone_weight: v }))
        calcAll(productForm.cross_weight, v, productForm.metal, productForm.grade, productForm.making_charge, productForm.wastage_charge, productForm.stone_value)
      }}
      placeholder="e.g. 2 (0 if none)" style={inpStyle} />
  </div>

  {/* Net Weight Display */}
  <div>
    <label style={lblStyle}>Net Weight (auto)</label>
    <div style={{
      ...inpStyle,
      border: `1px solid ${netWeight ? 'rgba(34,211,238,0.5)' : inpBorder}`,
      color: netWeight ? '#22d3ee' : subtext,
      fontWeight: 800, fontFamily: 'monospace'
    }}>
      {netWeight
        ? `${netWeight}g${baseMetalAmt ? ` (₹${Number(baseMetalAmt).toLocaleString('en-IN')})` : ''}`
        : '—'}
    </div>
  </div>
</div>

{/* Diamond Price — only show when metal is diamond */}
{productForm.metal === 'diamond' && (
  <div style={{ marginBottom: '14px' }}>
    <label style={lblStyle}>Diamond Product Price (₹) *</label>
    <input
      type="number"
      step="1"
      value={livePrice || ''}
      onChange={e => setLivePrice(e.target.value)}
      placeholder="Enter diamond product price manually"
      style={{ ...inpStyle, color: '#a78bfa', fontWeight: 800, border: '1px solid rgba(167,139,250,0.5)' }}
    />
    <div style={{ fontSize: '10px', color: '#a78bfa', marginTop: '4px' }}>💎 Diamond price enter pannunga manually</div>
  </div>
)}

{/* Making Charge + Stone Value + Final Price — hide for diamond */}
{productForm.metal !== 'diamond' && (
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
  
  {/* Making Charge */}
  <div>
    <label style={lblStyle}>Making Charge (₹)</label>
    <input type="number" step="1" value={productForm.making_charge}
      onChange={e => {
        const v = e.target.value
        setProductForm(f => ({ ...f, making_charge: v }))
        calcAll(productForm.cross_weight, productForm.stone_weight, productForm.metal, productForm.grade, v, productForm.wastage_charge, productForm.stone_value)
      }}
      placeholder="e.g. 1800" style={inpStyle} />
  </div>

    {/* Wastage Charge */}
  <div>
    <label style={lblStyle}>Wastage Charge (₹)</label>
    <input type="number" step="1" value={productForm.wastage_charge}
      onChange={e => {
        const v = e.target.value
        setProductForm(f => ({ ...f, wastage_charge: v }))
        calcAll(productForm.cross_weight, productForm.stone_weight, productForm.metal, productForm.grade, productForm.making_charge, v, productForm.stone_value)
      }}
      placeholder="e.g. 1500" style={inpStyle} />
  </div>

  {/* Stone Value */}
  <div>
    <label style={lblStyle}>Stone Value (₹)</label>
    <input type="number" step="1" value={productForm.stone_value}
      onChange={e => {
        const v = e.target.value
        setProductForm(f => ({ ...f, stone_value: v }))
        calcAll(productForm.cross_weight, productForm.stone_weight, productForm.metal, productForm.grade, productForm.making_charge, productForm.wastage_charge, v)
      }}
      placeholder="e.g. 2000" style={inpStyle} />
  </div>

  {/* Live Rate Price (with 3% tax) */}
  <div>
    <label style={lblStyle}>Total Price (with 3% tax)</label>
    <div style={{
      ...inpStyle,
      color: livePrice ? '#4ade80' : subtext,
      fontWeight: 800, fontFamily: 'monospace',
      border: `1px solid ${livePrice ? 'rgba(74,222,128,0.5)' : inpBorder}`
    }}>
      {livePrice ? `₹ ${Number(livePrice).toLocaleString('en-IN')}` : '—'}
    </div>
    {livePrice && (
      <div style={{ fontSize: '10px', color: '#6ee7b7', marginTop: '4px' }}>
        ✅ Includes 3% GST
      </div>
    )}
  </div>
</div>
)}

            {/* Images */}
            <div style={{ marginBottom: '18px' }}>
              <label style={lblStyle}>Product Images</label>
              <label htmlFor="ap-add-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', background: 'rgba(167,139,250,0.08)', border: '2px dashed rgba(167,139,250,0.4)', borderRadius: '10px', cursor: 'pointer', color: '#a78bfa', fontWeight: 700, fontSize: '13px' }}>
                📷 Add Images
              </label>
              <input id="ap-add-img" type="file" accept="image/*" multiple style={{ display: 'none' }}
                onChange={e => { const f = Array.from(e.target.files); setProductImages(p => [...p, ...f]); setProductPreviewUrls(p => [...p, ...f.map(x => URL.createObjectURL(x))]); e.target.value = '' }} />
              {productPreviewUrls.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
                  {productPreviewUrls.map((url, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(167,139,250,0.3)', cursor: 'pointer' }}
                      onClick={() => setLightboxUrl(url)}>
                      <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={e => { e.stopPropagation(); setProductImages(p => p.filter((_, i) => i !== idx)); setProductPreviewUrls(p => p.filter((_, i) => i !== idx)) }}
                        style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button disabled={productSaving} onClick={handleSave}
              style={{ padding: '12px 32px', background: productSaving ? 'rgba(167,139,250,0.3)' : 'linear-gradient(90deg,#a78bfa,#22d3ee)', border: 'none', borderRadius: '12px', fontWeight: 900, fontSize: '14px', color: productSaving ? '#a78bfa' : '#1a0040', cursor: productSaving ? 'not-allowed' : 'pointer' }}>
              {productSaving ? '⏳ Saving...' : '✅ Add Product'}
            </button>
          </div>
        )}

        {/* ── PRODUCT GRID HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ color: '#a5f3fc', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {CATEGORIES.find(c => c.key === activeCategory)?.emoji} {CATEGORIES.find(c => c.key === activeCategory)?.label} — {products.length} Products
          </div>
          <button onClick={fetchProducts} style={{ padding: '6px 14px', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: '8px', color: '#22d3ee', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>🔄 Refresh</button>
        </div>

        {/* ── PRODUCT GRID ── */}
        {loadingProducts ? (
          <div style={{ textAlign: 'center', padding: '80px', color: subtext }}>
            <div style={{ width: 36, height: 36, border: '3px solid rgba(167,139,250,0.2)', borderTop: '3px solid #a78bfa', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            Loading...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: subtext, border: `2px dashed ${border}`, borderRadius: '20px' }}>
            <div style={{ fontSize: '52px', marginBottom: '14px' }}>{CATEGORIES.find(c => c.key === activeCategory)?.emoji}</div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>No {activeCategory} yet</div>
            <div style={{ fontSize: '13px', marginTop: '8px', opacity: 0.7 }}>Click "+ Add Product" to get started</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {products.map(p => {
              const firstImg = p.images?.[0] ? getImageUrl(p.images[0]) : null
              const price    = parseFloat(p.price) || 0
              return (
                <div key={p.id} className="ap-card"
                  style={{ background: cardBg, border: cardBorder, borderRadius: '16px', overflow: 'hidden', position: 'relative', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(167,139,250,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
{/* Image area */}
<div style={{ height: '165px', background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  {firstImg
    ? <img src={firstImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.currentTarget.style.display = 'none'} />
    : <div style={{ fontSize: '44px' }}>{CATEGORIES.find(c => c.key === p.category)?.emoji || '💍'}</div>
  }

  {/* Hover overlay — position absolute so it floats over the image */}
  <div className="ap-hover" style={{
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.65)',
    display: 'flex', flexDirection: 'column',
    gap: '8px', alignItems: 'center', justifyContent: 'center',
    opacity: 0, transition: 'opacity 0.2s ease'
  }}>
    <button onClick={() => openEdit(p)}
      style={{ padding: '7px 18px', background: 'linear-gradient(90deg,#a78bfa,#22d3ee)', border: 'none', borderRadius: '20px', color: '#1a0040', fontWeight: 900, fontSize: '12px', cursor: 'pointer' }}>
      ✏️ Edit
    </button>
    <button onClick={() => handleToggleHide(p)}
      style={{ padding: '7px 18px', background: p.is_active ? 'rgba(251,191,36,0.2)' : 'rgba(74,222,128,0.2)', border: `1px solid ${p.is_active ? '#fbbf24' : '#4ade80'}`, borderRadius: '20px', color: p.is_active ? '#fbbf24' : '#4ade80', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}>
      {p.is_active ? '🙈 Hide' : '👁 Show'}
    </button>
    <button onClick={() => handleDelete(p.id)}
      style={{ padding: '7px 18px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: '20px', color: '#f87171', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}>
      🗑 Remove
    </button>
  </div>
</div>

                  {/* Info */}
                  <div style={{ padding: '12px 14px' }}>
                    {p.tag && (
                      <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '20px', background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)', marginBottom: '6px', display: 'inline-block' }}>{p.tag}</span>
                    )}
                    <div style={{ color: text, fontWeight: 700, fontSize: '13px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: subtext, fontSize: '10px' }}>{p.metal?.toUpperCase()} {p.grade?.toUpperCase()} • {parseFloat(p.weight_grams)}g</div>
                      <div style={{ color: p.metal === 'gold' ? '#fbbf24' : '#c0c0c0', fontWeight: 800, fontSize: '12px', fontFamily: 'monospace' }}>
                        {price > 0 ? `₹${price.toLocaleString('en-IN')}` : '—'}
                      </div>
                    </div>
                    <div style={{ color: subtext, fontSize: '10px', marginTop: '3px' }}>📷 {p.images?.length || 0} image{p.images?.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── EDIT MODAL ── */}
      {editProduct && (
        <div onClick={() => setEditProduct(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: dark ? 'linear-gradient(145deg,#0a1628,#060e1c)' : '#f8fafc', border: '1px solid rgba(167,139,250,0.35)', borderRadius: '24px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 90px rgba(0,0,0,0.8)', animation: 'fadeIn 0.25s ease' }}>

            {/* Header */}
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <div style={{ color: '#a78bfa', fontWeight: 800, fontSize: '14px' }}>✏️ EDIT PRODUCT</div>
                <div style={{ color: subtext, fontSize: '11px', marginTop: '3px' }}>{editProduct.name}</div>
              </div>
              <button onClick={() => setEditProduct(null)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px' }}>✕ Close</button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {editMsg && (
                <div style={{ background: editMsg.includes('✅') ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${editMsg.includes('✅') ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`, color: editMsg.includes('✅') ? '#4ade80' : '#f87171', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px' }}>
                  {editMsg}
                </div>
              )}

              {/* Existing images */}
              {editProduct.images?.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <label style={lblStyle}>Existing Images (click ✕ to delete)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {editProduct.images.map(img => {
                      const url = getImageUrl(img)
                      return url ? (
                        <div key={img.id} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(167,139,250,0.3)', cursor: 'pointer' }}
                          onClick={() => setLightboxUrl(url)}>
                          <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button onClick={e => { e.stopPropagation(); deleteImage(img.id) }}
                            style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {/* category / metal / grade */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={lblStyle}>Category</label>
                  <select value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} style={{ ...inpStyle, cursor: 'pointer' }}>
                    {CATEGORIES.map(c => <option key={c.key} value={c.key} style={{ background: optionBg }}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lblStyle}>Metal</label>
                  <select value={editForm.metal} onChange={e => setEditForm(f => ({ ...f, metal: e.target.value, grade: '' }))} style={{ ...inpStyle, cursor: 'pointer' }}>
                    <option value="gold" style={{ background: optionBg }}>Gold</option>
                    <option value="silver" style={{ background: optionBg }}>Silver</option>
                  </select>
                </div>
                <div>
                  <label style={lblStyle}>Grade</label>
                  <select value={editForm.grade} onChange={e => setEditForm(f => ({ ...f, grade: e.target.value }))} style={{ ...inpStyle, cursor: 'pointer' }}>
                    {(editForm.metal === 'gold' ? ['22k', '24k'] : ['999']).map(g => <option key={g} value={g} style={{ background: optionBg }}>{g.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              {/* name / tag */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={lblStyle}>Name *</label>
                  <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={inpStyle} />
                </div>
                <div>
                  <label style={lblStyle}>Tag</label>
                  <select value={editForm.tag} onChange={e => setEditForm(f => ({ ...f, tag: e.target.value }))} style={{ ...inpStyle, cursor: 'pointer' }}>
                    <option value="" style={{ background: optionBg }}>-- None --</option>
                    {TAGS.map(t => <option key={t} value={t} style={{ background: optionBg }}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* description */}
              <div style={{ marginBottom: '12px' }}>
                <label style={lblStyle}>Description</label>
                <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ ...inpStyle, resize: 'vertical' }} />
              </div>

              {/* weight / live price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={lblStyle}>Weight (grams)</label>
                  <input type="number" step="0.0001" value={editForm.weight_grams}
                    onChange={e => { const v = e.target.value; setEditForm(f => ({ ...f, weight_grams: v })); setEditLivePrice(null) }}
                    style={inpStyle} />
                </div>
                <div>
                  <label style={lblStyle}>Live Rate Price</label>
                  <div style={{ ...inpStyle, color: editLivePrice ? '#4ade80' : subtext, fontWeight: 800, fontFamily: 'monospace', border: `1px solid ${editLivePrice ? 'rgba(74,222,128,0.5)' : inpBorder}` }}>
                    {editLivePrice ? `₹ ${editLivePrice}` : '—'}
                  </div>
                </div>
              </div>

              {/* Add more images */}
              <div style={{ marginBottom: '8px' }}>
                <label style={lblStyle}>Add More Images</label>
                <label htmlFor="edit-img-add" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: 'rgba(167,139,250,0.08)', border: '2px dashed rgba(167,139,250,0.4)', borderRadius: '10px', cursor: 'pointer', color: '#a78bfa', fontWeight: 700, fontSize: '13px' }}>
                  📷 Add Images
                </label>
                <input id="edit-img-add" type="file" accept="image/*" multiple style={{ display: 'none' }}
                  onChange={e => { const f = Array.from(e.target.files); setEditImages(p => [...p, ...f]); setEditPreviews(p => [...p, ...f.map(x => URL.createObjectURL(x))]); e.target.value = '' }} />
                {editPreviews.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
                    {editPreviews.map((url, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(167,139,250,0.3)', cursor: 'pointer' }}
                        onClick={() => setLightboxUrl(url)}>
                        <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button onClick={e => { e.stopPropagation(); setEditImages(p => p.filter((_, i) => i !== idx)); setEditPreviews(p => p.filter((_, i) => i !== idx)) }}
                          style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 24px', borderTop: `1px solid ${border}`, flexShrink: 0 }}>
              <button disabled={editSaving} onClick={handleEdit}
                style={{ width: '100%', padding: '13px', background: editSaving ? 'rgba(167,139,250,0.3)' : 'linear-gradient(90deg,#a78bfa,#22d3ee)', border: 'none', borderRadius: '12px', fontWeight: 900, fontSize: '14px', color: editSaving ? '#a78bfa' : '#1a0040', cursor: editSaving ? 'not-allowed' : 'pointer' }}>
                {editSaving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX ── */}
      {lightboxUrl && (
        <div onClick={() => setLightboxUrl(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={lightboxUrl} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '16px' }} />
          <button onClick={() => setLightboxUrl(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(239,68,68,0.85)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', fontSize: '16px', cursor: 'pointer', fontWeight: 900 }}>✕</button>
        </div>
      )}
    </div>
  )
}