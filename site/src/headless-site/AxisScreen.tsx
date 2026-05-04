import { useState } from 'react'
import type { AxisEntry } from './axisRegistry'
import { slugForAxis } from './axisRegistry'

/**
 * 한 axis 의 화면 — 좌측에 그 axis 를 쓰는 pattern 목록(탭 전환), 우측에 선택된 pattern 의 raw 소스.
 *
 * recipe 가 SSOT — `packages/headless/src/patterns/<name>.ts` 를 ?raw 로 그대로 노출한다.
 * 화면이 하는 일: "이 axis 는 다음 패턴들의 useXXXPattern 안에서 이렇게 쓰인다" 를 코드로 입증.
 */
export function AxisScreen({
  entry,
  index,
  total,
}: {
  entry: AxisEntry
  index: number
  total: number
}) {
  const [selected, setSelected] = useState(entry.patterns[0]?.name)
  const slug = slugForAxis(entry.axis)
  const current = entry.patterns.find((p) => p.name === selected) ?? entry.patterns[0]

  return (
    <section id={slug} tabIndex={-1} className="snap-start h-screen flex flex-col">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-2 border-b border-stone-200 bg-white px-8 py-4 pr-32">
        <span className="rounded-md bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-900 ring-1 ring-inset ring-stone-300">
          Axis
        </span>
        <h2 className="font-mono text-xl font-bold text-stone-900">{entry.axis}</h2>
        <p className="text-sm text-stone-600">
          {entry.patterns.length} pattern{entry.patterns.length === 1 ? '' : 's'} use this axis
        </p>
        <a
          href={`#${slug}`}
          className="ml-auto text-xs font-mono text-stone-400 hover:text-stone-700"
          title="Permalink"
        >
          #{slug}
        </a>
        <span className="text-xs font-mono text-stone-400">
          {index + 1} / {total}
        </span>
      </header>

      <div className="grid flex-1 grid-cols-[220px_1fr] overflow-hidden">
        <nav
          aria-label={`${entry.axis} consumers`}
          className="flex flex-col gap-0.5 overflow-auto border-r border-stone-200 bg-stone-50 p-2"
        >
          <h3 className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Patterns
          </h3>
          {entry.patterns.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setSelected(p.name)}
              className={`rounded px-2 py-1 text-left text-sm font-mono ${
                p.name === current?.name
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {p.name}.ts
            </button>
          ))}
        </nav>

        <div className="flex flex-col overflow-hidden bg-stone-950">
          <div className="flex items-center justify-between border-b border-stone-800 px-4 py-2">
            <code className="text-xs font-mono text-stone-400">
              packages/headless/src/patterns/{current?.name}.ts
            </code>
            <CopyButton text={current?.source ?? ''} />
          </div>
          <pre className="flex-1 overflow-auto p-4 text-xs leading-relaxed text-stone-100 font-mono">
            <code>{current?.source}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}

function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('failed')
    }
  }
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-live="polite" className="text-[10px] text-stone-500">
        {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : ''}
      </span>
      <button
        type="button"
        onClick={handle}
        className="rounded border border-stone-700 bg-stone-800 px-2 py-0.5 text-xs text-stone-300 hover:bg-stone-700"
      >
        Copy
      </button>
    </span>
  )
}
