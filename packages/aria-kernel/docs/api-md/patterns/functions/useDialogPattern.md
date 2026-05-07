[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useDialogPattern

# Function: useDialogPattern()

> **useDialogPattern**(`opts?`): `object`

Defined in: [patterns/dialog.ts:59](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/dialog.ts#L59)

dialog — APG `/dialog-modal/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

동작: open 시 첫 focusable 에 focus, Escape 닫기, 닫힘 시 trigger 로 focus
복귀, modal 일 때 Tab 이 dialog 내부에서 순환 (focus trap).

## Parameters

### opts?

[`DialogOptions`](../interfaces/DialogOptions.md) = `{}`

## Returns

`object`

### closeProps

> **closeProps**: [`ItemProps`](../type-aliases/ItemProps.md)

### open

> **open**: `boolean`

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)

### rootRef

> **rootRef**: `RefObject`\<`HTMLElement` \| `null`\>

### setOpen

> **setOpen**: (`open`) => `void`

#### Parameters

##### open

`boolean`

#### Returns

`void`
