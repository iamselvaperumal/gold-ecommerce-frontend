import { useState, useEffect, useMemo, startTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import logo from '../assets/logo.png'
import ExcelJS from 'exceljs'

// ── Role display config ──
const ROLE_ICONS = {
  super_admin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" strokeLinejoin="round"/>
      <path d="M9.5 12l1.8 1.8L15 10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  admin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" strokeLinejoin="round"/>
      <path d="M9.5 12l1.8 1.8L15 10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dealer: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10l2-6h14l2 6" strokeLinejoin="round"/>
      <path d="M4 10v9h16v-9M9 19v-5h6v5" strokeLinejoin="round"/>
    </svg>
  ),
  sub_dealer: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="6" cy="6" r="2.5"/>
      <circle cx="18" cy="6" r="2.5"/>
      <circle cx="12" cy="18" r="2.5"/>
      <path d="M8 7.5L11 16M16 7.5L13 16" strokeLinecap="round"/>
    </svg>
  ),
  promotor: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z" strokeLinejoin="round"/>
    </svg>
  ),
}

const ROLE_CFG = {
  super_admin: { label: 'Super Admin', color: '#ffd700' },
  admin:       { label: 'Admin',       color: '#22d3ee' },
  dealer:      { label: 'Dealer',      color: '#4ade80' },
  sub_dealer:  { label: 'Sub Dealer',  color: '#f59e0b' },
  promotor:    { label: 'Promotor',    color: '#a78bfa' },
}

// ── Column labels shown in the breakdown table, based on root type ──
const COLUMN_MAP = {
  super_admin_view: ['Admin', 'Dealer', 'Sub Dealer', 'Promotor', 'Customer'],
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

  function getIdName(node, type) {
    const idVal = node[`${type}_id`] || node.id || '—'
    const name = `${node.first_name || ''} ${node.last_name || ''}`.trim() || node.dealer_name || node.promotor_name || idVal
    return { id: idVal, name }
  }

  function walk(node, chain) {
    if (node.type === 'customer') {
      const orders = node.orders || []
      const totalAmount = orders.reduce((s, o) => s + (parseFloat(o.total_price) || 0), 0)
      rows.push({
        chain,
        customerId: node.customer_id,
        orders: orders.length,
        amount: totalAmount,
        rawOrders: orders,
      })
      return
    }
    const { key, childType } = getChildren(node)
    const children = node[key] || []
    if (children.length === 0) return
    children.forEach(child => {
      const childInfo = getIdName(child, childType)
      walk({ ...child, type: childType }, [...chain, childInfo])
    })
  }

  walk(root, [])
  return rows
}

// ── Collect every node of a given type inside a tree, keeping its own subtree ──
// ── Collect every node of a given type inside a tree, keeping its own subtree ──
function collectNodesOfType(root, targetType) {
  const found = []
  function walk(node) {
    if (node.type === targetType) {
      found.push(node)
      return
    }
    const { key, childType } = getChildren(node)
    const children = node[key]
    if (!children || children.length === 0) return
    for (let i = 0; i < children.length; i++) {
      walk({ ...children[i], type: childType })
    }
  }
  walk(root)
  return found
}

