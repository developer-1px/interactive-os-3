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

export const ACCORDION_KEYS = [
  ['Tab', '다음 panel header'],
  ['Enter / Space', 'header toggle (expand/collapse)'],
  ['↑ / ↓', 'panel 간 이동 (브라우저 기본 / native details)'],
] as const

export const DISCLOSURE_KEYS = [
  ['Enter / Space', 'expand / collapse'],
  ['Tab', '다음 컨트롤'],
] as const

export const SWITCH_KEYS = [
  ['Space', 'toggle on/off'],
  ['Enter', 'toggle (form submit 위험 — Switch는 Space 권장)'],
] as const

export const SLIDER_KEYS = [
  ['→ / ↑', '+1'],
  ['← / ↓', '-1'],
  ['PageUp', '+10 (큰 단계)'],
  ['PageDown', '-10 (큰 단계)'],
  ['Home', 'min'],
  ['End', 'max'],
] as const

export const SEGMENTED_KEYS = [
  ...ARROW_HORI,
  ['focus 이동', '선택도 같이 이동 (selection follows focus)'],
] as const

export const TOGGLEGROUP_KEYS = [
  ...ARROW_HORI,
  ['Enter / Space', '개별 toggle on/off'],
] as const

export const PAGINATION_KEYS = [
  ['Tab', '페이지 버튼 간 이동 (자연 tab order)'],
  ['Enter / Space', '페이지로 이동'],
] as const

export const STEPPER_KEYS = [
  ['Tab', '다음 step (자연 reading order)'],
  ['—', 'Stepper는 표시(presentational). 활성화 트리거는 별도 버튼이 가짐'],
] as const

export const MENUBAR_KEYS = [
  ...ARROW_HORI,
  ['↓', '서브메뉴 열기 (구현 시)'],
  ['Enter / Space', 'menuitem 활성'],
] as const

export const SPINBUTTON_KEYS = [
  ['↑', '+step'],
  ['↓', '-step'],
  ['PageUp', '+10·step (브라우저별)'],
  ['PageDown', '-10·step (브라우저별)'],
  ['Home', 'min'],
  ['End', 'max'],
  ['숫자 입력', '직접 타이핑'],
] as const

export const DATAGRID_KEYS = [
  ['↓ / ↑', '행 이동 (row-focus 모델)'],
  ['Home / End', '첫 행 / 마지막 행'],
  ['Enter', '편집·activate (소비자 정의)'],
] as const

export const TREEGRID_KEYS = [
  ['↓ / ↑', '행 이동'],
  ['→', '확장 / 자식 행으로'],
  ['←', '축소 / 부모 행으로'],
  ['Home / End', '첫 / 마지막 행'],
] as const

export const DIALOG_KEYS = [
  ['Tab', 'modal 내부 순환 (focus trap, native <dialog>)'],
  ['Esc', '닫기 (native cancel)'],
  ['Enter', '기본 버튼 (form 위임)'],
] as const
