import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

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

// ── children key per node type ──
function getChildren(node) {
  if (node.type === 'admin') return { key: 'dealers', childType: 'dealer' }
  if (node.type === 'dealer') return { key: 'sub_dealers', childType: 'sub_dealer' }
  if (node.type === 'sub_dealer') return { key: 'promotors', childType: 'promotor' }
  if (node.type === 'promotor') return { key: 'customers', childType: 'customer' }
  return { key: null, childType: null }
}

// ── Flatten a tree (rooted at admin/dealer/sub_dealer/promotor) into leaf rows ──
// Each row ends at a customer, carrying the chain of names above it + that customer's orders
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

export default function Report() {
  const navigate = useNavigate()
  const [dark] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [role, setRole] = useState('')
  const [treeData, setTreeData] = useState([])

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

  const cfg = ROLE_CFG[role] || { label: role, color: '#a5f3fc' }

  // Combine rows from all root nodes (super_admin can have multiple admins)
  let allRows = []
  treeData.forEach(root => { allRows = allRows.concat(flattenToRows(root)) })

  const totalSales = allRows.reduce((s, r) => s + r.amount, 0)
  const totalOrders = allRows.reduce((s, r) => s + r.orders, 0)
  const totalCustomers = allRows.length

  const columns = treeData[0] ? (COLUMN_MAP[treeData[0].type] || []) : []

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: '"Inter",system-ui,sans-serif' }}>
      {/* Navbar */}
      <div style={{ padding: '18px 40px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'transparent', border: `1px solid ${border}`, color: subtext, borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px' }}
          >← Back</button>
          <span style={{ fontWeight: 700, fontSize: '15px', color: cfg.color }}>{cfg.label} — Sales Report</span>
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