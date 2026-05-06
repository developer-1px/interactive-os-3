import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import * as patternsAll from '@p/headless/patterns'
import { PATTERNS, AXES } from '../catalog/registry.axes'
import { axisKeys } from '@p/headless'
import { fmtKey } from '../catalog/keys'
import type { Axis } from '@p/headless'

export const Route = createFileRoute('/matrix')({
  component: MatrixApp,
  staticData: {
    palette: {
      label: 'Matrix',
      to: '/matrix',
      sub: 'Pattern × Axis · Pattern × Key 횡단 비교',
    },
  },
})

type Tab = 'axis' | 'key'

function MatrixApp() {
  const [tab, setTab] = useState<Tab>('axis')
  return (
    <div className="flex h-screen flex-col bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-8 py-4">
        <h1 className="text-xl font-bold text-stone-900">Matrix</h1>
        <p className="text-sm text-stone-600">패턴이 어떤 axis 를 합성하는지, 어떤 키에 응답하는지 한 화면에서 비교.</p>
        <nav className="mt-3 flex gap-1 text-sm">
          <TabBtn active={tab === 'axis'} onClick={() => setTab('axis')}>
            Pattern × Axis
          </TabBtn>
          <TabBtn active={tab === 'key'} onClick={() => setTab('key')}>
            Pattern × Key
          </TabBtn>
        </nav>
      </header>
      <main className="flex-1 overflow-auto p-6">
        {tab === 'axis' ? <AxisMatrix /> : <KeyMatrix />}
      </main>
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-medium ${
        active ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-200'
      }`}
    >
      {children}
    </button>
  )
}

// ─── Pattern × Axis ─────────────────────────────────────────────────

function AxisMatrix() {
  const allAxes = AXES.map((a) => a.axis)
  return (
    <div className="overflow-auto rounded-lg border border-stone-200 bg-white">
      <table className="min-w-full border-collapse text-xs">
        <thead className="sticky top-0 z-10 bg-stone-50">
          <tr>
            <th className="sticky left-0 z-20 border-b border-r border-stone-200 bg-stone-50 px-3 py-2 text-left font-mono font-semibold text-stone-900">
              pattern \ axis
            </th>
            {allAxes.map((ax) => (
              <th
                key={ax}
                className="rotate-180 border-b border-stone-200 px-2 py-2 align-bottom font-mono font-medium text-stone-700 [writing-mode:vertical-rl]"
              >
                {ax}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PATTERNS.map((p) => (
            <tr key={p.name} className="hover:bg-stone-50">
              <td className="sticky left-0 z-10 border-b border-r border-stone-100 bg-white px-3 py-2 font-mono font-medium text-stone-900 hover:bg-stone-50">
                {p.name}
              </td>
              {allAxes.map((ax) => (
                <td
                  key={ax}
                  className={`border-b border-stone-100 px-2 py-2 text-center ${
                    p.axes.includes(ax) ? 'bg-stone-900 text-white' : 'text-stone-300'
                  }`}
                >
                  {p.axes.includes(ax) ? '●' : '·'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Pattern × Key ──────────────────────────────────────────────────

const PROBE_KEYS = [
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'Home', 'End', 'PageUp', 'PageDown',
  'Enter', ' ', 'Escape', 'Tab', 'a',
]

function KeyMatrix() {
  const rows = useMemo(() => probePatterns(), [])
  return (
    <div className="overflow-auto rounded-lg border border-stone-200 bg-white">
      <table className="min-w-full border-collapse text-xs">
        <thead className="sticky top-0 z-10 bg-stone-50">
          <tr>
            <th className="sticky left-0 z-20 border-b border-r border-stone-200 bg-stone-50 px-3 py-2 text-left font-mono font-semibold text-stone-900">
              pattern \ key
            </th>
            {PROBE_KEYS.map((k) => (
              <th key={k} className="border-b border-stone-200 px-2 py-2 text-center font-mono font-medium text-stone-700">
                {fmtKey(k)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ name, keys }) => (
            <tr key={name} className="hover:bg-stone-50">
              <td className="sticky left-0 z-10 border-b border-r border-stone-100 bg-white px-3 py-2 font-mono font-medium text-stone-900 hover:bg-stone-50">
                {name}
              </td>
              {PROBE_KEYS.map((k) => (
                <td
                  key={k}
                  className={`border-b border-stone-100 px-2 py-2 text-center ${
                    keys.includes(k) ? 'bg-stone-900 text-white' : 'text-stone-300'
                  }`}
                >
                  {keys.includes(k) ? '●' : '·'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-stone-200 bg-stone-50 px-3 py-2 text-[11px] text-stone-500">
        SSOT: 각 패턴의 <code className="font-mono">{'*Axis'}</code>/<code className="font-mono">{'*Keys'}</code> export 에 PROBE 키를 던져 응답을 수집. 패턴 코드만이 정본.
      </p>
    </div>
  )
}

function probePatterns(): { name: string; keys: string[] }[] {
  const rows: { name: string; keys: string[] }[] = []
  const all = patternsAll as unknown as Record<string, unknown>
  for (const [exportName, fn] of Object.entries(all)) {
    if (typeof fn !== 'function') continue
    if (!/Axis$|Keys$/.test(exportName)) continue
    try {
      const built = (fn as (...args: unknown[]) => Axis | Axis[])()
      const axes = Array.isArray(built) ? built : [built]
      const keys = Array.from(new Set(axes.flatMap((ax) => axisKeys(ax))))
      // 이름 패턴 다듬기 — accordionAxis → accordion
      const name = exportName.replace(/(Axis|Keys)$/, '')
      rows.push({ name, keys })
    } catch {
      /* skip — needs args */
    }
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name))
}
