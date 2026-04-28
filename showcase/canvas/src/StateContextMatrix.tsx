/**
 * StateContextMatrix — state 가 적용되는 모든 role/context 를 가로 행으로 전수 나열.
 *
 * SSoT: packages/ds/src/tokens/internal/states/selectors.ts
 *
 * 행: role/context · 열: variant(rest · selected/checked · disabled).
 * 같은 variant 가 세로로 정렬돼 맥락별 차이가 한눈에 비교된다.
 *
 * 새 시각/CSS 없음. parts(Code·Chip) + 진짜 ARIA role 마크업 + 단일 grid wrapper.
 */
import type { ReactNode } from 'react'
import { Code, Chip } from '@p/ds/ui/parts'
import { Switch } from '@p/ds/ui/2-action/Switch'
import { Checkbox } from '@p/ds/ui/3-input/Checkbox'

type Layer = 'rovingItem.subgrid' | 'rovingItem.flex' | 'rovingItem.table' | 'rovingItem.form' | 'control' | 'widget'

type Spec = {
  role: string
  layer: Layer
  rest: ReactNode
  selected: ReactNode      // selected · current · checked · pressed · sort 등 "활성"
  disabled: ReactNode
}

// rovingItem.subgrid 는 보통 부모 role 안의 li. 한 행에 li 하나만 wrap.
const opt = (label: string, attrs?: Record<string, string>) => (
  <ul role="listbox" data-demo="sample-list">
    <li role="option" tabIndex={-1} {...attrs}>{label}</li>
  </ul>
)
const menuitem = (label: string, attrs?: Record<string, string>) => (
  <ul role="menu" data-demo="sample-list">
    <li role="menuitem" tabIndex={-1} {...attrs}>{label}</li>
  </ul>
)
const menucheckbox = (label: string, checked: 'true' | 'false', extra?: Record<string, string>) => (
  <ul role="menu" data-demo="sample-list">
    <li role="menuitemcheckbox" tabIndex={-1} aria-checked={checked} {...extra}>{label}</li>
  </ul>
)
const menuradio = (label: string, checked: 'true' | 'false', extra?: Record<string, string>) => (
  <ul role="menu" data-demo="sample-list">
    <li role="menuitemradio" tabIndex={-1} aria-checked={checked} {...extra}>{label}</li>
  </ul>
)
const treeitem = (label: string, attrs?: Record<string, string>) => (
  <ul role="tree" data-demo="sample-list">
    <li role="treeitem" tabIndex={-1} {...attrs}>{label}</li>
  </ul>
)

