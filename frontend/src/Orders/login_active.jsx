import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const ROLE_ORDER = ['Admin', 'Dealer', 'Sub Dealer', 'Promotor', 'Customer']
const ROLE_COLOR = {
  'Admin': '#22d3ee',
  'Dealer': '#4ade80',
  'Sub Dealer': '#f59e0b',
  'Promotor': '#a78bfa',
  'Customer': '#f472b6',
}

export default function LoginActive() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await api.get('/today-login-status/')
        setData(res.data.active || [])
      } catch (err) {
        setError('Failed to load active users')
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const grouped = ROLE_ORDER.map(role => ({
    role,
    color: ROLE_COLOR[role],
    users: data.filter(u => u.level_role === role),
  }))

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: '"Inter",system-ui,sans-serif', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#4ade80' }}>✅ Active Today</h1>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
              {data.length} users logged in today
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f8fafc', fontSize: '13px', cursor: 'pointer' }}
          >
            ← Back
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>Loading...</div>
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {!loading && !error && grouped.map(group => (
          <div key={group.role} style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: group.color }} />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: group.color }}>
                {group.role} ({group.users.length})
              </h2>
            </div>

            {group.users.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '13px', padding: '12px 0' }}>No active {group.role.toLowerCase()} today</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {group.users.map((u, i) => (
                  <div
                    key={i}
                    style={{
                      background: `rgba(${hexToRgb(group.color)},0.06)`,
                      border: `1px solid rgba(${hexToRgb(group.color)},0.3)`,
                      borderRadius: '14px',
                      padding: '16px 18px',
                    }}
                  >
                    <div style={{ color: group.color, fontFamily: 'monospace', fontSize: '11px', marginBottom: '6px' }}>
                      {u.id || '—'}
                    </div>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>
                      {u.name || 'Unknown'}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '3px' }}>✉️ {u.email || '—'}</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '3px' }}>📞 {u.phone || '—'}</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>📍 {u.location || '—'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  )
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}