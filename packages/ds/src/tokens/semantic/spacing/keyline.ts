import { pad } from '../../scalar/space'

/**
 * 모든 수직 리스트 컨테이너가 공유하는 subgrid 축 + spacing 상수.
 *   [lead]  = 체브론·아이콘·아바타 등 선두 슬롯 (auto)
 *   [label] = 메인 콘텐츠 (1fr)
 *   [trail] = 배지·시간·메뉴 버튼 등 후위 슬롯 (auto)
 *
 * Law of Proximity: slotGap < containerPad — 같은 행 안 아이콘·라벨은 붙고,
 * 행끼리는 여유 있게 떨어져야 시각 그룹이 뚜렷해진다.
 */

/** @demo type=value fn=tracks */
export const tracks = '[lead] auto [label] 1fr [trail] auto'

/** @demo type=value fn=rowGap */
export const rowGap = pad(2)
/** @demo type=value fn=slotGap */
export const slotGap = pad(1.5)
/** @demo type=value fn=containerPad */
export const containerPad = pad(2)

/**
 * Tree level 하나당 수평 들여쓰기 폭.
 * @demo type=value fn=levelShift
 */
export const levelShift = pad(4)

/**
 * Feed 아바타 폭·높이 (lead 슬롯이 auto이지만 실제 요소 크기는 여기서 통제).
 * @demo type=value fn=avatarSize
 */
export const avatarSize = pad(9)
