import { useMemo, useState } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '../../ds'
import { Canvas } from './Canvas'
import { initialSelection, type Selection } from './types'
import { AlignSection } from './sections/AlignSection'
import { TransformSection } from './sections/TransformSection'
import { LayoutSection } from './sections/LayoutSection'
import { AppearanceSection } from './sections/AppearanceSection'
import { FillSection, StrokeSection } from './sections/FillStrokeSection'
import { EffectsSection } from './sections/EffectsSection'
import { ExportSection } from './sections/ExportSection'

/**
 * /inspector — Figma-style canvas + property dock.
 *
 * FlatLayout 셸 + InspectorBody Ui leaf. Canvas + 8개 section 은 상태 공유가
 * 강해 단일 Ui leaf 로 묶었다. 각 section 은 자체 build 로 이미 FlatLayout 위에 있음.
 */
export function Inspector() {
  const page: NormalizedData = useMemo(() => definePage({
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      body: { id: 'body', data: { type: 'Ui', component: 'InspectorBody' } },
    },
    relationships: { [ROOT]: ['body'] },
  }), [])
  return <Renderer page={page} localRegistry={{ InspectorBody }} />
}

function InspectorBody() {
  const [sel, setSel] = useState<Selection>(initialSelection)
  const set = (patch: Partial<Selection>) => setSel((s) => ({ ...s, ...patch }))

  return (
    <main data-part="inspector-app" aria-label="Inspector">
      <header>
        <div data-part="window-controls" aria-label="창 컨트롤">
          <span /><span /><span />
        </div>
        <h1>Inspector — {sel.name}</h1>
      </header>

      <section data-part="body">
        <Canvas sel={sel} />
        <aside data-part="panel" aria-label="Properties">
          <AlignSection />
          <TransformSection sel={sel} set={set} />
          <LayoutSection sel={sel} set={set} />
          <AppearanceSection sel={sel} set={set} />
          <FillSection sel={sel} set={set} />
          <StrokeSection sel={sel} set={set} />
          <EffectsSection sel={sel} set={set} />
          <ExportSection sel={sel} set={set} />
        </aside>
      </section>
    </main>
  )
}
