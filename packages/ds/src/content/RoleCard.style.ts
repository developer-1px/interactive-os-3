import { css, text, typography } from '../tokens/foundations'
import { font, weight } from '../tokens/palette'
import { dim, pad } from '../tokens/palette'

/**
 * RoleCard slot inner styling — drag handle + icon + 본문/액션.
 * 카드 root layout(flex stack/border)은 parts/card.ts owner.
 */
export const cssRoleCard = () => css`
  /* preview 슬롯 — drag handle + icon 가로 묶음 (작은 줄). 일반 preview override. */
  article[data-part="card"][data-card="role"] > [data-slot="preview"] {
    min-block-size: 0;
    padding: 0;
    border: 0;
    background: transparent;
    align-self: start;
  }
  article[data-part="card"][data-card="role"] > [data-slot="preview"] > figure {
    margin: 0;
    display: flex; align-items: center; gap: ${pad(2)};
  }
  article[data-part="card"][data-card="role"] > [data-slot="preview"] > figure > button[aria-label*="드래그"] {
    padding: ${pad(0.5)};
    background: transparent; border: 0;
    color: ${text('mute')};
    font-size: ${font('lg')};
    line-height: 1;
    cursor: grab;
  }
  article[data-part="card"][data-card="role"] > [data-slot="preview"] > figure > button[aria-label*="드래그"]:hover { color: ${text('subtle')}; }
  article[data-part="card"][data-card="role"] > [data-slot="preview"] > figure > button[aria-label*="드래그"]:active { cursor: grabbing; }
  article[data-part="card"][data-card="role"] > [data-slot="preview"] > figure > span {
    font-size: ${font('xl')};
    line-height: 1;
    inline-size: 28px;
    text-align: center;
  }

  /* title 슬롯 — h3 + 우측 meta+actions */
  article[data-part="card"][data-card="role"] > [data-slot="title"] > header {
    display: flex; align-items: center; justify-content: space-between;
    gap: ${pad(2)};
  }
  article[data-part="card"][data-card="role"] > [data-slot="title"] [data-part="heading"][data-level="h3"] {
    margin: 0;
    ${typography('bodyStrong')}
  }
  article[data-part="card"][data-card="role"] > [data-slot="title"] > header > div {
    display: flex; align-items: center; gap: ${pad(1)};
  }

  /* body 슬롯 — desc */
  article[data-part="card"][data-card="role"] > [data-slot="body"] > p {
    margin: 0;
    font-size: ${font('sm')};
    color: ${text('mute')};
    line-height: 1.5;
  }
`
