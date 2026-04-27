import { css, hierarchy, radius, surface, text, typography, weight } from '../../../tokens/foundations'
import { pad } from '../../../tokens/palette'

// Chat / Board / Feed / Shop — *-page 패밀리 컨테이너 + side-collapse 패턴.
// (개별 카드/버블 시각은 widgets/pattern/* owner. 여기는 page 컨테이너만.)
export const cssPage = () => css`
  /* Chat 메시지 버블 — me/other 정렬은 messageBubble.ts owner. */
  [data-part="chat-page"] [data-emphasis="sunk"]:has([data-part^="message-"]) {
    gap: ${pad(1.5)};
    align-items: stretch;
  }

  /* Board (Slack/Discord) — sidebar 채널 리스트 + 게시판형 채널 타임라인. */
  [data-part="board-page"] [data-part="board-nav"] {
    padding: ${pad(2)};
    gap: ${pad(2)};
  }
  [data-part="board-page"] [data-part="board-nav"] > h3 {
    ${typography('bodyStrong')}; margin: 0;
  }
  [data-part="board-page"] [data-part="board-nav"] > small {
    color: ${text('subtle')}; font-size: var(--ds-text-xs);
  }
  [data-part="board-page"] button[data-board-ch] {
    justify-content: flex-start;
    background: transparent; border: 0; padding: ${pad(1)} ${pad(2)};
    color: inherit; font-weight: ${weight('regular')};
    border-radius: ${radius('md')};
  }
  [data-part="board-page"] button[data-board-ch][aria-pressed="true"] {
    background: var(--ds-accent);
    color: var(--ds-accent-on);
  }
  [data-part="board-page"] button[data-board-ch] > small {
    margin-inline-start: auto;
    background: ${surface('muted')};
    border-radius: ${radius('pill')};
    padding: 0 ${pad(1)};
    font-size: var(--ds-text-xs);
  }
  [data-part="board-page"] [data-part="board-stream"] {
    overflow-y: auto;
  }
  /* board-posts — 게시물 collection (Slack 스타일).
     post(다른 작성자):  L3 section gap. avatar + header(name+time) + body 풀 렌더.
     post-cont(같은 작성자 연속):  L0 atom 회수. avatar/header 시각 숨김 (alignment 유지를
       위해 visibility:hidden — 자리는 보존 → body가 직전과 동일 인덴트로 흐름). */
  [data-part="board-page"] [data-part="board-posts"] {
    gap: ${hierarchy.section};
    padding: ${hierarchy.surface} 0;
  }
  [data-part="board-page"] [data-part="board-posts"] > [data-part="post-cont"] {
    margin-block-start: calc(${hierarchy.atom} - ${hierarchy.section});
  }
  /* post-cont의 첫 자식 = 아바타(Text strong width:36), 두 번째 = column(name+body).
     아바타 자리 보존하되 시각 제거. column 안 첫 줄(name+time)도 시각 제거. */
  [data-part="post-cont"] > :first-child {
    visibility: hidden;
  }
  [data-part="post-cont"] > :nth-child(2) > :first-child {
    display: none;
  }

  /* Side-collapse 패턴 — Row[side|main|right] 구조 페이지에서 좁은 viewport시
     좌·우 보조 컬럼 숨기고 [data-collapse-menu-btn] 노출. *-page 일괄 적용. */
  [data-part$="-page"] {
    container-type: inline-size;
    container-name: collapse-sides;
    align-items: stretch;
    justify-content: flex-start;
    /* L5 shell — surface↔surface (sidebar↔main 간격, 페이지 외곽). hierarchy 공식 정합. */
    padding: ${hierarchy.shell};
    gap: ${hierarchy.shell};
    min-height: 100dvh;
    box-sizing: border-box;
  }
  [data-part$="-page"] [data-collapse-menu-btn] { display: none; }
  @container collapse-sides (inline-size < 48rem) {
    /* grow 없는 보조 Column(filters/side/right)만 숨김 — main은 grow 보유라 살아남음. */
    [data-part$="-page"] > [data-ds="Column"]:not([data-ds-grow]) {
      display: none;
    }
    [data-part$="-page"] [data-collapse-menu-btn] {
      display: inline-flex;
    }
    [data-part$="-page"] > [data-ds="Column"][data-ds-grow] {
      width: 100%; min-width: 0;
    }
    [data-part$="-page"] {
      /* mobile: L4 surface로 스텝다운 (shell이 좁은 viewport에 비해 과함) */
      padding: ${hierarchy.surface};
      gap: ${hierarchy.surface};
      max-width: 640px; margin-inline: auto;
    }
  }

  /* Feed 카드 — avatar 원형, body 줄높이, reaction toolbar 정렬 */
  [data-part="feed-page"] [role="article"],
  [data-part="feed-page"] [data-emphasis="raised"] {
    border-radius: ${radius('lg')};
  }
  [data-part$="-page"] [data-flow="cluster"] > strong[data-ds-aspect="square"] {
    border-radius: ${radius('pill')};
    overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center;
    background: color-mix(in oklch, var(--ds-fg) 8%, transparent);
    font-size: var(--ds-text-md);
  }
  [data-part$="-page"] [data-flow="cluster"] > strong[data-ds-aspect="square"] > img {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  [data-part$="-page"] [data-flow="cluster"] > strong[data-ds-grow] > small {
    display: block;
    font-weight: ${weight('regular')};
    color: ${text('subtle')};
    font-size: var(--ds-text-xs);
    margin-top: ${pad(0.25)};
  }
  /* 포스트/카드 본문 이미지 — 카드 폭 채우고 라운딩 + aspect 보존 */
  [data-part$="-page"] [data-emphasis="raised"] > p > img {
    width: 100%; height: auto; display: block;
    border-radius: ${radius('md')};
    aspect-ratio: 16 / 9; object-fit: cover;
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
  }
  /* Shop 카드의 첫 텍스트 슬롯이 이미지일 때 — 정사각형 비율, 카드 라운딩 동기화 */
  [data-part="shop-page"] [data-emphasis="raised"] > p:first-child {
    margin: 0; padding: 0;
  }
  [data-part="shop-page"] [data-emphasis="raised"] > p:first-child > img {
    width: 100%; height: auto; display: block;
    aspect-ratio: 1 / 1; object-fit: cover;
    border-radius: ${radius('md')};
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
  }
`
