# Coding rules — read before editing

이 repo 의 제품은 **`@p/headless`** 단 하나. ARIA 행동 인프라(axes · roving · gesture · patterns). 옵션 store 어댑터(`@p/headless/store` — resource · feature)와 데모 quick-start(`@p/headless/local`) 동봉. visual·token·CSS 어휘는 `@p/headless` 의 책임 밖이다.

쇼케이스 앱(`apps/finder`·`apps/slides`·`apps/edu-portal-admin`·`apps/markdown`·`site/src/headless-site`)은 `@p/headless` + **Tailwind v3** 조합으로 구현되어, "real app on bare headless" 의 살아있는 증거다.

## 기본 자세

- **제품은 `packages/headless` 단 하나.** 다른 패키지(`app`·`fs`·`devtools`)는 셸·유틸. `apps/*` 는 헤드리스 검증·증명용.
- **시각 결정은 Tailwind 가 표현.** 별도 토큰 시스템·CSS-in-JS·classless 어휘 ❌. Tailwind utility class 만으로 표현 가능한 정도가 시각 자유도.
- **분류·이름·위계의 정합 출처는 W3C/WHATWG spec.** 1) WAI-ARIA + APG (role taxonomy) → 2) WHATWG HTML Living Standard (semantic element) → 3) WCAG. Material 3·Radix·shadcn 등 라이브러리·DS 어휘 차용 ❌.
- **구현 패턴(키보드·포커스·접근성 동작) 의 de facto 는 따른다.** *이름·구조* 가 아니라 *행동* 을 차용 (Radix·Base·Ariakit·RAC 최소 2곳 수렴).
- **하란 것 이상으로 하지 않는다.** 시키지 않은 리팩토링·추가 기능·예방적 추상화 금지.
- **코드 양을 늘리려 하지 않는다.** 있는 것으로 해결 가능하면 있는 것으로. 새 파일·새 어휘·새 wrapper 는 마지막 수단.

## 추구미 — 단 한 줄

> **모든 산출물은 검증 가능한 선언(declaration)이다 — 명령(instruction)이 아니다.**
>
> 자유도는 버그의 표면적이다. 선언으로 묶을 수 있는 것은 전부 선언으로 묶어 LLM이 같은 결과로 수렴하게 한다.

| # | Invariant | 한 줄 |
|---|-----------|-------|
| 1 | **Schema-first (zod)** | 새 데이터 형태는 zod schema 먼저. 타입은 주석이 아니라 런타임 gate. |
| 2 | **Serializable-first** | 페이지·flow·state 는 plain object 로 왕복 가능. 함수·class·ref 가 들어가면 명령형 잔재. |
| 3 | **One direction** | data → ui → event → reducer → data. 양방향 바인딩·역참조·side channel ❌. |
| 4 | **Headless behavior, Tailwind visuals** | 행동 = `@p/headless` 패턴 (useListboxPattern, useToolbarPattern, useTreeGridPattern, useRovingTabIndex…) · 시각 = Tailwind utility class. 두 축 절대 섞지 않는다. |
| 5 | **Declare, don't assemble** | 큰 화면은 `defineFeature` spec(state·on·query·view) 단일 SSOT. 단순한 화면은 직접 JSX + useState. 두 길 모두 OK. |
| 6 | **Vocabulary closed (ARIA)** | 어휘는 WAI-ARIA/WHATWG 에 닫혀있다. `role="…"`, `aria-*`, semantic HTML 그대로 사용. 새 어휘 만들지 않는다. |
| 7 | **Search before create** | 만들기 전 grep. 동의어가 있으면 그쪽으로 수렴 — 새로 만들면 동의어 드리프트. |

## 0. 시작 전 체크

| 만들 것 | 먼저 할 일 |
|--------|-----------|
| 새 라우트/페이지 | `apps/<app>/src/widgets/` 에 `.tsx` 추가, Tailwind class 직접. 라우트는 `packages/app/src/routes/` |
| 키보드 nav 가 필요한 컬렉션 | `useListboxPattern`·`useToolbarPattern`·`useTreeGridPattern`·`useTreePattern`·`useTabsPattern`·`useMenuPattern`·`useRadioGroupPattern`·`useNavigationListPattern` 중 하나 (`@p/headless/patterns`) |
| 단일 키 단축키 | `useShortcut('mod+k', handler)` (`@p/headless/key/useShortcut`) |
| 자유 위치 roving | `useRovingTabIndex(axis, data, onEvent)` 직접 사용 |
| 복잡한 데이터 흐름 (cache/URL/HMR) | `useResource` (`@p/headless/store`) |
| 화면 단위 spec (state · cmd · query · view) | `defineFeature` + `useFeature` (`@p/headless/store`) |
| 단순 컴포넌트 state | `useState` 직접 |
| 데모 quick-start | `useLocalValue` / `useLocalData` (`@p/headless/local`) |

