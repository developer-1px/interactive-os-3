---
id: imperativeAudit
type: plan
project: ds
slug: imperativeAudit
title: 명령형 audit — P0/P1/P2 위반 리스트 + refactor plan
tags: [plan, audit, headless, refactor]
created: 2026-05-05
updated: 2026-05-05
---

스캔 범위: `packages/aria-kernel/src/patterns/`, `apps/outliner/src/`, `apps/kanban/src/`, `apps/site/src/demos/` (컬렉션 데모 표본).

## 1. Findings

### P0 (절대 위반 — 흡수 필수)

| file:line | 유형 | 인용 | 흡수 위치 | LOC delta |
|---|---|---|---|---|
| apps/kanban/src/widgets/Kanban.tsx:78–91 | 1 (Key→UiEvent in widget) | `if (e.key === 'Enter')` | `useListboxPattern` 에 `editable?: boolean` (tree.ts와 동일 시그니처) | widget −14, pattern +18 |
| apps/kanban/src/widgets/Kanban.tsx:33–43 | 5 (ad-hoc verb mapping) | `paste targetId → cards-array` | flatten 단계에서 `cardId` 자체에 `parent: arrId` meta 부여하거나 tree처럼 `paste` axis가 sibling-aware 하게. 현 구조는 **P1 로 다운그레이드** (도메인 — 아래 참조) | — |
| apps/outliner/src/widgets/Outliner.tsx:13–28 + apps/kanban/src/widgets/Kanban.tsx:13–26 | 3·4 (state scattered, 동일 boilerplate 2곳 반복) | `useState<Meta>… subscribe… setMeta` | `defineResource` 옵션에 `meta: { syncFromCrud: (crud) => Meta }` 또는 `useResource` 가 `(doc, meta, dispatch)` 3-tuple 반환 | 두 위젯 각 −16 LOC, store +20 LOC |

### P1 (단일 발생, 라이브러리 어휘에 속함)

| file:line | 유형 | 인용 | 흡수 위치 | LOC delta |
|---|---|---|---|---|
| apps/kanban/Kanban.tsx:33–43 | 5 | `cardParentArray[targetId]` | listbox `editable` 옵션의 `pasteResolver?: (targetId, data) => UiEvent` 콜백. Kanban 만의 array-id 매핑이라 P0 흡수 시 leaky. | widget −10, pattern +6 |
| apps/kanban/features/flattenBoard.ts:21–45 | 2 (imperative loops) | `propValue(...).children?.find(...)` | zod-crud → NormalizedData 어댑터 helper. `defineResource` 의 `select` 옵션. 단 도메인 schema 의존이라 generic 흡수는 보류. | — |
| apps/outliner/Outliner.tsx:31 | 5 | `data.meta?.focus ?? items[0]?.id` | `useTreePattern` 이 `activeId` 도 반환 (`focusId` 노출). 이미 내부에 있음 — return 만 추가. | widget −1, pattern +1 |
| apps/outliner/Outliner.tsx:27 + Kanban.tsx:25 | 4 | `setMeta(prev => reduce(...).meta ?? prev)` | reduce(meta) sync 를 `useResource` 가 흡수 (위 P0 행과 동일 뿌리). 묶어서 처리. | (위와 합산) |

### P2 (도메인 — 위젯에 남기는 것이 정당)

| file:line | 인용 | 사유 |
|---|---|---|
| apps/kanban/Kanban.tsx:33–43 (`paste→cards-array index`) | "paste-as-sibling-of-card" | zod-crud 의 array-as-parent 의미. ARIA/APG 어휘 아님. |
| apps/kanban/Kanban.tsx:58–62, 96–103 (`+ Column`, `+`) | 도메인 button | toolbar/menu 패턴 아님. 1회성 click. |
| flattenBoard / flattenOutline 전체 | zod-crud 트리 → NormalizedData | 도메인 schema 매핑. `@p/aria-kernel` 가 zod-crud 알면 안 됨. |

### 데모 표본 (`apps/site/src/demos/` 5+개 확인)

`listboxRearrangeable.tsx`, `treeMulti.tsx`, `comboboxAutocompleteBoth.tsx`, `feedInfinite.tsx`, `gridSortable.tsx` 모두 **`useState`/`useRef` 거의 없고 패턴 hook 1개로 끝**. 추가 P0/P1 없음 — 패턴이 이미 흡수했다.

## 2. P0 Refactor Plan

### P0-1 — `useListboxPattern` 에 `editable` 옵션 추가

- 수정: `packages/aria-kernel/src/patterns/listbox.ts`
  - 현재 시그니처: `useListboxPattern(data, onEvent, opts: { selectionFollowsFocus?, multiSelectable?, autoFocus?, containerId?, label?, labelledBy? })`
  - 추가: `editable?: boolean`. 동작은 `tree.ts:122–155` 의 `editKeyDown` 분기 그대로 — 단 Tab/Shift+Tab indent 어휘는 listbox 에 의미가 없으므로 **Enter→insertAfter, Backspace→remove 두 키만**. (옵션을 `editable: 'flat' | 'nested'` 로 두면 tree 와 통일 가능 — 결정은 1 turn 내 다음 PR.)
