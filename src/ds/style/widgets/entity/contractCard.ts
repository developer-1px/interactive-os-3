import { css, dim, font, pad, radius, status, tint } from '../../../foundations'

/**
 * ContractCard slot inner styling — Card primitive 슬롯 안의 컨트랙트 특화 시각만.
 *
 * 일반 시각은 ds/parts/* 가 담당:
 *   - Heading.tsx → 슬롯의 h3·small
 *   - Code.tsx    → meta·body의 코드 / inline code
 *   - Callout.tsx → footer drift 알림
 *   - KeyValue.tsx → checks 리스트
 *
 * 여기 남은 책임:
 *   1) title 슬롯의 header 가로 레이아웃 (h3 + badge + role + 소비처)
 *   2) pass/fail 통과율 badge (✓ / 2/3) — parts/Badge 가 count/dot 전용이라 여기서 ad-hoc
 *   3) checks 의 ✓/✗ 색상 (KeyValue dt 안의 data-pass)
 *   4) body 슬롯의 pre 코드 블럭 표시
 */
export const contractCard = () => css`
  /* title 슬롯 header — gridline-aligned 가로 묶음 */
  article[data-part="card"] > [data-slot="title"] > header {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: ${pad(1)};
  }
  article[data-part="card"] > [data-slot="title"] > header > [data-part="heading"][data-level="h3"] {
    margin: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  article[data-part="card"] > [data-slot="title"] > header > [data-part="code"],
  article[data-part="card"] > [data-slot="title"] > header > [data-part="heading"][data-level="caption"] {
    grid-column: 1 / -1;
  }

  /* 통과율 badge — pass/warn/bad tone */
  article[data-part="card"] > [data-slot="title"] > header > [data-badge] {
    font-size: ${font('xs')};
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    padding: 2px ${pad(1)};
    border-radius: ${radius('pill')};
    flex: none;
  }
  article[data-part="card"] > [data-slot="title"] > header > [data-badge][data-tone="good"] {
    background: ${tint(status('success'), 14)};
    color: ${status('success')};
  }
  article[data-part="card"] > [data-slot="title"] > header > [data-badge][data-tone="warn"] {
    background: ${tint(status('warning'), 14)};
    color: ${status('warning')};
  }
  article[data-part="card"] > [data-slot="title"] > header > [data-badge][data-tone="bad"] {
    background: ${tint(status('danger'), 14)};
    color: ${status('danger')};
  }

  /* body 슬롯 — props signature 코드 블럭 */
  article[data-part="card"] > [data-slot="body"] > pre {
    margin: 0;
    background: ${dim(4)};
    padding: ${pad(1)};
    border-radius: ${radius('sm')};
    overflow-x: auto;
    max-block-size: 8em;
  }
  article[data-part="card"] > [data-slot="body"] > pre > [data-part="code"] {
    background: transparent;
    padding: 0;
    font-size: ${font('xs')};
    color: ${dim(50)};
    white-space: pre;
  }

  /* meta 슬롯 — file path inline code */
  article[data-part="card"] > [data-slot="meta"] > [data-part="code"] {
    background: transparent;
    padding: 0;
    font-size: ${font('xs')};
    color: ${dim(45)};
  }

  /* checks 슬롯 — KeyValue dt 의 ✓/✗ 색 */
  article[data-part="card"] > [data-slot="checks"] [data-pass="true"]  { color: ${status('success')}; }
  article[data-part="card"] > [data-slot="checks"] [data-pass="false"] { color: ${status('danger')}; }
`
