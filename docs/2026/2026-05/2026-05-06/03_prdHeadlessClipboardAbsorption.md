---
type: prd
status: needs-triage
project: headless
layer: patterns + adapters
tags: [prd, write-absorption, clipboard, history, zod-crud-adapter]
related:
  - docs/2026/2026-05/2026-05-06/02_writeAdapterPriorArt.md
---

# PRD — 패턴 hook이 W3C Clipboard Event + 잔여 단축키를 자체 흡수

## Problem Statement

`@p/aria-kernel`로 productivity 앱을 만드는 사용자는 컬렉션에 쓰기(copy/cut/paste/undo/redo/delete)를 붙이려 할 때마다 매 widget에서 같은 보일러플레이트를 손으로 짠다.

```tsx
// 현재 — outliner / kanban widget이 매번 작성
useHistoryShortcuts(onEvent)
useClipboardShortcuts(onEvent, () => activeId)
```

추가로:
- `crud.subscribe(_, focus) → setMeta` useEffect — view-state(`meta.focus`)를 widget이 직접 동기화
- `flatten(snapshot) + meta` merge — NormalizedData 합성을 widget이 매번 useMemo
- `onEvent = (e) => { dispatch(e); setMeta(reduce(...)) }` — 외부 store와 view-state 양쪽 dispatch 분기
- `activeId = getFocus(data) ?? items[0]?.id` — focus 추출 로직이 widget에 흩어짐

이 wiring은 **APG에 spec이 없는 OS de facto 어휘**(W3C Clipboard Event + Cmd+Z/Y/Backspace)를 패턴이 흡수하지 않아 발생. memory `feedback_unified_roving_all_roles` "패턴 recipe는 내부에서 composeAxes 내장. 소비자가 직접 onKeyDown 다루면 미완"의 위반 상태.

조사(`02_writeAdapterPriorArt.md`) 결과 헤드리스 React 생태계에 선례 없음 — productivity 앱은 in-house로 풀고 있고, LLM이 in-house를 풀 때 가장 헤매는 4지점(어휘 마비/위치 환원/인접 정본 무지/ARIA punt 무지)이 모두 이 영역에 응축. 패턴이 흡수해 decision-removed 형태로 ship해야 LLM-buildable productivity infra라는 정체성(`project_headless_for_llm_inhouse`)에 정합.

## Solution

**소비자 widget 코드 변화:**

```tsx
// before (outliner ~30줄)
const [doc, dispatch] = useResource(outlineResource)
const snapshot = doc ?? crud.snapshot()
const [meta, setMeta] = useState({})
useEffect(() => crud.subscribe((_c, focus) => focus && setMeta(p => ({...p, focus}))), [])
const data = useMemo(() => ({ ...flattenOutline(snapshot), meta: {...} }), [snapshot, meta])
const onEvent = (e) => { dispatch(e); setMeta(p => reduce({...data, meta: p}, e).meta ?? p) }
const tree = useTreePattern(data, onEvent, { editable: true, label: 'outline' })
const activeId = getFocus(data) ?? tree.items[0]?.id ?? null
useHistoryShortcuts(onEvent)
useClipboardShortcuts(onEvent, () => activeId)

// after (3줄)
const [data, onEvent] = useZodCrudResource(outlineResource, crud, flattenOutline)
const tree = useTreePattern(data, onEvent, { editable: true, label: 'outline' })
```

**3가지 변경:**

1. **패턴 hook이 rootProps에 W3C Clipboard Event(`onCopy`/`onCut`/`onPaste`)와 잔여 단축키(`Cmd+Z`/`Cmd+Shift+Z`/`Cmd+Y`/`Backspace`/`Delete`)를 자체 부착.** UiEvent 어휘는 이미 1급(`types.ts:69-81`). 패턴은 onEvent로 emit만, payload 직렬화는 모름. 이벤트 객체를 onEvent에 동봉(`onEvent({type:'copy', id, event})`).

