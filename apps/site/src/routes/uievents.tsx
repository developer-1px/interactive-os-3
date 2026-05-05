import { createFileRoute } from '@tanstack/react-router'
import typesSrc from '@p/headless/types.ts?raw'

export const Route = createFileRoute('/uievents')({
  component: UiEventsApp,
  staticData: {
    palette: {
      label: 'UiEvents',
      to: '/uievents',
      sub: 'ui ↔ headless 통신의 단일 어휘 — UiEvent variant 카탈로그',
    },
  },
})

interface Variant {
  type: string
  shape: string
  doc?: string
}

/**
 * types.ts 에서 `export type UiEvent = ...` 블록을 추출하여 variant 분해.
 * SSOT = 코드. site는 그것을 비주얼라이즈만.
 */
function extractVariants(): Variant[] {
  const m = typesSrc.match(/export type UiEvent =\n([\s\S]*?)(?=\n\nexport |\n\n\/\*\*\s*UiEvent 의 `value`)/m)
  if (!m) return []
  const body = m[1]
  const lines = body.split('\n')
  const variants: Variant[] = []
  let pendingDoc: string | undefined

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    const docMatch = line.match(/^\/\*\*\s*(.*?)\s*\*\/$/)
    if (docMatch) { pendingDoc = docMatch[1]; continue }
    const variantMatch = line.match(/^\|\s*\{\s*type:\s*'([^']+)';?\s*(.*?)\s*\}\s*$/)
    if (variantMatch) {
      variants.push({
        type: variantMatch[1],
        shape: variantMatch[2] || '(no payload)',
        doc: pendingDoc,
      })
      pendingDoc = undefined
    }
  }
  return variants
}

const PATTERNS_THAT_EMIT: Record<string, string[]> = {
  navigate:    ['listbox', 'tabs', 'menu', 'menubar', 'tree', 'treeGrid', 'grid', 'toolbar', 'radioGroup'],
  activate:    ['listbox', 'tabs', 'menu', 'menubar', 'tree', 'treeGrid', 'grid', 'toolbar', 'radioGroup', 'accordion', 'disclosure', 'switch'],
  expand:      ['accordion', 'menu', 'menubar', 'treeGrid'],
  select:      ['listbox', 'tree', 'treeGrid', 'grid'],
  selectMany:  ['listbox (multi)', 'tree (multi)', 'treeGrid (multi)', 'grid (multi)'],
  value:       ['slider', 'spinbutton', 'splitter', 'switch'],
  open:        ['combobox', 'dialog', 'tooltip', 'menu (root)'],
  typeahead:   ['listbox', 'tabs', 'menu', 'menubar', 'tree', 'treeGrid', 'grid'],
  pan:         ['(useZoomPanGesture)'],
  zoom:        ['(useZoomPanGesture)'],
}

function UiEventsApp() {
  const variants = extractVariants()
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-8 py-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">Single dispatch vocabulary</p>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">UiEvent 카탈로그</h1>
        <p className="mt-2 max-w-3xl text-base text-stone-600">
          UI ↔ headless 통신의 단일 어휘. 모든 패턴이 <code className="rounded bg-stone-100 px-1.5 font-mono">{`onEvent(e: UiEvent)`}</code> 한 채널로 dispatch — discriminated union의 <code className="font-mono">{`type`}</code> 필드가 disambiguator. 새 variant 는 <code className="font-mono">packages/headless/src/types.ts</code> SSOT 에 추가.
        </p>
      </header>
      <main className="mx-auto max-w-6xl px-8 py-8">
        <div className="grid gap-3 md:grid-cols-2">
          {variants.map((v) => (
            <article key={v.type} className="rounded-xl border border-stone-200 bg-white p-5">
              <header className="flex items-baseline justify-between gap-3">
                <h2 className="font-mono text-base font-bold text-stone-900">{`{ type: '${v.type}' }`}</h2>
              </header>
              <code className="mt-2 block break-all rounded bg-stone-50 p-2 font-mono text-xs text-stone-800">
                {`{ type: '${v.type}'${v.shape !== '(no payload)' ? `; ${v.shape}` : ''} }`}
              </code>
              {v.doc && <p className="mt-3 text-sm leading-relaxed text-stone-600">{v.doc}</p>}
              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Emitted by</p>
                <p className="mt-1 text-xs text-stone-700">
                  {(PATTERNS_THAT_EMIT[v.type] ?? []).join(' · ') || <em className="text-stone-400">(none mapped)</em>}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-xs text-stone-500">
          {variants.length} variants. SSOT: <code className="font-mono">{`packages/headless/src/types.ts`}</code> 에서 `?raw` import 로 직접 파싱.
        </p>
      </main>
    </div>
  )
}
