import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// ds 원칙: style·className·role 금지. 모든 스타일/레이아웃은 ds CSS 가 태그+ARIA
// 셀렉터로 관장한다.
// - controls/ui 내부만 예외: role 리터럴 허용 (컴포넌트 정의부) + 동적 style 허용
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
  },
  { files: ['src/**/*.{ts,tsx}'],              rules: { 'no-restricted-syntax': ['error', role, className, style] } },
  { files: ['src/controls/ui/**/*.{ts,tsx}'],  rules: { 'no-restricted-syntax': ['error', className] } },
])
