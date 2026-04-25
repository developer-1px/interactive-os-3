// Node ESM loader — Vite 전용 import.meta.glob을 사용하는 모듈을 stub로 치환한다.
// scripts/aria-tree.ts 가 src/routes/**/build.tsx 를 동적 import 할 때 적용.
//
// 사용: node --import tsx --loader ./scripts/aria-tree-loader.mjs scripts/aria-tree.ts
import { fileURLToPath } from 'node:url'

const STUBS = new Map([
  // icon.ts: Vite import.meta.glob 사용 → 아무 토큰 받아 빈 css 반환하는 stub.
  [/\/src\/ds\/fn\/icon\.ts$/, `
    export const iconVars = () => ''
    export const icon = () => ''
    export const iconIndicator = () => ''
  `],
])

export async function load(url, context, nextLoad) {
  if (url.startsWith('file://')) {
    const p = fileURLToPath(url)
    for (const [re, src] of STUBS) {
      if (re.test(p)) return { format: 'module', shortCircuit: true, source: src }
    }
  }
  return nextLoad(url, context)
}
