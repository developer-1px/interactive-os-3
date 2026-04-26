/**
 * dsCss 런타임 가드 — 부팅 시 selector 중복을 throw 로 차단.
 *
 * 같은 selector 가 두 source 에 동시에 들어가면 cascade 후순위가 시각을 덮는다.
 * "어느 파일이 owner 인가"가 grep 한 번으로 답이 안 나오는 상태는 영구 부채.
 *
 * 새 중복은 무조건 throw. 마이그레이션 in-flight 한 기존 부채는
 * KNOWN_RACES allowlist 에 명시(가시화) — 줄어드는 부채 목록.
 *
 * :root 처럼 토큰을 여러 파일에서 추가하는 정상 패턴은 ALWAYS_ALLOWED.
 */
import { parseSegments, findDuplicateSelectors, normSelector, type Duplicate } from './audit'

/** :root 등 — 토큰 분산 등록은 정상 */
const ALWAYS_ALLOWED = new Set<string>(['*', ':root', 'html', 'body'])

/** 마이그레이션 in-flight 한 알려진 부채. 줄여나가야 한다. 새 항목 추가 시 날짜·이유 필수. */
const KNOWN_RACES: ReadonlyArray<string> = [
].map(normSelector)

const allowed = new Set<string>([...ALWAYS_ALLOWED, ...KNOWN_RACES])

export class DsCssDuplicateError extends Error {
  readonly duplicates: Duplicate[]
  constructor(duplicates: Duplicate[]) {
    const lines: string[] = [
      '🔴 dsCss 중복 selector — cascade race 발생.',
      '   같은 selector 가 여러 파일에서 선언됨 → 후순위가 앞 선언을 덮음.',
      '   owner 를 한 파일로 일원화하거나, 의도된 부채면 KNOWN_RACES 에 명시하라.',
      '',
    ]
    for (const d of duplicates) {
      lines.push(`   • ${d.selector}  (×${d.count})`)
      for (const s of d.sources) lines.push(`       ${s}`)
    }
    super(lines.join('\n'))
    this.name = 'DsCssDuplicateError'
    this.duplicates = duplicates
  }
}

export function assertUniqueSelectors(segments: ReadonlyArray<readonly [string, string]>): void {
  const rules = parseSegments(segments)
  const dups = findDuplicateSelectors(rules)
  const unexpected = dups.filter((d) => !allowed.has(normSelector(d.selector)))
  if (unexpected.length > 0) throw new DsCssDuplicateError(unexpected)
}
