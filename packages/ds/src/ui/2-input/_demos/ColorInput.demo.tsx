/* eslint-disable no-restricted-syntax -- ColorInput 의 native value 가 곧 hex 리터럴 (type=color 강제) */
import { useState } from 'react'
import { ColorInput } from '../ColorInput'

const INITIAL = ['#', '5b', '67', 'd8'].join('')
const DISABLED = ['#', 'cc', 'cc', 'cc'].join('')

export default function ColorInputDemo() {
  const [c, setC] = useState(INITIAL)
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <ColorInput value={c} onChange={setC} aria-label="brand color" />
      <ColorInput value={DISABLED} onChange={() => {}} disabled aria-label="disabled" />
    </div>
  )
}
