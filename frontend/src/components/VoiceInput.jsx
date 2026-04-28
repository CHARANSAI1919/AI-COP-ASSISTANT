import { useState, useRef, useEffect } from 'react'
import './VoiceInput.css'

export default function VoiceInput({ onCommand, isProcessing }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [text, setText] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-IN'

    recognition.onresult = (e) => {
      let interim = ''
      let final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript
        else interim += e.results[i][0].transcript
      }
      setTranscript(interim || final)
      if (final) {
        setText(final)
        setTranscript('')
      }
    }

    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      return
    }
    setText('')
    setTranscript('')
    try {
      recognitionRef.current?.start()
      setIsListening(true)
    } catch (e) { /* already started */ }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const cmd = text.trim()
    if (cmd) {
      onCommand(cmd)
      setText('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="voice-panel">
      {/* Mic Button */}
      <div className="mic-wrap">
        <button
          id="mic-btn"
          className={`mic-btn ${isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`}
          onClick={toggleListening}
          disabled={isProcessing}
          title={isListening ? 'Stop listening' : 'Start voice command'}
        >
          {isProcessing ? (
            <span className="process-spin" />
          ) : isListening ? (
            <span className="mic-waves">
              {[1,2,3,4,5].map(i => <span key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />)}
            </span>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
          )}
        </button>
        <span className="mic-label">
          {isProcessing ? 'Processing...' : isListening ? 'Listening… speak now' : 'Tap to speak'}
        </span>
      </div>

      {/* Live Transcript */}
      {(transcript || isListening) && (
        <div className="interim-transcript">
          <span className="transcript-dot" />
          {transcript || 'Waiting for speech…'}
        </div>
      )}

      {/* Text Input */}
      <form className="text-input-row" onSubmit={handleSubmit}>
        <input
          id="command-input"
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Or type a command… e.g. "Issue challan to MH12AB1234 for jumping red light"'
          disabled={isProcessing}
        />
        <button id="send-btn" type="submit" className="send-btn" disabled={isProcessing || !text.trim()}>
          ➤ Send
        </button>
      </form>

      {/* Quick Commands */}
      <div className="quick-cmds">
        <span className="qc-label">Quick try:</span>
        {[
          'Check vehicle MH12AB1234',
          'Issue challan to TN09CD5678 for speeding',
          'Issue challan to MH12AB1234 for signal jump',
        ].map(cmd => (
          <button key={cmd} className="qc-btn" onClick={() => { setText(cmd) }} disabled={isProcessing}>
            {cmd}
          </button>
        ))}
      </div>
    </div>
  )
}
