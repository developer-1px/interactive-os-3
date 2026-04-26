import { useMemo } from 'react'
import {
  NumberInput, Toolbar, ROOT, FOCUS, useControlState,
  type NormalizedData, type Event,
} from '@p/ds'
import { Field } from '../Field'
import type { Selection } from '../types'

const PAD: { key: keyof Selection; label: string }[] = [
  { key: 'padTop', label: 'Padding T' },
  { key: 'padRight', label: 'Padding R' },
  { key: 'padBottom', label: 'Padding B' },
  { key: 'padLeft', label: 'Padding L' },
]

type Dir = 'horizontal' | 'vertical'

export function LayoutSection({ sel, set }: {
  sel: Selection
  set: (patch: Partial<Selection>) => void
}) {
  const base = useMemo<NormalizedData>(() => ({
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      horizontal: { id: 'horizontal', data: { label: 'horizontal', icon: 'arrow-right', content: 'Horizontal', pressed: sel.layoutDir === 'horizontal' } },
      vertical:   { id: 'vertical',   data: { label: 'vertical',   icon: 'arrow-down',  content: 'Vertical',   pressed: sel.layoutDir === 'vertical' } },
      [FOCUS]: { id: FOCUS, data: { id: sel.layoutDir } },
    },
    relationships: { [ROOT]: ['horizontal', 'vertical'] },
  }), [sel.layoutDir])
  const [data, dispatch] = useControlState(base)
  const onEvent = (e: Event) => {
    dispatch(e)
    if (e.type === 'activate') set({ layoutDir: e.id as Dir })
  }

  return (
    <section data-part="panel-section" aria-label="Layout">
      <h3>Layout</h3>

      <Field label="Direction">
        <Toolbar data={data} onEvent={onEvent} aria-label="Layout direction" />
      </Field>

      <Field label="Gap" unit="px" htmlFor="ly-gap">
        <NumberInput id="ly-gap" value={sel.gap} onChange={(gap) => set({ gap })} min={0} />
      </Field>

      {PAD.map((p) => (
        <Field key={p.key} label={p.label} unit="px" htmlFor={`ly-${p.key}`}>
          <NumberInput
            id={`ly-${p.key}`}
            value={sel[p.key] as number}
            onChange={(v) => set({ [p.key]: v } as Partial<Selection>)}
            min={0}
          />
        </Field>
      ))}
    </section>
  )
}
