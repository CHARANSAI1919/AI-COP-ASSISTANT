import { useState, useEffect } from 'react'
import { getAllChallans } from '../services/api.js'
import './AllChallansView.css'

export default function AllChallansView() {
  const [challans, setChallans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllChallans().then(data => {
      setChallans(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="all-challans-view fade-in-up">
      <div className="view-header">
        <h2>📋 All Issued Challans</h2>
        <p>Recent traffic violations and penalty tickets</p>
      </div>
      
      {loading ? (
        <div className="loading-state">Loading records...</div>
      ) : (
        <div className="table-container">
          <table className="challans-table">
            <thead>
              <tr>
                <th>Challan ID</th>
                <th>Vehicle</th>
                <th>Violation</th>
                <th>Amount</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {challans.map(c => (
                <tr key={c.id}>
                  <td className="font-mono">{c.id}</td>
                  <td className="font-mono"><strong>{c.vehicle}</strong></td>
                  <td className="capitalize">{c.violation}</td>
                  <td className="amount-cell">₹{c.amount}</td>
                  <td>{c.datetime}</td>
                  <td>
                    <span className={`status-badge ${c.status?.toLowerCase() === 'paid' ? 'status-paid' : 'status-unpaid'}`}>
                      {c.status || 'Unpaid'}
                    </span>
                  </td>
                </tr>
              ))}
              {challans.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-state">No challans found in the database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
