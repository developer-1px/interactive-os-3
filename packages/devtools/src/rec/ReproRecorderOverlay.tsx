/* eslint-disable no-restricted-syntax -- devtools overlay: 인스펙터 외부 fixed-position UI */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { createReproRecorder } from './createReproRecorder'

const styles = {
  button: {
    position: 'fixed' as const,
    top: 8,
    right: 8,
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center' as const,
    gap: 4,
    padding: '4px 12px',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    fontFamily: 'var(--font-sans, system-ui, sans-serif)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    background: 'rgba(30,30,30,0.85)',
    color: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(8px)',
  },
  active: {
    background: '#ef4444',
    color: '#fff',
    borderColor: '#ef4444',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'currentColor',
  },
  timer: {
    fontSize: 10,
    opacity: 0.8,
    fontVariantNumeric: 'tabular-nums' as const,
  },
} as const

const activeStyle = { ...styles.button, ...styles.active }
const pulsingDot = { ...styles.dot, animation: 'repro-pulse 1s infinite' }

export function ReproRecorderOverlay() {
  const recorder = useMemo(() => createReproRecorder(), [])
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const startTimeRef = useRef(0)

  const toggle = useCallback(() => {
    if (recording) {
      const data = recorder.stop()
      setRecording(false)
      clearInterval(intervalRef.current)
      setElapsed(0)
      navigator.clipboard.writeText(data.text).then(() => {
        console.log(
          '%c■ REC STOP %c %d events — copied to clipboard (LLM-readable text)',
          'background:#ef4444;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold',
          '',
          data.meta.eventCount,
        )
        console.log(data.text)
      })
    } else {
      recorder.start()
      setRecording(true)
      startTimeRef.current = Date.now()
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
      console.log(
        '%c● REC %c Recording started — reproduce the bug, then press Cmd+Shift+\\ or click STOP',
        'background:#ef4444;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold',
        'color:#ef4444',
      )
    }
  }, [recording, recorder])

  // Global keyboard shortcut: Cmd+Shift+Backslash
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === '\\') {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [toggle])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (!recording) return null

  return (
    <button
      onClick={toggle}
      style={activeStyle}
      title="Cmd+Shift+\ to stop recording"
    >
      <span style={pulsingDot} />
      STOP
      <span style={styles.timer}>{formatTime(elapsed)}</span>
      <style>{`@keyframes repro-pulse { 0%,100% { opacity:1 } 50% { opacity:0.3 } }`}</style>
    </button>
  )
}
