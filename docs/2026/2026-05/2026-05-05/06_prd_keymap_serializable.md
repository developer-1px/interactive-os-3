---
type: prd
status: needs-triage
project: headless
layer: axes/state/key/schema
tags: [keymap, uievent, serializable, reducer-slice, deep-module]
date: 2026-05-05
---

# PRD — 키보드 처리 100% 직렬화 (KeyMap → 의도형 UiEvent → axis별 reducer slice)

## Problem Statement

`@p/headless`에는 키 처리를 직렬화 가능한 plain data로 표현하기 위한 primitive(`KeyChord`·`Trigger`·`INTENTS` SSOT·`KeyMap` tuple·`fromKeyMap`)가 이미 박혀 있다. 그러나 실제 코드는 그 비전을 절반만 따른다.

- `axes/keys.ts`의 `INTENTS`는 chord SSOT로 박제됨 ✓
- 그런데도 `patterns/listbox.ts`·`treeGrid.ts`·`menu.ts`·`combobox.ts`·`grid.ts`·`carousel.ts`·`sliderRange.ts`·`splitter.ts`·`dialog.ts`·`menuButton.ts`·`tree.ts` 등은 자체적으로 `e.key === 'ArrowDown'` 같은 직접 비교를 다시 짠다.
- `key/useShortcut.ts`는 `'mod+k'` 문자열을 자체 파싱하는 별도 어휘를 운영한다.
- `apps/finder/useFinderShortcuts.ts`·`apps/kanban/Kanban.tsx`·다수 demos에서 다시 raw `e.key` 처리.
- `KeyMap`의 오른쪽 칸이 함수(`KeyHandler = (d, id) => UiEvent[] | null`)라 KeyMap 자체가 JSON으로 왕복하지 않는다 — 직렬화 invariant의 마지막 1% 누수.

결과: 같은 ARIA 행동을 표현하는 어휘가 3개(INTENTS / 패턴별 raw `e.key` / `useShortcut` parser) 공존하고, KeyMap이 plain data가 아니라 함수 표를 들고 있어 DevTools/i18n cheatsheet/사용자 키 재매핑/스냅샷 테스트에 전부 손이 닿지 않는다.

## Solution

KeyMap의 오른쪽 칸을 **함수에서 의도형 UiEvent template**으로 바꾼다. 동적 계산(siblingNext·visibleFlat·grid 좌표·anchor range)은 reducer 측으로 이주시켜 axis별 1:1 거울 slice에 캡슐화한다. 모든 키 처리(axis 내부·패턴 내부·글로벌 단축키·앱 단축키)가 같은 `KeyMap` 어휘를 쓰고, 동일한 `UiEvent` discriminated union으로 emit한다.

핵심 변환:

```ts
// before — 함수 잔재
type KeyMap = ReadonlyArray<[KeyChord | KeyChord[], (d, id) => UiEvent[] | null]>

// after — 100% plain
type KeyMap = ReadonlyArray<[KeyChord | KeyChord[], UiEventTemplate | UiEventTemplate[]]>

const treeExpandMap: KeyMap = [
  [INTENTS.expand.open,      { type: 'expand',   open: true  }],
  [INTENTS.expand.close,     { type: 'expand',   open: false }],
  [INTENTS.activate.trigger, { type: 'activate' }],
  [k('k', { meta: true }),   { type: 'palette.open' }],   // 글로벌도 같은 어휘
]
```

dispatcher가 매칭 시점에 `{ ...template, id: focusId }`를 합성. id가 필요 없는 글로벌 의도(palette/undo/redo 등)는 그대로 통과.

## User Stories

