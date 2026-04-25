import { accent, control, css, dim, dur, ease, fg, font, onAccent, pad, radius, status, tint, tracking } from '../../../fn'
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
 * Aside(게시 설정 측면 패널)는 gray-1 서피스 + radius로 main 폼과 시각 분리.
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
  [role="group"][aria-roledescription="field"] {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: ${pad(1)};
    min-inline-size: 0;
    grid-template-columns: none;
  }
  [role="group"][aria-roledescription="field"] > label {
    font-size: ${font('sm')};
    font-weight: 600;
    color: ${dim(85)};
    line-height: 1.3;
  }
  [role="group"][aria-roledescription="field"][aria-required="true"] > label::after {
    content: ' *';
    color: ${status('danger')};
    font-weight: 400;
  }
  [role="group"][aria-roledescription="field"] > p {
    font-size: ${font('xs')};
    color: ${dim(55)};
    margin: 0;
    line-height: 1.4;
  }
  [role="group"][aria-roledescription="field"] > input,
  [role="group"][aria-roledescription="field"] > select,
  [role="group"][aria-roledescription="field"] > textarea {
    inline-size: 100%;
  }

  /* ── input[type="file"] — UA 기본 "파일 선택 / 선택된 파일 없음" 대신
     dashed 드롭존 + 내부 버튼을 ds Button과 동일 톤으로 정렬 ───────────── */
  :where(input[type="file"]) {
    inline-size: 100%;
    padding: ${pad(3)};
    background: ${fg(1)};
    border: 1px dashed ${fg(4)};
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
    outline: 2px solid ${accent()};
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

  /* ── Section 헤딩 계층 ───────────────────────────────────────────────── */
  section > h2:first-child {
    font-size: ${font('lg')};
    font-weight: 700;
    margin: 0 0 ${pad(2)};
    padding-bottom: ${pad(2)};
    border-bottom: 1px solid ${control('border')};
    letter-spacing: ${tracking()};
  }
  section > h3:first-child {
    font-size: ${font('md')};
    font-weight: 600;
    margin: 0 0 ${pad(1.5)};
    color: ${dim(85)};
  }

  /* ── fieldset (aria-roledescription="fieldset"로 감싼 Column) ──────────
     legend는 Field label보다 강하게 (md + weight 700) — "이 밑의 것들은 한 묶음".
     Field와 시각적으로 겹치지 않도록 legend 밑에 breathing + 다음 필드와의 간격 확보. */
  [aria-roledescription="fieldset"] {
    gap: ${pad(1.5)};
    margin-block-end: ${pad(2)};
  }
  [aria-roledescription="fieldset"] > :where(strong, p):first-child {
    font-size: ${font('md')};
    font-weight: 700;
    color: ${dim(90)};
    margin: 0 0 ${pad(0.5)};
    letter-spacing: ${tracking()};
  }
  [aria-roledescription="fieldset"] > :where(strong, p):first-child > small {
    font-weight: 400;
    font-size: ${font('sm')};
    color: ${dim(55)};
    margin-inline-start: ${pad(0.5)};
  }

  /* ── Aside — 게시/공개 설정 등 보조 행동을 담는 우측 패널.
     이름 있는 aside(preview/inspector 등 pane)는 제외하고 일반 "안내/설정" aside만. */
  aside:not([aria-roledescription]) {
    display: flex; flex-direction: column; flex: none; min-inline-size: 0;
    background: ${fg(1)};
    border: 1px solid ${control('border')};
    border-inline-start: 3px solid ${tint(accent(), 45)};
    border-radius: ${radius('lg')};
    padding: ${pad(4)};
    gap: ${pad(3)};
  }
  /* Aside 내부 본문 리스트 — 기본 ul이 Text[body] 안에 들어와도 읽기 리듬을 유지 */
  aside:not([aria-roledescription]) :where(ul, ol) {
    margin: 0; padding-inline-start: ${pad(4)};
    display: flex; flex-direction: column; gap: ${pad(1.5)};
  }
  aside:not([aria-roledescription]) :where(li) { line-height: 1.55; }
  /* dl 형태의 미니 stats (badge + value 쌍) — dl > div로 그룹, 가로 배치 */
  aside:not([aria-roledescription]) :where(dl) {
    margin: 0;
    display: flex; flex-direction: column; gap: ${pad(1)};
  }
  aside:not([aria-roledescription]) :where(dl) > div {
    display: flex; align-items: center; justify-content: space-between;
    gap: ${pad(2)};
  }
  aside:not([aria-roledescription]) :where(dl) :where(dt, dd) {
    margin: 0;
    font-size: ${font('sm')};
  }
  aside:not([aria-roledescription]) :where(dl) :where(dd) {
    color: ${dim(60)};
    font-variant-numeric: tabular-nums;
  }
  aside:not([aria-roledescription]) > section {
    gap: ${pad(2)};
  }
  aside:not([aria-roledescription]) > section + section {
    padding-top: ${pad(3)};
    border-top: 1px solid ${control('border')};
  }

  /* Aside의 "위험 영역" section은 경고 톤 */
  aside:not([aria-roledescription]) > section[aria-roledescription="danger"] > h3:first-child {
    color: ${status('danger')};
  }

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
    border-bottom: 1px solid ${dim(8)};
    font-size: ${font('md')};
    font-weight: 600;
  }
`
