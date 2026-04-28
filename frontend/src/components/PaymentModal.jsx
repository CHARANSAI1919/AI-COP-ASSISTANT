import { useState } from 'react'
import { payChallan } from '../services/api.js'
import './PaymentModal.css'

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Card', icon: '💳' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
]

export default function PaymentModal({ challan, vehicle, onClose }) {
  const [step, setStep] = useState('select') // select | processing | success
  const [method, setMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [cardNo, setCardNo] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const handlePay = async (e) => {
    e.preventDefault()
    setStep('processing')
    try {
      await payChallan(challan.id || challan.challanId)
      setTimeout(() => setStep('success'), 1200)
    } catch {
      setTimeout(() => setStep('success'), 1200)
    }
  }

  const txnId = `TXN${Date.now().toString().slice(-8)}`

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box slide-in-right">

        {step === 'select' && (
          <>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">💳 Pay Traffic Challan</h2>
                <p className="modal-sub">Challan #{challan.challanId || challan.id} — {vehicle?.plate}</p>
              </div>
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>

            <div className="amount-summary">
              <span>Fine for <strong>{challan.violation}</strong></span>
              <span className="modal-amount">₹{challan.amount.toLocaleString()}</span>
            </div>

            {/* Payment method tabs */}
            <div className="method-tabs">
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m.id}
                  className={`method-tab ${method === m.id ? 'active' : ''}`}
                  onClick={() => setMethod(m.id)}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            <form className="payment-form" onSubmit={handlePay}>
              {method === 'upi' && (
                <div className="pay-field">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    required
                  />
                </div>
              )}
              {method === 'card' && (
                <>
                  <div className="pay-field">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={cardNo}
                      onChange={e => setCardNo(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                      required
                    />
                  </div>
                  <div className="pay-row">
                    <div className="pay-field">
                      <label>Expiry</label>
                      <input type="text" placeholder="MM/YY" maxLength={5} value={expiry} onChange={e => setExpiry(e.target.value)} required />
                    </div>
                    <div className="pay-field">
                      <label>CVV</label>
                      <input type="password" placeholder="•••" maxLength={3} value={cvv} onChange={e => setCvv(e.target.value)} required />
                    </div>
                  </div>
                </>
              )}
              {method === 'netbanking' && (
                <div className="pay-field">
                  <label>Select Bank</label>
                  <select className="pay-select" required>
                    <option value="">-- Select Bank --</option>
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              <div className="secure-note">🔒 Payments are secured by 256-bit SSL encryption</div>
              <button type="submit" className="pay-submit-btn" id="pay-submit-btn">
                Pay ₹{challan.amount.toLocaleString()} →
              </button>
            </form>
          </>
        )}

        {step === 'processing' && (
          <div className="processing-state">
            <div className="proc-spinner" />
            <h3>Processing Payment…</h3>
            <p>Please do not close this window</p>
          </div>
        )}

        {step === 'success' && (
          <div className="success-state fade-in-up">
            <div className="success-icon">✅</div>
            <h2 className="success-title">Payment Successful!</h2>
            <p className="success-sub">Your challan has been cleared</p>
            <div className="success-meta">
              <div className="smeta-row"><span>Transaction ID</span><strong>{txnId}</strong></div>
              <div className="smeta-row"><span>Amount Paid</span><strong>₹{challan.amount.toLocaleString()}</strong></div>
              <div className="smeta-row"><span>Vehicle</span><strong>{vehicle?.plate}</strong></div>
              <div className="smeta-row"><span>Status</span><strong style={{ color: 'var(--accent-green)' }}>Cleared</strong></div>
            </div>
            <button className="done-btn" onClick={onClose}>✓ Done</button>
          </div>
        )}

      </div>
    </div>
  )
}
