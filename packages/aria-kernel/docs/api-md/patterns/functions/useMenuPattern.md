[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useMenuPattern

# Function: useMenuPattern()

> **useMenuPattern**(`data`, `onEvent?`, `opts?`): `object`

Defined in: [patterns/menu.ts:43](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/menu.ts#L43)

menu — APG `/menu/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/menu/

키보드: ArrowUp/Down · Home/End · Enter/Space · typeahead. Escape 닫기는 소비자.

## Parameters

### data

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

### onEvent?

(`e`) => `void`

### opts?

[`MenuOptions`](../interfaces/MenuOptions.md) = `{}`

## Returns

### buttonProps

> **buttonProps**: [`ItemProps`](../type-aliases/ItemProps.md)

### items

> **items**: [`BaseItem`](../interfaces/BaseItem.md)[]

### menuitemProps

> **menuitemProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### open

> **open**: `boolean`

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)

### setOpen

> **setOpen**: (`open`) => `void`

면제 사유: host-level menu-button 제어 (Escape 외부 닫기·외부 click 닫기 등). UI=activate 단발 (INVARIANTS #16) 의 host-control 예외.

#### Parameters

##### open

`boolean`

#### Returns

`void`
