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
 * controlled value 를 가지는 패턴의 props base — 도메인 별 T 다름.
 * Radix·React Aria de facto: value + defaultValue + (single dispatch via onEvent).
 *
 *  T = string         — combobox · textbox · spinbutton · single-select · radiogroup · tab
 *  T = string[]       — multi-select listbox · multi-select tree · treegrid multi
 *  T = number         — slider · progressbar · meter
 *  T = boolean        — switch · checkbox · disclosure
 *  T = [number, number] — range slider
 *
 * value 주입   → controlled
 * value 미주입 → 패턴 내부 useState (defaultValue 시작값)
 */
export interface ValuedPatternProps<T> extends PatternProps {
  value?: T
  defaultValue?: T
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
