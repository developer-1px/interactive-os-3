/**
 * apgCoverageAllowlist — apg-coverage 매트릭스의 합법 ⚠️ allowlist.
 *
 * APG 정본에는 없는데 axis 가 advertise 하는 chord 중, 라이브러리 차원에서 의도한
 * 확장은 `extraAllow` 에 명시. 그 외 ⚠️ 는 신호 (drift) 로 본다.
 *
 * 또한 일부 패턴의 `Tab`/`Shift+Tab` 은 focusTrap 명령형 mechanic 으로 처리되어 axis
 * spec 에 안 잡힌다 — `apgWaive` 로 매트릭스 비교에서 일시 면제.
 *
 * 본 allowlist 가 비어 있을수록 정합. 새 항목 추가 시 PR 에서 사유를 commit message
 * 에 기록 (memory: feedback_canonical_source_w3c_aria — 정본 우선).
 */

/** 모든 패턴 공통: APG keyboard table 외 chord 중 axis 가 1급 advertise 한 universal alias. */
export const UNIVERSAL_EXTRA: readonly string[] = [
  'Click',           // APG 는 keyboard table 만 — axis 는 click 1급
  '<printable>',     // typeahead sentinel — APG 는 'Type-ahead' 자연어
]

/**
 * 다중선택 패턴 공통 확장 — multiSelect axis 가 advertise 하는 chord 중 APG 가
 * listbox 표에만 명시한 chord. listbox/tree/treeGrid/grid 는 동일 multiSelect axis 를
 * 합성하므로 모두 자동 통과.
 */
const MULTI_SELECT_EXTENSION: readonly string[] = [
  '$mod+a',          // selectAll — APG listbox 명시, 다른 패턴 표에는 없음
  '$mod+Click',      // modifier-click toggle (de facto)
  'Shift+Click',     // range click (de facto)
  'Shift+ArrowDown', // range extend (APG listbox 명시)
  'Shift+ArrowUp',
  'Shift+ArrowLeft',
  'Shift+ArrowRight',
  'Shift+Space',     // range from anchor
  '$mod+Space',      // multi-select toggle variant
  '$mod+Shift+Home', // range to first (APG listbox 명시)
  '$mod+Shift+End',  // range to last (APG listbox 명시)
]

/** per-pattern extra allowlist — APG 외 chord 중 의도된 확장. 정규화된 chord 기준. */
export const PATTERN_EXTRA_ALLOW: Record<string, readonly string[]> = {
  // multi-select 패턴: 모두 multiSelect axis 합성 → 공통 확장 상속
  listbox: [...MULTI_SELECT_EXTENSION],
  // tree: APG 는 Home/End 만 명시. 라이브러리는 visible-flat 정점/끝점 chord 도 advertise.
  tree: [...MULTI_SELECT_EXTENSION, '$mod+Home', '$mod+End'],
  treeGrid: [...MULTI_SELECT_EXTENSION, 'Space'],
  grid: [...MULTI_SELECT_EXTENSION, 'Space'],

  // checkbox: Click 외에 APG 는 Space 만 — Click 은 universal
  // switch: Enter — 라이브러리 정책 (APG 'optional')
  switch: ['Enter'],

  // menuButton: 일부 chord 는 menu 가 열린 후 menu axis 가 처리하나 menuButtonAxis 가
  // 미리 advertise (Home/End/Escape/ArrowLeft/ArrowRight)
  menuButton: ['ArrowLeft', 'ArrowRight', 'End', 'Escape', 'Home'],

  // radioGroup: Home/End 추가 advertise (APG 표에 없음 — 라이브러리 확장)
  radioGroup: ['End', 'Enter', 'Home'],

  // spinbutton: ArrowLeft/Right 도 step 으로 advertise (APG 는 Up/Down 만)
  spinbutton: ['ArrowLeft', 'ArrowRight'],

  // splitter: PageUp/Down 큰 step (APG 는 Arrow 만)
  splitter: ['PageDown', 'PageUp'],

  // toolbar: Enter/Space 는 toolbar item 의 activate (APG 표에 없으나 자연 함의)
  toolbar: ['Enter', 'Space'],

  // combobox: Space 는 textbox typing 의 일부 — alias
  combobox: ['Space'],

  // link: activate axis 는 Enter+Space+Click — APG link 표는 Enter 만, Space 는 활성화
  // 시맨틱 외 (브라우저는 link 에 Space scroll). axis 공유 정책상 Space advertise 인정.
  link: ['Space'],

  // comboboxGrid: $mod+Home/End 는 grid 의 corner jump alias
  comboboxGrid: ['$mod+End', '$mod+Home', 'Space'],
}

/**
 * apgWaive — APG 가 요구하나 axis spec 에 안 잡히는 chord (focusTrap 등 명령형
 * mechanic). 매트릭스에서 일시 면제하고 ❌ 카운트에서 제외.
 *
 * 후속: focusTrap 도 chord-as-data 로 끌어올리면 본 항목 정리 가능.
 */
export const PATTERN_APG_WAIVE: Record<string, readonly string[]> = {
  accordion: ['Tab', 'Shift+Tab'],
  alertDialog: ['Tab', 'Shift+Tab'],
  // combobox Tab: tab-out 시 commit. native focus + onBlur 처리 영역 — axis chord 아님.
  combobox: ['Tab'],
  dialog: ['Tab', 'Shift+Tab'],
  // grid Tab: cell 내부 focusable 순회 (native). PageUp/Down: APG 'optional, author-defined'.
  grid: ['Tab', 'PageUp', 'PageDown'],
  menu: ['Tab', 'Shift+Tab'],
  radioGroup: ['Tab', 'Shift+Tab'],
  tabs: ['Tab'],
  toolbar: ['Tab'],
  treeGrid: ['Tab', 'Shift+Tab'],
}
