import { useNavigate, useParams } from '@tanstack/react-router'
import type { CSSProperties } from 'react'
import { walk } from './data'
import { TitleBar } from './TitleBar'
import { Sidebar } from './Sidebar'
import { Columns } from './Columns'
import { Preview } from './Preview'

const shell: CSSProperties = {
  position: 'fixed', inset: 16, borderRadius: 12,
  border: '1px solid var(--ds-border)',
  background: 'var(--ds-bg)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  display: 'flex', flexDirection: 'column', overflow: 'hidden',
}
const body: CSSProperties = { flex: 1, display: 'flex', minHeight: 0 }

export function Finder() {
  const navigate = useNavigate()
  const { _splat } = useParams({ strict: false }) as { _splat?: string }
  const path = '/' + (_splat ?? '')
  const chain = walk(path)
  const current = chain[chain.length - 1] ?? null
  const go = (p: string) => navigate({ to: '/finder/$', params: { _splat: p.replace(/^\//, '') } })

  return (
    <div style={shell}>
      <TitleBar path={path} canBack={chain.length > 1}
        onBack={() => go(chain[chain.length - 2]?.path ?? '/')} />
      <div style={body}>
        <Sidebar current={path} onPick={go} />
        <Columns chain={chain} onNavigate={go} />
        <Preview node={current} />
      </div>
    </div>
  )
}
