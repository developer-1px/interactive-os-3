[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / DialogOptions

# Interface: DialogOptions

Defined in: [patterns/dialog.ts:13](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/dialog.ts#L13)

Options for [useDialogPattern](../functions/useDialogPattern.md).

## Properties

### alert?

> `optional` **alert?**: `boolean`

Defined in: [patterns/dialog.ts:22](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/dialog.ts#L22)

APG `alertdialog` 변종 — role 만 다르고 동작 동일.

***

### defaultOpen?

> `optional` **defaultOpen?**: `boolean`

Defined in: [patterns/dialog.ts:17](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/dialog.ts#L17)

uncontrolled 초기값.

***

### describedBy?

> `optional` **describedBy?**: `string`

Defined in: [patterns/dialog.ts:31](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/dialog.ts#L31)

***

### initialFocusRef?

> `optional` **initialFocusRef?**: `RefObject`\<`HTMLElement` \| `null`\>

Defined in: [patterns/dialog.ts:26](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/dialog.ts#L26)

open 직후 우선 focus 대상. 없으면 첫 focusable, 그것도 없으면 dialog root.

***

### label?

> `optional` **label?**: `string`

Defined in: [patterns/dialog.ts:29](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/dialog.ts#L29)

aria-label — ARIA: dialog/alertdialog requires accessible name.

***

### labelledBy?

> `optional` **labelledBy?**: `string`

Defined in: [patterns/dialog.ts:30](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/dialog.ts#L30)

***

### modal?

> `optional` **modal?**: `boolean`

Defined in: [patterns/dialog.ts:20](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/dialog.ts#L20)

***

### onOpenChange?

> `optional` **onOpenChange?**: (`open`) => `void`

Defined in: [patterns/dialog.ts:19](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/dialog.ts#L19)

controlled 통지 + uncontrolled 에서도 호출 (양 모드 공통 콜백).

#### Parameters

##### open

`boolean`

#### Returns

`void`

***

### open?

> `optional` **open?**: `boolean`

Defined in: [patterns/dialog.ts:15](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/dialog.ts#L15)

controlled. 생략 시 패턴이 useState 로 자체 소유 (uncontrolled).

***

### returnFocus?

> `optional` **returnFocus?**: `boolean`

Defined in: [patterns/dialog.ts:27](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/dialog.ts#L27)

***

### returnFocusRef?

> `optional` **returnFocusRef?**: `RefObject`\<`HTMLElement` \| `null`\>

Defined in: [patterns/dialog.ts:24](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/dialog.ts#L24)

focus 복귀 대상. trigger element ref 권장.

***

### rootRef?

> `optional` **rootRef?**: `RefObject`\<`HTMLElement` \| `null`\>

Defined in: [patterns/dialog.ts:33](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/dialog.ts#L33)

외부에서 root ref 를 제어해야 할 때 주입. 미주입 시 내부 ref 생성.