2. **`@p/aria-kernel/adapters/zod-crud` subpath 신설 — `useZodCrudResource(resource, crud, flatten)` hook.** `[data, dispatch]` 시그니처(useResource 정합). 안에서 crud.subscribe 통합, flatten + meta.focus 합성, onEvent 핸들러가 `event.clipboardData.setData/getData` 처리 후 jsonCrud op 호출, 결과 focusNodeId를 meta.focus로 자동 반영.

3. **`useHistoryShortcuts` / `useClipboardShortcuts` 두 export 즉시 삭제.** 소비자 = 2개 widget(같은 PR에서 마이그). deprecated alias 사이클 없음.

clipboard 직렬화는 **triple-MIME**(`application/x-p-headless+json` 정본 + `text/html` cross-app + `text/plain` fallback) — Lexical/ProseMirror 수렴 패턴. paste 우선순위는 json → html → plain, 각 단계 schema 검증 실패 시 다음으로.

input/contenteditable 처리는 패턴 옵션 `insideEditable: 'forward' | 'native' | 'preventDefault'`로 노출. 기본값 `'forward'`(combobox 검색창 paste 등 막을 수 없는 케이스 보호).

## User Stories

1. As a `@p/aria-kernel` 사용자(in-house productivity 개발자), I want pattern hook 한 번 호출하면 Cmd+C/X/V/Z/Backspace가 자동 작동하기를 원한다, so that 매 widget에서 단축키 hook 두 줄을 쓰지 않아도 된다.
2. As a 사용자, I want zod-crud의 `JsonCrud`를 패턴에 한 줄로 연결하기를 원한다, so that 외부 store ↔ NormalizedData 합성을 직접 짜지 않아도 된다.
3. As a 사용자, I want clipboard로 복사한 노드를 같은 앱 다른 위치에 paste하면 schema 검증을 통과한 채 삽입되기를 원한다, so that 스키마 위반 데이터가 절대 들어오지 않는다.
4. As a 사용자, I want clipboard로 복사한 노드를 다른 앱(Notion·Google Docs 등)에 paste하면 의미를 잃지 않은 HTML로 들어가기를 원한다, so that cross-app productivity flow가 깨지지 않는다.
5. As a 사용자, I want Cmd+V 후 새 노드로 focus가 자동 이동하기를 원한다, so that 연속 paste/edit 흐름이 끊기지 않는다.
6. As a 사용자, I want Cmd+Z 후 이전 focus 위치로 복귀하기를 원한다, so that undo가 history navigation으로도 자연스럽게 작동한다.
7. As a 사용자, I want Backspace로 활성 노드를 삭제하면 다음 sibling으로 focus가 이동하기를 원한다, so that 키보드만으로 list-edit이 가능하다.
8. As a combobox 사용자, I want input 검색창 안에서 Cmd+V로 텍스트 paste가 되기를 원한다, so that 입력 흐름이 끊기지 않는다(insideEditable: 'forward' 기본).
9. As a kanban widget 작성자, I want 인라인 편집 중인 셀에서는 native 동작에 양보하기를 원한다, so that contenteditable가 자체 처리한다(insideEditable: 'native' opt-in).
10. As a 사용자, I want 메뉴바 Edit > Copy 같은 OS 메뉴 트리거도 작동하기를 원한다, so that 키보드 외 input modality가 열려있다(W3C Clipboard Event 자체 처리의 부수 효과).
11. As a 터치 디바이스 사용자, I want long-press 컨텍스트 메뉴의 "Copy"가 작동하기를 원한다, so that 모바일에서도 productivity flow가 가능하다(같은 부수 효과).
12. As a 사용자, I want copy 시 system clipboard에 진짜 데이터가 들어가기를 원한다, so that 다른 브라우저 탭/세션에서도 paste가 가능하다.
13. As a 사용자, I want 패턴 hook의 시그니처가 변하지 않기를 원한다, so that 기존 패턴 사용 코드가 그대로 작동한다(`(data, onEvent, options)` 유지).
14. As a 사용자, I want adapter hook이 `[data, dispatch]` 형태이기를 원한다, so that 기존 useResource와 같은 형태로 다룰 수 있다.
15. As a `@p/aria-kernel` 메인테이너, I want 새 인터페이스/추상을 추가하지 않기를 원한다, so that LLM 의사결정 부담이 늘지 않는다(`feedback_minimize_choices_for_llm`).
16. As a `@p/aria-kernel` 메인테이너, I want NormalizedData/UiEvent 정본을 그대로 활용하기를 원한다, so that 어휘가 두 곳으로 갈라지지 않는다.
17. As a 다른 백엔드(Yjs/in-memory) 어댑터 작성자, I want adapter가 단지 `(data, onEvent)`를 만드는 hook 컨벤션이기를 원한다, so that 별도 인터페이스 정의 없이 짤 수 있다.
18. As a 사용자, I want 두 헬퍼 hook(`useHistoryShortcuts`, `useClipboardShortcuts`)이 깔끔하게 사라지기를 원한다, so that "어느 길로 가야 하나" 결정이 사라진다.
19. As a Outliner widget 작성자, I want 마이그 후 widget 코드가 ~30줄 → 3줄이 되기를 원한다, so that 도메인 로직만 남는다.
20. As a Kanban widget 작성자, I want 마이그 후 editingId 가드 로직이 옵션 1개로 대체되기를 원한다, so that 분기 if문이 사라진다.
21. As a 새 productivity 앱(Outline·Markdown·Slides 등) 작성자, I want 같은 어댑터 hook으로 즉시 시작 가능하기를 원한다, so that 매번 wiring을 새로 짜지 않는다.
22. As a 사용자, I want clipboard payload가 zod schema 검증을 통과한 후에만 commit 되기를 원한다, so that paste 후 invariant 깨짐이 없다.
23. As a 사용자, I want paste payload가 잘못된 형식이면 silent 무시되기를 원한다, so that 사용자가 외부 텍스트 paste해도 앱이 깨지지 않는다.
24. As a 사용자, I want adapter hook이 unmount 시 crud subscription도 자동 해제되기를 원한다, so that memory leak이 없다.
25. As a 사용자, I want copy/cut 시 e.preventDefault()가 호출되어 native가 빈 string을 clipboard에 안 넣기를 원한다, so that 정본 payload만 들어간다.
26. As a 사용자, I want focus가 빈 영역(어떤 item도 활성 아님)일 때 Backspace/Delete가 무시되기를 원한다, so that 의도치 않은 삭제가 없다.
27. As a 사용자, I want copy/cut/paste 어휘가 List/Tree/Treegrid 모든 collection 패턴에 일관되게 동작하기를 원한다, so that 패턴마다 다른 행동을 외울 필요가 없다.
28. As a 사용자, I want llms.txt가 새 어댑터 hook과 단축키 자동 부착을 반영하기를 원한다, so that LLM이 outdated info로 옛 패턴을 제안하지 않는다.

