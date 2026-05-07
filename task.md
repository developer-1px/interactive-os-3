# `@p/aria-kernel` ARIA Spec 누락 검증

MDN ARIA Roles 페이지를 카테고리 순서대로 훑어 `@p/aria-kernel/patterns` 의 spec 커버리지 갭을 박제. 결정 트리: **APG에 패턴이 있고 + 키보드/포커스 행동 인프라가 필요한 role 만 patterns 후보**. native HTML/ARIA 만으로 충분한 role 은 🚫identity-out 으로 마감.

출처: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles · https://www.w3.org/WAI/ARIA/apg/patterns/

## 결정 트리

```
role 
 ├─ APG `/patterns/` 에 등재? 
 │   ├─ NO  → native semantics 충분? 
 │   │        ├─ YES → 🚫 identity-out
 │   │        └─ NO  → 🚫 (out of scope: 행동 인프라 아님)
 │   └─ YES → recipe 존재?
 │            ├─ ✅ covered
 │            ├─ ⚠️ partial (옵션/필드 일부 누락)
 │            └─ ❌ missing
```

범례: ✅ covered · ⚠️ partial · ❌ missing · 🚫 identity-out

## 1. Document Structure Roles

| role | 분류 | 사유 / 액션 |
|---|---|---|
| toolbar | ✅ | `useToolbarPattern` |
| tooltip | ✅ | `useTooltipPattern` |
| feed | ❌ | APG `/feed/` 존재. PageUp/Down 으로 article 간 이동, focus 진입/이탈 시 article 전체 highlight. 행동 infra 필요 → **추가** |
| math | 🚫 | `<math>` native, 행동 무 |
| presentation / none | 🚫 | semantics 제거용, 행동 무 |
| note | 🚫 | pure semantic |
| application | 🚫 | escape hatch, recipe 부적합 |
| article | 🚫 | `<article>` |
| cell | 🚫 | grid 자식, treegrid 에서 흡수 |
| columnheader | 🚫 | grid 자식 |
| definition | 🚫 | pure semantic |
| directory | 🚫 | ARIA 1.2 deprecated |
| document | 🚫 | pure semantic |
| figure | 🚫 | `<figure>` |
| group | 🚫 | 컨테이너 의미만 |
| heading | 🚫 | `<h1>`–`<h6>` |
| img | 🚫 | `<img>` |
| list / listitem | 🚫 | `<ul>`/`<ol>`/`<li>` |
| meter | 🚫 | `<meter>` native |
| row / rowgroup / rowheader | 🚫 | grid/treegrid 흡수 |
| separator | ✅ | focusable variant 은 `splitterPattern` (Window Splitter), static 은 native `<hr>` |
| table | 🚫 | `<table>` |
| term | 🚫 | `<dt>` |
| associationlist / associationlistitemkey / associationlistitemvalue | 🚫 | `<dl>`/`<dt>`/`<dd>` |
| blockquote / caption / code / deletion / emphasis / insertion / paragraph / strong / subscript / superscript / time | 🚫 | 모두 pure semantic HTML |

## 2. Widget Roles

| role | 분류 | 사유 / 액션 |
|---|---|---|
| scrollbar | 🚫 | APG 패턴 없음 + native browser scrollbar 99%. custom scrollbar 는 application 책임 |
| searchbox | 🚫 | `<input type="search">` (단일 input, roving 무) |
| slider | ✅ | `sliderPattern` |
| spinbutton | ⚠️ | APG `/spinbutton/` 가 PageUp/PageDown(±10) 키 매핑을 별도 명세. native `<input type="number">` 는 Arrow + step 만, PageUp/PageDown ±10 은 미커버. v2 후속 — `useSpinbuttonPattern` (numericStep axis 재사용 + PageUp/Down 가속) |
| switch | ✅ | `switchPattern` |
| tab / tabpanel | ✅ | `useTabsPattern` (rootProps role=tablist, tabProps role=tab, panelProps role=tabpanel) |
| treeitem | ✅ | `useTreePattern` (itemProps role=treeitem) |
| button | 🚫 | `<button>` |
| checkbox | 🚫 | `<input type="checkbox">` (단일). group 은 native + role=group |
| gridcell | ✅ | `useTreeGridPattern` cellProps |
| link | 🚫 | `<a>` |
| menuitem / menuitemcheckbox / menuitemradio | ✅ | `useMenuPattern` (item.kind 로 menuitemcheckbox/radio 분기 — 검증 필요 ⚠️) |
| option | ✅ | `useListboxPattern` optionProps |
| progressbar | 🚫 | `<progress>` native |
| radio | ✅ | `useRadioGroupPattern` radioProps |
| textbox | 🚫 | `<input>` / `<textarea>` |

## 3. Composite Widget Roles

| role | 분류 | 사유 / 액션 |
|---|---|---|
| combobox | ✅ | `useComboboxPattern` |
| menu | ✅ | `useMenuPattern` |
| menubar | ✅ | `useMenubarPattern` |
| tablist | ✅ | `useTabsPattern` rootProps |
| tree | ✅ | `useTreePattern` |
| treegrid | ✅ | `useTreeGridPattern` |
| **grid** | ❌ | APG `/grid/` 존재 — treegrid 와 별개. 2D 셀 단위 nav (Arrow 4방향, Home/End 행 양 끝, Ctrl+Home/End 그리드 양 끝, PageUp/Down). focus 가 cell 에 있음(treegrid 는 row). → **추가** |
| listbox | ✅ | `useListboxPattern` |
| radiogroup | ✅ | `useRadioGroupPattern` |

## 4. Landmark Roles

| role | 분류 | 사유 |
|---|---|---|
| banner | 🚫 | `<header>` (top-level) |
| complementary | 🚫 | `<aside>` |
| contentinfo | 🚫 | `<footer>` (top-level) |
| form | 🚫 | `<form>` |
| main | 🚫 | `<main>` |
| navigation | 🚫 | `<nav>` (이 안의 list 행동은 `navigationListPattern` 으로 별도 흡수) |
| region | 🚫 | `<section aria-label>` |
| search | 🚫 | `<search>` (HTML) 또는 `role="search"` wrapper |

## 5. Live Region Roles

