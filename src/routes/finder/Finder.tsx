import { useState, useSyncExternalStore } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { getTree, subscribeTree, walk, sidebar, isSmartPath, smartGroupOf, smartItems } from './data'
import { TitleBar } from './TitleBar'
import { Sidebar } from './Sidebar'
import { Columns } from './Columns'
import { ListView } from './ListView'
import { Preview } from './Preview'
import type { ViewMode } from './types'

// Mobile/Desktop 분기는 CSS가 담당 (panes.ts container query). JS는 데스크톱 셸 한 본만.
export function Finder() {
  const navigate = useNavigate()
  const { _splat } = useParams({ strict: false }) as { _splat?: string }
  const raw = _splat ?? ''
  const path = isSmartPath(raw) ? raw : '/' + raw
  useSyncExternalStore(subscribeTree, getTree, getTree)
  const [view, setView] = useState<ViewMode>('columns')
  const smart = smartGroupOf(path)
  const chain = smart ? [] : walk(path)
  const current = smart ? null : chain[chain.length - 1] ?? null
  const go = (p: string) =>
    navigate({ to: '/finder/$', params: { _splat: isSmartPath(p) ? p : p.replace(/^\//, '') } })

  const listAnchor = current?.type === 'dir' ? current : chain[chain.length - 2] ?? null
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
