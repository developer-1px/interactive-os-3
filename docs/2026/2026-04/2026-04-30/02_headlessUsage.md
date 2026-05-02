---
id: headlessUsage
type: inbox
slug: headlessUsage
title: "@p/headless usage — 실제 API 기반 사용법"
tags: [inbox, explain]
created: 2026-04-30
updated: 2026-04-30
---

# @p/headless usage

소스 파일을 직접 읽고 정정한 사용 가이드. 모든 시그니처는 `packages/headless/src/`에서 검증됨.

## 설치

```jsonc
// package.json
{
  "dependencies": { "@p/headless": "workspace:*" },
  "peerDependencies": { "react": "^19.0.0" }
}
```

`@p/headless`만 받으면 충분하다. tokens·CSS·UI 어휘 0건.

## API 한 눈에

```ts
import {
  // types
  ROOT, type Entity, type NormalizedData, type UiEvent,
  type CollectionProps, type ControlProps,

  // axes
  composeAxes, navigate, activate, expand, typeahead,
  treeNavigate, treeExpand, parentOf,

  // roving
  useRovingTabIndex, useSpatialNavigation, useActiveDescendant,

  // gesture
  composeGestures, navigateOnActivate, selectionFollowsFocus,
  expandBranchOnActivate, expandOnActivate, activateProps,

  // state
  reduce, fromTree, fromList, pathAncestors,
  useControlState, useEventBridge,

  // flow (Resource + ui ↔ resource wiring)
  defineResource, useResource, readResource, writeResource,
  defineFlow, useFlow,

  // feature (state machine + queries + effects)
  defineFeature, useFeature, invalidateQuery,

  // layout (FlatLayout)
  definePage, defineLayout, defineWidget, merge,
  node, placementAttrs, validatePage, validateFragment,

  // middleware
  defineMiddleware,
} from '@p/headless'
```

## 1. Types — NormalizedData

모든 어휘의 데이터 모양.

```ts
const data: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT, data: { label: 'Fruits' } },
    apple:  { id: 'apple',  data: { label: 'Apple' } },
    banana: { id: 'banana', data: { label: 'Banana' } },
  },
  relationships: { [ROOT]: ['apple', 'banana'] },
}
```

`UiEvent` union: `{ type: 'navigate' | 'activate' | 'expand' | 'select' | 'value' | 'open' | 'typeahead' | 'pan' | 'zoom' }` — ui ↔ headless 통신 어휘.

## 2. Roving — Tab stop = 1

### data-driven (`useRovingTabIndex`)

```tsx
import {
  ROOT, useRovingTabIndex, composeAxes, navigate, activate,
  type CollectionProps,
} from '@p/headless'

function MyToolbar({ data, onEvent }: CollectionProps) {
  const axis = composeAxes(navigate('horizontal'), activate)
  const { focusId, bindFocus, delegate } = useRovingTabIndex(axis, data, onEvent)
  const ids = data.relationships[ROOT] ?? []

  return (
    <div role="toolbar" {...delegate}>
      {ids.map((id) => (
        <button
          key={id}
          ref={bindFocus(id)}                         // ref callback
          data-id={id}                                // delegate가 data-id 기반
          tabIndex={focusId === id ? 0 : -1}
        >
          {data.entities[id].data?.label as string}
        </button>
      ))}
    </div>
  )
}
```

핵심:
- `useRovingTabIndex`는 `{ focusId, bindFocus, delegate }` 반환
- **`data-id` 속성이 필수** — `delegate`가 closest `[data-id]`로 이벤트 위임
- `bindFocus(id)`는 ref callback `(el: HTMLElement | null) => void` 반환
- `{...delegate}`로 onClick/onKeyDown 한 번에 부착

### composition (`useSpatialNavigation`)

JSX-children 자유 컴포넌트(Toolbar/Tabs/Menubar).

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

옵션:
```ts
useSpatialNavigation(null, {
  orientation: 'horizontal' | 'vertical' | 'both',
  homeEnd: true,           // 기본
  wrap: true,              // 기본 — 끝→처음 순환
  itemSelector: '[role="row"], [role="gridcell"]',  // 비-tabbable item 명시
})
```

## 3. Axes — composeAxes로 키 매핑 합성

```ts
import { composeAxes, navigate, activate, expand, typeahead } from '@p/headless'

// Menu APG: vertical arrow + Enter/Space + Right/Left expand + a-z typeahead
const menuAxis = composeAxes(
  navigate('vertical'),
  activate,
  expand,
  typeahead((d, id) => (d.entities[id]?.data?.label as string) ?? ''),
)

// Tabs APG
const tabsAxis = composeAxes(navigate('horizontal'), activate)

// TreeGrid APG (2D + tree expand)
const treeGridAxis = composeAxes(treeNavigate, treeExpand, activate)
```

## 4. Gesture — activate → 의도 변환

ui/는 activate 단발만 emit. 소비자가 reducer 직전에 의도(navigate/expand)로 분해.