| role | 분류 | 사유 |
|---|---|---|
| alert | ✅ | `alertPattern` |
| log | 🚫 | APG 패턴 없음, `aria-live="polite"` 만으로 충분 |
| marquee | 🚫 | 사실상 deprecated, 행동 infra 무 |
| status | 🚫 | `<output>` 또는 `aria-live="polite"` |
| timer | 🚫 | aria-live + role=timer 만, 행동 무 |

## 6. Window Roles

| role | 분류 | 사유 / 액션 |
|---|---|---|
| alertdialog | ✅ | `alertdialogPattern` |
| dialog | ✅ | `useDialogPattern` |

## 7. Abstract Roles

| role | 분류 | 사유 |
|---|---|---|
| command / composite / input / landmark / range / roletype / section / sectionhead / select / structure / widget / window | 🚫 | ARIA 명시: 직접 사용 금지 (abstract) |

## 8. APG 추가 패턴 (MDN role 페이지 외 부속)

MDN role 카테고리에는 없지만 APG `/patterns/` 에 별도 등재된 항목:

| APG | 분류 | 사유 / 액션 |
|---|---|---|
| Accordion | ✅ | `useAccordionPattern` |
| Carousel | ❌ | APG `/carousel/` 존재. Tab → controls, Enter activate, autoplay pause, 좌우 화살표 슬라이드. → **추가** |
| Disclosure | ✅ | `disclosurePattern` |
| Breadcrumb | 🚫 | `<nav aria-label="Breadcrumb"><ol>` markup 만 — 행동 infra 무 |
| Landmarks | 🚫 | landmark 항목 참조 |
| Link | 🚫 | `<a>` |
| Menu Button | ✅ | `useMenuPattern` + `disclosurePattern` 합성 — 추가 recipe 불필요 |
| Window Splitter | ✅ | `splitterPattern` |

## 갭 요약 — 처리 순서

1. **B2 — `feedPattern`** — APG `/feed/`. PageUp/Down article 간 이동, article 단위 focus + aria-busy 흡수. 의존: 없음 (axis 신규 없음, navigate 'vertical' 의 PageUp/Down 변형으로 해결)
2. **B3 — `useGridPattern`** — APG `/grid/`. 2D 셀 단위 nav. cellId 가 focus 단위 (treegrid 의 row focus 와 다름). 의존: navigate 양축 동시 + 행/열 좌표 모델. axis 보강 가능성 ⚠️
3. **B4 — `carouselPattern`** — APG `/carousel/`. controls(prev/next/pagination) + slide region. autoplay pause. 의존: 없음 (작은 declarative recipe)
4. **B5 — partial 검증/보강**
   - ⚠️ `useMenuPattern` 의 `menuitemcheckbox`/`menuitemradio` 처리 검증 (item.kind 분기)
   - ⚠️ `useTabsPattern` 의 `activationMode: 'auto' | 'manual'` 동작 검증
   - ⚠️ `useTreePattern` 의 `selectionMode: 'none' | 'single' | 'multiple'` 검증
   - ⚠️ `useListboxPattern` 의 multiSelect Shift+Arrow range select 동작 검증

## 진행 체크박스

### B2 — useFeedPattern ✅
- [x] APG `/feed/` 키보드 매핑 추출 (PageUp/PageDown, Ctrl+Home/End)
- [x] `feed.ts` 작성: `(data, opts?) → { rootProps, articleProps, items }`
- [x] rootProps: `role="feed"` + `aria-busy` + onKeyDown(PageUp/PageDown 가로채기)
- [x] articleProps: `role="article"` + tabIndex=-1 + `aria-labelledby` + `aria-posinset/setsize`
- [x] `index.ts` export 추가
- [x] `tsc --noEmit` 0 에러
- [ ] PATTERNS.md 갱신 (P3 → covered)
- [ ] Ctrl+Home/End (feed 바깥 first/last focusable) — host 책임으로 두고 docs 만 (TODO)
- [ ] 평가자 호출 (B5 끝나고 일괄)

### B3 — useGridPattern ✅
- [x] APG `/grid/` 키보드 매핑 (Arrow 4축, Home/End, Ctrl+Home/End)
- [x] cell 단위 focus 모델 채택 (treegrid 와 차이 명시)
- [x] `gridNavigate` axis 신규 — 2D 좌표 (row,col) 처리. wrap 없음 (grid 정책)
- [x] `grid.ts` 작성 — rootProps · rowProps · columnHeaderProps · rowHeaderProps · cellProps · rows view
- [x] `index.ts` export
- [x] tsc 0
- [ ] PATTERNS.md 갱신
- [ ] PageUp/PageDown (스크롤 단위 행 점프) — 가시 행 수 host 의존이라 v1 보류
- [ ] Selection 키 (Ctrl+Space, Shift+Space, Ctrl+A) — multiSelect axis 합성으로 v2
- [ ] Cell editing (F2/Enter/Escape) — declarative recipe 범위 밖 (소비자가 cell 안에서 처리)
- [ ] 평가자 호출 (B5 끝나고 일괄)

### B4 — useCarouselPattern ✅
- [x] APG `/carousel/` 행동 추출 (auto-rotation, focus/hover pause, explicit toggle)
- [x] `carousel.ts` 작성: `(opts) → { index, playing, prev/next/goTo, rootProps, slideProps(i), prevButtonProps, nextButtonProps, rotationButtonProps, liveRegionProps }`
- [x] role="region" + aria-roledescription="carousel"
- [x] slide: role="group" + aria-roledescription="slide" + "Slide N of M: label"
- [x] autoplay state — focus/hover/explicit pause 셋 모두 흡수, focus 시 explicit pause 도 set (APG 규칙 1)
- [x] live region: playing→aria-live=off / paused→polite
- [x] index.ts export
- [x] tsc 0
- [ ] PATTERNS.md 갱신
- [ ] Tabbed Carousel 변형 (slide picker = tabs) — 소비자가 `useTabsPattern` 합성, recipe 분기 불필요
- [ ] 평가자 호출 (B5 끝나고 일괄)

