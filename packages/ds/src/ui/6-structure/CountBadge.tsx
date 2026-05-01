import type { ComponentPropsWithoutRef } from 'react'

export type CountBadgeTone = 'default' | 'success' | 'warning' | 'danger'

type CountBadgeProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  /** 숫자 카운터 (e.g. unread). dot=true면 무시. */
  count?: number
  /** dot 형태 (status indicator). */
  dot?: boolean
  /** 의미 토큰. variant 아님. */
  variant?: CountBadgeTone
  /** Legacy alias. Prefer variant. */
  tone?: CountBadgeTone
  /** 스크린리더용 라벨 — 'N unread' 같은 의미 텍스트. */
  label?: string
}

/**
 * CountBadge — counter (숫자) 또는 status dot.
 * count도 dot도 아니면 자식 없는 빈 점으로 그려지지 않도록 count 또는 dot 중 하나는 줘야 한다.
 */
export function CountBadge({ count, dot, variant, tone, label, ...rest }: CountBadgeProps) {
  const resolved = variant ?? tone ?? 'default'
  const ariaLabel = label ?? (typeof count === 'number' ? String(count) : undefined)
  return (
    <span
      data-part="badge"
      aria-label={ariaLabel}
      data-variant={resolved === 'default' ? undefined : resolved}
      data-dot={dot ? 'true' : undefined}
      {...rest}
    >
      {dot ? null : typeof count === 'number' ? count : null}
    </span>
  )
}
