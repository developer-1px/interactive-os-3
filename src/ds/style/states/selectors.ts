// 수직 리스트 아이템 — subgrid로 container column 공유
export const subgridItem = [
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="option"]',
  '[role="treeitem"]',
].join(', ')

// 수평 flex 배치 — tab/toolbar 전용. row/gridcell은 native table 레이아웃을 유지해야 하므로
// 여기서 배제한다 (포함시키면 <tr>/<td>가 display:flex가 되어 table-row/table-cell이 깨진다).
export const flexItem = [
  '[role="tab"]',
  '[role="toolbar"] > button',
].join(', ')

// 네이티브 <tr>/<td>에 얹힌 roving — display·box는 건드리지 않고 state(hover/focus/selected)만 공유.
export const tableItem = [
  '[role="row"]',
  '[role="gridcell"]',
].join(', ')

// state 규칙(hover/focus/selected/disabled)에는 table row/cell도 포함시킨다.
export const rovingItem = [subgridItem, flexItem, tableItem].join(', ')

export const control = 'button, [role="button"], input, select, textarea'

// controlBox (min-height·padding·border-radius)는 tr/td에 주면 table 레이아웃이 무너지므로
// clickable에서 tableItem을 제외한다.
export const clickable = ['button', '[role="button"]', subgridItem, flexItem].join(', ')
