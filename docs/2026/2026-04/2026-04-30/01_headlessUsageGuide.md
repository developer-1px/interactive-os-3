---
id: headlessUsageGuide
type: inbox
slug: headlessUsageGuide
title: "@p/headless 사용 가이드 — 외부 프로젝트 통합"
tags: [inbox, explain, vision]
created: 2026-04-30
updated: 2026-04-30
---

# @p/headless 사용 가이드 — 외부 프로젝트 통합

## 배경

`@p/headless`는 ds 모노레포에서 갓 분리된 단일 패키지로, ARIA 행동 인프라(axes 합성 · roving tabindex · gesture/intent 변환 · FlatLayout 선언적 트리 · Resource 단일 데이터 인터페이스 · feature/middleware)를 모은다. 컴포넌트 어휘(tokens·CSS·UI primitive)에 의존하지 않으므로 다른 프로젝트에서 독립 사용 가능하다. 본 문서는 외부 consumer가 채택할 때의 설치·의존성·API 활용·통합 패턴을 정리한다.

대상 독자: ds 외부에서 React 19 + ARIA-correct 행동 라이브러리를 찾는 개발자. Radix Primitives / Base UI / Ariakit / React Aria 대안.

## 내용

### 1. 위치와 정체성

```
@p/headless = 단일 npm 패키지 (Base UI / Ariakit 식)
```

- **단위**: 1 패키지(컴포넌트 1개당 1 패키지인 Radix와 다름). axis 합성 · roving · FlatLayout이 횡단 인프라라 분해 불가.
- **외부 의존**: `react ^19.0.0` peer 1개. 토큰/CSS/UI 어휘 0건.
- **크기**: ~1,130 LOC, ~30개 export, ~8 카테고리.
- **불변식**: `INVARIANTS.md`에 22개 영속 invariant 박혀있음 (APG 외부 권위 7 + ds 아키텍처 선언 9 + 논리적 필연 3 + 파생 3).

### 2. 설치

#### 워크스페이스 (모노레포)

```jsonc
// package.json (consumer)
{
  "dependencies": {
    "@p/headless": "workspace:*",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

#### 직접 의존 (publish 후)

```bash
npm install @p/headless
# peer
npm install react@^19 react-dom@^19
```

#### Vite alias (모노레포일 때만 필요)

```ts
// vite.config.ts
resolve: {
  alias: [
    { find: /^@p\/headless$/,
      replacement: resolve(__dirname, 'packages/headless/src/index.ts') },
    { find: /^@p\/headless\//,
      replacement: resolve(__dirname, 'packages/headless/src/') + '/' },
  ],
}
```

#### TypeScript paths

```jsonc
// tsconfig.json
"paths": {
  "@p/headless": ["packages/headless/src/index.ts"],
  "@p/headless/*": ["packages/headless/src/*"]
}
```

### 3. API 카테고리 한눈에

| 카테고리 | 핵심 export | 한 줄 |
|---|---|---|
| **Types** | `Entity` · `NormalizedData` · `UiEvent` · `ROOT` · `CollectionProps` · `ControlProps` | 모든 모듈의 데이터 표현 |
| **Axes** | `composeAxes` · `navigate` · `activate` · `expand` · `treeNavigate` · `typeahead` · `parentOf` | 키 → UiEvent 변환 분기 |
| **Roving** | `useRovingTabIndex` · `useSpatialNavigation` · `useActiveDescendant` | APG roving tabindex / spatial navigation / active descendant |
| **Gesture** | `composeGestures` · `navigateOnActivate` · `selectionFollowsFocus` · `expandBranchOnActivate` · `expandOnActivate` · `activateProps` | activate → 의도 변환 |
| **State** | `reduce` · `fromTree` · `fromList` · `pathAncestors` · `useControlState` · `useEventBridge` | Entity tree 상태 |
| **Flow** | `defineFlow` · `useFlow` · `Resource` · `useResource` · `defineResource` · `read/writeResource` | ui ↔ Resource wiring |
| **Feature** | `defineFeature` · `useFeature` · `invalidateQuery` | effect/query 묶음 |
| **Layout** | `definePage` · `defineLayout` · `defineWidget` · `merge` · `node` · `placementAttrs` · `validatePage` | FlatLayout 트리 선언 |
| **Middleware** | `defineMiddleware` | dispatch 파이프라인 훅 |

### 4. 카테고리별 사용 예제

#### 4-1. Types — 데이터 표현

모든 헤드리스 어휘는 `NormalizedData`(entities + relationships) 위에서 동작한다. 페이지·위젯·collection 모두 같은 모양.

```ts
import { type NormalizedData, ROOT } from '@p/headless'

