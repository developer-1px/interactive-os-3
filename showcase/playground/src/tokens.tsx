/* eslint-disable react-refresh/only-export-components, no-restricted-syntax -- showcase 라우트: foundation 토큰 카탈로그. */
/**
 * /tokens — Design Token 카탈로그.
 *
 * 카테고리별 시각 메타포 (외부 수렴):
 *   Color       → 큰 grid swatch (Tailwind / Radix)
 *   Typography  → use-case specimen (Stripe / IBM Carbon)
 *   Spacing     → 두 surface 사이 *실제 분리* 시각 (Material 3 dialog spec)
 *   Radius      → 동일 surface 에 morph (Polaris)
 *   Elevation   → z-stack 떠오름 (Material 3)
 *   Motion      → hover trigger 로 transition 실연 (Linear)
 *   Container   → stage 토큰 그대로의 폭으로 bar (Vercel geist)
 *
 * 페이지 chrome 자체도 ds 토큰만 사용:
 *   - 모든 gap/padding 은 calc(var(--ds-space) * n)
 *   - radius 는 var(--ds-radius-X)
 *   - font-size 는 var(--ds-text-X) — text-xs 미만 raw px 금지
 *   - border 는 var(--ds-hairline) + var(--ds-border)
 *
 * 하단에 *실시간 token table* — :root 의 모든 --ds-* var 를 getComputedStyle 로 enumerate.
 * 수동 매핑 ❌, 코드 SSOT ⭕.
 */
import { useEffect, useState, type ReactNode } from 'react'
import { ROOT, Renderer, definePage, type NormalizedData } from '@p/ds'
import type { CategoryMeta } from '@p/ds/tokens/category-meta'

// foundations/<cat>/_category.ts 자동 수집 — 라벨·표준 SSOT (canvas/tokenGroups 패턴 평행이동)
const categoryMetaModules = import.meta.glob<{ default: CategoryMeta }>(
  '@p/ds/tokens/foundations/*/_category.ts',
  { eager: true },
)
const CATEGORY_META: Record<string, CategoryMeta> = (() => {
  const out: Record<string, CategoryMeta> = {}
  for (const [path, mod] of Object.entries(categoryMetaModules)) {
    const m = path.match(/\/foundations\/([^/]+)\/_category\.ts$/)
    if (m) out[m[1]] = mod.default
  }
  return out
})()
const CATEGORY_LABEL_OF = (key: string): string =>
  CATEGORY_META[key]?.label ?? (key === 'preset' ? 'Preset · seed' : key === 'etc' ? 'ETC · misc' : key)

// ──────────────────────────────────────────────────────────────────────
// Color — Tailwind / Radix grid: 큰 swatch
// ──────────────────────────────────────────────────────────────────────

const ColorSwatchGrid: ReactNode = (
  <div data-part="swatch-grid">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
      <figure key={n} data-part="swatch" style={{ background: `var(--ds-neutral-${n})` }}>
        <figcaption>
          <strong>{n}</strong>
          <small>neutral</small>
        </figcaption>
      </figure>
    ))}
  </div>
)

const SemanticPairs: ReactNode = (
  <div data-part="pair-grid">
    {[
      { bg: '--ds-bg',     fg: '--ds-fg',        n: 'bg / fg' },
      { bg: '--ds-accent', fg: '--ds-on-accent', n: 'accent / on-accent' },
      { bg: '--ds-tone',   fg: '--ds-bg',        n: 'tone / bg' },
    ].map(({ bg, fg, n }) => (
      <figure key={n} data-part="pair" style={{ background: `var(${bg})`, color: `var(${fg})` }}>
        <strong>Aa</strong>
        <figcaption><code>{n}</code></figcaption>
      </figure>
    ))}
  </div>
)

// ──────────────────────────────────────────────────────────────────────
// Typography — Stripe / Carbon specimen
// ──────────────────────────────────────────────────────────────────────

