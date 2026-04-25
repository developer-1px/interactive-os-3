import { css, dim, font, mix, pad, radius, status, surface, tint } from '../../../fn'

/**
 * FnCard — ds fn/ 토큰 함수 감사 카드.
 * 시각: surface(1) + dim border. 죽은 함수(call sites=0)는 danger tint 표시.
 */
export const fnCard = () => css`
  .fn-card {
    ${surface(1)}
    display: grid;
    grid-template-rows: auto auto auto auto;
    gap: ${pad(1.5)};
    padding: ${pad(2.5)};
    border: 1px solid ${dim(8)};
    border-radius: ${radius('md')};
    min-inline-size: 0;
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  .fn-card:hover {
    border-color: ${dim(15)};
    box-shadow: 0 1px 3px ${dim(6)};
  }

  .fn-card > header {
    display: flex; align-items: center; justify-content: space-between;
    gap: ${pad(1)};
  }
  .fn-card > header > code {
    font-family: var(--ds-font-mono);
    font-size: ${font('sm')};
    font-weight: 600;
    color: ${dim(85)};
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .fn-card > header > span {
    font-size: ${font('xs')};
    font-variant-numeric: tabular-nums;
    padding: 2px ${pad(1)};
    border-radius: ${radius('pill')};
    background: ${dim(6)};
    color: ${dim(60)};
    flex: none;
  }
  .fn-card > header > span[data-dead="true"] {
    background: ${tint(status('danger'), 14)};
    color: ${status('danger')};
  }

  .fn-card > figure {
    margin: 0;
    min-block-size: 56px;
    padding: ${pad(1.5)};
    background: ${mix(dim(4), 50, 'Canvas')};
    border-radius: ${radius('sm')};
    display: flex; align-items: center; flex-wrap: wrap; gap: ${pad(1)};
    overflow: hidden;
  }

  .fn-card > p {
    margin: 0;
    font-size: ${font('xs')};
    color: ${dim(55)};
    line-height: 1.5;
  }

  .fn-card > code[data-role="signature"] {
    font-family: var(--ds-font-mono);
    font-size: ${font('xs')};
    color: ${dim(50)};
    background: ${dim(4)};
    padding: ${pad(0.5)} ${pad(1)};
    border-radius: ${radius('sm')};
    overflow-x: auto; white-space: pre;
  }

  .fn-card > details {
    font-size: ${font('xs')};
  }
  .fn-card > details > summary {
    cursor: pointer;
    color: ${dim(55)};
    user-select: none;
  }
  .fn-card > details > summary:hover { color: ${dim(85)}; }
  .fn-card > details > ul {
    list-style: none; margin: ${pad(1)} 0 0; padding: 0;
    display: grid; gap: 2px;
  }
  .fn-card > details > ul > li > code {
    font-family: var(--ds-font-mono);
    font-size: 11px;
    color: ${dim(50)};
  }
`
