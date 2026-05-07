---
id: stackReview
type: inbox
slug: stackReview
title: 전체 스택 객관 리뷰 — 3페르소나 × 8차원
tags: [inbox, retro, review]
created: 2026-05-05
updated: 2026-05-05
---

## 스코프

- 코어: `packages/aria-kernel/src/{store,patterns,types.ts}`, `packages/zod-crud/src/{editor,types.ts}`
- 사용처: `apps/outliner`, `apps/kanban`, `apps/finder/src/features/resources.ts`
- 권위: `CLAUDE.md` · `INVARIANTS.md` · `PATTERNS.md` · MEMORY.md · 01_outlinerPrd · 03_imperativeAudit

3 페르소나 약어: **U** = 까다로운 외부 사용자 · **R** = 설계 심사관 · **Y** = YAGNI 옹호자.

---

## 1. 정체성/경계 — zod-crud ↔ @p/aria-kernel

| 페르소나 | 한 줄 |
|---|---|
| U | `routeUiEventToCrud` + `CrudPort` duck-typing 으로 `@p/aria-kernel` 안에 zod-crud import 0건 — 처음 봐도 깨끗합니다. |
| R | UiEvent 9 verb 시그니처가 zod-crud op 와 자구까지 동일(`insertAfter`/`appendChild`/`paste{mode,index}`)이라 "duck-typing" 은 형식상 분리, 어휘는 사실상 단방향 종속입니다. |
| Y | `CrudPort` interface 는 단 1 consumer(`routeUiEventToCrud`)에만 쓰이는데 11개 메서드를 박제 — N=1 추상화입니다. |

- **강점**: 코드 import graph 는 cleanly inverted (`@p/aria-kernel` 가 zod-crud 모름).
- **약점**: 어휘 자체가 `JsonCrud` op 명에 lock-in — `CrudPort` 가 사실은 `JsonCrudInterface` 의 alias.
- **권고**: 의도적 1:1을 docstring 으로 *명시* 하거나, Crud 가 아닌 다른 백엔드(예: REST, CRDT)가 들어올 때를 대비해 verb 한두 개를 generic 화할지 결정.

## 2. 어휘 정렬 — UiEvent 9 vs zod-crud op 9 (1:1)

| 페르소나 | 한 줄 |
|---|---|
| U | 9:9 mapping switch 가 한 파일에 다 보여서 mental model 1초 — 좋습니다. |
| R | `types.ts:54-66` 주석이 "정본 = zod-crud op" 라고 자백 — `@p/aria-kernel` 는 ARIA-faithful 인데 편집 어휘는 backend-faithful, **두 개의 spec 권위**가 한 union 안에 공존합니다. |
| Y | `paste.mode: 'auto'\|'child'\|'overwrite'` 같은 zod-crud 내부 enum 이 그대로 UiEvent 에 노출 — 다른 backend 에선 의미 없을 표면. |

- **강점**: 어댑터 코드가 사실상 0줄 (resource 파일 14줄). 우연이 아니라 의도적 동형사상.
- **약점**: ARIA 가 정의한 적 없는 9 verb(undo/redo/cut/paste 등)가 ARIA-faithful 패키지의 핵심 union 에 들어왔다 — invariant *Vocabulary closed (ARIA)* 에 부분 위반.
- **권고**: 9 verb 를 별도 `EditEvent` union 으로 분리하고 `UiEvent = NavigateEvent | EditEvent` 로 두 권위를 표면적으로 갈라 표시.

## 3. store 의의 — useResource / useFeature 정당성

| 페르소나 | 한 줄 |
|---|---|
| U | outliner/kanban 는 `useResource` 단독으로 충분, `useFeature` 는 finder 1곳만 — 처음 보면 둘 중 뭘 써야 할지 모릅니다. |
| R | `useFeature` consumer 가 `apps/finder/FinderBody.tsx` 1곳뿐. defineFeature 의 `query/view` 슬롯은 outliner/kanban 에선 `useMemo` 로 inline — 두 SSOT 가 사실상 분기. |
| Y | `useFeature` 는 N=1, `useResource` 는 N=4(treeResource·viewResource·pinnedRoot·pathResource + outline/board) — `useFeature` 는 premature, `useResource` 는 정당. |

