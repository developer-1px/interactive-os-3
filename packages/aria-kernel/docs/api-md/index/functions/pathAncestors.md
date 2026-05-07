[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / pathAncestors

# Function: pathAncestors()

> **pathAncestors**(`path`, `sep?`): `string`[]

Defined in: [state/fromTree.ts:53](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/fromTree.ts#L53)

path 문자열을 누적 prefix 배열로 — `/a/b/c` → `['/a', '/a/b', '/a/b/c']`.
tree 의 조상 id 가 path prefix 와 1:1 일 때 expanded 시드 계산에 사용.

## Parameters

### path

`string`

### sep?

`string` = `'/'`

## Returns

`string`[]