1. headless 라이브러리 사용자로서, 패턴 hook이 받는 (data, onEvent) 인터페이스 외에 raw `e.key` 처리를 한 줄도 쓰고 싶지 않다 — ARIA 행동을 패턴이 완결해야 하므로.
2. headless 사용자로서, 글로벌 단축키(`mod+k`)를 등록할 때 axis 키맵과 같은 어휘(`KeyChord`)를 쓰고 싶다 — 어휘 1개를 학습해서 모든 키 처리에 적용할 수 있어야 하므로.
3. headless 사용자로서, KeyMap 표를 JSON으로 dump하고 reload하면 동일하게 동작하길 바란다 — 사용자 정의 키 재매핑을 JSON 파일로 override하는 Vim 모드를 만들고 싶으므로.
4. headless 사용자로서, 키 매핑 cheatsheet UI를 자동 생성하길 바란다 — INTENTS + KeyMap에서 단축키 표를 그대로 렌더해 i18n까지 한 번에 처리하고 싶으므로.
5. 패턴 작성자로서, 새 패턴을 만들 때 `fromKeyMap([[chord, template], ...])` 한 줄로 끝내고 싶다 — if/else 분기로 키 처리를 다시 짜고 싶지 않으므로.
6. 새 axis 추가자로서, axis 파일과 reducer slice 파일을 한 쌍으로만 추가하면 되길 바란다 — `reduce.ts`나 다른 곳을 수정하지 않고 OCP를 유지하고 싶으므로.
7. 앱 개발자로서, 글로벌 단축키 핸들러를 등록할 때 `useShortcut('mod+k', fn)` 대신 `useKeyMap([[k('k', { meta: true }), { type: 'palette.open' }]])` 같이 같은 어휘로 쓰고 싶다 — 어휘를 두 개 학습하고 싶지 않으므로.
8. 앱 개발자로서, headless가 모르는 의도형 UiEvent(`palette.open` 같은)를 onEvent로 받아 직접 처리하고 싶다 — reducer fallthrough가 자연스럽게 되어야 하므로.
9. 앱 개발자로서, 특정 의도형 UiEvent를 가로채서 다른 동작으로 변환하고 싶다 — 기존 `middleware.ts` `pre-dispatch` phase로 해결되어야 하므로.
10. 라이브러리 작성자로서, axis 파일이 거의 비어있고 (`fromKeyMap([...intents...])` 한 줄), 좌표/visible/anchor 산수는 reducer slice로 이주된 형태를 보고 싶다 — 책임이 입출력 경계에서 분리되어야 SRP가 산다.
11. 디버거로서, 어떤 의도형 UiEvent든 reducer slice 한 곳에서 처리 흐름을 볼 수 있어야 한다 — type별 처리 위치가 한 곳에 박혀야 한다.
12. 테스트 작성자로서, axis는 `(KeyMap, Trigger) → UiEvent[]` 관계만 검증하고, slice는 `(data, UiEvent) → next data` 관계만 검증하고 싶다 — 두 책임이 분리되어 테스트도 분리되어야 한다.
13. headless 사용자로서, 클릭/딥링크에서 특정 id로 navigate하려면 `{type:'navigate', id}` 결과형을 그대로 emit할 수 있길 바란다 — 마우스/딥링크는 dir을 모르고 좌표 → id만 알기 때문이다.
14. 라이브러리 작성자로서, `{type:'navigate', id, dir}` 같은 모순 형태가 schema 수준에서 차단되길 바란다 — `id ⊕ dir` zod refine으로 강제되어야 한다.
15. 패턴 마이그레이션 담당자로서, axis를 한 번에 1개씩 의도형으로 변환할 수 있길 바란다 — 한 axis 변환이 다른 axis를 깨뜨리지 않아야 incremental PR이 가능하다.
16. 사용자(LLM)로서, 키맵을 작성할 때 chord 어휘는 항상 `KEYS.X` / `INTENTS.X`에서 import — raw 문자열 입력은 lint/type으로 차단되길 바란다 — minimize choices 원칙이 어휘 진입점에서부터 작동해야 한다.

## Implementation Decisions

### Q1·Q2 — Descriptor 형태