## 1. 시각 = Tailwind v3

- Tailwind utility class 직접. 별도 토큰 wrapper 만들지 않는다.
- 색은 Tailwind 의 `neutral-{50..900}` · `red`·`emerald`·`blue` 등 기본 팔레트 그대로.
- `prose` 가 필요하면 `@tailwindcss/typography` 추가 (현재 미설치 — 필요 시 설치).
- 임의 값은 `[]` arbitrary syntax: `w-[min(100%,42rem)]`, `grid-rows-[auto_1fr]`.

## 2. 행동 = @p/headless

**Pattern 이름 규약** — `use*Pattern` = 내부에 React state(useState/useRef/useEffect)가 있는 hook, `*Pattern` = 외부 주입만 받는 순수 함수. 이름이 카테고리를 알려준다 (React `rules-of-hooks` 규약). 데이터성 state(checked/value)는 항상 외부 주입, 순수 UI 일시 state(open/timer)는 내부 캡슐화.

핵심 import 경로:
```ts
import {
  useRovingTabIndex, useSpatialNavigation, useActiveDescendant,
  composeAxes, navigate, expand, activate, typeahead,
  fromList, fromTree, pathAncestors,
  useControlState, useEventBridge,
  ROOT, FOCUS, EXPANDED, type NormalizedData, type UiEvent,
} from '@p/headless'

import {
  useResource, defineResource, writeResource,
  useFeature, defineFeature,
} from '@p/headless/store'

import {
  // use*Pattern — 내부에 React state. (data, onEvent) 외부 주입.
  useListboxPattern, useToolbarPattern, useTabsPattern,
  useTreeGridPattern, useTreePattern, useMenuPattern,
  useRadioGroupPattern, useDialogPattern, useComboboxPattern,
  useTooltipPattern,
  // *Pattern — 순수 함수. (value, dispatch) 외부 주입.
  switchPattern, sliderPattern, splitterPattern,
  spinbuttonPattern, navigationListPattern, disclosurePattern,
} from '@p/headless/patterns'

import { useShortcut, onShortcut } from '@p/headless/key/useShortcut'
```

## 3. ARIA — semantic HTML 우선

- `<button>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<header>`, `<footer>`, `<article>`, `<dl>/<dt>/<dd>`, `<table>`, `<ul>/<ol>/<li>` 그대로.
- 컬렉션 패턴: `role="listbox"` + `role="option"`, `role="treegrid"` + `role="row"` + `role="gridcell"|rowheader"`, `role="toolbar"` + `aria-pressed`, etc.
- `aria-selected`, `aria-expanded`, `aria-disabled`, `aria-pressed`, `aria-haspopup`, `aria-current`, `aria-label`, `aria-labelledby`, `aria-controls` — APG 그대로.
- `data-icon` 같은 임의 namespace 만들지 않는다. 아이콘은 inline emoji/SVG 또는 lucide-static (rendered as `<span>`).

## 4. 폴더 규약

- 라우트 = `packages/app/src/routes/<path>.tsx` (TanStack file-based routing).
- 앱 = `apps/<name>/src/widgets/<Name>.tsx` (위젯) · `features/` (data/feature spec) · `entities/` (zod schema).
- 패키지 = `packages/<name>/src/`.
- 복잡한 데이터 흐름은 `useResource` (`@p/headless/store`) 단일 인터페이스. 단순 state 는 `useState` 직접.

## 5. 검증 — 페이지 만들고 끝낼 때

1. `npx tsc --noEmit -p tsconfig.app.json` — 타입
2. `npx vite dev` — 콘솔 에러 0
3. 키보드만으로 모든 인터랙션 가능한지 (Tab + Arrow + Enter + Escape)

## 6. 참조

- `packages/headless/INVARIANTS.md` — 헤드리스 invariant
- `packages/headless/PATTERNS.md` — pattern recipe 시그니처
- 메모리 (사용자 글로벌 누적 규약): `~/.claude/projects/-Users-user-Desktop-ds/memory/MEMORY.md`

**원칙**: minimize choices for LLM — 1 role = 1 ARIA 패턴, prop 이름은 ARIA 그대로. 시각 결정은 Tailwind 에 위임. 새 어휘·새 wrapper 만들기 전에 grep.
