[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [state](../README.md) / bindValueAxis

# Function: bindValueAxis()

> **bindValueAxis**\<`T`\>(`axis`, `entity`, `dispatch`, `pick`): `object`

Defined in: [state/bind.ts:54](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/bind.ts#L54)

단일값 컨트롤(slider/switch/spinbutton/splitter)을 axis 인프라에 잇는 헬퍼.

axis 는 NormalizedData 시그니처라 단일 entity 표현을 위해 ROOT 1개짜리 합성 데이터를
만들어 통과시킨다. axis 가 emit 한 UiEvent 를 `pick` 으로 narrow 하여 `ValueEvent<T>`
로 dispatch.

## Type Parameters

### T

`T`

## Parameters

### axis

[`Axis`](../../index/type-aliases/Axis.md)

### entity

`Record`\<`string`, `unknown`\>

ROOT 위치에 들어갈 entity ({value, min, max, step} 또는 {value, ...})

### dispatch

((`e`) => `void`) \| `undefined`

### pick

(`e`) => `T` \| `undefined`

UiEvent → T | undefined. undefined 면 dispatch 안 함.

## Returns

`object`

### onClick

> **onClick**: (`me`) => `boolean`

#### Parameters

##### me

`MouseEvent`

#### Returns

`boolean`

### onKey

> **onKey**: (`ke`) => `boolean`

#### Parameters

##### ke

`KeyboardEvent`

#### Returns

`boolean`
