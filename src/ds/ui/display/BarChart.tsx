import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { BadgeTone } from './Badge'

/**
 * BarChart — data 주도 가로막대 차트 (figure 시맨틱).
 * bars: [{label, value, pct:0~100, tone?}]. 자체 SVG 없이 CSS width%로 그림.
 */
export interface BarChartBar {
  label: ReactNode
  value: ReactNode
  /** 0 ~ 100 */
  pct: number
  tone?: BadgeTone
}

type BarChartProps = Omit<ComponentPropsWithoutRef<'figure'>, 'children'> & {
  bars: BarChartBar[]
  caption?: ReactNode
}

export function BarChart({ bars, caption, ...rest }: BarChartProps) {
  return (
    <figure className="bar-chart" {...rest}>
      <dl>
        {bars.map((b, i) => (
          <div key={i} data-tone={b.tone ?? 'info'}>
            <dt>{b.label}</dt>
            <dd>
              <meter value={Math.max(0, Math.min(100, b.pct))} min={0} max={100} />
              <span>{b.value}</span>
            </dd>
          </div>
        ))}
      </dl>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