## Implementation Decisions

### 1. 어휘 — 신규 0개

NormalizedData/UiEvent/ControlProps/Meta는 이미 정본(`packages/aria-kernel/src/types.ts`). UiEvent에 `copy/cut/paste/undo/redo/insertAfter/appendChild/update/remove`이 1급 등재됨(`types.ts:69-81`). routeUiEventToCrud도 이미 존재(`store/routeUiEventToCrud.ts`). 새 인터페이스/타입/추상 추가 0건.

### 2. 패턴 hook 변경 (Deep module #1)

대상: `useTreePattern`(우선), `useGridPattern`, `useListPattern`/`useListbox`, `useFeed`, `useTreegrid` 등 collection 패턴.

추가 행동:
- rootProps에 `onCopy`/`onCut`/`onPaste` DOM event handler 부착
- rootProps의 onKeyDown(이미 composeAxes로 부착)에 `Cmd+Z`/`Cmd+Shift+Z`/`Cmd+Y`/`Backspace`/`Delete` 매핑 추가
- 모든 핸들러는 onEvent로 UiEvent emit, event 객체 동봉(`onEvent({type, id, event})`)
- Backspace/Delete는 focus가 비어있으면 no-op (memory `feedback_tree_focus_no_expand` 정신과 같음 — 안전)

신규 옵션:
- `insideEditable: 'forward' | 'native' | 'preventDefault'` (default `'forward'`)
- `'forward'` — input/contenteditable 안이어도 onEvent 발화, native 동작 유지
- `'native'` — input 안이면 onEvent 안 함 (kanban 인라인 편집 케이스)
- `'preventDefault'` — onEvent 발화 + native preventDefault (커스텀 에디터)

