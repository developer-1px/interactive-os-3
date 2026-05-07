---
type: reference
mode: defacto
query: "헤드리스/에디터/그리드/CRDT 라이브러리들이 컬렉션 쓰기(copy/cut/paste/undo/redo/delete + 시스템 클립보드 round-trip + edit mode + adapter 슬롯)를 어떻게 다루는가"
internalGap: "@p/aria-kernel가 ARIA(읽기) + W3C Clipboard API(쓰기) + zod-crud(첫 어댑터) 조합으로 가려는데, 11개 레퍼런스 중 누가 어디까지 커버하는지 매트릭스가 없었음"
tags: [headless, write-adapter, clipboard, crud, edit-mode, prior-art]
---

# Write Adapter Prior Art — 헤드리스 컬렉션의 쓰기 정본 조사

## TL;DR

조사한 11개 라이브러리(헤드리스 컴포넌트 5 + 에디터 3 + 데이터 그리드 4 + CRDT 5)에서 **컬렉션 쓰기를 1급 시민으로 다루는 헤드리스 라이브러리는 존재하지 않는다.** 가장 가까운 React Aria조차 `useListData`/`useTreeData`에 `insert/remove/move/update`만 정의하고 `copy/cut/paste/undo/redo`는 punt. `@p/aria-kernel`가 이 어휘를 1급으로 올리고 zod-crud 같은 어댑터로 백엔드를 분리하려는 시도는 **선행 자산이 없는 새 영역**이다 — 단, 패턴 재료는 PM/Lexical(triple-MIME 클립보드), AG Grid(edit-mode 키 라우팅), Automerge-repo(snapshot/subscribe/mutate 3단 어댑터)에서 이미 정합한 형태로 발견된다.

## Why — 왜 이 질문이 지금 중요한가

`@p/aria-kernel`가 Outliner/Kanban 같은 진짜 앱을 쓰면서 발견한 비대칭:

- 읽기(navigation/focus/select) — APG spec이 정본, pattern hook의 rootProps가 자체 처리
- 쓰기(copy/cut/paste/remove/undo/redo) — 두 보일러플레이트 hook(`useHistoryShortcuts`, `useClipboardShortcuts`)이 매 widget에 수동 호출

이 비대칭은 우리 memory `feedback_unified_roving_all_roles`("패턴 recipe는 내부에서 composeAxes 내장. 소비자가 직접 onKeyDown 다루면 미완") 위반. 흡수해야 하는데, **헤드리스 생태계에 선례가 있나?** 가 ⑨ 외부 탐색의 정확한 갭이었음.

## How — 4축 매트릭스의 사고 구조

```mermaid
flowchart TD
  Q[헤드리스 컬렉션 쓰기 어디까지?] --> A[(1) 쓰기 어휘]
  Q --> B[(2) 시스템 클립보드 round-trip]
  Q --> C[(3) edit mode 토글]
  Q --> D[(4) backend adapter 슬롯]

  A --> A1[헤드리스 컴포넌트<br/>4/5 정의 안 함]
  A --> A2[React Aria만<br/>insert/remove/move/update]
  A --> A3[에디터 3개 모두 정의<br/>PM Transform / Lexical Command / TipTap chain]
  A --> A4[그리드 — AG Grid·Handsontable 풍부<br/>TanStack 비움]
  A --> A5[CRDT — 5개 모두 정의<br/>method-on-type / 콜백 / named op]

  B --> B1[헤드리스 컴포넌트<br/>useClipboard 1개 React Aria]
  B --> B2[에디터 — triple-MIME<br/>x-app/json + html + plain]
  B --> B3[그리드 — TSV 정본<br/>Excel/Sheets 호환]
  B --> B4[CRDT — N/A 직렬화만]

  C --> C1[헤드리스 — 그 누구도 안 다룸]
  C --> C2[그리드 — F2/Enter 진입·Esc cancel·Tab confirm<br/>4개 모두 동일]

  D --> D1[Automerge-repo 3단 모범<br/>Storage/Network/Awareness]
  D --> D2[snapshot/subscribe/mutate<br/>5개 CRDT 공통 골격]
  D --> D3[React Aria — Collection&lt;Node&gt; interface]

  style A2 fill:#dfe7fd
  style A3 fill:#dfe7fd
  style A5 fill:#dfe7fd
  style B2 fill:#dfe7fd
  style B3 fill:#dfe7fd
  style C2 fill:#dfe7fd
  style D1 fill:#dfe7fd
```

