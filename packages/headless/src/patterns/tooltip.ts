import { useEffect, useState, useRef, type RefObject } from 'react'
import type { ItemProps, RootProps } from './types'

export interface TooltipOptions {
  /** 보이기 delay (ms). APG 권장 ~400ms. */
  delayShow?: number
  /** 숨기기 delay (ms). */
  delayHide?: number
  idPrefix?: string
}

/**
 * tooltip — APG `/tooltip/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 *
 * hover/focus 로 열림, blur/Escape 로 닫힘. `aria-describedby` 로 trigger ↔ tip 연결.
 */
export function tooltip(
  triggerRef: RefObject<HTMLElement | null>,
  opts: TooltipOptions = {},
): {
  open: boolean
  triggerProps: ItemProps
  tipProps: RootProps
} {
  const { delayShow = 400, delayHide = 100, idPrefix = 'tip' } = opts
  const [open, setOpen] = useState(false)
  const tipId = `${idPrefix}-content`
  const tRef = useRef<number | null>(null)

  const show = () => {
    if (tRef.current) window.clearTimeout(tRef.current)
    tRef.current = window.setTimeout(() => setOpen(true), delayShow)
  }
  const hide = () => {
    if (tRef.current) window.clearTimeout(tRef.current)
    tRef.current = window.setTimeout(() => setOpen(false), delayHide)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const triggerProps: ItemProps = {
    ref: triggerRef as React.Ref<HTMLElement>,
    'aria-describedby': open ? tipId : undefined,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
  } as unknown as ItemProps

  const tipProps: RootProps = {
    role: 'tooltip',
    id: tipId,
    hidden: !open,
    'data-state': open ? 'open' : 'closed',
  } as unknown as RootProps

  return { open, triggerProps, tipProps }
}
