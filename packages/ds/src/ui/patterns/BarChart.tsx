import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import {
  ROOT,
  getChildren,
  type CollectionProps,
} from '@p/headless/types'

/**
 * BarChart — 가로 막대 차트 (figure 시맨틱). CollectionProps 기반.
 *
 * data.entities[id].data: { label, value, pct: 0~100, tone? }
 * Display-only이므로 onEvent 생략 가능.
 */
type Extra = Omit<ComponentPropsWithoutRef<'figure'>, 'children'> & {
  caption?: ReactNode
}

export function BarChart({ data, caption, ...rest }: CollectionProps<Extra>) {
  const kids = getChildren(data, ROOT)
  return (
    <figure data-part="bar-chart" {...rest}>
      <dl>
        {kids.map((id) => {
          const d = (data.entities[id]?.data ?? {}) as {
            label?: ReactNode; value?: ReactNode; pct?: number; variant?: string
          }
          const pct = Math.max(0, Math.min(100, Number(d.pct) || 0))
          const labelText = typeof d.label === 'string' ? d.label : undefined
          return (
            <div key={id} data-variant={d.variant ?? 'info'}>
              <dt>{d.label}</dt>
              <dd>
                <meter
                  value={pct}
                  min={0}
                  max={100}
                  aria-label={labelText ? `${labelText} 비율` : undefined}
                />
                <span>{d.value}</span>
              </dd>
            </div>
          )
        })}
      </dl>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