각 영역에서 **누가 발견된 답을 가졌는가**가 색칠된 노드. 우리가 차용할 수 있는 위치를 한 눈에 짚을 수 있음.

## What — 11개 라이브러리 4축 매트릭스

### 헤드리스 컴포넌트 라이브러리

| | (1) 쓰기 어휘 | (2) 클립보드 | (3) edit mode | (4) 어댑터 |
|---|---|---|---|---|
| **React Aria** | `useListData`/`useTreeData` insert/remove/move/update. **copy/cut/paste/undo/redo 없음** | `useClipboard({onCopy/Cut/Paste})` 멀티 MIME | 안 다룸 ("custom solution") | `Collection<Node<T>>` interface — `useListData`는 in-memory 구현체. 다른 backend 꽂을 수 있음 |
| **Radix UI** | 정의 안 함 (의도적) | 정의 안 함 | 정의 안 함 (그리드 없음) | 정의 안 함 |
| **Ariakit** | 정의 안 함 (UI state만) | 정의 안 함 | 정의 안 함 (그리드 없음) | `*Store` 외부 mutation 가능, 컬렉션 데이터 contract 없음 |
| **Headless UI** | 정의 안 함 | 정의 안 함 | 정의 안 함 | controlled props만 |
| **Reach UI** | 미유지보수 + 모두 정의 안 함 | | | |

**발견:** 헤드리스 React 생태계에서 `copy/cut/paste/undo/redo`를 컬렉션 1급 이벤트로 올린 라이브러리는 **0개**.

### 리치 텍스트 에디터 (Operation/Plugin 모범 답)

| | (1) 쓰기 어휘 | (2) 클립보드 | (3) edit mode | (4) 어댑터 |
|---|---|---|---|---|
| **ProseMirror** | `Transform`(delete/replace/insert/split/lift/wrap/...) → `Step` 분해 → 콜랩 rebase 가능. Command = `(state, dispatch?) => boolean` (dry-run 동시) | `clipboardSerializer/Parser` + `transformPasted*`. 자체 MIME `data-pm-slice`로 슬라이스 깊이 보존. 스키마가 검증자 역할 | `TextSelection` vs `NodeSelection` (selection class 자체가 모드) | `Plugin({props, state:{init,apply,toJSON,fromJSON}, key})` 3슬롯. Yjs는 `y-prosemirror`로 collab 슬롯 교체 |
| **Lexical** | `editor.update(()=>{...})` 안의 노드 메서드 + `createCommand<T>(name)` + `registerCommand(cmd, listener, priority)` 우선순위 체인 | **Triple-MIME**: `application/x-lexical-editor` JSON + `text/html` (importDOM 검증) + `text/plain`. cross-app paste survivable | `RangeSelection`/`NodeSelection`/`TableSelection` | React 컴포넌트로 `registerCommand`/`registerNodeTransform`. `@lexical/yjs` collab |
| **TipTap** | PM 위 fluent chain `editor.chain().toggleBold().run()`. extension `addCommands()`. `editor.can()` dry-run | PM passthrough + `addPasteRules`/`addInputRules` | PM 동일 | extension 3종(Node/Mark/Extension) + `addProseMirrorPlugins()` 탈출구 |

**발견:** 에디터 생태계는 **명령 토큰 + 우선순위 체인 + triple-MIME**가 수렴 패턴. 우리 `UiEvent` 어휘와 거의 1:1.

### 데이터 그리드