기존 옵션·시그니처·반환값 변경 0건. `(data, onEvent, options)` 그대로.

### 3. zod-crud 어댑터 hook (Deep module #2)

신설: `@p/aria-kernel/adapters/zod-crud` subpath. peerDependency: `zod-crud`. 코어 `@p/aria-kernel`는 zod-crud 비의존.

```
useZodCrudResource(
  resource: Resource<JsonDoc>,
  crud: JsonCrud<T>,
  flatten: (snapshot: JsonDoc) => Pick<NormalizedData, 'entities' | 'relationships'> & { meta?: Partial<Meta> }
): [data: NormalizedData, dispatch: (e: UiEvent) => void]
```

내부 책임:
- `useResource(resource)` 래핑 — 외부 store 통합
- `crud.subscribe((_, focus) => ...)` 자동 부착, focus를 meta.focus에 반영, unmount 시 자동 해제
- `flatten(snapshot)` + `meta.focus`/expanded/selectAnchor 합성 → NormalizedData 한 객체 반환
- `dispatch` 핸들러:
  - clipboard event 동봉 UiEvent: `event.clipboardData.setData/getData` 처리(triple-MIME), zod 검증 후 `crud.copy/cut/paste/delete/undo/redo` 호출
  - `result.focusNodeId`를 meta.focus에 반영 → 다음 render 자동 포커스
  - schema 검증 실패 paste: silent 무시 (사용자 명시적 알림 옵션은 후속 PRD)

### 4. clipboard payload codec (Deep module #3)

순수 함수 모듈, 내부 `encode(value, {schema}) → {json, html, plain}` / `decode(clipboardData, {schema}) → value | null`. 패턴 hook과 무관, useZodCrudResource 안에서만 호출. 별 파일 + 별 테스트.

MIME:
- `application/x-p-headless+json` — JSON.stringify(value)
- `text/html` — Tree=중첩 `<ul><li>`, List=`<ul><li>`, Grid=`<table>` (구조별 분기)
- `text/plain` — 텍스트만 추출 (label join)

decode 우선순위: x-p-headless+json → html(parser로 구조 복원 시도) → plain(텍스트만 단일 노드).

### 5. insideEditable router (Deep module #4)

작은 순수 함수: `(activeElement, mode) → 'emit' | 'skip' | 'emit-prevent'`. 패턴 hook이 호출. activeElement가 input/textarea/[contenteditable]인지 검사 + mode 분기.

### 6. 폐기

- `packages/aria-kernel/src/key/useHistoryShortcuts.ts` 삭제
- `packages/aria-kernel/src/key/useClipboardShortcuts.ts` 삭제
- `packages/aria-kernel/src/key/index.ts` 두 export 줄 삭제
- `packages/aria-kernel/src/index.ts` 두 export 줄 삭제 (`types.ts`에 등록돼 있다면)

같은 PR에서 outliner/kanban 마이그 동시 진행 — alias 사이클 없음.

### 7. widget 마이그

- `apps/outliner/src/widgets/Outliner.tsx` — 30줄 wiring → 3줄. 단일 useTreePattern 케이스, 검증 1차.
- `apps/kanban/src/widgets/Kanban.tsx` — multi-list. `editingId` 가드를 `insideEditable: 'native'` 옵션으로 대체. 검증 2차.
- `apps/finder`/`apps/markdown`/`apps/slides` — 영향 없음(현재 미사용 또는 read-only).

### 8. llms.txt 갱신

`apps/site/public/llms.txt` + `llms-full.txt`:
- 두 헬퍼 hook 라인 제거
- `useZodCrudResource` 라인 추가
- 패턴 hook 항목에 "clipboard event + 잔여 단축키 자체 부착" 메모 추가

### 9. memory 정정

`feedback_write_adapter_pattern.md` 톤 다운: "WriteAdapter 인터페이스" 표현 제거, "이미 있는 NormalizedData/UiEvent 위에 zod-crud adapter hook 1개 + 패턴 rootProps 보강"으로 정정.

