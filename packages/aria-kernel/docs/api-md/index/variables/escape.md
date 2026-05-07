[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / escape

# Variable: escape

> `const` **escape**: [`Axis`](../type-aliases/Axis.md)

Defined in: [axes/escape.ts:11](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/escape.ts#L11)

escape — Escape 키 → `{type:'open', id, open:false}` 직렬 emit.

키는 `INTENTS.escape.close` 에서 import — SSOT.
Menu/Combobox/Dialog 의 닫기 의도를 axis 로 박제. 어느 layer 가 닫힐지는 host 가
onEvent 에서 결정.
