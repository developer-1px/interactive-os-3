import { useState } from 'react'
import { Canvas } from './Canvas'
import { initialSelection, type Selection } from './types'
import { AlignSection } from './sections/AlignSection'
import { TransformSection } from './sections/TransformSection'
import { LayoutSection } from './sections/LayoutSection'
import { AppearanceSection } from './sections/AppearanceSection'
import { FillSection, StrokeSection } from './sections/FillStrokeSection'
import { EffectsSection } from './sections/EffectsSection'
import { ExportSection } from './sections/ExportSection'

export function Inspector() {
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
