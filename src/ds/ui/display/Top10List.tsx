import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * Top10List — 순위 + 라벨 + 수치 ordered list. data 주도.
 */
export interface Top10Entry {
  label: ReactNode
  count: ReactNode
}

type Top10Props = Omit<ComponentPropsWithoutRef<'ol'>, 'children'> & {
  entries: Top10Entry[]
}

export function Top10List({ entries, ...rest }: Top10Props) {
  return (
    <ol data-ds="Top10List" {...rest}>
      {entries.map((e, i) => (
        <li key={i}>
          <span data-ds-rank>{i + 1}</span>
          <span data-ds-top-label>{e.label}</span>
          <small data-ds-count>{e.count}</small>
        </li>
      ))}
    </ol>
  )
}