### B5 — partial 검증 ✅
- [x] menu: ⚠️ → ✅ — `data.entities[id].data.kind` 분기 (`menuitem`/`menuitemcheckbox`/`menuitemradio`) + `aria-checked` 추가
- [x] tabs: ✅ — `activationMode === 'automatic'` 일 때만 selectionFollowsFocus, manual 은 raw event pass-through. APG 정합
- [x] tree: ⚠️ → docs 갱신 — 코드는 `multiSelectable: boolean` + `selectionFollowsFocus`. APG 'none' 모드는 `selectionFollowsFocus=false` + reducer 가 activate 무시하면 표현 가능. PATTERNS.md 의 `selectionMode` tri-state 약속을 코드 형태로 후속 정합 (별도 task)
- [x] listbox: ✅ — `composeAxes(multiSelect, navigate, activate, typeahead)`. multiSelect 가 Shift+Arrow Up/Down + Ctrl+A + Shift+Click 범위 모두 흡수. APG 정합
- [x] tsc 0
- [ ] 평가자 호출

## 후속 batch (2026-05-03 진행)

### B6 — spinbuttonPattern ✅
- [x] APG `/spinbutton/` recipe (`spinbutton.ts`) — 단일 focusable element. role=spinbutton, aria-valuenow/min/max/text/label/invalid/readonly
- [x] numericStep axis 재사용 — Arrow ±step, Home/End min/max, PageUp/PageDown ±step×10
- [x] task.md spinbutton 분류 ⚠️ → ✅
- [x] tsc 0

### B7 — grid 셀렉션 확장 ✅
- [x] `gridMultiSelect` axis 신규 — Ctrl+Space (col) · Shift+Space (row) · Ctrl/Meta+A (all) · Ctrl+Click (toggle) · Space (current toggle)
- [x] `useGridPattern` 에 `multiSelectable: boolean` 옵션 추가 → multiAxis 합성
- [x] rootProps `aria-multiselectable` 부여
- [x] tsc 0
- [ ] Shift+Arrow 2D range — anchor 모델 복잡도로 v3 보류

### B8 — PATTERNS.md tree selectionMode 정합 ✅
- [x] tree row 시그니처 `multiSelectable + selectionFollowsFocus` 로 갱신 (코드 정합)
- [x] treegrid row 시그니처 동일 갱신

### B9 — pure axis 단위 테스트 ✅
- [x] `gridNavigate.test.ts` — Arrow 4축 + Home/End + Ctrl+Home/End + edge no-wrap + sparse row clamp + non-key ignore (15 cases)
- [x] `gridMultiSelect.test.ts` — Ctrl+Space/Shift+Space/Ctrl+A/Meta+A/Space/Ctrl+Click/Meta+Click + 무관 키 ignore (10 cases)

### B10 — hook 테스트 인프라 ✅
- [x] `pnpm add -D --filter @p/aria-kernel jsdom @testing-library/react @testing-library/dom`
- [x] vitest.config.ts → `environment: 'jsdom'`, `*.test.tsx` include 추가

### B11 — hook pattern 테스트 ✅
- [x] `spinbutton.test.ts` — props 출력 + ArrowUp/Down/PageUp/Down/Home/End onEvent emit (6 cases)
- [x] `carousel.test.tsx` — renderHook + act, controlled/uncontrolled, loop wrap/clamp, focus pause sticky (APG 규칙 1), hover pause/resume, rotation aria-label flip, aria-controls = container, liveRegion polite/off (13 cases)
- [x] `feed.test.tsx` — rootProps + articleProps + labelProps id 매칭 + items posinset/setsize + idPrefix 전파 (6 cases)
- [x] `grid.test.tsx` — rootProps + rowProps + cellProps + columnHeader/rowHeader + selected/disabled state + tabIndex roving (8 cases)
- [x] grid bug fix: useRovingTabIndex 의 default focus 가 row id 를 잡던 버그 → focusContainerId = rowIds[0] 로 cell 차원에서 default 계산

### B12 — grid Shift+Arrow 2D range ✅
- [x] `gridMultiSelect` axis 의 Shift+Arrow 분기 추가 — anchor(SELECT_ANCHOR ?? current)→ next 사각형 selectMany
- [x] anchor 좌표 (rowIdx, colIdx) 검색 + bounding box 계산 + inRange/outRange 분리
- [x] sparse row 대응 (clamp colIdx)
- [x] edge 정지 (no-op)
- [x] gridMultiSelect.test.ts 4 cases 추가 (no-anchor / anchor / edge / plain Arrow ignore)

### 누적 결과 (B2~B14)
- vitest run 8 files / **80 tests pass**
- tsc clean
- 신규 axes: gridNavigate, gridMultiSelect
- 신규 patterns: feed, grid, carousel, spinbutton
- 보강: menu (menuitemcheckbox/radio + tri-state aria-checked), grid (aria-sort on headers), listbox (form context attrs), radioGroup (form context attrs + aria-labelledby), combobox (form context attrs + popup label)
- docs: PATTERNS.md P4 절·VOC #21~24·신규 axis 행 추가

### B13 — PATTERNS.md 갱신 ✅
- [x] P4 절 — feed/grid/carousel/spinbutton 시그니처 + 옵션 표
- [x] 신규 axis 갭 표 — gridMultiSelect 추가
- [x] VOC ↔ recipe 매핑 #21~24 추가
- [x] "P1 → P3 우선순위" → "P1 → P4 우선순위"

### B14 — ARIA states/properties spec 감사 ✅
- [x] grid columnHeader/rowHeader: `aria-sort` (entity.data.sort = ascending/descending/other 일 때만 emit, 'none' 또는 미지정은 omit)
- [x] listbox: form context 옵션 `required`/`readOnly`/`invalid`/`disabled` → rootProps aria-* 미러
- [x] radioGroup: form context 옵션 + `labelledBy` (외부 label 연결)
- [x] combobox: form context 옵션 + `popupLabel`/`popupLabelledBy` (popup listbox 명명)
- [x] grid.test.tsx 에 aria-sort 분기 테스트 추가 (vitest 80 pass)

