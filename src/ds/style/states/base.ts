import { controlBox, css, pad } from '../../fn'

const selectChevron = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M3 6l5 5 5-5'/></svg>`
import { containerPad, slotGap, tracks } from '../seed/keyline'
import { clickable, control, flexItem } from './selectors'

// All roving items paint directly on themselves. Container bleed is avoided
// structurally: tree uses flat aria-level layout, menu portals submenus out
// of their parent li. No wrapper elements, no CSS classes.
export const base = css`
  ${controlBox(`${clickable}, ${control}`)}
  /* Keyline 축: 수직 리스트 container가 column을 선언하고, 내부의 모든 wrapper
     (li / ul[role="group"] / article / presentation)가 subgrid로 상속한다.
     chevron/아이콘/아바타 열과 라벨 열이 container 전역에서 같은 세로선에 묶인다. */
  :where([role="tree"], [role="listbox"], [role="menu"], [role="feed"]) {
    display: grid;
    grid-template-columns: ${tracks};
    grid-auto-rows: min-content;
    /* row-gap 0 — hover 연속성을 위한 dense packing. 숨 쉬는 간격이 필요한
       container(예: feed)만 자체 규칙에서 row-gap을 덮어쓴다.
       column-gap은 subgrid 자식이 상속 — 자식에서 gap을 덮어써도 subgrid 축은
       부모 값을 따르므로 lead↔label 간격은 반드시 여기서 선언한다. */
    row-gap: 0;
    column-gap: ${slotGap};
    align-content: start;
    padding: ${containerPad};
  }
  :where([role="tree"], [role="listbox"], [role="menu"], [role="feed"])
    :where(li, ul[role="group"], article, li[role="presentation"]) {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    align-items: center;
  }
  /* 수평·table 배치는 subgrid 부적합 — 기존 flex 유지 */
  :where(${flexItem}) { display: flex; align-items: center; gap: ${slotGap}; }
  /* 수평 컨테이너 — 자식 배치를 ds가 통제해 호출부 style 의존을 없앤다. */
  :where([role="toolbar"], [role="tablist"], [role="menubar"]) {
    display: flex; align-items: center; gap: ${slotGap}; flex-wrap: wrap;
  }
  :where(${clickable}) { cursor: pointer; }
  /* 리스트 row 내부 label은 기본 truncation (호출부 style 의존 제거) */
  :where([role="option"], [role="menuitem"], [role="treeitem"]) > :where(span, div, a, strong) {
    min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  :where(input:not([type="checkbox"]):not([type="radio"])),
  :where(select),
  :where(textarea) { border-color: var(--ds-border); background: var(--ds-bg); }
  :where(textarea) {
    resize: vertical;
    /* multiline이라 controlBox의 block-size를 풀고 min만 부과 */
    block-size: auto;
    min-block-size: calc(var(--ds-control-h) * 2);
  }
  :where(${control}):disabled { opacity: 0.4; pointer-events: none; }

  /* select: UA 화살표 제거 후 SVG chevron을 currentColor로 그린다 */
  :where(select) {
    appearance: none;
    padding-inline-end: calc(${pad(2)} + 1em);
    background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(selectChevron)}");
    background-repeat: no-repeat;
    background-position: right ${pad(1.5)} center;
    background-size: 1em 1em;
  }
`
