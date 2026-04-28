export type Stage = '신규' | '검증' | '제안' | '협상' | '성사' | '실패'
export interface Contact { id: string; name: string; company: string; email: string; stage: Stage; value: number; owner: string; updatedAt: string }

export const CONTACTS: Contact[] = [
  { id: 'c1', name: '김지훈', company: '네이버',       email: 'jihoon@naver.com',  stage: '신규', value: 500,  owner: '박수진', updatedAt: '04-22' },
  { id: 'c2', name: '이소라', company: '카카오',       email: 'sora@kakao.com',    stage: '검증', value: 1200, owner: '박수진', updatedAt: '04-22' },
  { id: 'c3', name: '박민수', company: 'Toss',         email: 'ms@toss.im',        stage: '제안', value: 3400, owner: '이재혁', updatedAt: '04-21' },
  { id: 'c4', name: '최유리', company: 'Coupang',      email: 'yuri@coupang.com',  stage: '협상', value: 8900, owner: '이재혁', updatedAt: '04-20' },
  { id: 'c5', name: '정현우', company: '우아한형제들', email: 'hw@woowahan.com',   stage: '성사', value: 2100, owner: '박수진', updatedAt: '04-19' },
  { id: 'c6', name: '강다은', company: 'Line',         email: 'daeun@line.me',     stage: '실패', value: 800,  owner: '이재혁', updatedAt: '04-18' },
  { id: 'c7', name: '조성민', company: 'SKT',          email: 'sm@sktelecom.com',  stage: '신규', value: 4500, owner: '박수진', updatedAt: '04-22' },
  { id: 'c8', name: '윤세아', company: 'LG CNS',       email: 'sea@lgcns.com',     stage: '검증', value: 1800, owner: '이재혁', updatedAt: '04-21' },
  { id: 'c9', name: '한지우', company: 'Samsung SDS',  email: 'jw@samsungsds.com', stage: '제안', value: 6200, owner: '박수진', updatedAt: '04-20' },
  { id: 'c10',name: '문재호', company: 'KT',           email: 'jh@kt.com',         stage: '협상', value: 3100, owner: '이재혁', updatedAt: '04-19' },
]

export const stageTone = (s: Stage) =>
  s === '성사' ? 'success' : s === '실패' ? 'danger' : s === '협상' ? 'warning' : s === '제안' ? 'info' : 'default'

export const HEADS = ['', '이름', '회사', '이메일', '단계', '가치($)', '담당', '업데이트']
export const BULK_ACTS = [['bAssign','담당자 변경','user'],['bStage','단계 이동','move'],['bExport','내보내기','download'],['bDelete','삭제','trash']] as const
