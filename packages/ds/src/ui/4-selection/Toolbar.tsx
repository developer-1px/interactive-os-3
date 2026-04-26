import { type ComponentPropsWithoutRef } from 'react'
import {
  ROOT,
  getChildren, getLabel, isDisabled,
  type CollectionProps,
} from '../../core/types'
import { composeAxes, navigate } from '../../core/axes'
import { useRoving } from '../../core/hooks/useRoving'
import { ToolbarButton } from '../2-action/ToolbarButton'
import { Separator } from '../1-indicator/Separator'

type Extra = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'onKeyDown'> & {
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Toolbar — 동질 button 집합의 roving 컬렉션.
 * item.data: { label, icon?, pressed?, separator?, disabled? }
 * separator=true 인 항목은 비-tabbable Separator로 렌더, roving에서 자동 skip.
 */
export function Toolbar({ data, onEvent, orientation = 'horizontal', autoFocus, ...rest }: CollectionProps<Extra>) {
  const axis = composeAxes(navigate(orientation))
  const { focusId, bindFocus, delegate } = useRoving(axis, data, onEvent ?? (() => {}), { autoFocus })
  const kids = getChildren(data, ROOT)

  return (
    <div role="toolbar" aria-orientation={orientation} onKeyDown={delegate.onKeyDown} {...rest}>
      {kids.map((id) => {
        const d = data.entities[id]?.data ?? {}
        if (d.separator) {
          return <Separator key={id} orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'} />
        }
        const disabled = isDisabled(data, id)
        const isFocus = focusId === id
        return (
          <ToolbarButton
            key={id}
            data-id={id}
            ref={bindFocus(id)}
            data-icon={d.icon as string | undefined}
            aria-label={getLabel(data, id)}
            pressed={Boolean(d.pressed)}
            disabled={disabled}
            tabIndex={isFocus ? 0 : -1}
            onClick={() => !disabled && onEvent?.({ type: 'activate', id })}
          >
            {d.content as React.ReactNode}
          </ToolbarButton>
        )
      })}
    </div>
  )
}
