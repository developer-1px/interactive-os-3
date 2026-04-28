import { useEffect, useState, type ChangeEvent } from 'react'
import { initial, loadOverrides, STORAGE_KEY, VAR_MAP, type ThemeState } from './model'
import { themeCreatorStyles } from './styles'

/**
 * Theme creator 본문 — 슬라이더 6개 + palette/surface/preview 시각화.
 * showcase 라우트 raw HTML 예외 적용 (memory: feedback_showcase_route_role_exception).
 */
export function ThemeCreatorBody() {
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
      <style>{themeCreatorStyles}</style>

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

        <section aria-labelledby="ctl-type">
          <h2 id="ctl-type">Type palette</h2>
          <ul aria-label="type scale">
            {(['xs','sm','md','lg','xl','2xl'] as const).map((s) => (
              <li key={s} data-step={s}>
                <span data-specimen>Aa</span>
                <code>--ds-text-{s}</code>
              </li>
            ))}
          </ul>
          <ul aria-label="type weights">
            {(['regular','medium','semibold','bold','extrabold'] as const).map((w) => (
              <li key={w} data-weight={w}>
                <span data-specimen>Aa</span>
                <code>--ds-weight-{w}</code>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="ctl-spacing">
          <h2 id="ctl-spacing">Spacing palette</h2>
          <ul aria-label="spacing hierarchy">
            <li data-step="atom"><i aria-hidden /><code>atom</code><small>L0 row 안 atom 간격</small></li>
            <li data-step="section"><i aria-hidden /><code>section</code><small>L3 section↔section</small></li>
            <li data-step="surface"><i aria-hidden /><code>surface</code><small>L4 panel inner</small></li>
            <li data-step="shell"><i aria-hidden /><code>shell</code><small>L5 app shell</small></li>
          </ul>
        </section>

        <section aria-labelledby="ctl-state">
          <h2 id="ctl-state">State palette</h2>
          <ul aria-label="state samples">
            <li data-state="rest"><span data-tile>Rest</span><code>default</code></li>
            <li data-state="hover"><span data-tile>Hover</span><code>:hover</code></li>
            <li data-state="active"><span data-tile>Active</span><code>:active</code></li>
            <li data-state="focus"><span data-tile>Focus</span><code>:focus-visible</code></li>
            <li data-state="selected"><span data-tile>Selected</span><code>aria-selected</code></li>
            <li data-state="disabled"><span data-tile>Disabled</span><code>aria-disabled</code></li>
          </ul>
        </section>

        <section aria-labelledby="ctl-preview">
          <h2 id="ctl-preview">Preview</h2>
          <article aria-label="Sample card">
            <h3>Sample card</h3>
            <p>이 카드는 <code>--ds-bg</code> 위, 페이지는 <code>--ds-base</code> 위. 두 surface의 미세 차이가 깊이를 만든다.</p>
            <p>본문은 <code>--ds-neutral-9</code> (oklch L≈0.30, hue {v.toneHue}°). 진한 검정의 차가운 인상이 사라지고 종이 위 잉크 같은 따뜻함.</p>
            <div data-part="actions" aria-label="Card actions">
              <button type="button" data-variant="primary">Primary</button>
              <button type="button" data-variant="secondary">Secondary</button>
            </div>
          </article>
        </section>
      </section>
    </article>
  )
}
