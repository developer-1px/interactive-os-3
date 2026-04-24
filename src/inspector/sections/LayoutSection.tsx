import { NumberInput, Toolbar, ToolbarButton } from '../../controls'
import { Field } from '../Field'
import type { Selection } from '../types'

const PAD: { key: keyof Selection; label: string }[] = [
  { key: 'padTop', label: 'Padding T' },
  { key: 'padRight', label: 'Padding R' },
  { key: 'padBottom', label: 'Padding B' },
  { key: 'padLeft', label: 'Padding L' },
]

export function LayoutSection({ sel, set }: {
  sel: Selection
  set: (patch: Partial<Selection>) => void
}) {
  return (
    <section aria-roledescription="panel-section" aria-label="Layout">
      <h3>Layout</h3>

      <Field label="Direction">
        <Toolbar aria-label="Layout direction">
          {(['horizontal', 'vertical'] as const).map((dir) => (
            <ToolbarButton
              key={dir}
              pressed={sel.layoutDir === dir}
              onClick={() => set({ layoutDir: dir })}
              data-icon={dir === 'horizontal' ? 'arrow-right' : 'arrow-down'}
              aria-label={dir}
            >{dir[0].toUpperCase() + dir.slice(1)}</ToolbarButton>
          ))}
        </Toolbar>
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
