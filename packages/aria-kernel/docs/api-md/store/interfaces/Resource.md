[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [store](../README.md) / Resource

# Interface: Resource\<T, Args\>

Defined in: [store/data.ts:30](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/data.ts#L30)

Resource 정의 — keyed external store spec. key/load/initial/subscribe/serialize/onEvent 슬롯.

## Type Parameters

### T

`T`

### Args

`Args` *extends* `unknown`[] = \[\]

## Properties

### initial?

> `optional` **initial?**: `T` \| ((...`args`) => `T`)

Defined in: [store/data.ts:33](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/data.ts#L33)

***

### key

> **key**: (...`args`) => `string`

Defined in: [store/data.ts:31](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/data.ts#L31)

#### Parameters

##### args

...`Args`

#### Returns

`string`

***

### load?

> `optional` **load?**: (...`args`) => `T` \| `Promise`\<`T`\>

Defined in: [store/data.ts:32](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/data.ts#L32)

#### Parameters

##### args

...`Args`

#### Returns

`T` \| `Promise`\<`T`\>

***

### onEvent?

> `optional` **onEvent?**: [`ResourceEventRouter`](../type-aliases/ResourceEventRouter.md)\<`T`\>

Defined in: [store/data.ts:37](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/data.ts#L37)

ui/ event → 다음 값 매퍼. flow에서 intent 라우터로 사용.

***

### serialize?

> `optional` **serialize?**: (`key`, `value`, ...`args`) => `void`

Defined in: [store/data.ts:35](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/data.ts#L35)

#### Parameters

##### key

`string`

##### value

`T`

##### args

...`Args`

#### Returns

`void`

***

### subscribe?

> `optional` **subscribe?**: (`key`, `notify`, ...`args`) => () => `void`

Defined in: [store/data.ts:34](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/data.ts#L34)

#### Parameters

##### key

`string`

##### notify

() => `void`

##### args

...`Args`

#### Returns

() => `void`
