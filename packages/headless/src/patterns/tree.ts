// editable 옵션은 디폴트 false. true 일 때만 편집 어휘를 emit (W1 UiEvent 8종 참조).
import { useCallback } from 'react'
import {
  ROOT, getChildren, getLabel, isDisabled, getExpanded,
  type NormalizedData, type UiEvent,
} from '../types'
import { activate, composeAxes, multiSelect, treeExpand, treeNavigate, typeahead, KEYS, matchChord } from '../axes'
import type { KeyChord } from '../axes/keys'

/** tree edit-mode chord registry — declarative SSOT (Enter, Backspace, Tab, Shift+Tab). */
const TREE_EDIT_INSERT: readonly KeyChord[] = [{ key: KEYS.Enter }]
const TREE_EDIT_REMOVE: readonly KeyChord[] = [{ key: KEYS.Backspace }]
const TREE_EDIT_DEMOTE: readonly KeyChord[] = [{ key: KEYS.Tab }]
const TREE_EDIT_PROMOTE: readonly KeyChord[] = [{ key: KEYS.Tab, shift: true }]

/** treeEditKeys — chord registry 합집합 도출. editable 모드 추가 키. */
export const treeEditKeys = (): readonly string[] =>
  Array.from(new Set([
    ...TREE_EDIT_INSERT, ...TREE_EDIT_REMOVE, ...TREE_EDIT_DEMOTE, ...TREE_EDIT_PROMOTE,
  ].map((c) => c.key)))
import { selectionFollowsFocus as applySelectionFollowsFocus } from '../gesture'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { ItemProps, RootProps, TreeItem } from './types'

/** Options for {@link useTreePattern}. */
export interface TreeOptions {
  /** aria-orientation. Spec implicit value: 'vertical'. */
  orientation?: 'horizontal' | 'vertical'
  /** Default: `!multiSelectable` (APG: single sff, multi explicit toggle). */
  selectionFollowsFocus?: boolean
  /** aria-multiselectable. */
  multiSelectable?: boolean
  autoFocus?: boolean
  /** Container entity for nested trees; defaults to ROOT. */
  containerId?: string
  /** aria-label — ARIA: tree requires accessible name. */
  label?: string
  labelledBy?: string
  /**
   * APG `treeview-navigation` 변종. `'navigation'` 일 때 selected treeitem 에
   * `aria-current="page"` 가 추가로 emit 된다 (sidebar/route nav 용도). default `'select'`.
   */
  variant?: 'select' | 'navigation'
  /**
   * 편집 모드 — Enter/Tab/Shift+Tab/Backspace 키를 패턴이 디폴트로 흡수한다.
   * 디폴트 false (비편집). UiEvent 8종 (create/remove + paste 시퀀스) 으로 emit.
   */
  editable?: boolean
}

const findParent = (data: NormalizedData, id: string): string | null => {
  for (const [pid, kids] of Object.entries(data.relationships)) {
    if (kids.includes(id)) return pid
  }
  return null
}

/** Tree 가 등록하는 axis — SSOT. */
export const treeAxis = (opts: { multiSelectable?: boolean } = {}) =>
  opts.multiSelectable
    ? composeAxes(multiSelect, treeNavigate, treeExpand, activate, typeahead)
    : composeAxes(treeNavigate, treeExpand, activate, typeahead)
const singleAxis = treeAxis()
const multiAxis = treeAxis({ multiSelectable: true })

/**
 * tree — APG `/treeview/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 */
export function useTreePattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: TreeOptions = {},
): {
  rootProps: RootProps
  itemProps: (id: string) => ItemProps
  items: TreeItem[]
} {
  const {
    autoFocus, multiSelectable, containerId = ROOT, orientation = 'vertical',
    label, labelledBy, variant = 'select', editable = false,
  } = opts
  const sff = opts.selectionFollowsFocus ?? !multiSelectable

  const relay = useCallback(
    (e: UiEvent) => {
      if (!onEvent) return
      const out = sff ? applySelectionFollowsFocus(data, e) : [e]
      out.forEach(onEvent)
    },
    [data, onEvent, sff],
  )

  const axis = multiSelectable ? multiAxis : singleAxis
  const { focusId, bindFocus, delegate } = useRovingTabIndex(axis, data, relay, {
    autoFocus,
    containerId,
  })
  const expanded = getExpanded(data)

  const flat: TreeItem[] = []
  const walk = (parent: string, level: number) => {
    const children = getChildren(data, parent)
    children.forEach((id, i) => {
      const ent = data.entities[id] ?? {}
      const kids = getChildren(data, id)
      const isExpanded = expanded.has(id)
      flat.push({
        id,
        label: getLabel(data, id),
        selected: Boolean(ent.selected),
        disabled: isDisabled(data, id),
        level,
        expanded: isExpanded,
        hasChildren: kids.length > 0,
        posinset: i + 1,
        setsize: children.length,
      })
      if (isExpanded) walk(id, level + 1)
    })
  }
  walk(containerId, 1)
  const itemMap = new Map(flat.map((it) => [it.id, it]))

  const editKeyDown = editable
    ? (e: React.KeyboardEvent) => {
        const id = focusId
        if (id && id !== containerId) {
          if (matchChord(e as unknown as KeyboardEvent, TREE_EDIT_INSERT)) {
            e.preventDefault()
            // root 면 자식 추가, else 시블 추가. crud op 어휘 1:1.
            const parentId = findParent(data, id)
            if (parentId) relay({ type: 'insertAfter', siblingId: id })
            else          relay({ type: 'appendChild', parentId: id })
            return
          }
          if (matchChord(e as unknown as KeyboardEvent, TREE_EDIT_REMOVE)) {
            e.preventDefault()
            relay({ type: 'remove', id })
            return
          }
          if (matchChord(e as unknown as KeyboardEvent, TREE_EDIT_DEMOTE)) {
            const parentId = findParent(data, id)
            if (parentId) {
              const siblings = data.relationships[parentId] ?? []
              const idx = siblings.indexOf(id)
              const prev = idx > 0 ? siblings[idx - 1] : null
              if (prev) {
                e.preventDefault()
                relay({ type: 'cut', id })
                relay({ type: 'paste', targetId: prev, mode: 'child' })
                return
              }
            }
          }
          if (matchChord(e as unknown as KeyboardEvent, TREE_EDIT_PROMOTE)) {
            const parentId = findParent(data, id)
            if (parentId && parentId !== containerId) {
              e.preventDefault()
              relay({ type: 'cut', id })
              relay({ type: 'paste', targetId: parentId, mode: 'auto' })
              return
            }
          }
        }
        delegate.onKeyDown(e)
      }
    : delegate.onKeyDown

  const rootProps: RootProps = {
    role: 'tree',
    'aria-multiselectable': multiSelectable || undefined,
    'aria-orientation': orientation,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...delegate,
    onKeyDown: editKeyDown,
  } as RootProps

  const itemProps = (id: string): ItemProps => {
    const it = itemMap.get(id)
    const isFocus = focusId === id
    return {
      role: 'treeitem',
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-selected': it?.selected ?? false,
      'aria-current': variant === 'navigation' && it?.selected ? 'page' : undefined,
      'aria-disabled': it?.disabled || undefined,
      'aria-expanded': it?.hasChildren ? it.expanded : undefined,
      'aria-level': it?.level,
      'aria-posinset': it?.posinset,
      'aria-setsize': it?.setsize,
      'data-selected': it?.selected ? '' : undefined,
      'data-expanded': it?.expanded ? '' : undefined,
    } as unknown as ItemProps
  }

  return { rootProps, itemProps, items: flat }
}
