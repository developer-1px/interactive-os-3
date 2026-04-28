import { css, radius, status, text, typography } from '../tokens/semantic'
import { pad } from '../tokens/scalar'

/**
 * ProductCard slot inner styling — 커머스 상품 카드.
 * 카드 root layout(flex stack/border)은 parts/card.ts owner.
 */
export const cssProductCard = () => css`
  article[data-part="card"][data-card="product"] {
    border-radius: ${radius('lg')};
    gap: ${pad(1.5)};
  }

  /* preview 슬롯 — 1:1 정사각 이미지. 일반 preview override. */
  article[data-part="card"][data-card="product"] > [data-slot="preview"] {
    min-block-size: 0;
    padding: 0;
    border: 0;
    background: transparent;
    overflow: hidden;
  }
  article[data-part="card"][data-card="product"] > [data-slot="preview"] > img {
    inline-size: 100%; block-size: auto; display: block;
    aspect-ratio: 1 / 1; object-fit: cover;
    border-radius: ${radius('md')};
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
  }

  /* title 슬롯 — 상품명 (2줄 clamp) */
  article[data-part="card"][data-card="product"] > [data-slot="title"] > strong {
    ${typography('bodyStrong')};
    overflow: hidden; text-overflow: ellipsis;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }

  /* body 슬롯 — 가격행 */
  article[data-part="card"][data-card="product"] > [data-slot="body"] > p {
    margin: 0; display: flex; align-items: baseline; gap: ${pad(1.5)};
  }
  article[data-part="card"][data-card="product"] > [data-slot="body"] > p > strong {
    ${typography('heading')};
  }
  article[data-part="card"][data-card="product"] > [data-slot="body"] > p > small > s { color: ${text('mute')}; }
  article[data-part="card"][data-card="product"] > [data-slot="body"] > p > mark {
    background: color-mix(in oklch, ${status('danger')} 14%, transparent);
    color: ${status('danger')};
    padding: ${pad(0.25)} ${pad(1)};
    border-radius: ${radius('pill')};
    ${typography('microStrong')};
  }

  /* meta 슬롯 — brand · rating · reviews */
  article[data-part="card"][data-card="product"] > [data-slot="meta"] > small {
    color: ${text('mute')}; font-size: var(--ds-text-xs);
  }

  /* checks 슬롯 (tags 재사용) */
  article[data-part="card"][data-card="product"] > [data-slot="checks"] > p[role="list"] {
    display: flex; flex-wrap: wrap; gap: ${pad(0.5)};
    margin: 0;
  }
  article[data-part="card"][data-card="product"] > [data-slot="checks"] > p[role="list"] > span {
    background: color-mix(in oklch, var(--ds-fg) 8%, transparent);
    padding: ${pad(0.25)} ${pad(1)};
    border-radius: ${radius('pill')};
    font-size: var(--ds-text-xs);
  }

  /* footer 슬롯 — 카트 버튼 (자동 하단 고정) */
  article[data-part="card"][data-card="product"] > [data-slot="footer"] {
    margin-block-start: auto;
  }
`
