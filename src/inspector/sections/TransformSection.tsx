import { NumberInput } from '../../controls'
import { Field } from '../Field'
import type { Selection } from '../types'

const FIELDS: { key: keyof Selection; label: string; unit: string; min?: number; max?: number }[] = [
  { key: 'x', label: 'X', unit: 'px' },
  { key: 'y', label: 'Y', unit: 'px' },
  { key: 'w', label: 'W', unit: 'px', min: 0 },
  { key: 'h', label: 'H', unit: 'px', min: 0 },
  { key: 'rotation', label: 'Rotation', unit: '°', min: -360, max: 360 },
]

export function TransformSection({ sel, set }: {
  sel: Selection
  set: (patch: Partial<Selection>) => void
}) {
  return (
    <section aria-roledescription="panel-section" aria-label="Transform">
      <h3>Transform</h3>
      {FIELDS.map((f) => (
        <Field key={f.key} label={f.label} unit={f.unit} htmlFor={`tf-${f.key}`}>
          <NumberInput
            id={`tf-${f.key}`}
            value={sel[f.key] as number}
            onChange={(v) => set({ [f.key]: v } as Partial<Selection>)}
            min={f.min}
            max={f.max}
          />
        </Field>
      ))}
    </section>
  )
}