const TypeSpecimen: ReactNode = (
  <dl data-part="specimen">
    {[
      { tok: '2xl', use: 'Display',  body: '디자인 토큰' },
      { tok: 'xl',  use: 'Headline', body: '시각 위계는 토큰에서 시작한다' },
      { tok: 'lg',  use: 'Title',    body: '재귀 Proximity 7단계' },
      { tok: 'md',  use: 'Body',     body: '본문은 가독성과 호흡을 동시에 잡아야 한다. 한 줄 60-80자가 산업 평균.' },
      { tok: 'sm',  use: 'Label',    body: '필드 라벨 / 메타데이터' },
      { tok: 'xs',  use: 'Caption',  body: '보조 설명 · 타임스탬프' },
    ].map(({ tok, use, body }) => (
      <div key={tok} data-part="specimen-row">
        <dt>
          <code>text-{tok}</code>
          <small>{use}</small>
        </dt>
        <dd style={{ fontSize: `var(--ds-text-${tok})`, lineHeight: 'var(--ds-leading-tight)' }}>{body}</dd>
      </div>
    ))}
  </dl>
)

const WeightSpecimen: ReactNode = (
  <dl data-part="specimen">
    {(['regular', 'medium', 'semibold', 'bold', 'extrabold'] as const).map(w => (
      <div key={w} data-part="specimen-row">
        <dt><code>weight-{w}</code></dt>
        <dd style={{ fontSize: 'var(--ds-text-lg)', fontWeight: `var(--ds-weight-${w})` as unknown as number }}>
          토큰이 위계를 만든다
        </dd>
      </div>
    ))}
  </dl>
)

// ──────────────────────────────────────────────────────────────────────
// Spacing — 두 surface 사이 *실제 분리* (Material 3 dialog spec)
// ──────────────────────────────────────────────────────────────────────

const SpacingDivider = ({ label, mul, note }: { label: string; mul: number; note?: string }) => (
  <div data-part="spacing-row">
    <code>{label}</code>
    <div data-part="spacing-stack">
      <div data-part="spacing-block" />
      <div data-part="spacing-gap" style={{ blockSize: mul === 0 ? 1 : `calc(var(--ds-space) * ${mul})` }} />
      <div data-part="spacing-block" />
    </div>
    <small>{note}</small>
  </div>
)

const SpacingLadder: ReactNode = (
  <div data-part="spacing-list">
    <SpacingDivider label="hierarchy.atom"    mul={0.5} note="L0 · icon ↔ label" />
    <SpacingDivider label="hierarchy.group"   mul={0}   note="L2 · row ↔ row (flush — Similarity 가 분리)" />
    <SpacingDivider label="hierarchy.section" mul={1}   note="L3 · h3 ↔ list" />
    <SpacingDivider label="hierarchy.surface" mul={2}   note="L4 · panel inner padding" />
    <SpacingDivider label="hierarchy.shell"   mul={4}   note="L5 · surface ↔ surface" />
  </div>
)

const PadScale: ReactNode = (
  <div data-part="pad-grid">
    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
      <div key={n} data-part="pad-cell">
        <span data-part="pad-bar" style={{ inlineSize: `calc(var(--ds-space) * ${n})` }} />
        <code>pad({n})</code>
      </div>
    ))}
  </div>
)

// ──────────────────────────────────────────────────────────────────────
// Radius — 동일 surface 에 4 corner 시각 (Polaris pattern)
// ──────────────────────────────────────────────────────────────────────

const RadiusMorph: ReactNode = (
  <div data-part="radius-row">
    {(['sm', 'md', 'lg', 'pill'] as const).map(s => (
      <figure key={s} data-part="radius-tile">
        <span style={{ borderRadius: `var(--ds-radius-${s})` }} />
        <figcaption><code>radius('{s}')</code></figcaption>
      </figure>
    ))}
  </div>
)

// ──────────────────────────────────────────────────────────────────────
// Elevation — z-stack 떠오름 (Material 3)
// ──────────────────────────────────────────────────────────────────────

const ElevationStack: ReactNode = (
  <div data-part="elev-row">
    {[1, 2, 3].map(n => (
      <figure key={n} data-part="elev-tile" style={{ boxShadow: `var(--ds-elev-${n}, var(--ds-shadow))` }}>
        <span>{n}</span>
        <figcaption><code>elev-{n}</code></figcaption>
      </figure>
    ))}
  </div>
)

// ──────────────────────────────────────────────────────────────────────
// Motion — hover trigger transition 실연 (Linear)
// ──────────────────────────────────────────────────────────────────────

const MotionDemo: ReactNode = (
  <div data-part="motion-grid">
    {(['fast', 'base'] as const).map(d =>
      (['out', 'spring'] as const).map(e => (
        <div key={`${d}-${e}`} data-part="motion-tile">
          <div data-part="motion-track">
            <div data-part="motion-dot" style={{
              transition: `transform var(--ds-dur-${d}) var(--ds-ease-${e})`,
            }} />
          </div>
          <code>{d} · {e}</code>
          <small>hover →</small>
        </div>
      )),
    )}
  </div>
)

