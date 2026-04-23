import { useEffect, useRef } from 'react'
import { getLabel, type Event, type NormalizedData } from '../core/types'
import { enabledSiblings, type AxisHandler } from './index'

export function useTypeahead(
  d: NormalizedData,
  onEvent: (e: Event) => void,
): AxisHandler {
  const ref = useRef({ buf: '', timer: 0 })

  useEffect(() => {
    return () => window.clearTimeout(ref.current.timer)
  }, [])

  return (e, id) => {
    if (e.key.length !== 1 || !/\S/.test(e.key)) return false
    if (e.ctrlKey || e.metaKey || e.altKey) return false
    window.clearTimeout(ref.current.timer)
    ref.current.buf = (ref.current.buf + e.key).toLowerCase()
    const sibs = enabledSiblings(d, id)
    const match = sibs.find((sid) =>
      getLabel(d, sid).toLowerCase().startsWith(ref.current.buf),
    )
    if (match) onEvent({ type: 'navigate', id: match })
    ref.current.timer = window.setTimeout(() => {
      ref.current.buf = ''
    }, 500)
    return Boolean(match)
  }
}
