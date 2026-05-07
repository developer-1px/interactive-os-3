[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / MenuOptions

# Interface: MenuOptions

Defined in: [patterns/menu.ts:9](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/menu.ts#L9)

Options for [useMenuPattern](../functions/useMenuPattern.md).

## Properties

### autoFocus?

> `optional` **autoFocus?**: `boolean`

Defined in: [patterns/menu.ts:13](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/menu.ts#L13)

***

### closeOnSelect?

> `optional` **closeOnSelect?**: `boolean`

Defined in: [patterns/menu.ts:12](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/menu.ts#L12)

***

### containerId?

> `optional` **containerId?**: `string`

Defined in: [patterns/menu.ts:19](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/menu.ts#L19)

Container entity for nested sub-menus; defaults to ROOT. 자식들이 children 으로 사용된다.

***

### defaultOpen?

> `optional` **defaultOpen?**: `boolean`

Defined in: [patterns/menu.ts:22](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/menu.ts#L22)

***

### label?

> `optional` **label?**: `string`

Defined in: [patterns/menu.ts:16](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/menu.ts#L16)

aria-label — ARIA: menu requires accessible name.

***

### labelledBy?

> `optional` **labelledBy?**: `string`

Defined in: [patterns/menu.ts:17](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/menu.ts#L17)

***

### onEscape?

> `optional` **onEscape?**: () => `void`

Defined in: [patterns/menu.ts:14](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/menu.ts#L14)

#### Returns

`void`

***

### onOpenChange?

> `optional` **onOpenChange?**: (`open`) => `void`

Defined in: [patterns/menu.ts:23](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/menu.ts#L23)

#### Parameters

##### open

`boolean`

#### Returns

`void`

***

### open?

> `optional` **open?**: `boolean`

Defined in: [patterns/menu.ts:21](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/menu.ts#L21)

controlled. 생략 시 패턴이 useState 자체 소유 — menu-button trigger 케이스.

***

### orientation?

> `optional` **orientation?**: `"vertical"` \| `"horizontal"`

Defined in: [patterns/menu.ts:11](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/menu.ts#L11)

aria-orientation. Spec implicit value: 'vertical'.