## Testing Decisions

### 좋은 테스트의 조건

memory `feedback_test_via_demo_only`: **"테스트는 Demo 렌더 + user-event 키/마우스 조작만으로 커버리지 100%. 내부 단위테스트 신설 ❌"**.

ClipboardEvent는 user-event v14에서 지원(`user.copy()`, `user.paste()`). 키보드 단축키도 `user.keyboard('{Meta>}z{/Meta}')` 패턴.

### 테스트 대상 모듈

1. **패턴 hook (useTreePattern 등)**
   - Demo: outliner widget을 그대로 렌더 → user.click(item) → user.copy() → 다른 item에 user.paste() → DOM 상태 검증
   - 케이스: Cmd+Z/Y/Backspace/Delete 각각 → 결과 DOM
   - 케이스: insideEditable 3-mode 각각 → input 안에서 onEvent 발화 여부

2. **clipboard payload codec (Deep module #3)**
   - 순수 함수 — 단위 테스트 예외 허용 (memory `feedback_test_via_demo_only` 예외): encode/decode가 round-trip identity인지, 잘못된 payload가 null인지
   - **이 모듈만 단위 테스트 — 나머지는 모두 Demo 경유**

3. **useZodCrudResource (Deep module #2)**
   - Demo: outliner widget 렌더 → user-event로 wiring 전체 검증
   - 단위 테스트 없음 — Demo가 정본

4. **insideEditable router (Deep module #4)**
   - Demo: 동일. combobox demo 안에서 input 안 paste 시 onEvent 발화 + native 동작 양쪽 검증

### 회귀 테스트

- 기존 outliner.test / kanban.test (있다면) 그대로 통과해야 함 — widget 마이그 후 동일 user 시나리오 검증

### Prior art

- `packages/aria-kernel/src/patterns/*.test.tsx` (memory 통계 — 다수 존재했음)
- showcase: `apps/outliner` / `apps/kanban` — 이번 PRD의 1차 사용자

## Out of Scope

- **다른 어댑터 구현체**(Yjs / Automerge / in-memory). 컨벤션은 정해지지만 구현은 별 PRD.
- **PresenceAdapter / 협업 awareness 채널**. 내일 협업 제품을 만들면 별 PRD.
- **PolicyAdapter / RBAC**. 권한 모델은 별 PRD.
- **명시적 사용자 알림** (paste schema 실패 토스트 등). 현재 silent 무시. 알림 모델은 별 PRD.
- **async backend 지원** (Firestore/REST). zod-crud는 sync. 동기 backend만 1차.
- **drag-and-drop**. cross-instance DnD는 별 layer 필요.
- **virtualization**. scrollOffset은 NormalizedData에 자리 있지만 이번 PRD는 미구현.
- **edit mode UI** (인라인 편집 입력 위젯). insideEditable 옵션만 노출, 편집 입력 자체는 widget 책임.

## Further Notes

- **LLM 함정 방지**: 이번 사이클에서 발견된 4지점(어휘 마비/위치 환원/인접 정본 무지/ARIA punt 무지)이 `project_headless_for_llm_inhouse`에 박힘. 미래 세션에서 같은 함정 재발 방지.
- **Best Practice 정합성**: triple-MIME = Lexical/ProseMirror 수렴, edit-mode 키 라우팅 = AG Grid de facto, snapshot/subscribe/mutate = 5개 CRDT 공통 골격 — 모두 11개 라이브러리 조사(`02_writeAdapterPriorArt.md`) 결과 확인됨.
- **헤드리스 React 첫 사례**: 컬렉션 쓰기를 1급으로 다루는 헤드리스 React 라이브러리 0개. `@p/aria-kernel`가 productivity-shaped 자리 차지.
- **마이그 비용**: outliner/kanban 두 widget만 영향. 외부 소비자 0(`project_headless_only_with_tailwind` single-product). 알림 없음.
- **새 패턴 추가 시 적용**: collection 패턴(List/Tree/Grid/Treegrid 류) 모두 같은 변경. 신규 패턴 PR마다 이 PRD 결정 따라가야 함.
