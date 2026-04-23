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
const dsLimits = {
  rules: {
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

// ds 원칙 강제 규칙 — selector 재사용을 위해 한 곳에 모음
const DS_COMPONENTS =
  'Feed|FeedArticle|Tree|TreeRow|TreeGrid|Listbox|ListboxGroup|Option|' +
  'Menu|MenuList|MenuGroup|MenuItem|MenuPopover|Tab|TabList|TabPanel|' +
  'Toolbar|ToolbarButton|Button|Separator|Carousel|Slide|Tooltip|Dialog|' +
  'Disclosure|Grid|Row|GridCell|ColumnHeader|RowGroup|RowHeader|' +
  'Radio|RadioGroup|Switch'

const LAYOUT_BREAKING_KEYS =
  'padding|paddingInline|paddingBlock|paddingLeft|paddingRight|paddingTop|paddingBottom|' +
  'gap|rowGap|columnGap|' +
  'gridTemplateColumns|gridTemplateRows|gridTemplateAreas|' +
  'gridColumn|gridRow|gridArea'

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
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: { ds: dsLimits },
    rules: {
      'ds/max-lines-no-imports': ['warn', MAX_LINES],
      'ds/max-files-per-dir': ['warn', MAX_FILES_PER_DIR],
    },
  },
  // Rule 2, 3 — classless, layout-breaking style 금지 (Rule 2, 3 공통)
  // flat config 특성: 같은 rule 이름이 여러 block 에 있으면 나중 block 이 덮어쓴다.
  // 그래서 `no-restricted-syntax` 는 반드시 한 block 에 모든 selector 를 배열로 선언.
  // controls/ui 내부는 아래 블록에서 Rule 1 을 빼고 덮어써 예외 처리한다.
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error',
        {
          selector: 'JSXAttribute[name.name="role"]',
          message: 'role prop 금지 — ds controls 컴포넌트를 사용하세요 (No escape hatches).',
        },
        {
          selector: 'JSXAttribute[name.name="className"]',
          message: 'className 금지 — ds 는 classless. 스타일은 role/aria 기반 CSS 가 담당.',
        },
        {
          selector:
            `JSXOpeningElement[name.name=/^(${DS_COMPONENTS})$/] ` +
            `JSXAttribute[name.name="style"] ` +
            `Property[key.name=/^(${LAYOUT_BREAKING_KEYS})$/]`,
          message: 'ds 컴포넌트 layout 속성 금지 — ds 가 subgrid·padding·gap 을 통제합니다. keyline 이 깨집니다.',
        },
      ],
    },
  },
  // controls/ui 내부 — 컴포넌트 정의부라 role 리터럴이 정당. Rule 1 만 제외하고 2,3 재적용.
  {
    files: ['src/controls/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error',
        {
          selector: 'JSXAttribute[name.name="className"]',
          message: 'className 금지 — ds 는 classless. 스타일은 role/aria 기반 CSS 가 담당.',
        },
        {
          selector:
            `JSXOpeningElement[name.name=/^(${DS_COMPONENTS})$/] ` +
            `JSXAttribute[name.name="style"] ` +
            `Property[key.name=/^(${LAYOUT_BREAKING_KEYS})$/]`,
          message: 'ds 컴포넌트 layout 속성 금지 — ds 가 subgrid·padding·gap 을 통제합니다. keyline 이 깨집니다.',
        },
      ],
    },
  },
])
