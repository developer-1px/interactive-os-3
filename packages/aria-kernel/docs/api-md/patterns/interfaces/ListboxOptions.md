[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / ListboxOptions

# Interface: ListboxOptions

Defined in: [patterns/listbox.ts:9](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/listbox.ts#L9)

Options for [useListboxPattern](../functions/useListboxPattern.md).

## Properties

### autoFocus?

> `optional` **autoFocus?**: `boolean`

Defined in: [patterns/listbox.ts:16](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/listbox.ts#L16)

***

### containerId?

> `optional` **containerId?**: `string`

Defined in: [patterns/listbox.ts:18](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/listbox.ts#L18)

Container entity for nested listboxes (e.g. inside a Menu); defaults to ROOT.

***

### disabled?

> `optional` **disabled?**: `boolean`

Defined in: [patterns/listbox.ts:26](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/listbox.ts#L26)

aria-disabled (whole-listbox disabled).

***

### invalid?

> `optional` **invalid?**: `boolean`

Defined in: [patterns/listbox.ts:24](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/listbox.ts#L24)

aria-invalid (form context).

***

### label?

> `optional` **label?**: `string`

Defined in: [patterns/listbox.ts:28](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/listbox.ts#L28)

aria-label — ARIA: listbox requires accessible name.

***

### labelledBy?

> `optional` **labelledBy?**: `string`

Defined in: [patterns/listbox.ts:29](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/listbox.ts#L29)

***

### multiSelectable?

> `optional` **multiSelectable?**: `boolean`

Defined in: [patterns/listbox.ts:15](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/listbox.ts#L15)

aria-multiselectable.

***

### orientation?

> `optional` **orientation?**: `"vertical"` \| `"horizontal"`

Defined in: [patterns/listbox.ts:11](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/listbox.ts#L11)

aria-orientation. Spec implicit value: 'vertical'.

***

### readOnly?

> `optional` **readOnly?**: `boolean`

Defined in: [patterns/listbox.ts:22](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/listbox.ts#L22)

aria-readonly (form context).

***

### required?

> `optional` **required?**: `boolean`

Defined in: [patterns/listbox.ts:20](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/listbox.ts#L20)

aria-required (form context).

***

### selectionFollowsFocus?

> `optional` **selectionFollowsFocus?**: `boolean`

Defined in: [patterns/listbox.ts:13](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/listbox.ts#L13)

Default: `!multiSelectable` (APG: single sff, multi explicit toggle).
