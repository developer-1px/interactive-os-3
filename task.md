# `@p/headless` ARIA Spec 누락 검증

MDN ARIA Roles 페이지를 카테고리 순서대로 훑어 `@p/headless/patterns` 의 spec 커버리지 갭을 박제. 결정 트리: **APG에 패턴이 있고 + 키보드/포커스 행동 인프라가 필요한 role 만 patterns 후보**. native HTML/ARIA 만으로 충분한 role 은 🚫identity-out 으로 마감.

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
- [x] `pnpm add -D --filter @p/headless jsdom @testing-library/react @testing-library/dom`
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
- [x] `pnpm add -D --filter @p/headless jest-axe @types/jest-axe`
- [x] `a11y.test.tsx` 신규 — 11 개 pattern 의 props 를 실제 DOM 에 mount 하여 axe-core ARIA rule 통과 검증
  - listbox · tabs · tree · treegrid · toolbar · radiogroup · menu · feed · grid · carousel · spinbutton
- [x] vitest 9 files / **93 tests pass**, 위반 0
- 가치: spec 준수의 경험적 증거 — "내가 spec 대로 짰다고 주장" 이 아니라 "industry-standard a11y 검증기가 위반 0 이라고 판정"

## 평가자 격리 규칙

- 평가자 input: 해당 batch 의 git diff + 본 task.md 의 해당 항목 + APG URL
- **금지**: `packages/headless/` 직접 read, 결정 사유 추적
- 판정 4축: (a) required state/property 누락 (b) APG 키 매핑 누락 (c) 거짓 완료 (d) identity-out 사유 빈약
