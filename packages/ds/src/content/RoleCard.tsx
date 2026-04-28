import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Card } from '../ui/6-structure/Card'
import { Heading } from '../ui/6-structure/Heading'

/**
 * RoleCard — sortable resource list의 한 row. Card 슬롯에 어휘 바인딩.
 *
 * 슬롯 매핑:
 *   preview → drag handle button + icon span (좌측 그립)
 *   title   → h3 + 우측 meta + actions
 *   body    → desc 보조 텍스트
 */
type RoleCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  icon: ReactNode
  name: ReactNode
  desc?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  draggable?: boolean
  onDragHandlePointerDown?: (e: React.PointerEvent) => void
}

export function RoleCard({
  icon, name, desc, meta, actions, draggable = true, onDragHandlePointerDown, ...rest
}: RoleCardProps) {
  return (
    <Card
      data-card="role"
      slots={{
        preview: (
          <figure aria-hidden="true">
            {draggable && (
              <button
                type="button"
                aria-label="드래그로 순서 변경"
                onPointerDown={onDragHandlePointerDown}
              >⠿</button>
            )}
            <span>{icon}</span>
          </figure>
        ),
        title: (
          <header>
            <Heading level="h3">{name}</Heading>
            {(meta || actions) && (
              <div>
                {meta}
                {actions}
              </div>
            )}
          </header>
        ),
        body: desc ? <p>{desc}</p> : null,
      }}
      {...rest}
    />
  )
}
