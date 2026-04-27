import { css, radius, surfaceTint, text, typography } from '../tokens/foundations'
import { weight } from '../tokens/palette'
import { dim, pad, tint } from '../tokens/palette'

/**
 * PostCard slot inner styling — Slack/Discord 식 채널 게시판 한 줄.
 * 카드 root layout(flex stack/border)은 parts/card.ts owner.
 *
 * data-card="post" 마커 + data-cont (연속 메시지) 변형.
 */
export const cssPostCard = () => css`
  /* root — 게시판 전용 시각 (flat 한 줄, 호버시 배경 강조).
     Slack 패턴: avatar | (title 위 + body 아래) — grid template areas 가 의도. */
  article[data-part="card"][data-card="post"] {
    border: 0;
    border-radius: 0;
    padding: ${pad(0.5)} ${pad(2)};
    display: grid;
    grid-template-columns: 36px 1fr;
    grid-template-areas:
      "preview title"
      "preview body";
    column-gap: ${pad(2)};
    row-gap: ${pad(0.25)};
    align-items: start;
    transition: background var(--ds-dur-fast) var(--ds-ease-out);
  }
  article[data-part="card"][data-card="post"] > [data-slot="preview"] { grid-area: preview; }
  article[data-part="card"][data-card="post"] > [data-slot="title"]   { grid-area: title; }
  article[data-part="card"][data-card="post"] > [data-slot="body"]    { grid-area: body; }
  /* 연속 post — title 행 collapse, avatar 만 자리 유지(visibility hidden) */
  article[data-part="card"][data-card="post"][data-cont] {
    grid-template-areas: "preview body";
    grid-template-rows: auto;
  }
  article[data-part="card"][data-card="post"]:not([data-cont]) { padding-top: ${pad(2)}; }
  article[data-part="card"][data-card="post"]:hover {
    background: ${surfaceTint('glass')};
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
    background: ${surfaceTint('overlay')};
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

  /* title/body — grid template areas 가 위치 잡음. min-width 0 만 안전 보장. */
  article[data-part="card"][data-card="post"] > [data-slot="title"],
  article[data-part="card"][data-card="post"] > [data-slot="body"] {
    min-inline-size: 0;
  }
  article[data-part="card"][data-card="post"] > [data-slot="title"] > strong {
    font-size: var(--ds-text-md);
  }
  article[data-part="card"][data-card="post"] > [data-slot="title"] > strong > small {
    margin-inline-start: ${pad(1)};
    color: ${text('mute')};
    ${typography('micro')};
  }
  article[data-part="card"][data-card="post"][data-cont] > [data-slot="title"] {
    display: none;
  }
  article[data-part="card"][data-card="post"] > [data-slot="body"] > p {
    margin: 0; line-height: 1.45;
  }
`
