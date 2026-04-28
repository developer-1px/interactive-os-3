/**
 * ds/layouts — APG 외 page-level 시각 골격. landmark 없는 reusable 조립 단위.
 *
 * 각 fragment 는 defineLayout 으로 래핑되어 시맨틱 경계를 코드로 강제한다
 * (Nav/Aside/Ui 금지, Main/Header/Footer 는 page-structure 용 허용).
 *
 * 사용:
 *   const shell = holyGrail({ navSlot, contentSlot, label, narrow })
 *   const sidebar = sidebarAdmin({ id: 'nav', ... })  // navSlot id 와 일치
 *   merge(shell, sidebar, { entities: {}, relationships: { content: [...] } })
 */
export { holyGrail, type HolyGrailProps } from './holyGrail'
export { masterDetail, type MasterDetailProps } from './masterDetail'
export { pageHeader, type PageHeaderProps } from './pageHeader'
export { centeredNarrow, type CenteredNarrowProps } from './centeredNarrow'
export { heroSection, type HeroSectionProps } from './heroSection'
// sidebar variants moved to ds/shells/sidebar (Phase 3 — L5 single-instance shell)
