import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Outliner, outlineCrud } from '@apps/outliner'
import { treeBuiltinChords } from '@p/headless/patterns'
import { CopyButton } from '../catalog/CopyButton'
import { HighlightedCode } from '../catalog/HighlightedCode'
import { buildAppTabs } from '../catalog/buildAppTabs'
import { KeymapPanel } from '../debug/KeymapPanel'
import { JsonInspector } from '../debug/JsonInspector'

const SOURCES = import.meta.glob<string>(
  '../../../outliner/src/**/*.{ts,tsx}',
  { eager: true, query: '?raw', import: 'default' },
)
const TABS = buildAppTabs(SOURCES, 'widgets/Outliner.tsx')

function OutlinerScreen() {
  const [activeKey, setActiveKey] = useState<string>(TABS[0].key)
  const active = TABS.find((t) => t.key === activeKey) ?? TABS[0]
  return (
    <div className="grid h-screen grid-cols-1 md:grid-cols-[1fr_1fr_1fr] md:overflow-hidden">
      <div className="bg-stone-50 md:overflow-auto">
        <Outliner />
      </div>
      <aside className="flex flex-col bg-neutral-50 border-l border-neutral-200 md:overflow-hidden">
        <div className="overflow-auto">
          <KeymapPanel chords={treeBuiltinChords} title="Keymap (SSOT — treeBuiltinChords)" />
          <JsonInspector source={outlineCrud} title="Live JSON (zod-crud snapshot)" />
        </div>
      </aside>
      <div className="flex flex-col bg-stone-950 border-t md:border-t-0 md:border-l border-stone-200 md:overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-800 px-4 py-2">
          <div className="flex items-center gap-1 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveKey(t.key)}
                className={`rounded px-2 py-0.5 text-[11px] font-mono ${
                  active.key === t.key
                    ? 'bg-stone-800 text-stone-100'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {t.label}
              </button>
            ))}
            <code className="ml-2 text-xs font-mono text-stone-500">{active.filename}</code>
          </div>
          <CopyButton text={active.source} />
        </div>
        <HighlightedCode source={active.source} filename={active.filename} />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/apps/outliner/$')({
  component: OutlinerScreen,
  staticData: {
    palette: {
      label: 'Outliner',
      to: '/apps/outliner/$',
      sub: 'Keyboard-only Workflowy clone — zod-crud × @p/headless example',
    },
  },
})
