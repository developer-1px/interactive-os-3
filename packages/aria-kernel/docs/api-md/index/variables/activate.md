[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / activate

# Variable: activate

> `const` **activate**: [`Axis`](../type-aliases/Axis.md)

Defined in: [axes/activate.ts:14](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/activate.ts#L14)

activate — Enter/Space(key) 또는 click(pointer) 시 'activate' 이벤트 발행.

키 매핑은 `INTENTS.activate.trigger` 에서 import — SSOT 정합.

rovingItem 기본기: 클릭은 분기/리프 관계없이 항상 activate 로 합류한다.
분기 여부의 의미 분해는 gesture 헬퍼(expandBranchOnActivate 등)가 담당.
키보드 Enter/Space 는 리프에서만 fire — 분기는 treeExpand 가 선점 처리. disabled 는 무시.
