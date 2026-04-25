import { useState, useSyncExternalStore } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { getTree, subscribeTree, walk, sidebar, isSmartPath, smartGroupOf, smartItems } from './data'
import { TitleBar } from './TitleBar'
import { Sidebar } from './Sidebar'
import { Columns } from './Columns'
import { ListView } from './ListView'
import { Preview } from './Preview'
import { FinderMobile } from './FinderMobile'
import type { ViewMode } from './types'

const MOBILE_QUERY = '(max-width: 600px)'
const subscribeMobile = (cb: () => void) => {
  const mq = window.matchMedia(MOBILE_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const getIsMobile = () => window.matchMedia(MOBILE_QUERY).matches
const getIsMobileSSR = () => false

export function Finder() {
  const navigate = useNavigate()
  const { _splat } = useParams({ strict: false }) as { _splat?: string }
  const raw = _splat ?? ''
  const path = isSmartPath(raw) ? raw : '/' + raw
  useSyncExternalStore(subscribeTree, getTree, getTree)
  const isMobile = useSyncExternalStore(subscribeMobile, getIsMobile, getIsMobileSSR)
  const [view, setView] = useState<ViewMode>('columns')
  const go = (p: string) =>
    navigate({ to: '/finder/$', params: { _splat: isSmartPath(p) ? p : p.replace(/^\//, '') } })

  if (isMobile) return <FinderMobile path={path} onNavigate={go} />

  const smart = smartGroupOf(path)
  const chain = smart ? [] : walk(path)
  const current = smart ? null : chain[chain.length - 1] ?? null

  // columns 가 아닌 뷰는 현재 디렉터리(파일이면 부모) 기준으로 목록을 보인다.
  const listAnchor = current?.type === 'dir'
    ? current
    : chain[chain.length - 2] ?? null

  // 현재 path 를 감싸는 가장 깊은 즐겨찾기를 가상 루트로. (root '/'는 fallback)
  const favoriteRoot = smart
    ? '/'
    : [...sidebar]
        .filter((s) => path === s.path || path.startsWith(s.path === '/' ? '/' : s.path + '/'))
        .sort((a, b) => b.path.length - a.path.length)[0]?.path ?? '/'

  return (
    <main aria-roledescription="finder" aria-label="Finder" data-view={smart ? 'list' : view}>
      <TitleBar
        path={path}
        canBack={!smart && chain.length > 1}
        onBack={() => go(smart ? '/' : chain[chain.length - 2]?.path ?? '/')}
        view={smart ? 'list' : view}
        onViewChange={setView}
      />
      <section aria-roledescription="body">
        <Sidebar current={path} onPick={go} />
        {smart
          ? <ListView node={null} items={smartItems(smart.id)} currentPath={path} onNavigate={go} />
          : view === 'columns'
            ? <Columns chain={chain} rootPath={favoriteRoot} onNavigate={go} />
            : <ListView node={listAnchor} currentPath={path} onNavigate={go} />}
        {!smart && view === 'columns' && <Preview node={current} />}
      </section>
    </main>
  )
}
