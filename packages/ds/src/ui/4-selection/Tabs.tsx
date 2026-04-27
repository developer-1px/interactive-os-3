import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import {
  ROOT,
  getChildren, getLabel, isDisabled,
  type CollectionProps,
  type Event,
} from '../../headless/types'
import { activate, composeAxes, navigate } from '../../headless/axes'
import { activateOnNavigate } from '../../headless/gesture'
import { useRoving } from '../../headless/hooks/useRoving'

type Extra = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'onKeyDown'> & {
  orientation?: 'horizontal' | 'vertical'
}

/**
 * TabList — APG tablist. selection follows focus 기본.
 * item.data: { label, controls?, selected?, disabled? }
 */
export function TabList({ data, onEvent, orientation = 'horizontal', autoFocus, ...rest }: CollectionProps<Extra>) {
  const axis = composeAxes(navigate(orientation), activate)
  const relay = (e: Event) => activateOnNavigate(data, e).forEach((ev) => onEvent?.(ev))
  const { focusId, bindFocus, delegate } = useRoving(axis, data, relay, { autoFocus })
  const kids = getChildren(data, ROOT)

  return (
    <div role="tablist" aria-orientation={orientation} {...delegate} {...rest}>
      {kids.map((id) => {
        const d = data.entities[id]?.data ?? {}
        const disabled = isDisabled(data, id)
        const selected = Boolean(d.selected) || focusId === id
        return (
          <Tab
            key={id}
            data-id={id}
            ref={bindFocus(id)}
            controls={d.controls as string | undefined}
            selected={selected}
            disabled={disabled}
            tabIndex={focusId === id ? 0 : -1}
          >
            {getLabel(data, id)}
          </Tab>
        )
      })}
    </div>
  )
}

type TabProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  selected?: boolean
  disabled?: boolean
  controls?: string
  children: ReactNode
}

export const Tab = forwardRef<HTMLDivElement, TabProps>(function Tab(
  { selected, disabled, controls, children, tabIndex, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="tab"
      aria-selected={selected}
      aria-disabled={disabled}
      aria-controls={controls}
      tabIndex={tabIndex ?? (selected ? 0 : -1)}
      {...rest}
    >
      {children}
    </div>
  )
})

export function TabPanel({ labelledBy, ...rest }: Omit<ComponentPropsWithoutRef<'div'>, 'role'> & { labelledBy?: string }) {
  return <div role="tabpanel" aria-labelledby={labelledBy} tabIndex={0} {...rest} />
}
