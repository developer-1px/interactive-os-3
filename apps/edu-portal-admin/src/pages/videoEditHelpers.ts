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

export function tagChipNodes(prefix: string, items: string[], onRemove: (t: string) => void): NodeMap {
  const out: NodeMap = {}
  for (const t of items) {
    out[`${prefix}-chip-${t}`] = {
      id: `${prefix}-chip-${t}`,
      data: {
        type: 'Ui', component: 'Chip',
        props: { label: t, onRemove: () => onRemove(t), removeLabel: `${t} 제거` },
      },
    }
  }
  return out
}

export function tagChipRels(): RelMap {
  return {}
}
