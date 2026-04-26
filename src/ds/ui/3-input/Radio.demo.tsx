import { Radio } from './Radio'

export default function RadioDemo() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Radio checked aria-label="A" />
      <Radio aria-label="B" />
      <Radio disabled aria-label="disabled" />
    </div>
  )
}
