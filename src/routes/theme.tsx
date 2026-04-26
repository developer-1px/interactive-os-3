import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, type ChangeEvent } from 'react'

/**
 * Theme Creator — neutral palette + tone hue/chroma + density + accent hue를
 * 라이브로 조절. 변경값은 :root에 inline CSS var로 setProperty해서 즉시 모든
 * widget에 전파된다 (preset 재컴파일 없이).
 *
 * 토큰 출처: src/ds/style/preset/apply.ts — --ds-tone-hue / --ds-tone-chroma /
 *           --ds-hue / --ds-density.
 *
 * 이 라우트는 시연·튜닝 도구라 raw HTML 사용이 정당하다 (메모리: showcase 라우트 예외).
 */

const initial = {
  toneHue: 70,
  toneChroma: 0.018,
  accentHue: 260,
  density: 1,
}

function ThemeCreator() {
  const [v, setV] = useState(initial)

  useEffect(() => {
    const r = document.documentElement.style
    r.setProperty('--ds-tone-hue', String(v.toneHue))
    r.setProperty('--ds-tone-chroma', String(v.toneChroma))
    r.setProperty('--ds-hue', String(v.accentHue))
    r.setProperty('--ds-density', String(v.density))
  }, [v])

  const reset = () => setV(initial)

  const upd = <K extends keyof typeof initial>(k: K) => (e: ChangeEvent<HTMLInputElement>) =>
    setV((s) => ({ ...s, [k]: Number(e.target.value) }))

  return (
    <article aria-roledescription="theme-creator" aria-label="Theme creator">
      <header>
        <h1>Theme Creator</h1>
        <p>seed.toneHue / toneChroma / accentHue / density 를 라이브 조절. 변경은 <code>:root</code>의 CSS 변수로 즉시 전파되어 모든 위젯이 따라온다.</p>
        <button type="button" onClick={reset}>Reset</button>
      </header>

      <section aria-labelledby="ctl-tone">
        <h2 id="ctl-tone">Neutral tone</h2>
        <p>
          <label>
            <strong>toneHue</strong>
            <input type="range" min={0} max={360} step={1} value={v.toneHue} onChange={upd('toneHue')} />
            <output>{v.toneHue}°</output>
          </label>
          <small>0=red · 70=warm/papery · 180=cyan · 250=cool/screeny · 320=magenta</small>
        </p>
        <p>
          <label>
            <strong>toneChroma</strong>
            <input type="range" min={0} max={0.05} step={0.001} value={v.toneChroma} onChange={upd('toneChroma')} />
            <output>{v.toneChroma.toFixed(3)}</output>
          </label>
          <small>0=정직한 회색 · 0.018=감지 임계 · 0.04=확연</small>
        </p>
      </section>

      <section aria-labelledby="ctl-accent">
        <h2 id="ctl-accent">Accent</h2>
        <p>
          <label>
            <strong>accentHue</strong>
            <input type="range" min={0} max={360} step={1} value={v.accentHue} onChange={upd('accentHue')} />
            <output>{v.accentHue}°</output>
          </label>
          <small>0=red · 140=green · 220=blue · 260=violet · 320=magenta</small>
        </p>
      </section>

      <section aria-labelledby="ctl-density">
        <h2 id="ctl-density">Density</h2>
        <p>
          <label>
            <strong>density</strong>
            <input type="range" min={0.85} max={1.2} step={0.01} value={v.density} onChange={upd('density')} />
            <output>{v.density.toFixed(2)}</output>
          </label>
          <small>0.85=compact · 1=default · 1.2=spacious. pad/control 크기 일괄 스케일.</small>
        </p>
      </section>

      <section aria-labelledby="ctl-grays">
        <h2 id="ctl-grays">Neutral palette</h2>
        <ul aria-label="gray scale">
          {([1,2,3,4,5,6,7,8,9] as const).map((n) => (
            <li key={n}>
              <span aria-hidden style={{ display: 'inline-block', width: 32, height: 32, background: `var(--ds-gray-${n})`, borderRadius: 6 }} />
              <code>--ds-gray-{n}</code>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ctl-surfaces">
        <h2 id="ctl-surfaces">Surface tokens</h2>
        <ul aria-label="surface tokens">
          <li>
            <span aria-hidden style={{ display: 'inline-block', width: 48, height: 32, background: 'var(--ds-base)', borderRadius: 6, border: '1px solid var(--ds-border)' }} />
            <code>--ds-base</code> <small>page ground (tinted)</small>
          </li>
          <li>
            <span aria-hidden style={{ display: 'inline-block', width: 48, height: 32, background: 'var(--ds-bg)', borderRadius: 6, border: '1px solid var(--ds-border)' }} />
            <code>--ds-bg</code> <small>elevated surface (Canvas)</small>
          </li>
          <li>
            <span aria-hidden style={{ display: 'inline-block', width: 48, height: 32, background: 'var(--ds-tone)', borderRadius: 6 }} />
            <code>--ds-tone</code> <small>tinted neutral source</small>
          </li>
          <li>
            <span aria-hidden style={{ display: 'inline-block', width: 48, height: 32, background: 'var(--ds-accent)', borderRadius: 6 }} />
            <code>--ds-accent</code> <small>brand</small>
          </li>
        </ul>
      </section>

      <section aria-labelledby="ctl-preview">
        <h2 id="ctl-preview">Preview</h2>
        <article aria-label="Sample card" style={{ background: 'var(--ds-bg)', border: '1px solid var(--ds-border)', borderRadius: 10, padding: 16 }}>
          <h3>Sample card</h3>
          <p>이 카드는 <code>--ds-bg</code> 위, 페이지 자체는 <code>--ds-base</code> 위. 두 surface의 미세 차이가 깊이를 만든다.</p>
          <p>본문은 <code>--ds-gray-9</code> (oklch L≈0.30, hue {v.toneHue}°). 진한 검정의 차가운 인상이 사라지고 종이 위 잉크 같은 따뜻함.</p>
          <button type="button">Primary action</button>{' '}
          <button type="button">Secondary</button>
        </article>
      </section>
    </article>
  )
}

export const Route = createFileRoute('/theme')({
  component: ThemeCreator,
  staticData: { palette: { label: 'Theme Creator', to: '/theme' } },
})
