import { useMemo, useState } from 'react'
import { contracts, type Contract, type Kind } from 'virtual:ds-contracts'
import { demos } from './demos'

/**
 * Catalog — data 기반 ui 컴포넌트 감사 대시보드.
 *
 * "쓰는 법 통일"을 체크리스트로 시각화. 분파별 수렴률을 보여준다.
 *   A. ControlProps (canonical)
 *   B. customArray    — 통일 탈선
 *   C. childrenDriven — 통일 탈선
 *   D. fieldDriven    — content widget (분파 허용)
 */

const kindLabel: Record<Kind, string> = {
  controlProps: 'A · ControlProps (canonical)',
  customArray: 'B · customArray (탈선)',
  childrenDriven: 'C · childrenDriven (탈선)',
  fieldDriven: 'D · fieldDriven (content widget)',
  stateless: '· stateless (headless input 등)',
}

const kindOrder: Kind[] = ['controlProps', 'customArray', 'childrenDriven', 'fieldDriven', 'stateless']

export function Catalog() {
  const [filter, setFilter] = useState<Kind | 'all'>('all')

  const grouped = useMemo(() => {
    const m: Record<Kind, Contract[]> = {
      controlProps: [], customArray: [], childrenDriven: [], fieldDriven: [], stateless: [],
    }
    for (const c of contracts) m[c.kind].push(c)
    return m
  }, [])

  const totals = useMemo(() => {
    const total = contracts.length
    const canonical = grouped.controlProps.length
    const drift = grouped.customArray.length + grouped.childrenDriven.length
    const passAll = contracts.filter((c) => c.checks.every((k) => k.pass)).length
    return { total, canonical, drift, passAll }
  }, [grouped])

  const visible = filter === 'all' ? kindOrder : [filter]

  return (
    <main aria-roledescription="catalog-app" aria-label="Catalog">
      <header style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: 'var(--ds-text-lg)' }}>Catalog</h1>
        <span style={{ color: 'var(--ds-muted)', fontSize: 'var(--ds-text-sm)' }}>
          data 기반 ui 컴포넌트의 "쓰는 법 통일" 감사
        </span>
      </header>

      <section aria-labelledby="stats" style={{ padding: '16px 24px', borderBottom: '1px solid var(--ds-border)' }}>
        <h2 id="stats" style={srOnly}>통계</h2>
        <dl style={dlStyle}>
          <Stat label="총 컴포넌트" value={totals.total} />
          <Stat label="canonical (ControlProps)" value={totals.canonical} tone="good" />
          <Stat label="통일 탈선 (array + children)" value={totals.drift} tone="warn" />
          <Stat label="6개 체크 전부 통과" value={totals.passAll} tone="good" />
          <Stat label="수렴률"
            value={totals.total ? `${Math.round((totals.canonical / totals.total) * 100)}%` : '—'}
            tone={totals.canonical / totals.total > 0.3 ? 'good' : 'warn'} />
        </dl>
      </section>

      <nav aria-label="Kind filter" style={{ padding: '12px 24px', borderBottom: '1px solid var(--ds-border)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>All ({contracts.length})</FilterChip>
        {kindOrder.map((k) => (
          <FilterChip key={k} active={filter === k} onClick={() => setFilter(k)}>
            {kindLabel[k]} ({grouped[k].length})
          </FilterChip>
        ))}
      </nav>

      <section style={{ padding: 24 }}>
        {visible.map((k) => {
          const list = grouped[k]
          if (list.length === 0) return null
          return (
            <section key={k} aria-labelledby={`k-${k}`} style={{ marginBottom: 40 }}>
              <h2 id={`k-${k}`} style={{ fontSize: 'var(--ds-text-md)', margin: '0 0 12px' }}>
                {kindLabel[k]} <span style={{ color: 'var(--ds-muted)', fontWeight: 400 }}>({list.length})</span>
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
                {list.map((c) => <Card key={c.file} contract={c} />)}
              </div>
            </section>
          )
        })}
      </section>
    </main>
  )
}

