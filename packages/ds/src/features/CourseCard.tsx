import type { ComponentPropsWithoutRef } from 'react'
import { Badge } from '../ui/5-live/Badge'
import { Button } from '../ui/1-command/Button'
import { Card } from '../ui/6-structure/Card'
import { Heading } from '../ui/6-structure/Heading'
import { Switch } from '../ui/2-input/Switch'
import { courseCardStyle } from './CourseCard.style'

/**
 * CourseCard — 코스 카테고리 카드. Card 슬롯에 어휘 바인딩.
 * 페이지는 data와 action intent만 넘기고, 카드 anatomy와 controls는 CourseCard가 소유한다.
 */
type CourseCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children' | 'className'> & {
  id?: string
  abbr: string
  name: string
  desc?: string
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'accent' | 'default'
  meta?: string
  visible?: boolean
  locked?: boolean
  onToggleVisible?: (id?: string) => void
  onEdit?: (id?: string) => void
  onDelete?: (id?: string) => void
}

export function CourseCard({
  id,
  abbr,
  name,
  desc,
  variant = 'info',
  meta,
  visible,
  locked,
  onToggleVisible,
  onEdit,
  onDelete,
  ...rest
}: CourseCardProps) {
  const hasActions = onToggleVisible || onEdit || (!locked && onDelete)
  const visibleText = typeof visible === 'boolean' ? (visible ? '노출 중' : '숨김') : undefined

  return (
    <Card
      {...rest}
      data-card="course"
      data-variant={variant}
      className={courseCardStyle.classes.root}
      slots={{
        preview: <figure aria-hidden="true">{abbr}</figure>,
        title: (
          <header>
            <Heading level="h3">{name}</Heading>
            {meta && <Badge variant="info">{meta}</Badge>}
          </header>
        ),
        body: desc ? <p>{desc}</p> : null,
        footer: (visibleText || hasActions) ? (
          <div>
            {visibleText && <small>{visibleText}</small>}
            {hasActions && (
              <div data-slot="actions">
                {onToggleVisible && typeof visible === 'boolean' && (
                  <Switch
                    checked={visible}
                    aria-label={`${name} 노출`}
                    onClick={() => onToggleVisible(id)}
                  />
                )}
                {onEdit && <Button onClick={() => onEdit(id)}>수정</Button>}
                {!locked && onDelete && (
                  <Button variant="destructive" onClick={() => onDelete(id)}>삭제</Button>
                )}
              </div>
            )}
          </div>
        ) : null,
      }}
    />
  )
}
