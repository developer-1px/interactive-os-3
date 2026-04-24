import { forwardRef, type ComponentPropsWithoutRef } from 'react'

type NumberInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'value' | 'onChange'> & {
  value: number
  onChange: (value: number) => void
}

// native <input type="number"> — 브라우저가 role=spinbutton을 자동 부여.
// ARIA APG spinbutton 패턴을 HTML이 내장하므로 커스텀 대신 native로 간다.
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput({ value, onChange, ...rest }, ref) {
    return (
      <input
        ref={ref}
        type="number"
        value={Number.isFinite(value) ? value : ''}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        {...rest}
      />
    )
  },
)
