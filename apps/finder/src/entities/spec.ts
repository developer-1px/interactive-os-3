/** finder.spec — Single Source of Truth.
 *
 *  요구사항(자연어) ↔ 코드(zod·reducer·view) 1:1 매핑의 정본.
 *  state·cmds·invariants·view 4슬롯이 spec 객체 1개에 모인다.
 *  schema.ts 의 zod 와 feature.ts 의 reducer 는 이 spec 에서 파생된다.
 *
 *  변경 규칙:
 *  - cmd 추가/삭제 → on 핸들러 동시 변경 (satisfies 가 강제)
 *  - state 추가 → initial 갱신 (zod parse 가 검증)
 *  - invariant 추가 → invariants.test.ts 행 추가
 *  - view 출력 추가 → viewFn 반환 키 동시 변경
 */
import { z } from 'zod'
import { ViewModeSchema } from './schema'

// ── State ────────────────────────────────────────────────────────────────
export const FinderStateSpec = {
  url:    { desc: '현재 선택된 항목 경로 (URL과 동기)',    schema: z.string() },
  pinned: { desc: '사이드바가 고정한 컬럼 루트',           schema: z.string() },
  mode:   { desc: '보기 모드 (icons·list·columns·gallery)', schema: ViewModeSchema },
  query:  { desc: '검색어',                                 schema: z.string() },
} as const

// ── Cmds ─────────────────────────────────────────────────────────────────
/** 각 cmd 는 desc(왜) + effect(state 전이 식) + payload(zod) 를 1행으로 묶는다. */
export const FinderCmdSpec = {
  goto: {
    desc:    'URL 직접 이동 (주소창·라우터·딥링크)',
    effect:  'url ← to',
    payload: z.object({ to: z.string() }),
  },
  pinFav: {
    desc:    '사이드바 클릭 = "이 항목을 루트로 본다"',
    effect:  'pinned·url ← id (동시 이동)',
    payload: z.object({ id: z.string() }),
  },
  setMode: {
    desc:    '툴바 보기 모드 토글',
    effect:  'mode ← mode',
    payload: z.object({ mode: ViewModeSchema }),
  },
  setQuery: {
    desc:    '타이틀바 검색어 입력',
    effect:  'query ← q',
    payload: z.object({ q: z.string() }),
  },
  activateCol: {
    desc:    '컬럼 항목 단독 활성화 (pinned 유지)',
    effect:  'url ← id',
    payload: z.object({ id: z.string() }),
  },
  activateRec: {
    desc:    'recent 그룹 활성화 = pinFav 동의어',
    effect:  'pinned·url ← id',
    payload: z.object({ id: z.string() }),
  },
  expandCol: {
    desc:    '컬럼 펼침/접기',
    effect:  'url ← open ? id : parent(id)',
    payload: z.object({ id: z.string(), open: z.boolean() }),
  },
  back: {
    desc:    '한 단계 위로',
    effect:  'url ← walk(url)[-2] ?? "/"',
    payload: z.object({}),
  },
} as const

// ── Invariants (불변식) ──────────────────────────────────────────────────
/** 배열 인덱스가 invariants.test.ts 의 테스트 순서와 1:1. */
export const FinderInvariants = [
  'pinned 가 tag path (/_tag/*) 면 columns 는 frontmatter 인덱스 기반 flat file list',
  'focusId 가 어떤 항목과도 매칭되지 않으면 첫 항목으로 fallback (Tab 진입 보호)',
  'tree 미로드 시 columns·preview 는 empty',
  'isFilePath && isImagePath → preview.kind = image',
  'isFilePath && !isImagePath → preview.kind = text',
  'dir → preview.kind = dir, 그 외 → empty',
  'pinFav·activateRec 는 url 과 pinned 를 동시에 같은 값으로 옮긴다',
  'activateCol 은 url 만 옮기고 pinned 는 보존한다',
] as const

// ── View 출력 contract ──────────────────────────────────────────────────
/** viewFn 반환 객체의 키와 1:1. 누락 시 viewFn 타입 에러. */
export const FinderViewSpec = {
  titlebar: '{ path, mode, query, busy: text|image loading }',
  toolbar:  'VIEW_MODES 4개 토글, pressed = current mode',
  sidebar:  '{ recent, fav, tags } — 모두 pinned 기준 selected',
  columns:  'pinned 이 tag → flat file list / 아니면 walk(pinned).children, focusId=url, expandedIds=ancestors(url)',
  preview:  'walk(url).at(-1) → kind 분기 (empty·dir·image·text)',
} as const

// ── 파생 타입 ────────────────────────────────────────────────────────────
export type FinderCmdType = keyof typeof FinderCmdSpec
export type FinderViewKey = keyof typeof FinderViewSpec
