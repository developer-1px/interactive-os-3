import { useLocalValue } from '@p/headless/local'
import { splitterAxis, splitterPattern } from '@p/headless/patterns'
import { axisKeys } from '@p/headless'

export const meta = {
  title: 'Splitter · Vertical',
  apg: 'windowsplitter',
  kind: 'single-value' as const,
  blurb: 'A vertically resizable split panel controlled by a single percentage value.',
  keys: () => axisKeys(splitterAxis()),
}

export default function SplitterVerticalDemo() {
  const [value, dispatch] = useLocalValue(40)
  const { rootProps, handleProps } = splitterPattern(value, dispatch, {
    orientation: 'vertical',
    min: 10,
    max: 90,
    step: 5,
  })

  return (
    <div
      {...rootProps}
      className="flex h-64 w-full flex-col overflow-hidden rounded-md border border-stone-200 bg-white text-sm"
    >
      <div style={{ flexBasis: `${value}%` }} className="bg-stone-50 p-3 text-stone-700">
        Top ({value}%)
      </div>
      <button
        {...handleProps}
        className="h-1.5 cursor-row-resize bg-stone-300 hover:bg-stone-500"
      />
      <div style={{ flexBasis: `${100 - value}%` }} className="flex-1 bg-white p-3 text-stone-700">
        Bottom ({100 - value}%)
      </div>
    </div>
  )
}
