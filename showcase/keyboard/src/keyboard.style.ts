/**
 * keyboard.style.ts — /keyboard 라우트의 시각 스타일.
 *
 * data-part 네임스페이스:
 *   focus-tracker        상단 sticky 라이브 포커스 표시 (dl, 가로 chip 행)
 *   kb-group             APG 카테고리 묶음 (h2 + caption + sections)
 *   kb-group-caption     카테고리 한 줄 요약
 *   kb-section           개별 부품 fixture (h3 + Row[fixture | shortcut-table])
 *   fixture              부품 라이브 컨테이너 (focus-within 강조)
 *   key-map              부품별 단축키 표
 */
import { css, radius, pair, text, surface, border, accent, typography } from '@p/ds/tokens/semantic'
import { font, weight, pad } from '@p/ds/tokens/scalar'

export const keyboardCss = css`
  /* ── 페이지 root ─────────────────────────────────────────── */
  [aria-label="키보드 인터랙션 검증"] {
    max-inline-size: 1080px;
    margin-inline: auto;
    padding: ${pad(4)};
  }

  /* ── focus tracker (상단 sticky 라이브 정보) ───────────────── */
  [data-part="focus-tracker"] {
    position: sticky;
    inset-block-start: ${pad(2)};
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    column-gap: ${pad(3)};
    margin: 0 0 ${pad(4)};
    padding: ${pad(2)} ${pad(3)};
    border: 1px solid ${border()};
    border-radius: ${radius('md')};
    ${pair({ bg: surface('default'), fg: text('strong') })}
  }
  [data-part="focus-tracker"] dt {
    grid-row: 1;
    color: ${text('subtle')};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: ${font('xs')};
  }
  [data-part="focus-tracker"] dd {
    grid-row: 2;
    margin: 0;
    font-family: var(--ds-font-mono);
    font-size: ${font('sm')};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── group (APG 카테고리) ─────────────────────────────────── */
  [data-part="kb-group"] {
    display: flex;
    flex-direction: column;
    gap: ${pad(3)};
    margin-block-end: ${pad(5)};
  }
  [data-part="kb-group"] > header {
    display: flex;
    flex-direction: column;
    gap: ${pad(0)};
    padding-block-end: ${pad(1)};
    border-block-end: 1px solid ${border()};
  }
  [data-part="kb-group"] > header h2 {
    margin: 0;
    ${typography('headingStrong')}
    color: ${text('strong')};
  }
  [data-part="kb-group-caption"] {
    margin: 0;
    ${typography('caption')}
    color: ${text('subtle')};
  }

  /* ── section (개별 부품) ──────────────────────────────────── */
  [data-part="kb-section"] {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) minmax(280px, 1.4fr);
    column-gap: ${pad(3)};
    row-gap: ${pad(1)};
    align-items: start;
    padding: ${pad(2)};
    border: 1px solid ${border()};
    border-radius: ${radius('sm')};
    ${pair({ bg: surface('default'), fg: text('strong') })}
  }
  [data-part="kb-section"] h3 {
    grid-column: 1 / -1;
    margin: 0;
    ${typography('microStrong')}
    color: ${text('subtle')};
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  /* Row(fixture | shortcut-table) — section subgrid */
  [data-part="kb-section"] > [data-ds="Row"] {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    column-gap: ${pad(3)};
    align-items: start;
  }

  /* ── fixture (라이브 컨테이너) ────────────────────────────── */
  [data-part="fixture"] {
    min-block-size: 96px;
    padding: ${pad(2)};
    border: 1px dashed ${border()};
    border-radius: ${radius('sm')};
    ${pair({ bg: surface('subtle'), fg: text('strong') })}
    transition: border-color 120ms ease, box-shadow 120ms ease;
    overflow: auto;
  }
  [data-part="fixture"][data-focused] {
    border-style: solid;
    border-color: ${border('focus')};
    box-shadow: 0 0 0 3px ${accent('soft')};
  }

  /* ── shortcut table ──────────────────────────────────────── */
  [data-part="key-map"] {
    inline-size: 100%;
    border-collapse: collapse;
    ${typography('caption')}
  }
  [data-part="key-map"] thead th {
    text-align: start;
    padding: ${pad(0)} ${pad(1)};
    color: ${text('subtle')};
    font-weight: ${weight('regular')};
    font-size: ${font('xs')};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-block-end: 1px solid ${border()};
  }
  [data-part="key-map"] tbody th {
    text-align: end;
    padding: ${pad(1)};
    inline-size: 32%;
    font-weight: ${weight('regular')};
    color: ${text('strong')};
    vertical-align: top;
  }
  [data-part="key-map"] tbody td {
    padding: ${pad(1)};
    color: ${text('strong')};
    vertical-align: top;
  }
  [data-part="key-map"] kbd {
    display: inline-block;
    padding: 1px ${pad(1)};
    border: 1px solid ${border()};
    border-block-end-width: 2px;
    border-radius: ${radius('sm')};
    ${pair({ bg: surface('default'), fg: text('strong') })}
    font-family: var(--ds-font-mono);
    font-size: ${font('xs')};
    line-height: 1.4;
  }
`
