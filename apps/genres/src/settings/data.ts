export type SectionId = 'profile' | 'account' | 'notification' | 'billing' | 'danger'
export type Digest = 'daily' | 'weekly' | 'off'

export const SECTIONS: Array<[SectionId, string]> = [
  ['profile', '프로필'], ['account', '계정'], ['notification', '알림'],
  ['billing', '결제'], ['danger', '위험 구역'],
]

export const sectionLabel = (s: SectionId) => SECTIONS.find(([id]) => id === s)?.[1] ?? ''

export const DIGEST_OPTS: Array<[Digest, string]> = [
  ['daily', '매일'], ['weekly', '매주'], ['off', '받지 않음'],
]

/**
 * Form-field 행: 좌측 라벨/설명 + 우측 컨트롤.
 *
 * 의미(group=Field) + 레이아웃(Row/Column)을 분리한다.
 *  - `id`        — Field (role=group, data-part=field)
 *  - `${id}Row`  — Row(flow=split) 가로 분배
 *  - `${id}L`    — 좌측 Column(flow=list)
 *  - `${id}Lbl`  — FieldLabel (semantic label, strong 대체)
 *  - `${id}Desc` — FieldDescription (semantic desc, Text.small 대체)
 *  - control     — Row 의 우측 자식 (소비자가 별도 entity로 주입 후 splitRowRels 로 연결)
 */
export const splitRow = (id: string, lbl: string, desc: string) => ({
  [id]:          { id,                data: { type: 'Ui', component: 'Field' } },
  [`${id}Row`]:  { id: `${id}Row`,    data: { type: 'Row', flow: 'split' } },
  [`${id}L`]:    { id: `${id}L`,      data: { type: 'Column', flow: 'list', grow: true } },
  [`${id}Lbl`]:  { id: `${id}Lbl`,    data: { type: 'Ui', component: 'FieldLabel', content: lbl } },
  [`${id}Desc`]: { id: `${id}Desc`,   data: { type: 'Ui', component: 'FieldDescription', content: desc } },
})

export const splitRowRels = (id: string, ctrl: string) => ({
  [id]:         [`${id}Row`],
  [`${id}Row`]: [`${id}L`, ctrl],
  [`${id}L`]:   [`${id}Lbl`, `${id}Desc`],
})
