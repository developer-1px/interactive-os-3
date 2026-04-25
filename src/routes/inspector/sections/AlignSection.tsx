import { Toolbar, ROOT, FOCUS, type NormalizedData, useControlState } from '../../../ds'

const H = [
  { id: 'left', icon: 'align-left', label: 'Align left' },
  { id: 'center-h', icon: 'align-center-horizontal', label: 'Align horizontal center' },
  { id: 'right', icon: 'align-right', label: 'Align right' },
] as const

const V = [
  { id: 'top', icon: 'align-top', label: 'Align top' },
  { id: 'center-v', icon: 'align-center-vertical', label: 'Align vertical center' },
  { id: 'bottom', icon: 'align-bottom', label: 'Align bottom' },
] as const

const PRESSED = new Set(['left', 'top'])

const base: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT, data: {} },
    ...Object.fromEntries([...H, ...V].map((b) => [
      b.id, { id: b.id, data: { label: b.label, icon: b.icon, pressed: PRESSED.has(b.id) } },
    ])),
    sep: { id: 'sep', data: { separator: true } },
    [FOCUS]: { id: FOCUS, data: { id: 'left' } },
  },
  relationships: { [ROOT]: [...H.map((b) => b.id), 'sep', ...V.map((b) => b.id)] },
}

export function AlignSection() {
  const [data, onEvent] = useControlState(base)
  return (
    <section aria-roledescription="panel-section" aria-label="Align">
      <Toolbar data={data} onEvent={onEvent} aria-label="Align" />
    </section>
  )
}
