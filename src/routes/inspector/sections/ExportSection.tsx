import { Button, NumberInput, Select } from '../../../ds'
import { Field } from '../Field'
import type { ExportFormat, Selection } from '../types'

const FORMATS: ExportFormat[] = ['PNG', 'JPG', 'SVG', 'PDF']

export function ExportSection({ sel, set }: {
  sel: Selection
  set: (patch: Partial<Selection>) => void
}) {
  const update = (id: string, patch: Partial<Selection['exports'][number]>) =>
    set({ exports: sel.exports.map((x) => x.id === id ? { ...x, ...patch } : x) })

  const add = () =>
    set({ exports: [...sel.exports, { id: `x${Date.now()}`, scale: 1, format: 'PNG' }] })

  return (
    <section aria-roledescription="panel-section" aria-label="Export">
      <h3>Export</h3>
      {sel.exports.map((x) => (
        <Field key={x.id} label={`×${x.scale}`}>
          <NumberInput
            value={x.scale}
            onChange={(scale) => update(x.id, { scale })}
            min={0.5}
            step={0.5}
          />
          <Select
            value={x.format}
            onChange={(e) => update(x.id, { format: e.currentTarget.value as ExportFormat })}
          >
            {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
          </Select>
        </Field>
      ))}
      <Button data-icon="plus" onClick={add}>Add export</Button>
      <Button>Export</Button>
    </section>
  )
}
