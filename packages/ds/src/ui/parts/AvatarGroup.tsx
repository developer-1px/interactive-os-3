import type { ComponentPropsWithoutRef } from 'react'
import { Avatar, type AvatarProps } from './Avatar'

type AvatarGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  items: AvatarProps[]
  max?: number
}

/**
 * AvatarGroup — Material AvatarGroup / Polaris AvatarGroup / Atlassian AvatarGroup.
 * stacked overlap + overflow count chip.
 */
export function AvatarGroup({ items, max = 4, ...rest }: AvatarGroupProps) {
  const visible = items.slice(0, max)
  const overflow = items.length - visible.length
  return (
    <div data-part="avatar-group" role="group" {...rest}>
      {visible.map((p, i) => <Avatar key={i} {...(p as AvatarProps)} />)}
      {overflow > 0 && (
        <span data-part="avatar" data-overflow="" aria-label={`+${overflow}`}>+{overflow}</span>
      )}
    </div>
  )
}
