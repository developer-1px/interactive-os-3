import { Button } from '../Button'

export default function ButtonDemo() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button pressed>Pressed</Button>
      <Button disabled>Disabled</Button>
      <Button data-icon="check" aria-label="Confirm" />
    </div>
  )
}