```ts
import { composeGestures, navigateOnActivate, selectionFollowsFocus, type UiEvent } from '@p/headless'

// selection-follows-focus (single-select listbox/tabs 기본)
const listboxGesture = composeGestures(
  navigateOnActivate,    // click 시 focus도 함께
  selectionFollowsFocus, // ↑↓로 focus 이동 시 즉시 activate
)

const onIntent = (e: UiEvent) => {
  const events = listboxGesture(data, e)
  for (const ev of events) onEvent(ev)
}
```

DOM 측 entry helper:

```ts
import { activateProps } from '@p/headless'

<div role="row" {...activateProps(() => onActivate(rowId))} />
// → onClick + onKeyDown(Enter/Space) 합류된 단일 콜백
```

## 5. State — reducer + bridge

```tsx
import { useControlState, fromTree } from '@p/headless'

function Demo() {
  const initial = fromTree(
    [{ id: 'a', label: 'Apple' }, { id: 'b', label: 'Banana' }],
    { getId: i => i.id, toData: i => ({ label: i.label }) },
  )
  const [data, onEvent] = useControlState(initial)
  return <MyListbox data={data} onEvent={onEvent} />
}
```

`reduce(d, e)`는 pure — 외부에서도 직접 사용 가능.

## 6. Resource — 단일 데이터 인터페이스

```tsx
import { defineResource, useResource } from '@p/headless'

const userResource = defineResource<User, [string]>({
  key: (id) => `user:${id}`,
  load: async (id) => fetch(`/api/users/${id}`).then(r => r.json()),
})

function UserView({ id }: { id: string }) {
  const [user, dispatch] = useResource(userResource, id)
  return (
    <>
      {user ? <h1>{user.name}</h1> : <Spinner />}
      <button onClick={() => dispatch({ type: 'refetch' })}>Refresh</button>
      <button onClick={() => dispatch({ type: 'invalidate' })}>Clear</button>
    </>
  )
}
```

`ResourceEvent`: `{ type: 'set' | 'patch' | 'refetch' | 'invalidate' }`.

컴포넌트 외부 access:
```ts
readResource(r, id)            // 현재 값 (구독 없음)
writeResource(r, value, id)    // 직접 쓰기 (HMR 콜백 등)
```

## 7. Flow — ui ↔ Resource wiring

```ts
import { defineFlow, useFlow } from '@p/headless'

const userFlow = defineFlow({
  source: userResource,
  base: (user) => ({                        // value → NormalizedData
    entities: user
      ? { [ROOT]: { id: ROOT, data: { label: user.name } } }
      : { [ROOT]: { id: ROOT, data: {} } },
    relationships: { [ROOT]: [] },
  }),
  // 옵션:
  // gestures: composeGestures(selectionFollowsFocus),
  // metaScope: ['navigate', 'typeahead'],   // ds-meta로만 흘릴 event
})

function UserView({ id }: { id: string }) {
  const [data, onEvent] = useFlow(userFlow, id)
  return <MyComponent data={data} onEvent={onEvent} />
}
```

`source.onEvent`가 정의돼있으면 ui event → 다음 value 매퍼로 작동.

## 8. Feature — state machine + queries + effects

Redux-스러운 reducer + reactive query + reactive effect 결합.

```ts
import { defineFeature, useFeature } from '@p/headless'

type CartState = { items: string[] }
type CartCmd = { type: 'add'; id: string } | { type: 'remove'; id: string }

const cart = defineFeature({
  state: { items: [] } as CartState,
  on: {
    add:    (s, p) => ({ items: [...s.items, p.id] }),
    remove: (s, p) => ({ items: s.items.filter(i => i !== p.id) }),
  },
  // 옵션:
  query:  (s) => ({ /* QuerySpec map */ }),
  view:   (s, q) => ({ count: s.items.length, items: s.items }),
  effect: (s) => [/* Effect[] — prev/next diff 후 실행 */],
})

function Cart() {
  const [view, dispatch] = useFeature(cart)
  return (
    <>
      <span>Items: {view.count}</span>
      <button onClick={() => dispatch({ type: 'add', id: 'x' })}>Add</button>
    </>
  )
}
```

핵심:
- 반환은 **`[view, dispatch]`** — state는 직접 노출 안 함
- `view`는 `(state, queryResults) → ViewModel` 의 결과
- `effect`는 prev/next diff로 실행 (같은 effect는 재발동 안 함)

쿼리 무효화:
```ts
import { invalidateQuery } from '@p/headless'
invalidateQuery(['queryName'])
```

## 9. Layout — FlatLayout

페이지 트리를 plain object로 선언.

```tsx
import { definePage, ROOT } from '@p/headless'
import { Renderer } from '@p/ds'  // 또는 자체 Renderer

const page = definePage({
  entities: {
    [ROOT]:  { id: ROOT, data: {} },
    main:    { id: 'main',   data: { type: 'Main', flow: 'list' } },
    title:   { id: 'title',  data: { type: 'Text', variant: 'h1', content: 'Hello' } },
    btn:     { id: 'btn',    data: { type: 'Ui', component: 'Button', props: { children: 'Go' } } },
  },
  relationships: {
    [ROOT]: ['main'],
    main:   ['title', 'btn'],
  },
})

export const MyPage = () => <Renderer page={page} />
```

