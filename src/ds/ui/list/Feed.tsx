import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from 'react'

// @slot children — composable (wrapper/label/subpart)
type FeedProps = Omit<ComponentPropsWithoutRef<'ol'>, 'role'> & {
  busy?: boolean
  children: ReactNode
}

export function Feed({ busy, children, ...rest }: FeedProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<{
    posinset?: number
    setsize?: number
  }>[]
  const total = items.length
  const enhanced = items.map((el, i) =>
    cloneElement(el, { posinset: i + 1, setsize: total }),
  )
  return (
    <ol role="feed" aria-busy={busy || undefined} {...rest}>
      {enhanced}
    </ol>
  )
}
