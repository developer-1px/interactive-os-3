import { accent, border, css, dim, fg, font, leading, mix, pad, radius, text, toneTint, weight } from '../../../foundations'
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
  /* root 는 article 에 한정 — layout.ts 의 generic [data-flow="prose"] (gap/align) 와 selector 분리. */
  article[data-flow="prose"] {
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
    line-height: ${leading('tight')};
    font-weight: ${weight('bold')};
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

  /* ── inline emphasis ──────────────────────────────────── */
  [data-flow="prose"] strong { font-weight: ${weight('semibold')}; }
  [data-flow="prose"] em { font-style: italic; }
  [data-flow="prose"] mark {
    background: ${toneTint('warning', 30)};
    color: ${text('strong')};
    padding: 0 ${pad(0.25)};
    border-radius: ${radius('sm')};
  }
  [data-flow="prose"] small { font-size: ${font('sm')}; color: ${dim(60)}; }
  [data-flow="prose"] :is(sub, sup) {
    font-size: ${font('xs')};
    line-height: 0;
    position: relative;
  }
  [data-flow="prose"] sup { vertical-align: super; }
  [data-flow="prose"] sub { vertical-align: sub; }

  /* ── kbd ──────────────────────────────────────────────── */
  [data-flow="prose"] kbd {
    font-family: var(--ds-font-mono);
    font-size: ${font('sm')};
    padding: ${pad(0.25)} ${pad(0.5)};
    background: ${toneTint('accent', 12)};
    border: 1px solid ${border()};
    border-radius: ${radius('sm')};
  }

  /* ── description list ─────────────────────────────────── */
  [data-flow="prose"] dl {
    display: flex;
    flex-direction: column;
    gap: ${pad(1)};
  }
  [data-flow="prose"] dl > dt { font-weight: ${weight('semibold')}; }
  [data-flow="prose"] dl > dd {
    padding-inline-start: ${pad(2)};
    margin: 0;
  }

  /* ── figure / figcaption ──────────────────────────────── */
  [data-flow="prose"] figure { margin: ${pad(2)} 0; }
  [data-flow="prose"] figcaption {
    font-size: ${font('sm')};
    color: ${dim(55)};
    margin-top: ${pad(0.5)};
  }

  /* ── address ──────────────────────────────────────────── */
  [data-flow="prose"] address {
    font-style: italic;
    color: ${dim(60)};
    font-size: ${font('sm')};
  }

  /* ── cite / dfn ───────────────────────────────────────── */
  [data-flow="prose"] :is(cite, dfn) { font-style: italic; }

  /* ── q (quote marks via CSS) ──────────────────────────── */
  [data-flow="prose"] q { quotes: '“' '”' '‘' '’'; }
  [data-flow="prose"] q::before { content: open-quote; }
  [data-flow="prose"] q::after  { content: close-quote; }

  /* ── abbr[title] dotted underline ─────────────────────── */
  [data-flow="prose"] abbr[title] {
    text-decoration: underline dotted;
    text-underline-offset: 2px;
    cursor: help;
  }

  /* ── samp / var ───────────────────────────────────────── */
  [data-flow="prose"] :is(samp, var) {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: .9em;
  }
  [data-flow="prose"] var { font-style: italic; }
  [data-flow="prose"] samp {
    background: ${mix('Canvas', 94, 'CanvasText')};
    padding: 0 ${pad(0.25)};
    border-radius: ${radius('sm')};
  }

  /* ── time ─────────────────────────────────────────────── */
  [data-flow="prose"] time { font-variant-numeric: tabular-nums; }

  /* ── del / ins / s / u ────────────────────────────────── */
  [data-flow="prose"] del { text-decoration: line-through; color: ${dim(55)}; }
  [data-flow="prose"] s   { text-decoration: line-through; color: ${dim(60)}; }
  [data-flow="prose"] ins {
    text-decoration: underline;
    text-decoration-thickness: from-font;
    background: ${toneTint('success', 14)};
  }
  [data-flow="prose"] u   { text-decoration: underline; text-underline-offset: 2px; }

  /* ── bdi / bdo / wbr / br — semantic only, no visual ──── */
  [data-flow="prose"] :is(bdi, bdo) { unicode-bidi: isolate; }

  /* ── hgroup ───────────────────────────────────────────── */
  [data-flow="prose"] hgroup {
    display: flex;
    flex-direction: column;
    gap: ${pad(0.25)};
  }
  [data-flow="prose"] hgroup > :is(h1, h2, h3, h4, h5, h6) { margin: 0; }
  [data-flow="prose"] hgroup > p { margin: 0; }

  /* ── nav / aside in prose ─────────────────────────────── */
  [data-flow="prose"] aside {
    border-inline-start: 3px solid ${border()};
    padding: ${pad(0.5)} ${pad(1)};
    color: ${dim(70)};
    background: ${mix('Canvas', 97, 'CanvasText')};
    border-radius: 0 ${radius('sm')} ${radius('sm')} 0;
  }

  /* ── menu (toolbar) ───────────────────────────────────── */
  [data-flow="prose"] menu {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: ${pad(0.5)};
  }
  [data-flow="prose"] menu > li { margin: 0; }

  /* ── table extras: caption / scope / colgroup ─────────── */
  [data-flow="prose"] caption {
    caption-side: top;
    text-align: start;
    font-size: ${font('sm')};
    color: ${dim(60)};
    padding-block-end: ${pad(0.5)};
  }
  [data-flow="prose"] tfoot td {
    background: ${mix('Canvas', 97, 'CanvasText')};
    color: ${dim(70)};
  }
  [data-flow="prose"] th[scope="row"] {
    background: ${mix('Canvas', 97, 'CanvasText')};
    text-align: start;
  }

  /* ── figure > svg / picture > img ─────────────────────── */
  [data-flow="prose"] figure > svg {
    display: block;
    max-inline-size: 100%;
    block-size: auto;
    color: ${fg()};
  }
  [data-flow="prose"] picture { display: inline-block; }
  [data-flow="prose"] picture > img {
    max-inline-size: 100%;
    block-size: auto;
    border-radius: ${radius('sm')};
  }

  /* ── audio / video / iframe / canvas ──────────────────── */
  [data-flow="prose"] :is(audio, video, iframe, canvas) {
    max-inline-size: 100%;
    border-radius: ${radius('sm')};
  }
  [data-flow="prose"] :is(video, canvas) { display: block; block-size: auto; }
  [data-flow="prose"] iframe { border: 1px solid ${border()}; display: block; }

  /* ── details / summary ────────────────────────────────── */
  [data-flow="prose"] details {
    border: 1px solid ${border()};
    border-radius: ${radius('sm')};
    padding: ${pad(0.5)} ${pad(1)};
    background: ${mix('Canvas', 97, 'CanvasText')};
  }
  [data-flow="prose"] details[open] { background: ${mix('Canvas', 95, 'CanvasText')}; }
  [data-flow="prose"] details > summary {
    cursor: pointer;
    font-weight: ${weight('semibold')};
    list-style-position: inside;
  }
  [data-flow="prose"] details[open] > summary { margin-block-end: ${pad(0.5)}; }

  /* ── output / progress / meter ────────────────────────── */
  [data-flow="prose"] output {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: .9em;
    padding: 0 ${pad(0.25)};
    background: ${toneTint('accent', 12)};
    border-radius: ${radius('sm')};
  }
  [data-flow="prose"] :is(progress, meter) {
    inline-size: 12em;
    block-size: 0.9em;
    vertical-align: middle;
  }

  /* ── form / fieldset / legend / label ─────────────────── */
  [data-flow="prose"] form {
    display: flex;
    flex-direction: column;
    gap: ${pad(1)};
  }
  [data-flow="prose"] fieldset {
    border: 1px solid ${border()};
    border-radius: ${radius('sm')};
    padding: ${pad(1)} ${pad(1.5)};
    margin: 0;
  }
  [data-flow="prose"] legend {
    padding: 0 ${pad(0.5)};
    font-weight: ${weight('semibold')};
    font-size: ${font('sm')};
    color: ${dim(70)};
  }
  [data-flow="prose"] label {
    display: inline-flex;
    align-items: center;
    gap: ${pad(0.5)};
    cursor: pointer;
  }

  /* ── input / select / textarea — minimal native + token border ── */
  [data-flow="prose"] :is(input, select, textarea) {
    font: inherit;
    color: ${fg()};
    background: ${mix('Canvas', 99, 'CanvasText')};
    border: 1px solid ${border()};
    border-radius: ${radius('sm')};
    padding: ${pad(0.35)} ${pad(0.6)};
    min-block-size: 1.8em;
  }
  [data-flow="prose"] textarea { min-block-size: 4em; resize: vertical; }
  [data-flow="prose"] :is(input, select, textarea):focus-visible {
    outline: 2px solid ${accent()};
    outline-offset: 1px;
  }
  [data-flow="prose"] :is(input[type="checkbox"], input[type="radio"]) {
    inline-size: 1em;
    block-size: 1em;
    min-block-size: 0;
    padding: 0;
    accent-color: ${accent()};
  }
  [data-flow="prose"] :is(input[type="range"], input[type="color"]) {
    padding: 0;
    accent-color: ${accent()};
  }

  /* ── button (within prose) ────────────────────────────── */
  [data-flow="prose"] button {
    font: inherit;
    color: ${fg()};
    background: ${mix('Canvas', 95, 'CanvasText')};
    border: 1px solid ${border()};
    border-radius: ${radius('sm')};
    padding: ${pad(0.35)} ${pad(0.85)};
    cursor: pointer;
  }
  [data-flow="prose"] button:hover { background: ${mix('Canvas', 92, 'CanvasText')}; }
  [data-flow="prose"] button:focus-visible {
    outline: 2px solid ${accent()};
    outline-offset: 1px;
  }

  /* ── colgroup / col — width hints handled natively ────── */
  [data-flow="prose"] colgroup, [data-flow="prose"] col { /* native sizing */ }

  /* ── mobile (≤600px) — body 17px로 약간 키우고 패딩 축소 ── */
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    article[data-flow="prose"] {
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
