import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import logo from '../assets/logo.png'

// ── Role display config ──
const ROLE_CFG = {
  super_admin: { label: '🛡️ Super Admin', color: '#ffd700' },
  admin:       { label: '🛡️ Admin',       color: '#22d3ee' },
  dealer:      { label: '🏪 Dealer',       color: '#4ade80' },
  sub_dealer:  { label: '🔗 Sub Dealer',   color: '#f59e0b' },
  promotor:    { label: '🌟 Promotor',     color: '#a78bfa' },
}

// ── Column labels shown in the breakdown table, based on root type ──
const COLUMN_MAP = {
  admin:      ['Dealer', 'Sub Dealer', 'Promotor', 'Customer'],
  dealer:     ['Sub Dealer', 'Promotor', 'Customer'],
  sub_dealer: ['Promotor', 'Customer'],
  promotor:   ['Customer'],
}

// ── Drill-down levels available per login role ──
const DRILL_LEVELS = {
  super_admin: ['own', 'admin', 'dealer', 'sub_dealer', 'promotor', 'customer'],
  admin:       ['own', 'dealer', 'sub_dealer', 'promotor', 'customer'],
  dealer:      ['own', 'sub_dealer', 'promotor', 'customer'],
  sub_dealer:  ['own', 'promotor', 'customer'],
  promotor:    ['own', 'customer'],
}

const LEVEL_LABELS = {
  own: 'My full network',
  admin: 'Admin',
  dealer: 'Dealer',
  sub_dealer: 'Sub Dealer',
  promotor: 'Promotor',
  customer: 'Customer',
}

const TIME_RANGES = ['Today', 'Week', 'Month', 'Year']

// ── children key per node type ──
function getChildren(node) {
  if (node.type === 'admin') return { key: 'dealers', childType: 'dealer' }
  if (node.type === 'dealer') return { key: 'sub_dealers', childType: 'sub_dealer' }
  if (node.type === 'sub_dealer') return { key: 'promotors', childType: 'promotor' }
  if (node.type === 'promotor') return { key: 'customers', childType: 'customer' }
  return { key: null, childType: null }
}

// ── Flatten a tree (rooted at admin/dealer/sub_dealer/promotor) into leaf rows ──
function flattenToRows(root) {
  const rows = []
  function walk(node, chain) {
    if (node.type === 'customer') {
      const orders = node.orders || []
      const totalAmount = orders.reduce((s, o) => s + (parseFloat(o.total_price) || 0), 0)
      rows.push({
        chain: [...chain, `${node.first_name || ''} ${node.last_name || ''}`.trim() || node.customer_id],
        customerId: node.customer_id,
        orders: orders.length,
        amount: totalAmount,
        rawOrders: orders,
      })
      return
    }
    const { key, childType } = getChildren(node)
    const children = node[key] || []
    const name = node.first_name || node.dealer_name || node.promotor_name || node[`${node.type}_id`] || '—'
    if (children.length === 0) return
    children.forEach(child => walk({ ...child, type: childType }, [...chain, name]))
  }
  walk(root, [])
  return rows
}

// ── Collect every node of a given type inside a tree, keeping its own subtree ──
function collectNodesOfType(root, targetType) {
  const found = []
  function walk(node) {
    if (node.type === targetType) {
      found.push(node)
      return // don't need to go deeper once matched (avoid duplicates)
    }
    const { key, childType } = getChildren(node)
    const children = node[key] || []
    children.forEach(child => walk({ ...child, type: childType }))
  }
  walk(root)
  return found
}

// ── Build a fake date for an order so we can bucket it (fallback = today) ──
function orderDate(o) {
  const d = o.created_at || o.order_date || o.date
  return d ? new Date(d) : new Date()
}

function isInRange(date, range) {
  const now = new Date()
  if (range === 'Today') {
    return date.toDateString() === now.toDateString()
  }
  if (range === 'Week') {
    const weekAgo = new Date(now)
    weekAgo.setDate(now.getDate() - 7)
    return date >= weekAgo && date <= now
  }
  if (range === 'Month') {
    const monthAgo = new Date(now)
    monthAgo.setMonth(now.getMonth() - 1)
    return date >= monthAgo && date <= now
  }
  if (range === 'Year') {
    const yearAgo = new Date(now)
    yearAgo.setFullYear(now.getFullYear() - 1)
    return date >= yearAgo && date <= now
  }
  return true
}

