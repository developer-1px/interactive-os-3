[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useGridPattern

# Function: useGridPattern()

> **useGridPattern**(`data`, `onEvent?`, `opts?`): `object`

Defined in: [patterns/grid.ts:61](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/grid.ts#L61)

grid — APG `/grid/` recipe (data grid keyboard model, cell-focus).
https://www.w3.org/WAI/ARIA/apg/patterns/grid/

data 모델: container → rows → cells. focus 단위 = cell.
treegrid 와의 차이: treegrid 는 row 단위 focus + tree 확장, grid 는 cell 단위 2D nav.

Cell editing(F2/Enter/Escape) 은 declarative recipe 범위 밖 — 소비자가 cell content
안에서 처리. activate(Enter/Space)는 onEvent 로 emit 만 한다.

## Parameters

### data

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

### onEvent?

(`e`) => `void`

### opts?

[`GridOptions`](../interfaces/GridOptions.md) = `{}`

## Returns

`object`

### cellProps

> **cellProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### columnHeaderProps

> **columnHeaderProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)

### rowHeaderProps

> **rowHeaderProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### rowProps

> **rowProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### rows

> **rows**: `object`[]
