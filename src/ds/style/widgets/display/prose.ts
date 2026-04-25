import { css, pad, radius } from '../../../fn/values'
import { mix } from '../../../fn/palette'

/**
 * Prose typography — markdown 렌더링 결과(article[data-flow="prose"])에 자동 적용.
 *
 * Classless: data-flow="prose" 컨테이너 자손 시맨틱 태그(h1~h6, p, ul, ol, blockquote,
 * code, pre, table, hr, img, a)에만 셀렉터 적용. 별도 wrapper class 없이 동작한다.
 *
 * Mobile: 폰트 크기는 --ds-text-* 토큰 기반으로 모바일에서도 그대로 비례. clamp는
 * h1/h2 같은 큰 제목에만 적용해 모바일 폭에서 자연 축소.
 */
export const proseCss = () => css`
  [data-flow="prose"] {
    /* 가독성 폭 — 컨테이너가 더 좁으면 100%를 따른다. */
    max-inline-size: 72ch;
    line-height: 1.65;
    color: var(--ds-fg);
    overflow-wrap: break-word;
  }

  /* ── headings ─────────────────────────────────────────── */
  [data-flow="prose"] :is(h1, h2, h3, h4, h5, h6) {
    line-height: 1.25;
    font-weight: 650;
    margin: ${pad(6)} 0 ${pad(2)};
  }
  [data-flow="prose"] > :is(h1, h2, h3, h4, h5, h6):first-child { margin-block-start: 0; }
  [data-flow="prose"] h1 { font-size: clamp(var(--ds-text-xl), 4vw + 1rem, var(--ds-text-2xl)); }
  [data-flow="prose"] h2 {
    font-size: clamp(var(--ds-text-lg), 2.5vw + 1rem, var(--ds-text-xl));
    border-block-end: 1px solid var(--ds-border);
    padding-block-end: ${pad(1)};
  }
  [data-flow="prose"] h3 { font-size: var(--ds-text-lg); }
  [data-flow="prose"] h4 { font-size: var(--ds-text-md); }
  [data-flow="prose"] h5,
  [data-flow="prose"] h6 { font-size: var(--ds-text-sm); opacity: .8; }

  /* ── flow content ─────────────────────────────────────── */
  [data-flow="prose"] p,
  [data-flow="prose"] ul,
  [data-flow="prose"] ol,
  [data-flow="prose"] blockquote,
  [data-flow="prose"] pre,
  [data-flow="prose"] table,
  [data-flow="prose"] figure,
  [data-flow="prose"] hr { margin: 0; }

  [data-flow="prose"] :is(ul, ol) { padding-inline-start: ${pad(4)}; }
  [data-flow="prose"] li + li { margin-block-start: ${pad(1)}; }
  [data-flow="prose"] li > :is(ul, ol) { margin-block-start: ${pad(1)}; }

  [data-flow="prose"] blockquote {
    padding: ${pad(2)} ${pad(3)};
    border-inline-start: 3px solid var(--ds-accent);
    background: ${mix('Canvas', 96, 'CanvasText')};
    border-radius: 0 ${radius('sm')} ${radius('sm')} 0;
    color: ${mix('CanvasText', 80, 'Canvas')};
  }

  /* ── inline code & pre ────────────────────────────────── */
  [data-flow="prose"] :not(pre) > code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: .9em;
    padding: .1em .4em;
    border-radius: ${radius('sm')};
    background: ${mix('Canvas', 92, 'CanvasText')};
    border: 1px solid var(--ds-border);
  }
  [data-flow="prose"] pre {
    padding: ${pad(3)};
    border-radius: ${radius('md')};
    background: ${mix('Canvas', 94, 'CanvasText')};
    border: 1px solid var(--ds-border);
    overflow-x: auto;
    line-height: 1.5;
    font-size: var(--ds-text-sm);
  }
  [data-flow="prose"] pre > code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  /* ── tables ───────────────────────────────────────────── */
  [data-flow="prose"] table {
    border-collapse: collapse;
    inline-size: 100%;
    font-size: var(--ds-text-sm);
    display: block;
    overflow-x: auto;
  }
  [data-flow="prose"] :is(th, td) {
    padding: ${pad(1)} ${pad(2)};
    border: 1px solid var(--ds-border);
    text-align: start;
  }
  [data-flow="prose"] th { background: ${mix('Canvas', 95, 'CanvasText')}; font-weight: 600; }

  /* ── misc ─────────────────────────────────────────────── */
  [data-flow="prose"] hr {
    block-size: 1px;
    background: var(--ds-border);
    border: 0;
    margin: ${pad(4)} 0;
  }
  [data-flow="prose"] img {
    max-inline-size: 100%;
    block-size: auto;
    border-radius: ${radius('sm')};
  }
  [data-flow="prose"] a {
    color: var(--ds-accent);
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-thickness: from-font;
  }
  [data-flow="prose"] a:hover { text-decoration-thickness: 2px; }

  /* ── mobile tightening ────────────────────────────────── */
  @media (max-width: 600px) {
    [data-flow="prose"] {
      font-size: var(--ds-text-sm);
      line-height: 1.6;
    }
    [data-flow="prose"] :is(ul, ol) { padding-inline-start: ${pad(3)}; }
    [data-flow="prose"] pre { padding: ${pad(2)}; font-size: var(--ds-text-xs); }
    [data-flow="prose"] blockquote { padding: ${pad(1)} ${pad(2)}; }
  }
`
