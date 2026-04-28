import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { useField } from '../8-field/Field'

type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    const field = useField()
    const id = props.id ?? field?.controlId
    const describedBy = field
      ? [props['aria-describedby'], field.descriptionId, field.invalid ? field.errorId : undefined]
          .filter(Boolean).join(' ') || undefined
      : props['aria-describedby']
    return (
      <input
        ref={ref}
        type="text"
        {...props}
        id={id}
        aria-describedby={describedBy}
        aria-invalid={props['aria-invalid'] ?? field?.invalid ?? undefined}
        aria-required={props['aria-required'] ?? field?.required ?? undefined}
        aria-disabled={props.disabled || undefined}
        aria-readonly={props.readOnly || undefined}
      />
    )
  },
)
