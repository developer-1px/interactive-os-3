import { border, css, hairlineWidth, pad, radius, surface, text, weight } from '../../../tokens/foundations'

/**
 * InboxRow slot inner styling — 메일 행. Card primitive 슬롯에 메일 어휘 매핑.
 *
 * 슬롯:  preview = avatar (40px) | title = 보낸이 + 별표/뱃지 | body = subject + preview | footer = time
 *
 * Slack/Gmail 패턴: avatar 좌측, 본문 가운데, 시각 우측 — grid template areas.
 *
 * data-state 변형:
 *   unread → bold + accent dot
 *   read   → 기본
 *   starred / threaded / attachment / system → title 슬롯의 마커가 시각 차이
 */
export const inboxRow = () => css`
  article[data-part="card"][data-card="inbox-row"] {
    border: 0;
    border-block-end: ${hairlineWidth()} solid ${border()};
    border-radius: 0;
    padding: ${pad(2)} ${pad(2)};
    display: grid;
    grid-template-columns: 40px 1fr auto;
    grid-template-areas:
      "preview title  footer"
      "preview body   body";
    column-gap: ${pad(2)};
    row-gap: ${pad(0.25)};
    align-items: center;
    box-shadow: none;
  }
  article[data-part="card"][data-card="inbox-row"]:hover {
    background: ${surface('muted')};
    border-color: ${border()};
  }

  article[data-part="card"][data-card="inbox-row"] > [data-slot="preview"] {
    grid-area: preview;
    /* parts/Card 의 preview 220px·padding·border 무력화 */
    min-block-size: 0; padding: 0; border: 0; background: transparent;
    inline-size: 40px; block-size: 40px;
    display: grid; place-items: center;
  }
  article[data-part="card"][data-card="inbox-row"] > [data-slot="title"] {
    grid-area: title;
    display: inline-flex; align-items: center; gap: ${pad(1)};
    min-inline-size: 0;
  }
  article[data-part="card"][data-card="inbox-row"] > [data-slot="title"] > strong {
    font-size: var(--ds-text-md);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    min-inline-size: 0;
  }
  article[data-part="card"][data-card="inbox-row"] > [data-slot="body"] {
    grid-area: body;
    min-inline-size: 0;
  }
  article[data-part="card"][data-card="inbox-row"] > [data-slot="body"] > p {
    margin: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    color: ${text('subtle')};
    font-size: var(--ds-text-sm);
  }
  article[data-part="card"][data-card="inbox-row"] > [data-slot="body"] > p > strong {
    color: ${text()};
    margin-inline-end: ${pad(0.5)};
  }
  article[data-part="card"][data-card="inbox-row"] > [data-slot="footer"] {
    grid-area: footer;
    color: ${text('mute')};
    font-size: var(--ds-text-xs);
    font-variant-numeric: tabular-nums;
  }

  /* unread — 작성자/제목 강조 + accent dot */
  article[data-part="card"][data-card="inbox-row"][data-state="unread"] > [data-slot="title"] > strong > b {
    font-weight: ${weight('bold')};
  }
  article[data-part="card"][data-card="inbox-row"][data-state="unread"] > [data-slot="preview"]::after {
    content: '';
    position: absolute;
    inline-size: 8px; block-size: 8px; border-radius: ${radius('pill')};
    background: var(--ds-accent);
    transform: translate(28px, -16px);
  }

  /* system — 색조 다르게 */
  article[data-part="card"][data-card="inbox-row"][data-state="system"] > [data-slot="title"] > strong {
    color: ${text('mute')};
    font-style: italic;
  }

  /* starred / threaded / attachment 의 title 안 마커 */
  article[data-part="card"][data-card="inbox-row"] > [data-slot="title"] > [aria-label="별표"] {
    color: var(--ds-warning);
  }
  article[data-part="card"][data-card="inbox-row"] > [data-slot="title"] > [aria-label="첨부 있음"] {
    color: ${text('mute')};
  }

  /* radius for first/last in stack */
  article[data-part="card"][data-card="inbox-row"]:first-of-type {
    border-start-start-radius: ${radius('sm')};
    border-start-end-radius: ${radius('sm')};
  }
  article[data-part="card"][data-card="inbox-row"]:last-of-type {
    border-block-end: 0;
  }
`
