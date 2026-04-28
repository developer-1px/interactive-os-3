import { Checkbox } from '../Checkbox'

export default function CheckboxDemo() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Checkbox checked={false} aria-label="off" />
      <Checkbox checked aria-label="on" />
      <Checkbox checked="mixed" aria-label="mixed" />
      <Checkbox checked disabled aria-label="disabled" />
    </div>
  )
}
