[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / navigationListPattern

# Function: navigationListPattern()

> **navigationListPattern**(`data`, `onEvent?`, `opts?`): `object`

Defined in: [patterns/navigationList.ts:24](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/navigationList.ts#L24)

navigationList — sidebar/route navigation recipe.

**Listbox 가 아니다.** APG에 단일 패턴 없음 — HTML `<nav>` landmark + `<a aria-current="page">`
로 이루어진 합성. sidebar=listbox 안티패턴 차단이 본 recipe 의 존재 이유.

- `aria-selected` 아닌 `aria-current="page"` (`entity.current` 가 SSoT)
- role=listbox/option 아닌 native nav/a
- 키보드는 native Tab/Enter — pattern 이 추가 axis 등록 안 함

https://html.spec.whatwg.org/multipage/sections.html#the-nav-element
https://www.w3.org/TR/wai-aria-1.2/#aria-current

## Parameters

### data

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

### onEvent?

(`e`) => `void`

### opts?

[`NavigationListOptions`](../interfaces/NavigationListOptions.md) = `{}`

## Returns

`object`

### items

> **items**: [`BaseItem`](../interfaces/BaseItem.md) & `object`[]

### linkProps

> **linkProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)
