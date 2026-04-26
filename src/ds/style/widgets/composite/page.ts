import { css, pad, dim, radius, tint } from '../../../foundations'

// Chat / Board / Feed / Shop — *-page 패밀리 컨테이너 + side-collapse 패턴.
// (개별 카드/버블 시각은 widgets/pattern/* owner. 여기는 page 컨테이너만.)
export const pageCss = css`
  /* Chat 메시지 버블 — me/other 정렬은 messageBubble.ts owner. */
  [aria-roledescription="chat-page"] [data-emphasis="sunk"]:has([aria-roledescription^="message-"]) {
    gap: ${pad(1.5)};
    align-items: stretch;
  }

  /* Board (Slack/Discord) — sidebar 채널 리스트 + 게시판형 채널 타임라인. */
  [aria-roledescription="board-page"] [aria-roledescription="board-nav"] {
    padding: ${pad(2)};
    gap: ${pad(2)};
  }
  [aria-roledescription="board-page"] [aria-roledescription="board-nav"] > h3 {
    font-size: var(--ds-text-md); font-weight: 700; margin: 0;
  }
  [aria-roledescription="board-page"] [aria-roledescription="board-nav"] > small {
    color: ${dim(55)}; font-size: var(--ds-text-xs);
  }
  [aria-roledescription="board-page"] button[data-board-ch] {
    justify-content: flex-start;
    background: transparent; border: 0; padding: ${pad(1)} ${pad(2)};
    color: inherit; font-weight: 400;
    border-radius: ${radius('md')};
  }
  [aria-roledescription="board-page"] button[data-board-ch][aria-pressed="true"] {
    background: var(--ds-accent);
    color: var(--ds-accent-on);
  }
  [aria-roledescription="board-page"] button[data-board-ch] > small {
    margin-inline-start: auto;
    background: ${tint('CanvasText', 12)};
    border-radius: ${radius('pill')};
    padding: 0 ${pad(1)};
    font-size: var(--ds-text-xs);
  }
  [aria-roledescription="board-page"] [aria-roledescription="board-stream"] {
    overflow-y: auto;
  }
  [aria-roledescription="board-page"] [aria-roledescription="board-posts"] {
    gap: 0;
    padding: ${pad(2)} 0;
  }

  /* Side-collapse 패턴 — Row[side|main|right] 구조 페이지에서 좁은 viewport시
     좌·우 보조 컬럼 숨기고 [data-collapse-menu-btn] 노출. *-page 일괄 적용. */
  [aria-roledescription$="-page"] {
    container-type: inline-size;
    container-name: collapse-sides;
    align-items: stretch;
    justify-content: flex-start;
    padding: ${pad(4)};
    gap: ${pad(4)};
    min-height: 100dvh;
    box-sizing: border-box;
  }
  [aria-roledescription$="-page"] [data-collapse-menu-btn] { display: none; }
  @container collapse-sides (inline-size < 48rem) {
    /* grow 없는 보조 Column(filters/side/right)만 숨김 — main은 grow 보유라 살아남음. */
    [aria-roledescription$="-page"] > [data-ds="Column"]:not([data-ds-grow]) {
      display: none;
    }
    [aria-roledescription$="-page"] [data-collapse-menu-btn] {
      display: inline-flex;
    }
    [aria-roledescription$="-page"] > [data-ds="Column"][data-ds-grow] {
      width: 100%; min-width: 0;
    }
    [aria-roledescription$="-page"] {
      padding: ${pad(2)};
      gap: ${pad(2)};
      max-width: 640px; margin-inline: auto;
    }
  }

  /* Feed 카드 — avatar 원형, body 줄높이, reaction toolbar 정렬 */
  [aria-roledescription="feed-page"] [role="article"],
  [aria-roledescription="feed-page"] [data-emphasis="raised"] {
    border-radius: ${radius('lg')};
  }
  [aria-roledescription$="-page"] [data-flow="cluster"] > strong[data-ds-aspect="square"] {
    border-radius: 50%;
    overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center;
    background: color-mix(in oklch, var(--ds-fg) 8%, transparent);
    font-size: var(--ds-text-md);
  }
  [aria-roledescription$="-page"] [data-flow="cluster"] > strong[data-ds-aspect="square"] > img {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  [aria-roledescription$="-page"] [data-flow="cluster"] > strong[data-ds-grow] > small {
    display: block;
    font-weight: 400;
    color: ${dim(55)};
    font-size: var(--ds-text-xs);
    margin-top: ${pad(0.25)};
  }
  /* 포스트/카드 본문 이미지 — 카드 폭 채우고 라운딩 + aspect 보존 */
  [aria-roledescription$="-page"] [data-emphasis="raised"] > p > img {
    width: 100%; height: auto; display: block;
    border-radius: ${radius('md')};
    aspect-ratio: 16 / 9; object-fit: cover;
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
  }
  /* Shop 카드의 첫 텍스트 슬롯이 이미지일 때 — 정사각형 비율, 카드 라운딩 동기화 */
  [aria-roledescription="shop-page"] [data-emphasis="raised"] > p:first-child {
    margin: 0; padding: 0;
  }
  [aria-roledescription="shop-page"] [data-emphasis="raised"] > p:first-child > img {
    width: 100%; height: auto; display: block;
    aspect-ratio: 1 / 1; object-fit: cover;
    border-radius: ${radius('md')};
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
  }
`
