import { forwardRef, type ComponentPropsWithoutRef } from 'react'

type SliderProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'value' | 'onChange'> & {
  value: number
  onChange: (value: number) => void
}

// native <input type="range"> — 브라우저가 role=slider를 자동 부여.
// ←/→ PageUp/PageDown Home/End 전부 네이티브로 처리.
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  function Slider({ value, onChange, ...rest }, ref) {
    return (
      <input
        ref={ref}
        type="range"
        value={value}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        {...rest}
      />
    )
  },
)