// ── Find full ancestor chain for a selected node of any type ──
function findAncestorChain(treeData, targetType, targetId) {
  function walk(node, chain) {
    const idVal = (node.customer_id || node[`${node.type}_id`] || node.id)?.toString()
    const currentChain = [...chain, node]

    if (node.type === targetType && idVal === targetId) {
      return currentChain
    }

    const { key, childType } = getChildren(node)
    const children = node[key] || []
    for (const child of children) {
      const result = walk({ ...child, type: childType }, currentChain)
      if (result) return result
    }
    return null
  }

  for (const root of treeData) {
    const result = walk(root, [])
    if (result) return result
  }
  return null
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

function HierarchyChainCard({ selectedLevel, selectedNodeId, treeData, ancestors, cardBg, border, text, subtext }) {
  const ROLE_STEPS = {
    super_admin: { label: 'Super Admin', color: '#ffd700' },
    admin: { label: 'Admin', color: '#22d3ee' },
    dealer: { label: 'Dealer', color: '#4ade80' },
    sub_dealer: { label: 'Sub Dealer', color: '#f59e0b' },
    promotor: { label: 'Promotor', color: '#a78bfa' },
    customer: { label: 'Customer', color: '#f472b6' },
  }

  if (selectedLevel === 'own' || !selectedNodeId) {
    return (
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
        <div style={{ color: subtext, fontSize: '13px' }}>
          Select a {selectedLevel !== 'own' ? selectedLevel.replace('_', ' ') : 'node'} to view its hierarchy chain
        </div>
      </div>
    )
  }

  const chain = findAncestorChain(treeData, selectedLevel, selectedNodeId)
  if (!chain) return null

  const fullChain = ancestors && ancestors.length > 0
    ? [...ancestors, ...chain]
    : [{ type: 'super_admin' }, ...chain]

 const currentNode = fullChain[fullChain.length - 1]
  const currentCfg = ROLE_STEPS[currentNode.type] || { color: '#94a3b8' }
  const currentName = `${currentNode.first_name || ''} ${currentNode.last_name || ''}`.trim()

  return (
    <div style={{ background: cardBg, border: `2px solid ${currentCfg.color}55`, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: `0 0 24px ${currentCfg.color}11` }}>
      <div style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: `1px solid ${border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'rgba(34,211,238,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
              <circle cx="6" cy="6" r="2.5"/>
              <circle cx="18" cy="18" r="2.5"/>
              <path d="M8 8l8 8" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#22d3ee', letterSpacing: '1px' }}>HIERARCHY CHAIN</div>
            <div style={{ fontSize: '10px', color: subtext }}>{fullChain.length} levels deep</div>
          </div>
        </div>
        <div style={{
          background: `${currentCfg.color}15`, border: `1px solid ${currentCfg.color}40`,
          borderRadius: '10px', padding: '8px 12px', fontSize: '11px', color: text,
        }}>
          Showing full network path for <span style={{ color: currentCfg.color, fontWeight: 700 }}>{currentName}</span>
        </div>
      </div>

      {fullChain.map((node, idx) => {
        const isLast = idx === fullChain.length - 1
        const cfg = ROLE_STEPS[node.type] || { label: node.type, color: '#94a3b8' }
        const name = node.type === 'super_admin' ? '' : `${node.first_name || ''} ${node.last_name || ''}`.trim()
        const idVal = node.type === 'super_admin' ? '' : (node[`${node.type}_id`] || node.id)

        return (
          <div key={idx}>
            {idx > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2px 0' }}>
                <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                  <path d="M7 17V3" stroke={cfg.color} strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M3 7L7 2L11 7" stroke={cfg.color} strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            <div style={{
              borderRadius: '12px', padding: '12px 14px',
              background: isLast ? `${cfg.color}22` : `${cfg.color}0d`,
              border: `1px solid ${isLast ? cfg.color : cfg.color + '33'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: cfg.color, letterSpacing: '1px' }}>{cfg.label.toUpperCase()}</span>
                {isLast && <span style={{ fontSize: '8px', fontWeight: 800, padding: '2px 8px', borderRadius: '20px', background: `${cfg.color}33`, color: cfg.color }}>● CURRENT</span>}
              </div>
              {node.type === 'super_admin' ? (
                <div style={{ color: text, fontWeight: 700, fontSize: '13px' }}>Root • Full Access</div>
              ) : (
                <>
                  <div style={{ color: cfg.color, fontFamily: 'monospace', fontSize: '10px', marginBottom: '2px' }}>{idVal}</div>
                  <div style={{ color: text, fontWeight: 700, fontSize: '13px' }}>{name}</div>
                  {node.mobile_number && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: subtext, fontSize: '11px', marginTop: '3px' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {node.mobile_number}
                    </div>
                  )}
                  {node.city_name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: subtext, fontSize: '11px' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinejoin="round"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {node.city_name}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Report() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [role, setRole] = useState('')
  const [treeData, setTreeData] = useState([])
  const [ancestors, setAncestors] = useState([])

  const [selectedLevel, setSelectedLevel] = useState('own')
const [selectedNodeId, setSelectedNodeId] = useState('')
const [timeRange, setTimeRange] = useState('Week')
const [nodeSearch, setNodeSearch] = useState('')
const [debouncedNodeSearch, setDebouncedNodeSearch] = useState('')
const [showNodeDropdown, setShowNodeDropdown] = useState(false)

useEffect(() => {
  const t = setTimeout(() => setDebouncedNodeSearch(nodeSearch), 150)
  return () => clearTimeout(t)
}, [nodeSearch])

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
        setAncestors(res.data.ancestors || [])
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
  setNodeSearch('')
}, [selectedLevel])

// ── filtered nodes based on search (id / name / phone) ──
const filteredNodes = useMemo(() => {
  if (!debouncedNodeSearch.trim()) return nodesForSelectedLevel.slice(0, 50)
  const q = debouncedNodeSearch.trim().toLowerCase()
  const results = []
  for (let i = 0; i < nodesForSelectedLevel.length; i++) {
    const n = nodesForSelectedLevel[i]
    const id = (n.customer_id || n[`${n.type}_id`] || n.id || '').toString().toLowerCase()
    const name = (n.first_name ? `${n.first_name} ${n.last_name || ''}` : (n.dealer_name || n.promotor_name || '')).toLowerCase()
    const phone = (n.mobile_number || '').toString().toLowerCase()
    if (id.includes(q) || name.includes(q) || phone.includes(q)) {
      results.push(n)
      if (results.length >= 50) break
    }
  }
  return results
}, [debouncedNodeSearch, nodesForSelectedLevel])

  // ── the actual tree we render: full network OR a single selected node's subtree ──
  const activeTree = useMemo(() => {
    if (selectedLevel === 'own' || !selectedNodeId) return treeData
    const node = nodesForSelectedLevel.find(n =>
      (n.customer_id || n[`${n.type}_id`] || n.id)?.toString() === selectedNodeId
    )
    return node ? [node] : treeData
  }, [selectedLevel, selectedNodeId, nodesForSelectedLevel, treeData])

  const isMultiAdminView = role === 'super_admin' && selectedLevel === 'own' && activeTree.length > 1

 const allRows = useMemo(() => {
  let rows = []
  activeTree.forEach(root => {
    const rootRows = flattenToRows(root)
    if (isMultiAdminView) {
      const adminId = root.admin_id || root.id || '—'
      const adminName = `${root.first_name || ''} ${root.last_name || ''}`.trim() || adminId
      rootRows.forEach(r => { r.chain = [{ id: adminId, name: adminName }, ...r.chain] })
    }
    rows = rows.concat(rootRows)
  })
  return rows
}, [activeTree, isMultiAdminView])

  const totalSales = allRows.reduce((s, r) => s + r.amount, 0)
  const totalOrders = allRows.reduce((s, r) => s + r.orders, 0)
  const totalCustomers = allRows.length

  const columns = isMultiAdminView
    ? COLUMN_MAP.super_admin_view
    : (activeTree[0] ? (COLUMN_MAP[activeTree[0].type] || []) : [])

  const trendBuckets = useMemo(() => buildTrendBuckets(allRows, timeRange), [allRows, timeRange])

  const handleExportExcel = async () => {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'BitByte'
  wb.created = new Date()

  const themeColor = cfg.color.replace('#', '')
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + themeColor } }
  const darkFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }

  // ── Sheet 1: Summary ──
  const summarySheet = wb.addWorksheet('Summary')
  summarySheet.columns = [{ width: 26 }, { width: 34 }]

  summarySheet.mergeCells('A1:B1')
  const titleCell = summarySheet.getCell('A1')
  titleCell.value = `Sales Report — ${cfg.label}`
  titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } }
  titleCell.fill = headerFill
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  summarySheet.getRow(1).height = 28

  const infoRows = [
    ['Generated On', new Date().toLocaleString('en-IN')],
    ['Generated By', role],
  ]
  infoRows.forEach(([label, value]) => {
    const r = summarySheet.addRow([label, value])
    r.getCell(1).font = { bold: true, color: { argb: 'FF94A3B8' } }
  })

  summarySheet.addRow([])

  const statRow = summarySheet.addRow(['Metric', 'Value'])
  statRow.eachCell(c => {
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    c.fill = darkFill
  })

  const stats = [
    ['Total Sales', totalSales],
    ['Total Orders', totalOrders],
    ['Customers with Orders', totalCustomers],
  ]
  stats.forEach(([label, value]) => {
    const r = summarySheet.addRow([label, value])
    r.getCell(1).font = { bold: true }
    if (label === 'Total Sales') r.getCell(2).numFmt = '₹#,##0'
    r.getCell(2).font = { bold: true, color: { argb: 'FF' + themeColor } }
  })

  // ── Sheet 2: Sales Trend chart data + native chart ──
  const trendSheet = wb.addWorksheet('Sales Trend')
  trendSheet.columns = [{ width: 14 }, { width: 16 }]
  trendSheet.addRow(['Period', 'Sales Amount']).eachCell(c => {
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    c.fill = darkFill
  })
  trendBuckets.forEach(b => trendSheet.addRow([b.label, b.total]))

  trendSheet.addChart = trendSheet.addChart || (() => {}) // safety no-op if unsupported

  // Note: ExcelJS chart API (community builds may vary) — safe fallback if unavailable
  try {
    trendSheet.addChart({
      type: 'line',
      title: { name: 'Sales Trend' },
      data: {
        categories: `'Sales Trend'!$A$2:$A$${trendBuckets.length + 1}`,
        series: [{ name: 'Sales', values: `'Sales Trend'!$B$2:$B$${trendBuckets.length + 1}` }],
      },
      position: { x: 400, y: 20 },
    })
  } catch { /* chart not supported in this ExcelJS build — data still exported */ }

  // ── Sheet 3: Network breakdown ──
  const detailSheet = wb.addWorksheet('Network Breakdown')
  const headerLabels = columns.flatMap(c => [`${c} ID`, `${c} Name`]).concat(['Orders', 'Sales'])
  detailSheet.columns = headerLabels.map(h => ({ header: h, width: h.includes('Name') ? 22 : 16 }))

  const headerRow = detailSheet.getRow(1)
  headerRow.eachCell(c => {
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    c.fill = darkFill
    c.alignment = { horizontal: 'center' }
  })

  allRows.forEach((row, idx) => {
    const rowData = [...row.chain.flatMap(item => [item.id, item.name]), row.orders, row.amount]
    const r = detailSheet.addRow(rowData)
    if (idx % 2 === 0) {
      r.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } } })
    }
    const salesCell = r.getCell(rowData.length)
    salesCell.numFmt = '₹#,##0'
    salesCell.font = { bold: true, color: { argb: 'FF' + themeColor } }
  })

  // ── Sheet 4: Full hierarchy tree (readable list) ──
  const hierarchySheet = wb.addWorksheet('Hierarchy')
  hierarchySheet.columns = [{ width: 6 }, { width: 16 }, { width: 22 }, { width: 16 }, { width: 22 }]
  hierarchySheet.addRow(['Level', 'ID', 'Name', 'Phone', 'City']).eachCell(c => {
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    c.fill = darkFill
  })

  const addHierarchyRows = (node, depth = 0) => {
    const idVal = node[`${node.type}_id`] || node.id || ''
    const name = `${node.first_name || ''} ${node.last_name || ''}`.trim()
    const r = hierarchySheet.addRow([
      '  '.repeat(depth) + (node.type || '').toUpperCase(),
      idVal, name, node.mobile_number || '', node.city_name || ''
    ])
    r.getCell(1).font = { bold: true, color: { argb: 'FF' + themeColor } }
    const { key, childType } = getChildren(node)
    const children = node[key] || []
    children.forEach(child => addHierarchyRows({ ...child, type: childType }, depth + 1))
  }
  activeTree.forEach(root => addHierarchyRows(root))

  // ── Download ──
  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Sales_Report_${role}_${new Date().toISOString().slice(0, 10)}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}

  const handleExportPDF = () => {
    window.print()
  }

  if (loading) {
  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif', gap: '18px' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseText { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>
      <div style={{
        width: '46px', height: '46px',
        border: '3px solid rgba(34,211,238,0.15)',
        borderTop: '3px solid #22d3ee',
        borderRadius: '50%',
        animation: 'spin 0.9s linear infinite',
      }} />
      <div style={{
        fontSize: '14px',
        color: '#94a3b8',
        letterSpacing: '0.05em',
        animation: 'pulseText 1.6s ease-in-out infinite',
      }}>
        Loading report...
      </div>
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
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #020617 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-container { color: #f8fafc !important; background: #020617 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-card {
            background: rgba(255,255,255,0.03) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            box-shadow: none !important;
            break-inside: avoid;
            page-break-inside: avoid;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          table { break-inside: auto; width: 100% !important; table-layout: fixed !important; }
          tr { break-inside: avoid; break-after: auto; }
          td, th {
            white-space: normal !important;
            word-break: break-word;
            font-size: 9px !important;
            padding: 6px 8px !important;
            overflow: hidden;
            vertical-align: top;
          }
          .print-table-wrap { overflow: visible !important; width: 100% !important; }
          td:last-child, th:last-child { text-align: right !important; }
          @page { size: landscape; margin: 8mm; }
        }
      `}</style>
      {/* Navbar */}
      <div className="no-print" style={{ padding: '18px 40px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
<img src={logo} alt="Team 369" style={{ width: '54px', height: '54px', borderRadius: '50%', flexShrink: 0 }} />
<div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
  <div style={{
    fontSize: '18px',
    fontWeight: 900,
    letterSpacing: '0.02em',
    marginLeft: '-14px',
    background: 'linear-gradient(90deg, #dc2626, #ef4444, #fca5a5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: '"Inter", sans-serif',
  }}>
    TEAM369
  </div>
  <span style={{ fontWeight: 700, fontSize: '15px', color: cfg.color, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
    <span style={{ color: cfg.color, display: 'inline-flex' }}>{ROLE_ICONS[role]}</span>
    {cfg.label} — Sales Report
  </span>
</div>
        </div>

        {/* Drill-down dropdowns + export buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
         <select
  value={selectedLevel}
  onChange={e => {
    const val = e.target.value
    startTransition(() => setSelectedLevel(val))
  }}
  style={{ background: cardBg, color: text, border: `1px solid ${border}`, borderRadius: '10px', padding: '8px 12px', fontSize: '13px', transition: 'border-color 0.15s ease', willChange: 'contents' }}
>
            {availableLevels.map(lvl => (
              <option key={lvl} value={lvl} style={{ background: '#0f172a' }}>{LEVEL_LABELS[lvl]}</option>
            ))}
          </select>

         {selectedLevel !== 'own' && (
  <div style={{ position: 'relative' }}>
    <input
      value={
        showNodeDropdown
          ? nodeSearch
          : (() => {
              const sel = nodesForSelectedLevel.find(n => (n.customer_id || n[`${n.type}_id`] || n.id)?.toString() === selectedNodeId)
              if (!sel) return ''
              return sel.first_name ? `${sel.first_name} ${sel.last_name || ''}`.trim() : (sel.dealer_name || sel.promotor_name || '')
            })()
      }
      onChange={e => { setNodeSearch(e.target.value); setShowNodeDropdown(true) }}
      onFocus={() => { setShowNodeDropdown(true); setNodeSearch('') }}
      onBlur={() => setTimeout(() => setShowNodeDropdown(false), 150)}
      placeholder={`Search ${LEVEL_LABELS[selectedLevel]} by ID, name, phone...`}
      style={{ background: cardBg, color: text, border: `1px solid ${border}`, borderRadius: '10px', padding: '8px 12px', fontSize: '13px', minWidth: '220px', outline: 'none', boxSizing: 'border-box' }}
      onFocusCapture={e => e.target.style.borderColor = cfg.color}
    />
    {showNodeDropdown && (
      <div style={{
        position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 50,
        background: '#0f172a', border: `1px solid ${border}`, borderRadius: '10px',
        maxHeight: '260px', overflowY: 'auto', boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
      }}>
        {filteredNodes.length === 0 ? (
          <div style={{ padding: '12px', color: subtext, fontSize: '13px', textAlign: 'center' }}>No matches found</div>
        ) : filteredNodes.map(n => {
          const id = n.customer_id || n[`${n.type}_id`] || n.id
          const name = n.first_name ? `${n.first_name} ${n.last_name || ''}`.trim() : (n.dealer_name || n.promotor_name || id)
          return (
            <div
              key={id}
              onMouseDown={() => {
                setSelectedNodeId(id.toString())
                setShowNodeDropdown(false)
                setNodeSearch('')
              }}
              style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: `1px solid ${border}` }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ color: cfg.color, fontFamily: 'monospace', fontSize: '11px' }}>{id}</div>
              <div style={{ color: text, fontSize: '13px', fontWeight: 600 }}>{name}</div>
              {n.mobile_number && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: subtext, fontSize: '11px' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {n.mobile_number}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )}
  </div>
)}

         <button onClick={handleExportExcel}
  style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
  Export Excel
</button>
          <button onClick={handleExportPDF}
  style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
    <path d="M6 3h9l5 5v13H6z" strokeLinejoin="round"/>
    <path d="M15 3v5h5" strokeLinejoin="round"/>
    <path d="M9 13h6M9 16h6M9 10h2" strokeLinecap="round"/>
  </svg>
  Export PDF
</button>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'transparent', border: `1px solid ${border}`, color: subtext, borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px' }}
          >← Back</button>
        </div>
      </div>

      <div className="print-container" style={{ padding: '32px 40px', maxWidth: '1500px', margin: '0 auto', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

        <div style={{ flex: '1 1 0%', minWidth: 0 }}>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
           <div className="print-card" style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '16px', padding: '18px 20px' }}>
    <div style={{ color: subtext, fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total sales</div>
    <div style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1.2, letterSpacing: 'normal', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>₹{totalSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
  </div>
            <div className="print-card" style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '16px', padding: '18px 20px' }}>
              <div style={{ color: subtext, fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total orders</div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>{totalOrders}</div>
            </div>
            <div className="print-card" style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '16px', padding: '18px 20px' }}>
              <div style={{ color: subtext, fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Customers with orders</div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>{totalCustomers}</div>
            </div>
          </div>

          {/* Trend chart */}
          <div className="print-card" style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '16px', padding: '20px 24px', marginBottom: '24px' }}>
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
          <div className="print-card" style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '16px', padding: '24px 28px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
              Network breakdown
            </div>

            {allRows.length === 0 ? (
              <div style={{ color: subtext, textAlign: 'center', padding: '50px 0' }}>No sales found yet.</div>
            ) : (
              <div className="print-table-wrap" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${border}` }}>
                      {columns.map(c => (
                        <th key={c} style={{ textAlign: 'left', padding: '10px 12px', color: subtext, fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>{c}</th>
                      ))}
                      <th style={{ textAlign: 'center', padding: '10px 12px', color: subtext, fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>Orders</th>
                      <th style={{ textAlign: 'right', padding: '10px 12px', color: subtext, fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>Sales</th>
                    </tr>
                  </thead>
                  <tbody>
    {allRows.map((row, i) => (
      <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
        {row.chain.map((item, ci) => (
          <td key={ci} style={{ padding: '10px 12px', color: text }}>
            <div style={{ color: cfg.color, fontFamily: 'monospace', fontSize: '11px', marginBottom: '2px' }}>{item.id}</div>
            <div style={{ color: subtext, fontSize: '13px' }}>({item.name})</div>
          </td>
        ))}
        <td style={{ padding: '10px 12px', textAlign: 'center', color: subtext }}>{row.orders}</td>
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

        {/* ── RIGHT: Hierarchy Chain panel ── */}
        <div style={{ width: '320px', flexShrink: 0, position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: subtext, textTransform: 'uppercase', letterSpacing: '0.08em', paddingLeft: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" strokeLinecap="round"/>
            </svg>
            Selected Network Path
          </div>
          <HierarchyChainCard
            selectedLevel={selectedLevel}
            selectedNodeId={selectedNodeId}
            treeData={treeData}
            ancestors={ancestors}
            cardBg={cardBg}
            border={border}
            text={text}
            subtext={subtext}
          />
        </div>

      </div>
    </div>
  )
}