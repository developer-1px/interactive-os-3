import { pad } from '../../fn'

// 모든 수직 리스트 컨테이너가 공유하는 subgrid 축.
// [lead]  = 체브론·아이콘·아바타 등 선두 슬롯 (auto)
// [label] = 메인 콘텐츠 (1fr)
// [trail] = 배지·시간·메뉴 버튼 등 후위 슬롯 (auto)
export const tracks = '[lead] auto [label] 1fr [trail] auto'

// 축 간격 — gap(container padding / row-gap)과 slotGap(lead↔label)을 분리.
// 원칙: slotGap < containerPad. "요소 내부 그룹 간격은 외부 여백보다 작아야 한다"
// (Law of Proximity) — 같은 행 안의 아이콘·라벨은 붙어 보이고, 행은 여유 있게 떨어져야
// 시각 그룹이 뚜렷해진다. 행 좌우 패딩은 rowPadding(2) = pad(2)이므로 slotGap은 그보다 작게.
export const gap = pad(2)
export const rowGap = gap
export const slotGap = pad(1.5)
export const containerPad = gap

// Tree level 하나당 수평 들여쓰기 폭
export const levelShift = pad(4)

// Feed 아바타 폭·높이 (lead 슬롯이 auto이지만 실제 요소 크기는 여기서 통제)
export const avatarSize = pad(9)
