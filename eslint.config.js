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
    // L1a(raw palette) 직접 소비 금지. 소비자(L4 routes, L3 widgets)는 semantic 토큰만.
    // 시연/카탈로그 라우트는 raw scale 노출이 의도이므로 allowlist.
    'no-raw-palette-in-consumer': {
      meta: { type: 'problem', schema: [] },
      create(context) {
        const file = context.filename ?? context.getFilename?.()
        if (!file) return {}
        const isRoute  = /\/src\/routes\//.test(file)
        const isWidget = /\/src\/ds\/style\/widgets\//.test(file)
        if (!isRoute && !isWidget) return {}
        // showcase / token-explorer 라우트는 예외 (memory: 시연 라우트 raw 예외)
        const SHOWCASE = /\/src\/routes\/(theme|content|foundations|inspector)\b/
        if (SHOWCASE.test(file)) return {}
        const PALETTE = /var\(--ds-(?:neutral-[1-9]|tone(?:-hue|-chroma|-tint)?|step-scale|hue|density|depth)\b/
        const check = (node, raw) => {
          if (PALETTE.test(raw)) {
            context.report({
              node,
              message:
                `raw palette 소비: var(--ds-neutral-N) 등은 L1a(raw) 토큰입니다. ` +
                `소비자(L4 routes / L3 widgets)는 semantic 토큰(--ds-fg/muted/border, mute()/dim()/pair())만 사용하세요.`,
            })
          }
        }
        return {
          Literal(node) { if (typeof node.value === 'string') check(node, node.value) },
          TemplateElement(node) { check(node, node.value.raw) },
        }
      },
    },

    // aria-roledescription 을 namespace selector/JSX 키로 쓰지 마. data-part 사용.
    // (memory: "No aria-roledescription namespace")
    'no-aria-roledescription-namespace': {
      meta: { type: 'problem', schema: [] },
      create(context) {
        const SEL = /\[aria-roledescription\s*[~|^$*]?=/
        const check = (node, raw) => {
          if (SEL.test(raw)) {
            context.report({
              node,
              message:
                `aria-roledescription 을 selector namespace 로 쓰지 마세요 — 보조기기에 라벨로 노출되어 ARIA 의미를 왜곡합니다. data-part="<name>" 를 사용하세요.`,
            })
          }
        }
        return {
          Literal(node) { if (typeof node.value === 'string') check(node, node.value) },
          TemplateElement(node) { check(node, node.value.raw) },
          JSXAttribute(node) {
            if (node.name?.name === 'aria-roledescription') {
              context.report({
                node,
                message:
                  `aria-roledescription JSX prop 금지 — namespace 용도면 data-part 사용. (true ARIA 의미가 필요하면 ds/parts 컴포넌트 정의부에서만)`,
              })
            }
          },
        }
      },
    },

    // L0(preset/) 만 --ds-* 토큰을 새로 발행한다. L2/L3 에서 발행 = SSOT 분기.
    'no-token-define-outside-preset': {
      meta: { type: 'problem', schema: [] },
      create(context) {
        const file = context.filename ?? context.getFilename?.()
        if (!file) return {}
        // 발행 권한이 있는 곳: preset/, seed/
        if (/\/src\/ds\/style\/(preset|seed)\//.test(file)) return {}
        // 토큰 발행은 foundations 와 widgets 에서만 검사 (test/스크립트 등 무시)
        if (!/\/src\/ds\/(foundations|style\/widgets)\//.test(file)) return {}
        // preset 에서 이미 발행된 토큰은 variant scope 에서 override 가 sanctioned.
        // (예: rail/floating sidebar 가 --ds-sidebar-w 재정의, mobile media 가 --ds-hairline 0)
        // 이 목록은 DsPreset 스키마에 정의된 모든 발행 토큰의 prefix 화이트리스트.
        const PRESET_OVERRIDABLE = /^--ds-(sidebar-w|column-w|preview-w|chrome-h|hairline|elev-[0-3]|shadow|shell-mobile-max|traffic-(close|min|max))$/
        const DEFINE = /(?:^|[\s;{])(--ds-[a-z0-9-]+)\s*:/gi
        const check = (node, raw) => {
          let m
          DEFINE.lastIndex = 0
          while ((m = DEFINE.exec(raw)) !== null) {
            const tok = m[1]
            if (PRESET_OVERRIDABLE.test(tok)) continue
            context.report({
              node,
              message:
                `--ds-* 토큰 발행 (${tok}) 은 L0(src/ds/style/preset/)에서만 허용됩니다. ` +
                `위계(L2 foundations / L3 widgets)에서 발행하면 SSOT 가 분기됩니다 — preset 스키마(DsPreset)에 추가하거나, 컴포넌트-내부 변수면 --ds- prefix 를 떼세요.`,
            })
          }
        }
        return {
          Literal(node) { if (typeof node.value === 'string') check(node, node.value) },
          TemplateElement(node) { check(node, node.value.raw) },
        }
      },
    },

    // hairline 두께 하드코딩 금지 — hairlineWidth() / --ds-hairline 사용.
    // (직전 commit "1px solid → hairlineWidth() 일괄 수렴" 후속)
    'no-raw-hairline': {
      meta: { type: 'suggestion', schema: [] },
      create(context) {
        const file = context.filename ?? context.getFilename?.()
        if (!file) return {}
        if (!/\/src\/ds\/(foundations|style\/widgets)\//.test(file)) return {}
        // hairline 자체 정의 파일은 예외
        if (/\/foundations\/shape\/hairline\.ts$/.test(file)) return {}
        const RAW = /\b[12]px\s+(solid|dashed|dotted)\b/
        const check = (node, raw) => {
          if (RAW.test(raw)) {
            context.report({
              node,
              message:
                `'1px/2px solid' 하드코딩 — hairlineWidth() 토큰 또는 var(--ds-hairline) 을 사용하세요 (focus ring 이면 --ds-focus-ring-w 를 ladder 로 추가).`,
            })
          }
        }
        return {
          Literal(node) { if (typeof node.value === 'string') check(node, node.value) },
          TemplateElement(node) { check(node, node.value.raw) },
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
      'ds/no-raw-palette-in-consumer': 'error',
      'ds/no-aria-roledescription-namespace': 'error',
      'ds/no-token-define-outside-preset': 'error',
      'ds/no-raw-hairline': 'warn',
    },
  },
  { files: ['src/**/*.{ts,tsx}'],              rules: { 'no-restricted-syntax': ['error', role, className, style] } },
  { files: ['src/ds/ui/**/*.{ts,tsx}'],        rules: { 'no-restricted-syntax': ['error', className] } },
  { files: ['src/ds/layout/**/*.{ts,tsx}'],    rules: { 'no-restricted-syntax': ['error', className] } },
  // zone 폴더(src/ds/ui/*)는 의도적으로 동일 zone 컴포넌트를 모두 수집한다.
  // 7개 제한은 arbitrary 도메인 폴더 대상이지 zone 폴더에는 적용하지 않는다.
  { files: ['src/ds/ui/{collection,composite,control,overlay,entity,layout}/*.{ts,tsx}'], rules: { 'ds/max-files-per-dir': 'off' } },
])
