import { useState, useEffect } from 'react'
import { getAllChallans } from '../services/api.js'
import './StatisticsView.css'

export default function StatisticsView() {
  const [loading, setLoading] = useState(true)
  const [isReset, setIsReset] = useState(false)
  const [stats, setStats] = useState({
    totalChallans: 0,
    totalRevenue: 0,
    unpaidCount: 0,
    recentCount: 0
  })

  useEffect(() => {
    if (isReset) return
    getAllChallans().then(data => {
      const unpaid = data.filter(c => c.status?.toLowerCase() !== 'paid')
      const rev = data.reduce((sum, c) => sum + (Number(c.amount) || 0), 0)
      setStats({
        totalChallans: data.length,
        totalRevenue: rev,
        unpaidCount: unpaid.length,
        recentCount: data.length > 5 ? 5 : data.length
      })
      setLoading(false)
    })
  }, [isReset])

  const handleReset = () => {
    setIsReset(true)
    setStats({ totalChallans: 0, totalRevenue: 0, unpaidCount: 0, recentCount: 0 })
  }

  return (
    <div className="stats-view fade-in-up">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>📊 Global Statistics</h2>
          <p>Overview of system-wide enforcement metrics</p>
        </div>
        <button onClick={handleReset} style={{
          background: 'transparent',
          border: '1px solid rgba(255,100,100,0.4)',
          color: '#f87171',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.85rem',
          transition: 'all 0.2s'
        }}>
          🔄 Reset Stats
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Aggregating data...</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card blue-glow">
             <div className="stat-icon">📋</div>
             <div className="stat-info">
               <h3>{stats.totalChallans}</h3>
               <p>Total Challans Issued</p>
             </div>
          </div>
          
          <div className="stat-card green-glow">
             <div className="stat-icon">💰</div>
             <div className="stat-info">
               <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
               <p>Total Potential Revenue</p>
             </div>
          </div>
          
          <div className="stat-card red-glow">
             <div className="stat-icon">🚨</div>
             <div className="stat-info">
               <h3>{stats.unpaidCount}</h3>
               <p>Active Unpaid Challans</p>
             </div>
          </div>

          <div className="stat-card purple-glow">
             <div className="stat-icon">⚡</div>
             <div className="stat-info">
               <h3>{stats.recentCount}</h3>
               <p>Violations Today</p>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}

