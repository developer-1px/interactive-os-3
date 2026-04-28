import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Card } from '../ui/6-structure/Card'
import { Heading } from '../ui/6-structure/Heading'

/**
 * CourseCard — 코스 카테고리 카드. Card 슬롯에 어휘 바인딩.
 *
 * 슬롯 매핑:
 *   preview → figure (좌측 abbr 배지)
 *   title   → h3 + 우측 meta
 *   body    → desc 보조 텍스트
 *   footer  → 최종 수정일 + actions
 */
type CourseCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  abbr: ReactNode
  name: ReactNode
  desc?: ReactNode
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'accent' | 'default'
  actions?: ReactNode
  meta?: ReactNode
  footer?: ReactNode
}

export function CourseCard({
  abbr, name, desc, variant = 'info', actions, meta, footer, ...rest
}: CourseCardProps) {
  return (
    <Card
      data-card="course"
      data-variant={variant}
      slots={{
        preview: <figure aria-hidden="true">{abbr}</figure>,
        title: (
          <header>
            <Heading level="h3">{name}</Heading>
            {meta}
          </header>
        ),
        body: desc ? <p>{desc}</p> : null,
        footer: (footer || actions) ? (
          <footer>
            {footer && <small>{footer}</small>}
            {actions}
          </footer>
        ) : null,
      }}
      {...rest}
    />
  )
}
