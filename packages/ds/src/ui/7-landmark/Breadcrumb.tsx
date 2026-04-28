import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export type BreadcrumbItem = {
  label: ReactNode
  href?: string
}

type BreadcrumbProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children' | 'aria-label'> & {
  items: BreadcrumbItem[]
}

/**
 * Breadcrumb — 경로 표시. <nav aria-label="Breadcrumb"><ol><li><a></a></li>...</ol></nav>.
 * 마지막 항목(또는 href 없는 항목)은 <span aria-current="page">.
 */
export function Breadcrumb({ items, ...rest }: BreadcrumbProps) {
  const last = items.length - 1
  return (
    <nav aria-label="Breadcrumb" {...rest}>
      <ol>
        {items.map((it, i) => {
          const isCurrent = i === last || !it.href
          return (
            <li key={i}>
              {isCurrent
                ? <span aria-current="page">{it.label}</span>
                : <a href={it.href}>{it.label}</a>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
