import { useState, useRef, useEffect } from 'react'
import VoiceInput from '../components/VoiceInput.jsx'
import CommandLog from '../components/CommandLog.jsx'
import VehicleCard from '../components/VehicleCard.jsx'
import ChallanCard from '../components/ChallanCard.jsx'
import PaymentModal from '../components/PaymentModal.jsx'
import AllChallansView from '../components/AllChallansView.jsx'
import VehicleLookupView from '../components/VehicleLookupView.jsx'
import StatisticsView from '../components/StatisticsView.jsx'
import { processCommand } from '../services/api.js'
import './Dashboard.css'

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('voice')
  const [commandLog, setCommandLog] = useState([])
  const [vehicleData, setVehicleData] = useState(null)
  const [challanData, setChallanData] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [stats, setStats] = useState({ challansToday: 3, vehiclesChecked: 12, totalFines: 4500 })

  const addLog = (entry) => {
    setCommandLog(prev => [{ id: Date.now(), ...entry }, ...prev])
  }

  const handleCommand = async (text) => {
    if (!text.trim()) return
    addLog({ type: 'user', text })
    setIsProcessing(true)
    setVehicleData(null)
    setChallanData(null)

    try {
      const result = await processCommand(text)

      if (result.intent === 'check_vehicle') {
        setVehicleData(result.vehicle)
        addLog({ type: 'system', text: `✅ Vehicle found: ${result.vehicle.owner} — ${result.vehicle.plate}` })
      } else if (result.intent === 'issue_challan') {
        setVehicleData(result.vehicle)
        setChallanData(result.challan)
        setStats(s => ({
          challansToday: s.challansToday + 1,
          vehiclesChecked: s.vehiclesChecked + 1,
          totalFines: s.totalFines + result.challan.amount,
        }))
        addLog({ type: 'alert', text: `🚨 Challan issued to ${result.vehicle.owner} — ₹${result.challan.amount} for ${result.challan.violation}` })
        // Auto-open payment after 1 second
        setTimeout(() => setShowPayment(true), 1000)
      } else if (result.intent === 'help') {
        addLog({ type: 'system', text: '💡 You can say: "Issue challan to MH12AB1234 for jumping red light" or "Check vehicle TN09CD5678"' })
      } else {
        addLog({ type: 'system', text: `ℹ️ ${result.message || 'Command processed.'}` })
      }
    } catch (err) {
      addLog({ type: 'error', text: `⚠️ Error processing command: ${err.message}` })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">🚔</span>
          <div>
            <span className="logo-name">AI COP</span>
            <span className="logo-tagline">Assistant</span>
          </div>
        </div>

        <div className="officer-profile">
          <div className="officer-avatar">{user.name.charAt(0)}</div>
          <div className="officer-info">
            <span className="officer-name">{user.name}</span>
            <span className="officer-rank">{user.rank}</span>
            <span className="officer-station">{user.station}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a className={`nav-item ${activeTab === 'voice' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveTab('voice') }}>🎙 Voice Command</a>
          <a className={`nav-item ${activeTab === 'challans' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveTab('challans') }}>📋 All Challans</a>
          <a className={`nav-item ${activeTab === 'vehicle' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveTab('vehicle') }}>🚗 Vehicle Lookup</a>
          <a className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveTab('stats') }}>📊 Statistics</a>
        </nav>

        <div className="sidebar-stats">
          <div className="stat-item">
            <span className="stat-val">{stats.challansToday}</span>
            <span className="stat-lbl">Challans Today</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">{stats.vehiclesChecked}</span>
            <span className="stat-lbl">Vehicles Checked</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">₹{stats.totalFines.toLocaleString()}</span>
            <span className="stat-lbl">Total Fines</span>
          </div>
        </div>

        <div style={{ padding: '0 24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            className="logout-btn" 
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={() => setStats({ challansToday: 0, vehiclesChecked: 0, totalFines: 0 })}
          >
            🔄 Reset Stats
          </button>
          <button className="logout-btn" onClick={onLogout}>← Logout</button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="dashboard-main">
        {activeTab === 'voice' && (
          <>
            {/* Top bar */}
            <div className="topbar">
              <div>
                <h1 className="topbar-title">Command Center</h1>
                <p className="topbar-sub">Speak or type a traffic enforcement command</p>
              </div>
              <div className="topbar-badge">
                <span className="live-dot" />
                LIVE
              </div>
            </div>

            {/* Voice Input */}
            <VoiceInput onCommand={handleCommand} isProcessing={isProcessing} />

            {/* Results Grid */}
            <div className="results-grid">
              {vehicleData && <VehicleCard vehicle={vehicleData} />}
              {challanData && (
                <ChallanCard
                  challan={challanData}
                  vehicle={vehicleData}
                  onPayNow={() => setShowPayment(true)}
                />
              )}
            </div>

            {/* Command Log */}
            <CommandLog logs={commandLog} />
          </>
        )}

        {activeTab === 'challans' && <AllChallansView />}
        {activeTab === 'vehicle' && <VehicleLookupView />}
        {activeTab === 'stats' && <StatisticsView />}
      </main>

      {/* Payment Modal */}
      {showPayment && challanData && (
        <PaymentModal
          challan={challanData}
          vehicle={vehicleData}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  )
}
