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
const dirFileCountCache = new Map()

// ─── ds 위계 (de facto: M3·Polaris·Atlassian 수렴) ───────────────────────
//   L0  palette       tokens/palette/*           (raw scale)
//   L1  foundations   tokens/foundations/*       (semantic)
//   L1.5 component-tokens  intentionally empty
//   L2  primitives    ui/{0-primitives,1-status,2-action,3-input}/*, ui/parts/*
//   L3  patterns      ui/{4-selection,5-display,6-overlay,patterns}/*, content/*
//   L4  templates     ui/{8-layout,recipes}/*
//   L5  devices       devices/*
//
// + headless/ — L2 와 평행 (ARIA/keyboard 엔진), foundations 까지만 의존.
// + style/widgets/ — orphan CSS (1:1 component 없는 shared CSS), foundations 까지만 의존.
//
// 위계 invariant: L<n> 의 파일은 L<m≤n> 만 import 가능. 같은 L<n> 안에서는 자유.
// L0/L1 은 토큰이라 절대 widget 코드 (위쪽) 를 import 할 수 없음.

const UI_ZONE_RANK = {
  '0-primitives': 2, '1-status': 2, '2-action': 2, '3-input': 2, 'parts': 2,
  '4-selection': 3, '5-display': 3, '6-overlay': 3, 'patterns': 3,
  '8-layout': 4, 'recipes': 4,
}

