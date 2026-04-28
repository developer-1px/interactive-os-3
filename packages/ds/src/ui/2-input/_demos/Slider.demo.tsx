import { useState } from 'react'
import { Slider } from '../Slider'

export default function SliderDemo() {
  const [v, setV] = useState(60)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxInlineSize: 200 }}>
      <Slider value={v} onChange={setV} min={0} max={100} aria-label="volume" />
      <Slider value={30} onChange={() => {}} disabled aria-label="disabled" />
    </div>
  )
}
