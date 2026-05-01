import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type FieldsetProps = Omit<ComponentPropsWithoutRef<'fieldset'>, 'children'> & {
  legend?: ReactNode
  hint?: ReactNode
  required?: boolean
  description?: ReactNode
  children?: ReactNode
}

export function Fieldset({
  legend, hint, required, description, children, ...rest
}: FieldsetProps) {
  return (
    <fieldset {...rest}>
      {legend && (
        <legend>
          <span data-slot="label">{legend}</span>
          {required && <span data-slot="required" aria-hidden="true"> *</span>}
          {hint && <small>{hint}</small>}
        </legend>
      )}
      {children}
      {description && <p data-part="field-desc">{description}</p>}
    </fieldset>
  )
}