const dsLimits = {
  rules: {
    // ─── layer-boundary ────────────────────────────────────────────────
    // widget(L2~L5 + style/widgets) 는 token 정의층(preset/seed/shell) 직접 import ❌.
    // foundations(L1) 은 palette(L0) 까지만, preset/seed/shell ❌.
    'layer-boundary': {
      meta: { type: 'problem', schema: [] },
      create(context) {
        const file = context.filename ?? context.getFilename?.()
        if (!file) return {}
        // showcase 카탈로그 — token tier 자체를 노출이 목적, raw 허용.
        const isCatalogShowcase = /\/showcase\/(canvas|foundations|theme|catalog|inspector)\//.test(file)
        if (isCatalogShowcase) return {}
        // widget tier
        const isWidget = /\/(?:packages\/ds\/src\/(?:ui|content|devices|headless)|packages\/ds\/src\/style\/widgets|showcase|apps)\//.test(file)
        const isFoundations = /\/packages\/ds\/src\/tokens\/foundations\//.test(file)
        if (!isWidget && !isFoundations) return {}

        // widget 금지: preset · seed · shell (token 정의층)
        const FORBIDDEN_FOR_WIDGET = [
          { name: 'preset', re: /(?:^|\/)tokens\/style\/preset(?:$|\/|['"])/ },
          { name: 'preset', re: /(?:^|\/)\.\.\/(?:\.\.\/)*style\/preset(?:$|\/|['"])/ },
          { name: 'seed',   re: /(?:^|\/)tokens\/style\/seed(?:$|\/|['"])/ },
          { name: 'seed',   re: /(?:^|\/)\.\.\/(?:\.\.\/)*style\/seed(?:$|\/|['"])/ },
          { name: 'shell',  re: /(?:^|\/)tokens\/style\/shell(?:$|\/|['"])/ },
          { name: 'shell',  re: /(?:^|\/)\.\.\/(?:\.\.\/)*style\/shell(?:$|\/|['"])/ },
        ]
        return {
          ImportDeclaration(node) {
            const src = node.source.value
            if (typeof src !== 'string') return
            if (isWidget) {
              for (const r of FORBIDDEN_FOR_WIDGET) {
                if (r.re.test(src)) {
                  context.report({
                    node,
                    message:
                      `layer 위반: widget tier 는 ${r.name} 직접 import 금지 — ` +
                      `tokens/foundations 의 semantic role + tokens/palette 의 raw scale 만 소비.`,
                  })
                  return
                }
              }
            }
            // foundations 는 palette 만 허용 (preset/seed/shell ❌)
            if (isFoundations) {
              if (/(?:^|\/)tokens\/style\/(preset|seed|shell)(?:$|\/|['"])/.test(src) ||
                  /(?:^|\/)\.\.\/(?:\.\.\/)*style\/(preset|seed|shell)(?:$|\/|['"])/.test(src)) {
                context.report({
                  node,
                  message:
                    `layer 위반: foundations(L1) 은 token 정의층(preset/seed/shell) import 금지 — palette(L0) 까지만.`,
                })
              }
            }
          },
        }
      },
    },

    // ─── zone-boundary ────────────────────────────────────────────────
    // ui/<zone> 내부 위계: L2 primitives → L3 patterns → L4 templates.
    // 같은 L 끼리는 자유, 낮은 L 에서 높은 L 으로 import 금지 (예: L2 → L3 ❌).
    'zone-boundary': {
      meta: { type: 'problem', schema: [] },
      create(context) {
        const file = context.filename ?? context.getFilename?.()
        const m = file && file.match(/\/packages\/ds\/src\/ui\/([^/]+)\//)
        if (!m) return {}
        const fromZone = m[1]
        const fromRank = UI_ZONE_RANK[fromZone]
        if (fromRank == null) return {}
        return {
          ImportDeclaration(node) {
            const src = node.source.value
            if (typeof src !== 'string') return
            // ui/<zone>/... 절대경로 또는 상대경로 둘 다 캐치
            const rel = src.match(/(?:^|\/)ui\/([^/]+)\//) || src.match(/^\.\.\/([^/]+)\//)
            if (!rel) return
            const toZone = rel[1]
            const toRank = UI_ZONE_RANK[toZone]
            if (toRank == null) return
            if (toZone === fromZone) return
            if (toRank > fromRank) {
              context.report({
                node,
                message:
                  `zone 위반: ${fromZone}(L${fromRank}) → ${toZone}(L${toRank}). ` +
                  `위계상 같은 L 또는 낮은 L 만 import 가능 (primitives → patterns → templates).`,
              })
            }
          },
        }
      },
    },

    // ─── headless 경계 ─────────────────────────────────────────────────
    // headless 는 tokens 까지만, ui/content/devices import ❌.
    'headless-boundary': {
      meta: { type: 'problem', schema: [] },
      create(context) {
        const file = context.filename ?? context.getFilename?.()
        if (!file) return {}
        if (!/\/packages\/ds\/src\/headless\//.test(file)) return {}
        return {
          ImportDeclaration(node) {
            const src = node.source.value
            if (typeof src !== 'string') return
            // headless 가 ui/content/devices 를 import 하면 위반
            if (/(?:^|\/)(?:ui|content|devices)(?:$|\/|['"])/.test(src) &&
                !/^@tanstack|^react/.test(src)) {
              // packages/ds/src/ui 등 ds 내부 경로만 검사
              if (/@p\/ds\/(ui|content|devices)/.test(src) ||
                  /\.\.\/(?:\.\.\/)*(ui|content|devices)\//.test(src)) {
                context.report({
                  node,
                  message:
                    `headless 위반: headless 는 ui/content/devices 를 import 할 수 없음 — tokens 까지만 의존.`,
                })
              }
            }
          },
        }
      },
    },

    // ─── content/devices 경계 ──────────────────────────────────────────
    // content (L3) · devices (L5) 는 ui (L2/L3/L4) + headless + tokens 까지.
    // 같은 layer 끼리는 자유.

    // ─── aria-roledescription 금지 ─────────────────────────────────────
    'no-aria-roledescription-namespace': {
      meta: { type: 'problem', schema: [] },
      create(context) {
        const SEL = /\[aria-roledescription\s*[~|^$*]?=/
        const check = (node, raw) => {
          if (SEL.test(raw)) {
            context.report({
              node,
              message:
                `aria-roledescription 을 selector namespace 로 쓰지 마세요 — ARIA 의미 왜곡. data-part="<name>" 사용.`,
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
                message: `aria-roledescription JSX prop 금지 — namespace 용도면 data-part 사용.`,
              })
            }
          },
        }
      },
    },

    // ─── token 정의 권한 ───────────────────────────────────────────────
    // --ds-* 토큰 발행은 preset/seed/shell 에서만. foundations·widget 에서 ❌.
    'no-token-define-outside-preset': {
      meta: { type: 'problem', schema: [] },
      create(context) {
        const file = context.filename ?? context.getFilename?.()
        if (!file) return {}
        // 발행 권한: preset/, seed/, shell/, palette/ (raw 정의)
        if (/\/packages\/ds\/src\/tokens\/(palette|style\/(preset|seed|shell))\//.test(file)) return {}
        // 검사 대상: foundations 와 widget (ui/content/devices/style/widgets)
        if (!/\/packages\/ds\/src\/(tokens\/foundations|ui|content|devices|style\/widgets)\//.test(file)) return {}
        // preset 에서 이미 발행된 토큰의 variant override 는 sanctioned
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
                `--ds-* 토큰 발행 (${tok}) 은 tokens/(palette|style/(preset|seed|shell))/ 에서만 허용. ` +
                `widget 에서 발행하면 SSOT 분기 — preset 스키마(DsPreset)에 추가하거나, internal var 면 --ds- prefix 제거.`,
            })
          }
        }
        return {
          Literal(node) { if (typeof node.value === 'string') check(node, node.value) },
          TemplateElement(node) { check(node, node.value.raw) },
        }
      },
    },

    // ─── hairline 하드코딩 금지 ────────────────────────────────────────
    'no-raw-hairline': {
      meta: { type: 'suggestion', schema: [] },
      create(context) {
        const file = context.filename ?? context.getFilename?.()
        if (!file) return {}
        if (!/\/packages\/ds\/src\/(tokens\/foundations|style\/widgets|ui|content|devices)\//.test(file)) return {}
        if (/\/foundations\/shape\/hairline\.ts$/.test(file)) return {}
        const RAW = /\b[12]px\s+(solid|dashed|dotted)\b/
        const check = (node, raw) => {
          if (RAW.test(raw)) {
            context.report({
              node,
              message:
                `'1px/2px solid' 하드코딩 — hairlineWidth() 또는 var(--ds-hairline) 사용.`,
            })
          }
        }
        return {
          Literal(node) { if (typeof node.value === 'string') check(node, node.value) },
          TemplateElement(node) { check(node, node.value.raw) },
        }
      },
    },

    // ─── 모듈 크기 ──────────────────────────────────────────────────────
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
                message: `파일이 import 제외 ${effective}줄 — ${limit}줄 초과. SRP 분리.`,
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
                message: `폴더 '${path.basename(dir)}' 에 소스 ${count}개 — ${limit}개 초과. 하위 분리.`,
              })
            }
          },
        }
      },
    },
  },
}

// ds 원칙: style·className·role 금지. 모든 스타일/레이아웃은 ds CSS 가 태그+ARIA 셀렉터로.
const className = {
  selector: 'JSXAttribute[name.name="className"]',
  message: 'className 금지 — ds 는 classless. 스타일은 태그+role+aria 셀렉터로만.',
}
const style = {
  selector: 'JSXAttribute[name.name="style"]',
  message: 'style prop 금지 — 레이아웃·간격·색상 전부 ds 토큰으로.',
}
const role = {
  selector: 'JSXAttribute[name.name="role"]',
  message: 'role prop 금지 — ds controls 컴포넌트를 사용 (No escape hatches).',
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
      'ds/layer-boundary': 'error',
      'ds/headless-boundary': 'error',
      'ds/no-aria-roledescription-namespace': 'error',
      'ds/no-token-define-outside-preset': 'error',
      'ds/no-raw-hairline': 'warn',
    },
  },
  // role/className/style escape hatch 금지 — ds 본체 외 전 영역
  { files: ['packages/**/*.{ts,tsx}', 'apps/**/*.{ts,tsx}', 'showcase/**/*.{ts,tsx}'],
    rules: { 'no-restricted-syntax': ['error', role, className, style] } },
  // ds/ui 정의부 — role 리터럴 + 동적 style 허용 (anchor-name 등 정적 CSS 표현 불가 영역)
  { files: ['packages/ds/src/ui/**/*.{ts,tsx}'],
    rules: { 'no-restricted-syntax': ['error', className] } },
  // ds/headless layout — role 정의부
  { files: ['packages/ds/src/headless/layout/**/*.{ts,tsx}'],
    rules: { 'no-restricted-syntax': ['error', className] } },
  // ui zone 폴더 — 의도적으로 동일 zone 컴포넌트 다수 수집. 7개 제한 면제.
  { files: ['packages/ds/src/ui/{0-primitives,1-status,2-action,3-input,4-selection,5-display,6-overlay,8-layout,parts,patterns,recipes}/*.{ts,tsx}'],
    rules: { 'ds/max-files-per-dir': 'off' } },
  // content/devices 폴더 — 비즈니스 부품/mock 다수 수집
  { files: ['packages/ds/src/{content,devices}/*.{ts,tsx}'],
    rules: { 'ds/max-files-per-dir': 'off' } },
])