- **강점**: `useResource(resource, ...args) → [value, dispatch]` 단일 인터페이스가 4 종 resource 에 일관 적용.
- **약점**: `useFeature` 가 1 사용자뿐 + outliner/kanban 가 그것을 *안* 쓰는 게 더 자연스러웠다는 사실 자체가 abstraction-need 부재 신호.
- **권고**: `useFeature` 를 keep 하려면 두 번째 consumer 부터 — 그때까지는 finder 안에 inline 해도 무방.

## 4. 추상화 적정성 — listbox `editable` 흡수, `useEditableMeta` 폐기

| 페르소나 | 한 줄 |
|---|---|
| U | `editable: boolean` 한 줄로 Enter/Backspace 가 켜진다 — 학습 곡선 거의 0. |
| R | listbox 의 `editable` 은 Enter/Backspace 2 키, tree 의 `editable` 은 Enter/Backspace/Tab/Shift+Tab 4 키 — **같은 옵션명이 다른 키셋을 의미**, 동의어 드리프트 위험 (PATTERNS.md 정합 ✅이지만 사용자 가드 필요). |
| Y | tree 의 `editKeyDown` 분기 안에 `findParent` O(N) 가 키 입력마다 실행 — premature optimization 부재는 OK이나 회귀 테스트 없음. |

- **강점**: `useEditableMeta` 같은 별도 hook 안 만든 결정 — pattern 이 자기 어휘(activate/edit) 한 곳에 응집.
- **약점**: 옵션명 통일은 했으나 *부분 키셋* 이라는 사실이 옵션 시그니처에 안 보이고 docstring 한 줄에 묻힘.
- **권고**: `editable: true | { keys: ('insert'|'remove'|'indent'|'outdent')[] }` 로 부분집합 명시화, 또는 INVARIANTS 에 "editable 키셋은 패턴별 부분집합" 항목 추가.

## 5. 중간 영역 빈자리 — outliner/kanban 동일 14줄 boilerplate

| 페르소나 | 한 줄 |
|---|---|
| U | `useState<Meta>` + `useEffect(crud.subscribe(...))` + `setMeta((prev)=>reduce({...data,meta:prev},e).meta ?? prev)` 를 두 위젯에 그대로 복붙 — 세번째 앱 만들 때 분명히 또 복붙합니다. |
| R | 03_imperativeAudit 에서 P0-2 로 이미 식별 — `useResource` 가 meta 머지를 흡수해야 한다는 결정이 있는데 미실행. 알려진 부채. |
| Y | N=2 라 추상화 트리거 직전. 한 곳만 더 같은 코드 쓰면 즉시 흡수해도 정당. |

- **강점**: 부채가 *문서화* 되어 있어 silent drift 는 아니다.
- **약점**: PRD 와 audit 에서 동일 결정이 두 번 내려졌는데 코드에 미반영 — 메모리 ↔ 코드 lag.
- **권고**: `defineResource({meta: {syncFromCrud}})` 슬롯 추가 또는 `useResource` 가 `data.meta.focus` 를 자동 머지 — 형태는 03_imperativeAudit Open Question #2 에서 결정.

## 6. 확장성 — 세번째 example 추가

| 페르소나 | 한 줄 |
|---|---|
| U | spreadsheet(셀 단위 편집) 를 추가하면 `useGridPattern + editable` 이 필요한데, listbox/tree 의 `editable` 패턴이 grid 에는 cell-level 이라 시그니처가 또 갈라집니다. |
| R | UiEvent 의 `insertAfter/appendChild` 는 list/tree 위계 가정 — form-builder 의 "drop into slot" 같은 비-위계 편집은 mode enum 추가 압력으로 `paste.mode` 가 metastasize 합니다. |
| Y | 세번째 example 까지는 패턴 흡수 가능, 네번째에서 `paste.mode` 가 5+ 가 되면 그때 generic resolver 로 재설계. |

