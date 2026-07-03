import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../api'

const API_BASE = 'https://bitbyte-backend-f66f.onrender.com'

const ROLE_CFG = {
  admin:      { color: '#22d3ee', label: '🛡️ ADMIN',      idKey: 'admin_id',      childKey: 'dealers' },
  dealer:     { color: '#4ade80', label: '🏪 DEALER',      idKey: 'dealer_id',     childKey: 'sub_dealers' },
  sub_dealer: { color: '#f59e0b', label: '🔗 SUB DEALER',  idKey: 'sub_dealer_id', childKey: 'promotors' },
  promotor:   { color: '#a78bfa', label: '🌟 PROMOTOR',    idKey: 'promotor_id',   childKey: 'customers' },
  customer:   { color: '#f472b6', label: '👤 CUSTOMER',    idKey: 'customer_id',   childKey: null },
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

function getImageUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${API_BASE}/${url.replace(/^\/+/, '')}`
}

function collectOrders(node) {
  if (!node) return []
  if (node.type === 'customer') return node.orders || []
  const cfg = ROLE_CFG[node.type]
  const children = node[cfg.childKey] || []
  return children.flatMap(collectOrders)
}

function TreeItem({ node, selectedId, onSelect, depth }) {
  const cfg = ROLE_CFG[node.type]
  const isSelected = selectedId === `${node.type}-${node.id}`
  const children = cfg.childKey ? (node[cfg.childKey] || []) : []
  const orderCount = collectOrders(node).length
  const rgb = hexToRgb(cfg.color)

  return (
    <div style={{ marginLeft: depth * 14 }}>
      <div
        onClick={() => onSelect(node)}
        style={{
          padding: '10px 14px', marginBottom: 6, borderRadius: 10, cursor: 'pointer',
          background: isSelected ? `rgba(${rgb},0.18)` : 'rgba(255,255,255,0.03)',
          border: `1px solid ${isSelected ? cfg.color : 'rgba(255,255,255,0.08)'}`,
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ fontSize: 9, fontWeight: 800, color: cfg.color, letterSpacing: 1 }}>{cfg.label}</div>
        <div style={{ fontSize: 10, color: cfg.color, fontFamily: 'monospace', opacity: 0.7 }}>{node[cfg.idKey]}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{node.first_name} {node.last_name || ''}</div>
        <div style={{ fontSize: 10, color: '#94a3b8' }}>
          📞 {node.mobile_number}{node.city_name ? ` • 📍 ${node.city_name}` : ''}
        </div>
        <div style={{ marginTop: 4, fontSize: 9, fontWeight: 800, color: '#4ade80' }}>
          🛒 {orderCount} order{orderCount !== 1 ? 's' : ''}
        </div>
      </div>
      {children.map(child => (
        <TreeItem key={`${child.type}-${child.id}`} node={child} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} />
      ))}
    </div>
  )
}

export default function SuperAdminHierarchySalesCount() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const role = searchParams.get('role')
  const id = searchParams.get('id')

  const [root, setRoot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!role || !id) return
    setLoading(true)
    api.get(`/hierarchy/subtree-orders/?role=${role}&id=${id}`)
      .then(res => { setRoot(res.data.root); setSelected(res.data.root) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [role, id])

  const orders = selected ? collectOrders(selected) : []

  const grouped = {}
  orders.forEach(o => {
    const key = `${o.metal}__${o.grade}__${o.product_name}`
    if (!grouped[key]) {
      grouped[key] = {
        metal: o.metal, grade: o.grade, product_name: o.product_name,
        category: o.category, net_weight: o.net_weight,
        image: o.product_image_url,
        totalQty: 0, totalAmount: 0, lastRate: 0,
      }
    }
    grouped[key].totalQty += o.quantity
    grouped[key].totalAmount += o.total_price
    grouped[key].lastRate = o.unit_price
  })
  const groupedList = Object.values(grouped)
  const overallCount = orders.length
  const overallAmount = orders.reduce((s, o) => s + o.total_price, 0)

  if (loading) return <div style={{ padding: 40, color: '#94a3b8', background: '#020617', minHeight: '100vh' }}>Loading...</div>
  if (!root) return <div style={{ padding: 40, color: '#f87171', background: '#020617', minHeight: '100vh' }}>No data found.</div>

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: '"Inter",system-ui,sans-serif', padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#a5f3fc' }}>📊 Sales Count — Hierarchy Breakdown</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Left side-la click pannunga, right side-la orders varum</div>
        </div>
        <button onClick={() => navigate(-1)} style={{ padding: '8px 18px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: 10, cursor: 'pointer', fontSize: 13 }}>
          ← Back
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24, alignItems: 'start' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, maxHeight: '85vh', overflowY: 'auto' }}>
          <TreeItem node={root} selectedId={selected ? `${selected.type}-${selected.id}` : null} onSelect={setSelected} depth={0} />
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          {selected && (
            <>
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#a5f3fc' }}>
                  {selected.first_name} {selected.last_name || ''} — {ROLE_CFG[selected.type].label}
                </div>
                <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: 11 }}>Total Orders</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#4ade80' }}>{overallCount}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: 11 }}>Total Amount</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#fbbf24' }}>₹{overallAmount.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

              {groupedList.length === 0 ? (
                <div style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>
                  Idhu kku keela orders illa.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {groupedList.map((g, i) => {
                    const imgUrl = getImageUrl(g.image)
                    return (
                      <div key={i} style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12, padding: '14px 18px',
                        display: 'grid', gridTemplateColumns: '56px 1fr 1.2fr 1fr 1fr 0.6fr 1.2fr', gap: 12, alignItems: 'center'
                      }}>
                        <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {imgUrl ? (
                            <img src={imgUrl} alt={g.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.style.display = 'none' }} />
                          ) : (
                            <span style={{ fontSize: 20 }}>💍</span>
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>Metal</div>
                          <div style={{ fontWeight: 700, textTransform: 'capitalize' }}>{g.metal}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>Product</div>
                          <div style={{ fontWeight: 700 }}>{g.product_name}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>Grade</div>
                          <div style={{ fontWeight: 700 }}>{g.grade || g.category}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>Weight</div>
                          <div style={{ fontWeight: 700 }}>{g.net_weight ? `${g.net_weight} gm` : '—'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>Qty</div>
                          <div style={{ fontWeight: 700 }}>{g.totalQty}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>Rate / Total</div>
                          <div style={{ fontWeight: 700, color: '#fbbf24' }}>
                            ₹{g.lastRate.toLocaleString('en-IN')} / ₹{g.totalAmount.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}