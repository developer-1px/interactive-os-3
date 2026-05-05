import { Fragment } from 'react'

export const meta = {
  title: 'Meter',
  apg: 'meter',
  kind: 'collection' as const,
  blurb: 'Native <meter> vs role="meter" with aria-valuemin/max/now for a known-range scalar.',
  keys: () => [],
}

const GAUGES = [
  { label: 'Disk usage', value: 70, min: 0, max: 100, unit: '%', tone: 'bg-amber-500' },
  { label: 'Budget spent', value: 4200, min: 0, max: 5000, unit: ' USD', tone: 'bg-emerald-500' },
]

export default function Demo() {
  return (
    <div className="flex flex-col gap-6 text-sm">
      <section className="space-y-2">
        <span className="text-xs font-medium uppercase tracking-wide text-stone-500">Native &lt;meter&gt;</span>
        <dl className="grid grid-cols-[10rem_1fr_5rem] items-center gap-x-3 gap-y-2">
          {GAUGES.map((g) => (
            <Fragment key={g.label}>
              <dt className="text-stone-700">{g.label}</dt>
              <dd>
                <meter min={g.min} max={g.max} value={g.value} className="w-full" />
              </dd>
              <dd className="text-right tabular-nums text-stone-600">
                {g.value}
                {g.unit}
              </dd>
            </Fragment>
          ))}
        </dl>
      </section>

      <section className="space-y-2">
        <span className="text-xs font-medium uppercase tracking-wide text-stone-500">role="meter"</span>
        <dl className="grid grid-cols-[10rem_1fr_5rem] items-center gap-x-3 gap-y-2">
          {GAUGES.map((g) => {
            const pct = ((g.value - g.min) / (g.max - g.min)) * 100
            return (
              <Fragment key={g.label}>
                <dt id={`meter-${g.label}`} className="text-stone-700">
                  {g.label}
                </dt>
                <dd>
                  <div
                    role="meter"
                    aria-labelledby={`meter-${g.label}`}
                    aria-valuemin={g.min}
                    aria-valuemax={g.max}
                    aria-valuenow={g.value}
                    aria-valuetext={`${g.value}${g.unit} of ${g.max}${g.unit}`}
                    className="h-2 w-full overflow-hidden rounded-full bg-stone-200"
                  >
                    <div className={`h-full ${g.tone}`} style={{ width: `${pct}%` }} />
                  </div>
                </dd>
                <dd className="text-right tabular-nums text-stone-600">
                  {g.value}
                  {g.unit}
                </dd>
              </Fragment>
            )
          })}
        </dl>
      </section>
    </div>
  )
}
