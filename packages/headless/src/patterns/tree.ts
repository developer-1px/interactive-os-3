// editable 옵션은 디폴트 false. true 일 때만 편집 어휘를 emit (W1 UiEvent 8종 참조).
import { useCallback } from 'react'
import {
  ROOT, getChildren, getLabel, isDisabled, getExpanded,
  type NormalizedData, type UiEvent,
} from '../types'
import { activate, composeAxes, multiSelect, treeExpand, treeNavigate, typeahead, matchAnyChord } from '../axes'
import { parseChord } from '../axes/chord'
import type { InsideEditableMode } from '../key/insideEditable'
import { usePatternClipboard, type ClipboardOnMiddleware } from './usePatternClipboard'

/** tree edit-mode chord registry — declarative SSOT (Enter, Backspace, Tab, Shift+Tab). */
const TREE_EDIT_INSERT = ['Enter'] as const
const TREE_EDIT_REMOVE = ['Backspace'] as const
const TREE_EDIT_DEMOTE = ['Tab'] as const
const TREE_EDIT_PROMOTE = ['Shift+Tab'] as const

/** treeEditKeys — chord registry 합집합 도출. editable 모드 추가 키. */
export const treeEditKeys = (): readonly string[] =>
  Array.from(new Set([
    ...TREE_EDIT_INSERT, ...TREE_EDIT_REMOVE, ...TREE_EDIT_DEMOTE, ...TREE_EDIT_PROMOTE,
  ].map((c) => parseChord(c).key)))
import { selectionFollowsFocus as applySelectionFollowsFocus } from '../gesture'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BuiltinChordDescriptor, ItemProps, RootProps, TreeItem } from './types'

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
  /**
   * input/contenteditable 안에서 clipboard/단축키 라우팅 모드.
   * 'forward' (default) — emit 하되 native 동작 보존(검색창 paste 등).
   * 'native' — input 안이면 skip(인라인 편집 셀에서 native 양보).
   * 'preventDefault' — emit + native 차단(커스텀 에디터).
   */
  insideEditable?: InsideEditableMode
  /**
   * 사용자 chord 미들웨어. key+mouse 통합. default chord 와 충돌 시
   * userFn(event, originalFn) 으로 wrap — originalFn 호출 여부로 default 실행 결정.
   * default win — preventDefault 는 항상 발생.
   */
  on?: ClipboardOnMiddleware
}

/**
 * tree 가 디폴트로 흡수하는 chord 목록 — descriptor SSOT.
 * clipboard event handler(onCopy/onCut/onPaste) 는 chord 가 아닌 React clipboard event 라
 * 별도 entry 로 표현 — chord 필드에 'clipboard:copy' 등 prefix 사용.
 */
export const treeBuiltinChords: readonly BuiltinChordDescriptor[] = [
  { chord: 'mod+z',       uiEvent: 'undo',   description: 'Undo last operation' },
  { chord: 'mod+shift+z', uiEvent: 'redo',   description: 'Redo' },
  { chord: 'mod+y',       uiEvent: 'redo',   description: 'Redo (Windows fallback)' },
  { chord: 'Backspace',   uiEvent: 'remove', description: 'Remove focused item', scope: 'item' },
  { chord: 'Delete',      uiEvent: 'remove', description: 'Remove focused item', scope: 'item' },
  { chord: 'mod+shift+v', uiEvent: 'paste',  description: 'Paste as child of focused item', scope: 'item' },
  // editable 모드 chord (opts.editable=true 일 때만 활성)
  { chord: TREE_EDIT_INSERT[0],  uiEvent: 'insertAfter|appendChild', description: 'Insert sibling (or child if root) — editable mode', scope: 'item' },
  { chord: TREE_EDIT_REMOVE[0],  uiEvent: 'remove',                  description: 'Remove focused item — editable mode',              scope: 'item' },
  { chord: TREE_EDIT_DEMOTE[0],  uiEvent: 'cut+paste',               description: 'Demote (move under previous sibling)',             scope: 'item' },
  { chord: TREE_EDIT_PROMOTE[0], uiEvent: 'cut+paste',               description: 'Promote (move out of parent)',                     scope: 'item' },
  // clipboard React events — not chord-based but reserved on rootProps
  { chord: 'clipboard:copy',  uiEvent: 'copy',  description: 'Copy focused item (React onCopy)',   scope: 'item' },
  { chord: 'clipboard:cut',   uiEvent: 'cut',   description: 'Cut focused item (React onCut)',     scope: 'item' },
  { chord: 'clipboard:paste', uiEvent: 'paste', description: 'Paste onto focused item (React onPaste)', scope: 'item' },
]

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
    insideEditable = 'forward',
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
          if (matchAnyChord(e as unknown as KeyboardEvent, TREE_EDIT_INSERT)) {
            e.preventDefault()
            // root 면 자식 추가, else 시블 추가. crud op 어휘 1:1.
            const parentId = findParent(data, id)
            if (parentId) relay({ type: 'insertAfter', siblingId: id })
            else          relay({ type: 'appendChild', parentId: id })
            return
          }
          if (matchAnyChord(e as unknown as KeyboardEvent, TREE_EDIT_REMOVE)) {
            e.preventDefault()
            relay({ type: 'remove', id })
            return
          }
          if (matchAnyChord(e as unknown as KeyboardEvent, TREE_EDIT_DEMOTE)) {
            const parentId = findParent(data, id)
            if (parentId) {
              const siblings = data.relationships[parentId] ?? []
              const idx = siblings.indexOf(id)
              const prev = idx > 0 ? siblings[idx - 1] : null
              if (prev) {
                e.preventDefault()
                relay({ type: 'move', id, targetId: prev, mode: 'child' })
                return
              }
            }
          }
          if (matchAnyChord(e as unknown as KeyboardEvent, TREE_EDIT_PROMOTE)) {
            const parentId = findParent(data, id)
            if (parentId && parentId !== containerId) {
              e.preventDefault()
              relay({ type: 'move', id, targetId: parentId, mode: 'sibling-after' })
              return
            }
          }
        }
        delegate.onKeyDown(e)
      }
    : delegate.onKeyDown

  const activeId = focusId && focusId !== containerId ? focusId : null

  const clipboard = usePatternClipboard({
    onEvent,
    activeId,
    insideEditable,
    on: opts.on,
    builtinChords: treeBuiltinChords,
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    editKeyDown(e)
    if (e.defaultPrevented) return
    clipboard.handleKeyDown(e)
  }

  const rootProps: RootProps = {
    role: 'tree',
    'aria-multiselectable': multiSelectable || undefined,
    'aria-orientation': orientation,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...delegate,
    onKeyDown: handleKeyDown,
    onCopy: clipboard.onCopy,
    onCut: clipboard.onCut,
    onPaste: clipboard.onPaste,
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
