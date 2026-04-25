/** FilePager — 같은 폴더의 파일 형제들을 feed 식 vertical scroll로 쌓고
 *  진입 파일 위치로 자동 스크롤. 사용자 스냅 시 URL 동기화 (IntersectionObserver).
 *  외부 path 변경 시(헤더 뒤로 갔다 다시 들어옴 등)에만 scrollIntoView 재실행.
 *  윈도잉 — 현재 위치 ± WINDOW만 실제 Preview, 나머지는 스켈레톤. */
import { useEffect, useMemo, useRef } from 'react'
import { extToIcon, type FsNode } from '../types'
import { Preview } from '../Preview'
import { Empty } from './Empty'
import { PagerStub } from './PagerStub'

const PAGER_WINDOW = 3

export function FilePager({
  siblings, currentPath, onNavigate,
}: { siblings: FsNode[]; currentPath: string; onNavigate: (p: string) => void }) {
  const rootRef = useRef<HTMLElement | null>(null)
  const lastEmittedRef = useRef<string | null>(null)
  const currentIndex = useMemo(
    () => siblings.findIndex((n) => n.path === currentPath),
    [siblings, currentPath],
  )

  useEffect(() => {
    if (lastEmittedRef.current === currentPath) return
    const root = rootRef.current
    if (!root) return
    const el = root.querySelector<HTMLElement>(`[data-path="${CSS.escape(currentPath)}"]`)
    el?.scrollIntoView({ block: 'start', behavior: 'auto' })
  }, [currentPath])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const p = (e.target as HTMLElement).dataset.path
          if (p && p !== currentPath) {
            lastEmittedRef.current = p
            onNavigate(p)
          }
        }
      },
      { root, rootMargin: '0px 0px -80% 0px', threshold: 0 },
    )
    root.querySelectorAll<HTMLElement>('[data-path]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [siblings, currentPath, onNavigate])

  if (siblings.length === 0) return <Empty note="형제 파일 없음" />
  return (
    <section aria-roledescription="finder-pager" ref={rootRef as never}>
      {siblings.map((n, i) => {
        const within = currentIndex >= 0 && Math.abs(i - currentIndex) <= PAGER_WINDOW
        return (
          <article
            key={n.path}
            data-path={n.path}
            aria-current={n.path === currentPath ? 'page' : undefined}
          >
            <header>
              <figure data-icon={extToIcon(n.ext)} aria-hidden />
              <h2>{n.name}</h2>
            </header>
            {within ? <Preview node={n} /> : <PagerStub node={n} />}
          </article>
        )
      })}
    </section>
  )
}

