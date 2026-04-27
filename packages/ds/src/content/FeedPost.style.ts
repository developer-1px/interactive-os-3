import { css, dim, pad, radius, weight } from '../tokens/foundations'

/**
 * FeedPost slot inner styling — SNS 피드 포스트 카드.
 * 카드 root layout(flex stack/border)은 parts/card.ts owner.
 */
export const feedPost = () => css`
  article[data-part="card"][data-card="feed-post"] {
    border-radius: ${radius('lg')};
  }

  /* title 슬롯 — header (avatar + name/handle/time + more) */
  article[data-part="card"][data-card="feed-post"] > [data-slot="title"] > header {
    display: flex; align-items: center; gap: ${pad(2)};
  }
  article[data-part="card"][data-card="feed-post"] > [data-slot="title"] > header > strong[data-ds-aspect="square"] {
    inline-size: 40px;
    border-radius: ${radius('pill')};
    overflow: hidden;
    flex: none;
    background: color-mix(in oklch, var(--ds-fg) 8%, transparent);
  }
  article[data-part="card"][data-card="feed-post"] > [data-slot="title"] > header > strong[data-ds-aspect="square"] > img {
    inline-size: 100%; block-size: 100%; object-fit: cover; display: block;
  }
  article[data-part="card"][data-card="feed-post"] > [data-slot="title"] > header > strong:nth-of-type(2) {
    flex: 1; min-inline-size: 0;
  }
  article[data-part="card"][data-card="feed-post"] > [data-slot="title"] > header > strong:nth-of-type(2) > small {
    display: block;
    font-weight: ${weight('regular')};
    color: ${dim(55)};
    font-size: var(--ds-text-xs);
    margin-block-start: ${pad(0.25)};
  }

  /* body 슬롯 — 텍스트 + 이미지 */
  article[data-part="card"][data-card="feed-post"] > [data-slot="body"] > p {
    margin: 0; line-height: 1.45;
  }
  article[data-part="card"][data-card="feed-post"] > [data-slot="body"] > p > img {
    inline-size: 100%; block-size: auto; display: block;
    border-radius: ${radius('md')};
    aspect-ratio: 16 / 9; object-fit: cover;
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
  }

  /* footer 슬롯 — reaction toolbar */
  article[data-part="card"][data-card="feed-post"] > [data-slot="footer"] > footer[role="toolbar"] {
    display: flex; gap: ${pad(2)};
  }
`
