import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, type ChangeEvent } from 'react'

/**
 * Theme Creator — 토큰 튜닝 도구이자 DS의 자기검증 거울.
 *
 * 의도:
 *   - 슬라이더로 :root CSS var를 흔들면 카드·버튼·border·shadow 모든 곳이 즉시 따라옴
 *   - 이 페이지 자체가 inline style 없이 DS 토큰만으로 그려져야 토큰 변화가 정직하게 비침
 *   - localStorage 영속 → 다른 라우트로 이동해도 같은 테마 유지 (main.tsx에서 boot-time 복원)
 *
 * 원칙:
 *   - inline style 0. classless. 셀렉터는 [data-part="theme-creator"] scope <style> 1개.
 *   - showcase 라우트 raw role 예외만 사용 (메모리: feedback_showcase_route_role_exception)
 *
 * 토큰 출처: src/ds/style/preset/apply.ts — --ds-tone-hue / --ds-tone-chroma /
 *           --ds-tone-tint / --ds-step-scale / --ds-hue / --ds-density
 */

const initial = {
  toneHue: 70,
  toneChroma: 0.018,
  toneTint: 18,
  stepScale: 1,
  accentHue: 260,
  density: 1,
} as const

type ThemeState = { -readonly [K in keyof typeof initial]: number }

const VAR_MAP: Record<keyof ThemeState, string> = {
  toneHue: '--ds-tone-hue',
  toneChroma: '--ds-tone-chroma',
  toneTint: '--ds-tone-tint',
  stepScale: '--ds-step-scale',
  accentHue: '--ds-hue',
  density: '--ds-density',
}

const STORAGE_KEY = 'ds-theme-overrides'

const loadOverrides = (): ThemeState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...initial }
    const parsed = JSON.parse(raw) as Partial<Record<string, number>>
    const out = { ...initial } as ThemeState
    for (const k of Object.keys(initial) as Array<keyof ThemeState>) {
      const v = parsed[VAR_MAP[k]]
      if (typeof v === 'number') out[k] = v
    }
    return out
  } catch {
    return { ...initial }
  }
}

