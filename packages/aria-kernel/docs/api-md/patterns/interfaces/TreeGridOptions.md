[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / TreeGridOptions

# Interface: TreeGridOptions

Defined in: [patterns/treeGrid.ts:9](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/treeGrid.ts#L9)

Options for [useTreeGridPattern](../functions/useTreeGridPattern.md).

## Properties

### autoFocus?

> `optional` **autoFocus?**: `boolean`

Defined in: [patterns/treeGrid.ts:16](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/treeGrid.ts#L16)

***

### colCount?

> `optional` **colCount?**: `number`

Defined in: [patterns/treeGrid.ts:23](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/treeGrid.ts#L23)

aria-colcount — total columns (header column count).

***

### containerId?

> `optional` **containerId?**: `string`

Defined in: [patterns/treeGrid.ts:18](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/treeGrid.ts#L18)

Container entity for nested grids; defaults to ROOT.

***

### label?

> `optional` **label?**: `string`

Defined in: [patterns/treeGrid.ts:20](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/treeGrid.ts#L20)

aria-label — ARIA: treegrid requires accessible name.

***

### labelledBy?

> `optional` **labelledBy?**: `string`

Defined in: [patterns/treeGrid.ts:21](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/treeGrid.ts#L21)

***

### multiSelectable?

> `optional` **multiSelectable?**: `boolean`

Defined in: [patterns/treeGrid.ts:15](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/treeGrid.ts#L15)

aria-multiselectable.

***

### orientation?

> `optional` **orientation?**: `"vertical"` \| `"horizontal"`

Defined in: [patterns/treeGrid.ts:11](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/treeGrid.ts#L11)

aria-orientation. Spec implicit value: 'horizontal' for grid family.

***

### selectionFollowsFocus?

> `optional` **selectionFollowsFocus?**: `boolean`

Defined in: [patterns/treeGrid.ts:13](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/treeGrid.ts#L13)

Default: `!multiSelectable` (APG: single sff, multi explicit toggle).
