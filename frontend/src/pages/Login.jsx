import { useState } from 'react'
import './Login.css'

let DEMO_CREDENTIALS = [
  { badge: 'COP001', pin: '1234', name: 'Officer Sharma', rank: 'Sub-Inspector', station: 'Koramangala Traffic PS' },
  { badge: 'COP002', pin: '5678', name: 'Officer Priya', rank: 'Inspector', station: 'MG Road Traffic PS' },
]

export default function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false)
  
  // Form fields
  const [badge, setBadge] = useState('')
  const [pin, setPin] = useState('')
  const [name, setName] = useState('')
  const [rank, setRank] = useState('Sub-Inspector')
  const [station, setStation] = useState('')
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      if (isRegistering) {
        // Registration Logic
        if (DEMO_CREDENTIALS.some(c => c.badge === badge)) {
          setError('Badge number is already registered.')
          setLoading(false)
          return
        }
        if (!name.trim() || !station.trim()) {
          setError('Please fill out all required fields.')
          setLoading(false)
          return
        }
        
        const newOfficer = { badge, pin, name, rank, station }
        DEMO_CREDENTIALS.push(newOfficer) // Save locally for current session
        onLogin(newOfficer) // Auto-login after register
      } else {
        // Login Logic
        const officer = DEMO_CREDENTIALS.find(c => c.badge === badge && c.pin === pin)
        if (officer) {
          onLogin(officer)
        } else {
          setError('Invalid badge number or PIN. Try COP001 / 1234')
          setLoading(false)
        }
      }
    }, 800)
  }

  return (
    <div className="login-bg">
      <div className="login-grid" />
      <div className="login-container fade-in-up" style={isRegistering ? { maxWidth: '500px' } : {}}>
        <div className="login-badge">
          <div className="badge-icon">🚔</div>
          <div>
            <span className="badge-title">AI COP ASSISTANT</span>
            <span className="badge-sub">Smart Traffic Enforcement</span>
          </div>
        </div>

        <div className="login-card">
          <h1 className="login-heading">{isRegistering ? 'Officer Registration' : 'Officer Login'}</h1>
          <p className="login-sub">
            {isRegistering ? 'Enroll your credentials into the system' : 'Authenticate with your badge number and PIN'}
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            {isRegistering && (
              <>
                <div className="field">
                  <label>Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul Verma" required />
                </div>
                <div className="field">
                  <label>Rank</label>
                  <select value={rank} onChange={e => setRank(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <option value="Constable">Constable</option>
                    <option value="Head Constable">Head Constable</option>
                    <option value="Assistant Sub-Inspector">Assistant Sub-Inspector</option>
                    <option value="Sub-Inspector">Sub-Inspector (SI)</option>
                    <option value="Inspector">Inspector</option>
                    <option value="ACP">ACP / DSP</option>
                  </select>
                </div>
                <div className="field">
                  <label>Assigned Station</label>
                  <input type="text" value={station} onChange={e => setStation(e.target.value)} placeholder="e.g. Central Traffic PS" required />
                </div>
              </>
            )}

            <div className="field">
              <label>Badge Number</label>
              <input type="text" value={badge} onChange={e => setBadge(e.target.value.toUpperCase())} placeholder="e.g. COP001" required />
            </div>
            
            <div className="field">
              <label>PIN Code</label>
              <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="4-digit secure PIN" required />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : (isRegistering ? '📝 Register Officer' : '🔐 Login')}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
            {isRegistering ? (
              <span style={{ color: '#94a3b8' }}>
                Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsRegistering(false); setError(''); }} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Login here</a>
              </span>
            ) : (
              <span style={{ color: '#94a3b8' }}>
                New officer? <a href="#" onClick={(e) => { e.preventDefault(); setIsRegistering(true); setError(''); }} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Register here</a>
              </span>
            )}
          </div>

          {!isRegistering && (
            <div className="login-hint">
              <strong>Demo:</strong> Badge <code>COP001</code> PIN <code>1234</code>
            </div>
          )}
        </div>

        <p className="login-footer">© 2026 AI Cop Assistant | Smart City Initiative</p>
      </div>
    </div>
  )
}
