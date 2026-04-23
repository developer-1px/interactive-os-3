import { forwardRef, type ComponentPropsWithoutRef } from 'react'

type DialogProps = Omit<ComponentPropsWithoutRef<'dialog'>, 'role'> & {
  alert?: boolean
}

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  function Dialog({ alert, ...rest }, ref) {
    return <dialog ref={ref} role={alert ? 'alertdialog' : undefined} {...rest} />
  },
)
