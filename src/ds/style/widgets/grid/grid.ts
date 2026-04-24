import { accent, css, dim, indicator, microLabel, pad, rowPadding, tint } from '../../../fn'

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

    /* 2026 — hairline 대신 zebra 없는 subtle tint row. thead/tbody 구분은
       columnheader 자체 배경이 맡고, body row끼리의 경계는 hover 시에만 드러난다. */
    [role="grid"] [role="row"],
    [role="treegrid"] [role="row"] {
      transition: background-color var(--ds-dur-base) var(--ds-ease-out),
                  box-shadow var(--ds-dur-fast) var(--ds-ease-out);
    }

    /* cell/header 공통 — 수직 가운데 정렬, 텍스트 truncation은 옵트인 */
    [role="gridcell"],
    [role="rowheader"],
    [role="columnheader"] {
      padding: ${rowPadding(2)};
      text-align: start;
      vertical-align: middle;
      font: inherit;
    }

    /* columnheader — 얇은 상단 리본. 배경은 덜 때리고 글자를 강조. */
    [role="columnheader"] {
      ${microLabel()}
      background: transparent;
      white-space: nowrap;
      user-select: none;
      padding-block: ${pad(2)};
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
