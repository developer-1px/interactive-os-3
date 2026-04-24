import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Badge, type BadgeTone } from './Badge'

/**
 * StatCard — KPI 단일 카드. label + (topBadge) + value + sub + change.
 * `<article>` + `<dl>` 시맨틱. tone='alert'면 강조 테두리.
 */
type StatCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  label: ReactNode
  value: ReactNode
  sub?: ReactNode
  change?: ReactNode
  /** '↑'·'↓' 시각 큐의 방향 */
  changeDir?: 'up' | 'down'
  /** 누적/신규 같은 미니 배지 */
  topBadge?: { tone?: BadgeTone; content: ReactNode }
  /** 카드 전체 강조 (이탈율 같은 alert 카드) */
  tone?: 'normal' | 'alert'
  /** 16px emoji/lucide 등 */
  icon?: ReactNode
}

export function StatCard({
  label, value, sub, change, changeDir, topBadge, tone = 'normal', icon, ...rest
}: StatCardProps) {
  return (
    <article data-ds="StatCard" data-tone={tone} {...rest}>
      <header>
        <dl>
          <dt>
            {label}
            {topBadge && (
              <Badge tone={topBadge.tone ?? 'neutral'}>{topBadge.content}</Badge>
            )}
          </dt>
        </dl>
        {icon && <span data-ds-icon aria-hidden="true">{icon}</span>}
      </header>
      <strong data-ds-value>{value}</strong>
      {sub && <small data-ds-sub>{sub}</small>}
      {change && <small data-ds-change data-dir={changeDir}>{change}</small>}
    </article>
  )
}