### Layout/Widget builder + merge

```ts
import { defineLayout, defineWidget, merge } from '@p/headless'

// builder는 함수 — props로 fragment 생성
const shell = defineLayout<{ title: string }>(({ title }) => ({
  entities: {
    [ROOT]: { id: ROOT, data: {} },
    main:   { id: 'main',  data: { type: 'Main' } },
    h1:     { id: 'h1',    data: { type: 'Text', variant: 'h1', content: title } },
    body:   { id: 'body',  data: { type: 'Column', flow: 'form' } }, // slot
  },
  relationships: { [ROOT]: ['main'], main: ['h1', 'body'] },
}))

const cartWidget = defineWidget(() => ({
  entities: {
    body:  { id: 'body',  data: { /* 상위 layout의 'body' slot 자리 */ } },
    cart:  { id: 'cart',  data: { type: 'Aside', label: 'Cart' } },
  },
  relationships: { body: ['cart'] },
}))

const final = merge(shell({ title: 'Home' }), cartWidget())
```

dev gate: `defineLayout`/`defineWidget`은 `import.meta.env.DEV`일 때 자동으로 `validateFragment`(layout-forbidden / widget-landmark / cycle / unknown type) 호출.

수동 검증:
```ts
validatePage(page)                    // page 전체 — orphan/cycle/unknown
validateFragment(frag, 'layout')      // Nav/Aside/Ui 금지
validateFragment(frag, 'widget')      // landmark 1개 이상 owner
```

## 10. UI Registry Augmentation (선택)

`UiNode.component`를 등록된 이름으로만 좁히고 싶을 때:

```ts
// myProject/registry.ts
import { Button, Input } from './ui'

export const uiRegistry = {
  Button: { component: Button },
  Input:  { component: Input },
} as const

declare module '@p/headless/layout/nodes' {
  interface Register {
    component: keyof typeof uiRegistry  // 'Button' | 'Input'
  }
}
```

augment 후:
```ts
{ id: 'foo', data: { type: 'Ui', component: 'Button' } }    // ✓
{ id: 'bar', data: { type: 'Ui', component: 'TypoBtn' } }   // ✗ 빌드 에러
```

augment 안 하면 `string`으로 fallback — headless는 기본 컴파일 가능.

## 11. Middleware — dispatch 파이프라인

```ts
import { defineMiddleware } from '@p/headless'

const logging = defineMiddleware({
  name: 'logging',
  phase: 'pre-dispatch',
  fn: (ctx) => {
    console.log('[event]', ctx.event)
    return [ctx.event]   // pre-dispatch는 UiEvent[] 반환 가능 (변환/필터)
  },
})

const undoStack = defineMiddleware({
  name: 'undo-stack',
  phase: 'post-dispatch',
  fn: (ctx) => { stack.push({ prev: ctx.prev, cmd: ctx.cmd }) },
})
```

phase: `'pre-dispatch'` (reducer 직전) | `'post-dispatch'` (reducer 직후) | `'pre-resource-read'` | `'post-resource-write'`.

플러그인 매니페스트의 `middlewares` 배열로 등록.

## 12. CollectionProps / ControlProps 인터페이스

자체 컴포넌트 작성 시 따를 표준 prop 모양:

```ts
import type { CollectionProps, ControlProps } from '@p/headless'

// 컬렉션 (data-driven, roving 대상)
function MyListbox(props: CollectionProps & { 'aria-label': string }) {
  const { data, onEvent, autoFocus } = props
  // ...
}

// 단일 control (Dialog/Disclosure 등)
function MyDialog(props: ControlProps & { children?: React.ReactNode }) {
  const { data, onEvent, children } = props
  // ...
}
```

## 13. Renderer는 consumer 책임

`@p/headless/layout`은 *선언* 어휘만 제공. 렌더링은 consumer가 담당.

`@p/ds/ui/Renderer.tsx`가 reference impl(355 LOC). 자기 어휘에 맞춰 own renderer 작성 가능 — `node.data.type` 별 분기 + `uiRegistry[node.data.component]` 해결.

## 14. 22개 invariant

`packages/headless/src/INVARIANTS.md`에 전문. 핵심:

| invariant | 의미 |
|---|---|
| roving group 당 Tab stop = 1개 | APG 외부 권위 |
| wrap = 항상 true | 끝→처음 순환 |
| focusId는 data 전체에 1개 | 단일 focus |
| 포커스는 실제 DOM element | aria-activedescendant는 Combobox 1곳 예외 |
| ui/는 activate 단발 emit | intent 변환은 소비자 담당 |

위반은 버그 또는 정책 전환 — 개선이 아니다.
