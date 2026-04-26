import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Card } from '../../parts/Card'
import { Badge, type BadgeTone } from '../1-indicator/Badge'
import { Heading } from '../../parts/Heading'

/**
 * StatCard — KPI 단일 카드. Card primitive 슬롯에 KPI 어휘 바인딩.
 * 자체 layout ❌ — Card 가 owner.
 */
type StatCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  label: ReactNode
  value: ReactNode
  sub?: ReactNode
  change?: ReactNode
  /** 변화 방향 — entity/statCard.ts 가 trending-up/down 아이콘을 mask로 주입 */
  changeDir?: 'up' | 'down'
  /** 누적/신규 같은 미니 배지 */
  topBadge?: { tone?: BadgeTone; content: ReactNode }
  /** 카드 전체 강조 (이탈율 같은 alert 카드) */
  tone?: 'normal' | 'alert'
  /** lucide data-icon span 등 아이콘 노드 — 이모지 금지 */
  icon?: ReactNode
}

export function StatCard({
  label, value, sub, change, changeDir, topBadge, tone = 'normal', icon, ...rest
}: StatCardProps) {
  return (
    <Card
      data-card="stat"
      data-tone={tone}
      slots={{
        title: (
          <header>
            <dl>
              <dt>
                {label}
                {topBadge && <Badge tone={topBadge.tone ?? 'neutral'}>{topBadge.content}</Badge>}
              </dt>
            </dl>
            {icon && <span aria-hidden="true">{icon}</span>}
          </header>
        ),
        body: <Heading level="display">{value}</Heading>,
        meta: sub ? <small>{sub}</small> : null,
        footer: change ? <small data-dir={changeDir}>{change}</small> : null,
      }}
      {...rest}
    />
  )
}