// ──────────────────────────────────────────────────────────────────────
// Container — stage 토큰 그대로의 폭 (Vercel geist)
// ──────────────────────────────────────────────────────────────────────

const containerKeys = ['cell', 'card', 'chat', 'form', 'panel', 'feed', 'reading', 'list'] as const

const ContainerStack: ReactNode = (
  <div data-part="container-stack">
    {containerKeys.map(k => (
      <div key={k} data-part="container-row">
        <code>container.{k}</code>
        <div data-part="container-bar" data-stage={k} />
      </div>
    ))}
  </div>
)

// ──────────────────────────────────────────────────────────────────────
// Visual Registry — 속성 기반 dispatch (OCP).
//   대표 카테고리는 시각 메타포 entry, 매칭 안 된 토큰은 하단 TokenTable(ETC) 로.
//   신규 lane 추가 = (a) registry append 또는 (b) categorize prefix 추가하여 ETC 노출.
//   메인 buildPage 는 닫혀 있음.
// ──────────────────────────────────────────────────────────────────────

type VisualEntry = {
  /** matches categorize() 결과. ETC 에서 자동 제외하기 위해 필수. */
  categoryKey: string
  title: string
  lede: string
  frames: ReadonlyArray<{ label: string; span?: 1 | 2 | 3; body: ReactNode }>
}

const visualRegistry: ReadonlyArray<VisualEntry> = [
  {
    categoryKey: 'color',
    title: '1. Color',
    lede: '3-tier (palette → semantic → pair). neutral 1-9 raw scale 위에 의미 토큰(bg/fg/accent/border)을 얹고, 사용처에선 pair 만 import — preset 스왑 시 contrast 자동 보존.',
    frames: [
      { label: 'neutral 1 → 9', span: 2, body: ColorSwatchGrid },
      { label: 'semantic pairs', body: SemanticPairs },
    ],
  },
  {
    categoryKey: 'typography',
    title: '2. Typography',
    lede: 'modular scale 6 단 (xs → 2xl). 토큰 이름은 use-case 가 아니라 *위치* — Display/Headline/Body 매핑은 컴포넌트가 결정. weight 5 단.',
    frames: [
      { label: 'size — use-case specimen', span: 2, body: TypeSpecimen },
      { label: 'weight', body: WeightSpecimen },
    ],
  },
  {
    categoryKey: 'spacing',
    title: '3. Spacing',
    lede: 'raw pad(n) 위에 *재귀 Proximity* 5 단 hierarchy 의미를 얹는다. Gestalt: L0 atom < L3 section < L4 surface < L5 shell — 단조 증가 invariant.',
    frames: [
      { label: 'hierarchy ladder (recursive Proximity)', span: 2, body: SpacingLadder },
      { label: 'raw pad scale', body: PadScale },
    ],
  },
  {
    categoryKey: 'shape',
    title: '4. Shape — Radius',
    lede: '4-step (sm / md / lg / pill). 같은 surface 에 적용해 *둥근 정도의 모핑* 으로 비교 — 절대 px 보다 *대비* 가 중요.',
    frames: [{ label: 'radius scale', body: RadiusMorph }],
  },
  {
    categoryKey: 'elevation',
    title: '5. Elevation',
    lede: 'surface 가 그라운드 위로 떠오르는 z-축 — depth 1/2/3. neutral-1 공통 그라운드 위에 놓여야 그림자 체감이 정확.',
    frames: [{ label: 'shadow ladder', body: ElevationStack }],
  },
  {
    categoryKey: 'motion',
    title: '6. Motion',
    lede: 'duration 2 단 × easing 2 종 = 4 조합. hover 로 trigger — *시간×곡선* 의 차이는 정지 그래프가 아니라 실제 움직임으로만 보인다.',
    frames: [{ label: 'hover →', span: 3, body: MotionDemo }],
  },
  {
    categoryKey: 'layout',
    title: '7. Container — 환경 폭',
    lede: '컴포넌트가 production 에서 점유하는 inline-size. *환경* 이름(chat / feed / reading) — t-shirt size 가 아님. 각 폭은 외부 벤더 수렴 (KakaoTalk · Twitter · Notion · Gmail).',
    frames: [{ label: 'cell 240 → list 720', span: 3, body: ContainerStack }],
  },
]

