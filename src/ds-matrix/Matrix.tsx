import { Component, type ComponentType, type ReactNode } from 'react'
import * as controls from '../controls'

// DS가 자기 자신을 한 장에 전시한다. 컨트롤 하나당 셀 하나.
// 상태 조합·ARIA 축·axe 검증은 없다 — 사람 눈이 일관성/구분을 본다.
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
  .sort(([a], [b]) => a.localeCompare(b)) as [string, ComponentType][]

export function Matrix() {
  return (
    <main aria-roledescription="ds-matrix" aria-label="DS Matrix">
      <header>
        <h1>DS Matrix</h1>
        <p>{components.length} components — 시각 일관성·구분을 한 눈에 검사</p>
      </header>
      {components.map(([name, C]) => (
        <figure key={name} aria-roledescription="matrix-cell">
          <figcaption>{name}</figcaption>
          <CellBoundary><C /></CellBoundary>
        </figure>
      ))}
    </main>
  )
}