const data: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT, data: { label: 'Fruits' } },
    apple:  { id: 'apple',  data: { label: 'Apple' } },
    banana: { id: 'banana', data: { label: 'Banana' } },
  },
  relationships: { [ROOT]: ['apple', 'banana'] },
}
```

`UiEvent` union(`navigate`/`activate`/`expand`/`select`/`value`/`open`/`typeahead`/`pan`/`zoom`)이 ui ↔ headless 간 유일한 통신 어휘.

#### 4-2. Roving — Tab stop = 1 (APG 강제)

##### data-driven (`useRovingTabIndex`)

```tsx
import { ROOT, useRovingTabIndex, composeAxes, navigate, activate } from '@p/headless'

function MyToolbar({ data, onEvent }) {
  const axis = composeAxes(navigate('horizontal'), activate)
  const { focusId, bindFocus, delegate } = useRovingTabIndex(axis, data, onEvent)

  return (
    <div role="toolbar" onKeyDown={delegate.onKeyDown}>
      {(data.relationships[ROOT] ?? []).map((id) => (
        <button
          key={id}
          ref={bindFocus(id)}
          tabIndex={focusId === id ? 0 : -1}
          onClick={() => onEvent({ type: 'activate', id })}
        >
          {data.entities[id].data?.label}
        </button>
      ))}
    </div>
  )
}
```

##### composition (`useSpatialNavigation`)

JSX-children 자유 컴포넌트(Toolbar/Tabs/Menubar) — DOM에서 tabbable 자동 순회.

```tsx
import { useSpatialNavigation } from '@p/headless'

function MyToolbar() {
  const { ref, onKeyDown } = useSpatialNavigation<HTMLDivElement>(null, {
    orientation: 'horizontal',
  })
  return (
    <div ref={ref} onKeyDown={onKeyDown} role="toolbar">
      <button>A</button>
      <button>B</button>
      <button>C</button>
    </div>
  )
}
```

특수 selector(예: TreeGrid/Listbox 식 `[role="row"]` 묶음):

```ts
useSpatialNavigation(null, {
  orientation: 'both',
  itemSelector: '[role="row"], [role="gridcell"]',
})
```

#### 4-3. Axes — 키 매핑 합성

`composeAxes`로 axis 합성. role별 키 계약은 axis 조합으로 표현.

```ts
import { composeAxes, navigate, activate, expand, typeahead } from '@p/headless'

// Menu APG: vertical arrow + Enter/Space + Right/Left expand + a-z typeahead
const menuAxis = composeAxes(
  navigate('vertical'),
  activate,
  expand,
  typeahead((d, id) => d.entities[id]?.data?.label ?? ''),
)

// Tabs APG: horizontal arrow + Enter/Space (no expand)
const tabsAxis = composeAxes(navigate('horizontal'), activate)

// TreeGrid: 2D + tree expand
const treeGridAxis = composeAxes(treeNavigate, treeExpand, activate)
```

#### 4-4. Gesture — activate → 의도 변환

ui/는 activate 단발만 emit. 소비자가 reducer 직전에 의도(navigate/expand)로 분해.

```ts
import { composeGestures, navigateOnActivate, selectionFollowsFocus, type UiEvent } from '@p/headless'

// selection-follows-focus: focus 이동 시 즉시 select도 발행
const listboxGesture = composeGestures(
  navigateOnActivate,    // click → focus도 같이
  selectionFollowsFocus, // ↑↓로 focus 이동 시 즉시 activate
)

// reducer 직전:
function relay(e: UiEvent) {
  const events = listboxGesture(data, e)
  for (const ev of events) onEvent(ev)
}
```

#### 4-5. State — reducer + bridge

```tsx
import { useControlState, fromList } from '@p/headless'

