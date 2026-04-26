/** /keyboard 페이지 — 부품별 키보드 단축키 표 데이터. */

const ARROW_VERT = [
  ['↓', '다음 항목'],
  ['↑', '이전 항목'],
  ['Home', '첫 항목'],
  ['End', '마지막 항목'],
  ['a-z', 'typeahead — 타이핑한 문자로 시작하는 항목으로 점프'],
] as const

const ARROW_HORI = [
  ['→', '다음 항목'],
  ['←', '이전 항목'],
  ['Home', '첫 항목'],
  ['End', '마지막 항목'],
] as const

export const MENU_KEYS = [...ARROW_VERT, ['Enter / Space', 'activate'], ['Esc', '메뉴 닫기']] as const
export const LISTBOX_KEYS = [...ARROW_VERT, ['Enter / Space', 'select']] as const
export const TREE_KEYS = [
  ...ARROW_VERT,
  ['→', '확장 / 자식으로 이동'],
  ['←', '축소 / 부모로 이동'],
  ['Enter', 'activate'],
] as const
export const COLUMNS_KEYS = [
  ['↓ ↑', '같은 컬럼 내 이동'],
  ['→', '자식 컬럼으로 진입'],
  ['←', '부모 컬럼으로 복귀'],
  ['Enter', 'activate (파일 열기)'],
  ['a-z', 'typeahead'],
] as const
export const RADIO_KEYS = [
  ...ARROW_VERT,
  ...ARROW_HORI,
  ['Space', 'select'],
] as const
export const CHECKBOX_KEYS = [
  ...ARROW_VERT,
  ['Space', 'toggle'],
] as const
export const TABS_KEYS = [
  ...ARROW_HORI,
  ['Enter / Space', '탭 활성화'],
] as const
export const TOOLBAR_KEYS = [
  ...ARROW_HORI,
  ['Enter / Space', '버튼 실행'],
] as const
export const COMBOBOX_KEYS = [
  ['↓', '리스트 열기 / 다음'],
  ['↑', '이전'],
  ['Esc', '리스트 닫기'],
  ['Enter', '선택'],
  ['타이핑', '필터링'],
] as const
export const SELECT_KEYS = [
  ...ARROW_VERT,
  ['Enter / Space', '리스트 열기 / 선택'],
  ['Esc', '닫기'],
] as const
