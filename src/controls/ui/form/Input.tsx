import { forwardRef, type ComponentPropsWithoutRef } from 'react'

type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    return <input ref={ref} type="text" {...props} />
  },
)
