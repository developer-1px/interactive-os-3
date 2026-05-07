---
id: headlessAriaIntegration
type: inbox
slug: headlessAriaIntegration
title: "@p/aria-kernel × aria-design-system 통합 — ARIA만으로 동작 만들기"
tags: [inbox, explain, vision]
created: 2026-04-30
updated: 2026-04-30
---

# @p/aria-kernel × aria-design-system 통합

대상: `/Users/user/Documents/New project` (`aria-design-system`).
**목표**: 컴포넌트마다 들어있는 `*.aria.ts` 선언만으로 키보드/포커스/state 동작을 자동 공급.

이 프로젝트는 ARIA 어휘를 SSOT로 두고 (`src/accessibility/`, `*.aria.ts`) 컴포넌트를 직접 짜는 구조다 (`useState`/`useId`/직접 onKeyDown). headless가 들어가면 *행동* 책임이 ARIA 선언에서 자동 도출되어, 컴포넌트는 *시각*만 책임진다.

## 배경

이 프로젝트의 기존 패턴 예:

```ts
// Tabs.aria.ts (SSOT — 변경 없음)
export const tabsAriaPattern = {
  name: "tabs",
  source: apg("tabs"),
  roles: [{ role: "tablist" }, { role: "tab" }, { role: "tabpanel" }],
  parts: ["tablist", "tab", "tabpanel"],
  keyboard: ["Tab", "ArrowRight", "ArrowLeft", "Home", "End", "Enter", "Space"],
  assertions: [...],
} satisfies AriaComponentPattern
```

```tsx
// Tabs.tsx (현재 — useState + 수동 onKeyDown 작성)
const [active, setActive] = useState('overview')
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') { ... }
  if (e.key === 'ArrowLeft')  { ... }
  // 16줄
}
```

목표 후:

```tsx
// Tabs.tsx (after — 행동은 headless가)
const [data, onEvent] = useControlState(initial)
const { focusId, bindFocus, delegate } = useRovingTabIndex(tabsBehavior.axis, data, onEvent)
return <div role="tablist" {...delegate}>{/* render */}</div>
```

## 내용

### 1. 설치 (workspace 또는 npm)

```bash
# workspace (권장 — ds 모노레포 옆에 두기)
npm install @p/aria-kernel@workspace:*

# 또는 publish 후
npm install @p/aria-kernel
```

```jsonc
// tsconfig.json — paths
"paths": {
  "@p/aria-kernel": ["../ds/packages/aria-kernel/src/index.ts"],
  "@p/aria-kernel/*": ["../ds/packages/aria-kernel/src/*"]
}
```

```ts
// vite.config.ts — alias (모노레포일 때만)
resolve: {
  alias: [
    { find: /^@p\/headless$/,
      replacement: resolve(__dirname, '../ds/packages/aria-kernel/src/index.ts') },
    { find: /^@p\/headless\//,
      replacement: resolve(__dirname, '../ds/packages/aria-kernel/src/') + '/' },
  ],
}
```

### 2. 통합 구조 — `*.aria.ts` 옆에 `*.behavior.ts`

각 `*.aria.ts`는 그대로 유지. 옆에 동작 매핑 파일을 추가한다 — naming convention:

```
src/components/patterns/navigation/Tabs/
├── Tabs.aria.ts        ← ARIA SSOT (기존)
├── Tabs.behavior.ts    ← headless axis 매핑 (신규)
├── Tabs.tsx            ← 시각 + behavior 소비 (개정)
├── Tabs.types.ts
└── index.ts
```

`*.behavior.ts`는 **`*.aria.ts`의 keyboard·roles 배열을 보고 손으로 axis 조합을 선언**한다. 자동 도출은 ARIA의 미묘한 변형(selection-follows-focus 여부, typeahead 유무, expand semantics 등)을 못 잡으므로 *수동 매핑이 정본*이다.

#### 예: Tabs.behavior.ts

```ts
// Tabs.behavior.ts
import { composeAxes, navigate, activate } from '@p/aria-kernel'
import { tabsAriaPattern } from './Tabs.aria'

// keyboard: ["ArrowRight", "ArrowLeft", "Home", "End", "Enter", "Space"]
//                ↓ navigate('horizontal')      ↓ activate
export const tabsBehavior = {
  axis: composeAxes(navigate('horizontal'), activate),
  pattern: tabsAriaPattern,         // ARIA contract reference
} as const
```

assertions은 그대로 SSOT(`*.aria.ts`)에 있어 `check-aria-contracts.ts`가 검증한다 — behavior는 ARIA 선언에서 *벗어나지 못한다*.

### 3. 패턴별 ARIA → headless 매핑 레시피

이 프로젝트의 모든 패턴을 7개 family로 분류하고 axis 조합을 적는다.

#### 3-1. Toggle (button + aria-expanded) — Disclosure / Tooltip / MenuButton trigger

ARIA: `keyboard: ["Enter", "Space"]`
**headless 불필요** — `useState` + native `<button>`로 충분. 단일 토글이라 axis 합성이 과함.

