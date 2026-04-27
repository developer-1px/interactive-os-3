import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type EmptyStateProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** CTA 버튼 등. */
  action?: ReactNode
}

/**
 * EmptyState — icon + heading + description + optional CTA.
 * 의미 tag(h3/p)로 내부를 구성 — 서브파트 className 없음.
 */
export function EmptyState({
  icon, title, description, action, ...rest
}: EmptyStateProps) {
  return (
    // eslint-disable-next-line no-restricted-syntax
    <div role="status" data-part="empty-state" {...rest}>
      {icon}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  )
}