| | (1) 쓰기 어휘 | (2) 클립보드 | (3) edit mode | (4) 어댑터 |
|---|---|---|---|---|
| **TanStack Table v8** | 거의 없음. `TableMeta.updateData`로 사용자가 끼워 넣음 | 없음 | 없음 (사용자 책임) | `columnDef.meta` + `options.meta` 두 슬롯, headless 의도적 비움 |
| **AG Grid** | cell editing 1급, `applyTransaction({add,remove,update})`, range fill/paste 모듈 내장 | TSV (Excel 호환), `processCellForClipboard` 훅 | **F2/Enter = 진입, Tab = confirm+next, Esc = cancel** (Excel 관습) | `ICellEditor` interface — `init/getValue/isPopup/isCancelBeforeStart` |
| **Glide Data Grid** | `onCellEdited` 콜백 단발 emit, `onPaste` raw 2D, `onRowAppended/onDelete` | TSV opt-in | Enter = 종료+이동, Esc = cancel | **`getCellContent([col,row])` fetcher 모델** — pull 인터페이스 |
| **Handsontable** | cell edit + `alter('insert_row_above'/...)` + CopyPaste plugin + undo/redo plugin + validators | TSV + HTML table 양 형식. `beforeCopy/afterPaste` 훅 100+ | F2/Enter 진입, Tab confirm, Esc cancel | Hooks(콜백) + Plugin(클래스) 두 축. `type:'numeric'` = editor+renderer+validator 묶음 |

**발견:** 그리드 생태계는 **edit-mode 키 라우팅이 4개 모두 동일**(Excel/APG 관습 = de facto). 클립보드 정본은 **TSV**.

### CRDT/Sync 백엔드

| | (1) 쓰기 어휘 | (2) 직렬화 | (3) txn 경계 | (4) 어댑터 슬롯 |
|---|---|---|---|---|
| **Yjs** | type 메서드 (`Y.Map.set`, `Y.Array.insert`...) | `encodeStateAsUpdate` ↔ `applyUpdate` (binary) | `doc.transact(fn, origin)` | **3 provider**: editor binding + network + persistence + awareness 별 패키지 |
| **Automerge** | 콜백 mutator `handle.change(doc => {...})` | `save()` ↔ `load()` binary | `change(fn)` 콜백 자체가 경계 | **automerge-repo** = StorageAdapter / NetworkAdapter / DocHandle 3슬롯 (가장 깔끔한 분리) |
| **RxDB** | `insert/upsert/incrementalModify(fn)/bulkRemove`. CRUD/REST 어휘 | JSON `exportJSON/importJSON`, revision string | `incremental*` 자동 직렬화 | RxStorage + Replication plugin 두 슬롯 |
| **Liveblocks** | `Live*` 메서드, `room.batch(fn)`, `room.history.undo/redo/canUndo/canRedo` | 서버 of record | `batch` 그룹화 | Room이 어댑터 — `getStorage/subscribe/Live*/batch/history` |
| **Replicache** | **named mutator**: `rep.mutate.<name>(args)`. 클라+서버 동일 함수 | push/pull HTTP 프로토콜 | mutator 호출 = txn | Replicache 인스턴스 — `subscribe/mutate/query`. 백엔드는 HTTP contract |

**발견:** 5개 CRDT 모두 **snapshot / subscribe / mutate** 3행으로 수렴. Automerge-repo의 Storage/Network/Awareness 3슬롯 분리가 가장 정연한 관용 패턴.

## What-if — `@p/aria-kernel`에 적용하면

### 차용할 5가지

1. **AG Grid의 edit-mode 키 라우팅을 axis 1축으로**
   F2/Enter 진입 + Esc cancel + Tab confirm+next는 4개 그리드 라이브러리 + APG가 동일. axes에 `editMode` 라우터 한 축이면 navigate ↔ edit 모드 전환 자동.

2. **Lexical/PM의 triple-MIME 클립보드**
   ```
   application/x-p-headless+json   ← 자체 정본 (lossless, schema-validated)
   text/html                       ← cross-app (HTML table for grids, list for trees)
   text/plain                      ← 최후 fallback
   ```
   onPaste에서 우선순위대로 시도. 자체 MIME 없으면 HTML을 importDOM 규칙으로 파싱(스키마 = 검증자).

3. **Replicache/Lexical의 named command + dry-run probe**
   우리 `UiEvent` 어휘가 이미 named command. 추가로 `canExecute(cmd)` dry-run probe(메뉴 enable/disable, capability 광고)는 PM의 `dispatch?` optional 패턴 또는 zod-crud `canPaste/canRemove`와 1:1.

4. **Automerge-repo 스타일 3-layer adapter**
   ```
   pattern hook ─── WriteAdapter ─── 백엔드 (zod-crud / Yjs / memory)
   ```
   `WriteAdapter` 인터페이스 = `snapshot / subscribe / mutate(...op어휘) / undo/redo / can*` — 5개 CRDT 공통 골격에서 도출.

