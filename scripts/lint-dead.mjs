#!/usr/bin/env node
/**
 * lint-dead — barrel re-export 통과 dead export 검출.
 *
 * 도구: ts-prune (leaf-level export 분석) + 후처리 필터.
 *   - knip 단독은 barrel 통과 dead 못 잡음 (issue webpro-nl/knip#626)
 *   - ts-prune 은 false positive 가 많아 후처리로 dynamic import / glob 소비 노이즈 제거
 *
 * 필터링 사유:
 *   (used in module)         자기 자신 안에서만 사용 — internal helper. 본 스킬 범위 밖
 *   routeTree.gen.ts         TanStack Router 자동 생성. 분석 대상 ❌
 *   /_demos/                 @demo 자동 수집 (virtual:ds-audit). dynamic glob
 *   /index.ts:               barrel — leaf 가 진짜 검증 대상
 *   .category.ts             foundations/* category meta — virtual:ds-audit glob
 *   _category.ts             palette/* category meta — 동일
 *   .meta.ts                 ui registry meta — registry glob 소비
 *   .triggers.ts             state triggers — runtime glob 소비
 *   pages/*.tsx              TanStack file-routing dynamic import — ts-prune 추적 ❌
 *   apps/.../entities/*.ts   zod schema z.infer<> 패턴 — runtime 소비 추적 ❌
 *
 * Exit code: 항상 0. 결과는 stdout 에 그대로 — CI gate 로 쓰려면 baseline diff 추가 필요.
 */
import { spawnSync } from 'node:child_process'

const NOISE = [
  /\(used in module\)/,
  /routeTree\.gen/,
  /\/_demos\//,
  /\/index\.ts:/,
  /\.category\.ts:/,
  /_category\.ts:/,
  /\.meta\.ts:/,
  /\.triggers\.ts:/,
  /\.gen\.ts:/,
  // apps/* · showcase/playground — TanStack Router file-routing dynamic import
  // packages/app/src/routes/<slug>.tsx 가 import 하나 ts-prune 은 그 chain 추적 불가
  /^apps\//,
  /^showcase\/playground\//,
  // zod schema z.infer<> · z.parse(...) 패턴 — runtime 소비
  /Schema$/,
  // TS 파서 노이즈 (satisfies / Record 키워드를 export로 오인)
  / - satisfies$/,
  / - Record$/,
]

const r = spawnSync('npx', ['ts-prune', '--project', 'tsconfig.app.json'], { encoding: 'utf8' })
if (r.status !== 0) {
  process.stderr.write(r.stderr || '')
  process.exit(r.status ?? 1)
}

const lines = r.stdout.split('\n').filter(Boolean)
const dead = lines.filter((l) => !NOISE.some((re) => re.test(l)))

if (dead.length === 0) {
  console.log('✅ no leaf-level dead exports found')
  process.exit(0)
}

console.log(`⚠️  ${dead.length} leaf-level export(s) without verifiable consumer:\n`)
for (const l of dead) console.log('  ' + l)
console.log('\n각 항목은 grep 으로 실제 호출처를 검증한 뒤 제거 결정.')
console.log('false positive 가 반복되면 NOISE regex 에 추가하라.')
