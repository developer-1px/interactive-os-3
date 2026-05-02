import { numericStep, ROOT, type NormalizedData } from '@p/headless'
import { splitterPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Splitter',
  apg: 'windowsplitter',
  kind: 'collection' as const,
  blurb: 'role="separator" + aria-valuenow · numeric step axis shared with slider.',
  keys: () => dedupe(probe(numericStep('vertical'))),
}

const initial: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT },
    handle: { id: 'handle', data: { value: 40, min: 10, max: 90, step: 5 } },
  },
  relationships: { [ROOT]: ['handle'] },
}

export default function Demo() {
  const [data, onEvent] = useLocalData(initial)
  const value = Number(data.entities.handle?.data?.value ?? 50)
  const { rootProps, handleProps } = splitterPattern(data, 'handle', onEvent, { orientation: 'horizontal' })

  return (
    <div
      {...rootProps}
      className="flex h-32 w-full overflow-hidden rounded-md border border-stone-200 bg-white text-sm"
    >
      <div style={{ flexBasis: `${value}%` }} className="bg-stone-50 p-3 text-stone-700">
        Left ({value}%)
      </div>
      <button
        {...handleProps}
        className="w-1.5 cursor-col-resize bg-stone-300 hover:bg-stone-500"
      />
      <div style={{ flexBasis: `${100 - value}%` }} className="flex-1 bg-white p-3 text-stone-700">
        Right ({100 - value}%)
      </div>
    </div>
  )
}
