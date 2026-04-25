import { useEffect, useState, type ReactNode } from 'react'
import { audit, type AuditData } from 'virtual:ds-audit'
import { applyPreset, defaultPreset, hairlinePreset, type DsPreset } from '../../ds/style/preset'
import { hover, focus, selected, selectedStrong, highlighted, active, disabled } from '../../ds/fn/state'

/**
 * Atlas — fn/ 레이어 검증 대시보드.
 *
 * "DS를 만드는 DS인가" 3가지 가설을 시각으로 판정한다:
 *   1. 조립식이 실제로 재사용되나 (카드별 usage 배지)
 *   2. fn 값만 건드리면 전체가 따라오나 (leak report)
 *   3. preset 갈아끼우면 다른 DS인가 (상단 스위처)
 */

const presets: { id: string; preset: DsPreset }[] = [
  { id: 'default', preset: defaultPreset },
  { id: 'hairline', preset: hairlinePreset },
]

export function Atlas() {
  const [presetId, setPresetId] = useState('default')

  useEffect(() => {
    const p = presets.find((x) => x.id === presetId)?.preset ?? defaultPreset
    applyPreset(p)
  }, [presetId])

  const { exports, callSites, leaks } = audit as AuditData
  const byFile = groupBy(exports, (e) => e.file)

  return (
    <main aria-roledescription="atlas-app" aria-label="Atlas">
      <header>
        <h1>Atlas</h1>
        <p>fn/ 레이어가 메타-DS인지 시각으로 판정</p>
        <div data-roledescription="preset-switcher">
          <label htmlFor="preset">Preset</label>
          <select
            id="preset"
            value={presetId}
            onChange={(e) => setPresetId(e.target.value)}
          >
            {presets.map((p) => <option key={p.id} value={p.id}>{p.id}</option>)}
          </select>
        </div>
      </header>

      <section aria-labelledby="cards">
        <h2 id="cards">fn exports <small>({exports.length})</small></h2>
        {Object.entries(byFile).map(([file, list]) => (
          <section key={file} aria-labelledby={`f-${file}`} aria-roledescription="atlas-fn-group">
            <h3 id={`f-${file}`}>{file.replace('/src/ds/fn/', '')}</h3>
            <div aria-roledescription="atlas-card-grid">
              {list.map((fn) => (
                <Card key={fn.name} name={fn.name} doc={fn.doc} signature={fn.signature} sites={callSites[fn.name] ?? []}>
                  {renderDemo(fn.name)}
                </Card>
              ))}
            </div>
          </section>
        ))}
      </section>

      <section aria-labelledby="leaks" aria-roledescription="atlas-leaks">
        <h2 id="leaks">Leak Report <small>({leaks.length})</small></h2>
        <p>style/widgets/** 에서 fn/ 을 거치지 않은 리터럴·직접 var 참조. 0에 가까울수록 메타-DS.</p>
        <LeakTable leaks={leaks} />
      </section>
    </main>
  )
}

const microLabelInline: React.CSSProperties = {
  fontSize: 'var(--ds-text-xs)',
  fontWeight: 600,
  color: 'color-mix(in oklab, currentColor 50%, transparent)',
  textTransform: 'uppercase',
  letterSpacing: '.06em',
  margin: 0,
}

function Card({ name, doc, signature, sites, children }: {
  name: string; doc: string; signature: string; sites: { file: string; line: number }[]; children: ReactNode
}) {
  const dead = sites.length === 0
  return (
    <article aria-roledescription="atlas-card" aria-label={name}>
      <header>
        <code data-role="title">{name}</code>
        <span
          aria-roledescription="atlas-usage"
          aria-label={`${sites.length} call sites`}
          title={sites.length ? sites.slice(0, 10).map((s) => `${s.file}:${s.line}`).join('\n') : '호출처 없음 — 죽은 조립식 가능성'}
          data-dead={dead}
        >
          ×{sites.length}
        </span>
      </header>
      <figure aria-roledescription="atlas-demo">{children}</figure>
      {doc && <p>{doc}</p>}
      <code data-role="signature">{signature}</code>
      {sites.length > 0 && (
        <details>
          <summary>호출처 {sites.length}</summary>
          <ul aria-roledescription="atlas-call-sites">
            {sites.slice(0, 40).map((s, i) => (
              <li key={i}><code>{s.file.replace('/src/ds/', '')}:{s.line}</code></li>
            ))}
          </ul>
        </details>
      )}
    </article>
  )
}

function LeakTable({ leaks }: { leaks: AuditData['leaks'] }) {
  if (leaks.length === 0) return <p data-tone="good">누수 없음.</p>
  const byFile = groupBy(leaks, (l) => l.file)
  return (
    <div aria-roledescription="atlas-leak-list">
      {Object.entries(byFile).map(([file, list]) => (
        <details key={file}>
          <summary>
            <code>{file.replace('/src/ds/style/widgets/', '')}</code>{' '}
            <small>({list.length})</small>
          </summary>
          <table aria-roledescription="atlas-leak-table">
            <thead>
              <tr>
                <th data-col="line">line</th>
                <th data-col="kind">kind</th>
                <th data-col="snippet">snippet</th>
              </tr>
            </thead>
            <tbody>
              {list.map((l, i) => (
                <tr key={i}>
                  <td data-col="line">{l.line}</td>
                  <td data-col="kind">{l.kind}</td>
                  <td data-col="snippet">{l.snippet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      ))}
    </div>
  )
}

// ── Demos ────────────────────────────────────────────────────────────────

function renderDemo(name: string): ReactNode {
  const fn = demos[name]
  return fn ? fn() : <span style={{ color: 'var(--ds-muted)', fontSize: 'var(--ds-text-xs)' }}>demo TBD</span>
}

const Swatch = ({ color, label }: { color: string; label: string }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--ds-text-xs)' }}>
    <span style={{ width: 20, height: 20, borderRadius: 4, background: color, border: '1px solid var(--ds-border)' }} />
    {label}
  </span>
)

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>{children}</div>
)

// 데모 주입용 공용 셀렉터 — CSS가 다른 카드에 새지 않도록 카드별 id 래핑
const Scoped = ({ id, css, children }: { id: string; css: string; children: ReactNode }) => (
  <div id={id} style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
    <style>{css.replace(/:where\(/g, `:where(#${id} `)}</style>
    {children}
  </div>
)

const sampleList = (items: { id: string; label: string; state?: string }[]) => (
  <ul aria-roledescription="atlas-demo-list" style={{ listStyle: 'none', margin: 0, padding: 0, width: '100%', border: '1px solid var(--ds-border)', borderRadius: 'var(--ds-radius-sm)' }}>
    {items.map((it) => (
      <li
        key={it.id}
        {...(it.state ? { [it.state]: 'true' } : {})}
        tabIndex={-1}
        style={{ padding: '4px 10px', fontSize: 'var(--ds-text-sm)', cursor: 'default' }}
      >
        {it.label}
      </li>
    ))}
  </ul>
)

const demos: Record<string, () => ReactNode> = {
  // palette
  fg: () => (
    <Row>
      {[1, 3, 5, 7, 9].map((n) => (
        <span key={n} style={{ color: `var(--ds-gray-${n})`, fontWeight: 600 }}>Aa{n}</span>
      ))}
    </Row>
  ),
  accent: () => (
    <Row>
      <span style={{ color: 'var(--ds-accent)', fontWeight: 600 }}>accent text</span>
      <span style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-on)', padding: '2px 8px', borderRadius: 'var(--ds-radius-pill)' }}>pill</span>
    </Row>
  ),
  onAccent: () => (
    <span style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-on)', padding: '4px 10px', borderRadius: 'var(--ds-radius-sm)' }}>
      onAccent 텍스트
    </span>
  ),
  status: () => (
    <Row>
      <Swatch color="var(--ds-success)" label="success" />
      <Swatch color="var(--ds-warning)" label="warning" />
      <Swatch color="var(--ds-danger)" label="danger" />
    </Row>
  ),
  border: () => <div style={{ width: '100%', height: 20, borderTop: '1px solid var(--ds-border)', borderBottom: '1px solid var(--ds-border)' }} />,
  muted: () => <span style={{ color: 'var(--ds-muted)' }}>muted 보조 텍스트</span>,
  bg: () => <div style={{ width: '100%', height: 32, background: 'var(--ds-bg)', border: '1px solid var(--ds-border)', borderRadius: 4 }} />,
  tint: () => (
    <Row>
      {[10, 20, 40, 60].map((p) => (
        <span key={p} style={{ background: `color-mix(in oklab, var(--ds-accent) ${p}%, transparent)`, padding: '2px 8px', borderRadius: 4, fontSize: 'var(--ds-text-xs)' }}>
          {p}
        </span>
      ))}
    </Row>
  ),
  mix: () => (
    <Row>
      {[20, 50, 80].map((p) => (
        <span key={p} style={{ background: `color-mix(in oklab, var(--ds-accent) ${p}%, Canvas)`, color: 'CanvasText', padding: '2px 8px', borderRadius: 4, fontSize: 'var(--ds-text-xs)' }}>
          {p}
        </span>
      ))}
    </Row>
  ),
  dim: () => (
    <div style={{ color: 'var(--ds-fg)' }}>
      <Row>
        {[30, 50, 70].map((p) => (
          <span key={p} style={{ color: `color-mix(in oklab, currentColor ${p}%, transparent)` }}>dim({p})</span>
        ))}
      </Row>
    </div>
  ),

  // recipes
  microLabel: () => <span style={microLabelInline}>SECTION LABEL</span>,

  // state
  hover: () => (
    <Scoped id="demo-hover" css={hover('li')}>
      {sampleList([{ id: 'a', label: '마우스를 올려보세요' }, { id: 'b', label: '다른 행도 시도' }])}
    </Scoped>
  ),
  active: () => (
    <Scoped id="demo-active" css={active('li')}>
      {sampleList([{ id: 'a', label: '클릭을 눌러보세요' }])}
    </Scoped>
  ),
  focus: () => (
    <Scoped id="demo-focus" css={focus('button')}>
      <div>
        <button type="button" style={{ padding: '4px 12px' }}>Tab으로 포커스</button>
      </div>
    </Scoped>
  ),
  highlighted: () => (
    <Scoped id="demo-highlighted" css={highlighted('li')}>
      {sampleList([{ id: 'a', label: 'Tab으로 진입' }, { id: 'b', label: '키 이동' }])}
    </Scoped>
  ),
  selected: () => (
    <Scoped id="demo-selected" css={selected('li')}>
      {sampleList([
        { id: 'a', label: '선택된 행', state: 'aria-selected' },
        { id: 'b', label: '일반' },
        { id: 'c', label: '일반' },
      ])}
    </Scoped>
  ),
  selectedStrong: () => (
    <Scoped id="demo-selectedstrong" css={selectedStrong('li')}>
      {sampleList([
        { id: 'a', label: '지금 이거', state: 'aria-selected' },
        { id: 'b', label: '일반' },
      ])}
    </Scoped>
  ),
  disabled: () => (
    <Scoped id="demo-disabled" css={disabled('li')}>
      {sampleList([
        { id: 'a', label: '비활성', state: 'aria-disabled' },
        { id: 'b', label: '활성' },
      ])}
    </Scoped>
  ),
}

function groupBy<T>(xs: T[], key: (x: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {}
  for (const x of xs) (out[key(x)] ??= []).push(x)
  return out
}
