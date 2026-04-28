import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'

/**
 * ToggleButton — aria-pressed 단발 버튼. Radix Toggle / Ariakit Toggle / RAC ToggleButton.
 * Button 의 `pressed` 와 동일 의미지만 의도가 *토글 전용* 임을 명시.
 * Switch 와 의미 분리: ToggleButton 은 *선택/형식 전환* (B/I/U), Switch 는 *기능 on/off*.
 */
type ToggleButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
  pressed: boolean
  children: ReactNode
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton(
  { pressed, disabled, type = 'button', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={pressed}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
})
