---
last_commit: ff43e92b46a7260673241befb74b03bc0783bed1
last_updated: 2026-04-30
scope: packages/headless/src
total_idents: 130
---

# @p/headless 어휘 사전

## Verbs

| fragment | count | role | identifiers |
|----------|-------|------|-------------|
| use | 11 | React hook | useRoving · useRovingDOM · useResource · useFlow · useFeature · useControlState · useEventBridge · useFocusBridge · useDebugTree · useShortcut · useZoomPanGesture |
| define | 7 | spec wrapper (identity passthrough + dev validation) | defineResource · definePage · defineWidget · defineLayout · defineFlow · defineFeature · defineMiddleware |
| get | 5 | NormalizedData lookup (entity tree property accessor) | getFocus · getExpanded · getTypeahead · getChildren · getLabel |
| from | 3 | input → typed value constructor | fromTree · fromList · fromKeyboardEvent |
| is | 3 | boolean predicate | isMetaId · isDisabled · isPrintable |
| read | 2 | resource direct read (구독 없음) | readResource · readQuery |
| write | 1 | resource direct write | writeResource |
| print | 2 | debug console string output | printTree · printHeadingOutline |
| validate | 2 | dev-time tree validation (warn) | validateFragment · validatePage |
| compose | 2 | pipeline composition | composeAxes · composeGestures |
| apply | 1 | diff-based effect runner | applyEffectsDiff |
| resolve | 1 | name → component lookup (consumer) | resolveQueries |
| invalidate | 1 | query cache eviction | invalidateQuery |
| subscribe | 1 | external store push channel | subscribeQueries |
| bind | 1 | axis → handlers bridge | bindAxis |
| merge | 1 | layout fragment 합성 | merge |
| reduce | 1 | pure reducer | reduce |

## Nouns / Types

| fragment | count | role | identifiers |
|----------|-------|------|-------------|
| Node | 14 | layout node taxonomy | RowNode · ColumnNode · GridNode · SplitNode · MainNode · NavNode · AsideNode · SectionNode · HeaderNode · FooterNode · UiNode · TextNode · AnyNode · NodeType |
| Resource (family) | 8 | data layer | Resource · ResourceEvent · ResourceDispatch · ResourceCtx · ResourceEventRouter · defineResource · useResource · readResource · writeResource |
| Feature (family) | 5 | redux-style state machine | Feature(Spec) · CommandBase · ReducerMap · QueryResults · QuerySpec · QueryResult |
| Layout (builders) | 4 | fragment builder + composition | definePage · defineLayout · defineWidget · merge |
| Event (family) | 3 | ⚠ Event(헤드리스) · ResourceEvent · ResourceEventRouter | — `Event`는 DOM Event와 동명이의 |
| Trigger | 3 | axis primitive 입력 형태 | Trigger · keyTrigger · clickTrigger |

## Postfixes

| postfix | count | rule | examples |
|---------|-------|------|----------|
| Node | 14 | layout node 하위 type — `type === '<X>'` discriminant 가짐 | RowNode (type:'Row'), ... |
| Ctx | 3 | middleware phase context | PreDispatchCtx · PostDispatchCtx · ResourceCtx |
| Props | 2 | hook/component data 인터페이스 | ControlProps · CollectionProps |
| Options | 2 | all-optional 설정 (none required) | UseRovingDOMOptions · ZoomPanOptions |
| Spec | 2 | declarative configuration | FeatureSpec · QuerySpec |
| Builder | 2 | `(props: P) => NormalizedData` | LayoutBuilder · WidgetBuilder |
| Trigger | 2 | (값) `Trigger` 인스턴스 생성 | keyTrigger · clickTrigger |
| Result(s) | 2 | query 반환 형태 | QueryResult · QueryResults |
| Event | 2 | event union variants | Event(headless) · ResourceEvent |

## Synonym Map

| canonical | known synonyms | notes |
|-----------|---------------|-------|
| define | — | 단일 factory verb (create/build/make 0건) ✓ |
| from | — | 입력 → 타입 변환자 (`fromList(items, opts)` 등) |
| read | get (다른 layer) | read=resource layer · get=entity tree layer — 경계 분명 |
| compose | — | pipeline 합성 단일 verb |

## Role Map

| fragment | role | verb | examples |
|----------|------|------|----------|
| use | React hook | use | (모두 hook) |
| define | spec wrapper | define | (모두 identity + dev validate) |
| get | NormalizedData lookup | get | (모두 *lookup* 단일 역할) |
| from | constructor | from | (모두 input → typed value) |

## Aptness — flagged 사례

| 이름 | 분류 | 의도 | 수렴 권장 |
|------|------|------|----------|
| `Event` (type) | 🚨 너무 일반적 + DOM 충돌 | ui ↔ headless 통신 union | **`UiEvent`** (data.ts에서 alias로 이미 우회 중) |
| `Flow` (layout type) | 🚨 동명이의 | CSS flex flow 모드 (`'list'\|'cluster'\|...`) | **`LayoutFlow`** (flow.ts의 Flow 패밀리와 분리) |
| `useRoving` | ⚠ 표준 어휘 단축 | APG roving tabindex hook | `useRovingTabIndex` (표준 정렬) 또는 그대로 유지 |
| `Feature` | ⚠ 추상도 높음 | "한 화면 = 한 spec" | 메이저 lib(createSlice 등) 동일 추상 — 유지 |

## 참고

- **standard terminology wins**: ARIA roles · DOM API · React API names은 절대 flag하지 않음
- **`useRoving`/`useRovingDOM` 짝**: 단축이라도 둘이 짝지어 의미 보강 — `Roving` 어휘 일관 유지가 rename보다 우선
- 다음 audit 시작점은 위 fragment table 비교: 새 verb/noun 추가, 기존 동의어 introduction 여부, postfix 신규 사용처
