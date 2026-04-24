import { NumberInput, Select, Slider } from '../../controls'
import { Field } from '../Field'
import type { BlendMode, Selection } from '../types'

const BLEND: BlendMode[] = [
  'normal', 'multiply', 'screen', 'overlay',
  'darken', 'lighten', 'color-dodge', 'color-burn',
]

export function AppearanceSection({ sel, set }: {
  sel: Selection
  set: (patch: Partial<Selection>) => void
}) {
  return (
    <section aria-roledescription="panel-section" aria-label="Appearance">
      <h3>Appearance</h3>
      <Field label="Opacity" unit="%" htmlFor="ap-op">
        <Slider
          id="ap-op"
          value={sel.opacity}
          onChange={(opacity) => set({ opacity })}
          min={0}
          max={100}
        />
      </Field>
      <Field label="Radius" unit="px" htmlFor="ap-r">
        <NumberInput
          id="ap-r"
          value={sel.radius}
          onChange={(radius) => set({ radius })}
          min={0}
        />
      </Field>
      <Field label="Blend" htmlFor="ap-b">
        <Select
          id="ap-b"
          value={sel.blend}
          onChange={(e) => set({ blend: e.currentTarget.value as BlendMode })}
        >
          {BLEND.map((b) => <option key={b} value={b}>{b}</option>)}
        </Select>
      </Field>
    </section>
  )
}
