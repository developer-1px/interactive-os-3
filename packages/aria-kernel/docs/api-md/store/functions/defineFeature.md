[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [store](../README.md) / defineFeature

# Function: defineFeature()

> **defineFeature**\<`S`, `Cmd`, `Q`, `V`\>(`spec`): [`FeatureSpec`](../interfaces/FeatureSpec.md)\<`S`, `Cmd`, `Q`, `V`\>

Defined in: [store/feature/defineFeature.ts:48](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/feature/defineFeature.ts#L48)

Feature spec identity — 타입 추론 + 런타임 spec 통과 helper.
라이프사이클: useFeature 가 spec 을 받아 useReducer 로 state 생성 → state 변화마다
query → view 재계산. 직렬화 가능성: state 는 plain JSON 가능해야 한다 (HMR/replay 지원).

## Type Parameters

### S

`S`

### Cmd

`Cmd` *extends* [`CommandBase`](../interfaces/CommandBase.md)

### Q

`Q` *extends* `Record`\<`string`, [`QuerySpec`](../interfaces/QuerySpec.md)\<`unknown`\>\> = `Record`\<`string`, `never`\>

### V

`V` = `unknown`

## Parameters

### spec

[`FeatureSpec`](../interfaces/FeatureSpec.md)\<`S`, `Cmd`, `Q`, `V`\>

## Returns

[`FeatureSpec`](../interfaces/FeatureSpec.md)\<`S`, `Cmd`, `Q`, `V`\>

## Example

```ts
const counter = defineFeature({
  state: { count: 0 },
  on: { inc: (s) => ({ count: s.count + 1 }) },
  view: (s) => ({ label: `count: ${s.count}` }),
})
```
