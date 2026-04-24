import { Button, Switch } from '../../controls'
import { Field } from '../Field'
import type { Selection } from '../types'

/**
 * Effects: 원래 각 effect별 팝오버 편집창이 열려야 함 (shadow offset, blur radius).
 * 독립 Popover role이 ds에 없어서 — Switch(enabled) + Button(편집) 까지만 구성.
 * FINDINGS.md 참고.
 */
export function EffectsSection({ sel, set }: {
  sel: Selection
  set: (patch: Partial<Selection>) => void
}) {
  const toggle = (id: string) =>
    set({
      effects: sel.effects.map((e) => e.id === id ? { ...e, enabled: !e.enabled } : e),
    })

  return (
    <section aria-roledescription="panel-section" aria-label="Effects">
      <h3>Effects</h3>
      {sel.effects.map((e) => (
        <Field key={e.id} label={e.label}>
          <Switch checked={e.enabled} onClick={() => toggle(e.id)} aria-label={`${e.label} enabled`} />
          <Button data-icon="settings" aria-label={`Edit ${e.label}`}>Edit</Button>
        </Field>
      ))}
    </section>
  )
}
