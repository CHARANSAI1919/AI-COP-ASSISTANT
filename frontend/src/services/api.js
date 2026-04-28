/**
 * API Service Layer
 * Sends voice/text command to Spring Boot backend → Spring Boot calls Python NLP service
 * Falls back to local smart NLP if backend is offline (enables offline demo)
 */

import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'

// ─── Mock vehicle database (mirrors MongoDB data) ───
const MOCK_VEHICLES = {
  'MH12AB1234': {
    plate: 'MH12AB1234',
    owner: 'Rajesh Kumar',
    type: 'Car',
    model: 'Honda City',
    color: 'White',
    state: 'Maharashtra',
    rcExpiry: '2026-08-15',
    insurance: 'Valid till 2026-12-01',
    challanCount: '2 previous',
    status: 'Valid',
  },
  'TN09CD5678': {
    plate: 'TN09CD5678',
    owner: 'Anita Sharma',
    type: 'Motorcycle',
    model: 'Bajaj Pulsar',
    color: 'Black',
    state: 'Tamil Nadu',
    rcExpiry: '2025-03-10',
    insurance: 'EXPIRED',
    challanCount: '5 previous',
    status: 'Expired RC',
  },
  'KA03EF9012': {
    plate: 'KA03EF9012',
    owner: 'Suresh Patil',
    type: 'SUV',
    model: 'Mahindra Scorpio',
    color: 'Grey',
    state: 'Karnataka',
    rcExpiry: '2027-11-30',
    insurance: 'Valid till 2027-01-15',
    challanCount: '0 previous',
    status: 'Valid',
  },
}

const VIOLATION_FINES = {
  'red light': 1000,
  'signal jump': 1000,
  'over speeding': 2000,
  'speeding': 2000,
  'wrong side': 500,
  'no helmet': 500,
  'drunk driving': 10000,
  'triple riding': 1000,
  'no seatbelt': 500,
  'mobile phone': 1500,
  'no insurance': 2000,
  'expired rc': 1500,
}

// ─── Local NLP Parser (fallback if backend offline) ───
function localParseCommand(command) {
  const lower = command.toLowerCase()

  // Plate extraction  
  const plateMatch = lower.match(/\b([a-z]{2}\d{2}[a-z]{2}\d{4})\b/i) ||
                     command.match(/\b([A-Z]{2}\d{2}[A-Z]{2}\d{4})\b/)
  const plate = plateMatch ? plateMatch[1].toUpperCase() : null

  // Violation extraction
  let matchedViolation = null
  let matchedFine = 500
  for (const [violation, fine] of Object.entries(VIOLATION_FINES)) {
    if (lower.includes(violation)) {
      matchedViolation = violation
      matchedFine = fine
      break
    }
  }

  // Intent detection
  const isChallan = lower.includes('challan') || lower.includes('issue') || lower.includes('fine') || lower.includes('penalty')
  const isCheck = lower.includes('check') || lower.includes('lookup') || lower.includes('verify') || lower.includes('search') || lower.includes('details')
  const isHelp = lower.includes('help') || lower.includes('what can you') || lower.includes('commands')

  if (isHelp) return { intent: 'help' }

  const vehicle = plate
    ? MOCK_VEHICLES[plate] || {
        plate: plate.toUpperCase(),
        owner: 'Unknown Owner',
        type: 'Unknown',
        model: 'Unknown',
        color: 'Unknown',
        state: 'Unknown',
        rcExpiry: 'N/A',
        insurance: 'N/A',
        challanCount: '0 previous',
        status: 'Unknown',
      }
    : null

  if (!vehicle) {
    return { intent: 'unknown', message: `No license plate detected. Try: "Check vehicle MH12AB1234"` }
  }

  if (isChallan) {
    const now = new Date()
    const due = new Date(now)
    due.setDate(due.getDate() + 15)

    const challan = {
      id: `CH${Date.now().toString().slice(-6)}`,
      vehicle: vehicle.plate,
      violation: matchedViolation || 'traffic violation',
      amount: matchedViolation ? matchedFine : 500,
      datetime: now.toLocaleString('en-IN'),
      location: 'MG Road Junction, Bengaluru',
      officer: 'Officer on Duty',
      dueDate: due.toLocaleDateString('en-IN'),
    }

    return { intent: 'issue_challan', vehicle, challan }
  }

  if (isCheck) {
    return { intent: 'check_vehicle', vehicle }
  }

  // Default to check if plate was given
  return { intent: 'check_vehicle', vehicle }
}

// ─── Main API call ───
export async function processCommand(command) {
  try {
    const { data } = await axios.post(`${API_BASE}/command`, { command }, { timeout: 4000 })
    return data
  } catch {
    // Backend offline → use local parser to allow instant offline demo
    console.warn('[API] Backend offline — using local NLP fallback')
    return localParseCommand(command)
  }
}

export async function getVehicle(plate) {
  try {
    const { data } = await axios.get(`${API_BASE}/vehicles/${plate}`, { timeout: 4000 })
    return data
  } catch {
    return MOCK_VEHICLES[plate] || null
  }
}

const MOCK_CHALLANS = [
  { id: 'CH882190', vehicle: 'MH12AB1234', violation: 'jumping red light', amount: 1000, datetime: '25/03/2026, 10:30 am', location: 'MG Road Junction, Bengaluru', status: 'Unpaid', dueDate: '09/04/2026' },
  { id: 'CH912384', vehicle: 'TN09CD5678', violation: 'riding without helmet', amount: 500, datetime: '24/03/2026, 04:15 pm', location: 'Silk Board Junction, Bengaluru', status: 'Paid', dueDate: '08/04/2026' },
  { id: 'CH102938', vehicle: 'KA03EF9012', violation: 'over speeding', amount: 2000, datetime: '26/03/2026, 08:20 am', location: 'Hebbal Flyover, Bengaluru', status: 'Unpaid', dueDate: '10/04/2026' }
]

export async function getAllChallans() {
  try {
    const { data } = await axios.get(`${API_BASE}/challans`, { timeout: 4000 })
    return data
  } catch {
    return MOCK_CHALLANS
  }
}

export async function payChallan(id) {
  try {
    const { data } = await axios.post(`${API_BASE}/challans/${id}/pay`, {}, { timeout: 4000 })
    return data
  } catch {
    const challan = MOCK_CHALLANS.find(c => c.id === id || c.challanId === id)
    if (challan) challan.status = 'PAID'
    return { success: true }
  }
}
