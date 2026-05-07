[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [store](../README.md) / FeatureSpec

# Interface: FeatureSpec\<S, Cmd, Q, V\>

Defined in: [store/feature/defineFeature.ts:20](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/feature/defineFeature.ts#L20)

Feature spec — 한 화면의 SSOT. `state`(초기값) · `on`(reducer map) · `query`(외부 데이터 선언) · `view`(뷰모델).
직렬화 가능한 plain object — class/ref/closure 잔재 금지.

## Type Parameters

### S

`S`

### Cmd

`Cmd` *extends* [`CommandBase`](CommandBase.md)

### Q

`Q` *extends* `Record`\<`string`, [`QuerySpec`](QuerySpec.md)\<`unknown`\>\> = `Record`\<`string`, `never`\>

### V

`V` = `unknown`

## Properties

### on

> **on**: [`ReducerMap`](../type-aliases/ReducerMap.md)\<`S`, `Cmd`\>

Defined in: [store/feature/defineFeature.ts:29](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/feature/defineFeature.ts#L29)

(s, cmd) → s'. pure. 외부 호출 금지.

***

### query?

> `optional` **query?**: (`s`) => `Q`

Defined in: [store/feature/defineFeature.ts:31](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/feature/defineFeature.ts#L31)

state 의 함수로 외부 데이터 선언. runtime 이 fetch + 캐시.

#### Parameters

##### s

`S`

#### Returns

`Q`

***

### state

> **state**: `S`

Defined in: [store/feature/defineFeature.ts:27](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/feature/defineFeature.ts#L27)

사용자 의도 = JSON. 직렬화 가능해야 함.

***

### view

> **view**: (`s`, `q`) => `V`

Defined in: [store/feature/defineFeature.ts:33](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/feature/defineFeature.ts#L33)

state + query → ViewModel. slot 단위 데이터.

#### Parameters

##### s

`S`

##### q

[`QueryResults`](../type-aliases/QueryResults.md)\<`Q`\>

#### Returns

`V`
