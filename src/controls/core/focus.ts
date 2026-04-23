import { useEffect, useRef } from 'react'

export const useFocusBridge = (focusId: string | null) => {
  const prev = useRef<string | null>(null)
  const map = useRef(new Map<string, HTMLElement>())
  useEffect(() => {
    if (focusId === prev.current) return
    prev.current = focusId
    if (focusId) map.current.get(focusId)?.focus()
  }, [focusId])
  return (id: string) => (el: HTMLElement | null) => {
    if (el) map.current.set(id, el)
    else map.current.delete(id)
  }
}