// ── Group rows' orders into buckets (labels + totals) for the trend chart ──
function buildTrendBuckets(rows, range) {
  const now = new Date()
  let buckets = []

  if (range === 'Today') {
    // 6 buckets of 4 hours each
    buckets = Array.from({ length: 6 }, (_, i) => ({ label: `${i * 4}:00`, total: 0 }))
    rows.forEach(r => r.rawOrders.forEach(o => {
      const d = orderDate(o)
      if (!isInRange(d, range)) return
      const idx = Math.min(5, Math.floor(d.getHours() / 4))
      buckets[idx].total += parseFloat(o.total_price) || 0
    }))
  } else if (range === 'Week') {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    buckets = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now); d.setDate(now.getDate() - (6 - i))
      return { label: days[d.getDay()], total: 0, _key: d.toDateString() }
    })
    rows.forEach(r => r.rawOrders.forEach(o => {
      const d = orderDate(o)
      if (!isInRange(d, range)) return
      const b = buckets.find(b => b._key === d.toDateString())
      if (b) b.total += parseFloat(o.total_price) || 0
    }))
  } else if (range === 'Month') {
    // 4 weekly buckets
    buckets = Array.from({ length: 4 }, (_, i) => ({ label: `Week ${i + 1}`, total: 0 }))
    rows.forEach(r => r.rawOrders.forEach(o => {
      const d = orderDate(o)
      if (!isInRange(d, range)) return
      const daysAgo = Math.floor((now - d) / (1000 * 60 * 60 * 24))
      const idx = Math.min(3, Math.floor(daysAgo / 7))
      buckets[3 - idx].total += parseFloat(o.total_price) || 0
    }))
  } else {
    // Year — 12 monthly buckets
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    buckets = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
      return { label: months[d.getMonth()], total: 0, _key: `${d.getFullYear()}-${d.getMonth()}` }
    })
    rows.forEach(r => r.rawOrders.forEach(o => {
      const d = orderDate(o)
      if (!isInRange(d, range)) return
      const key = `${d.getFullYear()}-${d.getMonth()}`
      const b = buckets.find(b => b._key === key)
      if (b) b.total += parseFloat(o.total_price) || 0
    }))
  }

  return buckets
}

// ── Simple inline SVG line chart (no external library needed) ──
function TrendLineChart({ buckets, color }) {
  const width = 700, height = 220, padding = 36
  const max = Math.max(1, ...buckets.map(b => b.total))
  const stepX = (width - padding * 2) / Math.max(1, buckets.length - 1)

  const points = buckets.map((b, i) => {
    const x = padding + i * stepX
    const y = height - padding - (b.total / max) * (height - padding * 2)
    return { x, y, ...b }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '220px' }}>
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* horizontal grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i}
          x1={padding} x2={width - padding}
          y1={height - padding - f * (height - padding * 2)}
          y2={height - padding - f * (height - padding * 2)}
          stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
      <path d={areaD} fill="url(#trendFill)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} />
      ))}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={height - 10} fontSize="11" fill="#94a3b8" textAnchor="middle">{p.label}</text>
      ))}
    </svg>
  )
}

