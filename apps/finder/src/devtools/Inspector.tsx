/** finder.devtools.Inspector — spec.ts (zod SSoT) 시각화.
 *
 *  레이아웃은 FlatLayout (definePage + Renderer) — Section·Grid·Header 가 정본.
 *  콘텐츠 (Card 카드·Table 행·Form 입력) 는 props 로 ReactNode 전달. */

import { useMemo, useReducer, useState, type ReactNode } from 'react'
import { z } from 'zod'
import {
  FinderStateSpec, FinderCmdSpec, FinderViewSpec,
  type FinderCmdType,
} from '../entities/spec'
import type { FinderState, FinderCmd } from '../entities/schema'
import { finderFeature } from '../features/feature'
import { runChecks } from './checks'
import { describe, shapeOf, defaultValue, labelOf, type FieldKind } from './zodIntrospect'
import { Renderer, definePage, ROOT, type NormalizedData } from '@p/ds'
import { Card, KeyValue, Code, Tag, Callout, Heading } from '@p/ds/parts'

const initial: FinderState = { url: '/', pinned: '/', mode: 'columns', query: '' }

const reducer = (s: FinderState, c: FinderCmd): FinderState =>
  finderFeature.on[c.type](s as never, c as never) as FinderState

type FormValues = Record<string, unknown>

const initialForms = (): Record<FinderCmdType, FormValues> => {
  const out = {} as Record<FinderCmdType, FormValues>
  for (const type of Object.keys(FinderCmdSpec) as FinderCmdType[]) {
    out[type] = Object.fromEntries(
      Object.entries(shapeOf(FinderCmdSpec[type].payload)).map(([k, v]) => [k, defaultValue(v)]),
    )
  }
  return out
}

interface DispatchError { type: FinderCmdType; message: string }

const STATE_COLS = [
  { key: 'name',  label: 'key' },
  { key: 'desc',  label: 'desc' },
  { key: 'type',  label: 'zod type' },
  { key: 'value', label: '현재 값' },
]
const INV_COLS = [
  { key: 'idx',    label: '#' },
  { key: 'spec',   label: 'spec' },
  { key: 'pass',   label: '결과' },
  { key: 'detail', label: 'detail' },
]
const VIEW_COLS = [
  { key: 'name',     label: 'key' },
  { key: 'contract', label: 'contract (prose)' },
  { key: 'live',     label: '라이브 출력 (mock query)' },
]