### B15 — 명명 ergonomics: label/labelledBy 통합 ✅
- [x] ARIA 1.2 § 5.2.7.4 "Name from Author" 요구 role 전수 — toolbar/menu/menubar/tabs/tree/treeGrid/grid/feed/listbox/radioGroup 9 패턴에 `label?: string` + `labelledBy?: string` 일관 추가
- [x] grid + feed test 에 `label`/`labelledBy` 분기 (vitest 82 pass)

### B16 — 평가자 호출 후속 ✅
평가자가 잡아낸 4 가지:
- [x] **combobox 입력 자체 라벨링 누락** — popup listbox 만 라벨됨. inputProps 에 `label`/`labelledBy` 추가 + `aria-label`/`aria-labelledby` 미러 (combobox role 자체가 name-required)
- [x] **dialog 동의어 드리프트** — `ariaLabel`/`ariaLabelledBy`/`ariaDescribedBy` → `label`/`labelledBy`/`describedBy` 로 정합 (메모리 *동의어 드리프트 금지*)
- [x] **navigationList 동의어 드리프트** — `ariaLabel` → `label`/`labelledBy`
- [x] **alertdialog 라벨링 누락** — `alert.ts` 의 `alertdialogPattern()` 가 인자 0개였음. `AlertdialogOptions` 신설 + `label`/`labelledBy`/`describedBy` 지원
- [x] callsite 영향 검사: `dist/` 와 `debug.ts` (지역변수) 만 매치 → 외부 consumer 변경 없음

### B17 — axe-core a11y 통합 테스트 ✅
- [x] `pnpm add -D --filter @p/aria-kernel jest-axe @types/jest-axe`
- [x] `a11y.test.tsx` 신규 — 11 개 pattern 의 props 를 실제 DOM 에 mount 하여 axe-core ARIA rule 통과 검증
  - listbox · tabs · tree · treegrid · toolbar · radiogroup · menu · feed · grid · carousel · spinbutton
- [x] vitest 9 files / **93 tests pass**, 위반 0
- 가치: spec 준수의 경험적 증거 — "내가 spec 대로 짰다고 주장" 이 아니라 "industry-standard a11y 검증기가 위반 0 이라고 판정"

## 평가자 격리 규칙

- 평가자 input: 해당 batch 의 git diff + 본 task.md 의 해당 항목 + APG URL
- **금지**: `packages/aria-kernel/` 직접 read, 결정 사유 추적
- 판정 4축: (a) required state/property 누락 (b) APG 키 매핑 누락 (c) 거짓 완료 (d) identity-out 사유 빈약

---

# Part 2 — APG Examples → hook 옵션 + showcase wrapper 확장 (2026-05-05)

> Part 1 은 spec role 누락 감사. Part 2 는 같은 패턴의 **example 분기**(autocomplete=both/list/none, popup=listbox/grid/dialog 등) 를 hook 옵션으로 흡수하고 showcase wrapper 를 종류별로 늘리는 작업.
>
> 정체성 유지 — `@p/aria-kernel` 에 compound 컴포넌트 신설 ❌. hook 옵션 + showcase 의 Tailwind wrapper 만 확장.

## 진행 원칙

1. **Hook 은 옵션으로 흡수** — APG example 변종은 별도 hook 분기보다 옵션 분기가 default.
2. **별도 hook 분리** — 내부 axis 자체가 다를 때만 (예: combobox listbox popup vs grid popup → `gridNavigate` axis).
3. **showcase wrapper** — `apps/headless-site` 또는 `apps/finder|slides|markdown` 의 `widgets/` 안 Tailwind utility 직접.
4. **검증** — `npx tsc --noEmit -p tsconfig.app.json` + `vite dev` 콘솔 에러 0 + 키보드만으로 모든 인터랙션.

---

## 1. Combobox — 6 example, 가장 큰 갭

`https://www.w3.org/WAI/ARIA/apg/patterns/combobox/`

| # | example | URL | 입력 | aria-autocomplete | popup | Enter |
|---|---|---|---|---|---|---|
| 1 | Select-Only | `/examples/combobox-select-only/` | ❌ button-like | — | listbox | option → value |
| 2 | Autocomplete Both | `/examples/combobox-autocomplete-both/` | ✅ | `both` | listbox | inline + auto highlight + blur commit |
| 3 | Autocomplete List | `/examples/combobox-autocomplete-list/` | ✅ | `list` | listbox | 수동 highlight, 임의 입력 허용 |
| 4 | Autocomplete None | `/examples/combobox-autocomplete-none/` | ✅ | `none` | listbox | popup 수동 (Alt+Down/타이핑) |
| 5 | Grid Popup | `/examples/grid-combo/` | ✅ | `list` | **grid** | gridcell activedescendant, row 첫 cell → value |
| 6 | Date Picker | `/examples/combobox-datepicker/` | ✅ | — | **dialog** (calendar grid) | dialog grid → textbox |

### hook 갭

```ts
useComboboxPattern(data, onEvent, opts: {
  editable?: boolean                      // false = select-only(1)
  autocomplete?: 'none'|'list'|'both'     // 2/3/4
  popup?: 'listbox'|'grid'|'dialog'       // 4 vs 5 vs 6
  openOnFocus?: boolean
  openOnType?: boolean
  selectOnBlur?: boolean
  autoHighlightFirst?: boolean
})
```

- 5번(grid popup): 내부 navigate axis 가 `gridNavigate` → 별도 hook `useComboboxGridPattern` 권장.
- 6번(date picker): `useComboboxPattern({popup:'dialog'}) + useDialogPattern + useGridPattern` 합성. 별도 hook 불필요.

### 작업

- [ ] `useComboboxPattern` 옵션 6개 추가
- [ ] `useComboboxGridPattern` 신규
- [ ] showcase: 6 변종 페이지 (`combobox-select-only`, `-autocomplete-both`, `-autocomplete-list`, `-autocomplete-none`, `-grid`, `-datepicker`)

---

## 2. Listbox — 3 example

