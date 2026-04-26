import { Split } from './Split'

export default function SplitDemo() {
  const cellStyle = {
    padding: 12,
    background: 'color-mix(in oklch, Canvas 92%, CanvasText)',
    minBlockSize: 160,
  } as const
  return (
    <Split id="demo-split-3" axis="row" defaultSizes={[1, 2, 3]} minSizes={120}>
      <div style={cellStyle}>A (1fr)</div>
      <div style={cellStyle}>B (2fr)</div>
      <div style={cellStyle}>C (3fr)</div>
    </Split>
  )
}