const styles = `
  [data-part="theme-creator"] {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: var(--ds-space, 4px) calc(var(--ds-space) * 8);
    align-items: start;
    padding: calc(var(--ds-space) * 6);
    min-height: 100dvh;
  }
  [data-part="theme-creator"] > aside {
    position: sticky;
    top: calc(var(--ds-space) * 6);
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 5);
    padding: calc(var(--ds-space) * 5);
    background: var(--ds-bg);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    box-shadow: var(--ds-elev-2);
  }
  [data-part="theme-creator"] > aside > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: calc(var(--ds-space) * 3);
  }
  [data-part="theme-creator"] > aside > header > h1 {
    font-size: var(--ds-text-lg);
  }
  [data-part="theme-creator"] > aside > section {
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="theme-creator"] > aside > section > h2 {
    font-size: var(--ds-text-sm);
    color: var(--ds-muted);
    font-weight: var(--ds-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  [data-part="theme-creator"] > aside label {
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 1);
  }
  [data-part="theme-creator"] > aside label > span {
    display: flex;
    justify-content: space-between;
    font-size: var(--ds-text-sm);
  }
  [data-part="theme-creator"] > aside label > small {
    color: var(--ds-muted);
    font-size: var(--ds-text-xs);
  }
  [data-part="theme-creator"] > [aria-label="Theme preview"] {
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 8);
    width: 100%;
    max-width: 720px;
    margin-inline: auto;
  }
  [data-part="theme-creator"] > [aria-label="Theme preview"] > section > h2 {
    font-size: var(--ds-text-lg);
    margin-bottom: calc(var(--ds-space) * 3);
  }
  [data-part="theme-creator"] [aria-label="neutral scale"] {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="theme-creator"] [aria-label="neutral scale"] li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--ds-space) * 1);
  }
  [data-part="theme-creator"] [aria-label="neutral scale"] li > i {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--ds-radius-sm);
  }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(1) > i { background: var(--ds-neutral-1); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(2) > i { background: var(--ds-neutral-2); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(3) > i { background: var(--ds-neutral-3); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(4) > i { background: var(--ds-neutral-4); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(5) > i { background: var(--ds-neutral-5); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(6) > i { background: var(--ds-neutral-6); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(7) > i { background: var(--ds-neutral-7); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(8) > i { background: var(--ds-neutral-8); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(9) > i { background: var(--ds-neutral-9); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li > code {
    font-size: var(--ds-text-xs);
    color: var(--ds-muted);
  }
  [data-part="theme-creator"] [aria-label="surface tokens"] {
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="theme-creator"] [aria-label="surface tokens"] li {
    display: flex;
    align-items: center;
    gap: calc(var(--ds-space) * 3);
  }
  [data-part="theme-creator"] [aria-label="surface tokens"] li > i {
    display: inline-block;
    width: 48px;
    height: 32px;
    border-radius: var(--ds-radius-sm);
  }
  [data-part="theme-creator"] [aria-label="surface tokens"] li[data-token="base"]   > i { background: var(--ds-base); border: 1px solid var(--ds-border); }
  [data-part="theme-creator"] [aria-label="surface tokens"] li[data-token="bg"]     > i { background: var(--ds-bg);   border: 1px solid var(--ds-border); }
  [data-part="theme-creator"] [aria-label="surface tokens"] li[data-token="tone"]   > i { background: var(--ds-tone); }
  [data-part="theme-creator"] [aria-label="surface tokens"] li[data-token="accent"] > i { background: var(--ds-accent); }
  [data-part="theme-creator"] [aria-label="surface tokens"] li > small {
    color: var(--ds-muted);
  }
  [data-part="theme-creator"] article[aria-label="Sample card"] {
    background: var(--ds-bg);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-md);
    padding: calc(var(--ds-space) * 5);
    box-shadow: var(--ds-elev-2);
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 3);
  }
  [data-part="theme-creator"] article[aria-label="Sample card"] [role="group"] {
    display: flex;
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="theme-creator"] article[aria-label="Sample card"] button[data-emphasis="primary"] {
    background: var(--ds-accent);
    color: var(--ds-accent-on);
    padding: calc(var(--ds-space) * 2) calc(var(--ds-space) * 4);
    border-radius: var(--ds-radius-sm);
  }
  [data-part="theme-creator"] article[aria-label="Sample card"] button[data-emphasis="secondary"] {
    background: var(--ds-bg);
    border: 1px solid var(--ds-border);
    padding: calc(var(--ds-space) * 2) calc(var(--ds-space) * 4);
    border-radius: var(--ds-radius-sm);
  }
`

