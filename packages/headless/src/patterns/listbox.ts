import { useCallback } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, multiSelect, navigate, typeahead, matchAnyChord } from '../axes'

/** listbox edit-mode chord registry — declarative SSOT (Enter=insertAfter, Backspace=remove). */
const LISTBOX_EDIT_INSERT = ['Enter'] as const
const LISTBOX_EDIT_REMOVE = ['Backspace'] as const

/** listboxEditKeys — chord registry 합집합 도출. editable 모드 추가 키. */
export const listboxEditKeys = (): readonly string[] =>
  [...LISTBOX_EDIT_INSERT, ...LISTBOX_EDIT_REMOVE]
import { selectionFollowsFocus as applySelectionFollowsFocus } from '../gesture'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

/** Options for {@link useListboxPattern}. */
export interface ListboxOptions {
  /** aria-orientation. Spec implicit value: 'vertical'. */
  orientation?: 'horizontal' | 'vertical'
  /** Default: `!multiSelectable` (APG: single sff, multi explicit toggle). */
  selectionFollowsFocus?: boolean
  /** aria-multiselectable. */
  multiSelectable?: boolean
  autoFocus?: boolean
  /** Container entity for nested listboxes (e.g. inside a Menu); defaults to ROOT. */
  containerId?: string
  /** aria-required (form context). */
  required?: boolean
  /** aria-readonly (form context). */
  readOnly?: boolean
  /** aria-invalid (form context). */
  invalid?: boolean
  /** aria-disabled (whole-listbox disabled). */
  disabled?: boolean
  /** aria-label — ARIA: listbox requires accessible name. */
  label?: string
  labelledBy?: string
  /**
   * APG `listbox-grouped` 변종. 활성화 시 ROOT 의 자식이 group entity 이고, 각 group 의
   * 자식이 option 이다 (`fromTree`로 빌드). `<groupProps(groupId)>` getter 와 `groups`
   * 배열이 추가로 노출된다. default false (flat list).
   */
  groups?: boolean
  /**
   * APG `listbox-rearrangeable` 변종. 의미적 marker — root 에 `data-rearrangeable=""`
   * 가 붙고 소비자가 Toolbar (Move Up/Down/Add/Remove) 와 wiring 한다.
   * 패턴 자체는 이벤트를 emit 하지 않는다 — 소비자가 toolbar 버튼 click 을 직접 처리.
   */
  rearrangeable?: boolean
  /**
   * 편집 모드 — Enter→insertAfter(focused option), Backspace→remove(focused option) 흡수.
   * tree 의 `editable` 와 동일 어휘. listbox 는 indent 가 없으므로 Tab 매핑은 없음.
   * 디폴트 false.
   */
  editable?: boolean
  idPrefix?: string
}

// multiSelect must precede navigate — otherwise navigate matches Shift+Arrow first and the range branch never runs.
/**
 * Listbox 가 등록하는 axis — SSOT. 데모/문서는 이걸 probe 해서 키 목록 도출.
 * 옵션을 그대로 받아 동일한 합성을 노출.
 */
export const listboxAxis = (opts: ListboxOptions = {}) => {
  const orientation = opts.orientation ?? 'vertical'
  return opts.multiSelectable
    ? composeAxes(multiSelect, navigate(orientation), activate, typeahead)
    : composeAxes(navigate(orientation), activate, typeahead)
}

/**
 * listbox — APG `/listbox/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 */
export function useListboxPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: ListboxOptions = {},
): {
  rootProps: RootProps
  optionProps: (id: string) => ItemProps
  groupProps: (groupId: string) => ItemProps
  items: BaseItem[]
  groups: { id: string; label: string; options: BaseItem[] }[]
} {
  const {
    multiSelectable, autoFocus, containerId = ROOT, orientation = 'vertical',
    required, readOnly, invalid, disabled, label, labelledBy,
    groups: groupsOpt, rearrangeable, editable = false, idPrefix = 'lb',
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

  const axis = listboxAxis(opts)
  const { focusId, bindFocus, delegate } = useRovingTabIndex(axis, data, relay, {
    autoFocus,
    containerId,
  })

  // groups 모드: ROOT 자식 = group, 각 group 자식 = option. 평면 ids 는 모든 option.
  const directChildren = getChildren(data, containerId)
  const groupIds = groupsOpt ? directChildren : []
  const ids = groupsOpt
    ? groupIds.flatMap((gid) => getChildren(data, gid))
    : directChildren

  const items: BaseItem[] = ids.map((id, i) => {
    const ent = data.entities[id] ?? {}
    return {
      id,
      label: getLabel(data, id),
      selected: Boolean(ent.selected),
      disabled: isDisabled(data, id),
      posinset: i + 1,
      setsize: ids.length,
    }
  })
  const itemMap = new Map(items.map((it) => [it.id, it]))
  const groups = groupIds.map((gid) => {
    const optionIds = getChildren(data, gid)
    return {
      id: gid,
      label: getLabel(data, gid),
      options: optionIds.map((oid) => itemMap.get(oid)!).filter(Boolean),
    }
  })
  const groupLabelDomId = (gid: string) => `${idPrefix}-glbl-${gid}`

  const editKeyDown = editable
    ? (e: React.KeyboardEvent) => {
        const id = focusId
        if (id && id !== containerId) {
          if (matchAnyChord(e as unknown as KeyboardEvent, LISTBOX_EDIT_INSERT)) {
            e.preventDefault()
            relay({ type: 'insertAfter', siblingId: id })
            return
          }
          if (matchAnyChord(e as unknown as KeyboardEvent, LISTBOX_EDIT_REMOVE)) {
            e.preventDefault()
            relay({ type: 'remove', id })
            return
          }
        }
        delegate.onKeyDown(e)
      }
    : delegate.onKeyDown

  const rootProps: RootProps = {
    role: 'listbox',
    'aria-multiselectable': multiSelectable || undefined,
    'aria-orientation': orientation,
    'aria-required': required || undefined,
    'aria-readonly': readOnly || undefined,
    'aria-invalid': invalid || undefined,
    'aria-disabled': disabled || undefined,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...(rearrangeable ? { 'data-rearrangeable': '' } : {}),
    ...delegate,
    onKeyDown: editKeyDown,
  } as RootProps

  const optionProps = (id: string): ItemProps => {
    const it = itemMap.get(id)
    const isFocus = focusId === id
    return {
      role: 'option',
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-selected': it?.selected ?? false,
      'aria-disabled': it?.disabled || undefined,
      'aria-posinset': it?.posinset,
      'aria-setsize': it?.setsize,
      'data-selected': it?.selected ? '' : undefined,
      'data-disabled': it?.disabled ? '' : undefined,
      'data-focus-visible': isFocus ? '' : undefined,
    } as unknown as ItemProps
  }

  const groupProps = (groupId: string): ItemProps => ({
    role: 'group',
    'data-id': groupId,
    'aria-labelledby': groupLabelDomId(groupId),
  } as unknown as ItemProps)

  return { rootProps, optionProps, groupProps, items, groups }
}

/** group 의 label 요소에 부여할 id (소비자가 groupProps 의 aria-labelledby 와 매칭). */
export const groupLabelId = (idPrefix: string, gid: string): string =>
  `${idPrefix}-glbl-${gid}`