- 기존 `axes/KeyMap` tuple 어휘를 그대로 재사용. 새 `defineKeyMap`/`useKeyMap` 표면 어휘를 만들지 않는다 (invariant #6 search before create).
- `useShortcut`도 같은 KeyMap 어휘 위에 React 래퍼만 둔다 (`useKeyMap`).

### Q3 — 글로벌 vs 컬렉션 디스패처 분리

- 두 디스패처가 같은 `KeyMap` 데이터를 소비:
  - `fromKeyMap(KeyMap) → Axis` — 컬렉션용. 시그니처 `(data, focusId, Trigger) → UiEvent[] | null`.
  - `bindGlobalKeyMap(KeyMap, onEvent) → unbind` — 글로벌용. window keydown listen, focusId 의존 없음, template에 id가 없으면 그대로 emit.
- Axis 시그니처를 글로벌까지 통일하지 않는다 — 글로벌은 NormalizedData가 없으므로.

### Q3.5 — 순수파 (100% 직렬화)

- `KeyMap` 오른쪽 칸을 함수에서 `UiEventTemplate` (또는 그 배열)로 변경. KeyHandler 함수형은 deprecate.
- 동적 계산은 reducer로 이주.

### Q4 — UiEvent 의도형 어휘 모양 = `(a) {type, dir}`

기존 `UiEvent` discriminated union 멤버에 `dir` 필드 추가. type union을 키우지 않는다.

추가/확장:

- `{type:'navigate', id?, dir?}` — `id ⊕ dir`. dir 어휘: `'next'|'prev'|'start'|'end'|'pageNext'|'pagePrev'|'visibleNext'|'visiblePrev'|'firstChild'|'toParent'|'gridUp'|'gridDown'|'gridLeft'|'gridRight'|'rowStart'|'rowEnd'|'gridStart'|'gridEnd'`
- `{type:'value', id, dir}` (numericStep) — dir: `'inc'|'dec'|'min'|'max'|'pageInc'|'pageDec'`. 기존 `value: unknown` 변종은 click/explicit set 용으로 유지.
- `{type:'selectRange', id?, dir}` (multiSelect) — anchor 기반 range. dir: `'up'|'down'|'left'|'right'`. 기존 `selectMany` 결과형은 유지(앱이 직접 ids 지정 시).

기존 결과형(`{type:'navigate', id}`)은 영구 공존 (Q7).

### Q5 — Reducer 위치 = `B' (axis별 slice)`

```
packages/headless/src/state/
  reduce.ts                  ~50 lines — composeReducers(...slices)
  slices/
    navigate.ts              ~50 lines  — sibling prev/next/start/end
    treeNavigate.ts          ~60 lines  — visibleNext/Prev, firstChild, toParent
    treeExpand.ts            ~80 lines  — branch open/close + leaf navigate
    expand.ts                ~30 lines
    multiSelect.ts           ~70 lines  — selectRange anchor 기반
    grid.ts                  ~150 lines — gridUp/Down/Left/Right + range
    pageNavigate.ts          ~25 lines
    numericStep.ts           ~40 lines
    typeahead.ts             ~25 lines
    _helpers/
      visibleFlat.ts
      siblingStep.ts
      gridStep.ts
      rangeFrom.ts
```

axis 파일은 거의 비어진다 (`fromKeyMap([[INTENTS.X, {type, dir}], ...])` 1줄).

### Q5.5 — 라우팅 = dir 어휘로

- type union을 안 키운다 (`navigate.sibling` `navigate.visible` `navigate.grid` 식 분기 X).
- 각 slice는 자기가 담당하는 dir 어휘만 처리, 모르는 dir은 그대로 통과(`return state`).
- 같은 `{type:'navigate', dir}` 가 여러 slice를 거치며 첫 매치 slice가 처리.

### Q6 — 마이그레이션 순서

1. `activate` ★
2. `select` ★
3. `expand` ★★
4. `pageNavigate` ★★
5. `navigate` ★★
6. `numericStep` ★★
7. `treeNavigate` + `treeExpand` ★★★ (visibleFlat helper 이주)
8. `multiSelect` ★★★ (rangeFrom + anchor)
9. `gridNavigate` + `gridMultiSelect` ★★★★ (좌표 helper 이주, 양 가장 많음)
10. `typeahead` ★ (이미 의도형, 정합 정리)

병렬 트랙: `useShortcut` → `useKeyMap` 흡수 (axis 마이그레이션과 독립).

각 단계 = 5작업 PR: ① UiEvent + zod schema 추가 → ② axis 의도형 재작성 → ③ slice 신설 → ④ reduce.ts composer 등록 → ⑤ 패턴/테스트 마이그레이션.

### Q6.5 — 글로벌 의도 = `(α) onEvent bus + middleware pre-dispatch`

- `{type:'palette.open'}` 같은 앱 레벨 의도도 같은 UiEvent union에 들어온다.
- reducer는 case 없으면 state 그대로 통과(자연 fallthrough).
- 앱은 `onEvent`로 직접 잡거나, 기존 `middleware.ts`의 `pre-dispatch` phase로 가로채/변환.
- 새 채널/새 어휘 0.

### Q7 — 결과형 vs 의도형 = `(가) 영구 공존`

- 같은 type, `id ⊕ dir` zod refine으로 자유도 닫음.
- produce 지점이 입력 종류로 자연 분리되므로 LLM이 매번 고를 일이 없음 (마우스는 좌표 → id, 키보드는 dir).
- narrowing helper 제공: `isNavigateById(e)` `isNavigateByDir(e)`.
- 사용 규약 (lint/주석으로 강제):
  - axis는 항상 dir만 emit
  - 클릭 어댑터/딥링크는 항상 id만 emit

### Schema 변경

```ts
// schema.ts
const NavigateEvent = z.object({
  type: z.literal('navigate'),
  id: z.string().optional(),
  dir: z.enum([...18개...]).optional(),
}).refine(e => (e.id != null) !== (e.dir != null), 'id ⊕ dir')

const ValueEvent = ...  // dir | value 둘 중 하나
const SelectRangeEvent = ...
```

`UiEventSchema = z.discriminatedUnion('type', [...])` 에 추가.

### API 표면 (확정)

```ts
// @p/headless
export type KeyMap = ReadonlyArray<[KeyChord | KeyChord[], UiEventTemplate | UiEventTemplate[]]>
export const fromKeyMap: (km: KeyMap) => Axis
export const bindGlobalKeyMap: (km: KeyMap, onEvent: (e: UiEvent) => void) => () => void

// @p/headless/key
export const useKeyMap: (km: KeyMap, onEvent: (e: UiEvent) => void) => void

// @p/headless (state)
export const reduce: (data: NormalizedData, e: UiEvent) => NormalizedData
export const composeReducers: (...rs: Reducer[]) => Reducer

// helpers
export const isNavigateById:  (e: UiEvent) => e is NavigateById
export const isNavigateByDir: (e: UiEvent) => e is NavigateByDir
```

`useShortcut`은 `useKeyMap`의 1-entry 별칭으로 deprecate-but-working 유지 (마이그레이션 기간 중).

## Testing Decisions

좋은 테스트 = **외부 행동만**. axis 내부 if-else, slice 내부 helper 호출 순서, KeyMap tuple 순회 같은 implementation detail은 테스트하지 않는다.

### 테스트 대상

| 단위 | 인터페이스 | 검증 |
|---|---|---|
| `fromKeyMap` | `(KeyMap, Trigger) → UiEvent[] \| null` | 매칭 chord → 올바른 UiEventTemplate; 비매칭 → null |
| `bindGlobalKeyMap` | `(KeyMap, onEvent) → unbind` | window keydown → 매칭 시 onEvent 호출, modifier 가드(editable 안에선 무시) |
| `state/slices/X` | `(NormalizedData, UiEvent) → NormalizedData` | dir별 다음 focus·expanded·selection 정확성 |
| `schema.NavigateEvent` | zod parse | `id ⊕ dir` refine 통과/실패 |
| `middleware pre-dispatch` | 통합 | 가로챈 event가 reducer 도달 안 함; 변환된 event[]만 도달 |
| 패턴 통합 (`patterns/listbox.test.tsx` 등) | `fireEvent.keyDown` → ARIA state | 외부 행동 (focus 이동, aria-selected, aria-expanded) |

### Prior art (이미 있는 테스트 패턴)

- `axes/keys.test.ts` — chord 매칭 단위
- `axes/gridNavigate.test.ts`·`axes/gridMultiSelect.test.ts` — Trigger → UiEvent 단위
- `patterns/feed.test.tsx`·`patterns/spinbutton.test.ts` — 패턴 통합 (외부 ARIA state)
- `store/routeUiEventToCrud.test.ts` — UiEvent → 다음 state

### 테스트 우선순위

1. 새 zod refine (`id ⊕ dir`) — schema gate가 살아있어야 다른 테스트 의미 있음
2. slice 단위 (axis별 1파일, dir별 case)
3. 패턴 통합은 기존 테스트가 그대로 통과하면 OK (행동 invariant)

## Out of Scope

- DevTools UI / cheatsheet 자동 렌더 — 본 PRD는 KeyMap이 plain data가 되게 하는 것만. 시각화 도구는 후속.
- 사용자 키 재매핑 JSON loader — 직렬화 가능해진 후 별도 PRD.
- pan/zoom (wheel/pointer 기반) 키 처리 — 키보드 외 입력. 현재 UiEvent에 이미 있고 본 마이그레이션 영향권 밖.
- typeahead 동작 변경 — 이미 의도형이라 어휘 정합만, 행동 변경 없음.
- IME / dead key / composition event — 현재 useShortcut도 안 다룸. 별도.
- 시각·CSS 어휘 — Tailwind 책임, headless 책임 밖.
- `/store` `/local` resource 어댑터 — 본 PRD 영향 없음.
- 패턴별 ARIA 어휘(role/aria-*) 변경 — `aria-fit` 스킬 영역. 본 PRD는 키 → UiEvent 경로만.

## Further Notes

- 마이그레이션 중 임시 공존: 의도형 slice가 활성화되기 전까지 기존 axis는 결과형 UiEvent를 그대로 emit한다. axis 1개를 slice로 옮기는 순간 그 axis만 의도형으로 바뀐다. reducer는 두 형태를 모두 처리.
- `useShortcut`은 `useKeyMap`의 thin 별칭으로 유지 (`useShortcut('mod+k', fn)` → 내부에서 KeyChord 변환 + onEvent 콜백). deprecate 알림은 JSDoc only — 깨지지 않음.
- `INTENTS` SSOT는 손대지 않는다 (이미 plain data). 단, dir 어휘를 INTENTS와 짝맞추는 명명 규약 정리: `INTENTS.navigate.vertical.next` ↔ `dir:'next'` 같이.
- 본 PRD는 invariant #1·#2·#3·#4·#6·#7과 정합. invariant #5(Declare, don't assemble) 강화 — KeyMap이 진짜 declaration이 됨.
- 현재 working tree에 `state/expansion.*` 삭제가 있음 — 본 마이그레이션과 무관, 별도 흐름.
- 후속 작업 후보: KeyMap → Markdown cheatsheet 자동 생성기, 사용자 override JSON loader, ARIA APG cross-validation lint.
