import { css, hierarchy, microLabel, radius, slot, surface, text, typography } from '../../../tokens/semantic'
import { pad } from '../../../tokens/scalar'

/**
 * Sidebar — nav[data-part="sidebar"] surface only.
 *
 * Item 행의 [icon][label][badge] 정렬은 base.ts의 subgrid 슬롯
 * `[lead] auto [label] 1fr [trail] auto`이 이미 처리한다. 여기서 다시 깔지 않는다.
 * iconIndicator()가 ::before로 lead 슬롯에 정사각형 키라인 아이콘을 그린다.
 *
 * 이 파일이 책임지는 것:
 *   1) nav 자체의 surface (bg/border/width/padding)
 *   2) brand <header>·<footer> 슬롯 시각
 *   3) section header(level=1) 시각만 microLabel + chevron 숨김으로 변형
 *   4) rail 변형(폭·라벨/섹션헤더 숨김)
 *
 * 이모지 ❌. 아이콘은 lucide token 1종.
 */
export const cssSidebar = () => css`
  /* sidebar surface — width invariant, scroll-aware, container background.
     Outer-layout 정책: sidebar는 *invariant* widget(데스크톱에서 항상 같은 폭)이라
     widget-level에서 width 소유. 모바일 드로어 변형은 각 app이 부모 셸 셀렉터로
     override (catalog-app/edu-portal-admin-app의 [data-nav-open] 규칙 참조). */
  nav[data-part="sidebar"] {
    width: var(--ds-sidebar-w); flex: none;
    overflow-y: auto; overflow-x: hidden;
    background: ${surface('subtle')};
    display: flex; flex-direction: column;
    /* L4 surface — sidebar 자체 padding (Figure/Ground). */
    padding: ${hierarchy.surface};
    /* L5 shell — section↔section, header↔section 간격. */
    gap: ${hierarchy.shell};
    scrollbar-width: thin;
  }
  nav[data-part="sidebar"] > header {
    padding: ${slot.sidebar.itemPadY} ${slot.sidebar.headerPad};
    display: grid; gap: ${pad(0.25)};
  }
  nav[data-part="sidebar"] > header > strong {
    ${typography('bodyStrong')};
    letter-spacing: var(--ds-tracking);
  }
  nav[data-part="sidebar"] > header > small {
    font-size: var(--ds-text-xs);
    color: ${text('subtle')};
  }
  /* L3 section — h3↔listbox는 atom보다 한 단계 넓게(Continuity 유지하며 atom과 구분).
     section 자체는 L5 shell gap으로 분리된다. */
  nav[data-part="sidebar"] > section {
    display: flex; flex-direction: column; gap: ${hierarchy.section};
  }
  nav[data-part="sidebar"] > section > h3 {
    ${microLabel()}
    margin: 0;
    padding: 0 ${pad(2)};
  }
  /* sidebar 안의 Listbox는 surface padding 리셋 — section이 이미 surface로 감싼다.
     row↔row는 L2 group(0)로 flush — row가 자기 모양(controlBox)으로 분리됨(Similarity). */
  nav[data-part="sidebar"] [role="listbox"] {
    padding: 0;
    gap: ${hierarchy.group};
    row-gap: ${hierarchy.group};
  }
  nav[data-part="sidebar"] [role="option"] {
    border-radius: ${radius('md')};
    padding: ${slot.sidebar.itemPadY} ${slot.sidebar.itemPadX};
  }
  nav[data-part="sidebar"] > footer {
    margin-top: auto;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: ${pad(2)};
    padding: ${slot.sidebar.pad};
    border-radius: ${radius('md')};
    background: ${surface('muted')};
    font-size: var(--ds-text-sm);
  }
  nav[data-part="sidebar"] > footer > small {
    color: ${text('subtle')};
    font-size: var(--ds-text-xs);
  }

  /* tree.ts indicator()가 [role="treeitem"]::before를 visibility:hidden로 시작시키고
     [aria-expanded]에서만 보이게 한다(chevron 토글 패턴). 사이드바에서는 [data-icon]
     leaf도 같은 ::before slot에 lucide 아이콘을 그리므로 visibility를 다시 켠다.
     mask-image는 [data-icon="<token>"]::before가 이미 덮어 chevron mask와 충돌하지 않는다. */
  nav[data-part="sidebar"] [role="treeitem"][data-icon]::before {
    visibility: visible;
    opacity: .75;
  }
  nav[data-part="sidebar"] [role="treeitem"][aria-current="page"][data-icon]::before {
    opacity: 1;
  }

  /* section label — Tree가 kind='group' entity를 <li role="none" data-group-label>로 렌더.
     키보드 진입/선택은 axes 측에서 disabled로 차단. 시각만 microLabel. */
  nav[data-part="sidebar"] [role="tree"] li[role="none"][data-group-label] {
    ${microLabel()}
    color: ${text('mute')};
    pointer-events: none;
    padding-block: ${pad(2)} ${pad(1)};
    padding-inline-start: ${pad(2)};
  }
  nav[data-part="sidebar"] [role="tree"] li[role="none"][data-group-label]:not(:first-child) {
    margin-block-start: ${pad(2)};
  }

  /* rail 변형 — 폭/라벨/섹션 숨김. 슬롯 레이아웃은 그대로 유지(아이콘은 lead). */
  nav[data-part="sidebar"][data-state="rail"],
  nav[data-part="sidebar"]:has([role="tree"][data-state="rail"]) {
    --ds-sidebar-w: 56px;
  }
  nav[data-part="sidebar"] [role="tree"][data-state="rail"] [role="treeitem"] > span:not([aria-label]) {
    display: none;
  }
  nav[data-part="sidebar"] [role="tree"][data-state="rail"] li[role="none"][data-group-label] {
    display: none;
  }
`
