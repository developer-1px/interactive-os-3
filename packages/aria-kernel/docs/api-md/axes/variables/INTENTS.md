[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [axes](../README.md) / INTENTS

# Variable: INTENTS

> `const` **INTENTS**: `object`

Defined in: [axes/keys.ts:47](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/keys.ts#L47)

INTENTS — axis 별 intent ↔ KeyChord 매핑.

각 axis 는 본 매핑을 import 해서 동작 결정. 외부 consumer 도 동일 객체를 import
해서 키맵 표시·문서·테스트에 사용 (SSOT).

## Type Declaration

### activate

> `readonly` **activate**: `object`

#### activate.trigger

> `readonly` **trigger**: readonly \[[`KeyChord`](../interfaces/KeyChord.md), [`KeyChord`](../interfaces/KeyChord.md)\]

### escape

> `readonly` **escape**: `object`

#### escape.close

> `readonly` **close**: readonly \[[`KeyChord`](../interfaces/KeyChord.md)\]

### expand

> `readonly` **expand**: `object`

#### expand.close

> `readonly` **close**: readonly \[[`KeyChord`](../interfaces/KeyChord.md)\]

#### expand.open

> `readonly` **open**: readonly \[[`KeyChord`](../interfaces/KeyChord.md), [`KeyChord`](../interfaces/KeyChord.md), [`KeyChord`](../interfaces/KeyChord.md)\]

### gridMultiSelect

> `readonly` **gridMultiSelect**: `object`

#### gridMultiSelect.rangeDown

> `readonly` **rangeDown**: [`KeyChord`](../interfaces/KeyChord.md)

#### gridMultiSelect.rangeLeft

> `readonly` **rangeLeft**: [`KeyChord`](../interfaces/KeyChord.md)

#### gridMultiSelect.rangeRight

> `readonly` **rangeRight**: [`KeyChord`](../interfaces/KeyChord.md)

#### gridMultiSelect.rangeUp

> `readonly` **rangeUp**: [`KeyChord`](../interfaces/KeyChord.md)

#### gridMultiSelect.selectAll

> `readonly` **selectAll**: readonly \[[`KeyChord`](../interfaces/KeyChord.md), [`KeyChord`](../interfaces/KeyChord.md), [`KeyChord`](../interfaces/KeyChord.md), [`KeyChord`](../interfaces/KeyChord.md)\]

#### gridMultiSelect.selectColumn

> `readonly` **selectColumn**: [`KeyChord`](../interfaces/KeyChord.md)

#### gridMultiSelect.selectRow

> `readonly` **selectRow**: [`KeyChord`](../interfaces/KeyChord.md)

#### gridMultiSelect.toggle

> `readonly` **toggle**: readonly \[[`KeyChord`](../interfaces/KeyChord.md)\]

### gridNavigate

> `readonly` **gridNavigate**: `object`

#### gridNavigate.down

> `readonly` **down**: [`KeyChord`](../interfaces/KeyChord.md)

#### gridNavigate.gridEnd

> `readonly` **gridEnd**: [`KeyChord`](../interfaces/KeyChord.md)

#### gridNavigate.gridStart

> `readonly` **gridStart**: [`KeyChord`](../interfaces/KeyChord.md)

#### gridNavigate.left

> `readonly` **left**: [`KeyChord`](../interfaces/KeyChord.md)

#### gridNavigate.right

> `readonly` **right**: [`KeyChord`](../interfaces/KeyChord.md)

#### gridNavigate.rowEnd

> `readonly` **rowEnd**: [`KeyChord`](../interfaces/KeyChord.md)

#### gridNavigate.rowStart

> `readonly` **rowStart**: [`KeyChord`](../interfaces/KeyChord.md)

#### gridNavigate.up

> `readonly` **up**: [`KeyChord`](../interfaces/KeyChord.md)

### multiSelect

> `readonly` **multiSelect**: `object`

#### multiSelect.rangeDown

> `readonly` **rangeDown**: [`KeyChord`](../interfaces/KeyChord.md)

#### multiSelect.rangeUp

> `readonly` **rangeUp**: [`KeyChord`](../interfaces/KeyChord.md)

#### multiSelect.selectAll

> `readonly` **selectAll**: readonly \[[`KeyChord`](../interfaces/KeyChord.md), [`KeyChord`](../interfaces/KeyChord.md), [`KeyChord`](../interfaces/KeyChord.md), [`KeyChord`](../interfaces/KeyChord.md)\]

#### multiSelect.toggle

> `readonly` **toggle**: readonly \[[`KeyChord`](../interfaces/KeyChord.md), [`KeyChord`](../interfaces/KeyChord.md)\]

### navigate

> `readonly` **navigate**: `object`

#### navigate.end

> `readonly` **end**: [`KeyChord`](../interfaces/KeyChord.md)

#### navigate.horizontal

> `readonly` **horizontal**: `object`

#### navigate.horizontal.next

> `readonly` **next**: [`KeyChord`](../interfaces/KeyChord.md)

#### navigate.horizontal.prev

> `readonly` **prev**: [`KeyChord`](../interfaces/KeyChord.md)

#### navigate.start

> `readonly` **start**: [`KeyChord`](../interfaces/KeyChord.md)

#### navigate.vertical

> `readonly` **vertical**: `object`

#### navigate.vertical.next

> `readonly` **next**: [`KeyChord`](../interfaces/KeyChord.md)

#### navigate.vertical.prev

> `readonly` **prev**: [`KeyChord`](../interfaces/KeyChord.md)

### numericStep

> `readonly` **numericStep**: `object`

#### numericStep.horizontal

> `readonly` **horizontal**: `object`

#### numericStep.horizontal.dec

> `readonly` **dec**: readonly \[[`KeyChord`](../interfaces/KeyChord.md), [`KeyChord`](../interfaces/KeyChord.md)\]

#### numericStep.horizontal.inc

> `readonly` **inc**: readonly \[[`KeyChord`](../interfaces/KeyChord.md), [`KeyChord`](../interfaces/KeyChord.md)\]

#### numericStep.max

> `readonly` **max**: [`KeyChord`](../interfaces/KeyChord.md)

#### numericStep.min

> `readonly` **min**: [`KeyChord`](../interfaces/KeyChord.md)

#### numericStep.pageDec

> `readonly` **pageDec**: [`KeyChord`](../interfaces/KeyChord.md)

#### numericStep.pageInc

> `readonly` **pageInc**: [`KeyChord`](../interfaces/KeyChord.md)

#### numericStep.vertical

> `readonly` **vertical**: `object`

#### numericStep.vertical.dec

> `readonly` **dec**: readonly \[[`KeyChord`](../interfaces/KeyChord.md)\]

#### numericStep.vertical.inc

> `readonly` **inc**: readonly \[[`KeyChord`](../interfaces/KeyChord.md)\]

### pageNavigate

> `readonly` **pageNavigate**: `object`

#### pageNavigate.next

> `readonly` **next**: [`KeyChord`](../interfaces/KeyChord.md)

#### pageNavigate.prev

> `readonly` **prev**: [`KeyChord`](../interfaces/KeyChord.md)

### select

> `readonly` **select**: `object`

#### select.toggle

> `readonly` **toggle**: readonly \[[`KeyChord`](../interfaces/KeyChord.md)\]

### treeExpand

> `readonly` **treeExpand**: `object`

#### treeExpand.close

> `readonly` **close**: [`KeyChord`](../interfaces/KeyChord.md)

#### treeExpand.open

> `readonly` **open**: [`KeyChord`](../interfaces/KeyChord.md)

### treeNavigate

> `readonly` **treeNavigate**: `object`

#### treeNavigate.firstChild

> `readonly` **firstChild**: [`KeyChord`](../interfaces/KeyChord.md)

#### treeNavigate.next

> `readonly` **next**: [`KeyChord`](../interfaces/KeyChord.md)

#### treeNavigate.parent

> `readonly` **parent**: [`KeyChord`](../interfaces/KeyChord.md)

#### treeNavigate.prev

> `readonly` **prev**: [`KeyChord`](../interfaces/KeyChord.md)
