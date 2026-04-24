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

export const splitRow = (id: string, lbl: string, desc: string) => ({
  [`${id}`]:     { id, data: { type: 'Row', flow: 'split' } },
  [`${id}L`]:    { id: `${id}L`,    data: { type: 'Column', flow: 'list', grow: true } },
  [`${id}Lbl`]:  { id: `${id}Lbl`,  data: { type: 'Text', variant: 'strong', content: lbl } },
  [`${id}Desc`]: { id: `${id}Desc`, data: { type: 'Text', variant: 'small', content: desc } },
})

export const splitRowRels = (id: string, ctrl: string) => ({
  [id]: [`${id}L`, ctrl],
  [`${id}L`]: [`${id}Lbl`, `${id}Desc`],
})