/** visualRegistry 가 다루는 categoryKey 의 prefix set — ETC 필터링용. */
const VISUAL_KEYS = new Set(visualRegistry.map(e => e.categoryKey))

// ──────────────────────────────────────────────────────────────────────
// 하단 token table — :root 의 --ds-* 를 getComputedStyle 로 enumerate (코드 SSOT)
//   visualRegistry 가 다루지 않은 카테고리만 = ETC.
// ──────────────────────────────────────────────────────────────────────

type TokenEntry = { name: string; value: string }

function readRootTokens(): TokenEntry[] {
  if (typeof window === 'undefined') return []
  const seen = new Set<string>()
  const out: TokenEntry[] = []
  const cs = getComputedStyle(document.documentElement)

  const collect = (name: string) => {
    if (!name.startsWith('--ds-') || seen.has(name)) return
    seen.add(name)
    out.push({ name, value: cs.getPropertyValue(name).trim() })
  }

  // 1) :root 에 inline 으로 발행된 custom property
  const rootStyle = document.documentElement.style
  for (let i = 0; i < rootStyle.length; i++) collect(rootStyle.item(i))

  // 2) 모든 stylesheet 의 :root / html 룰에 선언된 custom property
  //    (preset 이 <style id="ds-preset"> 에 발행 — 가장 흔한 경로)
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList | null = null
    try { rules = sheet.cssRules } catch { continue }
    const walk = (rs: CSSRuleList) => {
      for (const r of Array.from(rs)) {
        if (r instanceof CSSStyleRule && (r.selectorText === ':root' || r.selectorText === 'html')) {
          for (let i = 0; i < r.style.length; i++) collect(r.style.item(i))
        } else if ('cssRules' in r && (r as CSSGroupingRule).cssRules) {
          walk((r as CSSGroupingRule).cssRules)
        }
      }
    }
    if (rules) walk(rules)
  }

  return out.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * varName → foundation `_category.ts` 키. SSOT 정렬 (longest-first 매칭).
 *
 * 16 lane (color · typography · spacing · shape · state · motion · elevation
 * · control · layout · iconography · zIndex · opacity · focus · sizing
 * · breakpoint) + preset(seed knobs) + etc(미분류).
 *
 * 신규 lane 추가 = `tokens/foundations/<cat>/_category.ts` + 여기에 prefix 한 줄.
 */
type CategoryKey =
  | 'color' | 'typography' | 'spacing' | 'shape' | 'state'
  | 'motion' | 'elevation' | 'control' | 'layout' | 'iconography'
  | 'zIndex' | 'opacity' | 'focus' | 'sizing' | 'breakpoint'
  | 'preset' | 'etc'

const PREFIX_TABLE: ReadonlyArray<readonly [string, CategoryKey]> = [
  // typography (longest first: --ds-text- 보다 --ds-tracking 이 먼저 잡혀야)
  ['--ds-tracking',  'typography'],
  ['--ds-leading',   'typography'],
  ['--ds-weight-',   'typography'],
  ['--ds-text-',     'typography'],
  ['--ds-font-',     'typography'],
  // shape
  ['--ds-radius',    'shape'],
  ['--ds-hairline',  'shape'],
  // spacing
  ['--ds-space',     'spacing'],
  ['--ds-hierarchy', 'spacing'],
  // motion
  ['--ds-dur',       'motion'],
  ['--ds-ease',      'motion'],
  // elevation
  ['--ds-elev',      'elevation'],
  ['--ds-shadow',    'elevation'],
  // 신규 6 lane
  ['--ds-z',         'zIndex'],
  ['--ds-opacity',   'opacity'],
  ['--ds-alpha',     'opacity'],
  ['--ds-focus',     'focus'],
  ['--ds-size-',     'sizing'],
  ['--ds-bp-',       'breakpoint'],
  // iconography
  ['--ds-icon-',     'iconography'],
  // control
  ['--ds-control',   'control'],
  ['--ds-chrome',    'control'],
  ['--ds-avatar',    'control'],
  // layout
  ['--ds-column',    'layout'],
  ['--ds-shell',     'layout'],
  ['--ds-sidebar',   'layout'],
  ['--ds-preview',   'layout'],
  ['--ds-container', 'layout'],
  ['--ds-stage',     'layout'],
  // color (광범위 prefix — 가장 마지막에 fallthrough)
  ['--ds-neutral',   'color'],
  ['--ds-accent',    'color'],
  ['--ds-tone',      'color'],
  ['--ds-success',   'color'],
  ['--ds-warning',   'color'],
  ['--ds-danger',    'color'],
  ['--ds-traffic',   'color'],
  ['--ds-border',    'color'],
  ['--ds-muted',     'color'],
  ['--ds-base',      'color'],
  ['--ds-on-',       'color'],
  ['--ds-bg',        'color'],
  ['--ds-fg',        'color'],
  // preset seed
  ['--ds-hue',       'preset'],
  ['--ds-density',   'preset'],
  ['--ds-depth',     'preset'],
  ['--ds-step',      'preset'],
] as const

