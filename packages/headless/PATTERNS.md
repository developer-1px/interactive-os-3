# `@p/headless/patterns` — APG recipe layer

W3C APG `https://www.w3.org/WAI/ARIA/apg/patterns/` 의 각 패턴을 **axis 묶음 + props getter + items view** 의 단일 함수로 박제. 컴포넌트·markup 어휘 0건. 정체성: `project_headless_identity` (Behavior infra, not component wrapper).

## 통일 시그니처

```ts
type Recipe<P extends string> = (
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts?: object,
) => {
  rootProps: HTMLAttributes        // role · aria-* · ref · onKeyDown
  items: Item[]                    // 미리 계산된 view (id, label, selected, disabled, posinset, setsize, level?)
  // pattern-specific prop getters:
  [K in P]: (id: string, ...) => HTMLAttributes
}
```

규칙:
- **입력 = `(data, onEvent, opts?)`** — 메모리 *Single data interface — useResource* 정합
- **출력 = `{ rootProps, <part>Props(id), items }`** — 외부 VOC 횡단 요구 *prop getters* 흡수
- **`items` 는 미리 계산된 뷰** — 소비자가 `data.entities[id]?.data` 손파싱 ❌
- **컴포넌트 0건, JSX 0건** — props 만 반환, markup 결정은 소비자
- **stable data attrs**: `data-selected`, `data-highlighted`, `data-open`, `data-orientation`, `data-focus-visible` 자동 부여 (VOC 횡단 요구 흡수)

## 패턴 명세 (P1 → P3 우선순위)

### P1 — 즉시 채울 패턴 (우리 composite 마이그레이션 가능)

| Recipe | W3C APG | 시그니처 | 옵션 | axis 묶음 | items 필드 | 우리 composite |
|---|---|---|---|---|---|---|
| `listbox` | [`/listbox/`](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) | `(data, onEvent, opts?) → { rootProps, optionProps, items }` | `selectionFollowsFocus?: boolean` (default `true`), `multiSelectable?: boolean`, `autoFocus?: boolean` | `navigate('vertical') + activate + typeahead` (+ `selectionFollowsFocus` gesture) | `id, label, selected, disabled, posinset, setsize` | `Listbox` |
| `tabs` | [`/tabs/`](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) | `(data, onEvent, opts?) → { rootProps, tabProps, panelProps, items }` | `orientation?: 'h'\|'v'`, `activationMode?: 'auto'\|'manual'` (default `'auto'`), `autoFocus?: boolean` | `navigate(orientation) + activate` (+ `selectionFollowsFocus` if `auto`) | `id, label, selected, disabled, posinset, setsize` | `Tabs` |
| `tree` | [`/treeview/`](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) | `(data, onEvent, opts?) → { rootProps, itemProps, items }` | `selectionMode?: 'none'\|'single'\|'multiple'`, `autoFocus?: boolean` | `treeNavigate + treeExpand + activate + typeahead` | `id, label, selected, disabled, expanded, level, posinset, setsize, hasChildren` | `Tree` |
| `radioGroup` | [`/radio/`](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) | `(data, onEvent, opts?) → { rootProps, radioProps, items }` | `orientation?: 'h'\|'v'` (시각만, 키보드는 양축), `autoFocus?: boolean` | `navigate('vertical') + navigate('horizontal') + activate` + `selectionFollowsFocus`(강제) | `id, label, selected, disabled, posinset, setsize` | `RadioGroup` |
| `toolbar` | [`/toolbar/`](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) | `(data, onEvent, opts?) → { rootProps, itemProps, items }` | `orientation?: 'h'\|'v'`, `autoFocus?: boolean` | `navigate(orientation)` | `id, label, disabled, separator?` | `Toolbar` |

### P2 — 패턴 확장 (재료 일부 부족, 신규 axis/모드 동반)

