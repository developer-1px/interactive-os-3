/**
 * wireframes.chrome — 카탈로그 *표시 방식* (showcase 전용 wf-* namespace).
 *
 *  - desktop:   wf-canvas → wf-group(header + grid) — N column auto-fill grid
 *  - mobile:    wf-feed → vertical snap feed (TikTok 식, device chrome 제거)
 *
 * 카탈로그 *내용*(ScreenDef)은 wireframes.tsx, registry 는 wireframe-registry.ts.
 */
import type { ReactNode } from 'react'
import { Column } from '@p/ds'

export const Group = ({ id, title, lede, children }: { id: string; title: string; lede?: string; children: ReactNode }) => (
  <section data-part="wf-group" id={id}>
    <header>
      <strong>({id})</strong>
      <Column style={{ gap: 'calc(var(--ds-space) * 1)' }}>
        <h2>{title}</h2>
        {lede && <p>{lede}</p>}
      </Column>
    </header>
    <div data-part="wf-grid">{children}</div>
  </section>
)

export const wireframesCss = `
  [data-part="wf-canvas"] {
    inline-size: 100%;
    background: var(--ds-neutral-1);
    background-image: radial-gradient(circle, color-mix(in oklch, var(--ds-fg) 12%, transparent) 1px, transparent 1px);
    background-size: 24px 24px;
    border-radius: var(--ds-radius-lg);
    padding: calc(var(--ds-space) * 8);
    display: flex; flex-direction: column;
    gap: calc(var(--ds-space) * 16);
  }
  [data-part="wf-group"] > header {
    display: flex; align-items: baseline;
    gap: calc(var(--ds-space) * 3);
    margin-block-end: calc(var(--ds-space) * 8);
    padding-block-end: calc(var(--ds-space) * 3);
    border-block-end: var(--ds-hairline) solid var(--ds-border);
  }
  [data-part="wf-group"] > header > strong {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: var(--ds-text-2xl);
    font-weight: var(--ds-weight-regular);
    color: color-mix(in oklab, currentColor 55%, transparent);
    line-height: 1;
  }
  [data-part="wf-group"] > header h2 {
    margin: 0;
    font-size: var(--ds-text-2xl);
    font-weight: var(--ds-weight-regular);
    letter-spacing: -0.01em;
  }
  [data-part="wf-group"] > header p {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: color-mix(in oklab, currentColor 60%, transparent);
    max-inline-size: 60ch;
  }
  [data-part="wf-grid"] {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(407px, max-content));
    gap: calc(var(--ds-space) * 12) calc(var(--ds-space) * 8);
    align-items: end;
    justify-content: start;
  }
`

// 모바일 shell — TikTok 식 vertical snap feed. device chrome 제거 (viewport = device).
export const wireframesMobileCss = `
  [data-part="wf-feed"] {
    block-size: 100dvh;
    inline-size: 100vw;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    overscroll-behavior-y: contain;
    background: var(--ds-bg);
  }
  [data-part="wf-feed"] > * {
    block-size: 100dvh;
    inline-size: 100vw;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
  [data-part="wf-feed-title"] {
    display: grid;
    place-items: center;
    text-align: center;
    padding: calc(var(--ds-space) * 8);
    background: var(--ds-neutral-1);
  }
  [data-part="wf-feed-title"] strong {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: var(--ds-text-2xl);
    font-weight: var(--ds-weight-regular);
    color: color-mix(in oklab, currentColor 55%, transparent);
    letter-spacing: 0.08em;
  }
  [data-part="wf-feed-title"] h2 {
    margin: 0;
    font-size: var(--ds-text-3xl);
    font-weight: var(--ds-weight-regular);
    letter-spacing: -0.02em;
  }
  [data-part="wf-feed-title"] p {
    margin: 0;
    font-size: var(--ds-text-md);
    color: color-mix(in oklab, currentColor 60%, transparent);
    max-inline-size: 36ch;
  }
  /* device chrome 제거 — phone wrapper 는 그대로 두되 figure/frame chrome 만 풀고 screen 만 풀스크린. */
  [data-part="wf-feed"] [data-part="phone"] { all: unset; display: contents; }
  [data-part="wf-feed"] [data-part="phone"] > figcaption { display: none; }
  [data-part="wf-feed"] [data-part="phone-frame"] {
    all: unset;
    display: grid;
    grid-template-rows: 1fr;
    block-size: 100dvh;
    inline-size: 100vw;
    background: var(--ds-bg);
  }
  [data-part="wf-feed"] [data-part="phone-status"],
  [data-part="wf-feed"] [data-part="phone-home"] { display: none; }
  [data-part="wf-feed"] [data-part="phone-screen"] {
    block-size: 100dvh;
    inline-size: 100vw;
    overflow: hidden;
  }
  [data-part="wf-feed"] [data-mobile-shell] { block-size: 100dvh; }
`