const CONTEXTS: Spec[] = [
  {
    role: '[role="option"]',
    layer: 'rovingItem.subgrid',
    rest: opt('Inbox'),
    selected: opt('Inbox', { 'aria-selected': 'true' }),
    disabled: opt('Inbox', { 'aria-disabled': 'true' }),
  },
  {
    role: '[role="menuitem"]',
    layer: 'rovingItem.subgrid',
    rest: menuitem('Save'),
    selected: menuitem('Save', { 'aria-current': 'true' }),
    disabled: menuitem('Save', { 'aria-disabled': 'true' }),
  },
  {
    role: '[role="menuitemcheckbox"]',
    layer: 'rovingItem.subgrid',
    rest: menucheckbox('Wrap lines', 'false'),
    selected: menucheckbox('Wrap lines', 'true'),
    disabled: menucheckbox('Wrap lines', 'false', { 'aria-disabled': 'true' }),
  },
  {
    role: '[role="menuitemradio"]',
    layer: 'rovingItem.subgrid',
    rest: menuradio('Compact', 'false'),
    selected: menuradio('Compact', 'true'),
    disabled: menuradio('Compact', 'false', { 'aria-disabled': 'true' }),
  },
  {
    role: '[role="treeitem"]',
    layer: 'rovingItem.subgrid',
    rest: treeitem('/src'),
    selected: treeitem('/src', { 'aria-selected': 'true' }),
    disabled: treeitem('/src', { 'aria-disabled': 'true' }),
  },
  {
    role: '[role="tab"]',
    layer: 'rovingItem.flex',
    rest: <div role="tablist"><button role="tab" type="button" aria-selected="false">Overview</button></div>,
    selected: <div role="tablist"><button role="tab" type="button" aria-selected="true">Overview</button></div>,
    disabled: <div role="tablist"><button role="tab" type="button" aria-selected="false" disabled>Overview</button></div>,
  },
  {
    role: '[role="toolbar"] > button',
    layer: 'rovingItem.flex',
    rest: <div role="toolbar"><button type="button">Bold</button></div>,
    selected: <div role="toolbar"><button type="button" aria-pressed="true">Bold</button></div>,
    disabled: <div role="toolbar"><button type="button" disabled>Bold</button></div>,
  },
  {
    role: '[role="row"]',
    layer: 'rovingItem.table',
    rest: <div role="grid"><div role="row" style={{ display: 'flex', gap: 8 }}><span role="gridcell">Apr 27</span><span role="gridcell">42</span></div></div>,
    selected: <div role="grid"><div role="row" aria-selected="true" style={{ display: 'flex', gap: 8 }}><span role="gridcell">Apr 27</span><span role="gridcell">42</span></div></div>,
    disabled: <div role="grid"><div role="row" aria-disabled="true" style={{ display: 'flex', gap: 8 }}><span role="gridcell">Apr 27</span><span role="gridcell">42</span></div></div>,
  },
  {
    role: '[role="columnheader"][aria-sort]',
    layer: 'rovingItem.table',
    rest: <div role="grid"><div role="row" style={{ display: 'flex', gap: 8 }}><span role="columnheader" aria-sort="none">Date</span></div></div>,
    selected: <div role="grid"><div role="row" style={{ display: 'flex', gap: 8 }}><span role="columnheader" aria-sort="ascending">Date ↑</span></div></div>,
    disabled: <span data-demo="tbd">—</span>,
  },
  {
    role: '[role="radio"]',
    layer: 'rovingItem.form',
    rest: <div role="radiogroup"><div role="radio" tabIndex={-1} aria-checked="false">Card</div></div>,
    selected: <div role="radiogroup"><div role="radio" tabIndex={-1} aria-checked="true">Card</div></div>,
    disabled: <div role="radiogroup"><div role="radio" tabIndex={-1} aria-checked="false" aria-disabled="true">Card</div></div>,
  },
  {
    role: '<button>',
    layer: 'control',
    rest: <button type="button">Save</button>,
    selected: <button type="button" aria-pressed="true">Save</button>,
    disabled: <button type="button" disabled>Save</button>,
  },
  {
    role: '[role="button"]',
    layer: 'control',
    rest: <span role="button" tabIndex={0}>Save</span>,
    selected: <span role="button" tabIndex={0} aria-pressed="true">Save</span>,
    disabled: <span role="button" aria-disabled="true">Save</span>,
  },
  {
    role: '<input>',
    layer: 'control',
    rest: <input type="text" placeholder="placeholder" />,
    selected: <input type="text" defaultValue="filled" />,
    disabled: <input type="text" disabled defaultValue="disabled" />,
  },
  {
    role: '<select>',
    layer: 'control',
    rest: <select defaultValue="one"><option value="one">One</option><option value="two">Two</option></select>,
    selected: <select defaultValue="two"><option value="one">One</option><option value="two">Two</option></select>,
    disabled: <select disabled><option>—</option></select>,
  },
  {
    role: '<textarea>',
    layer: 'control',
    rest: <textarea rows={2} placeholder="placeholder" />,
    selected: <textarea rows={2} defaultValue="filled" />,
    disabled: <textarea rows={2} disabled defaultValue="disabled" />,
  },
  {
    role: '<a> · [role="link"]',
    layer: 'widget',
    rest: <a href="#x" onClick={(e) => e.preventDefault()}>open</a>,
    selected: <a href="#x" onClick={(e) => e.preventDefault()} aria-current="page">open</a>,
    disabled: <a href="#x" onClick={(e) => e.preventDefault()} aria-disabled="true">open</a>,
  },
  {
    role: '[role="switch"]',
    layer: 'widget',
    rest: <Switch checked={false} />,
    selected: <Switch checked={true} />,
    disabled: <Switch checked={false} disabled />,
  },
  {
    role: '[role="checkbox"]',
    layer: 'widget',
    rest: <Checkbox checked={false} />,
    selected: <Checkbox checked={true} />,
    disabled: <Checkbox checked={false} disabled />,
  },
  {
    role: 'input[type="range"]',
    layer: 'widget',
    rest: <input type="range" min={0} max={100} defaultValue={40} />,
    selected: <input type="range" min={0} max={100} defaultValue={70} />,
    disabled: <input type="range" min={0} max={100} defaultValue={40} disabled />,
  },
]

export function StateContextMatrix(): ReactNode {
  return (
    <div data-part="canvas-state-matrix" role="table" aria-label="State by role / context">
      <div data-row data-head role="row">
        <div role="columnheader">role</div>
        <div role="columnheader">rest</div>
        <div role="columnheader">selected · checked · pressed · current</div>
        <div role="columnheader">disabled</div>
      </div>
      {CONTEXTS.map((c) => (
        <div data-row key={c.role} role="row">
          <div data-cell="role">
            <Code>{c.role}</Code>
            <Chip label={c.layer} />
          </div>
          <div data-cell>{c.rest}</div>
          <div data-cell>{c.selected}</div>
          <div data-cell>{c.disabled}</div>
        </div>
      ))}
    </div>
  )
}
