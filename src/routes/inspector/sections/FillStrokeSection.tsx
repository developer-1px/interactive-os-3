import { ColorInput, Input, NumberInput, Toolbar, ToolbarButton } from '../../../ds'
import { Field } from '../Field'
import type { Selection, StrokeStyle } from '../types'

const STROKE_STYLES: StrokeStyle[] = ['solid', 'dashed', 'dotted']

function ColorRow({ label, id, value, onChange }: {
  label: string; id: string; value: string; onChange: (v: string) => void
}) {
  return (
    <Field label={label} htmlFor={id}>
      <ColorInput id={id} value={value} onChange={onChange} />
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

export function FillSection({ sel, set }: {
  sel: Selection
  set: (patch: Partial<Selection>) => void
}) {
  return (
    <section aria-roledescription="panel-section" aria-label="Fill">
      <h3>Fill</h3>
      <ColorRow label="Color" id="fl-c" value={sel.fill} onChange={(fill) => set({ fill })} />
    </section>
  )
}

export function StrokeSection({ sel, set }: {
  sel: Selection
  set: (patch: Partial<Selection>) => void
}) {
  return (
    <section aria-roledescription="panel-section" aria-label="Stroke">
      <h3>Stroke</h3>
      <ColorRow label="Color" id="st-c" value={sel.strokeColor} onChange={(strokeColor) => set({ strokeColor })} />
      <Field label="Width" unit="px" htmlFor="st-w">
        <NumberInput
          id="st-w"
          value={sel.strokeWidth}
          onChange={(strokeWidth) => set({ strokeWidth })}
          min={0}
        />
      </Field>
      <Field label="Style">
        <Toolbar aria-label="Stroke style">
          {STROKE_STYLES.map((s) => (
            <ToolbarButton
              key={s}
              pressed={sel.strokeStyle === s}
              onClick={() => set({ strokeStyle: s })}
              aria-label={s}
            >{s}</ToolbarButton>
          ))}
        </Toolbar>
      </Field>
    </section>
  )
}
