/** VideoEdit 페이지 — 반복되는 form node 빌더 helper 묶음. */

export type NodeMap = Record<string, { id: string; data: Record<string, unknown> }>
export type RelMap = Record<string, string[]>

export function fieldNode(
  key: string, label: string, required: boolean,
  control: Record<string, unknown>, description?: string,
): NodeMap {
  const out: NodeMap = {
    [`f-${key}`]: { id: `f-${key}`, data: { type: 'Ui', component: 'Field', props: { required } } },
    [`fl-${key}`]: { id: `fl-${key}`, data: { type: 'Ui', component: 'FieldLabel', content: label } },
    [`fc-${key}`]: { id: `fc-${key}`, data: control },
  }
  if (description) {
    out[`fd-${key}`] = { id: `fd-${key}`, data: { type: 'Ui', component: 'FieldDescription', content: description } }
  }
  return out
}

export function checkboxRows<K extends string>(
  prefix: string,
  state: Record<K, boolean>,
  setter: (next: Record<K, boolean>) => void,
  labels: Record<K, string>,
): NodeMap {
  const out: NodeMap = {}
  for (const k of Object.keys(state) as K[]) {
    out[`${prefix}-row-${k}`] = { id: `${prefix}-row-${k}`, data: { type: 'Row', flow: 'cluster' } }
    out[`${prefix}-cb-${k}`] = {
      id: `${prefix}-cb-${k}`,
      data: {
        type: 'Ui', component: 'Checkbox',
        props: {
          checked: state[k],
          onClick: () => setter({ ...state, [k]: !state[k] }),
          'aria-label': labels[k],
        },
      },
    }
    out[`${prefix}-lbl-${k}`] = { id: `${prefix}-lbl-${k}`, data: { type: 'Text', variant: 'body', content: labels[k] } }
  }
  return out
}

export function checkboxRels<K extends string>(prefix: string, state: Record<K, boolean>): RelMap {
  const out: RelMap = {}
  for (const k of Object.keys(state)) {
    out[`${prefix}-row-${k}`] = [`${prefix}-cb-${k}`, `${prefix}-lbl-${k}`]
  }
  return out
}

export function tagChipNodes(prefix: string, items: string[], onRemove: (t: string) => void): NodeMap {
  const out: NodeMap = {}
  for (const t of items) {
    // parts/Tag — span[data-part="tag"] + optional × remove. label/onRemove 데이터 주도.
    out[`${prefix}-chip-${t}`] = {
      id: `${prefix}-chip-${t}`,
      data: {
        type: 'Ui', component: 'Tag',
        props: { label: t, onRemove: () => onRemove(t), removeLabel: `${t} 제거` },
      },
    }
  }
  return out
}

export function tagChipRels(): RelMap {
  // Tag는 leaf — relationships 없음.
  return {}
}

export function visibilityRows(
  state: { online: boolean; roleMain: boolean; certMain: boolean },
  setter: (next: typeof state) => void,
): NodeMap {
  const labels: Record<keyof typeof state, string> = {
    online: '온라인교육 노출', roleMain: '메인 역할 코스 노출', certMain: '메인 자격증 코스 노출',
  }
  const out: NodeMap = {}
  for (const k of Object.keys(state) as (keyof typeof state)[]) {
    out[`vis-row-${k}`] = { id: `vis-row-${k}`, data: { type: 'Row', flow: 'cluster' } }
    out[`vis-sw-${k}`] = {
      id: `vis-sw-${k}`,
      data: {
        type: 'Ui', component: 'Switch',
        props: { checked: state[k], onClick: () => setter({ ...state, [k]: !state[k] }), 'aria-label': labels[k] },
      },
    }
    out[`vis-lbl-${k}`] = { id: `vis-lbl-${k}`, data: { type: 'Text', variant: 'body', content: labels[k] } }
  }
  return out
}

export function visibilityRels(state: { online: boolean; roleMain: boolean; certMain: boolean }): RelMap {
  const out: RelMap = {}
  for (const k of Object.keys(state)) {
    out[`vis-row-${k}`] = [`vis-sw-${k}`, `vis-lbl-${k}`]
  }
  return out
}
