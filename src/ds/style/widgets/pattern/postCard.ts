import { css, dim, pad, radius, tint } from '../../../foundations'

/**
 * PostCard slot inner styling — Slack/Discord 식 채널 게시판 한 줄.
 * 카드 root layout(flex stack/border)은 parts/card.ts owner.
 *
 * data-card="post" 마커 + data-cont (연속 메시지) 변형.
 */
export const postCard = () => css`
  /* root — 게시판 전용 시각 (flat 한 줄, 호버시 배경 강조) */
  article[data-part="card"][data-card="post"] {
    border: 0;
    border-radius: 0;
    padding: ${pad(0.5)} ${pad(2)};
    flex-direction: row;
    align-items: flex-start;
    gap: ${pad(2)};
    transition: background var(--ds-dur-fast) var(--ds-ease-out);
  }
  article[data-part="card"][data-card="post"]:not([data-cont]) { padding-top: ${pad(2)}; }
  article[data-part="card"][data-card="post"]:hover {
    background: ${tint('CanvasText', 4)};
    box-shadow: none;
    border-color: transparent;
  }

  /* preview 슬롯 — avatar 36x36 라운드 사각. 일반 preview override. */
  article[data-part="card"][data-card="post"] > [data-slot="preview"] {
    min-block-size: 0;
    padding: 0;
    border: 0;
    background: transparent;
    inline-size: 36px;
    flex: none;
  }
  article[data-part="card"][data-card="post"] > [data-slot="preview"] > strong[data-ds-aspect="square"] {
    inline-size: 100%;
    border-radius: ${radius('md')};
    overflow: hidden;
    background: ${tint('CanvasText', 8)};
    display: block;
  }
  article[data-part="card"][data-card="post"] > [data-slot="preview"] > strong[data-ds-aspect="square"] > img {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  /* 연속 post — avatar 자리만 비우고 시각 숨김 */
  article[data-part="card"][data-card="post"][data-cont] > [data-slot="preview"] > strong[data-ds-aspect="square"] {
    visibility: hidden;
    background: transparent;
  }

  /* title/body — 본문 컬럼 (root flex-direction:row 라서 슬롯 그룹은 flex-direction:column) */
  article[data-part="card"][data-card="post"] > [data-slot="title"],
  article[data-part="card"][data-card="post"] > [data-slot="body"] {
    flex: 1; min-inline-size: 0;
  }
  article[data-part="card"][data-card="post"] > [data-slot="title"] > strong {
    font-size: var(--ds-text-md);
  }
  article[data-part="card"][data-card="post"] > [data-slot="title"] > strong > small {
    margin-inline-start: ${pad(1)};
    color: ${dim(55)};
    font-weight: 400;
    font-size: var(--ds-text-xs);
  }
  article[data-part="card"][data-card="post"][data-cont] > [data-slot="title"] {
    display: none;
  }
  article[data-part="card"][data-card="post"] > [data-slot="body"] > p {
    margin: 0; line-height: 1.45;
  }
`
