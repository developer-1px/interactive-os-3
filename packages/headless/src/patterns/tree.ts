// editable 모드의 chord 어휘는 commands prop 으로 앱이 선언 (SSOT). default 제공.
import { useCallback } from 'react'
import {
  ROOT, getChildren, getLabel, isDisabled, getExpanded,
  type NormalizedData, type UiEvent,
} from '../types'
import { activate, composeAxes, multiSelect, treeExpand, treeNavigate, typeahead } from '../axes'
import { matchEventToChord } from '../axes/chord'
import type { InsideEditableMode } from '../key/insideEditable'
import { usePatternClipboard, type ClipboardOnMiddleware } from './usePatternClipboard'
import { selectionFollowsFocus as applySelectionFollowsFocus } from '../gesture'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type {
  BuiltinChordDescriptor, ItemProps, RootProps, TreeItem,
  TreeCommand, TreeCommandDescriptor,
} from './types'

/**
 * defaultTreeCommands — editable tree 의 기본 keymap. 앱이 시작점으로 spread 해서
 * 일부만 override 하거나, 전체를 자기 spec 으로 대체할 수 있다.
 */
export const defaultTreeCommands: readonly TreeCommandDescriptor[] = [
  { chord: 'Enter',       command: 'editStart',     description: 'Rename — enter inline edit' },
  { chord: 'Shift+Enter', command: 'insertAfter',   description: 'Insert sibling (or child if root)' },
  { chord: 'Backspace',   command: 'remove',        description: 'Remove focused item' },
  { chord: 'Delete',      command: 'remove',        description: 'Remove focused item' },
  { chord: 'Tab',         command: 'demote',        description: 'Demote (move under previous sibling)' },
  { chord: 'Shift+Tab',   command: 'promote',       description: 'Promote (move out of parent)' },
  { chord: 'mod+z',       command: 'undo',          description: 'Undo last operation' },
  { chord: 'mod+shift+z', command: 'redo',          description: 'Redo' },
  { chord: 'mod+y',       command: 'redo',          description: 'Redo (Windows fallback)' },
  { chord: 'mod+shift+v', command: 'paste-as-child', description: 'Paste as child of focused item' },
]

/** treeBuiltinChords — backward-compat. KeymapPanel 등이 쓰던 옛 SSOT 의 default keymap 형태. */
export const treeBuiltinChords: readonly BuiltinChordDescriptor[] = defaultTreeCommands.map((c) => ({
  chord: c.chord,
  uiEvent: c.command,
  description: c.description ?? '',
  scope: 'item',
}))

/** Options for {@link useTreePattern}. */
export interface TreeOptions {
  orientation?: 'horizontal' | 'vertical'
  selectionFollowsFocus?: boolean
  multiSelectable?: boolean
  autoFocus?: boolean
  containerId?: string
  label?: string
  labelledBy?: string
  variant?: 'select' | 'navigation'
  /**
   * editable 모드 — true 면 commands(미지정 시 defaultTreeCommands) 가 활성. false 면 chord 어휘 비활성(읽기-only).
   */
  editable?: boolean
  /**
   * 사용자 chord ↔ command keymap. 앱이 SSOT 로 선언 — chord 추가/제거/재배치 자유.
   * 미지정 + editable=true → defaultTreeCommands. 미지정 + editable=false → [] (chord 비활성).
   */
  commands?: readonly TreeCommandDescriptor[]
  insideEditable?: InsideEditableMode
  on?: ClipboardOnMiddleware
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
 * runCommand — TreeCommand 를 UiEvent 로 변환해 relay. id-바인딩 + data 컨텍스트(findParent)를
 * 한 곳에 가둠. 새 command 추가 시 여기에만 case 추가하면 됨.
 */
function runCommand(
  cmd: TreeCommand,
  id: string | null,
  data: NormalizedData,
  containerId: string,
  relay: (e: UiEvent) => void,
): void {
  if (cmd === 'undo') return relay({ type: 'undo' })
  if (cmd === 'redo') return relay({ type: 'redo' })
  if (!id || id === containerId) return  // 이하 cmd 는 focused item 필요
  switch (cmd) {
    case 'editStart':
      relay({ type: 'editStart', id })
      break
    case 'insertAfter': {
      const parentId = findParent(data, id)
      if (parentId) relay({ type: 'insertAfter', siblingId: id })
      else relay({ type: 'appendChild', parentId: id })
      break
    }
    case 'remove':
      relay({ type: 'remove', id })
      break
    case 'demote': {
      const parentId = findParent(data, id)
      if (parentId) {
        const siblings = data.relationships[parentId] ?? []
        const idx = siblings.indexOf(id)
        const prev = idx > 0 ? siblings[idx - 1] : null
        if (prev) relay({ type: 'move', id, targetId: prev, mode: 'child' })
      }
      break
    }
    case 'promote': {
      const parentId = findParent(data, id)
      if (parentId && parentId !== containerId) {
        relay({ type: 'move', id, targetId: parentId, mode: 'sibling-after' })
      }
      break
    }
    case 'paste-as-child':
      relay({ type: 'paste', targetId: id, mode: 'child' })
      break
  }
}

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
  editProps: (id: string) => null | { initial: string; onCommit: (value: string, cancelled: boolean) => void }
} {
  const {
    autoFocus, multiSelectable, containerId = ROOT, orientation = 'vertical',
    label, labelledBy, variant = 'select', editable = false,
    insideEditable = 'forward',
  } = opts
  const sff = opts.selectionFollowsFocus ?? !multiSelectable

  // commands SSOT 결정 — 앱이 명시 > editable=true 면 default > 그 외 빈 배열.
  const commands: readonly TreeCommandDescriptor[] =
    opts.commands ?? (editable ? defaultTreeCommands : [])

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

  // 단일 chord dispatcher — commands 배열 순회. 매칭되면 preventDefault + runCommand.
  const dispatchCommandChord = (e: React.KeyboardEvent): boolean => {
    for (const desc of commands) {
      if (matchEventToChord(e.nativeEvent, desc.chord)) {
        e.preventDefault()
        runCommand(desc.command, focusId, data, containerId, relay)
        return true
      }
    }
    return false
  }

  const activeId = focusId && focusId !== containerId ? focusId : null

  // clipboard event handlers (onCopy/onCut/onPaste) 만 — chord 는 위 dispatcher 가 흡수
  const clipboard = usePatternClipboard({
    onEvent,
    activeId,
    insideEditable,
    on: opts.on,
    builtinChords: treeBuiltinChords,
    disableBuiltinChords: true,  // tree 가 자체 commands 로 모든 chord 처리
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (dispatchCommandChord(e)) return
    delegate.onKeyDown(e)
    if (e.defaultPrevented) return
    clipboard.handleKeyDown(e)  // 'on' middleware 만 실행 (builtin chord 는 비활성)
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

  const editingId = data.meta?.editing
  const editProps = (id: string) => {
    if (editingId !== id) return null
    const it = itemMap.get(id)
    return {
      initial: it?.label ?? '',
      onCommit: (value: string, cancelled: boolean) => {
        if (!cancelled) relay({ type: 'update', id, value })
        relay({ type: 'editEnd' })
      },
    }
  }

  return { rootProps, itemProps, items: flat, editProps }
}
