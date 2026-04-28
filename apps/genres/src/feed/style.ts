import { SHELL_MOBILE_MAX, border, css, hairlineWidth, radius, surface, text } from '@p/ds/tokens/semantic'
import { weight, pad } from '@p/ds/tokens/scalar'

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
    font-weight: ${weight('bold')};
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
    font-weight: ${weight('regular')};
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

  /* attachments — 본문 아래 다채로운 첨부 (image·link·file·code·commit) */
  main[aria-label='피드'] [data-attachments] {
    display: flex;
    flex-direction: column;
    gap: ${pad(2)};
    margin-block-start: ${pad(2)};
  }
  /* image attachment */
  main[aria-label='피드'] [data-attachments] img[data-attach='image'] {
    inline-size: 100%;
    block-size: auto;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;
    border-radius: ${radius('md')};
    background: ${border('subtle')};
  }
  /* link attachment — 카드형 unfurl */
  main[aria-label='피드'] [data-attachments] a[data-attach='link'] {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: 'icon title' 'icon host' 'icon desc';
    column-gap: ${pad(2)};
    row-gap: ${pad(0.5)};
    padding: ${pad(2)} ${pad(3)};
    border: 1px solid ${border('subtle')};
    border-radius: ${radius('md')};
    text-decoration: none;
    color: inherit;
  }
  main[aria-label='피드'] [data-attachments] a[data-attach='link']:hover {
    background: ${surface('muted')};
  }
  main[aria-label='피드'] [data-attachments] a[data-attach='link'] [data-icon] {
    grid-area: icon;
    align-self: center;
    color: ${text('subtle')};
  }
  main[aria-label='피드'] [data-attachments] a[data-attach='link'] strong {
    grid-area: title;
    font-size: 0.875rem;
    font-weight: ${weight('semibold')};
  }
  main[aria-label='피드'] [data-attachments] a[data-attach='link'] small {
    grid-area: host;
    color: ${text('subtle')};
    font-size: 0.75rem;
  }
  main[aria-label='피드'] [data-attachments] a[data-attach='link'] p {
    grid-area: desc;
    margin: 0;
    color: ${text('subtle')};
    font-size: 0.8125rem;
  }
  /* file attachment — 작은 chip */
  main[aria-label='피드'] [data-attachments] [data-attach='file'] {
    display: inline-flex;
    align-items: center;
    gap: ${pad(2)};
    padding: ${pad(1.5)} ${pad(2.5)};
    border: 1px solid ${border('subtle')};
    border-radius: ${radius('md')};
    align-self: flex-start;
    max-inline-size: 100%;
  }
  main[aria-label='피드'] [data-attachments] [data-attach='file'] [data-icon] {
    color: ${text('subtle')};
  }
  main[aria-label='피드'] [data-attachments] [data-attach='file'] strong {
    font-size: 0.875rem;
    font-weight: ${weight('medium')};
  }
  main[aria-label='피드'] [data-attachments] [data-attach='file'] small {
    color: ${text('subtle')};
    font-size: 0.75rem;
  }
  /* code attachment — 인라인 snippet block */
  main[aria-label='피드'] [data-attachments] pre[data-attach='code'] {
    margin: 0;
    padding: ${pad(2.5)} ${pad(3)};
    background: ${surface('muted')};
    border-radius: ${radius('md')};
    overflow-x: auto;
    font: 400 0.8125rem/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  main[aria-label='피드'] [data-attachments] pre[data-attach='code'] code {
    background: transparent;
    padding: 0;
    color: ${text('default')};
  }
  /* commit attachment — git ref badge */
  main[aria-label='피드'] [data-attachments] [data-attach='commit'] {
    display: inline-flex;
    align-items: center;
    gap: ${pad(2)};
    padding: ${pad(1.5)} ${pad(2.5)};
    border: 1px solid ${border('subtle')};
    border-radius: ${radius('md')};
    background: ${surface('muted')};
    align-self: flex-start;
    max-inline-size: 100%;
  }
  main[aria-label='피드'] [data-attachments] [data-attach='commit'] [data-icon] {
    color: ${text('subtle')};
  }
  main[aria-label='피드'] [data-attachments] [data-attach='commit'] code {
    font: 600 0.75rem ui-monospace, SFMono-Regular, Menlo, monospace;
    background: transparent;
    padding: 0;
    color: ${text('strong')};
  }
  main[aria-label='피드'] [data-attachments] [data-attach='commit'] strong {
    font-size: 0.875rem;
    font-weight: ${weight('medium')};
    flex: 1;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  main[aria-label='피드'] [data-attachments] [data-attach='commit'] small {
    color: ${text('subtle')};
    font-size: 0.75rem;
  }

  /* reaction toolbar — 카드 본문 keyline 과 정확히 일치.
     이전: padding-inline-start: calc(pad(5)+pad(1)) 로 body 보다 우측으로 밀려 있었음.
     수정: 0 inset, 자연 정렬. button inline-size·padding 통일로 button 간 visual rhythm. */
  main[aria-label='피드'] [aria-label='반응'] {
    padding: ${pad(1)} 0 0;
    gap: ${pad(2)};
    justify-content: flex-start;
    align-items: center;
  }
  main[aria-label='피드'] [aria-label='반응'] > button {
    display: inline-flex;
    align-items: center;
    gap: ${pad(1)};
    padding: ${pad(1)} ${pad(2)};
    min-inline-size: ${pad(11)};
    line-height: 1;
    font-variant-numeric: tabular-nums;
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
    font-weight: ${weight('regular')};
  }
  aside[data-part='feed-side'] h3 {
    margin: 0;
    font-size: 1.0625rem;
    font-weight: ${weight('bold')};
    letter-spacing: -0.005em;
  }
  aside[data-part='feed-side'] small[data-variant='muted'] {
    color: ${text('subtle')};
    font-size: 0.8125rem;
  }
  aside[data-part='feed-side'] button {
    border-radius: ${radius('pill')};
    padding-inline: ${pad(2)};
    padding-block: ${pad(0.5)};
    font-size: 0.875rem;
    font-weight: ${weight('semibold')};
  }

  /* ─── feed header tabs ───────────────────────────────────────── */
  header [aria-label='피드 탭'] {
    gap: ${pad(0.5)};
  }
  header [aria-label='피드 탭'] [aria-pressed='true'] {
    color: ${text('strong')};
    font-weight: ${weight('bold')};
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