기존 `Disclosure.tsx`를 그대로 두라. headless를 강제하지 않는다.

#### 3-2. Linear collection (1차원 roving) — Tabs / Toolbar / RadioGroup / Menubar(top)

ARIA: `keyboard: ["ArrowLeft", "ArrowRight", "Home", "End", "Enter", "Space"]`

```ts
// Tabs / Toolbar (selection-follows-focus 없음)
import { composeAxes, navigate, activate } from '@p/aria-kernel'
export const axis = composeAxes(navigate('horizontal'), activate)

// RadioGroup (selection-follows-focus — ↑↓ 이동 시 즉시 선택)
import { composeAxes, navigate, activate } from '@p/aria-kernel'
import { composeGestures, selectionFollowsFocus } from '@p/aria-kernel'
export const axis = composeAxes(navigate('horizontal'), activate)
export const gesture = composeGestures(selectionFollowsFocus)
```

vertical 변형(Listbox / Menu)은 `navigate('vertical')`로.

#### 3-3. Listbox (vertical roving + typeahead)

ARIA: `keyboard: ["ArrowDown", "ArrowUp", "Home", "End", "Enter", "Space", "a-z"]`

```ts
import { composeAxes, navigate, activate, typeahead } from '@p/aria-kernel'
export const axis = composeAxes(
  navigate('vertical'),
  activate,
  typeahead((d, id) => (d.entities[id]?.data?.label as string) ?? ''),
)
```

#### 3-4. Menu / Menubar (popup + roving)

ARIA: `keyboard: ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End", "Enter", "Space", "Escape"]`

```ts
import { composeAxes, navigate, activate, expand, typeahead } from '@p/aria-kernel'
export const axis = composeAxes(
  navigate('vertical'),
  activate,
  expand,                    // ArrowRight/Left → submenu open/close
  typeahead((d, id) => (d.entities[id]?.data?.label as string) ?? ''),
)
```

`Escape`는 popup close — 이건 popup container(예: `<dialog>` / FloatingUI)가 책임. headless는 popup lifecycle 관여 안 함.

#### 3-5. Tree (vertical roving + level-aware expand)

ARIA: `keyboard: ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End", "Enter", "Space", "Asterisk"]`

```ts
import { composeAxes, treeNavigate, treeExpand, activate } from '@p/aria-kernel'
export const axis = composeAxes(treeNavigate, treeExpand, activate)
```

`treeNavigate`/`treeExpand`는 level/parent/child 인지 — `navigate`와 다르다.

#### 3-6. Grid / TreeGrid (2차원)

ARIA: `keyboard: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown", "Enter", "Space"]`

```ts
// Grid — useSpatialNavigation (composition 기반)
import { useSpatialNavigation } from '@p/aria-kernel'

const { ref, onKeyDown } = useSpatialNavigation<HTMLTableElement>(null, {
  orientation: 'both',
  itemSelector: '[role="gridcell"], [role="columnheader"], [role="rowheader"], [role="row"]',
})
```

#### 3-7. Combobox / Slider / SpinButton — 특수

각자 자체 axis를 받지 않거나(Combobox는 input + listbox 조합) value 축이 다름(Slider/SpinButton).

```ts
// Combobox — input은 그대로, listbox 부분만 axis 적용
import { composeAxes, navigate, activate } from '@p/aria-kernel'
export const listboxAxis = composeAxes(navigate('vertical'), activate)
// + aria-activedescendant 패턴 (focus는 input에 머무름)
```

```ts
// Slider — headless axis 부적합. native <input type="range"> 사용.
// SpinButton — native <input type="number"> 사용 (role=spinbutton implicit).
```

### 4. 컴포넌트 마이그레이션 템플릿

#### Before (현재 Tabs.tsx — 추정)

```tsx
function Tabs({ items }: TabsProps) {
  const [active, setActive] = useState(items[0].id)

  function onKeyDown(e: React.KeyboardEvent) {
    const i = items.findIndex(t => t.id === active)
    if (e.key === 'ArrowRight') setActive(items[(i + 1) % items.length].id)
    if (e.key === 'ArrowLeft')  setActive(items[(i - 1 + items.length) % items.length].id)
    if (e.key === 'Home')       setActive(items[0].id)
    if (e.key === 'End')        setActive(items[items.length - 1].id)
  }

  return (
    <div role="tablist" onKeyDown={onKeyDown}>
      {items.map(t => (
        <button key={t.id} role="tab"
          aria-selected={t.id === active}
          tabIndex={t.id === active ? 0 : -1}
          onClick={() => setActive(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  )
}
```

#### After (headless 적용)

