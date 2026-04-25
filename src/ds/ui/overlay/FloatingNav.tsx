import { Link, useRouter } from '@tanstack/react-router'
import { useId, useMemo } from 'react'
import { Popover } from './Popover'

interface RouteEntry {
  id: string
  label: string
  to: string
  params?: Record<string, string>
}

const iconOf = (label: string): string => {
  const tail = label.includes('·') ? label.split('·').pop()!.trim() : label
  const ch = [...tail][0] ?? '?'
  return ch.toUpperCase()
}

// 우측 하단 floating 네비게이터 — native popover로 전체 라우트 grid 토글.
// CommandPalette와 같은 staticData.palette 소스를 공유하므로 새 라우트 자동 노출.
export function FloatingNav() {
  const router = useRouter()
  const popoverId = useId()
  const entries = useMemo<RouteEntry[]>(() => {
    const byId = (router as unknown as {
      routesById: Record<string, {
        id: string
        options?: { staticData?: { palette?: { label: string; to: string; params?: Record<string, string> } } }
      }>
    }).routesById ?? {}
    return Object.values(byId)
      .map((r) => {
        const p = r.options?.staticData?.palette
        return p ? { id: r.id, label: p.label, to: p.to, params: p.params } : null
      })
      .filter((x): x is RouteEntry => x !== null)
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [router])

  return (
    <aside aria-roledescription="floating-nav">
      <button type="button" popovertarget={popoverId} aria-label="Navigator">⊞</button>
      <Popover id={popoverId} label="Routes" scrim>
        <menu aria-roledescription="route-grid">
          {entries.map((e) => (
            <li key={e.id}>
              <Link
                to={e.to}
                params={e.params as never}
                aria-label={e.label}
                onClick={() => document.getElementById(popoverId)?.hidePopover?.()}
              >
                <figure aria-hidden="true">{iconOf(e.label)}</figure>
                <strong>{e.label}</strong>
              </Link>
            </li>
          ))}
        </menu>
      </Popover>
    </aside>
  )
}
