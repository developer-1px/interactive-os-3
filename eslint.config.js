import fs from 'node:fs'
import path from 'node:path'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const MAX_LINES = 75
const MAX_FILES_PER_DIR = 7

// 인라인 플러그인 — SRP/모듈 크기 하네스
// max-lines-no-imports: import 제외 줄 수 초과 → 파일 분리 신호
// max-files-per-dir   : 같은 폴더 파일 수 초과 → 하위 폴더 분리 신호
const dirFileCountCache = new Map()

// ui/ zone 위계 — 작은 인덱스가 토대, 큰 인덱스가 합성.
// 같은/낮은 zone 만 import 허용. entity ↔ overlay 는 같은 층(서로 import 금지).
const ZONE_ORDER = { layout: 1, control: 2, entity: 3, overlay: 3, collection: 4, composite: 5 }

const dsLimits = {
  rules: {
    'token-tier': {
      meta: { type: 'problem', schema: [] },
      create(context) {
        const file = context.filename ?? context.getFilename?.()
        if (!file) return {}
        // 소비자(widget·ui·layout)는 Tier1(palette/seed) 직접 import 금지.
        // semantic은 CSS var 문자열로 소비, Tier3은 src/ds/fn/* 로 소비.
        const isConsumer =
          /\/src\/ds\/ui\//.test(file) ||
          /\/src\/ds\/layout\//.test(file) ||
          /\/src\/ds\/style\/widgets\//.test(file)
        if (!isConsumer) return {}
        return {
          ImportDeclaration(node) {
            const src = node.source.value
            if (typeof src !== 'string') return
            const t1 = /(?:^|\/)ds\/style\/preset(?:$|\/)/.test(src) ||
                       /(?:^|\/)ds\/style\/seed(?:$|\/)/.test(src) ||
                       /^\.\.?\/.*style\/(preset|seed)(?:$|\/)/.test(src)
            if (t1) {
              context.report({
                node,
                message:
                  `토큰 티어 위반: 소비자(ui/layout/widgets)는 Tier1(preset/seed) 직접 import 금지 — ` +
                  `색은 var(--ds-*) 또는 src/ds/fn 의 tone()/pair()/mute()/emphasize() 로만 소비.`,
              })
            }
          },
        }
      },
    },
    'zone-boundary': {
      meta: { type: 'problem', schema: [] },
      create(context) {
        const file = context.filename ?? context.getFilename?.()
        const m = file && file.match(/\/src\/ds\/ui\/([^/]+)\//)
        if (!m) return {}
        const fromZone = m[1]
        const fromRank = ZONE_ORDER[fromZone]
        if (fromRank == null) return {}
        return {
          ImportDeclaration(node) {
            const src = node.source.value
            // ui/ 내부 cross-zone import 는 '../<zone>/...' 패턴.
            // 절대경로(.../ui/<zone>/...) 도 함께 캐치.
            const rel = src.match(/(?:^|\/)ui\/([^/]+)\//) || src.match(/^\.\.\/([^/]+)\//)
            if (!rel) return
            const toZone = rel[1]
            const toRank = ZONE_ORDER[toZone]
            if (toRank == null) return
            if (toZone === fromZone) return
            if (toRank >= fromRank) {
              context.report({
                node,
                message: `zone 경계 위반: ${fromZone}(L${fromRank}) → ${toZone}(L${toRank}). 위계상 아래 zone 만 import 가능.`,
              })
            }
          },
        }
      },
    },
    'max-lines-no-imports': {
      meta: { type: 'suggestion', schema: [{ type: 'number' }] },
      create(context) {
        const limit = context.options[0] ?? MAX_LINES
        return {
          Program(node) {
            const src = context.sourceCode ?? context.getSourceCode()
            const total = src.lines.length
            let importLineSpan = 0
            for (const stmt of node.body) {
              if (stmt.type === 'ImportDeclaration') {
                importLineSpan += stmt.loc.end.line - stmt.loc.start.line + 1
              }
            }
            const effective = total - importLineSpan
            if (effective > limit) {
              context.report({
                node,
                message: `파일이 import 제외 ${effective}줄 — ${limit}줄 초과. SRP 위반 신호, 책임 분리 필요.`,
              })
            }
          },
        }
      },
    },
    'max-files-per-dir': {
      meta: { type: 'suggestion', schema: [{ type: 'number' }] },
      create(context) {
        const limit = context.options[0] ?? MAX_FILES_PER_DIR
        return {
          Program(node) {
            const file = context.filename ?? context.getFilename?.()
            if (!file || file === '<input>' || file === '<text>') return
            const dir = path.dirname(file)
            if (!dirFileCountCache.has(dir)) {
              try {
                const entries = fs
                  .readdirSync(dir, { withFileTypes: true })
                  .filter((e) => e.isFile() && /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(e.name))
                dirFileCountCache.set(dir, entries.length)
              } catch {
                dirFileCountCache.set(dir, 0)
              }
            }
            const count = dirFileCountCache.get(dir)
            if (count > limit) {
              context.report({
                node,
                message: `폴더 '${path.basename(dir)}' 에 소스 파일 ${count}개 — ${limit}개 초과. 하위 폴더로 분리하세요.`,
              })
            }
          },
        }
      },
    },
  },
}

// ds 원칙: style·className·role 금지. 모든 스타일/레이아웃은 ds CSS 가 태그+ARIA
// 셀렉터로 관장한다.
// - ds/ui 내부만 예외: role 리터럴 허용 (컴포넌트 정의부) + 동적 style 허용
//   (anchor-name/CSS custom property 같이 정적 CSS로 표현 불가한 값).
const className = {
  selector: 'JSXAttribute[name.name="className"]',
  message: 'className 금지 — ds 는 classless. 스타일은 태그+role+aria 셀렉터로만.',
}
const style = {
  selector: 'JSXAttribute[name.name="style"]',
  message: 'style prop 금지 — 레이아웃·간격·색상 전부 ds 토큰으로. src/ds/css 에 규칙을 추가.',
}
const role = {
  selector: 'JSXAttribute[name.name="role"]',
  message: 'role prop 금지 — ds controls 컴포넌트를 사용하세요 (No escape hatches).',
}

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: { ecmaVersion: 2020, globals: globals.browser },
    plugins: { ds: dsLimits },
    rules: {
      'ds/max-lines-no-imports': ['warn', MAX_LINES],
      'ds/max-files-per-dir': ['warn', MAX_FILES_PER_DIR],
      'ds/zone-boundary': 'error',
      'ds/token-tier': 'error',
    },
  },
  { files: ['src/**/*.{ts,tsx}'],              rules: { 'no-restricted-syntax': ['error', role, className, style] } },
  { files: ['src/ds/ui/**/*.{ts,tsx}'],        rules: { 'no-restricted-syntax': ['error', className] } },
  { files: ['src/ds/layout/**/*.{ts,tsx}'],    rules: { 'no-restricted-syntax': ['error', className] } },
  // zone 폴더(src/ds/ui/*)는 의도적으로 동일 zone 컴포넌트를 모두 수집한다.
  // 7개 제한은 arbitrary 도메인 폴더 대상이지 zone 폴더에는 적용하지 않는다.
  { files: ['src/ds/ui/{collection,composite,control,overlay,entity,layout}/*.{ts,tsx}'], rules: { 'ds/max-files-per-dir': 'off' } },
])
