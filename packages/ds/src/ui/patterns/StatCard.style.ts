import { css, hairlineWidth, icon, status, statusTint, text, typography } from '../../tokens/foundations'
import { font, weight, pad } from '../../tokens/palette'

/**
 * StatCard slot inner styling — Card primitive 슬롯 안의 KPI 특화 시각만.
 * 카드 root layout(flex stack/border/padding)은 parts/card.ts owner.
 *
 * data-card="stat" 마커로 다른 카드 변형과 분리.
 */
export const cssStatCard = () => css`
  /* alert tone — 카드 root 강조 */
  article[data-part="card"][data-card="stat"][data-tone="alert"] {
    border: ${hairlineWidth()} solid ${statusTint('danger', 'border')};
    background: ${statusTint('danger', 'soft')};
  }

  /* title 슬롯 — label dl + 우측 icon */
  article[data-part="card"][data-card="stat"] > [data-slot="title"] > header {
    display: flex; align-items: center; justify-content: space-between;
    gap: ${pad(1)};
  }
  article[data-part="card"][data-card="stat"] > [data-slot="title"] > header > dl { margin: 0; }
  article[data-part="card"][data-card="stat"] > [data-slot="title"] > header > dl > dt {
    display: inline-flex; align-items: center; gap: ${pad(1)};
    font-size: ${font('sm')};
    color: ${text('mute')};
    font-weight: ${weight('medium')};
  }
  article[data-part="card"][data-card="stat"] > [data-slot="title"] > header > span[aria-hidden="true"] {
    font-size: ${font('lg')};
    opacity: .7;
  }

  /* body 슬롯 — Heading display 의 KPI 큰 숫자 */
  article[data-part="card"][data-card="stat"] > [data-slot="body"] > [data-part="heading"][data-level="display"] {
    margin: 0;
    font-size: calc(${font('xl')} * 1.4);
    font-weight: ${weight('bold')};
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    line-height: 1.1;
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