`https://www.w3.org/WAI/ARIA/apg/patterns/listbox/`

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/listbox-scrollable/` | single-select scrolling |
| 2 | `/examples/listbox-rearrangeable/` | single + multi, toolbar add/move/remove |
| 3 | `/examples/listbox-grouped/` | `<optgroup>` 동등, group label |

### hook 갭

```ts
useListboxPattern(data, onEvent, opts: {
  multiSelectable?: boolean
  selectionFollowsFocus?: boolean
  groups?: boolean              // 신규 — items[].groupId, role=group emit
  rearrangeable?: boolean       // 신규 — Move/Add/Remove intent
})
```

### 작업
- [ ] `groups` 옵션 — group label `aria-labelledby` 자동 emit
- [ ] `rearrangeable` 옵션 + Toolbar wiring 예제
- [ ] showcase: 3 변종 페이지

---

## 3. Tabs — 2 example (이미 흡수됨)

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/tabs-automatic/` | `activationMode='auto'` |
| 2 | `/examples/tabs-manual/` | `activationMode='manual'` |

### 작업
- [ ] showcase: 2 변종 페이지

---

## 4. Tree View — 3 example

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/treeview-1a/` | aria-level/posinset/setsize 자동 계산 |
| 2 | `/examples/treeview-1b/` | 명시 |
| 3 | `/examples/treeview-navigation/` | nav 용도 + `aria-current="page"` |

### hook 갭
```ts
useTreePattern(data, onEvent, opts: {
  variant?: 'select'|'navigation'   // 신규 — aria-current emit
})
```

### 작업
- [ ] `variant: 'navigation'` 시 selected item 에 `aria-current="page"`
- [ ] showcase: file directory + navigation 2 페이지

---

## 5. Menu / Menubar — 2 example

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/menubar-editor/` | menuitemradio + menuitemcheckbox |
| 2 | `/examples/menubar-navigation/` | site nav |

### hook 갭
```ts
useMenubarPattern(data, onEvent, opts: {
  variant?: 'menu'|'navigation'
})
// + items[].itemRole: 'menuitem'|'menuitemradio'|'menuitemcheckbox'
```

### 작업
- [ ] per-item `itemRole` 디스크리미네이터
- [ ] menu group radio 단일 selection
- [ ] showcase: 2 변종 페이지

---

## 6. Menu Button — 3 example (신규 hook)

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/menu-button-actions-active-descendant/` | activedescendant |
| 2 | `/examples/menu-button-actions/` | `element.focus()` |
| 3 | `/examples/menu-button-links/` | menuitem 이 `<a>` |

### hook 갭
```ts
useMenuButtonPattern(data, onEvent, opts: {
  focusMode?: 'roving'|'activeDescendant'
  variant?: 'action'|'navigation'
})
```

### 작업
- [ ] `useMenuButtonPattern` 신규
- [ ] showcase: 3 변종 페이지

---

## 7. Dialog (Modal) — 2 example

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/dialog/` | nested dialog |
| 2 | `/examples/datepicker-dialog/` | dialog 안 calendar grid |

### 작업
- [ ] nested stack 검증 (top-of-stack 만 trap)
- [ ] showcase: dialog + datepicker-dialog

---

## 8. AlertDialog — 1 example

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/alertdialog/` | confirm prompt |

### 작업
- [ ] `useAlertDialogPattern` = `useDialogPattern` + `role="alertdialog"` + cancel autofocus
- [ ] showcase: confirm/destructive 2 페이지

---

## 9. Disclosure — 5 example (hook 그대로, markup 만 다름)

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/disclosure-image-description/` | 이미지 설명 |
| 2 | `/examples/disclosure-faq/` | 다중 disclosure |
| 3 | `/examples/disclosure-navigation/` | nav menu |
| 4 | `/examples/disclosure-navigation-hybrid/` | top link + 하위 disclosure |
| 5 | `/examples/disclosure-card/` | card |

### 작업
- [ ] showcase: 5 변종 페이지 (같은 hook 다른 markup 증명)

---

## 10. Grid — 3 example

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/layout-grids/` | nav/recipients/results |
| 2 | `/examples/data-grids/` | content edit + sort + col hide |
| 3 | `/examples/advanced-data-grid/` | spreadsheet, cell+row selection |

### hook 갭
```ts
useGridPattern(data, onEvent, opts: {
  multiSelectable?: boolean
  readOnly?: boolean
  selectionMode?: 'cell'|'row'|'rect'   // 신규
  sortable?: boolean                     // 신규 — aria-sort
  editable?: boolean                     // 신규 — F2 Edit intent
})
```

### 작업
- [ ] `selectionMode='rect'` + Shift+Arrow 2D range + Ctrl+A
- [ ] `sortable` columnHeader `aria-sort` emit + Sort intent
- [ ] `editable` F2 → Edit intent, Escape cancel
- [ ] showcase: 3 변종 페이지

---

## 11. TreeGrid — 1 example, 3 navMode

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/treegrid-1/` | rows-first / cells-first / cells-only 3 모드 |

### hook 갭
```ts
useTreeGridPattern(data, onEvent, opts: {
  navMode?: 'rowsFirst'|'cellsFirst'|'cellsOnly'   // 신규
  multiSelectable?: boolean
})
```

### 작업
- [ ] `navMode` 옵션 + 내부 axis 분기
- [ ] showcase: email inbox 3 모드 페이지

---

## 12. Carousel — 2 example

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/carousel-1-prev-next/` | autoplay + prev/next |
| 2 | `/examples/carousel-2-tablist/` | autoplay + tabs |

### hook 갭
```ts
useCarouselPattern(opts: {
  control?: 'buttons'|'tabs'   // 신규
  autoplay?: boolean
  intervalMs?: number
  loop?: boolean
})
```

### 작업
- [ ] `control: 'tabs'` 변종 — `useTabsPattern` 합성
- [ ] showcase: 2 변종 페이지

---

## 13. Feed — 1 example

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/feed/` | 무한 스크롤 |

### 작업
- [ ] `useFeedPattern` `busy` 옵션 + IntersectionObserver "load more" intent
- [ ] showcase: 무한 스크롤 페이지

---

## 14. Radio Group — 3 example

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/radio/` | roving tabindex |
| 2 | `/examples/radio-activedescendant/` | activedescendant |
| 3 | `/examples/radio-rating/` | 5-star rating |

### hook 갭
```ts
useRadioGroupPattern(data, onEvent, opts: {
  focusMode?: 'roving'|'activeDescendant'   // 신규
  orientation?: 'h'|'v'
})
```

### 작업
- [ ] `focusMode` 옵션
- [ ] showcase: 3 변종 페이지

---

## 15. Checkbox — 2 example (신규 hook)

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/checkbox/` | two-state |
| 2 | `/examples/checkbox-mixed/` | tri-state, 자식 fieldset 제어 |

