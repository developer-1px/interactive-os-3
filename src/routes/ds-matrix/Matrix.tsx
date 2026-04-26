import { Component, useMemo, type ComponentType, type ReactNode } from 'react'
import * as controls from '../../ds'
import { Grid, Renderer, definePage, ROOT, type NormalizedData } from '../../ds'

// DS가 자기 자신을 한 장에 전시한다. 컨트롤 하나당 셀 하나.
// 데이터 소스는 ds index export 자체 — index에 추가되면 자동 반영된다.
// 렌더가 터지면 cell 자체가 ❌로 남아 "이 컴포넌트는 prop만으로 구성 불가"라는
// DS API 결함 신호가 그대로 드러난다. 가리지 않는다.

class CellBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null }
  static getDerivedStateFromError(e: Error) { return { error: e.message } }
  render() {
    if (this.state.error) return <code data-cell-error>{this.state.error}</code>
    return this.props.children
  }
}

const components = Object.entries(controls)
  .filter(([name, v]) => typeof v === 'function' && /^[A-Z]/.test(name))
  .sort(([a], [b]) => a.localeCompare(b)) as Array<[string, ComponentType]>

export function Matrix() {
  const page: NormalizedData = useMemo(() => definePage({
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      main:   { id: 'main',   data: { type: 'Main',   flow: 'list', label: 'DS Matrix' } },
      header: { id: 'header', data: { type: 'Header', flow: 'list' } },
      title:  { id: 'title',  data: { type: 'Text',   variant: 'h1', content: 'DS Matrix' } },
      desc:   { id: 'desc',   data: { type: 'Text',   variant: 'body', content: `${components.length} components — 시각 일관성·구분을 한 눈에 검사` } },
      grid:   { id: 'grid',   data: { type: 'Ui',     component: 'DsMatrixGrid' } },
    },
    relationships: {
      [ROOT]: ['main'],
      main:   ['header', 'grid'],
      header: ['title', 'desc'],
    },
  }), [])
  return <Renderer page={page} localRegistry={{ DsMatrixGrid }} />
}

function DsMatrixGrid() {
  return (
    <Grid cols={3}>
      {components.map(([name, C]) => (
        <figure key={name}>
          <figcaption>{name}</figcaption>
          <CellBoundary><C /></CellBoundary>
        </figure>
      ))}
    </Grid>
  )
}
