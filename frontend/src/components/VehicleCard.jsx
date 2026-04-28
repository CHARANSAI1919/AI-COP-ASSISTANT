import './VehicleCard.css'

export default function VehicleCard({ vehicle }) {
  const statusColor = vehicle.status === 'Valid' ? 'green' : 'red'
  return (
    <div className="card vehicle-card fade-in-up">
      <div className="card-header">
        <span className="card-icon">🚗</span>
        <span className="card-title">Vehicle Details</span>
        <span className={`status-badge status-${statusColor}`}>{vehicle.status}</span>
      </div>
      <div className="card-body">
        <div className="plate-display">{vehicle.plate}</div>
        <div className="detail-grid">
          <Detail label="Owner" value={vehicle.owner} />
          <Detail label="Vehicle Type" value={vehicle.type} />
          <Detail label="Model" value={vehicle.model} />
          <Detail label="Color" value={vehicle.color} />
          <Detail label="State" value={vehicle.state} />
          <Detail label="RC Valid Until" value={vehicle.rcExpiry} />
          <Detail label="Insurance" value={vehicle.insurance} />
          <Detail label="Challans" value={vehicle.challanCount} />
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  )
}