### hook 갭
```ts
checkboxPattern(opts: {
  checked?: boolean | 'mixed'
  defaultChecked?: boolean | 'mixed'
  onCheckedChange?: (next: boolean) => void
})
useCheckboxGroupPattern(data, onEvent, opts: { mixed?: boolean })
```

### 작업
- [ ] `checkboxPattern` 신규
- [ ] `useCheckboxGroupPattern` — 부모/자식 mixed 동기화
- [ ] showcase: 2 변종 페이지

---

## 16. Slider — 4 example

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/slider-color-viewer/` | 가로 |
| 2 | `/examples/slider-temperature/` | 세로, 단위 |
| 3 | `/examples/slider-rating/` | 의미적 valueText |
| 4 | `/examples/slider-seek/` | 시간 valueText |

### hook 갭
```ts
sliderPattern(data, onEvent, opts: {
  min, max, step,
  orientation?: 'h'|'v',
  valueText?: (n: number) => string   // 신규 — aria-valuetext
})
```

### 작업
- [ ] `valueText` + `aria-valuetext` emit
- [ ] showcase: 4 변종 페이지

---

## 17. Slider Multi-Thumb — 1 example

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/slider-multithumb/` | 2 thumb 가격 범위 |

### hook 갭
```ts
sliderRangePattern(data, onEvent, opts: {
  values: number[],          // 다중 thumb
  min, max, step,
  orientation?: 'h'|'v',
})
```

### 작업
- [ ] `sliderRangePattern` 신규 (또는 `sliderPattern` `values: number[]` 확장)
- [ ] showcase: range 페이지

---

## 18. Spinbutton — 1 example

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/quantity-spinbutton/` | 호텔 예약 quantity |

### 작업
- [ ] showcase: quantity + `<input type=number>` 비교 페이지

---

## 19. Switch — 3 example (host element 만 다름)

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/switch/` | div |
| 2 | `/examples/switch-button/` | `<button>` |
| 3 | `/examples/switch-checkbox/` | `<input type=checkbox role=switch>` |

### 작업
- [ ] showcase: 3 변종 페이지 (같은 hook 다른 host element)

---

## 20. Toolbar — 1 example, 혼합 itemRole

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/toolbar/` | toggle/radio/menu/spin/checkbox/link |

### hook 갭
```ts
useToolbarPattern(data, onEvent, opts: {
  orientation?: 'h'|'v',
})
// + items[].itemRole: 'button'|'toggle'|'radio'|'menubutton'|'spinbutton'|'checkbox'|'link'
```

### 작업
- [ ] per-item `itemRole` 디스크리미네이터
- [ ] showcase: 혼합 toolbar 페이지

---

## 21. Tooltip — example 미완 (issue 127)

### 작업
- [ ] showcase: hover + focus + Escape + delay (open 700/close 100ms) 페이지

---

## 22. Button — 2 example (recipe 불필요, native)

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/button/` | div/span command + toggle |
| 2 | `/examples/button_idl/` | IDL |

### 작업
- [ ] showcase: command vs toggle (`aria-pressed`)

---

## 23. Breadcrumb — 1 example (native)

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/breadcrumb/` | nav + ol + aria-current=page |

### 작업
- [ ] showcase: `<nav aria-label="Breadcrumb"><ol>...</ol></nav>`

---

## 24. Link — 1 example (native)

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/link/` | span/img + role=link |

### 작업
- [ ] showcase: native `<a>` vs `role="link"` (Enter+Space) 비교

---

## 25. Landmarks — 8 example (semantic HTML)

| # | URL | landmark |
|---|---|---|
| 1 | `/examples/main.html` | `<main>` |
| 2 | `/examples/navigation.html` | `<nav>` |
| 3 | `/examples/search.html` | `role=search` |
| 4 | `/examples/banner.html` | `<header>` |
| 5 | `/examples/contentinfo.html` | `<footer>` |
| 6 | `/examples/complementary.html` | `<aside>` |
| 7 | `/examples/form.html` | `role=form` |
| 8 | `/examples/region.html` | `<section aria-label>` |

### 작업
- [ ] showcase: 8 landmark 한 페이지 reference layout

---

## 26. Meter — 1 example (native `<meter>`)

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/meter/` | range numeric |

### 작업
- [ ] showcase: native + role=meter 2 변종

---

## 27. Table — 2 example

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/table/` | div/span ARIA table |
| 2 | `/examples/sortable-table/` | aria-sort |

### 작업
- [ ] showcase: native + ARIA + sortable 3 페이지

---

## 28. Window Splitter — example 미완 (issue 130)

우리는 `splitterPattern` 으로 구현됨.

### 작업
- [ ] showcase: 가로 + 세로 splitter 페이지 (Arrow ±step, Home/End min/max)

---

## 29. Alert — 1 example

| # | URL | 변종 |
|---|---|---|
| 1 | `/examples/alert/` | role=alert + aria-live=assertive |

### 작업
- [ ] showcase: alert 토스트 (auto-dismiss + manual)

---

# 우선순위 (실행 순서)

## P1 — 옵션 갭이 큰 hook (먼저)

1. **Combobox** — 옵션 6개 + `useComboboxGridPattern`. 가장 큰 갭.
2. **TreeGrid** — `navMode` 3 모드.
3. **Grid** — `selectionMode`·`sortable`·`editable`.
4. **Listbox** — `groups`·`rearrangeable`.
5. **Tree** — `variant: 'navigation'`.
6. **Toolbar** — per-item `itemRole`.

## P2 — 신규 hook

7. **Menu Button** — `useMenuButtonPattern` + `focusMode`.
8. **Checkbox** — `checkboxPattern` + `useCheckboxGroupPattern`.
9. **AlertDialog** — `useAlertDialogPattern`.
10. **Slider Range** — `sliderRangePattern`.

## P3 — 작은 옵션 갭

