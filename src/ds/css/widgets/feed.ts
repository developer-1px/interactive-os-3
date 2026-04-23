import { css, pad, radius } from '../../fn'
import { slotGap } from '../../keyline'

export const feedCss = css`
  /* Feed는 states.ts의 subgrid 체인이 grid·row-gap·column·padding을 제공한다.
     article 내부 body 영역과 header 타이포 라인까지 ds가 전부 통제 — 호출부는
     의미적 자식만 넘기면 된다. */
  :where([role="feed"]) article { align-items: start; }
  :where([role="feed"]) article > div { display: grid; row-gap: ${pad(0.5)}; min-width: 0; }
  :where([role="feed"]) header { display: flex; gap: ${slotGap}; align-items: baseline; }
  :where([role="feed"]) article:focus-visible {
    outline: 2px solid var(--ds-accent);
    outline-offset: 2px;
    border-radius: ${radius('sm')};
  }
`
