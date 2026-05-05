import { useCallback, useState } from 'react'
import {
  ROOT, getChildren, getLabel, isDisabled,
  type NormalizedData, type UiEvent,
} from '../types'
import {
  activate as activateAxis, composeAxes, escape as escapeAxis,
  fromKeyMap, INTENTS, KEYS, matchChord, navigate as navigateAxis, seedExpand,
} from '../axes'
import type { Axis } from '../axes/axis'
import { parseTrigger } from '../trigger'
import { parentOf } from '../axes/index'
import { bindAxis } from '../state/bind'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

/** Options for {@link useMenubarPattern}. */
export interface MenubarOptions {
  orientation?: 'horizontal' | 'vertical'
  autoFocus?: boolean
  /** aria-label — ARIA: menubar requires accessible name. */
  label?: string
  labelledBy?: string
  /** id prefix for sub-menu DOM ids. */
  idPrefix?: string
}

/**
 * crossTop — sub item 에서 ArrowLeft/Right 누를 때 인접 top 으로 점프하는 axis.
 *
 * 데이터 가정: id = sub item, parentOf(id) = top, parentOf(top) = ROOT.
 * 출력: 현재 top 을 collapse + 다음 top 으로 navigate + 다음 top 을 expand + 첫 sub navigate.
 */
const crossTop: Axis = (d, id, t) => {
  const p = parseTrigger(t)
  if (p.kind !== 'key') return null
  const isNext = matchChord(p, INTENTS.navigate.horizontal.next)
  const isPrev = matchChord(p, INTENTS.navigate.horizontal.prev)
  if (!isNext && !isPrev) return null
  const top = parentOf(d, id)
  if (!top) return null
  const grand = parentOf(d, top)
  if (!grand) return null
  const tops = getChildren(d, grand).filter((tid) => !isDisabled(d, tid))
  const idx = tops.indexOf(top)
  if (idx < 0) return null
  const nextIdx = isNext
    ? (idx + 1) % tops.length
    : (idx - 1 + tops.length) % tops.length
  const nextTop = tops[nextIdx]
  const nextSubs = getChildren(d, nextTop).filter((s) => !isDisabled(d, s))
  const events: UiEvent[] = [
    { type: 'expand', id: top, open: false },
    { type: 'navigate', id: nextTop },
    { type: 'expand', id: nextTop, open: true },
  ]
  if (nextSubs[0]) events.push({ type: 'navigate', id: nextSubs[0] })
  return events
}

// top axis: ArrowDown/Enter/Space → expand+focus first, ArrowUp → expand+focus last,
// ArrowLeft/Right → horizontal navigate, Escape → close.
// expandSeedAxis: chord ↔ seed 매핑을 KeyMap 으로 선언 (raw 키 array 금지).
const expandSeedAxis = fromKeyMap([
  [INTENTS.expand.open,   seedExpand('first')],
  [[{ key: KEYS.ArrowUp }], seedExpand('last')],
])

/** Menubar 가 등록하는 axis — SSOT. top + sub 합집합 (probe 용 단일 surface). */
export const menubarAxis = () => composeAxes(
  expandSeedAxis,
  navigateAxis('horizontal'),
  navigateAxis('vertical'),
  activateAxis,
  escapeAxis,
)
const topAxis = composeAxes(
  expandSeedAxis,
  navigateAxis('horizontal'),
  escapeAxis,
)

// sub axis: ArrowLeft/Right → crossTop, vertical Arrow/Home/End → navigate, Enter/Space → activate, Escape → close.
const subAxis = composeAxes(
  crossTop,
  navigateAxis('vertical'),
  activateAxis,
  escapeAxis,
)

/**
 * menubar — APG `/menubar/` recipe (top bar + nested sub-menus).
 * https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
 *
 * data 모델:
 *   ROOT
 *     ├─ top-1 ── (children: sub-1, sub-2, ...)
 *     ├─ top-2 ── (children: sub-3, sub-4, ...)
 *     ⋮
 *
 * 키 매핑은 모두 axis 합성으로 박제. 인라인 onKeyDown 0.
 *   top — `expandSeedAxis` (Down/Enter/Space=first, Up=last) + `navigate('horizontal')` + `escape`
 *   sub — `crossTop` (Left/Right) + `navigate('vertical')` + `activate` + `escape`
 *
 * intent relay 가 expand/open UiEvent 를 openId state 로 흡수 (gesture/intent split).
 */
