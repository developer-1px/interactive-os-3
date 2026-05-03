import { type NormalizedData, type UiEvent } from '../types'
import { bindAxis } from '../state/bind'
import { numericStep } from '../axes/numericStep'
import type { ItemProps } from './types'

export interface SpinbuttonOptions {
  /** invalid 표시 — 보통 value < min 또는 > max. host 가 검증해서 넘긴다. */
  invalid?: boolean
  /** aria-valuenow 가 사람 친화적이지 않을 때 (예: 일/요일 등) 우선되는 텍스트. */
  valueText?: string
  /** aria-readonly. */
  readOnly?: boolean
}

/**
 * spinbutton — APG `/spinbutton/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 *
 * entity.data: { value, min?, max?, step?, label? }
 * 키보드 (numericStep 재사용):
 *   ArrowUp/ArrowRight = +step
 *   ArrowDown/ArrowLeft = -step
 *   Home / End = min / max
 *   PageUp / PageDown = ±step * 10  (APG: "Optional. Larger step")
 *
 * 단일 focusable 요소만 노출. native `<input type="number">` 가 충분할 때는 그쪽이 우선.
 * custom widget (예: 시:분 picker, 통화 입력 등) 일 때 본 recipe 사용.
 */
export function spinbuttonPattern(
  data: NormalizedData,
  id: string,
  onEvent?: (e: UiEvent) => void,
  opts: SpinbuttonOptions = {},
): { spinbuttonProps: ItemProps } {
  const { invalid, valueText, readOnly } = opts
  const ent = data.entities[id] ?? {}
  const value = Number(ent.value ?? 0)
  const hasMin = ent.min !== undefined
  const hasMax = ent.max !== undefined

  const axis = numericStep('horizontal')
  const { onKey } = bindAxis(axis, data, onEvent ?? (() => {}))

  const spinbuttonProps: ItemProps = {
    role: 'spinbutton',
    'data-id': id,
    tabIndex: 0,
    'aria-valuenow': value,
    'aria-valuemin': hasMin ? Number(ent.min) : undefined,
    'aria-valuemax': hasMax ? Number(ent.max) : undefined,
    'aria-valuetext': valueText,
    'aria-label': ent.label as string | undefined,
    'aria-invalid': invalid || undefined,
    'aria-readonly': readOnly || undefined,
    onKeyDown: (e: React.KeyboardEvent) => onKey(e, id),
  } as unknown as ItemProps

  return { spinbuttonProps }
}