function Card({ contract }: { contract: Contract }) {
  const { name, file, role, propsSignature, checks, score, callSites, kind } = contract
  const allPass = checks.every((c) => c.pass)
  const badge = allPass ? '✓' : `${checks.filter((c) => c.pass).length}/${checks.length}`
  const badgeTone = allPass ? 'good' : score >= 0.7 ? 'warn' : 'bad'

  return (
    <article style={cardStyle}>
      <header style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: 'var(--ds-text-md)', fontWeight: 600 }}>{name}</h3>
        <span style={{ ...badgeStyle, ...badgeToneStyle(badgeTone) }}>{badge}</span>
        {role && <span style={roleChip}>role="{role}"</span>}
        <span style={{ marginLeft: 'auto', color: 'var(--ds-muted)', fontSize: 'var(--ds-text-xs)' }}>
          {callSites} 소비처
        </span>
      </header>
      <div style={{ fontSize: 'var(--ds-text-xs)', color: 'var(--ds-muted)', marginTop: 4, fontFamily: 'var(--ds-font-mono)' }}>
        {file.replace('/src/ds/ui/', '')}
      </div>
      <pre style={sigStyle}>{propsSignature}</pre>
      <Demo name={name} />
      <ul style={checksStyle}>
        {checks.map((c) => (
          <li key={c.id} style={{ color: c.pass ? 'var(--ds-success)' : 'var(--ds-danger)' }}>
            {c.pass ? '✓' : '✗'} {c.label}
          </li>
        ))}
      </ul>
      {kind !== 'controlProps' && (
        <footer style={{ marginTop: 8, fontSize: 'var(--ds-text-xs)', color: 'var(--ds-muted)' }}>
          {kind === 'childrenDriven' && 'children 주입형 — ControlProps 수렴 고려'}
          {kind === 'customArray' && '커스텀 배열 prop — ControlProps 수렴 고려'}
          {kind === 'fieldDriven' && '필드 엔티티형 — content widget 분파'}
          {kind === 'stateless' && 'headless/stateless — 감사 대상 아님'}
        </footer>
      )}
    </article>
  )
}

function Demo({ name }: { name: string }) {
  const Render = demos[name]
  return (
    <div style={demoStyle} aria-label={`${name} 예시`}>
      {Render ? (
        <Render />
      ) : (
        <span style={{ color: 'var(--ds-muted)', fontSize: 'var(--ds-text-xs)' }}>demo TBD</span>
      )}
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: number | string; tone?: 'good' | 'warn' }) {
  return (
    <div>
      <dt style={{ fontSize: 'var(--ds-text-xs)', color: 'var(--ds-muted)' }}>{label}</dt>
      <dd style={{
        margin: 0, fontSize: 'var(--ds-text-xl)', fontWeight: 700,
        color: tone === 'good' ? 'var(--ds-success)' : tone === 'warn' ? 'var(--ds-warning)' : 'var(--ds-fg)',
        fontVariantNumeric: 'tabular-nums',
      }}>{value}</dd>
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} style={{
      padding: '4px 10px',
      borderRadius: 'var(--ds-radius-pill)',
      border: '1px solid var(--ds-border)',
      background: active ? 'var(--ds-accent)' : 'transparent',
      color: active ? 'var(--ds-accent-on)' : 'var(--ds-fg)',
      fontSize: 'var(--ds-text-xs)', cursor: 'pointer',
    }}>{children}</button>
  )
}

const headerStyle: React.CSSProperties = {
  padding: '16px 24px', borderBottom: '1px solid var(--ds-border)',
  display: 'flex', alignItems: 'center', gap: 16,
}
const cardStyle: React.CSSProperties = {
  padding: 16,
  border: '1px solid var(--ds-border)',
  borderRadius: 'var(--ds-radius-md)',
  background: 'var(--ds-bg)',
}
const badgeStyle: React.CSSProperties = {
  padding: '2px 8px',
  borderRadius: 'var(--ds-radius-pill)',
  fontSize: 'var(--ds-text-xs)',
  fontWeight: 600,
}
const badgeToneStyle = (tone: 'good' | 'warn' | 'bad'): React.CSSProperties => ({
  background:
    tone === 'good' ? 'color-mix(in oklab, var(--ds-success) 12%, transparent)' :
    tone === 'warn' ? 'color-mix(in oklab, var(--ds-warning) 12%, transparent)' :
                      'color-mix(in oklab, var(--ds-danger) 12%, transparent)',
  color:
    tone === 'good' ? 'var(--ds-success)' :
    tone === 'warn' ? 'var(--ds-warning)' :
                      'var(--ds-danger)',
})
const roleChip: React.CSSProperties = {
  fontSize: 'var(--ds-text-xs)',
  color: 'var(--ds-muted)',
  fontFamily: 'var(--ds-font-mono)',
}
const sigStyle: React.CSSProperties = {
  margin: '8px 0 0', padding: 8,
  background: 'color-mix(in oklab, var(--ds-fg) 4%, transparent)',
  borderRadius: 'var(--ds-radius-sm)',
  fontSize: 'var(--ds-text-xs)',
  overflowX: 'auto',
  fontFamily: 'var(--ds-font-mono)',
}
const checksStyle: React.CSSProperties = {
  margin: '10px 0 0', padding: 0, listStyle: 'none',
  display: 'grid', gap: 4, fontSize: 'var(--ds-text-xs)',
}
const demoStyle: React.CSSProperties = {
  margin: '12px 0 0',
  padding: 12,
  border: '1px dashed var(--ds-border)',
  borderRadius: 'var(--ds-radius-sm)',
  background: 'color-mix(in oklab, var(--ds-fg) 2%, transparent)',
  minHeight: 48,
  display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
  overflow: 'auto',
}
const dlStyle: React.CSSProperties = {
  margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16,
}
const srOnly: React.CSSProperties = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
}
