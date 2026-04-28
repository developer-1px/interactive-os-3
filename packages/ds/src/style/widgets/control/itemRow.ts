import { css, keyline } from '../../../tokens/semantic'

/**
 * Item row anatomy — MenuItem · Option · TreeItem 시각 통일.
 *
 *  ARIA role 별로 부모/키보드 시맨틱은 다르지만 (menuitem/option/treeitem)
 *  *시각 anatomy* 는 동일: leading icon · label · meta · trailing indicator 4 슬롯.
 *
 *  공통 selector 로 같은 keyline 을 보장 (Material ListItem 수렴).
 *  - leading  : icon
 *  - label    : default children (1fr)
 *  - meta     : shortcut/badge (menuitem 전용 일반)
 *  - trailing : indicator (chevron/check)
 *
 *  tracks 토큰 = '[lead] auto [label] 1fr [trail] auto' — keyline.ts SSoT.
 *  meta 는 trail 라인을 공유 (auto 안에서 label 다음에 자연 배치).
 */
const itemRoles = `
  li[role="menuitem"],
  li[role="menuitemcheckbox"],
  li[role="menuitemradio"],
  li[role="option"],
  li[role="treeitem"]
`

export const cssItemRow = () => css`
  :where(${itemRoles}) {
    display: grid;
    grid-template-columns: ${keyline.tracks};
    align-items: center;
    column-gap: ${keyline.slotGap};
  }
  :where(${itemRoles}) > [data-slot="leading"]  { grid-column: lead; }
  :where(${itemRoles}) > [data-slot="meta"],
  :where(${itemRoles}) > [data-slot="trailing"] { grid-column: trail; }

  /* slot span 자체가 inline 이라 ::before(icon) 가 baseline 정렬되어 vertical 어긋남.
     슬롯을 inline-flex 로 만들어 ::before 를 자기 박스 중앙에 가둔다. */
  :where(${itemRoles}) > [data-slot="leading"],
  :where(${itemRoles}) > [data-slot="trailing"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  /* data-icon::before 의 inline 사이 margin 은 column-gap 이 owner 라 제거. */
  :where(${itemRoles}) > [data-icon]::before {
    margin-inline-end: 0;
  }
`