5. **Handsontable의 mutation provenance**
   `afterChange(changes, source)`의 `source`(paste/edit/fill/undo)를 우리 `UiEvent`에 1급 필드로. zod-crud의 `OperationResult.changes`와 결합하면 변경 경위 추적 자동.

### 차용하지 말 것

- **Range 2D selection / Excel fill handle** — Table 외 List/CardGrid 무의미, axes 오염
- **Plugin 클래스 시스템(Handsontable OOP)** — composeAxes 모델과 충돌
- **Canvas 렌더링(Glide)** — behavior infra 정체성 충돌
- **Transaction API(`applyTransaction`)** — zod-crud op와 중복
- **focusId를 WriteAdapter에 통합** — CRDT 관용은 awareness/presence 별 채널 분리. 우리도 `PresenceAdapter`로 분리 검토 (Yjs/Automerge-repo 모두 이 길)

### 우리 WriteAdapter 시그니처 정합성 판정

```ts
interface WriteAdapter<T> {
  snapshot(): T                    // ✅ 5개 CRDT 모두 가짐
  subscribe(cb): Unsubscribe       // ✅ 5개 CRDT 모두 가짐
  copy(id): unknown                // ⚠ 명시 어휘 우리 새 (zod-crud 일치)
  cut/paste/remove/undo/redo       // ⚠ 명시 어휘 우리 새 (Lexical command + zod-crud op)
  canPaste/canRemove/canUndo/canRedo  // ⚠ 새 — Liveblocks `canUndo/Redo`만 부분 선례
  focusId                          // ❌ 분리 권장 — CRDT 관용은 awareness 별 채널
}
```

→ **시그니처 본체는 Replicache(named mutator) + Liveblocks(can*) 하이브리드**. focusId는 별도 `PresenceAdapter` 또는 OperationResult 반환값으로만 노출 권장.

## 흥미로운 이야기

- **Radix가 의도적으로 punt한 이유**: 창립자 Pedro Duarte는 "behavior + a11y 까지가 Radix 책임. 데이터는 앱 영역" 입장 명시. 그래서 `DropdownMenu.Item` 안에서 clipboard도 사용자가 `navigator.clipboard.writeText` 직접 호출. 이게 **헤드리스 React의 de facto 경계** 였고, React Aria만 한 발짝 넘어 `useListData`까지 옴.

- **ProseMirror의 `data-pm-slice` MIME 트릭**: same-schema copy/paste 시 슬라이스의 open/close depth를 HTML 속성에 인코딩. cross-app paste면 이 정보 무시되고 일반 HTML로 fallback. 직렬화 정본을 표준 MIME에 piggyback하는 패턴 — 우리 `application/x-p-headless+json`도 같은 길.

- **Lexical clipboard는 Meta가 Facebook posts editor 만들면서 "cross-app survival"을 1급 요구사항으로 올린 결과**. Notion ↔ Google Docs 안전한 paste의 모범. triple-MIME은 발명이 아니라 발견 — 모든 신중한 에디터가 같은 결론에 도달.

- **Automerge-repo 2.0(2025-05)의 async `Repo.find`**: storage/network 어댑터를 선언만 하고 실제 doc은 lazy load. 우리 `defineResource`도 같은 길로 갈 수 있음(선언 → lazy snapshot).

- **Glide Data Grid의 `getCellContent` fetcher**: 데이터를 prop으로 안 받음. Pull 모델. 100만 행 그리드 정본. 우리 List/Table/CardGrid 중 Table만 한정 검토 가치.

- **AG Grid Excel TSV 클립보드는 사실 Microsoft Excel 1995년 비공개 컨벤션이 web으로 흘러나온 것**. Sheets/Numbers 모두 TSV로 수렴. "정본"이 spec이 아니라 OS 행동인 흔치 않은 사례.

## Insight

**우리 설계는 헤드리스 React에서 새 영역을 개척하는 동시에, 인접 분야(에디터 + CRDT)의 수렴 패턴을 정합하게 차용한 합성이다.**

정합성 판정 — 프로젝트 규약과의 매핑:

