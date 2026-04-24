import { createContext, useContext, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'

type FieldContextValue = {
  controlId: string
  descriptionId: string
  errorId: string
  required: boolean
  invalid: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

export function useField(): FieldContextValue | null {
  return useContext(FieldContext)
}

type FieldProps = ComponentPropsWithoutRef<'div'> & {
  required?: boolean
  invalid?: boolean
  children: ReactNode
}

export function Field({ required = false, invalid = false, children, ...rest }: FieldProps) {
  const controlId = useId()
  const value: FieldContextValue = {
    controlId,
    descriptionId: `${controlId}-desc`,
    errorId: `${controlId}-err`,
    required,
    invalid,
  }
  return (
    <FieldContext.Provider value={value}>
      <div aria-required={required || undefined} aria-invalid={invalid || undefined} {...rest}>
        {children}
      </div>
    </FieldContext.Provider>
  )
}

type FieldLabelProps = ComponentPropsWithoutRef<'label'>

export function FieldLabel(props: FieldLabelProps) {
  const field = useField()
  return <label htmlFor={field?.controlId} {...props} />
}

type FieldDescriptionProps = ComponentPropsWithoutRef<'p'>

export function FieldDescription(props: FieldDescriptionProps) {
  const field = useField()
  return <p id={field?.descriptionId} {...props} />
}

type FieldErrorProps = Omit<ComponentPropsWithoutRef<'p'>, 'role'>

export function FieldError(props: FieldErrorProps) {
  const field = useField()
  if (!field?.invalid) return null
  return <p role="alert" id={field.errorId} {...props} />
}
