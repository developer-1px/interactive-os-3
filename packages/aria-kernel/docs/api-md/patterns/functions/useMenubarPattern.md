[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useMenubarPattern

# Function: useMenubarPattern()

> **useMenubarPattern**(`data`, `onEvent?`, `opts?`): `object`

Defined in: [patterns/menubar.ts:99](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/menubar.ts#L99)

menubar — APG `/menubar/` recipe (top bar + nested sub-menus).
https://www.w3.org/WAI/ARIA/apg/patterns/menubar/

data 모델:
  ROOT
    ├─ top-1 ── (children: sub-1, sub-2, ...)
    ├─ top-2 ── (children: sub-3, sub-4, ...)
    ⋮

키 매핑은 모두 axis 합성으로 박제. 인라인 onKeyDown 0.
  top — `expandKeys` (Down/Enter/Space, Up) + `navigate('horizontal')` + `escape`
  sub — `crossTop` (Left/Right) + `navigate('vertical')` + `activate` + `escape`

intent relay 가 expand/open UiEvent 를 openId state 로 흡수 (gesture/intent split).

## Parameters

### data

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

### onEvent?

(`e`) => `void`

### opts?

[`MenubarOptions`](../interfaces/MenubarOptions.md) = `{}`

## Returns

`object`

### items

> **items**: [`BaseItem`](../interfaces/BaseItem.md)[]

### menubarItemProps

> **menubarItemProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### menuitemProps

> **menuitemProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### menuProps

> **menuProps**: (`topId`) => [`RootProps`](../type-aliases/RootProps.md)

#### Parameters

##### topId

`string`

#### Returns

[`RootProps`](../type-aliases/RootProps.md)

### openId

> **openId**: `string` \| `null`

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)
