import { css, keyline, radius, ring } from '../../tokens/foundations'
import { pad } from '../../tokens/palette'

export const cssFeed = () => css`
  /* Feed는 states.ts의 subgrid 체인이 grid·column·padding을 제공하고, 여기서
     행 간격(숨 쉬는 간격)만 덮어쓴다. listbox/menu/tree는 hover 연속을 위해
     dense packing (row-gap: 0) 이 기본. */
  :where([role="feed"]) { row-gap: var(--ds-row-gap); }
  :where([role="feed"]) article { align-items: start; }
  :where([role="feed"]) article > div { display: grid; row-gap: ${pad(0.5)}; min-width: 0; }
  :where([role="feed"]) header { display: flex; gap: ${keyline.slotGap}; align-items: baseline; }
  :where([role="feed"]) article:focus-visible {
    ${ring()}
    border-radius: ${radius('sm')};
  }
`
