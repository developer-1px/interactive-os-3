import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { useField } from '../Field'

type TextareaProps = ComponentPropsWithoutRef<'textarea'>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    const field = useField()
    const id = props.id ?? field?.controlId
    const describedBy = field
      ? [props['aria-describedby'], field.descriptionId, field.invalid ? field.errorId : undefined]
          .filter(Boolean).join(' ') || undefined
      : props['aria-describedby']
    return (
      <textarea
        ref={ref}
        {...props}
        id={id}
        aria-describedby={describedBy}
        aria-invalid={props['aria-invalid'] ?? field?.invalid ?? undefined}
        aria-required={props['aria-required'] ?? field?.required ?? undefined}
      />
    )
  },
)
