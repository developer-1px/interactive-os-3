import { css, dim, fg, microLabel, pad, radius } from '../../../fn'
import { gray } from '../../../fn/palette'

/**
 * Sidebar — nav[aria-roledescription="sidebar"] surface only.
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
export const sidebarCss = () => css`
  /* sidebar surface — width invariant, scroll-aware, container background.
     Outer-layout 정책: sidebar는 *invariant* widget(데스크톱에서 항상 같은 폭)이라
     widget-level에서 width 소유. 모바일 드로어 변형은 각 app이 부모 셸 셀렉터로
     override (catalog-app/edu-portal-admin-app의 [data-nav-open] 규칙 참조). */
  nav[aria-roledescription="sidebar"] {
    width: var(--ds-sidebar-w); flex: none;
    overflow-y: auto; overflow-x: hidden;
    background: ${fg(1)};
    display: flex; flex-direction: column;
    padding: ${pad(3)} ${pad(2)};
    gap: ${pad(3)};
    scrollbar-width: thin;
  }
  nav[aria-roledescription="sidebar"] > header {
    padding: ${pad(1.5)} ${pad(2)};
    display: grid; gap: ${pad(0.25)};
  }
  nav[aria-roledescription="sidebar"] > header > strong {
    font-size: var(--ds-text-md);
    font-weight: 700;
    letter-spacing: var(--ds-tracking);
  }
  nav[aria-roledescription="sidebar"] > header > small {
    font-size: var(--ds-text-xs);
    color: ${dim(55)};
  }
  nav[aria-roledescription="sidebar"] > section {
    display: flex; flex-direction: column; gap: ${pad(0.5)};
  }
  nav[aria-roledescription="sidebar"] > section > h3 {
    ${microLabel()}
    margin: 0 0 ${pad(1)};
    padding: 0 ${pad(2)};
  }
  /* sidebar 안의 Listbox는 컨테이너 padding/grid를 리셋 — option만 밀도 있게 쌓임 */
  nav[aria-roledescription="sidebar"] [role="listbox"] {
    padding: 0;
    gap: ${pad(0.25)};
    row-gap: ${pad(0.25)};
  }
  nav[aria-roledescription="sidebar"] [role="option"] {
    border-radius: ${radius('md')};
    padding: ${pad(1.25)} ${pad(2)};
  }
  nav[aria-roledescription="sidebar"] > footer {
    margin-top: auto;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: ${pad(2)};
    padding: ${pad(2)};
    border-radius: ${radius('md')};
    background: ${fg(2)};
    font-size: var(--ds-text-sm);
  }
  nav[aria-roledescription="sidebar"] > footer > small {
    color: ${dim(55)};
    font-size: var(--ds-text-xs);
  }

  /* tree.ts indicator()가 [role="treeitem"]::before를 visibility:hidden로 시작시키고
     [aria-expanded]에서만 보이게 한다(chevron 토글 패턴). 사이드바에서는 [data-icon]
     leaf도 같은 ::before slot에 lucide 아이콘을 그리므로 visibility를 다시 켠다.
     mask-image는 [data-icon="<token>"]::before가 이미 덮어 chevron mask와 충돌하지 않는다. */
  nav[aria-roledescription="sidebar"] [role="treeitem"][data-icon]::before {
    visibility: visible;
    opacity: .75;
  }
  nav[aria-roledescription="sidebar"] [role="treeitem"][aria-current="page"][data-icon]::before {
    opacity: 1;
  }

  /* section label — Tree가 kind='group' entity를 <li role="none" data-group-label>로 렌더.
     키보드 진입/선택은 axes 측에서 disabled로 차단. 시각만 microLabel. */
  nav[aria-roledescription="sidebar"] [role="tree"] li[role="none"][data-group-label] {
    ${microLabel()}
    color: ${gray(6)};
    pointer-events: none;
    padding-block: ${pad(2)} ${pad(1)};
    padding-inline-start: ${pad(2)};
  }
  nav[aria-roledescription="sidebar"] [role="tree"] li[role="none"][data-group-label]:not(:first-child) {
    margin-block-start: ${pad(2)};
  }

  /* rail 변형 — 폭/라벨/섹션 숨김. 슬롯 레이아웃은 그대로 유지(아이콘은 lead). */
  nav[aria-roledescription="sidebar"][data-state="rail"],
  nav[aria-roledescription="sidebar"]:has([role="tree"][data-state="rail"]) {
    --ds-sidebar-w: 56px;
  }
  nav[aria-roledescription="sidebar"] [role="tree"][data-state="rail"] [role="treeitem"] > span:not([aria-label]) {
    display: none;
  }
  nav[aria-roledescription="sidebar"] [role="tree"][data-state="rail"] li[role="none"][data-group-label] {
    display: none;
  }
`
