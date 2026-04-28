import type { ComponentPropsWithoutRef } from 'react'

type TimestampProps = Omit<ComponentPropsWithoutRef<'time'>, 'children' | 'dateTime' | 'title'> & {
  value: Date | string | number
  /** 표시 형식. 기본 'absolute' (toLocaleString). */
  display?: 'absolute' | 'relative'
}

const toDate = (v: Date | string | number): Date =>
  v instanceof Date ? v : new Date(v)

/** formatRelative — 짧은 상대 시간. en-US 베이스 ("3m", "2h", "5d"). */
// eslint-disable-next-line react-refresh/only-export-components
export const formatRelative = (v: Date | string | number, now: Date = new Date()): string => {
  const d = toDate(v)
  const diff = (now.getTime() - d.getTime()) / 1000
  if (diff < 60) return `${Math.max(0, Math.floor(diff))}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)}d`
  if (diff < 86400 * 365) return `${Math.floor(diff / (86400 * 30))}mo`
  return `${Math.floor(diff / (86400 * 365))}y`
}

/**
 * Timestamp — <time datetime> 시맨틱. absolute or relative.
 * absolute일 때 title 속성에 relative 표기. (toggle은 후속 페이즈)
 */
export function Timestamp({ value, display = 'absolute', ...rest }: TimestampProps) {
  const d = toDate(value)
  const iso = d.toISOString()
  const absolute = d.toLocaleString()
  const relative = formatRelative(d)
  const text = display === 'relative' ? relative : absolute
  const title = display === 'relative' ? absolute : relative
  return (
    <time dateTime={iso} title={title} {...rest}>
      {text}
    </time>
  )
}
