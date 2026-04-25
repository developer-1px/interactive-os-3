import { css, dim, pad, radius } from '../../../fn'

export const roleCard = () => css`
  .role-card {
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    align-items: center;
    gap: ${pad(3)};
    padding: ${pad(2)} ${pad(3)};
    background: Canvas;
    border: 1px solid ${dim(8)};
    border-radius: ${radius('md')};
    transition: box-shadow .15s ease, border-color .15s ease;
  }
  .role-card:hover {
    border-color: ${dim(15)};
    box-shadow: 0 1px 3px ${dim(6)};
  }
  .role-card + .role-card { margin-block-start: ${pad(1.5)}; }

  button[aria-label*="드래그"] {
    padding: ${pad(0.5)};
    background: transparent; border: 0;
    color: ${dim(45)};
    font-size: var(--ds-text-lg);
    line-height: 1;
    cursor: grab;
    min-block-size: 0; min-inline-size: 0;
  }
  button[aria-label*="드래그"]:hover { color: ${dim(75)}; }
  button[aria-label*="드래그"]:active { cursor: grabbing; }

  .role-card > span[aria-hidden="true"] {
    font-size: var(--ds-text-xl);
    line-height: 1;
    inline-size: 28px;
    text-align: center;
  }

  .role-card > div:nth-of-type(1) {
    min-inline-size: 0;
    display: flex; flex-direction: column; gap: ${pad(0.25)};
  }
  .role-card > div:nth-of-type(1) > h3 {
    margin: 0;
    font-size: var(--ds-text-md);
    font-weight: 700;
  }
  .role-card > div:nth-of-type(1) > p {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: ${dim(60)};
    line-height: 1.5;
  }

  .role-card > div:nth-of-type(2) {
    display: flex; align-items: center;
    gap: ${pad(2)};
    flex-shrink: 0;
  }
  .role-card > div:nth-of-type(2) > div {
    display: flex; align-items: center; gap: ${pad(1)};
  }
`
