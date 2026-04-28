import { accent, border, codeSurface, css, hairlineWidth, hierarchy, proximity, radius, text, toneTint, trackingScale, underlineOffset } from '../../tokens/semantic'
import { leading, pad, weight } from '../../tokens/scalar'

/**
 * Prose typography — article[data-flow="prose"] 안 시맨틱 태그.
 *
 * Occam: 모든 시맨틱 태그를 다루되 **특징 한 줄씩만**. 다채로움 ≠ 위계.
 * 대부분의 태그는 reset 기본값에 italic/strike/underline 1개 추가가 전부.
 *
 * 시각 어휘 4단:
 *   text('strong')  — h1·h2, strong, code
 *   neutral()            — body, h3·h4
 *   text('subtle')  — h5, blockquote, em-color (italic 자체로 충분)
 *   text('mute')    — h6, caption, small, marker
 *
 * form 컨트롤(input/select/textarea/button)은 prose 가 다루지 않는다 — form layer 가 owner.
 */
export const cssProse = () => css`
  article[data-flow="prose"] {
    container-type: inline-size;
    container-name: prose;
    inline-size: min(48rem, 100%);
    margin-inline: auto;
    /* L4 surface — article 자체가 surface. mobile에서 viewport 가장자리와 본문이
       붙지 않도록 inline padding으로 호흡 확보. block은 reading rhythm으로 더 큼. */
    padding-block: ${pad(6)};
    padding-inline: ${hierarchy.surface};
    /* 절대 16px — ds chrome dense root(13.5px)에서 분리. reading 표준. */
    font-size: 16px;
    /* 한국어 본문은 1.65 — 영문 1.75보다 살짝 조밀해야 단락이 한 묶음으로 읽힌다. */
    line-height: 1.65;
    color: ${text('strong')};
    word-break: keep-all;
    overflow-wrap: anywhere;
    text-wrap: pretty;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  [data-flow="prose"] ::selection {
    background: ${toneTint('accent', 30)};
    color: ${text('strong')};
  }

  /* ── Vertical rhythm — Gestalt proximity 위계 공식
     ─────────────────────────────────────────────────────
       bonded   — heading → 자기 본문 (자식 관계, 거의 붙음)
       related  — list 안 li ↔ li, dl 안 dt ↔ dd
       sibling  — block ↔ block (p, table, pre, blockquote, figure, hr ...)
       group    — heading 위 (자기 sub-section 시작)
       section  — h2 위, h3 위 (sub-section 진입)
       major    — section ↔ section (큰 호흡)

     모든 article 자손 block 은 sibling 박자가 기본. heading·sectioning 이 자기
     proximity 로 override. ───────────────────────────────────────────────── */

  /* 1) 모든 block-level 자손은 sibling 호흡 기본값. */
  [data-flow="prose"] :is(p, ul, ol, dl, blockquote, pre, table, figure, hr, aside, details) {
    margin-block: ${proximity('sibling')} 0;
  }

  /* 2) heading 자체 위 마진 — 위계 ladder. h1·h2 = section, h3+ = group. */
  [data-flow="prose"] :is(h1, h2) { margin-block-start: ${proximity('section')}; }
  [data-flow="prose"] :is(h3, h4, h5, h6) { margin-block-start: ${proximity('group')}; }

  /* 3) heading → 다음 블록은 bonded (heading 이 자기 본문을 데리고 있다). */
  [data-flow="prose"] :is(h1, h2, h3, h4, h5, h6) + * { margin-block-start: ${proximity('bonded')}; }

  /* 4) section/article 사이는 major (가장 큰 호흡). 안의 첫 heading 은 자체 mt 0 이라 겹치지 않는다. */
  [data-flow="prose"] :is(section, article) { margin-block-start: ${proximity('major')}; }
  [data-flow="prose"] header + :is(section, article) { margin-block-start: ${proximity('major')}; }

  /* 5) 첫 자식 reset — 누적 마진 0. */
  [data-flow="prose"] > :first-child,
  [data-flow="prose"] > :first-child :is(h1, h2, h3, h4, h5, h6),
  [data-flow="prose"] :is(section, article, header, footer, hgroup, aside) > :first-child,
  [data-flow="prose"] :is(section, article, header, footer, hgroup, aside) > :first-child :is(h1, h2, h3, h4, h5, h6) { margin-block-start: 0; }

  [data-flow="prose"] > :last-child { margin-block-end: 0; }

  /* ── Headings — 위계 최소화 ladder. h1·h2·h3 만 size 차이, h4~h6 은 본문 size + weight/color/transform 으로 구분.
     dramatic scale 폐기 — LLM 출력 헤딩 폭격에서도 본문 흐름 안정. */
  [data-flow="prose"] :is(h1, h2, h3, h4, h5, h6) {
    margin-block-end: 0;
    margin-inline: 0;
    text-wrap: balance;
    color: ${text('strong')};
    line-height: 1.35;
    letter-spacing: ${trackingScale('tight')};
  }
  [data-flow="prose"] h1 { font-size: 1.5em;   font-weight: ${weight('bold')}; }
  [data-flow="prose"] h2 { font-size: 1.25em;  font-weight: ${weight('bold')}; }
  [data-flow="prose"] h3 { font-size: 1.125em; font-weight: ${weight('semibold')}; }
  [data-flow="prose"] h4 { font-size: 1em;     font-weight: ${weight('bold')}; }
  [data-flow="prose"] h5 { font-size: 1em;     font-weight: ${weight('semibold')}; color: ${text('subtle')}; }
  [data-flow="prose"] h6 {
    font-size: 1em; font-weight: ${weight('semibold')}; color: ${text('mute')};
    text-transform: uppercase; letter-spacing: ${trackingScale('caps')};
  }


  /* ── hgroup — heading + tagline 묶음, 사이 간격만 좁힘. */
  [data-flow="prose"] hgroup { display: flex; flex-direction: column; gap: ${pad(0.25)}; }
  [data-flow="prose"] hgroup > * { margin: 0; }

  /* ── Lists — 들여쓰기 절제(1.25em). 본문과 시각적으로 한 흐름. */
  [data-flow="prose"] :is(ul, ol) { padding-inline-start: 1.25em; }
  [data-flow="prose"] li + li { margin-block-start: ${proximity('related')}; }
  [data-flow="prose"] li > :is(ul, ol) { margin-block-start: ${proximity('related')}; }
  [data-flow="prose"] li > p { margin: 0; }
  [data-flow="prose"] li > p + p { margin-block-start: ${proximity('related')}; }
  [data-flow="prose"] :is(ul, ol)::marker,
  [data-flow="prose"] li::marker { color: ${text('mute')}; }
  [data-flow="prose"] ol { font-variant-numeric: tabular-nums; }
  /* GFM task list */
  [data-flow="prose"] li:has(> input[type="checkbox"]) {
    list-style: none;
    margin-inline-start: -${pad(2.5)};
  }
  [data-flow="prose"] li > input[type="checkbox"] {
    margin-inline-end: ${pad(0.5)};
    vertical-align: baseline;
  }
  /* ── dl — 정의 리스트는 dt 굵게 / dd 들여쓰기 정도면 충분. */
  [data-flow="prose"] dl { display: flex; flex-direction: column; gap: ${pad(0.5)}; }
  [data-flow="prose"] dt { font-weight: ${weight('semibold')}; color: ${text('strong')}; }
  [data-flow="prose"] dd { padding-inline-start: ${pad(2)}; margin: 0; }

  /* ── Blockquote */
  [data-flow="prose"] blockquote {
    padding-inline-start: 1em;
    border-inline-start: 0.25rem solid ${border()};
    font-style: italic;
    color: ${text('subtle')};
  }

  /* ── Inline code 류 — code·kbd·samp·var·output 모두 동일 톤(monospace + 옅은 surface). */
  [data-flow="prose"] :not(pre) > :is(code, kbd, samp, var, output) {
    font-family: var(--ds-font-mono);
    font-size: 0.875em;
    font-weight: ${weight('regular')};
    padding: 0.1em 0.35em;
    border-radius: ${radius('sm')};
    background: ${codeSurface('inline')};
    color: ${text('strong')};
    overflow-wrap: anywhere;
  }
  [data-flow="prose"] var { font-style: italic; }

  /* ── Code blocks. */
  [data-flow="prose"] pre {
    padding: 0.857em 1.143em;
    border-radius: ${radius('md')};
    background: ${codeSurface('block')};
    overflow-x: auto;
    line-height: 1.7142;
    font-size: 0.875em;
  }
  [data-flow="prose"] pre > code {
    font-family: var(--ds-font-mono);
    background: transparent; padding: 0;
    overflow-wrap: normal;
  }

  /* ── Tables. */
  [data-flow="prose"] table {
    border-collapse: collapse;
    inline-size: 100%;
    font-size: 0.875em;
    line-height: 1.7142;
    font-variant-numeric: tabular-nums;
    display: block;
    overflow-x: auto;
  }
  [data-flow="prose"] :is(th, td) {
    padding: 0.5714em;
    text-align: start;
    vertical-align: top;
  }
  [data-flow="prose"] thead th {
    border-block-end: ${hairlineWidth()} solid ${border()};
    font-weight: ${weight('semibold')};
    color: ${text('subtle')};
  }
  [data-flow="prose"] tbody tr:nth-child(even) td { background: ${codeSurface('zebra')}; }
  [data-flow="prose"] caption {
    caption-side: top; text-align: start;
    color: ${text('subtle')};
    padding-block-end: ${pad(0.5)};
  }
  [data-flow="prose"] tfoot td { color: ${text('mute')}; }

  /* ── Inline emphasis — italic·bold·strike·underline 1개씩. */
  [data-flow="prose"] strong { font-weight: ${weight('semibold')}; color: ${text('strong')}; }
  [data-flow="prose"] :is(em, cite, dfn, i, q) { font-style: italic; }
  [data-flow="prose"] :is(del, s) { text-decoration: line-through; color: ${text('mute')}; }
  [data-flow="prose"] :is(ins, u) { text-decoration: underline; text-underline-offset: ${underlineOffset()}; }
  [data-flow="prose"] abbr[title] { text-decoration: underline dotted; text-underline-offset: ${underlineOffset()}; cursor: help; }
  /* prose 안 mark 는 텍스트 형광펜 — widgets/highlightMark 의 pill-style 을 본문 사이즈로 되돌린다. */
  [data-flow="prose"] mark {
    display: inline;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    white-space: normal;
    background: ${toneTint('warning', 30)};
    color: ${text('strong')};
    padding: 0 ${pad(0.25)};
    border-radius: ${radius('sm')};
  }
  /* 본문 안 인라인 요소는 본문과 같은 글자 크기 — 색·italic 같은 시맨틱만 차이.
     UA 기본 small=0.83em, sub/sup=smaller 를 명시 override. */
  [data-flow="prose"] small { font-size: inherit; color: ${text('mute')}; }
  [data-flow="prose"] :is(sub, sup) { font-size: 0.85em; line-height: 0; position: relative; }
  [data-flow="prose"] sup { vertical-align: super; }
  [data-flow="prose"] sub { vertical-align: sub; }
  [data-flow="prose"] time { font-variant-numeric: tabular-nums; }

  /* ── Links — accent + medium + underline + offset. */
  [data-flow="prose"] a {
    color: ${accent()};
    font-weight: ${weight('medium')};
    text-decoration: underline;
    text-underline-offset: ${underlineOffset()};
    text-decoration-thickness: ${hairlineWidth()};
  }

  /* ── Figures · media — max-inline-size + caption 톤. */
  [data-flow="prose"] figure { margin: 0; }
  [data-flow="prose"] figcaption {
    color: ${text('subtle')};
    font-size: 0.875em;
    margin-block-start: ${pad(0.5)};
  }
  [data-flow="prose"] :is(img, picture, video, audio, iframe, canvas, svg) {
    max-inline-size: 100%;
    block-size: auto;
    border-radius: ${radius('sm')};
  }

  /* ── HR — 섹션 분리. */
  [data-flow="prose"] hr {
    block-size: ${hairlineWidth()};
    background: ${border()};
    border: 0;
    margin-block: ${proximity('major')};
  }

  /* ── details/summary — surface 없이 summary 굵게만. */
  [data-flow="prose"] summary { cursor: pointer; font-weight: ${weight('semibold')}; }

  /* ── aside in prose — pull-quote/sidenote. blockquote 와 같은 톤(border + subtle). */
  [data-flow="prose"] aside {
    padding-inline-start: 1em;
    border-inline-start: 0.25rem solid ${border()};
    color: ${text('subtle')};
  }
  [data-flow="prose"] aside > * { margin: 0; }
  [data-flow="prose"] aside > * + * { margin-block-start: ${proximity('related')}; }

  /* ── nav in prose — link 묶음 (목차/관련 글). list-style 제거 + 가로 랩. */
  [data-flow="prose"] nav ol,
  [data-flow="prose"] nav ul { padding-inline-start: 0; list-style: none; }

  /* ── narrow container (≤600px) — body·padding 축소. */
  @container prose (max-width: 600px) {
    article[data-flow="prose"] { font-size: 15px; line-height: ${leading('normal')}; }
    [data-flow="prose"] :is(ul, ol) { padding-inline-start: ${pad(2)}; }
    [data-flow="prose"] pre { padding: ${pad(1)} ${pad(1.25)}; }
  }
`
