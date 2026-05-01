import type { ComponentPropsWithoutRef, PointerEvent } from 'react'
import type { IconToken } from '../tokens/semantic'
import { Badge } from '../ui/5-live/Badge'
import { Button } from '../ui/1-command/Button'
import { Card } from '../ui/6-structure/Card'
import { Heading } from '../ui/6-structure/Heading'
import { Switch } from '../ui/2-input/Switch'
import { roleCardStyle } from './RoleCard.style'

/**
 * RoleCard — sortable resource list의 한 row.
 *
 * 외부 JSX slot(actions/meta)을 받지 않는다. 페이지는 데이터와 action intent만 넘기고,
 * 카드 anatomy와 action controls는 RoleCard가 소유한다.
 */
type RoleCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children' | 'className'> & {
  id?: string
  icon: IconToken
  name: string
  desc?: string
  meta?: string
  visible?: boolean
  draggable?: boolean
  onToggleVisible?: (id?: string) => void
  onEdit?: (id?: string) => void
  onDelete?: (id?: string) => void
  onDragHandlePointerDown?: (e: PointerEvent) => void
}

export function RoleCard({
  id,
  icon,
  name,
  desc,
  meta,
  visible,
  draggable = true,
  onToggleVisible,
  onEdit,
  onDelete,
  onDragHandlePointerDown,
  ...rest
}: RoleCardProps) {
  const hasActions = onToggleVisible || onEdit || onDelete

  return (
    <Card
      {...rest}
      data-card="role"
      className={roleCardStyle.classes.root}
      slots={{
        preview: (
          <figure aria-hidden="true">
            {draggable && (
              <button
                type="button"
                data-slot="drag"
                data-icon="grip-vertical"
                aria-label="드래그로 순서 변경"
                onPointerDown={onDragHandlePointerDown}
              />
            )}
            <span data-slot="icon" data-icon={icon} aria-hidden="true" />
          </figure>
        ),
        title: (
          <header>
            <Heading level="h3">{name}</Heading>
            {meta && <Badge variant="info">{meta}</Badge>}
          </header>
        ),
        body: desc ? <p>{desc}</p> : null,
        footer: hasActions ? (
          <div data-slot="actions">
            {onToggleVisible && typeof visible === 'boolean' && (
              <Switch
                checked={visible}
                aria-label={`${name} 노출`}
                onClick={() => onToggleVisible(id)}
              />
            )}
            {onEdit && <Button onClick={() => onEdit(id)}>수정</Button>}
            {onDelete && <Button variant="destructive" onClick={() => onDelete(id)}>삭제</Button>}
          </div>
        ) : null,
      }}
    />
  )
}
