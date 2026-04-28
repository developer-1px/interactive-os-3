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

  /* Screen wrapper — guide 배지 표시. Mobbin 식 분류 가시화. */
  [data-part="wf-grid"] > [data-screen] {
    display: inline-flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="wf-grid"] > [data-screen]::before {
    content: attr(data-screen-guide);
    align-self: flex-start;
    padding: 2px calc(var(--ds-space) * 1.5);
    border-radius: var(--ds-radius-pill, 999px);
    background: color-mix(in oklab, var(--ds-fg) 8%, transparent);
    color: color-mix(in oklab, var(--ds-fg) 75%, transparent);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  /* Grid overlay — preset 별 ::after layer.
     useHeadClone 이 부모 <style> 를 iframe 으로 복제 → desktop iframe 안에서도 매치. */
  [data-part="phone-body"] { position: relative; }
  [data-grid] [data-part="phone-body"]::after {
    content: '';
    position: absolute; inset: 0;
    pointer-events: none;
    z-index: 9999;
  }
  [data-grid="off"] [data-part="phone-body"]::after { display: none; }

  /* 4col — 4-column / 16px gutter / 16px margin */
  [data-grid="4col"] [data-part="phone-body"]::after {
    --wf-m: 16px; --wf-g: 16px;
    --wf-col: calc((100% - 2 * var(--wf-m) - 3 * var(--wf-g)) / 4);
    background:
      linear-gradient(to right,
        rgba(255, 80, 80, 0.12) 0 var(--wf-m),
        rgba(80, 150, 255, 0.12) var(--wf-m) calc(var(--wf-m) + var(--wf-col)),
        transparent calc(var(--wf-m) + var(--wf-col)) calc(var(--wf-m) + var(--wf-col) + var(--wf-g)),
        rgba(80, 150, 255, 0.12) calc(var(--wf-m) + var(--wf-col) + var(--wf-g)) calc(var(--wf-m) + 2 * var(--wf-col) + var(--wf-g)),
        transparent calc(var(--wf-m) + 2 * var(--wf-col) + var(--wf-g)) calc(var(--wf-m) + 2 * var(--wf-col) + 2 * var(--wf-g)),
        rgba(80, 150, 255, 0.12) calc(var(--wf-m) + 2 * var(--wf-col) + 2 * var(--wf-g)) calc(var(--wf-m) + 3 * var(--wf-col) + 2 * var(--wf-g)),
        transparent calc(var(--wf-m) + 3 * var(--wf-col) + 2 * var(--wf-g)) calc(var(--wf-m) + 3 * var(--wf-col) + 3 * var(--wf-g)),
        rgba(80, 150, 255, 0.12) calc(var(--wf-m) + 3 * var(--wf-col) + 3 * var(--wf-g)) calc(100% - var(--wf-m)),
        rgba(255, 80, 80, 0.12) calc(100% - var(--wf-m)) 100%);
  }

  /* 목록형 (list) — 좌우 16px margin + 56px row baseline. iOS Settings · Mail row. */
  [data-grid="list"] [data-part="phone-body"]::after {
    --wf-m: 16px; --wf-row: 56px;
    background:
      linear-gradient(to right,
        rgba(255, 80, 80, 0.10) 0 var(--wf-m),
        transparent var(--wf-m) calc(100% - var(--wf-m)),
        rgba(255, 80, 80, 0.10) calc(100% - var(--wf-m)) 100%),
      repeating-linear-gradient(to bottom,
        transparent 0 calc(var(--wf-row) - 1px),
        rgba(80, 150, 255, 0.40) calc(var(--wf-row) - 1px) var(--wf-row));
  }

  /* 피드형 (feed) — full-bleed (margin 0) + 카드 cut 200px. Instagram · TikTok · 뉴스피드. */
  [data-grid="feed"] [data-part="phone-body"]::after {
    --wf-card: 200px;
    background:
      repeating-linear-gradient(to bottom,
        rgba(80, 150, 255, 0.06) 0 calc(var(--wf-card) - 2px),
        rgba(80, 150, 255, 0.50) calc(var(--wf-card) - 2px) var(--wf-card));
  }

  /* 본문형 (content) — 24px margin + 단일 reading column. 기사·블로그 detail. */
  [data-grid="content"] [data-part="phone-body"]::after {
    --wf-m: 24px;
    background:
      linear-gradient(to right,
        rgba(255, 80, 80, 0.12) 0 var(--wf-m),
        rgba(80, 150, 255, 0.10) var(--wf-m) calc(100% - var(--wf-m)),
        rgba(255, 80, 80, 0.12) calc(100% - var(--wf-m)) 100%);
  }

  /* 8pt baseline — vertical rhythm. 모든 line/padding 이 8 의 배수에 정렬되는지 검증. */
  [data-grid="baseline"] [data-part="phone-body"]::after {
    background: repeating-linear-gradient(to bottom,
      transparent 0 7px,
      rgba(80, 150, 255, 0.25) 7px 8px);
  }

  /* Toggle group — sticky top-right pill row. desktop wf-canvas 공통, mobile 은 fixed 로 override. */
  [data-part="wf-grid-toggle"] {
    position: sticky;
    top: calc(var(--ds-space) * 2);
    align-self: flex-end;
    margin-inline-start: auto;
    width: max-content;
    z-index: 100;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 2px;
    padding: 2px;
    border-radius: var(--ds-radius-pill, 999px);
    background: var(--ds-bg);
    border: var(--ds-hairline) solid var(--ds-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: var(--ds-text-sm);
  }
  [data-part="wf-grid-toggle"] button {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--ds-fg);
    padding: 6px 14px;
    border-radius: var(--ds-radius-pill, 999px);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
  }
  [data-part="wf-grid-toggle"] button[aria-checked="true"] {
    background: var(--ds-accent);
    color: var(--ds-on-accent);
  }

  /* Keyline audit panel — sticky top-left. GridOverlayToggle 와 같은 좌표계 (sticky top). */
  [data-part="wf-audit"] {
    position: sticky;
    top: calc(var(--ds-space) * 2);
    align-self: flex-start;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 12px;
    border-radius: var(--ds-radius-md, 8px);
    background: var(--ds-bg);
    border: var(--ds-hairline) solid var(--ds-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    max-inline-size: 480px;
  }
  [data-part="wf-audit"] > button {
    appearance: none;
    border: var(--ds-hairline) solid var(--ds-border);
    background: var(--ds-bg);
    color: var(--ds-fg);
    padding: 4px 10px;
    border-radius: var(--ds-radius-pill, 999px);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    align-self: flex-start;
  }
  [data-part="wf-audit-summary"] { display: inline-flex; gap: 10px; }
  [data-part="wf-audit-summary"] [data-level="ok"]         { color: oklch(60% 0.12 145); }
  [data-part="wf-audit-summary"] [data-level="warn"]       { color: oklch(70% 0.14 70); }
  [data-part="wf-audit-summary"] [data-level="fail"]       { color: oklch(60% 0.18 25); }
  [data-part="wf-audit-summary"] [data-level="unmeasured"] { color: color-mix(in oklab, currentColor 50%, transparent); }
  [data-part="wf-audit"] table {
    border-collapse: collapse;
    font-size: 11px;
  }
  [data-part="wf-audit"] th,
  [data-part="wf-audit"] td {
    text-align: left;
    padding: 2px 8px;
    border-block-end: var(--ds-hairline) solid var(--ds-border);
    white-space: nowrap;
  }
  [data-part="wf-audit"] a { color: var(--ds-accent); text-decoration: none; }

  /* Screen wrapper level marker — desktop catalog 에서 wrapper 둘레에 outline. */
  [data-part="wf-grid"] > [data-screen][data-audit="warn"] { outline: 2px solid oklch(70% 0.14 70); outline-offset: 6px; }
  [data-part="wf-grid"] > [data-screen][data-audit="fail"] { outline: 2px solid oklch(60% 0.18 25); outline-offset: 6px; }
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

  /* Mobile toggle — snap scroll 안에선 sticky 가 안 먹어서 fixed 로 상단 고정.
     viewport 좁으니 폰트·패딩 축소. left/right 로 stretch 하면 슬라이드 가려서 right 고정. */
  [data-part="wf-feed"] [data-part="wf-grid-toggle"] {
    position: fixed;
    top: calc(env(safe-area-inset-top, 0px) + 8px);
    right: 8px;
    left: auto;
    align-self: auto;
    margin-inline-start: 0;
    width: max-content;
    max-width: calc(100vw - 16px);
    overflow-x: auto;
  }
  [data-part="wf-feed"] [data-part="wf-grid-toggle"] button {
    padding: 4px 8px;
    font-size: 11px;
  }
  /* Mobile keyline audit — fixed top-left, 좁게 축소. */
  [data-part="wf-feed"] [data-part="wf-audit"] {
    position: fixed;
    top: calc(env(safe-area-inset-top, 0px) + 8px);
    left: 8px;
    align-self: auto;
    max-inline-size: calc(100vw - 16px);
    font-size: 11px;
  }
`
