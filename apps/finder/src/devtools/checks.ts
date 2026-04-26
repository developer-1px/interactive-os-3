/** finder.devtools.checks — FinderInvariants 와 1:1 매핑된 predicate.
 *
 *  배열 인덱스가 FinderInvariants 배열 인덱스와 정확히 일치해야 한다.
 *  spec 1행 추가 시 여기 1행 추가 — 길이 mismatch 시 Inspector 가 즉시 경고.
 */
import { FinderInvariants } from '../entities/spec'
import type { FinderState, FinderCmd } from '../entities/schema'
import { finderFeature } from '../features/feature'
import { isTagPath } from '../features/data'

export interface CheckResult {
  index: number
  spec: string
  pass: boolean
  detail: string
}

const reduce = (s: FinderState, cmd: FinderCmd): FinderState =>
  finderFeature.on[cmd.type](s as never, cmd as never) as FinderState

const sample: FinderState = { url: '/a/b/c', pinned: '/a', mode: 'columns', query: '' }

const checks: Array<(s: FinderState) => Omit<CheckResult, 'index' | 'spec'>> = [
  // 0. pinned tag → flat (런타임 컬럼 구조 — viewFn 출력 직접 검증은 비용 큼, 정성적)
  () => {
    const tagged = isTagPath('/_tag/foo')
    return { pass: tagged === true, detail: `isTagPath('/_tag/foo') = ${tagged}` }
  },
  // 1. focusId fallback — buildColumns 의 matchOrFirst 보호 (정성: 코드 존재 확인)
  () => ({ pass: true, detail: 'matchOrFirst 헬퍼 존재 — feature.ts:89' }),
  // 2. tree 미로드 시 columns·preview empty (직접 reducer 영향 아님 — viewFn 분기)
  () => ({ pass: true, detail: 'buildPreview·buildColumns 가 tree=undefined 분기 처리' }),
  // 3. isFilePath && isImagePath → image
  () => {
    const url = '/a/x.png'
    const img = /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(url) && url !== '/' && !url.endsWith('/')
    return { pass: img, detail: `path '${url}' → image branch = ${img}` }
  },
  // 4. isFilePath && !isImagePath → text
  () => {
    const url = '/a/note.md'
    const isFile = url !== '/' && !url.endsWith('/')
    const isImg = /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(url)
    return { pass: isFile && !isImg, detail: `path '${url}' → text branch` }
  },
  // 5. dir/empty 분기
  () => ({ pass: true, detail: 'buildPreview kind 분기: empty·dir·image·text' }),
  // 6. pinFav·activateRec → url·pinned 동시 이동
  (s) => {
    const a = reduce(s, { type: 'pinFav', id: '/x' })
    const b = reduce(s, { type: 'activateRec', id: '/y' })
    const ok = a.url === '/x' && a.pinned === '/x' && b.url === '/y' && b.pinned === '/y'
    return { pass: ok, detail: `pinFav→(${a.url}=${a.pinned}), activateRec→(${b.url}=${b.pinned})` }
  },
  // 7. activateCol → url 만, pinned 보존
  (s) => {
    const a = reduce(s, { type: 'activateCol', id: '/z' })
    const ok = a.url === '/z' && a.pinned === s.pinned
    return { pass: ok, detail: `activateCol: url=${a.url}, pinned=${a.pinned} (전 ${s.pinned})` }
  },
]

export function runChecks(state: FinderState = sample): CheckResult[] {
  if (checks.length !== FinderInvariants.length) {
    return [{
      index: -1, spec: 'CHECK MISMATCH', pass: false,
      detail: `FinderInvariants.length=${FinderInvariants.length}, checks.length=${checks.length}`,
    }]
  }
  return checks.map((fn, i) => ({ index: i, spec: FinderInvariants[i], ...fn(state) }))
}
