import type { ComponentPropsWithoutRef } from 'react'
import {
  ROOT,
  getChildren,
  type CollectionProps,
} from '../../core/types'

/**
 * Top10List — 순위 + 라벨 + 수치 ordered list. CollectionProps 기반.
 *
 * data.entities[id].data: { label: ReactNode, count: ReactNode }
 * Display-only이므로 onEvent 생략 가능.
 */
type Extra = Omit<ComponentPropsWithoutRef<'ol'>, 'children'>

export function Top10List({ data, ...rest }: CollectionProps<Extra>) {
  const kids = getChildren(data, ROOT)
  return (
    <ol className="top-10" {...rest}>
      {kids.map((id) => {
        const d = data.entities[id]?.data ?? {}
        return (
          <li key={id}>
            <span>{d.label as React.ReactNode}</span>
            <small>{d.count as React.ReactNode}</small>
          </li>
        )
      })}
    </ol>
  )
}
