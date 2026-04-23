import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

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
