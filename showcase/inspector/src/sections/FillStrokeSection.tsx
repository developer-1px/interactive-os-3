import { useMemo } from 'react'
import {
  ColorInput, Input, NumberInput, Toolbar, ROOT, FOCUS, useControlState,
  type NormalizedData, type UiEvent,
} from '@p/ds'
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
    <section data-part="panel-section" aria-label="Fill">
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
    <section data-part="panel-section" aria-label="Stroke">
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
        <StrokeStyleToolbar value={sel.strokeStyle} onChange={(strokeStyle) => set({ strokeStyle })} />
      </Field>
    </section>
  )
}

function StrokeStyleToolbar({ value, onChange }: { value: StrokeStyle; onChange: (v: StrokeStyle) => void }) {
  const base = useMemo<NormalizedData>(() => ({
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      ...Object.fromEntries(STROKE_STYLES.map((s) => [
        s, { id: s, data: { label: s, content: s, pressed: value === s } },
      ])),
      [FOCUS]: { id: FOCUS, data: { id: value } },
    },
    relationships: { [ROOT]: [...STROKE_STYLES] },
  }), [value])
  const [data, dispatch] = useControlState(base)
  const onEvent = (e: UiEvent) => {
    dispatch(e)
    if (e.type === 'activate') onChange(e.id as StrokeStyle)
  }
  return <Toolbar data={data} onEvent={onEvent} aria-label="Stroke style" />
}