11. **Radio Group** — `focusMode`.
12. **Carousel** — `control: 'tabs'`.
13. **Slider** — `valueText`.
14. **Menubar** — per-item `itemRole` + group radio.

## P4 — showcase 만

Tabs · Disclosure · Switch · Tooltip · Button · Breadcrumb · Link · Landmarks · Meter · Table · Splitter · Alert · Spinbutton · Feed · Dialog

---

# `@p/aria-kernel` Edit / Clipboard / History 어휘 gap 닫기

trigger: zod-crud × @p/aria-kernel 콜라보 example(`apps/outliner`) 설계 중 `UiEvent` 에 편집 동사가 통째로 없음을 발견. ARIA spec은 *상태* 어휘만 정본 — 편집 동사는 spec 밖이라 내부 결정. 기준 출처는 zod-crud `JsonCrud` op 어휘로 정렬 (이미 닫혀 있음).

참조: `docs/2026/2026-05/2026-05-05/01_outlinerPrd.md`

## 결정 트리

```
편집 동사 후보
 ├─ zod-crud op 와 1:1 매칭?
 │   ├─ YES → UiEvent 추가 후보
 │   └─ NO  → 보류 (재발명 위험)
 └─ 단독 컬렉션 앱(outliner) 외에서도 재사용?
     ├─ YES → P0/P1 (본체 추가)
     └─ NO  → 앱 국지 어휘로 유지
```

범례: ✅ done · 🟡 in-progress · ❌ todo · 🚫 out

## P0 — UiEvent 어휘 확장 (본체 spec)

`packages/aria-kernel/src/types.ts` + `schema.ts` 동시 갱신. zod-crud op 어휘를 정본으로 채택.

| event | shape | zod-crud 매핑 | 상태 |
|---|---|---|---|
| `create` | `{ type, parentId, key?, value? }` | `crud.create(parentId, key, value)` | ❌ |
| `update` (id-bound) | `{ type, id, value }` | `crud.update(id, value)` | ❌ |
| `remove` | `{ type, id }` | `crud.delete(id)` | ❌ |
| `copy` | `{ type, id }` | `crud.copy(id)` | ❌ |
| `cut` | `{ type, id }` | `crud.cut(id)` | ❌ |
| `paste` | `{ type, id, mode?: 'sibling'\|'child'\|'replace' }` | `crud.paste(id, {mode})` | ❌ |
| `undo` | `{ type }` | `crud.undo()` | ❌ |
| `redo` | `{ type }` | `crud.redo()` | ❌ |

서브태스크:
- ❌ `UiEvent` discriminated union 8종 추가
- ❌ `parseUiEvent` zod schema 동기화
- ❌ 기존 `value` 변종(슬라이더용 `ValueEvent<T>`)과 새 `update`(id-bound)의 책임 경계 주석
- ❌ `INVARIANTS.md` / `PATTERNS.md` 업데이트

## P1 — gesture/intent 헬퍼 (key → UiEvent)

memory의 *Gesture/Intent 분리* 원칙을 편집 어휘에 확장. 키 입력 → UiEvent 변환을 앱이 매번 짜지 않도록.

- ❌ `useShortcut` 결과를 dispatch로 직결하는 thin helper
- ❌ 클립보드 표준 키 매핑 helper: `useClipboardShortcuts(dispatch, () => activeId)` — Cmd+C/X/V/Delete 일괄
- ❌ 히스토리 표준 키 매핑 helper: `useHistoryShortcuts(dispatch)` — Cmd+Z / Cmd+Shift+Z

## P2 — `useTreePattern` / `useTreeGridPattern` 편집 동사 통합

현재는 nav/select/expand 만. tree 내 편집 키 디폴트를 패턴이 흡수.

- ❌ `Enter` → `create` (형제 추가) 디폴트 emit
- ❌ `Tab` / `Shift+Tab` → `move` 또는 `cut+paste` 시퀀스
- ❌ `Backspace` (빈 노드) → `remove`
- ❌ 옵션 플래그 `editable: boolean` — 비편집 모드와 분리

## P3 — flat-tree 어댑터 유틸

flat record 백엔드(zod-crud, FS, DB recordset)를 `NormalizedData`로 잇는 일반화된 헬퍼.

- ❌ `fromFlatTree<N>(nodes: Record<string, N>, rootId: string, accessors: { children: (n: N) => string[] })` 추가
- ❌ `fromTree` / `fromList` 와 같은 위치에서 export
- ❌ 단위테스트: zod-crud `JsonDoc` 통과, 임의 FS-style record 통과

## P4 — `defineResource.onEvent` 라우팅 헬퍼

매 `defineResource` 가 동일한 switch 문을 반복하지 않도록.

- ❌ `routeUiEventToCrud(crud, event) → nextSnapshot | undefined` 헬퍼
- ❌ 8종 새 UiEvent 자동 매핑, focus 복귀(`OperationResult.focusNodeId`) 자동 흐름
- ❌ 단, `@p/aria-kernel/store` 본체에 zod-crud import 금지 — *interface* 만 받는 구조 (`{ copy(id), cut(id), paste(id, opts), ... }`)

## P5 — example 앱으로 검증 (`apps/outliner`)

PRD: `docs/2026/2026-05/2026-05-05/01_outlinerPrd.md`

- ❌ `apps/outliner/` 스캐폴드 (entities/features/widgets/routes)
- ❌ zod-crud npm dep 추가
- ❌ Outliner.tsx ~80줄, outlineResource ~30줄
- ❌ Acceptance criteria 8항목 통과 (PRD §8)
- ❌ tsc + vite dev 콘솔 에러 0
- ❌ axe 검사 위반 0

## 검증 — 끝났음을 안다

- ❌ `useShortcut('mod+z', () => dispatch({ type: 'undo' }))` 한 줄로 동작
- ❌ outliner 키보드만으로 100% CRUD + clipboard + history
- ❌ 기존 패턴 회귀 0 (listbox/menu/treegrid 테스트 통과)
- ❌ memory의 *Single data interface* / *Gesture/Intent 분리* 원칙 위반 0



---

# Naming audit 후속 — canonical 정합 작업 (2026-05-05)

근거: `packages/aria-kernel/NAMING.md` §5 (식별된 위반).