| memory 규약 | 외부 정합 |
|---|---|
| `feedback_edit_events_first_class` "정본=zod-crud op" | ✅ Replicache named mutator + Lexical command와 동일 패턴. **신생 어휘가 아니라 에디터/CRDT의 발견된 정본** |
| `feedback_unified_roving_all_roles` "패턴 recipe 내부 onKeyDown 자체 처리" | ✅ AG Grid edit-mode 키 라우팅이 동일 결론에 이미 도달 |
| `feedback_canonical_source_w3c_aria` "spec 우선" | ⚠ 보강 필요: ARIA가 punt한 영역(클립보드/히스토리)은 **W3C Clipboard API + OS de facto + 인접 분야 수렴 패턴**으로 채워야 함을 명시 추가 |
| `feedback_single_data_interface` "(value, dispatch) 단일 인터페이스" | ✅ 5개 CRDT의 snapshot/subscribe/mutate 골격과 정합. WriteAdapter는 이 규약의 자연 진화 |
| `project_headless_identity` "Behavior infra not component wrapper" | ✅ Radix/HeadlessUI/Reach가 한 단 위(컴포넌트 래퍼)라면 우리는 한 단 아래(behavior + adapter slot). 자리매김 일관 |

**한 줄 결론:** WriteAdapter 인터페이스는 **(snapshot/subscribe + named mutator + can* probe + adapter 3슬롯 분리)** 4개 차원의 합성이고, 각 차원에 prior art가 모두 있다. focusId만 `PresenceAdapter`로 분리하면 정합성 100%.

## 출처

- [React Aria useClipboard](https://react-aria.adobe.com/useClipboard) — 멀티 MIME 헤드리스 클립보드
- [React Aria useListData](https://react-spectrum.adobe.com/react-aria/useListData.html) / [useTreeData](https://react-spectrum.adobe.com/react-aria/useTreeData.html) — insert/remove/move/update 어휘
- [Radix Primitives Overview](https://www.radix-ui.com/primitives/docs/overview/introduction) — 의도적 punt
- [Ariakit components](https://ariakit.com/components) / Reach UI archive
- [ProseMirror Guide](https://prosemirror.net/docs/guide/) / [Reference](https://prosemirror.net/docs/ref/) — Transform/Step/Plugin
- [Lexical Commands](https://lexical.dev/docs/concepts/commands) / [Node Replacement](https://lexical.dev/docs/concepts/node-replacement) / [@lexical/clipboard source](https://github.com/facebook/lexical/blob/main/packages/lexical-clipboard/src/clipboard.ts)
- [TipTap Extensions](https://tiptap.dev/docs/editor/api/extensions) / [Commands](https://tiptap.dev/docs/editor/api/commands)
- [TanStack Table editable-data example](https://tanstack.com/table/v8/docs/framework/react/examples/editable-data)
- [AG Grid Cell Editors](https://www.ag-grid.com/javascript-data-grid/cell-editors/) / [Clipboard](https://www.ag-grid.com/javascript-data-grid/clipboard/) / [Keyboard Navigation](https://www.ag-grid.com/javascript-data-grid/keyboard-navigation/)
- [Glide Data Grid DataEditor](https://docs.grid.glideapps.com/api/dataeditor) / [Custom Cells](https://docs.grid.glideapps.com/api/dataeditor/custom-cells)
- [Handsontable Hooks](https://handsontable.com/docs/javascript-data-grid/api/hooks/) / [Clipboard](https://handsontable.com/docs/javascript-data-grid/basic-clipboard/)
- [Yjs shared types](https://docs.yjs.dev/api/shared-types/y.map) / [Document updates](https://docs.yjs.dev/api/document-updates) / [Editor bindings](https://docs.yjs.dev/ecosystem/editor-bindings)
- [Automerge DocHandle](https://automerge.org/docs/reference/repositories/dochandles/) / [automerge-repo blog](https://automerge.org/blog/automerge-repo/) / [Repo 2.0](https://automerge.org/blog/2025/05/13/automerge-repo-2/)
- [RxDB Collection](https://rxdb.info/rx-collection.html) / [Storage](https://rxdb.info/rx-storage.html) / [Replication](https://rxdb.info/replication.html)
- [Liveblocks client API](https://liveblocks.io/docs/api-reference/liveblocks-client)
- [Replicache concepts](https://doc.replicache.dev/concepts/how-it-works) / [API reference](https://doc.replicache.dev/api/classes/Replicache)