- **강점**: editable 어휘가 zod-crud op 와 1:1 이라 새 컬렉션 패턴(grid/treegrid)도 같은 라우터 재사용 가능.
- **약점**: 비-위계/비-JSON-tree backend(테이블 row, 그래프 노드)에서 `appendChild/insertAfter` 어휘가 어색해짐.
- **권고**: 세번째 example 추가 *전* 에 grid editable spec 한 페이지 — UiEvent 확장 vs 새 union 분리 결정.

## 7. 문서/메모리 일치

| 페르소나 | 한 줄 |
|---|---|
| U | `PATTERNS.md` 에 listbox `editable` 옵션이 명시 안 되어 있고 `tree.editable` 도 옵션 표에 없음 — 문서 lag. |
| R | MEMORY *Edit/Clipboard/History events first-class* 와 코드(`UiEvent` 9 verb) 일치 ✅. 단 *Single data interface — useResource* 와 `useFeature` 공존이 메모리에서 *Two interfaces* 로 명문화되어야 함. |
| Y | `apps/site/public/llms-full.txt` 에 `useFeature/defineFeature` 가 정식 노출되는데 실 사용처 1곳 — 문서가 코드보다 큼. |

- **강점**: INVARIANTS B16 (activate 단발 emit) 와 패턴 코드의 `relay` 흐름 정확히 일치.
- **약점**: PATTERNS.md 옵션 표가 `editable` 없는 옛 시그니처 그대로.
- **권고**: PATTERNS.md P1 표에 `editable?: boolean` 행 추가 + MEMORY 에 "useFeature 는 화면-state 전용, useResource 는 데이터 전용" 분리 노트.

## 8. 테스트 / 검증 안전망

| 페르소나 | 한 줄 |
|---|---|
| U | `routeUiEventToCrud.test.ts` 1개 + 패턴 테스트 12개 — 9 verb 라우팅 검증은 1 파일에서 끝, 회귀 안심도 보통입니다. |
| R | `apps/outliner`/`apps/kanban` test 0건, listbox/tree `editable` 키 매핑 단위 테스트 부재 — refactor 시 silent regression 표면이 큼. |
| Y | E2E/스크린 테스트 없이 패턴 hook 단위 테스트만 — example app 의 키보드 시나리오는 `/screen-test` 후보. |

- **강점**: `routeUiEventToCrud` 9 verb 가 테스트로 박제 → 어휘 1:1 invariant 유지 보장.
- **약점**: `editable` 키셋 (Enter/Backspace/Tab/Shift+Tab) 에 대한 axis 단위 테스트 없음, app 단위 회귀 0.
- **권고**: `tree.editable` / `listbox.editable` 키→UiEvent 매핑 표 1개 + outliner Tab indent → focus 이동 1 시나리오 screen-test.

---

## 종합 5줄 요약

1. **Top strength**: `routeUiEventToCrud` + `CrudPort` 가 어휘 1:1 을 코드로 박제 — outliner/kanban resource 가 14줄로 끝남.
2. **Top weakness**: outliner/kanban 동일 14줄 meta-sync boilerplate — 03_imperativeAudit 에서 식별됐으나 미흡수, 세번째 앱이면 또 복붙.
3. **Biggest blind spot**: UiEvent 9 verb 가 ARIA-faithful 패키지 안의 zod-crud-faithful 어휘 — 두 spec 권위가 한 union 에 공존하는 invariant 흠집.
4. **Must-act**: `useResource` 의 meta 흡수(`syncFromCrud` 슬롯 또는 `data.meta` 자동 머지) — 1 PR, 두 위젯 합산 −30 LOC.
5. **Overall grade**: **B+** — 정체성·어휘·패턴 응집 모두 강하나, 알려진 부채 1건 미흡수 + `useFeature` premature(N=1) + 회귀 테스트 빈 곳이 A 를 깎음.
