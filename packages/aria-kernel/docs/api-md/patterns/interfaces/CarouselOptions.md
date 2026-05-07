[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / CarouselOptions

# Interface: CarouselOptions

Defined in: [patterns/carousel.ts:12](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/carousel.ts#L12)

Options for [useCarouselPattern](../functions/useCarouselPattern.md).

## Properties

### autoplay?

> `optional` **autoplay?**: `boolean`

Defined in: [patterns/carousel.ts:20](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/carousel.ts#L20)

Auto-rotate. focus/hover/explicit-pause 시 정지.

***

### defaultIndex?

> `optional` **defaultIndex?**: `number`

Defined in: [patterns/carousel.ts:17](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/carousel.ts#L17)

Uncontrolled initial index.

***

### idPrefix?

> `optional` **idPrefix?**: `string`

Defined in: [patterns/carousel.ts:26](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/carousel.ts#L26)

***

### index?

> `optional` **index?**: `number`

Defined in: [patterns/carousel.ts:15](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/carousel.ts#L15)

Controlled current slide index.

***

### intervalMs?

> `optional` **intervalMs?**: `number`

Defined in: [patterns/carousel.ts:21](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/carousel.ts#L21)

***

### label?

> `optional` **label?**: `string`

Defined in: [patterns/carousel.ts:25](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/carousel.ts#L25)

carousel container 의 aria-label.

***

### loop?

> `optional` **loop?**: `boolean`

Defined in: [patterns/carousel.ts:23](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/carousel.ts#L23)

loop=true 면 마지막→처음 순환. default true.

***

### onIndexChange?

> `optional` **onIndexChange?**: (`i`) => `void`

Defined in: [patterns/carousel.ts:18](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/carousel.ts#L18)

#### Parameters

##### i

`number`

#### Returns

`void`

***

### slides

> **slides**: [`CarouselSlide`](CarouselSlide.md)[]

Defined in: [patterns/carousel.ts:13](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/carousel.ts#L13)
