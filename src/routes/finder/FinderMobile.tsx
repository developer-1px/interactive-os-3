/** Finder — 모바일 전용 셸.
 *  데스크톱의 sidebar | columns | preview 3열 메타포를 버리고
 *  iOS Files 식 drill-down 한 면(Locations → Folder → File)으로 재구성.
 *
 *  - path '/' (Home)         → 위치/즐겨찾기/최근 한 면
 *  - smart:*                 → 최근 그룹 항목 리스트
 *  - dir                     → 자식 리스트
 *  - file                    → 형제 파일 vertical feed pager
 */
import { useMemo } from 'react'
import { smartGroupOf, smartItems, walk } from './data'
import { Home } from './mobile/Home'
import { DirList } from './mobile/DirList'
import { SmartList } from './mobile/SmartList'
import { FilePager } from './mobile/FilePager'
import { Empty } from './mobile/Empty'

export function FinderMobile({ path, onNavigate }: { path: string; onNavigate: (p: string) => void }) {
  const smart = smartGroupOf(path)
  const chain = smart ? [] : walk(path)
  const current = smart ? null : chain[chain.length - 1] ?? null
  const isFile = current?.type === 'file'
  const parentNode = smart ? null : chain[chain.length - 2] ?? null
  const parent = smart ? '/' : parentNode?.path ?? null
  const fileSiblings = useMemo(
    () => parentNode?.children?.filter((n) => n.type === 'file') ?? [],
    [parentNode],
  )

  const title = useMemo(() => {
    if (path === '/') return '브라우즈'
    if (smart) return `최근 — ${smart.label}`
    return current?.name ?? '파일'
  }, [path, smart, current])

  return (
    <main aria-roledescription="finder-mobile" aria-label="Finder">
      <header>
        {parent !== null && (
          <button type="button" aria-label="뒤로" onClick={() => onNavigate(parent!)}>‹</button>
        )}
        <h1>{title}</h1>
      </header>
      {path === '/'
        ? <Home current={path} onNavigate={onNavigate} />
        : smart
          ? <SmartList group={smart} items={smartItems(smart.id)} onNavigate={onNavigate} />
          : isFile && current
            ? <FilePager siblings={fileSiblings} currentPath={current.path} onNavigate={onNavigate} />
            : current?.type === 'dir'
              ? <DirList node={current} onNavigate={onNavigate} />
              : <Empty />}
    </main>
  )
}
