// 수직 리스트 아이템 — subgrid로 container column 공유
export const subgridItem = [
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="option"]',
  '[role="treeitem"]',
].join(', ')

// 수평/table 배치 — flex 유지
export const flexItem = [
  '[role="tab"]',
  '[role="row"]',
  '[role="gridcell"]',
  '[role="toolbar"] > button',
].join(', ')

export const rovingItem = [subgridItem, flexItem].join(', ')

export const control = 'button, [role="button"], input, select, textarea'

export const clickable = ['button', '[role="button"]', rovingItem].join(', ')
