import { accent, border, control, css, dim, dur, ease, focusRingWidth, font, hairlineWidth, neutral, onAccent, pad, radius, status, tint, tracking } from '../../../tokens/foundations'
/**
 * Form 시각 계층 — Field / Section 헤딩 / Aside 서피스의 구성 계약.
 *
 * 계층 (강→약):
 *   1. Section h2 ("영상 파일", "기본 정보")        — 페이지 주 섹션. 큰 text-lg + 하단 분리선.
 *   2. Section h3 (Aside 내부 "게시 예약", "노출 설정") — 서브 섹션. 중간.
 *   3. fieldset <strong> legend ("역할", "코스")    — 필드셋 묶음 라벨. 적당.
 *   4. Field <label>                               — 필드 개별 라벨. 작고 weight 600.
 *   5. FieldDescription <p>                        — 보조 설명. sm + dim(55).
 *
 * Aside(게시 설정 측면 패널)는 neutral-1 서피스 + radius로 main 폼과 시각 분리.
 */
export const formCss = css`
  /* ── 2026 form 읽기 폭 제약 ─────────────────────────────────────────
     Row flow="form" 안의 grow 자식(보통 main Column)이 전폭으로 뻗으면 입력 라인이
     너무 길어 시선이 흐트러진다. Linear/Notion/Vercel 모두 form main을 720px 안팎으로
     제한. Aside가 같이 있으면 둘 사이 gap은 form Row가 담당. */
  [data-ds="Row"][data-flow="form"] > [data-ds-grow="true"] {
    max-inline-size: 720px;
  }

  /* ── Field — 기본은 세로 스택. 라벨이 위, 컨트롤이 아래, 설명이 그 아래 ───── */
  [role="group"][data-part="field"] {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: ${pad(1)};
    min-inline-size: 0;
    grid-template-columns: none;
  }
  [role="group"][data-part="field"] > label {
    font-size: ${font('sm')};
    font-weight: 600;
    color: ${dim(85)};
    line-height: 1.3;
  }
  [role="group"][data-part="field"][aria-required="true"] > label::after {
    content: ' *';
    color: ${status('danger')};
    font-weight: 400;
  }
  [role="group"][data-part="field"] > p {
    font-size: ${font('xs')};
    color: ${dim(55)};
    margin: 0;
    line-height: 1.4;
  }
  [role="group"][data-part="field"] > input,
  [role="group"][data-part="field"] > select,
  [role="group"][data-part="field"] > textarea {
    inline-size: 100%;
  }

  /* ── input[type="file"] — UA 기본 "파일 선택 / 선택된 파일 없음" 대신
     dashed 드롭존 + 내부 버튼을 ds Button과 동일 톤으로 정렬 ───────────── */
  :where(input[type="file"]) {
    inline-size: 100%;
    padding: ${pad(3)};
    background: ${neutral(1)};
    border: ${hairlineWidth()} dashed ${neutral(4)};
    border-radius: ${radius('md')};
    font-size: ${font('sm')};
    color: ${dim(65)};
    cursor: pointer;
    transition: background-color ${dur('fast')} ${ease('out')},
                border-color ${dur('fast')} ${ease('out')};
  }
  :where(input[type="file"]):hover {
    background: ${tint(accent(), 4)};
    border-color: ${tint(accent(), 50)};
  }
  :where(input[type="file"]):focus-visible {
    outline: ${focusRingWidth()} solid ${accent()};
    outline-offset: 2px;
    border-color: ${accent()};
  }
  /* UA가 그리는 "Choose File" 버튼 — WebKit pseudo */
  :where(input[type="file"])::file-selector-button {
    margin-inline-end: ${pad(2)};
    padding: 4px ${pad(3)};
    background: ${accent()};
    color: ${onAccent()};
    border: 0;
    border-radius: ${radius('sm')};
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    transition: background-color ${dur('fast')} ${ease('out')};
  }
  :where(input[type="file"])::file-selector-button:hover {
    background: ${tint(accent(), 85)};
  }

  /* ── Section 헤딩 계층 — form 도메인 한정 (prose article 같은 다른 콘텐츠로 leak 금지) ── */
  [data-ds="Row"][data-flow="form"] section > h2:first-child,
  [data-ds="Column"][data-flow="form"] section > h2:first-child {
    font-size: ${font('lg')};
    font-weight: 700;
    margin: 0 0 ${pad(2)};
    padding-bottom: ${pad(2)};
    border-bottom: ${hairlineWidth()} solid ${control('border')};
    letter-spacing: ${tracking()};
  }
  [data-ds="Row"][data-flow="form"] section > h3:first-child,
  [data-ds="Column"][data-flow="form"] section > h3:first-child {
    font-size: ${font('md')};
    font-weight: 600;
    margin: 0 0 ${pad(1.5)};
    color: ${dim(85)};
  }

  /* ── fieldset (data-part="fieldset"로 감싼 Column) ──────────
     legend는 Field label보다 강하게 (md + weight 700) — "이 밑의 것들은 한 묶음".
     Field와 시각적으로 겹치지 않도록 legend 밑에 breathing + 다음 필드와의 간격 확보. */
  [data-part="fieldset"] {
    gap: ${pad(1.5)};
    margin-block-end: ${pad(2)};
  }
  [data-part="fieldset"] > :where(strong, p):first-child {
    font-size: ${font('md')};
    font-weight: 700;
    color: ${dim(90)};
    margin: 0 0 ${pad(0.5)};
    letter-spacing: ${tracking()};
  }
  [data-part="fieldset"] > :where(strong, p):first-child > small {
    font-weight: 400;
    font-size: ${font('sm')};
    color: ${dim(55)};
    margin-inline-start: ${pad(0.5)};
  }

  /* generic aside (no data-part) 의 surface·내부 리듬·danger 톤 은 layout/layout.ts (owner) 가 보유 */

  /* ── 체크박스 row — Row flow="cluster"로 Checkbox + Text 쌍을 감쌀 때 ─── */
  [data-ds="Row"][data-flow="cluster"]:has(> [role="checkbox"], > [role="radio"], > [role="switch"]) {
    gap: ${pad(2)};
    align-items: center;
    cursor: pointer;
  }
  [data-ds="Row"][data-flow="cluster"]:has(> [role="checkbox"], > [role="radio"], > [role="switch"]):hover > :where([role="checkbox"]:not([aria-checked="true"]), [role="radio"]:not([aria-checked="true"]), [role="switch"]:not([aria-checked="true"])) {
    /* 이미 checked인 박스는 accent fill 유지, unchecked인 경우만 hover 시 border 힌트 */
    border-color: ${tint(accent(), 50)};
  }

  /* ── Panel as Section[emphasis=raised] — h2/h3 하단 구분선 ─── */
  section[data-emphasis="raised"] > :where(h2, h3):first-child {
    margin: 0 0 ${pad(2)};
    padding-bottom: ${pad(2)};
    border-bottom: ${hairlineWidth()} solid ${border()};
    font-size: ${font('md')};
    font-weight: 600;
  }
`
