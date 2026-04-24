import type { ComponentPropsWithoutRef } from 'react'

/**
 * Badge — 읽기 전용 라벨. status/level/period 등 작은 토큰에 쓴다.
 * classless + data-tone으로 색상 분기. role 주장 없음 (시각 장치).
 */
export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

type BadgeProps = ComponentPropsWithoutRef<'mark'> & {
  tone?: BadgeTone
}

export function Badge({ tone = 'neutral', ...rest }: BadgeProps) {
  return <mark data-tone={tone} {...rest} />
}
