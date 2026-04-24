import { useSyncExternalStore } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { getTree, subscribeTree, walk } from './data'
import { TitleBar } from './TitleBar'
import { Sidebar } from './Sidebar'
import { Columns } from './Columns'
import { Preview } from './Preview'

export function Finder() {
  const navigate = useNavigate()
  const { _splat } = useParams({ strict: false }) as { _splat?: string }
  const path = '/' + (_splat ?? '')
  useSyncExternalStore(subscribeTree, getTree, getTree)
  const chain = walk(path)
  const current = chain[chain.length - 1] ?? null
  const go = (p: string) =>
    navigate({ to: '/finder/$', params: { _splat: p.replace(/^\//, '') } })

  return (
    <main aria-roledescription="finder" aria-label="Finder">
      <TitleBar path={path} canBack={chain.length > 1}
        onBack={() => go(chain[chain.length - 2]?.path ?? '/')} />
      <section aria-roledescription="body">
        <Sidebar current={path} onPick={go} />
        <Columns chain={chain} onNavigate={go} />
        <Preview node={current} />
      </section>
    </main>
  )
}