| Recipe | W3C APG | 시그니처 | 옵션 | axis 묶음 | 신규 필요 |
|---|---|---|---|---|---|
| `menu` | [`/menu/`](https://www.w3.org/WAI/ARIA/apg/patterns/menu/) | `(data, onEvent, opts?) → { rootProps, itemProps, items }` | `closeOnSelect?: boolean` (default `true`) | `navigate('vertical') + activate + typeahead` | submenu open state if nested |
| `menubar` | [`/menubar/`](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) | `(data, onEvent, opts?) → { rootProps, menuProps, itemProps, items }` | `orientation?: 'h'\|'v'` (default `'h'`) | `navigate('horizontal')` 상위 + `navigate('vertical') + activate` 하위 | submenu cross-axis |
| `combobox` | [`/combobox/`](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) | `(data, onEvent, opts?) → { inputProps, popoverProps, listProps, optionProps, items }` | `autocomplete?: 'none'\|'list'\|'both'`, `activeDescendant?: boolean` (default `true` per APG) | input은 `role="combobox"` + `aria-activedescendant`; popup은 `navigate('vertical')` | **`useActiveDescendant` hook 신규** (INVARIANT B11 "Combobox 1곳 예외" 코드화) |
| `treeGrid` | [`/treegrid/`](https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/) | `(data, onEvent, opts?) → { rootProps, rowProps, cellProps, items }` | `selectionMode?` | grid axis (`useSpatialNavigation` 합성 또는 row+cell 2축) + `treeExpand` | grid 2-axis composition pattern |
| `disclosure` | [`/disclosure/`](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) | `(opts) → { triggerProps, panelProps }` (data 단일 boolean) | `defaultOpen?`, `open?`, `onOpenChange?` | `activate` | uncontrolled state via `useControlState` |
| `accordion` | [`/accordion/`](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) | `(data, onEvent, opts?) → { rootProps, headerProps, triggerProps, panelProps, items }` | `type?: 'single'\|'multiple'`, `collapsible?: boolean` | `expand + activate + navigate('vertical')` | 다중 expand 데이터 모델 |
| `slider` | [`/slider/`](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) · [`/slider-multithumb/`](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/) | `(data, onEvent, opts?) → { rootProps, trackProps, rangeProps, thumbProps }` | `min`, `max`, `step`, `orientation?` | `navigate(orientation) + numeric step axis` | **`numericStep` axis 신규** + pointer capture |
| `splitter` | [`Window Splitter`](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/) | `(data, onEvent, opts?) → { rootProps, paneProps, handleProps }` | `orientation?`, `min`, `max` | `navigate(orientation) + numeric step axis` | slider와 axis 공유 |
| `switch` | [WAI-ARIA `switch` role](https://www.w3.org/TR/wai-aria-1.2/#switch) | `(opts) → { switchProps }` (단일 boolean) | `defaultChecked?`, `checked?`, `onCheckedChange?` | `activate` | role=switch + aria-checked |

### P3 — 보조 패턴

| Recipe | W3C 출처 | 비고 |
|---|---|---|
| `navigationList` | [HTML `<nav>` landmark](https://html.spec.whatwg.org/multipage/sections.html#the-nav-element) + `aria-current="page"` | sidebar≠listbox 의미 분리. 키보드는 native Tab/Enter 디폴트, 옵션으로 spatial roving |
| `link` | [HTML `<a>`](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element) | recipe 불필요? — native `<a>` 면 충분. 정렬 검토 후 결정 |
| `dialog` | [`/dialog-modal/`](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | focus trap + Escape + return focus. 우리 INVARIANT 14 (focus ⊃ global) 와 결합 |
| `tooltip` | [`/tooltip/`](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) | hover/focus delay state |
| `alert` / `alertdialog` | [`/alertdialog/`](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/) | dialog 변종 |

### 비-recipe (이미 primitive 로 충분)

| 영역 | 이유 |
|---|---|
| **Zoom/Pan** | `useZoomPanGesture` 가 이미 정체성 부합 primitive. compound `ZoomPan.Root` 는 컴포넌트 래퍼라 거부. 사용 가이드만 docs 추가 |
| **Feature / Layout DSL** | `defineFeature` / `definePage` 이미 정체성 부합 |
| **Escape hatch (custom)** | `composeAxes` + `useRovingTabIndex` 직접 — 의도적으로 보존 |

## 신규 axis/hook 갭 (recipe와 별개로 core에 추가 필요)

| 신규 | 용도 | 우선순위 |
|---|---|---|
| `useActiveDescendant(ref, activeId)` | Combobox 의 `aria-activedescendant` 모드 (INVARIANT B11 코드화) | P2 |
| `multiSelect` axis | `aria-multiselectable` 패턴, Shift+Arrow 범위, Ctrl+Click 토글 | P2 |
| `numericStep` axis | Slider/Splitter Arrow → value step. `aria-valuenow/min/max` 동기 | P2 |
| `selectionFollowsFocus` symmetric 옵션 | Listbox/Tabs/RadioGroup 셋이 같은 옵션을 같은 이름·같은 디폴트로 받도록 통일 (현재 비대칭) | P1 |

## 횡단 DX (모든 recipe가 자동 부여)

| 항목 | 출처 | 적용 |
|---|---|---|
| **Controlled / Uncontrolled** | VOC 횡단 | recipe 옵션 `value`/`defaultValue` 또는 `<state>`/`default<State>` 둘 다 지원. 내부 `useControlState` 흡수 |
| **`asChild` / 호스트 요소 교체** | VOC 횡단 (router Link 등) | recipe 는 markup 안 그리므로 자연 흡수 — 소비자가 `<a>` 든 `<Link>` 든 자유 |
| **Stable data attrs** | VOC 횡단 | `<part>Props(id)` 가 `data-selected`/`data-highlighted`/`data-disabled`/`data-orientation` 자동 부여 |
| **Stable IDs (SSR-safe)** | VOC 횡단 | `useId` 기반, `id` prop으로 override 허용 |
| **`onEvent` escape hatch** | VOC 횡단 | recipe도 결국 `onEvent` 단일 채널 (INVARIANT B16) |
| **Hook + Compound 이중화** | VOC 횡단 | recipe 는 함수형 hook 스타일만 제공. compound 컴포넌트는 **거부** (정체성 위반) — 소비자 ds 가 wrap |

## VOC ↔ recipe 매핑

| VOC | recipe | 우선순위 |
|---|---|---|
| #1 Toolbar | `toolbar` (또는 native + `useSpatialNavigation`) | P1 ✅ 이미 1차 가능 |
| #2 Listbox 정적 | `listbox` | P1 |
| #3 Listbox styled | `listbox` (DS가 wrap) | P1 |
| #4 Tabs | `tabs` (`activationMode`) | P1 |
| #5 Menu Button | `menu` + `disclosure` + `dialog` 합성 | P2 |
| #6 Menubar | `menubar` | P2 |
| #7 Sidebar Navigation | `navigationList` + docs/lint | P3 |
| #8 Combobox | `combobox` + `useActiveDescendant` | P2 (axis 갭 동반) |
| #9 Tree | `tree` | P1 |
| #10 TreeGrid | `treeGrid` | P2 |
| #11 ZoomPan | non-recipe (primitive 유지) | docs 만 |
| #12 Splitter | `splitter` + `numericStep` axis | P2 |
| #13 Slider | `slider` + `numericStep` axis | P2 |
| #14 Disclosure / Accordion | `disclosure` / `accordion` | P2 |
| #15 Switch / RadioGroup | `switch` / `radioGroup` | P1 (radio) / P2 (switch) |
| #16-19 만족 | — | — |
| #20 DS authoring 가이드 | docs (이 문서가 시작점) | docs |

## 구현 순서

1. **L0 코어 갭 보강** — `useActiveDescendant`, `multiSelect`, `numericStep`, `selectionFollowsFocus` symmetric. recipe 없이도 정체성 부합
2. **P1 5개 recipe** — `listbox` `tabs` `tree` `radioGroup` `toolbar`. 우리 composite 5개 마이그레이션으로 dogfood
3. **P2 9개 recipe** — `menu` `menubar` `combobox` `treeGrid` `disclosure` `accordion` `slider` `splitter` `switch`
4. **P3 5개 recipe** — `navigationList` `dialog` `tooltip` `alert` `alertdialog`
5. **외부 답변** — 거절 케이스(컴파운드 컴포넌트 요구) 정중 거절 + 로드맵 공지

## 정체성 invariant (각 recipe 가 자동 통과해야)

- ✅ 컴포넌트 0건 (recipe = 함수, JSX 0)
- ✅ markup 어휘 0건 (props만 반환, `<ul>`/`<li>` 결정은 소비자)
- ✅ 토큰/CSS 0건
- ✅ INVARIANTS A1~A7 (W3C APG roving tabindex 메커니즘) 보증
- ✅ INVARIANTS B16 (activate 단발 emit) — recipe 는 결국 `onEvent` 한 채널
- ✅ INVARIANTS C17 (출처 없으면 구현 없다) — recipe 의 모든 동작은 axis/gesture 파생, 새 어휘 0
- ✅ 메모리 *Minimize choices for LLM* — `1 role = 1 recipe`
- ✅ 메모리 *Vocabulary closed* — recipe 이름은 W3C APG `/patterns/` URL 자구 그대로
