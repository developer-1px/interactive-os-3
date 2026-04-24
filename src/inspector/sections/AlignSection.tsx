import { Toolbar, ToolbarButton, Separator } from '../../controls'

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

export function AlignSection() {
  return (
    <section aria-roledescription="panel-section" aria-label="Align">
      <Toolbar aria-label="Align">
        {H.map((b, i) => (
          <ToolbarButton key={b.id} pressed={i === 0} data-icon={b.icon} aria-label={b.label} />
        ))}
        <Separator orientation="vertical" />
        {V.map((b, i) => (
          <ToolbarButton key={b.id} pressed={i === 0} data-icon={b.icon} aria-label={b.label} />
        ))}
      </Toolbar>
    </section>
  )
}
