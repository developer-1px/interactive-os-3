---
id: headlessPatternUsageApi
type: inbox
slug: headlessPatternUsageApi
title: '@p/headless usage API — LLM pit of success 명세'
tags: [inbox, headless, api, llm, usage, patterns]
created: 2026-05-02
updated: 2026-05-02
---

# @p/headless usage API — LLM pit of success 명세

## 목표

`@p/headless`의 canonical usage는 LLM이 한 번 보고 같은 형태로 수렴해야 한다.

원칙:

- **단일화할 것**: 호출 문법, config 구조, controller 반환 구조, props 병합 방식
- **단일화하지 말 것**: ARIA/APG 의미 어휘 (`tab`, `option`, `treeitem`, `tabpanel` 등)
- **완성품의 의미**: styled JSX component가 아니라 완성된 behavior controller
- **시각 책임**: DOM 밀도, className, tokens, layout은 `aria-design-system` 소유

한 줄:

```ts
const ui = usePattern(pattern, config)
```

패턴이 바뀌어도 문법은 바뀌지 않는다. 다만 `part`, `state`, `event`, `options`는 pattern별로 닫힌 타입이다.

## Canonical API

```ts
import { usePattern } from '@p/headless'

const ui = usePattern('tabs', {
  items,
  state,
  defaultState,
  onStateChange,
  options,
})
```

타입 모델:

```ts
type Pattern =
  | 'listbox'
  | 'tabs'
  | 'tree'
  | 'treegrid'
  | 'combobox'
  | 'menu'
  | 'menubar'
  | 'toolbar'
  | 'radiogroup'
  | 'switch'
  | 'slider'
  | 'splitter'
  | 'disclosure'
  | 'accordion'
  | 'dialog'
  | 'tooltip'
  | 'alert'
  | 'alertdialog'

declare function usePattern<P extends Pattern>(
  pattern: P,
  config: PatternConfig<P>,
): PatternController<P>
```

반환 구조는 항상 같다.

```ts
type PatternController<P extends Pattern> = {
  /** 렌더 가능한 item view. tree/menu 계열은 visible flat order. */
  items: PatternItemView<P>[]

  /** 현재 pattern state. controlled/uncontrolled 모두 같은 shape. */
  state: PatternState<P>

  /** ARIA, event handler, ref, tabIndex, id, data-* 를 반환한다. */
  props: PatternPropsGetter<P>

  /** escape hatch. 앱 이벤트가 아니라 headless event만 받는다. */
  send: (event: PatternEvent<P>) => void

  /** derived collection metadata. 원본 data escape hatch가 아니다. */
  collection: PatternCollection<P>
}
```

Pattern별 alias는 허용하지만 canonical 문서는 `usePattern`을 먼저 쓴다.

```ts
const tabs = useTabs(config)
// same as
const tabs = usePattern('tabs', config)
```

## Config 규칙

```ts
type PatternConfig<P extends Pattern> = {
  items?: PatternItem<P>[]
  state?: PatternState<P>
  defaultState?: PatternState<P>
  onStateChange?: (next: PatternState<P>, meta: PatternChange<P>) => void
  options?: PatternOptions<P>
}
```

규칙:

- `items`는 plain object 배열이다.
- `state + onStateChange`는 controlled mode다.
- `defaultState`는 uncontrolled mode다.
- `state`와 `defaultState`를 동시에 넘기지 않는다.
- state key는 pattern별로 닫혀 있다.
- option key도 pattern별로 닫혀 있다.

## Item 규칙

최소 item 입력:

```ts
type PatternItem<P extends Pattern = Pattern> = {
  id: string
  label: string
  disabled?: boolean
  children?: PatternItem<P>[]
  meta?: Record<string, unknown>
}
```

규칙:

- 식별자는 항상 `id`.
- 표시 텍스트는 항상 `label`.
- 비활성은 항상 `disabled`.
- 계층은 항상 `children`.
- pattern-specific business data는 `meta`에 둔다.
- LLM은 `value`, `name`, `text`, `items`, `nodes`를 새로 만들지 않는다.

`ui.items`는 입력 `items`가 아니다. 렌더 가능한 view다.

```ts
type ItemView = {
  id: string
  label: string
  disabled: boolean
  selected?: boolean
  active?: boolean
  expanded?: boolean
  checked?: boolean
  level?: number
  parentId?: string
  hasChildren?: boolean
  posinset?: number
  setsize?: number
  meta?: Record<string, unknown>
}
```

Tree/Menu 계열에서 `ui.items`는 **visible flat order**다. recursive render를 요구하지 않는다.

## props 규칙

모든 pattern은 같은 호출형을 쓴다.

```ts
ui.props(part, target?, hostProps?)
```

규칙:

- `part`는 pattern별 닫힌 ARIA/APG 어휘다.
- `target`은 item이 필요한 part에서만 필수다.
- `hostProps`는 className, style, data-*, side-effect event handler를 넣는 곳이다.
- ARIA role, aria-*, id, tabIndex, ref, keyboard/pointer handler는 headless 소유다.
- consumer는 headless props를 직접 덮어쓰지 않는다.
- event handler와 ref는 `props` 내부에서 병합한다.