export function useMenubarPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: MenubarOptions = {},
): {
  rootProps: RootProps
  menubarItemProps: (id: string) => ItemProps
  menuProps: (topId: string) => RootProps
  menuitemProps: (id: string) => ItemProps
  items: BaseItem[]
  openId: string | null
} {
  const { orientation = 'horizontal', autoFocus, label, labelledBy, idPrefix = 'mbar' } = opts
  const [openId, setOpenId] = useState<string | null>(null)
  const [subFocusId, setSubFocusId] = useState<string | null>(null)
  const topIds = getChildren(data, ROOT)

  // intent relay: axis 가 emit 한 expand/open/navigate 를 local state 로 흡수.
  const intent = useCallback((e: UiEvent) => {
    if (e.type === 'expand') {
      if (e.open) {
        setOpenId(e.id)
        // expand 로 함께 들어온 navigate 는 sub 첫/끝 항목 — subFocusId 로 흡수
      } else if (openId === e.id) {
        setOpenId(null)
        setSubFocusId(null)
      }
      onEvent?.(e)
      return
    }
    if (e.type === 'open' && e.open === false) {
      setOpenId(null)
      setSubFocusId(null)
      onEvent?.(e)
      return
    }
    if (e.type === 'navigate' && e.id) {
      // navigate target 이 sub item 이면 subFocusId, top item 이면 top 의 roving 으로
      if (topIds.includes(e.id)) {
        // top 으로 이동 — 열려있던 sub 는 닫음 (전제: top 간 이동은 항상 close)
        if (openId && openId !== e.id) {
          setOpenId(null)
          setSubFocusId(null)
        }
      } else {
        setSubFocusId(e.id)
      }
      onEvent?.(e)
      return
    }
    onEvent?.(e)
  }, [onEvent, openId, topIds])

  const { focusId, bindFocus, delegate } = useRovingTabIndex(
    topAxis, data, intent, { autoFocus },
  )

  // sub 키 dispatch — sub item 에 직접 onKeyDown 으로 attach.
  const { onKey: subDispatch } = bindAxis(subAxis, data, intent)

  const items: BaseItem[] = topIds.map((id, i) => {
    const ent = data.entities[id] ?? {}
    return {
      id,
      label: getLabel(data, id),
      selected: Boolean(ent.selected),
      disabled: isDisabled(data, id),
      posinset: i + 1,
      setsize: topIds.length,
    }
  })

  const subMenuId = (topId: string) => `${idPrefix}-${topId}-menu`

  const rootProps: RootProps = {
    role: 'menubar',
    'aria-orientation': orientation,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...delegate,
  } as RootProps

  const menubarItemProps = (id: string): ItemProps => {
    const it = items.find((x) => x.id === id)
    const isFocus = focusId === id
    const hasSub = getChildren(data, id).length > 0
    const isOpen = openId === id
    return {
      role: 'menuitem',
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-disabled': it?.disabled || undefined,
      'aria-haspopup': hasSub ? 'menu' : undefined,
      'aria-expanded': hasSub ? isOpen : undefined,
      'aria-controls': hasSub ? subMenuId(id) : undefined,
      'data-disabled': it?.disabled ? '' : undefined,
      'data-state': isOpen ? 'open' : 'closed',
    } as unknown as ItemProps
  }

  const menuProps = (topId: string): RootProps => {
    const isOpen = openId === topId
    return {
      role: 'menu',
      id: subMenuId(topId),
      'aria-orientation': 'vertical',
      hidden: !isOpen,
      'data-state': isOpen ? 'open' : 'closed',
    } as unknown as RootProps
  }

  const menuitemProps = (id: string): ItemProps => {
    const ent = data.entities[id] ?? {}
    const kind = (ent.kind as 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | undefined) ?? 'menuitem'
    const rawChecked = ent.checked ?? ent.selected
    const checked: boolean | 'mixed' | undefined =
      kind === 'menuitem' ? undefined
        : rawChecked === 'mixed' ? 'mixed'
        : Boolean(rawChecked)
    const disabledItem = isDisabled(data, id)
    const isFocus = subFocusId === id
    return {
      role: kind,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-disabled': disabledItem || undefined,
      'aria-checked': checked,
      'data-disabled': disabledItem ? '' : undefined,
      'data-checked': checked === true ? '' : checked === 'mixed' ? 'mixed' : undefined,
      onKeyDown: (e: React.KeyboardEvent) => subDispatch(e, id),
    } as unknown as ItemProps
  }

  return { rootProps, menubarItemProps, menuProps, menuitemProps, items, openId }
}
