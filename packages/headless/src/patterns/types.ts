/**
 * @p/headless/patterns 공용 타입 — recipe 시그니처 통일을 위한 building blocks.
 * PATTERNS.md 의 통일 시그니처 참조.
 */

import type { HTMLAttributes } from 'react'
import type { NormalizedData, UiEvent } from '../types'

/**
 * Wrapper 의 표준 props base — 모든 컬렉션 wrapper 가 공유.
 *  data    : single data interface (NormalizedData)
 *  onEvent : single dispatch interface (모든 변화 통과)
 *  aria-label / aria-labelledby : accessible name (둘 중 하나 ARIA 강제)
 *
 * wrapper-specific 옵션(slots/placeholder/orientation 등)은 extends 로 추가.
 */
export interface PatternProps {
  data: NormalizedData
  onEvent: (e: UiEvent) => void
  'aria-label'?: string
  'aria-labelledby'?: string
}

/**
 * Control 패턴(switch · checkbox · radio · slider · spinbutton · textbox · combobox 입력)의
 * wrapper props base. collection 패턴(`PatternProps`)과 형제 — `data` 를 들지 않고 단일 T value 만 다룸.
 * Radix · React Aria de facto: value + defaultValue + single dispatch via onEvent.
 *
 *  T = string  — combobox 입력 · textbox · spinbutton 표시값
 *  T = number  — slider · progressbar · meter
 *  T = boolean — switch · checkbox · disclosure
 *
 * value 주입   → controlled
 * value 미주입 → 패턴 내부 useState (defaultValue 시작값)
 *
 * 표준 어댑터: `useControlValue` (state/useControlValue).
 */
export interface ControlProps<T> {
  value?: T
  defaultValue?: T
  onEvent: (e: UiEvent) => void
  'aria-label'?: string
  'aria-labelledby'?: string
}

/** 모든 recipe 의 item view 공통 필드. pattern 별로 추가 필드 확장. */
export interface BaseItem {
  id: string
  label: string
  selected: boolean
  disabled: boolean
  posinset: number
  setsize: number
}

/** Tree/treegrid item view — BaseItem + level/expanded/hasChildren. */
export interface TreeItem extends BaseItem {
  level: number
  expanded: boolean
  hasChildren: boolean
}

/**
 * Pattern Options 공통 base — 거의 모든 Options interface 가 extends.
 *  label · labelledBy : ARIA accessible name (둘 중 하나 강제)
 */
export interface BasePatternOptions {
  /** ARIA accessible name. */
  label?: string
  /** ARIA `aria-labelledby` — id of element naming this pattern. */
  labelledBy?: string
}

/**
 * Collection Options base — data-driven pattern 들이 공유.
 *  containerId · idPrefix · autoFocus · orientation
 * 각 패턴이 미지원 옵션은 Omit 또는 단순히 사용 안 함.
 */
export interface CollectionOptions extends BasePatternOptions {
  /** NormalizedData 의 root container id (default ROOT). */
  containerId?: string
  /** useId 기반 안정 ID 네임스페이스. */
  idPrefix?: string
  /** mount 시 첫 항목 focus. */
  autoFocus?: boolean
  /** ARIA orientation. */
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Builtin chord descriptor — pattern 이 자기 디폴트로 흡수하는 chord 한 entry.
 * llms.txt / 문서 자동 추출 + 사용자/LLM 이 어떤 chord 가 reserved 인지 알게 함.
 *  chord       : axes/chord parseChord 형식 (e.g. 'mod+z', 'Shift+Tab')
 *  uiEvent     : emit 되는 UiEvent['type']
 *  description : 한 줄 설명
 *  scope       : 'root' (default) | 'item' (focused item 필요)
 */
export interface BuiltinChordDescriptor {
  chord: string
  uiEvent: string
  description: string
  scope?: 'root' | 'item'
}

/**
 * TreeCommand — tree pattern 이 실행 가능한 정의된 명령 어휘. 앱이 chord ↔ command
 * 매핑을 자유롭게 바꾸려면 이 union 안에서 선택. 새 명령은 패턴이 추가해야 함 (앱 확장 X).
 */
export type TreeCommand =
  | 'editStart'
  | 'insertAfter'   // root 면 자동으로 appendChild
  | 'remove'
  | 'demote'        // 이전 형제의 마지막 자식으로 이동
  | 'promote'       // 부모의 다음 형제로 이동
  | 'undo'
  | 'redo'
  | 'paste-as-child'

/** TreeCommandDescriptor — 앱이 keymap SSOT 로 선언하는 chord ↔ command 매핑 + 설명. */
export interface TreeCommandDescriptor {
  chord: string
  command: TreeCommand
  description?: string
}

/** rootProps — pattern 컨테이너에 spread. role/aria-* 필수, ref/onKey 포함. */
export type RootProps = HTMLAttributes<HTMLElement> & {
  role: string
}

/** itemProps(id) 형태의 part-getter 반환 타입. */
export type ItemProps = HTMLAttributes<HTMLElement> & {
  role?: string
  tabIndex?: number
  'data-id'?: string
  'aria-selected'?: boolean
  'aria-disabled'?: boolean
  'aria-current'?: 'page' | 'location' | 'date' | 'time' | 'true' | 'false'
}
