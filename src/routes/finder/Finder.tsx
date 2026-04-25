import { useState, useSyncExternalStore } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { getTree, subscribeTree, walk } from './data'
import { TitleBar } from './TitleBar'
import { Sidebar } from './Sidebar'
import { Columns } from './Columns'
import { ListView } from './ListView'
import { Preview } from './Preview'
import type { ViewMode } from './types'

export function Finder() {
  const navigate = useNavigate()
  const { _splat } = useParams({ strict: false }) as { _splat?: string }
  const path = '/' + (_splat ?? '')
  useSyncExternalStore(subscribeTree, getTree, getTree)
  const chain = walk(path)
  const current = chain[chain.length - 1] ?? null
  const go = (p: string) =>
    navigate({ to: '/finder/$', params: { _splat: p.replace(/^\//, '') } })

  const [view, setView] = useState<ViewMode>('columns')

  // columns 가 아닌 뷰는 현재 디렉터리(파일이면 부모) 기준으로 목록을 보인다.
  const listAnchor = current?.type === 'dir'
    ? current
    : chain[chain.length - 2] ?? null

  return (
    <main aria-roledescription="finder" aria-label="Finder" data-view={view}>
      <TitleBar
        path={path}
        canBack={chain.length > 1}
        onBack={() => go(chain[chain.length - 2]?.path ?? '/')}
        view={view}
        onViewChange={setView}
      />
      <section aria-roledescription="body">
        <Sidebar current={path} onPick={go} />
        {view === 'columns'
          ? <Columns chain={chain} onNavigate={go} />
          : <ListView node={listAnchor} currentPath={path} onNavigate={go} />}
        {view === 'columns' && <Preview node={current} />}
      </section>
    </main>
  )
}
