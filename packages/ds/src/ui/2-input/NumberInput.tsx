import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { useField } from '../8-field/Field'

type NumberInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'value' | 'onChange'> & {
  value: number
  onChange: (value: number) => void
}

/**
 * NumberInput — `<input type="number">` (role=spinbutton implicit).
 * ARIA APG spinbutton 패턴을 HTML 이 내장하므로 커스텀 대신 native.
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput({ value, onChange, ...rest }, ref) {
    const field = useField()
    const id = rest.id ?? field?.controlId
    const describedBy = field
      ? [rest['aria-describedby'], field.descriptionId, field.invalid ? field.errorId : undefined]
          .filter(Boolean).join(' ') || undefined
      : rest['aria-describedby']
    return (
      <input
        ref={ref}
        type="number"
        value={Number.isFinite(value) ? value : ''}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        {...rest}
        id={id}
        aria-describedby={describedBy}
        aria-invalid={rest['aria-invalid'] ?? field?.invalid ?? undefined}
        aria-required={rest['aria-required'] ?? field?.required ?? undefined}
        aria-disabled={rest.disabled || undefined}
        aria-readonly={rest.readOnly || undefined}
      />
    )
  },
)
