import { accent, css, dim, fg, indicator, microLabel, pad, tint } from '../../../fn'

/**
 * grid 일가 — DataGrid / TreeGrid / Row / RowGroup / RowHeader / ColumnHeader / GridCell.
 *
 * 표 계열은 리스트와 달리 "열 정렬 · 헤더 고정 · 행 선택 · 정렬 표시"가 필수 어포던스다.
 * classless/role-only 방침에 맞춰 table/thead/tbody/tr/th/td + ARIA로만 스타일한다.
 */
export const grid = () => [
  css`
    [role="grid"],
    [role="treegrid"] {
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
      color: var(--ds-fg);
      font: inherit;
    }

    /* rowgroup(thead/tbody) — 구조적 훅만 유지. 시각 구분은 columnheader 자체가 담당. */
    [role="rowgroup"] { display: table-row-group; }

    /* 행 사이 hairline — 긴 데이터 테이블은 가로 가이드선이 스캔에 필수.
       gray-2로 아주 얇게, columnheader 경계는 gray-3로 살짝 더 진하게. */
    [role="grid"] [role="row"],
    [role="treegrid"] [role="row"] {
      transition: background-color var(--ds-dur-base) var(--ds-ease-out),
                  box-shadow var(--ds-dur-fast) var(--ds-ease-out);
    }
    [role="grid"] [role="gridcell"],
    [role="grid"] [role="rowheader"],
    [role="treegrid"] [role="gridcell"],
    [role="treegrid"] [role="rowheader"] {
      border-block-end: 1px solid ${fg(2)};
    }
    [role="grid"] [role="columnheader"],
    [role="treegrid"] [role="columnheader"] {
      border-block-end: 1px solid var(--ds-control-border);
    }
    /* 테이블 끝 행의 bottom hairline 제거 — 닫히는 느낌 대신 열린 느낌 */
    [role="grid"] [role="rowgroup"]:last-child [role="row"]:last-child > :is([role="gridcell"], [role="rowheader"]),
    [role="treegrid"] [role="rowgroup"]:last-child [role="row"]:last-child > :is([role="gridcell"], [role="rowheader"]) {
      border-block-end: 0;
    }

    /* cell/header 공통 — 수직 가운데 정렬, 텍스트 truncation은 옵트인.
       2026 데이터 테이블 트렌드: 행 높이를 여유 있게(Linear/Notion/Vercel 44~52px).
       세로 padding을 기존 space*1 → space*2.5로 높여 숨 쉬는 행 높이 확보. */
    [role="gridcell"],
    [role="rowheader"] {
      padding: ${pad(2.5)} ${pad(2)};
      text-align: start;
      vertical-align: middle;
      font: inherit;
    }
    [role="columnheader"] {
      padding: ${pad(2)};
      text-align: start;
      vertical-align: middle;
      font: inherit;
    }
    /* 숫자 셀 opt-in — data-num 속성 또는 consumer가 style.textAlign 지정 */
    [role="gridcell"][data-num="true"] {
      text-align: end;
      font-variant-numeric: tabular-nums;
    }
    [role="columnheader"][data-num="true"] {
      text-align: end;
    }

    /* columnheader — 얇은 상단 리본. 배경은 덜 때리고 글자를 강조. */
    [role="columnheader"] {
      ${microLabel()}
      background: transparent;
      white-space: nowrap;
      user-select: none;
      padding-block: ${pad(2)};
    }
    /* 정렬 토글 버튼이 th 안에 있을 때 — header 타이포를 상속시키고 button 기본 스타일 제거.
       "pressable" 신호는 hover 시 accent 색상으로 약한 전경 변화. */
    [role="columnheader"] > button {
      all: unset;
      cursor: pointer;
      font: inherit;
      color: inherit;
      letter-spacing: inherit;
      text-transform: inherit;
      display: inline-flex;
      align-items: center;
      gap: ${pad(0.5)};
      transition: color var(--ds-dur-fast) var(--ds-ease-out);
    }
    [role="columnheader"] > button:hover {
      color: ${accent()};
    }
    [role="columnheader"] > button:focus-visible {
      outline: 2px solid ${accent()};
      outline-offset: 2px;
      border-radius: ${pad(0.5)};
    }

    /* ── 데이터 셀 안의 "pressable" 콘벤션 ───────────────────────────
       네이티브 <a href> / <button>은 클릭 가능, 그 외 <span>/<div>/<strong>은 읽기.
       시각 신호:
       - text link: hover 시 underline + accent 색상
       - media link (썸네일 등): hover 시 accent ring
       - focus-visible: 동일한 accent ring */
    [role="gridcell"] a[href] {
      color: inherit;
      text-decoration: none;
      text-underline-offset: 3px;
      cursor: pointer;
      transition: color var(--ds-dur-fast) var(--ds-ease-out);
    }
    [role="gridcell"] a[href]:hover {
      color: ${accent()};
      text-decoration: underline;
      text-decoration-thickness: 1.5px;
    }
    [role="gridcell"] a[href]:focus-visible {
      outline: 2px solid ${accent()};
      outline-offset: 2px;
      border-radius: ${pad(0.5)};
    }
    /* media link — img를 감싼 <a>. 이미지 자체엔 변화 없이 ring만 감싸는 affordance. */
    [role="gridcell"] a[href]:has(> img) {
      display: inline-block;
      border-radius: var(--ds-radius-md);
    }
    [role="gridcell"] a[href]:has(> img):hover {
      outline: 2px solid ${accent()};
      outline-offset: 2px;
      text-decoration: none;
    }
    [role="gridcell"] a[href]:has(> img):focus-visible {
      outline: 2px solid ${accent()};
      outline-offset: 2px;
    }

    /* rowheader — 행의 첫 셀, 라벨 역할 */
    [role="rowheader"] {
      font-weight: 600;
      color: ${dim(90)};
    }

    /* row hover — subtle tint */
    [role="grid"] [role="row"]:hover:not([aria-disabled="true"]),
    [role="treegrid"] [role="row"]:hover:not([aria-disabled="true"]) {
      background: ${dim(3)};
    }

    /* row selected — tint + 좌측 accent lead bar (2026 표준 패턴) */
    [role="row"][aria-selected="true"] {
      background: ${tint(accent(), 12)};
      box-shadow: inset 3px 0 0 0 ${accent()};
    }

    /* gridcell selected (셀 단위 선택 지원) */
    [role="gridcell"][aria-selected="true"] {
      background: ${tint(accent(), 16)};
      box-shadow: inset 0 0 0 2px ${accent()};
      border-radius: ${pad(0.75)};
    }

    /* disabled */
    [role="row"][aria-disabled="true"],
    [role="gridcell"][aria-disabled="true"] {
      opacity: 0.5;
      pointer-events: none;
    }

    /* focus ring — 2026 스타일 inner ring */
    [role="gridcell"]:focus-visible,
    [role="row"]:focus-visible {
      outline: none;
      box-shadow: inset 0 0 0 2px ${accent()};
    }

  `,
  // columnheader aria-sort 표식 — descending은 chevronDown 그대로, ascending은 180도 회전
  indicator('[role="columnheader"][aria-sort="descending"]', 'chevronDown', { pseudo: '::after', size: '0.9em', spacing: pad(1) }),
  indicator('[role="columnheader"][aria-sort="ascending"]',  'chevronDown', {
    pseudo: '::after', size: '0.9em', spacing: pad(1),
    on: '[aria-sort="ascending"]', transform: 'rotate(180deg)',
  }),
].join('\n')
