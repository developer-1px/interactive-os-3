import { Switch } from '../Switch'

export default function SwitchDemo() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Switch checked={false} aria-label="off" />
      <Switch checked aria-label="on" />
      <Switch checked disabled aria-label="disabled" />
    </div>
  )
}
