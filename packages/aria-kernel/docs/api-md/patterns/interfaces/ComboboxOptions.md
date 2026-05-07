[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / ComboboxOptions

# Interface: ComboboxOptions

Defined in: [patterns/combobox.ts:20](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L20)

Options for [useComboboxPattern](../functions/useComboboxPattern.md).

## Properties

### autocomplete?

> `optional` **autocomplete?**: `"both"` \| `"none"` \| `"list"`

Defined in: [patterns/combobox.ts:27](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L27)

aria-autocomplete. APG: 'none' | 'list' | 'both'.

***

### closeOnBlurDelay?

> `optional` **closeOnBlurDelay?**: `number`

Defined in: [patterns/combobox.ts:31](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L31)

outside click 흡수 — option click 과 race 방지. de facto 100ms.

***

### commitOnActivate?

> `optional` **commitOnActivate?**: `boolean`

Defined in: [patterns/combobox.ts:33](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L33)

activate 시 input value 를 선택된 label 로 갱신 (APG default).

***

### defaultValue?

> `optional` **defaultValue?**: `string`

Defined in: [patterns/combobox.ts:23](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L23)

***

### disabled?

> `optional` **disabled?**: `boolean`

Defined in: [patterns/combobox.ts:38](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L38)

***

### filter?

> `optional` **filter?**: (`query`, `label`, `id`) => `boolean`

Defined in: [patterns/combobox.ts:25](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L25)

filter — query 로 visible 좁힘. default: label.toLowerCase().includes(q.toLowerCase()).

#### Parameters

##### query

`string`

##### label

`string`

##### id

`string`

#### Returns

`boolean`

***

### haspopup?

> `optional` **haspopup?**: `"dialog"` \| `"listbox"` \| `"grid"` \| `"tree"`

Defined in: [patterns/combobox.ts:29](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L29)

aria-haspopup. Spec implicit: 'listbox'.

***

### idPrefix?

> `optional` **idPrefix?**: `string`

Defined in: [patterns/combobox.ts:34](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L34)

***

### invalid?

> `optional` **invalid?**: `boolean`

Defined in: [patterns/combobox.ts:37](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L37)

***

### label?

> `optional` **label?**: `string`

Defined in: [patterns/combobox.ts:40](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L40)

aria-label — combobox 입력의 accessible name (label 또는 labelledBy 필수).

***

### labelledBy?

> `optional` **labelledBy?**: `string`

Defined in: [patterns/combobox.ts:41](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L41)

***

### popupLabel?

> `optional` **popupLabel?**: `string`

Defined in: [patterns/combobox.ts:43](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L43)

popup listbox 의 aria-label / aria-labelledby.

***

### popupLabelledBy?

> `optional` **popupLabelledBy?**: `string`

Defined in: [patterns/combobox.ts:44](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L44)

***

### readOnly?

> `optional` **readOnly?**: `boolean`

Defined in: [patterns/combobox.ts:36](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L36)

***

### required?

> `optional` **required?**: `boolean`

Defined in: [patterns/combobox.ts:35](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L35)

***

### value?

> `optional` **value?**: `string`

Defined in: [patterns/combobox.ts:22](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L22)

controlled input value. 생략 시 패턴이 useState 로 자체 보유.
