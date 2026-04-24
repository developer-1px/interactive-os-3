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
// columnheader(sortable) 도 포함 — aria-sort 있을 때만 클릭 피드백이 보여야 하므로 조건부 셀렉터.
export const tableItem = [
  '[role="row"]',
  '[role="gridcell"]',
  '[role="columnheader"][aria-sort]',
].join(', ')

// form-toggle roving — <div role="radio"> 등 native control 밖의 토글.
// controlBox 금지, state(hover/focus/selected/disabled)만 공유.
// <button role="switch"|"checkbox">는 native <button>으로 이미 control에 포함되므로 여기에 넣지 않는다.
export const formToggle = [
  '[role="radio"]',
].join(', ')

// state 규칙(hover/focus/selected/disabled)에는 table row/cell·form toggle도 포함시킨다.
export const rovingItem = [subgridItem, flexItem, tableItem, formToggle].join(', ')

export const control = 'button, [role="button"], input, select, textarea'

// controlBox (min-height·padding·border-radius)는 tr/td에 주면 table 레이아웃이 무너지므로
// clickable에서 tableItem을 제외한다.
export const clickable = ['button', '[role="button"]', subgridItem, flexItem].join(', ')
