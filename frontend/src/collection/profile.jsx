import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function capitalize(str) {
  if (!str) return '—'
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const bg = '#FDF5EE'
const maroon = '#8B1A1A'

const sectionStyle = {
  background: '#fff', borderRadius: 16, border: '1px solid #f0e8e0',
  padding: '24px 28px', marginBottom: 20,
  boxShadow: '0 2px 12px rgba(139,26,26,0.04)',
}
const sectionTitleStyle = {
  fontSize: 13, fontWeight: 700, color: maroon, letterSpacing: '1px',
  textTransform: 'uppercase', marginBottom: 18,
  fontFamily: '"Playfair Display", Georgia, serif',
}
const labelStyle = {
  fontSize: 11, color: '#9ca3af', fontFamily: '"Montserrat", sans-serif',
  letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4,
}
const valueStyle = {
  fontSize: 15, color: '#1f2937',
  fontFamily: '"Montserrat", sans-serif', fontWeight: 600,
}

function Field({ label, value }) {
  return (
    <div style={{ minWidth: 160, marginBottom: 16 }}>
      <div style={labelStyle}>{label}</div>
      <div style={valueStyle}>{value || '—'}</div>
    </div>
  )
}

// Fields editable in the request table — matches backend ProfileUpdateApproveView field list
const PROFILE_FIELDS = [
  ['initial', 'Initial'],
  ['first_name', 'First Name'],
  ['last_name', 'Last Name'],
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
  ['occupation', 'Occupation'],
  ['occupation_detail', 'Occupation Detail'],
  ['annual_salary', 'Annual Salary'],
]

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [slow, setSlow] = useState(false)

  const [showEdit, setShowEdit] = useState(false)
  const [updateForm, setUpdateForm] = useState({})
  const [updateMessage, setUpdateMessage] = useState('')
  const [proofDocument, setProofDocument] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  const fetchProfile = async () => {
    setLoading(true)
    setError('')
    setSlow(false)
    const slowTimer = setTimeout(() => setSlow(true), 5000)
    try {
      const res = await api.get('/dashboard/', { timeout: 25000 })
      setProfile(res.data)
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login')
      } else {
        setError('Profile load aaga la — backend start aaguthu, konjam wait pannitu retry pannunga.')
      }
    } finally {
      clearTimeout(slowTimer)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [navigate])

  const openEdit = () => {
    const next = {}
    PROFILE_FIELDS.forEach(([key]) => {
      next[key] = profile?.[key] || ''
    })
    setUpdateForm(next)
    setUpdateMessage('')
    setProofDocument(null)
    setSubmitMsg('')
    setShowEdit(true)
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
      setSubmitMsg('❌ Please enter message / reason')
      return
    }
    if (!proofDocument) {
      setSubmitMsg('❌ Please upload document proof')
      return
    }

    const fd = new FormData()
    PROFILE_FIELDS.forEach(([key]) => {
      if (updateForm[key] !== null && updateForm[key] !== undefined) {
        fd.append(key, updateForm[key])
      }
    })
    fd.append('message', updateMessage)
    fd.append('proof_document', proofDocument)

    setSubmitting(true)
    try {
      await api.post('/profile-update-request/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSubmitMsg('✅ Request submitted! Super Admin approve panna unga profile update aagum.')
      setTimeout(() => setShowEdit(false), 1800)
    } catch (err) {
      setSubmitMsg('❌ Error: ' + JSON.stringify(err.response?.data || err.message))
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: maroon, fontFamily: '"Playfair Display", Georgia, serif', fontSize: 16, marginBottom: 8 }}>
            Loading profile...
          </div>
          {slow && (
            <div style={{ color: '#9ca3af', fontSize: 12, fontFamily: '"Montserrat", sans-serif' }}>
              Server start aaguthu, 30 sec varaikum aagalam...
            </div>
          )}
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#b91c1c', marginBottom: 12, fontFamily: '"Montserrat", sans-serif', fontSize: 14 }}>{error}</div>
          <button onClick={fetchProfile} style={{ background: maroon, color: '#fff', border: 'none', borderRadius: 20, padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: '"Montserrat", sans-serif' }}>
            🔄 Retry
          </button>
        </div>
      </div>
    )
  }
  if (!profile) return null

  const fullName = `${profile.initial ? profile.initial + ' ' : ''}${profile.first_name || ''} ${profile.last_name || ''}`.trim()
  const initials = `${(profile.first_name || ' ')[0] || ''}${(profile.last_name || ' ')[0] || ''}`.toUpperCase()

  const inputStyle = {
    width: '100%', background: '#fdf8f4', border: '1px solid #e8ddd5',
    borderRadius: 9, padding: '10px 12px', color: '#1f2937',
    outline: 'none', boxSizing: 'border-box', fontFamily: '"Montserrat", sans-serif', fontSize: 13,
  }

  return (
    <div style={{ minHeight: '100vh', background: bg }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '32px 20px 60px' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@400;500;600;700&display=swap');`}</style>

        <div style={{
          background: 'linear-gradient(120deg,#8B1A1A,#b8860b)', borderRadius: 18,
          padding: '32px 28px', display: 'flex', alignItems: 'center', gap: 20,
          marginBottom: 24, color: '#fff', boxShadow: '0 8px 24px rgba(139,26,26,0.25)',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 26, fontWeight: 700,
            fontFamily: '"Playfair Display", Georgia, serif', flexShrink: 0,
          }}>{initials || '👤'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '0.3px' }}>
              {fullName || 'Customer'}
            </div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4, fontFamily: '"Montserrat", sans-serif' }}>
              {profile.email}
            </div>
            {profile.customer_id && (
              <div style={{
                display: 'inline-block', marginTop: 10, background: 'rgba(255,255,255,0.18)',
                padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                letterSpacing: '0.5px', fontFamily: '"Montserrat", sans-serif',
              }}>ID: {profile.customer_id}</div>
            )}
          </div>
          <button
            onClick={openEdit}
            style={{
              background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.45)',
              color: '#fff', borderRadius: 20, padding: '9px 20px', fontWeight: 700,
              fontSize: 13, cursor: 'pointer', fontFamily: '"Montserrat", sans-serif',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >✎ Edit Profile</button>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Personal Information</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            <Field label="Mobile Number" value={profile.mobile_number} />
            <Field label="Gender" value={capitalize(profile.gender)} />
            <Field label="Date of Birth" value={formatDate(profile.dob)} />
            <Field label="Marital Status" value={capitalize(profile.married_status)} />
            {profile.married_status === 'married' && (
              <Field label="Anniversary Date" value={formatDate(profile.anniversary_date)} />
            )}
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Address</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            <Field label="Door No" value={profile.door_no} />
            <Field label="Street" value={profile.street_name} />
            <Field label="Town" value={profile.town_name} />
            <Field label="City" value={profile.city_name} />
            <Field label="District" value={profile.district} />
            <Field label="State" value={profile.state} />
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Identity & Occupation</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            <Field label="Aadhaar No" value={profile.aadhaar_no} />
            <Field label="PAN No" value={profile.pan_no} />
            <Field label="Occupation" value={capitalize(profile.occupation)} />
            <Field label="Occupation Detail" value={profile.occupation_detail} />
            <Field label="Annual Salary" value={profile.annual_salary ? `₹ ${profile.annual_salary}` : '—'} />
          </div>
        </div>

        {profile.promotor_name && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Referred By</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <Field label="Promotor Name" value={profile.promotor_name} />
              <Field label="Promotor ID" value={profile.promotor_id} />
              <Field label="Promotor Contact" value={profile.promotor_contact_no} />
            </div>
          </div>
        )}

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Account</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            <Field label="Member Since" value={formatDate(profile.created_at)} />
            <Field label="Role" value={capitalize(profile.role)} />
          </div>
        </div>
      </div>

      {/* ── PROFILE UPDATE REQUEST POPUP ── */}
      {showEdit && (
        <div onClick={() => setShowEdit(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <form onSubmit={submitProfileUpdate} onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 20, width: '100%', maxWidth: 880, maxHeight: '88vh',
            overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '20px 26px', borderBottom: '1px solid #f0e8e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: maroon, fontWeight: 800, fontSize: 16, fontFamily: '"Playfair Display", Georgia, serif' }}>✎ Profile Update Request</div>
                <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 4, fontFamily: '"Montserrat", sans-serif' }}>
                  Existing details compare pannitu correct details enter pannunga
                </div>
              </div>
              <button type="button" onClick={() => setShowEdit(false)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontFamily: '"Montserrat", sans-serif', fontSize: 13 }}>✕ Close</button>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '20px 26px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(184,134,11,0.07)' }}>
                    {['Existing Details Description', 'Existing Details', 'Details To Updated'].map(h => (
                      <th key={h} style={{ padding: 12, color: maroon, textAlign: 'left', border: '1px solid #f0e8e0', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: '"Montserrat", sans-serif' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PROFILE_FIELDS.map(([key, label]) => (
                    <tr key={key}>
                      <td style={{ padding: 12, border: '1px solid #f0e8e0', color: '#7c5c4a', fontWeight: 700, fontFamily: '"Montserrat", sans-serif' }}>{label}</td>
                      <td style={{ padding: 12, border: '1px solid #f0e8e0', color: '#1f2937', wordBreak: 'break-all', fontFamily: '"Montserrat", sans-serif' }}>
                        {profile?.[key] || '—'}
                      </td>
                      <td style={{ padding: 8, border: '1px solid #f0e8e0' }}>
                        {key === 'gender' ? (
                          <select name={key} value={updateForm[key] || 'male'} onChange={handleUpdateChange} style={inputStyle}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        ) : key === 'married_status' ? (
                          <select name={key} value={updateForm[key] || 'single'} onChange={handleUpdateChange} style={inputStyle}>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="other">Other</option>
                          </select>
                        ) : key === 'dob' ? (
                          <input type="date" name={key} value={updateForm[key] || ''} onChange={handleUpdateChange} style={inputStyle} />
                        ) : key === 'anniversary_date' ? (
                          updateForm.married_status === 'married' ? (
                            <input type="date" name={key} value={updateForm[key] || ''} onChange={handleUpdateChange} style={inputStyle} />
                          ) : (
                            <span style={{ color: '#9ca3af', fontSize: 12, fontFamily: '"Montserrat", sans-serif' }}>Only married select panna show aagum</span>
                          )
                        ) : (
                          <input name={key} value={updateForm[key] || ''} onChange={handleUpdateChange} style={inputStyle} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: 18 }}>
                <label style={{ display: 'block', color: '#7c5c4a', fontSize: 12, marginBottom: 8, fontWeight: 700, fontFamily: '"Montserrat", sans-serif' }}>
                  Message / Reason
                </label>
                <textarea
                  value={updateMessage}
                  onChange={e => setUpdateMessage(e.target.value)}
                  placeholder="Example: My mobile number is wrong, please update it..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={{ display: 'block', color: '#7c5c4a', fontSize: 12, marginBottom: 8, fontWeight: 700, fontFamily: '"Montserrat", sans-serif' }}>
                  Upload Proof Document
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={e => setProofDocument(e.target.files[0])}
                  style={inputStyle}
                />
                {proofDocument && (
                  <div style={{ color: '#16a34a', fontSize: 12, marginTop: 8, fontFamily: '"Montserrat", sans-serif' }}>
                    ✅ Selected: {proofDocument.name}
                  </div>
                )}
              </div>

              {submitMsg && (
                <div style={{
                  marginTop: 16, padding: '10px 14px', borderRadius: 10, fontSize: 13, fontFamily: '"Montserrat", sans-serif',
                  background: submitMsg.includes('✅') ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${submitMsg.includes('✅') ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.25)'}`,
                  color: submitMsg.includes('✅') ? '#16a34a' : '#dc2626',
                }}>{submitMsg}</div>
              )}
            </div>

            <div style={{ padding: '16px 26px', borderTop: '1px solid #f0e8e0', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button type="button" onClick={() => setShowEdit(false)} style={{ padding: '11px 22px', background: '#fdf8f4', border: '1px solid #e8ddd5', borderRadius: 12, color: '#7c5c4a', cursor: 'pointer', fontFamily: '"Montserrat", sans-serif', fontSize: 13 }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting} style={{
                padding: '11px 28px', background: submitting ? '#d1bfa3' : 'linear-gradient(90deg,#8B1A1A,#b8860b)',
                border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer',
                fontFamily: '"Montserrat", sans-serif', fontSize: 13,
              }}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}