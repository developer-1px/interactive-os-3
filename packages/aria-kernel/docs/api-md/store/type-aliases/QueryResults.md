[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [store](../README.md) / QueryResults

# Type Alias: QueryResults\<Q\>

> **QueryResults**\<`Q`\> = `{ readonly [K in keyof Q]: QueryResult<Q[K] extends QuerySpec<infer T> ? T : never> }`

Defined in: [store/feature/defineFeature.ts:14](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/feature/defineFeature.ts#L14)

query spec map → 같은 키에 QueryResult 가 채워진 결과 map.

## Type Parameters

### Q

`Q`
