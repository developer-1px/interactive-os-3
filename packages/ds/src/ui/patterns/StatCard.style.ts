import { css, hairlineWidth, icon, status, statusTint, text, typography } from '../../tokens/semantic'
import { font, weight, pad } from '../../tokens/scalar'

/**
 * StatCard slot inner styling — Card primitive 슬롯 안의 KPI 특화 시각만.
 * 카드 root layout(flex stack/border/padding)은 parts/card.ts owner.
 *
 * data-card="stat" 마커로 다른 카드 변형과 분리.
 */
export const cssStatCard = () => css`
  /* alert tone — 카드 root 강조 */
  article[data-part="card"][data-card="stat"][data-variant="danger"] {
    border: ${hairlineWidth()} solid ${statusTint('danger', 'border')};
    background: ${statusTint('danger', 'soft')};
  }

  /* title 슬롯 — label dl + 우측 icon */
  article[data-part="card"][data-card="stat"] > [data-slot="title"] > header {
    display: flex; flex-direction: row; align-items: flex-start; justify-content: space-between;
    gap: ${pad(1)};
  }
  article[data-part="card"][data-card="stat"] > [data-slot="title"] > header > dl { margin: 0; }
  article[data-part="card"][data-card="stat"] > [data-slot="title"] > header > dl > dt {
    display: inline-flex; align-items: center; gap: ${pad(1)};
    font-size: ${font('sm')};
    color: ${text('subtle')};
    font-weight: ${weight('semibold')};
    line-height: 1.35;
  }
  article[data-part="card"][data-card="stat"] > [data-slot="title"] > header > span[aria-hidden="true"] {
    display: inline-grid;
    place-items: center;
    inline-size: 1.5rem;
    block-size: 1.5rem;
    flex: none;
    font-size: ${font('lg')};
    color: ${text('subtle')};
  }

  /* body 슬롯 — Heading display 의 KPI 큰 숫자 */
  article[data-part="card"][data-card="stat"] > [data-slot="body"] > [data-part="heading"][data-level="display"] {
    margin: 0;
    font-size: ${font('2xl')};
    font-weight: ${weight('bold')};
    letter-spacing: 0;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  /* meta 슬롯 — sub 텍스트 */
  article[data-part="card"][data-card="stat"] > [data-slot="meta"] > small {
    color: ${text('mute')};
    font-size: ${font('xs')};
  }

  /* footer 슬롯 — change(상승/하락) */
  article[data-part="card"][data-card="stat"] > [data-slot="footer"] > small[data-dir] {
    display: inline-flex; align-items: center; gap: ${pad(0.5)};
    ${typography('micro')}
  }
  article[data-part="card"][data-card="stat"] > [data-slot="footer"] > small[data-dir="up"]   { color: ${status('success')}; }
  article[data-part="card"][data-card="stat"] > [data-slot="footer"] > small[data-dir="down"] { color: ${status('danger')}; }
  article[data-part="card"][data-card="stat"] > [data-slot="footer"] > small[data-dir="up"]::before   { ${icon('trending-up',   '1em')} }
  article[data-part="card"][data-card="stat"] > [data-slot="footer"] > small[data-dir="down"]::before { ${icon('trending-down', '1em')} }
`
