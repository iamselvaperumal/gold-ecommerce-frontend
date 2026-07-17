import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function LoginInactive() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await api.get('/today-login-status/')
        const sorted = [...(res.data.inactive || [])].sort((a, b) => a.level - b.level)
        setData(sorted)
      } catch (err) {
        setError('Failed to load inactive users')
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const formatTime = (iso) => {
    if (!iso) return 'Never logged in'
    const d = new Date(iso)
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: '"Inter",system-ui,sans-serif', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#f87171' }}>⛔ Inactive Today</h1>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
              {data.length} users not logged in today
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

        {!loading && !error && (
          data.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: '14px', padding: '40px 0', textAlign: 'center' }}>Everyone logged in today 🎉</div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '14px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.25)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#f87171', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Level</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#f87171', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Position</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#f87171', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>User ID</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#f87171', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Name</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#f87171', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Phone No</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#f87171', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Last Inactive</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((u, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{u.level}</td>
                      <td style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: 700 }}>{u.level_role}</td>
                      <td style={{ padding: '14px 16px', color: '#f87171', fontFamily: 'monospace' }}>{u.id || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#f8fafc' }}>{u.name || 'Unknown'}</td>
                      <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{u.phone || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#f87171', fontWeight: 700 }}>{formatTime(u.last_login)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

      </div>
    </div>
  )
}