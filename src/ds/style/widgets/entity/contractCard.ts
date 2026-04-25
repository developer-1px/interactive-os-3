import { css, dim, font, pad, radius, status, surface, tint } from '../../../fn'

/**
 * ContractCard — ds 컴포넌트 계약 감사 카드.
 * 시각: surface(1) + dim border. 통과/부분/실패 뱃지를 status pair로 표시.
 * aria-current="true"면 accent 테두리.
 */
export const contractCard = () => css`
  .contract-card {
    ${surface(1)}
    display: grid;
    grid-template-rows: auto auto auto auto auto auto;
    gap: ${pad(1.5)};
    padding: ${pad(2.5)};
    border: 1px solid ${dim(8)};
    border-radius: ${radius('md')};
    min-inline-size: 0;
    cursor: pointer;
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  .contract-card:hover {
    border-color: ${dim(15)};
    box-shadow: 0 1px 3px ${dim(6)};
  }
  .contract-card[aria-current="true"] {
    border-color: var(--ds-accent);
    box-shadow: 0 0 0 1px var(--ds-accent), 0 1px 3px ${dim(6)};
  }
  .contract-card:focus-visible {
    outline: 2px solid var(--ds-accent);
    outline-offset: 2px;
  }

  .contract-card > header {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: ${pad(1)};
  }
  .contract-card > header > h3 {
    margin: 0;
    font-size: ${font('md')};
    font-weight: 600;
    color: ${dim(85)};
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .contract-card > header > [data-badge] {
    font-size: ${font('xs')};
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    padding: 2px ${pad(1)};
    border-radius: ${radius('pill')};
    flex: none;
  }
  .contract-card > header > [data-badge][data-tone="good"] {
    background: ${tint(status('success'), 14)};
    color: ${status('success')};
  }
  .contract-card > header > [data-badge][data-tone="warn"] {
    background: ${tint(status('warning'), 14)};
    color: ${status('warning')};
  }
  .contract-card > header > [data-badge][data-tone="bad"] {
    background: ${tint(status('danger'), 14)};
    color: ${status('danger')};
  }
  .contract-card > header > code {
    grid-column: 1 / -1;
    font-family: var(--ds-font-mono);
    font-size: ${font('xs')};
    color: ${dim(55)};
  }
  .contract-card > header > small {
    grid-column: 1 / -1;
    font-size: ${font('xs')};
    color: ${dim(50)};
  }

  .contract-card > small {
    font-family: var(--ds-font-mono);
    font-size: ${font('xs')};
    color: ${dim(45)};
  }

  .contract-card > pre {
    margin: 0;
    font-family: var(--ds-font-mono);
    font-size: ${font('xs')};
    color: ${dim(50)};
    background: ${dim(4)};
    padding: ${pad(1)};
    border-radius: ${radius('sm')};
    overflow-x: auto;
    max-block-size: 8em;
  }

  .contract-card > figure {
    margin: 0;
    min-block-size: 56px;
    padding: ${pad(1.5)};
    background: ${dim(3)};
    border-radius: ${radius('sm')};
    display: flex; align-items: center; flex-wrap: wrap; gap: ${pad(1)};
    overflow: hidden;
  }

  .contract-card > ul {
    list-style: none; margin: 0; padding: 0;
    display: grid; gap: 2px;
    font-size: ${font('xs')};
  }
  .contract-card > ul > li {
    color: ${dim(60)};
  }
  .contract-card > ul > li[data-pass="true"]  { color: ${status('success')}; }
  .contract-card > ul > li[data-pass="false"] { color: ${status('danger')}; }

  .contract-card > footer {
    font-size: ${font('xs')};
    color: ${status('warning')};
    background: ${tint(status('warning'), 8)};
    padding: ${pad(1)} ${pad(1.5)};
    border-radius: ${radius('sm')};
  }
`
