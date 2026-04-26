import { Link as RouterLink } from '@tanstack/react-router'

/**
 * Link — TanStack router Link 데이터 주도 wrapper.
 *
 * 직렬화 가능한 props (to/params/label) 만 받는다. children/JSX 받지 않는다.
 */
export interface LinkProps {
  to: string
  params?: Record<string, string>
  label: string
  'aria-label'?: string
}

export function Link({ to, params, label, ...rest }: LinkProps) {
  return (
    <RouterLink
      // @tanstack/react-router 의 generic 타입을 우회 — uiRegistry leaf 는 string-driven.
      to={to as never}
      params={params as never}
      {...rest}
    >
      {label}
    </RouterLink>
  )
}
