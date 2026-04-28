import { pad } from '../../scalar/space'

/**
 * keyline — 수직 리스트 컨테이너의 baseline spacing 상수.
 *
 * Law of Proximity: slotGap < containerPad — 같은 행 안 아이콘·라벨은 붙고,
 * 행끼리는 여유 있게 떨어져야 시각 그룹이 뚜렷해진다.
 *
 * 같은 anatomy 의 grid template 은 `layout/subgridTracks` 에 분리.
 */

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