## T1 — dialog `alert` 플래그 제거 (❌ violation, 반영)

**위반**: `useDialogPattern({alert: true})` 가 `role="alertdialog"` 를 토글. *1 role = 1 pattern* 위반.

**작업**:
1. `packages/aria-kernel/src/patterns/dialog.ts`
   - `DialogOptions.alert` 제거, `role: 'dialog'` 고정
2. `packages/aria-kernel/src/patterns/alertDialog.ts`
   - 현재 `useDialogPattern({...opts, alert: true})` preset 깨짐 → role override 방식으로 최소 변경
   - `const r = useDialogPattern(opts)` 후 `rootProps: { ...r.rootProps, role: 'alertdialog' }`
3. `alertdialogPattern` (declarative, alert.ts) 그대로 유지
4. 검증: tsc + `grep -rn "alert: true" apps/site/src/demos/` 0건

## T2 — treeGrid `navMode` → `navigationMode` (⚠️ rename)

**위반**: APG "row focus" / "cell focus" 명명 직역 아님.

**작업**:
1. `packages/aria-kernel/src/patterns/treeGrid.ts`
   - `navMode` → `navigationMode`
   - 값: `'rowsFirst'`→`'row'`, `'cellsFirst'`→`'cell'`, `'cellsOnly'`→`'cellOnly'`
   - JSDoc 에 APG TreeGrid §Row/Cell Focus 인용
2. 데모 `apps/site/src/demos/treeGridCellsFirst.tsx`, `treeGridCellsOnly.tsx` 업데이트
3. 검증: tsc + 키보드 동작 동일

## T3 — NAMING.md cross-link

1. `PATTERNS.md` 상단에 "Naming dictionary: [NAMING.md](./NAMING.md)" 한 줄
2. `INVARIANTS.md` 동일 한 줄
3. `README.md` docs 섹션 추가

## 실행 순서

T1 → T2 → T3. 각 T 완료 시 `npx tsc --noEmit -p tsconfig.app.json` 0 에러 확인.

---

# Audit 후속 — Checkbox Mixed + API 단순화 (2026-05-05)

## T4 — Checkbox Mixed Group 오동작 fix (트랙 B)

**위반**: APG `/checkbox/examples/checkbox-mixed/`. parent toggle 이 disabled child 까지 강제 toggle. 영구 mixed 상태 발생 가능.

### T4.1 [CRITICAL] — disabled child 를 parent 연산에서 제외

`packages/aria-kernel/src/patterns/checkbox.ts:106-113`:
```ts
const enabled = items.filter((it) => !it.disabled)
const enabledIds = enabled.map((it) => it.id)
const checkedCount = enabled.filter((it) => it.selected).length
const parentChecked: CheckboxState =
  enabled.length === 0 ? false
  : checkedCount === 0 ? false
  : checkedCount === enabled.length ? true
  : 'mixed'

const toggleParent = () => {
  if (enabled.length === 0) return
  const next = parentChecked !== true
  onEvent?.({ type: 'selectMany', ids: enabledIds, to: next })
}
```

### T4.2 [HIGH] — group disabled 옵션 + auto-disable

`CheckboxGroupOptions` 에 `disabled?: boolean` 추가. 모든 child disabled 시 parent 도 자동 disabled.
parentProps: `tabIndex: groupDisabled ? -1 : 0`, `'aria-disabled': groupDisabled || undefined`.

### T4.3 [HIGH] — parent `aria-controls`

parentProps 에 `'aria-controls': ids.join(' ') || undefined` 추가. (단, child id 가 실제 DOM id 와 일치해야 의미 — childProps 에 id 노출 필요. 현재는 미노출 — 별도 검토.)

### T4.4 [MED] — parent/child accessible name pass-through

childProps 에 `'aria-label': it?.label` 추가. parentProps 에 `parentLabel?: string` 옵션 또는 그룹 label 재사용.

### T4 검증
- 데모 `checkboxMixed.tsx` 에 disabled child 1개 추가 → parent click 시 변하지 않는지 확인
- 모든 child disabled → parent 도 disabled
- tsc 0

---

## T5 — API 단순화 믹스인 (트랙 A, P0 만)

### T5.1 BasePatternOptions

`packages/aria-kernel/src/patterns/types.ts` 에 추가:
```ts
export interface BasePatternOptions {
  /** ARIA accessible name. */
  label?: string
  /** ARIA labelledBy — id of element naming this pattern. */
  labelledBy?: string
}
```

25패턴의 `Options` interface 가 `extends BasePatternOptions`. 기존 `label`/`labelledBy` 필드는 삭제.

### T5.2 CollectionOptions

```ts
export interface CollectionOptions extends BasePatternOptions {
  containerId?: string
  idPrefix?: string
  autoFocus?: boolean
  orientation?: 'horizontal' | 'vertical'
}
```

collection 13패턴(listbox, tabs, tree, treeGrid, grid, radioGroup, toolbar, menu, menubar, accordion, feed, combobox, comboboxGrid) 의 Options 가 `extends CollectionOptions`. 패턴별로 orientation 미지원이면 Omit.

### T5.3 FormAttrs (선택, 회의 후)

`disabled`/`invalid`/`required`/`readOnly` 12패턴 공통. 패턴마다 의미가 미묘히 달라 회의 후 결정. 일단 보류.

### T5 검증
- `npx tsc --noEmit` 0 에러 (Options 시그니처 변경되어도 외부 호환)
- 외부 사용처(데모 30+개) 영향 없음 (옵션은 interface union 으로 그대로 노출)

---

## T6 — 보존 권고 (NAMING.md 에 명시 필요)

이번 audit 에서 기각된 단순화 후보. NAMING.md §6 에 추가:
- `idPrefix` 제거 ❌ (SSR 안정성)
- Menu `onEscape` 제거 ❌ (gesture/intent split 의도적 hook)
- `focusMode` 공통화 ❌ (실제 사용 사례 부족, 백로그)

## 실행 순서

T4 → T5 → T6 (T4 가 가장 critical, T5 는 surface 정리, T6 은 docs)

T4.1, T4.2 만 우선 반영해도 APG 정합 회복. T4.3 은 child id 노출 작업 동반 필요 — 별도 검토.