```tsx
import { useControlState, useRovingTabIndex, fromTree, ROOT } from '@p/aria-kernel'
import { tabsBehavior } from './Tabs.behavior'

function Tabs({ items }: TabsProps) {
  const initial = fromTree(items, {
    getId:  i => i.id,
    toData: i => ({ label: i.label }),
    focusId: items[0]?.id,
  })
  const [data, onEvent] = useControlState(initial)
  const { focusId, bindFocus, delegate } = useRovingTabIndex(tabsBehavior.axis, data, onEvent)
  const ids = data.relationships[ROOT] ?? []

  return (
    <div role="tablist" {...delegate}>
      {ids.map(id => (
        <button
          key={id}
          ref={bindFocus(id)}
          data-id={id}                                    // 필수 (delegate가 closest 위임)
          role="tab"
          aria-selected={focusId === id}
          tabIndex={focusId === id ? 0 : -1}
        >
          {data.entities[id].data?.label as string}
        </button>
      ))}
    </div>
  )
}
```

차이:
- 키 매핑 16줄 → `tabsBehavior.axis` 1줄
- state 선언이 ARIA 어휘 (NormalizedData + UiEvent) 직접 사용
- ARIA 키 추가/제거는 `Tabs.behavior.ts`만 수정

### 5. ARIA contract 준수 자동 검증

이 프로젝트의 `check-aria-contracts.ts`는 `*.aria.ts`의 assertions이 구현 코드에 반영됐는지 본다. headless 도입 후에도:

1. `*.aria.ts`는 그대로 SSOT — 변경 금지
2. `*.behavior.ts`는 ARIA spec의 keyboard 배열을 *모두* 커버해야 함
3. 추가 검증 스크립트 가능: `tooling/validation/check-behavior-coverage.ts` — keyboard 배열의 각 키가 axis 조합에서 처리되는지 확인

```ts
// 의사 코드
const aria = ['ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', 'Space']
const handled = keysFromAxis(tabsBehavior.axis)
// ['ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', 'Space']
assert(aria.every(k => handled.includes(k)))
```

axis 조합으로부터 처리 키 추론은 headless의 axis 모듈에서 메타데이터 export가 필요 — 현재 없음. 일단 수동 cross-check로 충분.

### 6. NormalizedData ↔ 기존 props 변환

이 프로젝트의 컴포넌트는 `items: TabItem[]` 같은 props를 받는다. headless는 `NormalizedData`를 받는다. 다리:

```ts
import { fromTree, ROOT } from '@p/aria-kernel'

const initial = fromTree<TabItem>(items, {
  getId:  i => i.id,
  toData: i => ({ label: i.label, disabled: i.disabled }),  // entity.data로 들어감
  focusId: items[0]?.id,
})
// → { entities: { ROOT, [id]: { id, data: { label, disabled } } }, relationships: { ROOT: [id...] } }
```

tree 구조면 `fromTree`. URL이나 외부 store가 진실 원천이면 `defineFlow` + `useFlow`.

```ts
import { defineFlow } from '@p/aria-kernel'

const tabsFlow = defineFlow({
  source: tabsResource,                    // URL/store/in-memory
  base: (value) => fromTree(value?.items ?? [], { ... }),
  gestures: composeGestures(selectionFollowsFocus),  // selection-follows-focus 등
})
const [data, onEvent] = useFlow(tabsFlow)
```

### 7. 통합 채택 순서 (권장)

1. **Tabs 1개 패턴부터** — 가장 명확한 ARIA → axis 매핑. 마이그레이션 비용 작음
2. 동작 검증 (수동 키보드 테스트 + check-aria-contracts 통과)
3. **Listbox / RadioGroup / Toolbar** — 같은 family 식 확산
4. **Menu / Tree** — popup/level 인지 추가
5. **Grid / TreeGrid** — 2D, useSpatialNavigation 사용
6. Disclosure / Tooltip / Slider / SpinButton 등은 그대로 유지 (headless 불필요)

### 8. 주의 — UI registry augmentation은 선택

ds 모노레포는 `definePage` 식 entity-tree로 페이지 전체를 선언한다. 이 프로젝트는 그 방식을 쓰지 *않을* 수 있다 — 컴포넌트 단위로만 headless 채택해도 충분.

definePage 식을 채택하지 않는다면:
- `@p/aria-kernel/layout` 모듈은 사용 안 함
- `Register` augmentation 불필요
- `validatePage` 등 dev gate 불필요

대신 컴포넌트 단위로:
- `useControlState` (state)
- `useRovingTabIndex` / `useSpatialNavigation` (roving)
- `composeAxes` (axis 합성)
- `composeGestures` (intent 변환)

이 4개 모듈만 채택하면 된다.

### 9. 한 줄 요약

> ARIA `keyboard` 배열 → `composeAxes(navigate(orient), activate, expand?, typeahead?)`.
> ARIA `role` family → `useRovingTabIndex` (data) 또는 `useSpatialNavigation` (composition).
> ARIA `selection-follows-focus` 같은 미묘한 의도 → `composeGestures`.
> ARIA assertions → `*.aria.ts` SSOT가 그대로 검증 책임.

**컴포넌트는 시각만 책임진다. 행동은 ARIA 선언에서 자동 따라온다.**
