import { useState } from 'react'
import { getVehicle } from '../services/api.js'
import VehicleCard from './VehicleCard.jsx'
import './VehicleLookupView.css'

export default function VehicleLookupView() {
  const [plate, setPlate] = useState('')
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!plate.trim()) return
    
    setLoading(true)
    setSearched(true)
    setVehicle(null)
    
    const result = await getVehicle(plate.toUpperCase().replace(/\s+/g, ''))
    setVehicle(result)
    setLoading(false)
  }

  return (
    <div className="vehicle-lookup-view fade-in-up">
      <div className="view-header">
        <h2>🚗 Vehicle Lookup</h2>
        <p>Manually search the database using a license plate number</p>
      </div>

      <form onSubmit={handleSearch} className="lookup-form">
        <input 
          type="text" 
          className="lookup-input" 
          placeholder="Enter Plate No (e.g. MH12AB1234)"
          value={plate}
          onChange={e => setPlate(e.target.value.toUpperCase())}
        />
        <button type="submit" className="lookup-btn" disabled={loading || !plate.trim()}>
          {loading ? 'Searching...' : '🔍 Search'}
        </button>
      </form>

      <div className="lookup-results">
        {loading && <div className="loading-state">Querying database...</div>}
        
        {!loading && vehicle && (
          <div className="fade-in-up">
            <VehicleCard vehicle={vehicle} />
          </div>
        )}
        
        {!loading && searched && !vehicle && (
          <div className="not-found-state fade-in-up">
            <div className="not-found-icon">⚠️</div>
            <h3>Vehicle Not Found</h3>
            <p>No records match the requested license plate "{plate}".</p>
          </div>
        )}
      </div>
    </div>
  )
}
