import { useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { useResource } from '../../ds'
import { walk, isSmartPath, smartGroupOf } from './data'
import {
  treeResource, viewResource, pinnedRootResource, pathResource, smartResource,
} from './resources'
import { TitleBar } from './TitleBar'
import { Sidebar } from './Sidebar'
import { Columns } from './Columns'
import { ListView } from './ListView'
import { Preview } from './Preview'

// Mobile/Desktop 분기는 CSS가 담당 (panes.ts container query). JS는 데스크톱 셸 한 본만.
export function Finder() {
  const { _splat } = useParams({ strict: false }) as { _splat?: string }
  const raw = _splat ?? ''
  const urlPath = isSmartPath(raw) ? raw : '/' + raw

  // 모든 도메인 데이터는 useResource 단일 인터페이스로만 read/write.
  useResource(treeResource)
  const [view, viewDispatch] = useResource(viewResource)
  const [pinnedRoot, pinDispatch] = useResource(pinnedRootResource)
  const [path, pathDispatch] = useResource(pathResource)

  // URL → store 역방향 1회 bridge (URL이 진실 원천)
  useEffect(() => { pathDispatch({ type: 'set', value: urlPath }) }, [urlPath])

  const effectivePath = path ?? urlPath
  const smart = smartGroupOf(effectivePath)
  const chain = smart ? [] : walk(effectivePath)
  const current = smart ? null : chain[chain.length - 1] ?? null
  const [smartList] = useResource(smartResource, smart?.id ?? 'today')

  const go = (p: string) => pathDispatch({ type: 'set', value: p })
  const pickSidebar = (p: string) => {
    if (!isSmartPath(p)) pinDispatch({ type: 'set', value: p })
    go(p)
  }

  const listAnchor = current?.type === 'dir' ? current : chain[chain.length - 2] ?? null
  const favoriteRoot = smart ? '/' : (pinnedRoot ?? '/')
  const currentView = view ?? 'columns'

  return (
    <main aria-roledescription="finder" aria-label="Finder" data-view={smart ? 'list' : currentView}>
      <TitleBar
        path={effectivePath}
        canBack={!smart && chain.length > 1}
        onBack={() => go(smart ? '/' : chain[chain.length - 2]?.path ?? '/')}
        view={smart ? 'list' : currentView}
        onViewChange={(v) => viewDispatch({ type: 'set', value: v })}
      />
      <section aria-roledescription="body">
        <Sidebar current={effectivePath} onPick={pickSidebar} />
        {smart
          ? <ListView node={null} items={smartList ?? []} currentPath={effectivePath} onNavigate={go} />
          : currentView === 'columns'
            ? <Columns chain={chain} rootPath={favoriteRoot} onNavigate={go} />
            : <ListView node={listAnchor} currentPath={effectivePath} onNavigate={go} />}
        {!smart && currentView === 'columns' && <Preview node={current} />}
      </section>
    </main>
  )
}
