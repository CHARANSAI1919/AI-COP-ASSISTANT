import './CommandLog.css'

export default function CommandLog({ logs }) {
  if (!logs.length) {
    return (
      <div className="log-empty">
        <span className="log-empty-icon">🎙</span>
        <p>Your command history will appear here. Try a voice or text command above.</p>
      </div>
    )
  }

  return (
    <div className="log-panel">
      <div className="log-header">
        <span className="log-title">📝 Command Log</span>
        <span className="log-count">{logs.length} entries</span>
      </div>
      <div className="log-list">
        {logs.map(entry => (
          <div key={entry.id} className={`log-entry log-${entry.type} fade-in-up`}>
            <span className="log-time">{new Date(entry.id).toLocaleTimeString()}</span>
            <span className="log-text">{entry.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
