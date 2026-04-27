import { useReducer, useMemo } from 'react'
import { ROOT, reduce, type NormalizedData } from '@p/ds'
import { ZoomPanCanvas } from '../ZoomPanCanvas'

export default function ZoomPanCanvasDemo() {
  const initial = useMemo<NormalizedData>(() => ({
    entities: { [ROOT]: { id: ROOT, data: { x: 0, y: 0, s: 1, bounds: { minS: 0.25, maxS: 4 } } } },
    relationships: { [ROOT]: [] },
  }), [])
  const [data, dispatch] = useReducer(reduce, initial)
  return (
    <div style={{ width: 200, height: 120, border: '1px dashed #999' }}>
      <ZoomPanCanvas id={ROOT} data={data} onEvent={dispatch}>
        <div style={{ padding: 16, font: '500 12px system-ui' }}>zoom · pan · scroll</div>
      </ZoomPanCanvas>
    </div>
  )
}
