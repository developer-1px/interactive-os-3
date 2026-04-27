import { useEffect, useRef } from 'react'

/**
 * focusId가 바뀔 때 해당 element에 .focus()를 위임하는 brige.
 *
 * 마운트 직후 1회는 호출하지 않는다 — autoFocus를 명시하지 않은 collection이
 * 페이지 진입만으로 사용자 포커스를 가로채는 것을 막기 위함.
 * tabIndex=0(roving) 덕분에 Tab으로 들어오면 정상 포커스되며, 사용자 조작
 * 이후의 focusId 변경(키보드/클릭 navigate)에만 .focus()가 발동한다.
 *
 * autoFocus=true를 넘기면 마운트 시 첫 focusId에도 .focus()가 발동한다 —
 * 다이얼로그/팝오버 등 진입과 동시에 포커스 이동이 의도된 곳에서만 사용.
 */
export const useFocusBridge = (focusId: string | null, autoFocus = false) => {
  const prev = useRef<string | null>(null)
  const mounted = useRef(false)
  const map = useRef(new Map<string, HTMLElement>())
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      prev.current = focusId
      if (autoFocus && focusId) map.current.get(focusId)?.focus()
      return
    }
    if (focusId === prev.current) return
    prev.current = focusId
    if (focusId) map.current.get(focusId)?.focus()
  }, [focusId, autoFocus])
  return (id: string) => (el: HTMLElement | null) => {
    if (el) map.current.set(id, el)
    else map.current.delete(id)
  }
}
