[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [store](../README.md) / ReducerMap

# Type Alias: ReducerMap\<S, Cmd\>

> **ReducerMap**\<`S`, `Cmd`\> = `{ readonly [K in Cmd["type"]]: (s: S, p: Extract<Cmd, { type: K }>) => S }`

Defined in: [store/feature/defineFeature.ts:9](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/feature/defineFeature.ts#L9)

command type → 그 type 의 reducer 함수. exhaustive map 강제.

## Type Parameters

### S

`S`

### Cmd

`Cmd` *extends* [`CommandBase`](../interfaces/CommandBase.md)
