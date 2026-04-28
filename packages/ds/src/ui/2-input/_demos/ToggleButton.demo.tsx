import { ToggleButton } from '../ToggleButton'

export default function ToggleButtonDemo() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <ToggleButton pressed={false}>Off</ToggleButton>
      <ToggleButton pressed>On</ToggleButton>
      <ToggleButton pressed disabled>Disabled</ToggleButton>
    </div>
  )
}