올바른 병합:

```tsx
<button
  {...tabs.props('tab', item, {
    className: styles.tab,
    onClick: props.onTabClick,
  })}
>
  {item.label}
</button>
```

금지:

```tsx
<button {...tabs.props('tab', item)} onClick={props.onTabClick} />
```

이 형태는 LLM이 headless handler를 덮어쓸 수 있으므로 canonical usage가 아니다.

## Pattern Contract

| Pattern | Parts | State | Options | Host guidance |
|---|---|---|---|---|
| `listbox` | `listbox`, `option` | `{ selectedIds?: string[]; activeId?: string }` | `{ selectionMode?: 'single' \| 'multiple'; selectionFollowsFocus?: boolean }` | `listbox → div`, `option → div/li` |
| `tabs` | `tablist`, `tab`, `tabpanel` | `{ selectedId: string }` | `{ orientation?: 'horizontal' \| 'vertical'; activationMode?: 'automatic' \| 'manual' }` | `tablist → div`, `tab → button`, `tabpanel → section/div` |
| `tree` | `tree`, `treeitem` | `{ selectedIds?: string[]; expandedIds?: string[]; activeId?: string }` | `{ selectionMode?: 'none' \| 'single' \| 'multiple' }` | `tree → div`, `treeitem → div` |
| `treegrid` | `treegrid`, `row`, `cell`, `columnheader` | `{ selectedIds?: string[]; expandedIds?: string[]; activeId?: string }` | `{ selectionMode?: 'none' \| 'single' \| 'multiple' }` | `treegrid → div`, `row → div`, `cell → div` |
| `combobox` | `combobox`, `trigger`, `popup`, `option` | `{ open?: boolean; selectedId?: string; inputValue?: string; activeId?: string }` | `{ autocomplete?: 'none' \| 'list' \| 'both' }` | `combobox → input`, `trigger → button`, `popup → div`, `option → div` |
| `menu` | `menu`, `menuitem` | `{ open?: boolean; activeId?: string }` | `{ closeOnSelect?: boolean }` | `menu → div`, `menuitem → button/div` |
| `menubar` | `menubar`, `menu`, `menuitem` | `{ openIds?: string[]; activeId?: string }` | `{ orientation?: 'horizontal' \| 'vertical' }` | `menubar → div`, `menu → div`, `menuitem → button/div` |
| `toolbar` | `toolbar`, `control` | `{ activeId?: string }` | `{ orientation?: 'horizontal' \| 'vertical' }` | `toolbar → div`, `control → button/input/select` |
| `radiogroup` | `radiogroup`, `radio` | `{ selectedId?: string }` | `{ orientation?: 'horizontal' \| 'vertical' }` | `radiogroup → div`, `radio → button/div` |
| `switch` | `switch` | `{ checked: boolean }` | `{}` | `switch → button` |
| `slider` | `slider`, `track`, `range`, `thumb` | `{ value: number \| number[] }` | `{ min: number; max: number; step?: number; orientation?: 'horizontal' \| 'vertical' }` | `slider → div`, `thumb → div/button` |
| `splitter` | `separator`, `pane` | `{ value: number }` | `{ min?: number; max?: number; orientation?: 'horizontal' \| 'vertical' }` | `separator → div`, `pane → div` |
| `disclosure` | `button`, `panel` | `{ open: boolean }` | `{}` | `button → button`, `panel → div/section` |
| `accordion` | `accordion`, `button`, `panel` | `{ expandedIds: string[] }` | `{ mode?: 'single' \| 'multiple'; collapsible?: boolean }` | `accordion → div`, `button → button`, `panel → div/section` |
| `dialog` | `dialog`, `title`, `description` | `{ open: boolean }` | `{ modal?: boolean }` | `dialog → dialog/section`, `title → h*`, `description → p/div` |
| `tooltip` | `trigger`, `tooltip` | `{ open: boolean }` | `{ delay?: number }` | `trigger → button/anchor`, `tooltip → div` |
| `alert` | `alert` | `{}` | `{}` | `alert → div` |
| `alertdialog` | `alertdialog`, `title`, `description`, `cancel`, `action` | `{ open: boolean }` | `{ modal?: boolean }` | `alertdialog → dialog/section`, actions → button |

TypeScript는 pattern별로 잘못된 part를 거부해야 한다.

```ts
tabs.props('tab', item)       // ok
tabs.props('option', item)    // type error
tabs.props('tabpanel')        // type error: target required
tabs.props('tablist', item)   // type error: target forbidden
```

## Usage: Listbox

```tsx
const listbox = usePattern('listbox', {
  items: [
    { id: 'overview', label: 'Overview' },
    { id: 'api', label: 'API' },
    { id: 'disabled', label: 'Disabled', disabled: true },
  ],
  defaultState: {
    selectedIds: ['overview'],
  },
  options: {
    selectionMode: 'single',
  },
})

return (
  <div {...listbox.props('listbox')}>
    {listbox.items.map((item) => (
      <div key={item.id} {...listbox.props('option', item)}>
        {item.label}
      </div>
    ))}
  </div>
)
```

