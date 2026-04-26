import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type FeedProps = Omit<ComponentPropsWithoutRef<'ol'>, 'role'> & {
  busy?: boolean
  children: ReactNode
}

export function Feed({ busy, children, ...rest }: FeedProps) {
  return (
    <ol role="feed" aria-busy={busy || undefined} {...rest}>
      {children}
    </ol>
  )
}
