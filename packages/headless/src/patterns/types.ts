/**
 * @p/headless/patterns 공용 타입 — recipe 시그니처 통일을 위한 building blocks.
 * PATTERNS.md 의 통일 시그니처 참조.
 */

import type { HTMLAttributes } from 'react'

/** 모든 recipe 의 item view 공통 필드. pattern 별로 추가 필드 확장. */
export interface BaseItem {
  id: string
  label: string
  selected: boolean
  disabled: boolean
  posinset: number
  setsize: number
}

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