## Usage: Tabs

```tsx
const tabs = usePattern('tabs', {
  items: [
    { id: 'usage', label: 'Usage' },
    { id: 'api', label: 'API' },
  ],
  defaultState: {
    selectedId: 'usage',
  },
  options: {
    orientation: 'horizontal',
    activationMode: 'automatic',
  },
})

return (
  <>
    <div {...tabs.props('tablist')}>
      {tabs.items.map((item) => (
        <button key={item.id} {...tabs.props('tab', item)}>
          {item.label}
        </button>
      ))}
    </div>

    {tabs.items.map((item) => (
      <section key={item.id} {...tabs.props('tabpanel', item)}>
        {item.meta?.content}
      </section>
    ))}
  </>
)
```

## Usage: Tree

```tsx
const tree = usePattern('tree', {
  items: [
    {
      id: 'components',
      label: 'Components',
      children: [{ id: 'button', label: 'Button' }],
    },
  ],
  defaultState: {
    expandedIds: ['components'],
    selectedIds: ['button'],
  },
  options: {
    selectionMode: 'single',
  },
})

return (
  <div {...tree.props('tree')}>
    {tree.items.map((item) => (
      <div
        key={item.id}
        {...tree.props('treeitem', item, {
          style: { paddingInlineStart: `${(item.level ?? 1) - 1}rem` },
        })}
      >
        {item.label}
      </div>
    ))}
  </div>
)
```

`tree.items`는 visible flat order이므로 recursive render가 아니다.

## Usage: Controlled Wrapper

`aria-design-system` wrapper는 visual shell만 소유한다.

```tsx
type ListboxProps = {
  items: PatternItem<'listbox'>[]
  value: string[]
  onValueChange?: (value: string[]) => void
}

export function Listbox({ items, value, onValueChange }: ListboxProps) {
  const listbox = usePattern('listbox', {
    items,
    state: { selectedIds: value },
    onStateChange: (next) => onValueChange?.(next.selectedIds ?? []),
    options: { selectionMode: 'multiple' },
  })

  return (
    <div {...listbox.props('listbox')}>
      {listbox.items.map((item) => (
        <div
          key={item.id}
          {...listbox.props('option', item, {
            className: item.selected ? 'selected' : undefined,
          })}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}
```

## send 규칙

대부분의 사용자는 `send`를 쓰지 않는다. UI 이벤트는 `props`가 처리한다.

`send`는 advanced escape hatch다.

```ts
listbox.send({ type: 'select', id: 'api' })
tree.send({ type: 'expand', id: 'components', open: true })
dialog.send({ type: 'open', open: false })
slider.send({ type: 'value', value: 50 })
```

Event type도 pattern별로 닫는다. LLM은 임의 이벤트 이름을 만들지 않는다.

## LLM 작성 규칙

LLM은 새 pattern usage를 만들 때 이 순서를 따른다.

1. `const ui = usePattern('<pattern>', config)`를 만든다.
2. `Pattern Contract` 표에서 allowed parts를 확인한다.
3. state key는 표에 있는 이름만 쓴다.
4. host element는 표의 host guidance를 따른다.
5. `ui.items.map(...)`으로 렌더한다.
6. props는 항상 `ui.props(part, target?, hostProps?)`로 병합한다.
7. raw `role`, `aria-*`, `tabIndex`, keyboard handler를 직접 쓰지 않는다.
8. 스타일·className은 `hostProps`에 넣는다.

좋은 출력은 항상 이 모양으로 수렴한다.

```tsx
const ui = usePattern(pattern, config)

return (
  <Host {...ui.props(patternRootPart)}>
    {ui.items.map((item) => (
      <ItemHost key={item.id} {...ui.props(itemPart, item, hostProps)}>
        {item.label}
      </ItemHost>
    ))}
  </Host>
)
```

단, tabs처럼 paired part가 있으면 같은 `items`로 panel도 렌더한다.

```tsx
{tabs.items.map((item) => (
  <section key={item.id} {...tabs.props('tabpanel', item)} />
))}
```

## Anti-patterns

전역 generic part 금지:

```tsx
ui.props('root')
ui.props('item', item)
```

pattern별 ARIA part를 써야 한다.

```tsx
tabs.props('tablist')
tabs.props('tab', item)
tabs.props('tabpanel', item)
```

state key 추측 금지:

```ts
defaultState: { selected: ['x'] } // 금지
```

명세의 state key를 쓴다.

```ts
defaultState: { selectedIds: ['x'] } // listbox/tree
defaultState: { selectedId: 'x' }    // tabs/radiogroup
```

handler 덮어쓰기 금지:

```tsx
<div {...ui.props('option', item)} onClick={onClick} />
```

세 번째 인자를 쓴다.

```tsx
<div {...ui.props('option', item, { onClick })} />
```

raw ARIA 조립 금지:

```tsx
<div role="option" aria-selected={selected} onKeyDown={onKeyDown} />
```

`@p/headless`가 소유한다.

```tsx
<div {...listbox.props('option', item)} />
```

