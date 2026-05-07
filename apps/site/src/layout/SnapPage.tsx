import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'

/**
 * scroll-snap 컨테이너 + URL hash 양방향 동기화.
 *
 * URL → scroll: hashchange 시 `#<id>` 섹션으로 즉시 스크롤 + focus.
 * scroll → URL: IntersectionObserver 로 가장 많이 보이는 자식 [id] 섹션을
 * `history.replaceState` 로 hash 갱신. 첫 자식은 hash 비움.
 *
 * scrollend 대신 IO 를 쓰는 이유: Safari 17+ 가 되어야 scrollend 가 도는데
 * IO 는 모든 브라우저에서 동작하고 "스냅 정착 = root viewport 비율 최대"
 * 와 동치라 더 단순.
 */
export function SnapPage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useHashSync(ref)
  return (
    <div
      ref={ref}
      className="md:h-screen md:snap-y md:snap-mandatory md:overflow-y-scroll"
    >
      {children}
    </div>
  )
}

function useHashSync(ref: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const handle = (mount = false) => {
      const next = window.location.hash.slice(1)
      writeActive(next)
      if (!mount && suppressNextScroll) {
        suppressNextScroll = false
        return
      }
      const target = next ? document.getElementById(next) : null
      const fallback = ref.current?.querySelector<HTMLElement>(':scope > [id]') ?? null
      const el = target ?? fallback
      el?.scrollIntoView({ behavior: 'instant' })
      if (next && target) target.focus({ preventScroll: true })
    }
    handle(true)
    const onHashChange = () => handle(false)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [ref])

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const sections = Array.from(root.querySelectorAll<HTMLElement>(':scope > [id]'))
    const firstChild = root.firstElementChild as HTMLElement | null
    const firstId = (firstChild?.id || sections[0]?.id) ?? ''
    if (sections.length === 0) return
    const visibility = new Map<string, number>()
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visibility.set((e.target as HTMLElement).id, e.intersectionRatio)
        }
        let bestId = ''
        let bestRatio = 0
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        }
        const nextHash = bestRatio < 0.5 || bestId === firstId ? '' : bestId
        if (nextHash === readActive()) return
        const url = nextHash
          ? `${window.location.pathname}${window.location.search}#${nextHash}`
          : `${window.location.pathname}${window.location.search}`
        window.history.replaceState(null, '', url)
        writeActive(nextHash)
      },
      { root, threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [ref])
}

let activeHash = typeof window === 'undefined' ? '' : window.location.hash.slice(1)
const listeners = new Set<() => void>()

let suppressNextScroll = false

/**
 * URL hash 변경 헬퍼. `scroll: false` 면 다음 hashchange 의 scrollIntoView 만
 * 1회 skip. 이미 진행 중인 사용자 스크롤을 가로채 덜컥거리는 현상 방지용.
 */
export function navigateHash(hash: string, opts: { scroll?: boolean } = {}) {
  if (opts.scroll === false) suppressNextScroll = true
  const next = hash.startsWith('#') ? hash : hash ? `#${hash}` : ''
  if (next === window.location.hash) {
    suppressNextScroll = false
    return
  }
  window.location.hash = next
}

function readActive() {
  return activeHash
}
function writeActive(next: string) {
  if (next === activeHash) return
  activeHash = next
  listeners.forEach((l) => l())
}
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => writeActive(window.location.hash.slice(1)))
}

export function useActiveHash() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    readActive,
    () => '',
  )
}
