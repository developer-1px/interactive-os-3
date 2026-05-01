import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { buttonStyle } from './Button.style'

// @slot children — composable (wrapper/label/subpart)
type ButtonVariant = 'primary' | 'destructive'
type NativeButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>

type ButtonProps = NativeButtonProps & {
  pressed?: boolean
  /** 시각 강도 — primary: 화면당 1개 주 행동, destructive: 위험 행동. 미지정 = default */
  variant?: ButtonVariant
  'data-variant'?: ButtonVariant
  children?: ReactNode
}

export function Button({
  pressed,
  variant,
  disabled,
  type = 'button',
  children,
  'data-variant': dataVariant,
  ...rest
}: ButtonProps) {
  const visualVariant = variant ?? dataVariant

  return (
    <button
      {...rest}
      type={type}
      className={buttonStyle.classes.root}
      data-variant={visualVariant}
      aria-pressed={pressed}
      aria-disabled={disabled || undefined}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