export function FinderInspector() {
  const [state, dispatch] = useReducer(reducer, initial)
  const [forms, setForms] = useState<Record<FinderCmdType, FormValues>>(initialForms)
  const [error, setError] = useState<DispatchError | null>(null)

  const checks = runChecks(state)
  const passed = checks.filter((c) => c.pass).length

  const view = useMemo(() => {
    const empty = { data: undefined, isLoading: false, error: null } as never
    return finderFeature.view(state, { tree: empty, text: empty, image: empty } as never)
  }, [state])

  const onField = (type: FinderCmdType, key: string, value: unknown) => {
    setForms((prev) => ({ ...prev, [type]: { ...prev[type], [key]: value } }))
  }

  const onDispatch = (type: FinderCmdType) => {
    const schema = FinderCmdSpec[type].payload.extend({ type: z.literal(type) })
    const result = schema.safeParse({ ...forms[type], type })
    if (!result.success) {
      const msg = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' / ')
      setError({ type, message: msg })
      return
    }
    setError(null)
    dispatch(result.data as FinderCmd)
  }

  const stateRows = Object.entries(FinderStateSpec).map(([k, v]) => ({
    name:  <Code>{k}</Code>,
    desc:  v.desc,
    type:  <Code>{labelOf(describe(v.schema))}</Code>,
    value: <Code>{JSON.stringify(state[k as keyof FinderState])}</Code>,
  }))

  const invRows = checks.map((c) => ({
    idx:    <Code>{String(c.index)}</Code>,
    spec:   c.spec,
    pass:   <span data-icon={c.pass ? 'check' : 'x'} data-tone={c.pass ? 'success' : 'danger'} aria-label={c.pass ? 'pass' : 'fail'} />,
    detail: <Code>{c.detail}</Code>,
  }))

  const viewRows = Object.entries(FinderViewSpec).map(([k, contract]) => ({
    name:     <Code>{k}</Code>,
    contract,
    live: (
      <details>
        <summary>펼침</summary>
        <Code><pre>{safeStringify((view as Record<string, unknown>)[k])}</pre></Code>
      </details>
    ),
  }))

  const cmdEntries = Object.entries(FinderCmdSpec) as [FinderCmdType, typeof FinderCmdSpec[FinderCmdType]][]
  const cmdCardEntities = Object.fromEntries(cmdEntries.map(([type, def]) => {
    const fields = Object.entries(shapeOf(def.payload))
    const slots = {
      title: <Heading level="h3"><Code>{type}</Code></Heading>,
      meta:  def.desc,
      body: (
        <KeyValue items={[
          { key: 'effect', value: <Code>{def.effect}</Code> },
          ...(fields.length === 0
            ? [{ key: 'payload', value: <Tag label="no payload" /> }]
            : fields.map(([k, fk]) => ({
                key:   <span><Code>{k}</Code> <Tag label={labelOf(fk)} /></span>,
                value: <FieldInput field={fk} value={forms[type][k]} onChange={(v) => onField(type, k, v)} />,
              }))
          ),
        ]} />
      ),
      footer: (
        <button type="button" onClick={() => onDispatch(type)} data-action="dispatch">
          Dispatch
        </button>
      ),
    }
    return [`cmd-${type}`, { id: `cmd-${type}`, data: { type: 'Ui' as const, component: 'Card' as const, props: { slots } } }]
  }))

  const schemaItems = (Object.entries(FinderCmdSpec) as [FinderCmdType, typeof FinderCmdSpec[FinderCmdType]][]).map(([type, def]) => ({
    key:   <Code>{type}</Code>,
    value: <Code>{`{ type: literal("${type}"), ${Object.entries(shapeOf(def.payload)).map(([k, v]) => `${k}: ${labelOf(v)}`).join(', ')} }`}</Code>,
  }))

  const page: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Column', flow: 'prose', label: 'Finder Spec Inspector' } },

      // Header: title + intro callout
      intro:      { id: 'intro',      data: { type: 'Column', flow: 'list' } },
      introTitle: { id: 'introTitle', data: { type: 'Text', variant: 'h1', content: 'Finder · Spec Inspector' } },
      introBody:  { id: 'introBody',  data: { type: 'Ui', component: 'Block', content: (
        <Callout tone="info">
          이 페이지는 <Code>apps/finder/src/entities/spec.ts</Code> (SSoT) 의 zod 객체를 런타임 introspect 해서
          State·Cmds·Invariants·View 4슬롯을 그립니다. spec 을 한 줄 바꾸면 이 inspector 가 그대로 따라옵니다.
          state 는 sample reducer 로 조작 — 실제 라우트와 무관.
        </Callout>
      ) } },

      // State section
      stateSec: { id: 'stateSec', data: { type: 'Section', heading: { content: `State · ${Object.keys(FinderStateSpec).length} slots` }, flow: 'list' } },
      stateTbl: { id: 'stateTbl', data: { type: 'Ui', component: 'Table', props: { columns: STATE_COLS, rows: stateRows, 'aria-label': 'Finder state' } } },

      // Cmds section
      cmdsSec:  { id: 'cmdsSec',  data: { type: 'Section', heading: { content: `Cmds · ${Object.keys(FinderCmdSpec).length} commands` }, flow: 'form' } },
      cmdsErr:  { id: 'cmdsErr',  data: {
        type: 'Ui', component: 'Block',
        content: error ? <Callout tone="danger"><Code>{error.type}</Code> dispatch 실패: {error.message}</Callout> : null,
        hidden: !error,
      } },
      cmdsGrid: { id: 'cmdsGrid', data: { type: 'Grid', cols: 2, flow: 'cluster' } },
      ...cmdCardEntities,

      // Invariants section
      invSec:  { id: 'invSec',  data: { type: 'Section', heading: { content: `Invariants · ${passed} / ${checks.length} pass` }, flow: 'list' } },
      invTbl:  { id: 'invTbl',  data: { type: 'Ui', component: 'Table', props: { columns: INV_COLS, rows: invRows, 'aria-label': 'invariant checks' } } },
      invNote: { id: 'invNote', data: { type: 'Ui', component: 'Block', content: (
        <Callout tone="info">
          invariants 의 자연어 행과 <Code>devtools/checks.ts</Code> predicate 배열은 인덱스 1:1.
          길이 mismatch 시 자동 경고.
        </Callout>
      ) } },

      // View output section
      viewSec: { id: 'viewSec', data: { type: 'Section', heading: { content: `View output · ${Object.keys(FinderViewSpec).length} slots` }, flow: 'list' } },
      viewTbl: { id: 'viewTbl', data: { type: 'Ui', component: 'Table', props: { columns: VIEW_COLS, rows: viewRows, 'aria-label': 'view contract' } } },

      // Schema dump section
      schemaSec:  { id: 'schemaSec',  data: { type: 'Section', heading: { content: 'Schema dump' }, flow: 'list' } },
      schemaNote: { id: 'schemaNote', data: { type: 'Ui', component: 'Block', content: (
        <Callout tone="info">
          FinderCmdSchema 는 <Code>type</Code> 으로 분기되는 discriminatedUnion. 멤버는 위 Cmds 와 1:1.
        </Callout>
      ) } },
      schemaKv:   { id: 'schemaKv',   data: { type: 'Ui', component: 'Block', content: <KeyValue items={schemaItems} /> } },
    },
    relationships: {
      [ROOT]:    ['page'],
      page:      ['intro', 'stateSec', 'cmdsSec', 'invSec', 'viewSec', 'schemaSec'],
      intro:     ['introTitle', 'introBody'],
      stateSec:  ['stateTbl'],
      cmdsSec:   ['cmdsErr', 'cmdsGrid'],
      cmdsGrid:  cmdEntries.map(([type]) => `cmd-${type}`),
      invSec:    ['invTbl', 'invNote'],
      viewSec:   ['viewTbl'],
      schemaSec: ['schemaNote', 'schemaKv'],
    },
  }

  return <Renderer page={definePage(page)} />
}

interface FieldInputProps {
  field: FieldKind
  value: unknown
  onChange: (v: unknown) => void
}

function FieldInput({ field, value, onChange }: FieldInputProps): ReactNode {
  switch (field.kind) {
    case 'string':
      return <input type="text" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
    case 'number':
      return <input type="number" value={(value as number) ?? 0} onChange={(e) => onChange(Number(e.target.value))} />
    case 'boolean':
      return <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
    case 'enum':
      return (
        <select value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)}>
          {field.values.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      )
    case 'literal':
      return <Code>{JSON.stringify(field.values[0])}</Code>
    case 'nullable':
      return <FieldInput field={field.inner} value={value} onChange={onChange} />
    case 'optional':
      return <FieldInput field={field.inner} value={value} onChange={onChange} />
    case 'object':
      return <Code>{JSON.stringify(value)}</Code>
    default:
      return <Code>{labelOf(field)}</Code>
  }
}

function safeStringify(v: unknown): string {
  try {
    return JSON.stringify(v, (_k, val) => {
      if (typeof val === 'function') return '[fn]'
      if (val instanceof Error) return val.message
      return val
    }, 2)
  } catch {
    return String(v)
  }
}
