import { ROOT, type NormalizedData } from '@p/headless'
import { sliderPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'

export const meta = {
  title: 'Slider',
  apg: 'slider',
  kind: 'collection' as const,
  blurb: 'numericStep axis · Arrow ±step · Home/End · aria-valuemin/max/now on thumb.',
}

const initial: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT },
    thumb: { id: 'thumb', data: { value: 40, min: 0, max: 100, step: 5, label: 'Volume' } },
  },
  relationships: { [ROOT]: ['thumb'] },
}

export default function Demo() {
  const [data, onEvent] = useLocalData(initial)
  const value = Number(data.entities.thumb?.data?.value ?? 0)
  const { rootProps, trackProps, rangeProps, thumbProps } = sliderPattern(data, 'thumb', onEvent)

  return (
    <div className="space-y-2">
      <div {...rootProps} className="relative h-6 w-64">
        <div {...trackProps} className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-stone-200" />
        <div
          {...rangeProps}
          style={{ width: `${value}%` }}
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-stone-900"
        />
        <button
          {...thumbProps}
          style={{ left: `${value}%` }}
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-stone-900 bg-white shadow"
        />
      </div>
      <p className="text-xs text-stone-500">value: {value}</p>
    </div>
  )
}