export default function Report() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [role, setRole] = useState('')
  const [treeData, setTreeData] = useState([])

  const [selectedLevel, setSelectedLevel] = useState('own')
  const [selectedNodeId, setSelectedNodeId] = useState('')
  const [timeRange, setTimeRange] = useState('Week')

  const bg = '#020617'
  const text = '#f8fafc'
  const subtext = '#94a3b8'
  const border = 'rgba(255,255,255,0.1)'
  const cardBg = 'rgba(255,255,255,0.03)'

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get('/sales-report/')
        setRole(res.data.role)
        setTreeData(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load report')
      }
      setLoading(false)
    }
    fetchReport()
  }, [])

  const cfg = ROLE_CFG[role] || { label: role, color: '#a5f3fc' }
  const availableLevels = DRILL_LEVELS[role] || ['own']

  // ── nodes available for the second dropdown (only when level !== 'own') ──
  const nodesForSelectedLevel = useMemo(() => {
    if (selectedLevel === 'own' || !treeData.length) return []
    let all = []
    treeData.forEach(root => { all = all.concat(collectNodesOfType(root, selectedLevel)) })
    return all
  }, [selectedLevel, treeData])

  // reset node selection whenever level changes
  useEffect(() => {
    setSelectedNodeId('')
  }, [selectedLevel])

  // ── the actual tree we render: full network OR a single selected node's subtree ──
  const activeTree = useMemo(() => {
    if (selectedLevel === 'own' || !selectedNodeId) return treeData
    const node = nodesForSelectedLevel.find(n =>
      (n.customer_id || n[`${n.type}_id`] || n.id)?.toString() === selectedNodeId
    )
    return node ? [node] : treeData
  }, [selectedLevel, selectedNodeId, nodesForSelectedLevel, treeData])

  const allRows = useMemo(() => {
    let rows = []
    activeTree.forEach(root => { rows = rows.concat(flattenToRows(root)) })
    return rows
  }, [activeTree])

  const totalSales = allRows.reduce((s, r) => s + r.amount, 0)
  const totalOrders = allRows.reduce((s, r) => s + r.orders, 0)
  const totalCustomers = allRows.length

  const columns = activeTree[0] ? (COLUMN_MAP[activeTree[0].type] || []) : []

  const trendBuckets = useMemo(() => buildTrendBuckets(allRows, timeRange), [allRows, timeRange])

  const handleExportExcel = () => {
    alert('Excel export idhи adhing venum na, xlsx library install pண்ணி tharen bro (sonna solli)')
  }
  const handleExportPDF = () => {
    window.print()
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: bg, color: text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        Loading report...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: bg, color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {error}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: '"Inter",system-ui,sans-serif' }}>
      {/* Navbar */}
      <div style={{ padding: '18px 40px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'transparent', border: `1px solid ${border}`, color: subtext, borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px' }}
          >← Back</button>
          <img src={logo} alt="Team 369" style={{ width: '34px', height: '34px', borderRadius: '50%' }} />
          <div>
            <div style={{ fontSize: '11px', color: subtext, fontWeight: 600, letterSpacing: '0.04em' }}>TEAM 369</div>
            <span style={{ fontWeight: 700, fontSize: '15px', color: cfg.color }}>{cfg.label} — Sales Report</span>
          </div>
        </div>

        {/* Drill-down dropdowns + export buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            style={{ background: cardBg, color: text, border: `1px solid ${border}`, borderRadius: '10px', padding: '8px 12px', fontSize: '13px' }}
          >
            {availableLevels.map(lvl => (
              <option key={lvl} value={lvl} style={{ background: '#0f172a' }}>{LEVEL_LABELS[lvl]}</option>
            ))}
          </select>

          {selectedLevel !== 'own' && (
            <select
              value={selectedNodeId}
              onChange={e => setSelectedNodeId(e.target.value)}
              style={{ background: cardBg, color: text, border: `1px solid ${border}`, borderRadius: '10px', padding: '8px 12px', fontSize: '13px', minWidth: '160px' }}
            >
              <option value="" style={{ background: '#0f172a' }}>-- Select {LEVEL_LABELS[selectedLevel]} --</option>
              {nodesForSelectedLevel.map(n => {
                const id = n.customer_id || n[`${n.type}_id`] || n.id
                const name = n.first_name ? `${n.first_name} ${n.last_name || ''}`.trim() : (n.dealer_name || n.promotor_name || id)
                return <option key={id} value={id} style={{ background: '#0f172a' }}>{name}</option>
              })}
            </select>
          )}

          <button onClick={handleExportExcel}
            style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            📊 Export Excel
          </button>
          <button onClick={handleExportPDF}
            style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            📄 Export PDF
          </button>
        </div>
      </div>

      <div style={{ padding: '32px 40px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ color: subtext, fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total sales</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>₹{totalSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ color: subtext, fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total orders</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>{totalOrders}</div>
          </div>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ color: subtext, fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Customers with orders</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>{totalCustomers}</div>
          </div>
        </div>

        {/* Trend chart */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '16px', padding: '20px 24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Sales trend
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {TIME_RANGES.map(r => (
                <button key={r} onClick={() => setTimeRange(r)}
                  style={{
                    background: timeRange === r ? cfg.color : 'transparent',
                    color: timeRange === r ? '#020617' : subtext,
                    border: `1px solid ${timeRange === r ? cfg.color : border}`,
                    borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                  }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <TrendLineChart buckets={trendBuckets} color={cfg.color} />
        </div>

        {/* Breakdown table */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '16px', padding: '24px 28px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
            Network breakdown
          </div>

          {allRows.length === 0 ? (
            <div style={{ color: subtext, textAlign: 'center', padding: '50px 0' }}>No sales found yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    {columns.map(c => (
                      <th key={c} style={{ textAlign: 'left', padding: '10px 12px', color: subtext, fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>{c}</th>
                    ))}
                    <th style={{ textAlign: 'right', padding: '10px 12px', color: subtext, fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>Orders</th>
                    <th style={{ textAlign: 'right', padding: '10px 12px', color: subtext, fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {allRows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                      {row.chain.map((name, ci) => (
                        <td key={ci} style={{ padding: '10px 12px', color: text }}>{name}</td>
                      ))}
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: subtext }}>{row.orders}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: cfg.color }}>
                        ₹{row.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}