const SORTED_PREFIX = [...PREFIX_TABLE].sort(([a], [b]) => b.length - a.length)

function categorize(name: string): CategoryKey {
  for (const [prefix, cat] of SORTED_PREFIX) if (name.startsWith(prefix)) return cat
  // h1~h6 ladder
  if (/^--ds-h[1-6]-/.test(name)) return 'typography'
  return 'etc'
}

const isColorValue = (v: string) =>
  /^#|^rgb|^hsl|^oklab|^oklch|^color\(|^color-mix|var\(--ds-(neutral|bg|fg|accent|tone|border|on-)/.test(v)

export function TokenTable() {
  const [tokens, setTokens] = useState<TokenEntry[]>([])
  useEffect(() => { setTokens(readRootTokens()) }, [])

  // 모든 토큰을 foundation lane(_category.ts) 별로 그룹. visual 카테고리도 포함 — 사용자 의도: "모든 데이터를 볼 수 있게".
  const groups = tokens.reduce<Record<string, TokenEntry[]>>((acc, t) => {
    const c = categorize(t.name)
    ;(acc[c] ||= []).push(t)
    return acc
  }, {})

  // 정렬: foundation lane 순서 → preset → etc
  const FOUNDATION_ORDER: ReadonlyArray<CategoryKey> = [
    'color', 'typography', 'spacing', 'shape', 'state', 'motion', 'elevation',
    'control', 'layout', 'iconography', 'zIndex', 'opacity', 'focus', 'sizing', 'breakpoint',
    'preset', 'etc',
  ]
  const ordered = FOUNDATION_ORDER.filter(k => groups[k]?.length)

  const visualNote = (cat: string) =>
    VISUAL_KEYS.has(cat) ? <small data-part="lane-mark">위에 시각 렌더러 ↑</small> : null

  return (
    <div data-part="token-table">
      <header>
        <h2>Token directory — foundation lane 전수</h2>
        <p><code>:root</code> 의 모든 <code>--ds-*</code> 를 <code>getComputedStyle</code> 로 enumerate (수동 매핑 ❌). foundation <code>_category.ts</code> SSOT 기준 그룹. 전체 <strong>{tokens.length}</strong> 개, lane <strong>{ordered.length}</strong>.</p>
      </header>
      {ordered.map(cat => (
        <section key={cat} data-part="token-table-group">
          <h3>
            {CATEGORY_LABEL_OF(cat)} <small>({groups[cat].length})</small>
            {visualNote(cat)}
            {CATEGORY_META[cat]?.standard && (
              <small data-part="lane-standard"> · {CATEGORY_META[cat]!.standard}</small>
            )}
          </h3>
          <dl data-part="token-table-grid">
            {groups[cat].map(t => (
              <div key={t.name} data-part="token-table-row">
                {isColorValue(t.value) && (
                  <span data-part="token-table-swatch" style={{ background: `var(${t.name})` }} />
                )}
                <dt><code>{t.name}</code></dt>
                <dd><code>{t.value || '(empty)'}</code></dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────
// Frame / Family
// ──────────────────────────────────────────────────────────────────────

const Frame = ({ label, span, children }: { label: string; span?: 1 | 2 | 3; children: ReactNode }) => (
  <figure aria-label={label} data-part="frame" data-span={span ?? 1}>
    <figcaption data-part="frame-label">{label}</figcaption>
    <div data-part="frame-body">{children}</div>
  </figure>
)

const Family = ({ title, lede, children }: { title: string; lede?: string; children: ReactNode }) => (
  <section data-part="canvas-family">
    <header>
      <h2>{title}</h2>
      {lede && <p>{lede}</p>}
    </header>
    <div data-part="frames">{children}</div>
  </section>
)

// ──────────────────────────────────────────────────────────────────────
// Inline showcase CSS — 페이지 chrome 도 ds 토큰만. raw px 는 sample 시연 한정.
// ──────────────────────────────────────────────────────────────────────

const tokenPageCss = `
  /* family header — ds 토큰만 */
  [data-part="canvas-family"] > header {
    display: flex; flex-direction: column;
    gap: calc(var(--ds-space) * 1);
    max-inline-size: 60ch;
    margin-block-end: calc(var(--ds-space) * 2);
  }
  [data-part="canvas-family"] > header h2 {
    margin: 0;
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-semibold);
    letter-spacing: var(--ds-tracking, -0.01em);
  }
  [data-part="canvas-family"] > header p {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: color-mix(in oklab, currentColor 60%, transparent);
    line-height: var(--ds-leading-loose);
  }

  /* Frame 폭 — span 으로 stage 토큰 매핑. 1=card(320), 2=feed(600), 3=list(720). */
  [data-part="frame"][data-span="1"] { inline-size: 320px; }
  [data-part="frame"][data-span="2"] { inline-size: 600px; }
  [data-part="frame"][data-span="3"] { inline-size: 720px; }
  [data-part="frame"]                { max-inline-size: 100%; }
  [data-part="frame-body"]           { display: block; min-inline-size: 0; }

  /* Color swatch grid */
  [data-part="swatch-grid"] {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
    gap: calc(var(--ds-space) * 2);
    min-inline-size: 0;
  }
  [data-part="swatch"] {
    margin: 0; aspect-ratio: 1;
    border-radius: var(--ds-radius-md);
    border: var(--ds-hairline) solid var(--ds-border);
    display: flex; align-items: flex-end;
    padding: calc(var(--ds-space) * 2);
  }
  [data-part="swatch"] > figcaption {
    display: flex; flex-direction: column;
    background: color-mix(in oklab, var(--ds-bg) 86%, transparent);
    padding: calc(var(--ds-space) * 0.5) calc(var(--ds-space) * 1.5);
    border-radius: var(--ds-radius-sm);
    backdrop-filter: blur(4px);
  }
  [data-part="swatch"] > figcaption strong {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: var(--ds-text-md);
    font-weight: var(--ds-weight-semibold);
    line-height: 1;
  }
  [data-part="swatch"] > figcaption small {
    font-size: var(--ds-text-xs);
    opacity: .6;
    letter-spacing: 0.04em;
  }

  /* Pair tiles */
  [data-part="pair-grid"] {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="pair"] {
    margin: 0; aspect-ratio: 16/10;
    border-radius: var(--ds-radius-md);
    border: var(--ds-hairline) solid var(--ds-border);
    display: grid; place-items: center;
    gap: calc(var(--ds-space) * 1);
    padding: calc(var(--ds-space) * 3);
    grid-template-rows: 1fr auto;
  }
  [data-part="pair"] > strong {
    font-size: var(--ds-text-2xl);
    font-weight: var(--ds-weight-bold);
    line-height: 1;
    align-self: end;
  }
  [data-part="pair"] > figcaption code { font-size: var(--ds-text-xs); opacity: .85; }

  /* Specimen */
  [data-part="specimen"] {
    display: flex; flex-direction: column;
    gap: calc(var(--ds-space) * 3);
    margin: 0;
  }
  [data-part="specimen-row"] {
    display: grid; grid-template-columns: 140px 1fr;
    gap: calc(var(--ds-space) * 4);
    align-items: baseline;
  }
  [data-part="specimen-row"] > dt {
    display: flex; flex-direction: column;
    gap: calc(var(--ds-space) * 0.5);
    margin: 0;
  }
  [data-part="specimen-row"] > dt code {
    font-size: var(--ds-text-xs);
    font-family: ui-monospace, monospace;
  }
  [data-part="specimen-row"] > dt small {
    font-size: var(--ds-text-xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: .5;
  }
  [data-part="specimen-row"] > dd { margin: 0; color: var(--ds-fg); }

  /* Spacing */
  [data-part="spacing-list"]  { display: flex; flex-direction: column; gap: calc(var(--ds-space) * 4); }
  [data-part="spacing-row"]   {
    display: grid; grid-template-columns: 160px 220px 1fr;
    gap: calc(var(--ds-space) * 4); align-items: center;
  }
  [data-part="spacing-row"] > code  { font-size: var(--ds-text-sm); font-family: ui-monospace, monospace; }
  [data-part="spacing-row"] > small {
    color: color-mix(in oklab, currentColor 55%, transparent);
    font-size: var(--ds-text-xs);
  }
  [data-part="spacing-stack"] { display: flex; flex-direction: column; align-items: stretch; }
  [data-part="spacing-block"] {
    block-size: calc(var(--ds-space) * 6);
    background: var(--ds-neutral-2);
    border-radius: var(--ds-radius-sm);
  }
  [data-part="spacing-gap"]   {
    background: color-mix(in oklab, var(--ds-accent) 25%, transparent);
    border-radius: var(--ds-radius-sm);
  }

  /* Pad scale */
  [data-part="pad-grid"] { display: flex; flex-direction: column; gap: calc(var(--ds-space) * 1); }
  [data-part="pad-cell"] {
    display: grid; grid-template-columns: 1fr 80px;
    align-items: center; gap: calc(var(--ds-space) * 3);
  }
  [data-part="pad-bar"]  {
    display: inline-block;
    block-size: calc(var(--ds-space) * 3);
    background: var(--ds-accent);
    border-radius: var(--ds-radius-sm);
  }
  [data-part="pad-cell"] > code {
    font-family: ui-monospace, monospace;
    font-size: var(--ds-text-xs);
    justify-self: end;
  }

  /* Radius */
  [data-part="radius-row"]  { display: flex; gap: calc(var(--ds-space) * 4); flex-wrap: wrap; }
  [data-part="radius-tile"] {
    margin: 0;
    display: flex; flex-direction: column; align-items: center;
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="radius-tile"] > span {
    display: block; inline-size: 96px; block-size: 64px;
    background: var(--ds-neutral-2);
    border: var(--ds-hairline) solid var(--ds-border);
  }
  [data-part="radius-tile"] code { font-size: var(--ds-text-xs); font-family: ui-monospace, monospace; }

  /* Elevation */
  [data-part="elev-row"] {
    display: flex; gap: calc(var(--ds-space) * 6);
    padding: calc(var(--ds-space) * 4);
    background: var(--ds-neutral-1);
    border-radius: var(--ds-radius-md);
  }
  [data-part="elev-tile"] {
    margin: 0;
    inline-size: 96px; block-size: 96px;
    background: var(--ds-bg);
    border-radius: var(--ds-radius-md);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: calc(var(--ds-space) * 1);
  }
  [data-part="elev-tile"] > span {
    font-family: ui-monospace, monospace;
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-semibold);
    line-height: 1;
  }
  [data-part="elev-tile"] code { font-size: var(--ds-text-xs); opacity: .65; }

  /* Motion */
  [data-part="motion-grid"] {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: calc(var(--ds-space) * 3);
  }
  [data-part="motion-tile"] {
    padding: calc(var(--ds-space) * 3);
    border: var(--ds-hairline) solid var(--ds-border);
    border-radius: var(--ds-radius-md);
    display: flex; flex-direction: column;
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="motion-track"] {
    block-size: calc(var(--ds-space) * 2);
    background: var(--ds-neutral-2);
    border-radius: var(--ds-radius-sm);
    overflow: hidden; position: relative;
  }
  [data-part="motion-dot"] {
    position: absolute; inset-block: 0;
    inline-size: calc(var(--ds-space) * 8);
    background: var(--ds-accent);
    border-radius: var(--ds-radius-sm);
    transform: translateX(0);
  }
  [data-part="motion-tile"]:hover [data-part="motion-dot"] { transform: translateX(220%); }
  [data-part="motion-tile"] code  { font-family: ui-monospace, monospace; font-size: var(--ds-text-xs); }
  [data-part="motion-tile"] small {
    color: color-mix(in oklab, currentColor 50%, transparent);
    font-size: var(--ds-text-xs);
    letter-spacing: 0.08em; text-transform: uppercase;
  }

  /* Container — bar 자체가 stage 토큰 폭 */
  [data-part="container-stack"] { display: flex; flex-direction: column; gap: calc(var(--ds-space) * 1); }
  [data-part="container-row"] {
    display: grid; grid-template-columns: 140px 1fr;
    align-items: center; gap: calc(var(--ds-space) * 3);
  }
  [data-part="container-row"] > code {
    font-family: ui-monospace, monospace;
    font-size: var(--ds-text-xs);
  }
  [data-part="container-bar"] {
    block-size: calc(var(--ds-space) * 3.5);
    background: linear-gradient(90deg, var(--ds-accent), color-mix(in oklab, var(--ds-accent) 40%, transparent));
    border-radius: var(--ds-radius-sm);
    max-inline-size: 100%;
  }

  /* ── Token table — 하단, runtime SSOT ─────────────────────────────── */
  [data-part="token-table"] {
    margin-block-start: calc(var(--ds-space) * 8);
    padding: calc(var(--ds-space) * 4);
    background: var(--ds-neutral-1);
    border-radius: var(--ds-radius-lg);
    display: flex; flex-direction: column;
    gap: calc(var(--ds-space) * 4);
  }
  [data-part="token-table"] > header {
    display: flex; flex-direction: column;
    gap: calc(var(--ds-space) * 1);
  }
  [data-part="token-table"] > header h2 {
    margin: 0;
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-semibold);
  }
  [data-part="token-table"] > header p {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: color-mix(in oklab, currentColor 60%, transparent);
  }
  [data-part="token-table"] > header code {
    font-family: ui-monospace, monospace;
    background: color-mix(in oklab, currentColor 8%, transparent);
    padding: 0 calc(var(--ds-space) * 1);
    border-radius: var(--ds-radius-sm);
  }

  [data-part="token-table-group"] > h3 {
    margin: 0 0 calc(var(--ds-space) * 2);
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: color-mix(in oklab, currentColor 70%, transparent);
  }
  [data-part="token-table-group"] > h3 small {
    font-weight: var(--ds-weight-regular);
    text-transform: none; letter-spacing: 0;
    opacity: .55;
    margin-inline-start: calc(var(--ds-space) * 1);
  }
  [data-part="token-table-grid"] {
    margin: 0;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: calc(var(--ds-space) * 1) calc(var(--ds-space) * 4);
  }
  [data-part="token-table-row"] {
    display: grid;
    grid-template-columns: 18px 1fr auto;
    align-items: center;
    gap: calc(var(--ds-space) * 2);
    padding-block: calc(var(--ds-space) * 0.5);
    border-block-end: var(--ds-hairline) solid var(--ds-border);
  }
  [data-part="token-table-row"]:last-child { border-block-end: 0; }
  [data-part="token-table-swatch"] {
    inline-size: 16px; block-size: 16px;
    border-radius: var(--ds-radius-sm);
    border: var(--ds-hairline) solid var(--ds-border);
  }
  [data-part="token-table-row"] > dt,
  [data-part="token-table-row"] > dd { margin: 0; }
  [data-part="token-table-row"] dt code,
  [data-part="token-table-row"] dd code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: var(--ds-text-xs);
  }
  [data-part="token-table-row"] dd code {
    color: color-mix(in oklab, currentColor 60%, transparent);
    max-inline-size: 12rem;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block;
  }
  /* swatch 가 없는 row 는 첫 칼럼 비움 */
  [data-part="token-table-row"]:not(:has(> [data-part="token-table-swatch"])) > dt {
    grid-column: 2;
  }
`

// ──────────────────────────────────────────────────────────────────────
// Page builder
// ──────────────────────────────────────────────────────────────────────

function buildPage(): NormalizedData {
  const canvas: ReactNode = (
    <div data-part="canvas">
      <style>{tokenPageCss}</style>

      {visualRegistry.map(entry => (
        <Family key={entry.categoryKey} title={entry.title} lede={entry.lede}>
          {entry.frames.map(f => (
            <Frame key={f.label} label={f.label} span={f.span}>{f.body}</Frame>
          ))}
        </Family>
      ))}

      <TokenTable />
    </div>
  )

  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Main', flow: 'split', label: 'Design Token 카탈로그' } },

      hdr: { id: 'hdr', data: { type: 'Header', flow: 'cluster' } },
      hdrTitle: { id: 'hdrTitle', data: { type: 'Text', variant: 'h1', content: 'Design Token' } },
      hdrSub: { id: 'hdrSub', data: { type: 'Text', variant: 'small', content: '3-tier 위계 — palette (raw scale) → sys (semantic) → component. 카테고리마다 어울리는 시각 메타포로 시연.' } },

      canvasBlock: { id: 'canvasBlock', data: { type: 'Ui', component: 'Block', content: canvas } },
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['hdr', 'canvasBlock'],
      hdr: ['hdrTitle', 'hdrSub'],
    },
  }
}

export function Tokens() {
  const [data] = useState(buildPage)
  return <Renderer page={definePage(data)} />
}


