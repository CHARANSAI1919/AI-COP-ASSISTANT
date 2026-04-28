import './ChallanCard.css'

export default function ChallanCard({ challan, vehicle, onPayNow }) {
  return (
    <div className="card challan-card slide-in-right">
      <div className="card-header challan-header">
        <span className="card-icon">📋</span>
        <span className="card-title">Challan Issued</span>
        <span className="challan-id">#{challan.id}</span>
      </div>
      <div className="card-body">
        <div className="challan-amount">
          <span className="amount-label">Fine Amount</span>
          <span className="amount-value">₹{challan.amount.toLocaleString()}</span>
        </div>
        <div className="detail-grid" style={{ marginTop: '16px' }}>
          <div className="detail-item">
            <span className="detail-label">Violation</span>
            <span className="detail-value violation-tag">{challan.violation}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Date &amp; Time</span>
            <span className="detail-value">{challan.datetime}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Location</span>
            <span className="detail-value">{challan.location}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Issuing Officer</span>
            <span className="detail-value">{challan.officer}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Due Date</span>
            <span className="detail-value due-date">{challan.dueDate}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className="detail-value status-badge status-red">Unpaid</span>
          </div>
        </div>

        <button id="pay-now-btn" className="pay-now-btn" onClick={onPayNow}>
          💳 Pay Now
        </button>
      </div>
    </div>
  )
}
