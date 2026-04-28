import { forwardRef, type ComponentPropsWithoutRef } from 'react'

type ColorInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'value' | 'onChange'> & {
  value: string
  onChange: (value: string) => void
}

// native <input type="color"> — 팝오버·picker UI를 브라우저가 제공.
// 커스텀 ColorPicker는 Popover role이 독립으로 정립된 뒤 재고.
export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(
  function ColorInput({ value, onChange, ...rest }, ref) {
    return (
      <input
        ref={ref}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
        aria-disabled={rest.disabled || undefined}
      />
    )
  },
)
