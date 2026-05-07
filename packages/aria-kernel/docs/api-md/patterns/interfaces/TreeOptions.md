[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / TreeOptions

# Interface: TreeOptions

Defined in: [patterns/tree.ts:12](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tree.ts#L12)

Options for [useTreePattern](../functions/useTreePattern.md).

## Properties

### autoFocus?

> `optional` **autoFocus?**: `boolean`

Defined in: [patterns/tree.ts:19](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tree.ts#L19)

***

### containerId?

> `optional` **containerId?**: `string`

Defined in: [patterns/tree.ts:21](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tree.ts#L21)

Container entity for nested trees; defaults to ROOT.

***

### label?

> `optional` **label?**: `string`

Defined in: [patterns/tree.ts:23](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tree.ts#L23)

aria-label — ARIA: tree requires accessible name.

***

### labelledBy?

> `optional` **labelledBy?**: `string`

Defined in: [patterns/tree.ts:24](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tree.ts#L24)

***

### multiSelectable?

> `optional` **multiSelectable?**: `boolean`

Defined in: [patterns/tree.ts:18](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tree.ts#L18)

aria-multiselectable.

***

### orientation?

> `optional` **orientation?**: `"vertical"` \| `"horizontal"`

Defined in: [patterns/tree.ts:14](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tree.ts#L14)

aria-orientation. Spec implicit value: 'vertical'.

***

### selectionFollowsFocus?

> `optional` **selectionFollowsFocus?**: `boolean`

Defined in: [patterns/tree.ts:16](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tree.ts#L16)

Default: `!multiSelectable` (APG: single sff, multi explicit toggle).
