[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / navigate

# Function: navigate()

> **navigate**(`orientation?`): [`Axis`](../type-aliases/Axis.md)

Defined in: [axes/navigate.ts:12](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/navigate.ts#L12)

navigate — siblings prev/next (단일 부모). visible-flat (collapse 반영) 은 treeNavigate.
orientation 별 prev/next/start/end 키는 `INTENTS.navigate` 에서 import (SSOT).

## Parameters

### orientation?

`"vertical"` \| `"horizontal"`

## Returns

[`Axis`](../type-aliases/Axis.md)
