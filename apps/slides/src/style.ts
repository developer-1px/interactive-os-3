import { css, pad } from '@p/ds/tokens/foundations'

/** Minimal PPT 시각 어포던스
 *  - 슬라이드 1장 = 16:9 흰 카드(그림자) — "지금 한 장을 보고 있다"
 *  - 하단 필름스트립 — 미니 16:9 카드들로 "여러 장 중 한 장" 알림
 *  - 그 외 chrome 0 — view-only/CRUD-free */
export const slidesCss = css`
  main[data-part="slides-app"] {
    display: grid;
    grid-template-rows: 1fr auto;
    block-size: 100svh;
    inline-size: 100%;
    background: var(--ds-surface-muted, var(--ds-surface-1));
  }

  /* 스테이지 — 16:9 카드 1장을 가운데 띄움 */
  main[data-part="slides-app"] > section[data-part="slide-stage"] {
    display: grid;
    place-items: center;
    overflow: hidden;
    padding: ${pad(4)};
  }
  main[data-part="slides-app"] > section[data-part="slide-stage"] > article {
    aspect-ratio: 16 / 9;
    inline-size: min(100%, calc((100svh - ${pad(20)}) * 16 / 9));
    max-block-size: calc(100% - ${pad(2)});
    background: var(--ds-surface-1);
    border: 1px solid var(--ds-border-level-1);
    border-radius: 4px;
    box-shadow: 0 8px 32px rgb(0 0 0 / .12);
    padding: ${pad(6)};
    overflow: auto;
  }

  /* 푸터 — 좌측 썸네일 필름스트립, 우측 카운터 */
  main[data-part="slides-app"] > footer[aria-label="슬라이드 네비"] {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: ${pad(3)};
    padding: ${pad(2)} ${pad(4)};
    border-block-start: 1px solid var(--ds-border-level-1);
    background: var(--ds-surface-1);
    font-size: var(--ds-text-sm);
  }

  /* 썸네일 필름스트립 — 미니 16:9 */
  [data-part="thumbnails"] [role="listbox"] {
    display: flex;
    flex-direction: row;
    gap: ${pad(2)};
    overflow-x: auto;
    padding-block: ${pad(1)};
  }
  [data-part="thumbnails"] [role="option"] {
    flex: 0 0 auto;
    aspect-ratio: 16 / 9;
    inline-size: 96px;
    padding: ${pad(1)} ${pad(2)};
    background: var(--ds-surface-1);
    border: 1px solid var(--ds-border-level-1);
    border-radius: 3px;
    color: var(--ds-text-subtle, currentColor);
    font-size: var(--ds-text-xs);
    line-height: 1.2;
    cursor: pointer;
    display: flex;
    align-items: flex-start;
  }
  [data-part="thumbnails"] [role="option"][aria-selected="true"] {
    border-color: var(--ds-text-default);
    color: var(--ds-text-default);
    box-shadow: 0 0 0 1px var(--ds-text-default);
  }
`
