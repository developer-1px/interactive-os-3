import type { ComponentPropsWithoutRef, ReactNode } from 'react'

// @slot children — composable (wrapper/label/subpart)
type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  pressed?: boolean
  /** 시각 강도 — primary: 화면당 1개 주 행동, destructive: 위험 행동. 미지정 = default */
  variant?: 'primary' | 'destructive'
  children: ReactNode
}

export function Button({
  pressed,
  variant,
  disabled,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      data-variant={variant}
      aria-pressed={pressed}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}