// eslint-disable-next-line react-refresh/only-export-components
function ThemeCreator() {
  const [v, setV] = useState<ThemeState>(loadOverrides)

  useEffect(() => {
    const root = document.documentElement.style
    for (const k of Object.keys(v) as Array<keyof ThemeState>) {
      root.setProperty(VAR_MAP[k], String(v[k]))
    }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(
      (Object.keys(v) as Array<keyof ThemeState>).map((k) => [VAR_MAP[k], v[k]]),
    ))) } catch { /* quota / disabled: 메모리 상태만 유지 */ }
  }, [v])

  const reset = () => {
    setV({ ...initial })
    const root = document.documentElement.style
    for (const k of Object.keys(initial) as Array<keyof ThemeState>) root.removeProperty(VAR_MAP[k])
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }

  const upd = <K extends keyof ThemeState>(k: K) => (e: ChangeEvent<HTMLInputElement>) =>
    setV((s) => ({ ...s, [k]: Number(e.target.value) }))

  return (
    <article data-part="theme-creator" aria-label="Theme creator">
      <style>{styles}</style>

      <aside aria-label="Theme controls">
        <header>
          <h1>Theme</h1>
          <button type="button" onClick={reset}>Reset</button>
        </header>

        <section aria-labelledby="ctl-tone">
          <h2 id="ctl-tone">Neutral tone</h2>
          <label>
            <span><strong>toneHue</strong><output>{v.toneHue}°</output></span>
            <input type="range" min={0} max={360} step={1} value={v.toneHue} onChange={upd('toneHue')} />
            <small>0=red · 70=warm · 180=cyan · 250=cool</small>
          </label>
          <label>
            <span><strong>toneChroma</strong><output>{v.toneChroma.toFixed(3)}</output></span>
            <input type="range" min={0} max={0.05} step={0.001} value={v.toneChroma} onChange={upd('toneChroma')} />
            <small>0=정직한 회색 · 0.018=감지 임계 · 0.04=확연</small>
          </label>
          <label>
            <span><strong>toneTint</strong><output>{v.toneTint}%</output></span>
            <input type="range" min={0} max={50} step={1} value={v.toneTint} onChange={upd('toneTint')} />
            <small>0=정직한 회색 · 18=기본 · 50=확실히 컬러</small>
          </label>
          <label>
            <span><strong>stepScale</strong><output>{v.stepScale.toFixed(2)}</output></span>
            <input type="range" min={0.5} max={1.6} step={0.01} value={v.stepScale} onChange={upd('stepScale')} />
            <small>neutral 1~9 대비 곡선 배율. &lt;1=soft · 1=기본 · &gt;1=punchy</small>
          </label>
        </section>

        <section aria-labelledby="ctl-accent">
          <h2 id="ctl-accent">Accent</h2>
          <label>
            <span><strong>accentHue</strong><output>{v.accentHue}°</output></span>
            <input type="range" min={0} max={360} step={1} value={v.accentHue} onChange={upd('accentHue')} />
          </label>
        </section>

        <section aria-labelledby="ctl-density">
          <h2 id="ctl-density">Density</h2>
          <label>
            <span><strong>density</strong><output>{v.density.toFixed(2)}</output></span>
            <input type="range" min={0.85} max={1.2} step={0.01} value={v.density} onChange={upd('density')} />
            <small>0.85 compact · 1 default · 1.2 spacious</small>
          </label>
        </section>
      </aside>

      <section aria-label="Theme preview">
        <section aria-labelledby="ctl-grays">
          <h2 id="ctl-grays">Neutral palette</h2>
          <ul aria-label="neutral scale">
            {([1,2,3,4,5,6,7,8,9] as const).map((n) => (
              <li key={n}><i aria-hidden /><code>{n}</code></li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="ctl-surfaces">
          <h2 id="ctl-surfaces">Surface tokens</h2>
          <ul aria-label="surface tokens">
            <li data-token="base"><i aria-hidden /><code>--ds-base</code><small>page ground (tinted)</small></li>
            <li data-token="bg"><i aria-hidden /><code>--ds-bg</code><small>elevated surface (Canvas)</small></li>
            <li data-token="tone"><i aria-hidden /><code>--ds-tone</code><small>tinted neutral source</small></li>
            <li data-token="accent"><i aria-hidden /><code>--ds-accent</code><small>brand</small></li>
          </ul>
        </section>

        <section aria-labelledby="ctl-preview">
          <h2 id="ctl-preview">Preview</h2>
          <article aria-label="Sample card">
            <h3>Sample card</h3>
            <p>이 카드는 <code>--ds-bg</code> 위, 페이지는 <code>--ds-base</code> 위. 두 surface의 미세 차이가 깊이를 만든다.</p>
            <p>본문은 <code>--ds-neutral-9</code> (oklch L≈0.30, hue {v.toneHue}°). 진한 검정의 차가운 인상이 사라지고 종이 위 잉크 같은 따뜻함.</p>
            <div data-part="actions" aria-label="Card actions">
              <button type="button" data-emphasis="primary">Primary</button>
              <button type="button" data-emphasis="secondary">Secondary</button>
            </div>
          </article>
        </section>
      </section>
    </article>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const Route = createFileRoute('/theme')({
  component: ThemeCreator,
  staticData: { palette: { label: 'Theme Creator', to: '/theme' } },
})
