import { useState } from 'react'
import { NumberInput } from '../NumberInput'

export default function NumberInputDemo() {
  const [n, setN] = useState(5)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxInlineSize: 200 }}>
      <NumberInput value={n} onChange={setN} min={0} max={10} aria-label="count" />
      <NumberInput value={42} onChange={() => {}} disabled aria-label="disabled" />
    </div>
  )
}
