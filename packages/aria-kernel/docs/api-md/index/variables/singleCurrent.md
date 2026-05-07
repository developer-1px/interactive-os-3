[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / singleCurrent

# Variable: singleCurrent

> `const` **singleCurrent**: [`Reducer`](../type-aliases/Reducer.md)

Defined in: [state/selection.ts:45](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/selection.ts#L45)

singleCurrent — navigation single-current reducer fragment.

`singleSelect` 의 nav 변종 — `selected` 대신 `current` 를 쓴다 (ARIA `aria-current="page"`).
Listbox 가 아니라 navigation list 에서 사용. 어휘 분리: select(컬렉션) ≠ current(landmark).
