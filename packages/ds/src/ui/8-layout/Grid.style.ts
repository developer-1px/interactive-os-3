import { accent, accentTint, bg, border, control, css, currentTint, dur, ease, emphasize, focusRingWidth, hairlineWidth, indicator, microLabel, mute, radius, text, tone } from '../../tokens/foundations'
import { font, weight, pad } from '../../tokens/palette'
/**
 * grid 일가 — DataGrid / TreeGrid / Row / RowGroup / RowHeader / ColumnHeader / GridCell.
 *
 * 표 계열은 리스트와 달리 "열 정렬 · 헤더 고정 · 행 선택 · 정렬 표시"가 필수 어포던스다.
 * classless/role-only 방침에 맞춰 table/thead/tbody/tr/th/td + ARIA로만 스타일한다.
 */
export const cssGrid = () => [
  css`
    [role="grid"],
    [role="treegrid"] {
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
      color: ${text('strong')};
      font: inherit;
    }

    /* rowgroup(thead/tbody) — 구조적 훅만 유지. 시각 구분은 columnheader 자체가 담당. */
    [role="rowgroup"] { display: table-row-group; }

    /* 행 사이 hairline — 긴 데이터 테이블은 가로 가이드선이 스캔에 필수.
       neutral-2로 아주 얇게, columnheader 경계는 neutral-3로 살짝 더 진하게. */
    [role="grid"] [role="row"],
    [role="treegrid"] [role="row"] {
      transition: background-color ${dur('base')} ${ease('out')},
                  box-shadow ${dur('fast')} ${ease('out')};
    }
    [role="grid"] [role="gridcell"],
    [role="grid"] [role="rowheader"],
    [role="treegrid"] [role="gridcell"],
    [role="treegrid"] [role="rowheader"] {
      border-block-end: ${hairlineWidth()} solid ${border()};
    }
    [role="grid"] [role="columnheader"],
    [role="treegrid"] [role="columnheader"] {
      border-block-end: ${hairlineWidth()} solid ${control('border')};
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

    /* sticky column header — body 스크롤 시 헤더 고정. table 자체 overflow는
       소비자 컨테이너가 담당하고, th의 sticky가 thead 위치를 잡는다. */
    [role="grid"] thead [role="columnheader"],
    [role="treegrid"] thead [role="columnheader"] {
      position: sticky; top: 0; z-index: 1;
      background: ${bg()};
    }

    /* 첫 셀(이름 등)의 icon+label 콤보 — 수평 정렬과 일관 gap */
    [role="gridcell"][data-icon],
    [role="rowheader"][data-icon] {
      display: table-cell;
    }
    [role="gridcell"][data-icon]::before {
      vertical-align: middle;
      margin-inline-end: ${pad(1)};
    }
    [role="gridcell"][data-icon] > span,
    [role="rowheader"][data-icon] > span {
      vertical-align: middle;
      min-inline-size: 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    /* ── density=compact — Finder 목록뷰 / 파일관리자류 컴팩트 행 ────
       세로 패딩을 데이터 테이블의 ~⅓로 줄여 한 화면에 더 많은 행을 보인다.
       hover/selected는 edge-to-edge (둥글지 않음). */
    [role="treegrid"][data-density="compact"] [role="gridcell"],
    [role="treegrid"][data-density="compact"] [role="rowheader"],
    [role="grid"][data-density="compact"] [role="gridcell"],
    [role="grid"][data-density="compact"] [role="rowheader"] {
      padding: ${pad(0.75)} ${pad(2)};
    }
    [role="treegrid"][data-density="compact"] [role="columnheader"],
    [role="grid"][data-density="compact"] [role="columnheader"] {
      padding: ${pad(1)} ${pad(2)};
      font-size: ${font('sm')};
    }
    /* hairline 더 흐리게 (Finder 톤) */
    [role="treegrid"][data-density="compact"] [role="gridcell"],
    [role="treegrid"][data-density="compact"] [role="rowheader"],
    [role="grid"][data-density="compact"] [role="gridcell"],
    [role="grid"][data-density="compact"] [role="rowheader"] {
      border-block-end-color: ${text('mute')};
    }
    /* selected 행 — edge-to-edge accent fill, lead bar 제거(Finder는 풀폭) */
    [role="treegrid"][data-density="compact"] [role="row"][aria-selected="true"],
    [role="grid"][data-density="compact"] [role="row"][aria-selected="true"] {
      background: ${accentTint('medium')};
      box-shadow: none;
    }
    [role="treegrid"][data-density="compact"] [role="row"][aria-selected="true"] [role="gridcell"],
    [role="grid"][data-density="compact"] [role="row"][aria-selected="true"] [role="gridcell"] {
      border-block-end-color: transparent;
    }
    /* row가 클릭 가능함을 명시 */
    [role="treegrid"][data-density="compact"] [role="row"]:not([aria-disabled="true"]),
    [role="grid"][data-density="compact"] [role="row"]:not([aria-disabled="true"]) {
      cursor: default;
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
      transition: color ${dur('fast')} ${ease('out')};
    }
    [role="columnheader"] > button:hover {
      color: ${accent()};
    }
    [role="columnheader"] > button:focus-visible {
      outline: ${focusRingWidth()} solid ${accent()};
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
      transition: color ${dur('fast')} ${ease('out')};
    }
    [role="gridcell"] a[href]:hover {
      color: ${accent()};
      text-decoration: underline;
      text-decoration-thickness: 1.5px;
    }
    [role="gridcell"] a[href]:focus-visible {
      outline: ${focusRingWidth()} solid ${accent()};
      outline-offset: 2px;
      border-radius: ${pad(0.5)};
    }
    /* media link — img를 감싼 <a>. 이미지 자체엔 변화 없이 ring만 감싸는 affordance. */
    [role="gridcell"] a[href]:has(> img) {
      display: inline-block;
      border-radius: ${radius('md')};
    }
    [role="gridcell"] a[href]:has(> img):hover {
      outline: ${focusRingWidth()} solid ${accent()};
      outline-offset: 2px;
      text-decoration: none;
    }
    [role="gridcell"] a[href]:has(> img):focus-visible {
      outline: ${focusRingWidth()} solid ${accent()};
      outline-offset: 2px;
    }

    /* rowheader — 행의 첫 셀, 라벨 역할 */
    [role="rowheader"] {
      font-weight: ${weight('semibold')};
      color: ${text('default')};
    }

    /* row hover — subtle tint */
    [role="grid"] [role="row"]:hover:not([aria-disabled="true"]),
    [role="treegrid"] [role="row"]:hover:not([aria-disabled="true"]) {
      background: ${currentTint('subtle')};
    }

    /* row selected — tint + 좌측 accent lead bar (2026 표준 패턴) */
    [role="row"][aria-selected="true"] {
      background: ${accentTint('soft')};
      box-shadow: inset 3px 0 0 0 ${accent()};
    }

    /* gridcell selected (셀 단위 선택 지원) */
    [role="gridcell"][aria-selected="true"] {
      background: ${accentTint('medium')};
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

    /* ── density=mail — 메일/채팅류 2~3라인 리스트 ───────────────────
       표(tabular) 대신 grid-template-areas로 행 내부 멀티라인 배치.
       cell은 data-col로 식별. */
    [role="grid"][data-density="mail"] { display: block; }
    [role="grid"][data-density="mail"] [role="rowgroup"] { display: block; }
    /* 색 소유 = surface 소유. row만이 bg/fg 페어를 가진다 (tone() 통해서, 누락 불가능).
       cell·내부 요소는 색을 가지지 않는다 — color: inherit. 강조·약화는 *색* 대신
       weight·opacity로 표현 → row가 surface를 뒤집어도 항상 함께 따라온다. */
    [role="grid"][data-density="mail"] [role="row"] {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      grid-template-areas:
        "from time"
        "subject subject"
        "preview preview";
      gap: 2px ${pad(2)};
      padding: ${pad(2)} ${pad(2.5)};
      border-radius: ${radius('md')};
      cursor: pointer;
      color: inherit;
    }
    [role="grid"][data-density="mail"] [role="gridcell"] {
      padding: 0; border: 0;
      min-inline-size: 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      color: inherit;
    }
    [role="grid"][data-density="mail"] [role="gridcell"][data-col="from"]    { grid-area: from; ${emphasize(1)} }
    [role="grid"][data-density="mail"] [role="gridcell"][data-col="time"]    { grid-area: time; justify-self: end; font-size: ${font('sm')}; ${mute(2)} }
    [role="grid"][data-density="mail"] [role="gridcell"][data-col="subject"] { grid-area: subject; font-weight: ${weight('medium')}; }
    [role="grid"][data-density="mail"] [role="gridcell"][data-col="preview"] { grid-area: preview; font-size: ${font('sm')}; ${mute(2)} }
    /* unread 강조 — 색 ❌, weight ✅ (mute/emphasize는 surface 무관) */
    [role="grid"][data-density="mail"] [role="row"][data-unread="true"] [role="gridcell"][data-col="from"],
    [role="grid"][data-density="mail"] [role="row"][data-unread="true"] [role="gridcell"][data-col="subject"] {
      ${emphasize()}
    }

    /* ── selected — tone() 페어로 bg+fg 동시 주입. 한쪽만 빼먹기 구조적 불가능 ── */
    [role="grid"][data-density="mail"] [role="row"][aria-selected="true"] {
      ${tone('accent')}
      box-shadow: none;
    }
    /* selected-solid 하에선 bottom hairline 무의미 — 캡슐이 분리를 맡는다 */
    [role="grid"][data-density="mail"] [role="row"] > [role="gridcell"] { border-block-end: 0; }
  `,
  // columnheader aria-sort 표식 — descending은 chevronDown 그대로, ascending은 180도 회전
  indicator('[role="columnheader"][aria-sort="descending"]', 'chevronDown', { pseudo: '::after', size: '0.9em', spacing: pad(1) }),
  indicator('[role="columnheader"][aria-sort="ascending"]',  'chevronDown', {
    pseudo: '::after', size: '0.9em', spacing: pad(1),
    on: '[aria-sort="ascending"]', transform: 'rotate(180deg)',
  }),
].join('\n')
