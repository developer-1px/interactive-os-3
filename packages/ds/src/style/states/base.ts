import { controlBox, css, hierarchy, pad } from '../../tokens/foundations'

const selectChevron = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M3 6l5 5 5-5'/></svg>`
import { clickable, control, flexItem } from './selectors'

// All roving items paint directly on themselves. Container bleed is avoided
// structurally: tree uses flat aria-level layout, menu portals submenus out
// of their parent li. No wrapper elements, no CSS classes.
export const base = css`
  ${controlBox(`${clickable}, ${control}`)}
  /* Vertical list container — 단순 block. 행은 각자 flex로 자기 안에서 정렬한다.
     아이콘은 1.25em 고정폭이라 행 간 라벨 시작점이 자연 정렬됨 — subgrid keyline은
     불필요한 결합도라 제거했다 (한 outlier가 트랙 전체를 흔드는 문제 차단). */
  :where([role="tree"], [role="listbox"], [role="menu"], [role="feed"]) {
    display: block;
    /* L4 surface — 컨테이너 자체의 inner padding (Figure/Ground). */
    padding: ${hierarchy.surface};
  }
  :where([role="tree"], [role="listbox"], [role="menu"], [role="feed"])
    :where(li, ul[role="group"], article) {
    /* controlBox는 inline-flex + justify-content:center로 단일 컨트롤(아이콘 버튼)을
       정렬한다. row는 [icon][label][trail] 좌→우 흐름이라 start로 덮는다.
       L0 atom — icon↔label 등 row 안 sub-group 간격 (Proximity). */
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: ${hierarchy.atom};
  }
  /* 수평·table 배치 — row와 동일한 atom 거리 적용 */
  :where(${flexItem}) { display: flex; align-items: center; gap: ${hierarchy.atom}; }
  /* 수평 컨테이너 — 자식 배치를 ds가 통제해 호출부 style 의존을 없앤다. */
  :where([role="toolbar"], [role="tablist"], [role="menubar"]) {
    display: flex; align-items: center; gap: ${hierarchy.atom}; flex-wrap: wrap;
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
