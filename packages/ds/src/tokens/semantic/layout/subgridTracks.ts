/**
 * subgridTracks — 모든 수직 리스트 컨테이너가 공유하는 3-column subgrid template.
 *
 *   [lead]  = 체브론·아이콘·아바타 등 선두 슬롯 (auto)
 *   [label] = 메인 콘텐츠 (1fr)
 *   [trail] = 배지·시간·메뉴 버튼 등 후위 슬롯 (auto)
 *
 * MenuItem · Option · TreeItem · Listbox row 등 공통 anatomy 의 SSoT.
 * 자식 슬롯은 `[data-slot="leading|label|trailing|meta"]` 로 grid-column 지정.
 *
 * @demo type=value fn=subgridTracks
 */
export const subgridTracks = '[lead] auto [label] 1fr [trail] auto'
