[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [axes](../README.md) / expandKeys

# Function: expandKeys()

> **expandKeys**(`openKeys`, `seed?`): [`Axis`](../../index/type-aliases/Axis.md)

Defined in: [axes/expand.ts:42](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/expand.ts#L42)

expandKeys — `expand` 의 일반화 factory. open 키와 seed(첫/끝 자식) 를 명시.

openKeys 는 단순 string 배열 (modifier 무시) 또는 `KeyChord[]` (modifier 정밀).
SSOT 정합을 위해 가능하면 `INTENTS` 의 chord 를 import 해서 전달 권장.

사용처:
  - menubar top: `expandKeys([KEYS.ArrowDown, KEYS.Enter, KEYS.Space], 'first')`

close 분기는 별도(또는 `escape` axis) — `expandKeys` 는 open 만 책임.

## Parameters

### openKeys

readonly `string`[]

### seed?

`"first"` \| `"last"`

## Returns

[`Axis`](../../index/type-aliases/Axis.md)
