import { css, pad, radius, hairlineWidth, border, text, surface } from '@p/ds/foundations'
import { SHELL_MOBILE_MAX } from '@p/ds/style/preset/breakpoints'

/**
 * feed Gestalt 적용 —
 *   L0 atom    : avatar↔who, icon↔label, reaction icon↔count
 *   L1 row     : meta row, reaction row (controlBox 자체)
 *   L2 group   : trends/suggestions row 간 flush (Similarity로 위계 성립)
 *   L3 section : 카드 안 (meta / body / image / reactions) 간격
 *   L4 surface : card·side panel 자체 inner padding
 *   L5 shell   : nav↔feed↔side
 *
 * 레이아웃 ── 3-column shell:
 *   [nav 240]  [feed 640 max·중앙]  [aside 320]
 *   nav/aside는 sticky (스크롤시 따라옴), main만 흐른다.
 *   nav↔main 사이만 hairline. main↔aside 사이는 라인 없음(요청).
 *
 * ghost 버튼은 색(text.subtle)으로만 약화 — opacity는 disabled 영역.
 *
 * 모바일은 main 한 컬럼만, aside·nav 숨김 + nav FAB.
 */
export const feedCss = css`
  /* ─── shell ──────────────────────────────────────────────────── */
  [data-page-root][aria-label='Feed'] {
    align-items: stretch;
    min-block-size: 100dvh;
  }

  /* ─── nav (좌) — sticky, brand + listbox + 글쓰기 CTA ─────────── */
  nav[aria-label='피드 내비게이션'] {
    position: sticky;
    inset-block-start: 0;
    align-self: start;
    block-size: 100dvh;
    padding: ${pad(3)};
    gap: ${pad(2)};
  }
  nav[aria-label='피드 내비게이션'] > h2 {
    margin: 0;
    padding-inline: ${pad(1)};
    font-size: 1.25rem;
    letter-spacing: -0.01em;
  }
  nav[aria-label='피드 내비게이션'] [data-cta='primary'] {
    display: flex;
    inline-size: 100%;
    margin-block-start: ${pad(1)};
    padding-block: ${pad(1.5)};
    background: ${text('strong')};
    color: ${surface('subtle')};
    border-radius: ${radius('pill')};
    border: none;
    font-weight: 700;
    font-size: 0.9375rem;
    justify-content: center;
  }
  nav[aria-label='피드 내비게이션'] [data-cta='primary']:hover {
    background: ${text('default')};
  }
  nav[aria-label='피드 내비게이션'] [data-cta='primary'] [data-icon]::before {
    opacity: 1;
  }

  /* ─── feed column ────────────────────────────────────────────── */
  main[aria-label='피드'] {
    max-inline-size: 640px;
    margin-inline: auto;
    padding-inline: ${pad(3)};
    padding-block: ${pad(2)};
    gap: ${pad(3)};
    border-inline-start: ${hairlineWidth()} solid ${border('subtle')};
  }
  main[aria-label='피드'] > header {
    position: sticky;
    inset-block-start: 0;
    z-index: 1;
    align-items: center;
    padding-block: ${pad(1.5)};
    background: ${surface('subtle')};
    backdrop-filter: blur(8px);
    border-block-end: ${hairlineWidth()} solid ${border('subtle')};
    margin-inline: -${pad(3)};
    padding-inline: ${pad(3)};
    margin-block-start: -${pad(2)};
  }
  main[aria-label='피드'] > header h1 {
    margin: 0;
    font-size: 1.25rem;
  }

  /* ─── card (L4) ──────────────────────────────────────────────── */
  main[aria-label='피드'] > section {
    padding: ${pad(4)};
    gap: ${pad(3)};
    border-radius: ${radius('lg')};
    border: ${hairlineWidth()} solid ${border('subtle')};
  }

  /* meta row — avatar↔who atom, more 우측 */
  main[aria-label='피드'] [data-ds='Row'] {
    align-items: center;
  }
  main[aria-label='피드'] [data-ds='Row'] > img {
    inline-size: ${pad(5)};
    block-size: ${pad(5)};
    border-radius: ${radius('pill')};
    object-fit: cover;
  }
  main[aria-label='피드'] [data-ds='Row'] > strong small {
    display: block;
    font-weight: 400;
    color: ${text('subtle')};
    margin-block-start: ${pad(0.25)};
  }

  /* body 가독 */
  main[aria-label='피드'] section > p,
  main[aria-label='피드'] section > strong:not(:first-child) {
    line-height: 1.55;
  }

  /* post image */
  main[aria-label='피드'] section img:not([data-ds]) {
    inline-size: 100%;
    block-size: auto;
    border-radius: ${radius('md')};
    display: block;
  }
  main[aria-label='피드'] section > strong > img {
    aspect-ratio: 16 / 9;
    max-block-size: 360px;
    object-fit: cover;
  }

  /* reaction toolbar — body keyline 좌측 정렬 + 클러스터 (Proximity).
     풀폭 분포(space-between)는 시선 분산되어 금지. */
  main[aria-label='피드'] [aria-label='반응'] {
    padding-block-start: ${pad(1)};
    padding-inline-start: calc(${pad(5)} + ${pad(1)});
    gap: ${pad(3)};
    justify-content: flex-start;
  }
  /* card 내부 control은 ghost — opacity 금지, 색만 약화 */
  main[aria-label='피드'] section button {
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    color: ${text('subtle')};
  }
  main[aria-label='피드'] section button [data-icon]::before,
  main[aria-label='피드'] section button[data-icon]::before {
    opacity: 1;
  }
  main[aria-label='피드'] section button:hover {
    background: ${border('subtle')};
    color: ${text('default')};
  }
  main[aria-label='피드'] section button[aria-pressed='true'] {
    color: ${text('strong')};
  }

  /* ─── aside (우) — sticky, surface section 2개. 좌측 라인 없음 ── */
  aside[data-part='feed-side'] {
    position: sticky;
    inset-block-start: 0;
    align-self: start;
    block-size: 100dvh;
    padding: ${pad(3)};
    gap: ${pad(3)};
    overflow-y: auto;
    border: 0;
    border-radius: 0;
  }
  aside[data-part='feed-side'] > section {
    padding: ${pad(3)};
    gap: ${pad(2)};
    border-radius: ${radius('lg')};
    background: ${surface('muted')};
  }
  aside[data-part='feed-side'] [data-ds='Row'] {
    align-items: center;
    gap: ${pad(1)};
    padding-block: ${pad(0.5)};
  }
  aside[data-part='feed-side'] small {
    color: ${text('subtle')};
    font-weight: 400;
  }
  aside[data-part='feed-side'] h3 {
    margin: 0;
    font-size: 1.0625rem;
    font-weight: 700;
    letter-spacing: -0.005em;
  }
  aside[data-part='feed-side'] [data-ds='Text'][variant='caption'] {
    color: ${text('subtle')};
    font-size: 0.8125rem;
  }
  aside[data-part='feed-side'] button {
    border-radius: ${radius('pill')};
    padding-inline: ${pad(2)};
    padding-block: ${pad(0.5)};
    font-size: 0.875rem;
    font-weight: 600;
  }

  /* ─── feed header tabs ───────────────────────────────────────── */
  header [aria-label='피드 탭'] {
    gap: ${pad(0.5)};
  }
  header [aria-label='피드 탭'] [aria-pressed='true'] {
    color: ${text('strong')};
    font-weight: 700;
  }

  /* ─── 모바일 ────────────────────────────────────────────────── */
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    aside[data-part='feed-side'] { display: none; }
    nav[aria-label='피드 내비게이션'] { display: none; }
    main[aria-label='피드'] {
      border-inline-start: 0;
    }
    main[aria-label='피드'] > section {
      padding: ${pad(2)};
    }
  }
`
