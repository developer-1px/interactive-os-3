import { accent, border, css, fg, pad, radius } from '../../../fn/values'
import { mix } from '../../../fn/palette'
import { SHELL_MOBILE_MAX } from '../../preset/breakpoints'

/**
 * Prose typography — markdown 렌더링 결과(article[data-flow="prose"])에 자동 적용.
 *
 * 스케일은 DS chrome 토큰(--ds-text-*)이 아니라 prose 전용 변수로 분리한다.
 * - DS chrome은 dense(13.5px body)지만 prose body는 reading 표준 16~17px이 de facto.
 * - 참고 수렴: GitHub README 16/24 leading, Tailwind Typography prose-base 16/28,
 *   MDN/Mozilla 16, Medium 18~21, iOS HIG body 17. → 데스크톱 16.5px / 모바일 17px.
 *   (모바일을 더 키워 Safari 자동 zoom 회피선 16px 위로 올림.)
 * - Modular scale 1.250(major third)로 위계 6단계: h1=2.488em / h2=1.953 / h3=1.563
 *   / h4=1.25 / h5=1.0 (강조용) / h6=0.85 (microlabel).
 *
 * Classless: data-flow="prose" 컨테이너 자손 시맨틱 태그(h1~h6, p, ul, ol, blockquote,
 * code, pre, table, hr, img, a)에만 셀렉터 적용. 별도 wrapper class 없이 동작한다.
 */
export const proseCss = () => css`
  [data-flow="prose"] {
    --prose-body: 16.5px;
    --prose-leading: 1.7;
    --prose-rhythm: 1.25em;          /* 블록 사이 vertical rhythm */

    max-inline-size: 72ch;
    font-size: var(--prose-body);
    line-height: var(--prose-leading);
    color: ${fg()};
    overflow-wrap: break-word;
    -webkit-text-size-adjust: 100%;
  }

  /* ── 블록 vertical rhythm — adjacent-sibling으로 일괄 ─── */
  [data-flow="prose"] > * + * { margin-block-start: var(--prose-rhythm); }

  /* ── headings (modular scale 1.250) ───────────────────── */
  [data-flow="prose"] :is(h1, h2, h3, h4, h5, h6) {
    line-height: 1.25;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin: 0;
    color: ${fg()};
  }
  [data-flow="prose"] > :is(h1, h2, h3, h4, h5, h6) { margin-block-start: 2em; }
  [data-flow="prose"] > :is(h1, h2, h3, h4, h5, h6):first-child { margin-block-start: 0; }
  /* heading 다음 본문은 좁은 간격 — 위계 강조 */
  [data-flow="prose"] :is(h1, h2, h3, h4, h5, h6) + * { margin-block-start: .6em !important; }

  [data-flow="prose"] h1 {
    font-size: clamp(1.875rem, 1.4rem + 2.4vw, 2.5rem);     /* 30 → 40px */
    line-height: 1.15;
    letter-spacing: -0.02em;
    border-block-end: 2px solid ${border()};
    padding-block-end: .35em;
  }
  [data-flow="prose"] h2 {
    font-size: clamp(1.5rem, 1.2rem + 1.6vw, 1.953rem);     /* 24 → 31px */
    border-block-end: 1px solid ${border()};
    padding-block-end: .3em;
  }
  [data-flow="prose"] h3 { font-size: clamp(1.25rem, 1.1rem + .8vw, 1.563rem); }  /* 20 → 25 */
  [data-flow="prose"] h4 { font-size: 1.25em; font-weight: 650; }                 /* 20 */
  [data-flow="prose"] h5 { font-size: 1em;    font-weight: 700; }                 /* 16.5 */
  [data-flow="prose"] h6 {
    font-size: .85em; font-weight: 700;
    text-transform: uppercase; letter-spacing: .06em; opacity: .75;
  }

  /* ── lists ────────────────────────────────────────────── */
  [data-flow="prose"] :is(ul, ol) { padding-inline-start: 1.6em; }
  [data-flow="prose"] li + li { margin-block-start: .35em; }
  [data-flow="prose"] li > :is(ul, ol) { margin-block-start: .35em; }
  [data-flow="prose"] li > p { margin: 0; }
  [data-flow="prose"] li > p + p { margin-block-start: .5em; }
  /* 리스트 마커 색 */
  [data-flow="prose"] :is(ul, ol)::marker,
  [data-flow="prose"] li::marker { color: ${mix('CanvasText', 60, 'Canvas')}; }

  /* ── blockquote ───────────────────────────────────────── */
  [data-flow="prose"] blockquote {
    padding: .6em 1em;
    border-inline-start: 4px solid ${accent()};
    background: ${mix('Canvas', 96, 'CanvasText')};
    border-radius: 0 ${radius('sm')} ${radius('sm')} 0;
    color: ${mix('CanvasText', 80, 'Canvas')};
    font-style: italic;
  }
  [data-flow="prose"] blockquote > :first-child { margin-block-start: 0; }

  /* ── inline code & pre ────────────────────────────────── */
  [data-flow="prose"] :not(pre) > code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: .875em;
    padding: .15em .4em;
    border-radius: ${radius('sm')};
    background: ${mix('Canvas', 92, 'CanvasText')};
    border: 1px solid ${border()};
    word-break: break-word;
  }
  [data-flow="prose"] pre {
    padding: 1em 1.1em;
    border-radius: ${radius('md')};
    background: ${mix('Canvas', 94, 'CanvasText')};
    border: 1px solid ${border()};
    overflow-x: auto;
    line-height: 1.55;
    font-size: .9375em;             /* ~15.5px */
    -webkit-overflow-scrolling: touch;
  }
  [data-flow="prose"] pre > code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    background: transparent; border: 0; padding: 0;
  }

  /* ── tables ───────────────────────────────────────────── */
  [data-flow="prose"] table {
    border-collapse: collapse;
    inline-size: 100%;
    font-size: .9375em;
    display: block;
    overflow-x: auto;
  }
  [data-flow="prose"] :is(th, td) {
    padding: .5em .75em;
    border: 1px solid ${border()};
    text-align: start;
    vertical-align: top;
  }
  [data-flow="prose"] th {
    background: ${mix('Canvas', 95, 'CanvasText')};
    font-weight: 700;
  }

  /* ── misc ─────────────────────────────────────────────── */
  [data-flow="prose"] hr {
    block-size: 1px;
    background: ${border()};
    border: 0;
    margin-block: 2em;
  }
  [data-flow="prose"] img {
    max-inline-size: 100%;
    block-size: auto;
    border-radius: ${radius('sm')};
  }
  [data-flow="prose"] a {
    color: ${accent()};
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-thickness: from-font;
  }
  [data-flow="prose"] a:hover { text-decoration-thickness: 2px; }

  /* ── mobile (≤600px) — body 17px로 약간 키우고 패딩 축소 ── */
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    [data-flow="prose"] {
      --prose-body: 17px;
      --prose-leading: 1.65;
      --prose-rhythm: 1.15em;
    }
    [data-flow="prose"] :is(ul, ol) { padding-inline-start: 1.35em; }
    [data-flow="prose"] pre { padding: .85em .9em; font-size: .875em; }
    [data-flow="prose"] blockquote { padding: .5em .85em; }
    [data-flow="prose"] :is(th, td) { padding: .45em .6em; }
  }
`
