import { pad } from '../../fn'

// 모든 수직 리스트 컨테이너가 공유하는 subgrid 축.
// [lead]  = 체브론·아이콘·아바타 등 선두 슬롯 (auto)
// [label] = 메인 콘텐츠 (1fr)
// [trail] = 배지·시간·메뉴 버튼 등 후위 슬롯 (auto)
export const tracks = '[lead] auto [label] 1fr [trail] auto'

// 단일 간격 값 — container padding / row-gap / slot-gap 모두 이 값 하나로 통제된다.
// 세 축이 같아야만 lead 슬롯(아이콘·아바타) 주변 여백이 정사각형이 된다.
export const gap = pad(2)
export const rowGap = gap
export const slotGap = gap
export const containerPad = gap

// Tree level 하나당 수평 들여쓰기 폭
export const levelShift = pad(4)

// Feed 아바타 폭·높이 (lead 슬롯이 auto이지만 실제 요소 크기는 여기서 통제)
export const avatarSize = pad(9)
