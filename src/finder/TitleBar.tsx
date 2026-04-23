import type { CSSProperties } from 'react'

const lights: CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', padding: '0 12px' }
const dot = (bg: string): CSSProperties => ({
  width: 12, height: 12, borderRadius: '50%', background: bg, border: '1px solid rgba(0,0,0,0.1)',
})
const bar: CSSProperties = {
  display: 'flex', alignItems: 'center',
  height: 44, flex: 'none',
  borderBottom: '1px solid var(--ds-border)',
  background: 'color-mix(in oklch, Canvas 95%, CanvasText 5%)',
  fontSize: 13, gap: 12,
}
const crumbs: CSSProperties = { fontWeight: 600, fontSize: 14 }
const nav: CSSProperties = { display: 'flex', gap: 4, marginInlineStart: 8, opacity: 0.6 }

export function TitleBar({ path, onBack, canBack }: { path: string; onBack: () => void; canBack: boolean }) {
  const name = path.split('/').filter(Boolean).pop() ?? 'root'
  return (
    <div style={bar}>
      <div style={lights}>
        <div style={dot('#ff5f57')} /><div style={dot('#febc2e')} /><div style={dot('#28c840')} />
      </div>
      <div style={nav}>
        <button type="button" onClick={onBack} disabled={!canBack} aria-label="뒤로">‹</button>
        <button type="button" disabled aria-label="앞으로">›</button>
      </div>
      <div style={crumbs}>{name}</div>
    </div>
  )
}
