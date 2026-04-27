/**
 * StateShowcase — foundations/state 토큰을 ds parts(Card·Heading·Tag·Code·RovingItem)
 * 어휘로 조립.
 *
 * 새 시각/CSS 없음. RovingItem 이 row 시각 셸을 담당하고, state 토큰의 css 블록은
 * 카드 scope(`#d-<name>`) 내에서만 적용되도록 selector prefix 를 주입한다 — 기존
 * demoRenderers.SelectorDemo 와 동일한 스코프 트릭.
 */
import type { ReactNode } from 'react'
import type { DemoSpec, FoundationExport } from 'virtual:ds-audit'
import * as foundations from '@p/ds/tokens/foundations'
import { Card, Heading, Tag, Code, RovingItem } from '@p/ds/ui/parts'

const FN = foundations as unknown as Record<string, (...args: unknown[]) => string>

// foundations/state/<file>.triggers.ts 자동 수집 — canvas 측 하드코딩 ❌
const triggerModules = import.meta.glob<{ default: Record<string, string> }>(
  '@p/ds/tokens/foundations/state/*.triggers.ts',
  { eager: true },
)
const TRIGGER: Record<string, string> = (() => {
  const out: Record<string, string> = {}
  for (const mod of Object.values(triggerModules)) Object.assign(out, mod.default)
  return out
})()

const ORDER = Object.keys(TRIGGER)

function callFn(fn: string, args: DemoSpec['args']): string {
  const f = FN[fn]
  if (typeof f !== 'function') return ''
  try { return f(...args) } catch { return '' }
}

function row(label: string, aria?: Record<string, string | boolean>): ReactNode {
  return (
    <li role="option" tabIndex={-1} {...aria}>
      <RovingItem
        slots={{
          icon: <span data-icon="circle" aria-hidden="true" />,
          content: <span>{label}</span>,
          tail: <Code>li</Code>,
        }}
      />
    </li>
  )
}

function ListSample(): ReactNode {
  return (
    <ul role="listbox" data-demo="sample-list">
      {row('row a')}
      {row('row b (selected)', { 'aria-selected': 'true' })}
      {row('row c (disabled)', { 'aria-disabled': 'true' })}
    </ul>
  )
}

function ButtonSample(): ReactNode {
  return <button type="button" data-demo="focus-trigger">sample</button>
}

function StateCard({ e }: { e: FoundationExport }): ReactNode {
  if (!e.demo) return null
  const id = `d-${e.name}`
  const css = callFn(e.demo.fn, e.demo.args)
  const isButton = String(e.demo.args[0] ?? '').includes('button')

  return (
    <Card
      slots={{
        title: <Heading level={4}>{e.name}</Heading>,
        meta: TRIGGER[e.name] ? <Tag label={TRIGGER[e.name]} /> : undefined,
        body: (
          <div id={id} data-demo="scoped">
            <style>{css.replace(/:where\(/g, `:where(#${id} `)}</style>
            {isButton ? <ButtonSample /> : <ListSample />}
          </div>
        ),
        footer: <Code>{`${e.name}('${e.demo.args[0] ?? 'li'}')`}</Code>,
      }}
    />
  )
}

export function StateShowcase({ exports }: { exports: FoundationExport[] }): ReactNode {
  const sorted = [...exports].sort((a, b) => {
    const ai = ORDER.indexOf(a.name); const bi = ORDER.indexOf(b.name)
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi)
  })
  return (
    <div data-part="canvas-state-grid">
      {sorted.map((e) => <StateCard key={e.name + e.file} e={e} />)}
    </div>
  )
}