- 삭제: `apps/kanban/src/widgets/Kanban.tsx:78–91` (`onKey` 핸들러 14 LOC). `<ul {...lb.rootProps}>` 에서 `onKeyDown={onKey}` override 제거.
- 리스크: 기존 `useListboxPattern` 사용처 (`Kanban.tsx`, `apps/site/src/demos/listbox*.tsx` 전부) 는 default `editable=false` 라 회귀 0. **단 `tree.ts` 의 `editable` 키 매핑과 listbox 가 분기되면 이름 동의어 드리프트** — 이 PR 의 진짜 가치는 "editable 어휘를 패턴 레이어에서 선언" 한 가지로 통일.
- 검증: `npx tsc --noEmit -p apps/kanban/tsconfig.app.json` + `apps/kanban` 에서 카드에 포커스, Enter→새 카드 sibling, Backspace→삭제. `apps/site /listbox` 데모는 변동 없음.

### P0-2 — `useResource` meta 동기화 흡수

- 수정: `packages/aria-kernel/src/store/` (resource 모듈) — `defineResource` 에 `meta?: { syncFromCrud?(crud, prev): Meta; reduceWithEvent?: boolean }` 추가하거나, 더 단순하게 `useResource` 가 `[doc, meta, dispatch]` 3-tuple 반환. 내부에서 `crud.subscribe` 의 focus → meta 머지 + `reduce(...).meta` 합성을 한 곳에서.
- 삭제:
  - `apps/outliner/Outliner.tsx:13–28` (`useState<Meta>`+`useEffect`+`onEvent` setMeta 분기) — 16 LOC
  - `apps/kanban/Kanban.tsx:13–26` 동일 — 14 LOC
- 리스크: `useResource` 의 현재 단일 `(value, dispatch)` 계약 (메모리: *Single data interface — useResource*) 이 깨질 수 있음. **3-tuple 은 계약 위반 가능성** — 대신 `data` 객체 자체에 `meta` 가 머지되어 나오도록 (resource 가 zod-crud subscribe 와 reduce 를 둘 다 흡수) 하는 편이 invariant 정합. 두 위젯 모두 `data.meta.focus` 를 읽으므로 자연스럽다.
- 검증: tsc + outliner 에서 Tab indent 후 새 child 가 자동 focus, kanban 에서 Cmd+X→Tab→Cmd+V 동작.

### P0-3 (위 두 건의 자연 귀결)

`flattenOutline`/`flattenBoard` 는 도메인이라 그대로. 단 `useResource` 가 `select: (doc) => NormalizedData` 옵션을 받으면 `useMemo(() => flatten(doc), [doc])` 라인이 사라진다 (각 위젯 −2 LOC). **이건 P1 — 흡수 시 zod-crud type 이 store 인터페이스에 새지 않도록 generic `select` 로만**.

## 3. Accepted P2 list

- Kanban paste → cards-array index 매핑: zod-crud 의 array-as-parent 도메인 의미, ARIA 어휘 아님.
- Kanban "+ Column", "+ Add card" 버튼: 단발 click, 패턴화 가치 없음.
- `flattenOutline` / `flattenBoard`: 도메인 schema → NormalizedData. `@p/aria-kernel` 가 zod-crud 를 모르는 것이 정체성.
- Outliner header 의 키 가이드 텍스트 (`Enter · Tab …`): 데모 어포던스, 패턴화 대상 아님.

## 4. Open questions

1. `useListboxPattern` 에 `editable` 추가 시 — tree 의 `editable` 과 같은 boolean 으로 통일할지, listbox 는 indent 가 없으므로 시맨틱이 부분집합이라는 점을 어떻게 기록할지. 옵션명을 `flatEditable` 로 분리하면 동의어 드리프트, 같은 이름이면 일부 키만 동작 — **권장: 같은 이름 `editable`, docstring 에 "indent 키는 hierarchical 패턴(tree/treegrid)에서만 emit" 명시**.
2. `useResource` 의 meta 흡수 — 3-tuple vs `data.meta` 자동 머지 vs `useFeature` 로 진화. 현 두 위젯의 boilerplate 가 거의 글자단위 동일하므로 **반드시 흡수**. 형태는 main 의 결정사항.
3. Kanban paste resolver — `editable` 옵션의 콜백으로 받을지(`pasteResolver`), 아니면 `flattenBoard` 가 `cardId` 의 `parent` meta 를 미리 부여해 listbox 가 그대로 emit 할지. 후자가 declarative-first 정합.