function Demo() {
  const initial = fromList(
    [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
    { getId: i => i.id, toData: i => ({ label: i.id }) },
  )
  const [data, dispatch] = useControlState(initial)
  return <MyListbox data={data} onEvent={dispatch} />
}
```

#### 4-6. Flow — Resource (선택적)

전역 in-memory store가 필요할 때. 종류별 hook 만들지 않는다 — `useResource(resource, ...args)` 단일 인터페이스.

```ts
import { defineResource, useResource } from '@p/headless'

const userResource = defineResource<User>({
  key: (id: string) => `user:${id}`,
  load: async (id) => fetch(`/api/users/${id}`).then(r => r.json()),
  initial: undefined,
})

function UserView({ id }) {
  const [user, dispatch] = useResource(userResource, id)
  if (!user) return <Spinner />
  return (
    <>
      <h1>{user.name}</h1>
      <button onClick={() => dispatch({ type: 'refetch' })}>Refresh</button>
    </>
  )
}
```

#### 4-7. Feature — effect + query

react-query/redux 슬림 대안.

```ts
import { defineFeature, useFeature } from '@p/headless'

type CartState = { items: string[] }
type CartCmd = { type: 'addItem'; id: string } | { type: 'removeItem'; id: string }

const cartFeature = defineFeature({
  state: { items: [] } as CartState,
  on: {
    addItem: (state: CartState, cmd: Extract<CartCmd, { type: 'addItem' }>) => ({
      items: [...state.items, cmd.id],
    }),
    removeItem: (state: CartState, cmd: Extract<CartCmd, { type: 'removeItem' }>) => ({
      items: state.items.filter((id) => id !== cmd.id),
    }),
  },
  query: () => ({
    products: { key: ['products'], fn: () => fetch('/api/products').then(r => r.json()) },
  }),
  view: (state, queries) => ({ items: state.items, products: queries.products.data ?? [] }),
  effect: (state) => [{ kind: 'title', text: `Cart (${state.items.length})` }],
})

function Cart() {
  const [view, dispatch] = useFeature(cartFeature)
  return (
    <>
      {view.items.map(id => <span key={id}>{id}</span>)}
      <button onClick={() => dispatch({ type: 'addItem', id: 'x' })}>Add</button>
    </>
  )
}
```

#### 4-8. Layout — FlatLayout (선언적 페이지 트리)

페이지 전체를 plain object로. 직렬화 가능, JSX 조립 0줄.

```tsx
import { definePage, ROOT } from '@p/headless'
import { Renderer } from '@p/ds'  // 또는 자체 Renderer

const page = definePage({
  entities: {
    [ROOT]:  { id: ROOT, data: {} },
    main:    { id: 'main',   data: { type: 'Main', flow: 'list' } },
    header:  { id: 'header', data: { type: 'Header' } },
    title:   { id: 'title',  data: { type: 'Text', variant: 'h1', content: 'Hello' } },
    ctaBtn:  { id: 'ctaBtn', data: { type: 'Ui', component: 'Button', props: { children: 'Go' } } },
  },
  relationships: {
    [ROOT]:  ['main'],
    main:    ['header', 'ctaBtn'],
    header:  ['title'],
  },
})

export function MyPage() { return <Renderer page={page} /> }
```

다이나믹 슬롯/widget 합성:

```ts
import { defineLayout, defineWidget, merge } from '@p/headless'

const shell = defineLayout(() => ({ /* nav + main + content slot */ }))
const cartWidget = defineWidget(() => ({ /* aside landmark */ }))
const finalPage = merge(shell(), cartWidget())
```

#### 4-9. Middleware — dispatch 파이프라인

```ts
import { defineMiddleware } from '@p/headless'

const logging = defineMiddleware({
  pre: (ctx) => { console.log('[event]', ctx.event); return ctx.event },
  post: (ctx) => { /* state 변경 후 effect */ },
})
```

### 5. 통합 패턴 — Consumer UI Registry Augmentation

`UiNode.component`는 기본적으로 `string`이지만, consumer가 자기 컴포넌트 이름 set을 augment하면 빌드 타임에 미등록 이름을 잡아낸다.

#### 5-1. 패턴 (TanStack Router·Vite·Zod 식)

```ts
// myProject/registry.ts
import { Button, Input, Switch } from './ui'

export const uiRegistry = {
  Button:  { component: Button },
  Input:   { component: Input },
  Switch:  { component: Switch },
} as const

declare module '@p/headless/layout/nodes' {
  interface Register {
    component: keyof typeof uiRegistry  // → 'Button' | 'Input' | 'Switch'
  }
}
```

이후 `definePage`에서:

```ts
{ id: 'foo', data: { type: 'Ui', component: 'Button' } }    // ✓
{ id: 'bar', data: { type: 'Ui', component: 'TypoBtn' } }   // ✗ 빌드 에러
```

augmentation을 하지 않으면 `string`으로 fallback — headless는 컴포넌트 어휘를 모르는 상태로 컴파일된다.

#### 5-2. Renderer는 consumer 책임

`@p/headless/layout`은 *선언* 어휘만 제공한다. 실제 렌더링은 consumer가:

```tsx
import { useDebugTree, type NormalizedData } from '@p/headless'
import { uiRegistry } from './registry'

export function MyRenderer({ page }: { page: NormalizedData }) {
  useDebugTree(page)
  // node.data.type 별 분기 + uiRegistry[node.data.component] 해결
  return <NodeView page={page} id={ROOT} />
}
```

`@p/ds/ui/Renderer.tsx`가 reference impl이고, 자기 어휘에 맞춰 own renderer를 작성하면 된다.

### 6. 22개 invariant 요약 (필독)

`packages/headless/src/INVARIANTS.md`에 전문. 핵심:

| # | invariant | 의미 |
|---|---|---|
| 1 | roving group 당 Tab stop = 1개 | APG 외부 권위 |
| 9 | wrap = 항상 true | 끝→처음 순환은 선택 아님 |
| 10 | focusId는 data 전체에 1개 | tree 안 단일 focus |
| 11 | 포커스는 실제 DOM element | aria-activedescendant는 Combobox 1곳 예외 |
| 13 | Trigger = key | click 두 종류 | touch/pointer는 click으로 흡수 |
| 16 | ui/는 activate 단발 emit | intent 변환은 소비자 담당 |

이를 깨는 변경은 버그 또는 정책 전환이지 개선이 아니다.

### 7. 차별점 — 왜 @p/headless인가

| 비교 | Radix Primitives | Ariakit | React Aria | **@p/headless** |
|---|---|---|---|---|
| 단위 | per-primitive 패키지 50+ | 단일 패키지 | per-primitive | **단일 패키지** |
| 합성 모델 | hook 묶음 | hook 묶음 | StateAdapter | **axis 합성 (composeAxes)** |
| 페이지 선언 | ❌ | ❌ | ❌ | **✓ FlatLayout (definePage)** |
| 데이터 어휘 | 컴포넌트별 | 컴포넌트별 | 컴포넌트별 | **NormalizedData 단일** |
| Tab stop 강제 | hook | hook | hook | **invariant 22개 + linter** |

핵심: "컴포넌트 50개"가 아니라 "**axis 합성 + entity tree 페이지 선언**"이 한 패키지에 묶인 형태.

### 8. 검증 도구 (consumer가 채택 가능)

ds 모노레포에 있는 audit 스크립트들 — headless를 채택한 consumer도 같은 검사 가능:

| 스크립트 | 검사 |
|---|---|
| `lint:ds:keyboard` | `role=*` 마크업이 useRovingTabIndex/useSpatialNavigation/composeAxes/onKeyDown 중 하나 부착했는지 |
| `audit:hmi` | hierarchy 단조성 invariant (visual gestalt) |
| `audit:keyline` | sibling 간 시각 정렬 invariant |
| `audit:kbd` | APG 키 시퀀스 동작 (puppeteer) |

각 스크립트는 50~250 LOC라 consumer가 자기 프로젝트 디렉토리에 맞춰 fork 가능.

### 9. 마이그레이션 체크리스트 (Radix → @p/headless)

- [ ] React 19 peer 확인
- [ ] 컴포넌트 어휘를 직접 작성 (registry로 augment)
- [ ] 모든 collection을 `(data, onEvent)` 단일 인터페이스로 통일
- [ ] JSX-children 자유 컴포넌트는 `useSpatialNavigation`으로 전환
- [ ] role 마다 axis 조합을 `composeAxes`로 1줄 선언
- [ ] page 시각 골격을 `definePage` entity tree로 작성
- [ ] `validatePage`/`validateFragment` dev gate 켜기

### 10. 알려진 제약

- **single-instance shells**(sidebar/command palette 등)는 ds의 `shells/` 영역에 캡슐화 — headless는 행동 layer만 다룬다. 전역 shell은 consumer가 own.
- **CSS·tokens** 공급 안 함 — visual layer는 별도 (ds tokens 또는 자체 시스템).
- **테스트 인프라 미포함** — vitest 등은 consumer가 추가. ds 모노레포의 `audit-kbd-conformance.mjs`가 puppeteer 기반 자동 검증 reference.
