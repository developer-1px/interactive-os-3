export type BlockKind = 'h1' | 'h2' | 'p' | 'list' | 'code'
export interface Block { id: string; kind: BlockKind; text: string }

export const INITIAL: Block[] = [
  { id: 'b1', kind: 'h1',   text: 'DS 커버리지 스윕 결과' },
  { id: 'b2', kind: 'p',    text: '현재 ds로 보편 8장르를 구현하며 커버되는 범위와 갭을 동시에 수집한다.' },
  { id: 'b3', kind: 'h2',   text: '개요' },
  { id: 'b4', kind: 'list', text: '• Inbox · Chat · Commerce\n• CRM · Editor · Feed\n• Analytics · Settings' },
  { id: 'b5', kind: 'h2',   text: '첫 발견' },
  { id: 'b6', kind: 'p',    text: 'registry.ts에 등록되지 않은 부품은 FlatLayout에서 직접 사용 불가.' },
  { id: 'b7', kind: 'code', text: 'const uiRegistry = { Button, Input, ... } // 약 30개만 등록' },
]

export const BLOCK_OPTS: Array<[BlockKind, string]> = [
  ['h1', 'H1'], ['h2', 'H2'], ['p', '문단'], ['list', '리스트'], ['code', '코드'],
]

export const FMT_ACTS = [['tB','굵게','bold','B'],['tI','기울임','italic','I'],['tU','밑줄','underline','U']] as const
