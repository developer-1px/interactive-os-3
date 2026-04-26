/** /keyboard 페이지 — 공용 샘플 데이터 + ControlState 훅. */
import { fromList, fromTree, useControlState } from '@p/ds'

export const sampleTree = [
  { id: 'eng', label: '엔지니어링', kids: [
    { id: 'fe', label: '프론트엔드' },
    { id: 'be', label: '백엔드' },
    { id: 'ops', label: 'DevOps' },
  ]},
  { id: 'des', label: '디자인', kids: [
    { id: 'sys', label: '디자인 시스템' },
    { id: 'prod', label: '프로덕트' },
  ]},
]

export const sampleList = [
  { id: 'apple', label: '사과' },
  { id: 'banana', label: '바나나' },
  { id: 'cherry', label: '체리' },
  { id: 'durian', label: '두리안' },
  { id: 'elderberry', label: '엘더베리' },
]

export const toData = (n: { id: string; label: string }) => ({ label: n.label })
export const getId = (n: { id: string }) => n.id
export const getKids = (n: { kids?: unknown[] }) => n.kids as never

export function useTreeData(expandedIds: string[] = ['eng'], focusId: string | null = 'fe') {
  const base = fromTree(sampleTree, { getId, getKids, toData, expandedIds, focusId })
  return useControlState(base)
}
export function useListData(focusId: string | null = 'apple') {
  const base = fromList(sampleList, { getId, toData, focusId })
  return useControlState(base)
}
