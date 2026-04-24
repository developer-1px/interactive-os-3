import { css, dim, icon, mix, pad, radius, status, surface, tint } from '../../../fn'

export const statCard = () => css`
  .stat-card {
    ${surface(1)}
    margin: 0;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto auto auto;
    row-gap: ${pad(0.5)};
    column-gap: ${pad(2)};
    padding: ${pad(3)};
    border-radius: ${radius('md')};
    min-inline-size: 0;
  }
  .stat-card[data-tone="alert"] {
    border: 1px solid ${tint(status('danger'), 40)};
    background: ${mix(status('danger'), 4)};
  }
  .stat-card > header {
    grid-column: 1 / -1;
    display: flex; align-items: center; justify-content: space-between;
    gap: ${pad(1)};
  }
  .stat-card > header > dl { margin: 0; }
  .stat-card > header > dl > dt {
    display: inline-flex; align-items: center; gap: ${pad(1)};
    font-size: var(--ds-text-sm);
    color: ${dim(60)};
    font-weight: 500;
  }
  .stat-card > header > span[aria-hidden="true"] {
    font-size: var(--ds-text-lg);
    opacity: .7;
  }
  .stat-card > strong {
    grid-column: 1 / -1;
    font-size: calc(var(--ds-text-xl) * 1.4);
    font-weight: 700;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    line-height: 1.1;
  }
  .stat-card > small {
    grid-column: 1 / -1;
    color: ${dim(55)};
    font-size: var(--ds-text-xs);
  }
  .stat-card > small[data-dir] {
    display: inline-flex; align-items: center; gap: ${pad(0.5)};
    font-weight: 500;
  }
  .stat-card > small[data-dir="up"]   { color: ${status('success')}; }
  .stat-card > small[data-dir="down"] { color: ${status('danger')}; }
  .stat-card > small[data-dir="up"]::before   { ${icon('trending-up',   '1em')} }
  .stat-card > small[data-dir="down"]::before { ${icon('trending-down', '1em')} }
`
