---
type: reference
mode: defacto
status: draft
project: ds
layer: ui
tags: [layout, a2ui, veneer, edu-portal-admin, GAP-04, primitives]
source_plan: /Users/user/.claude/plans/shiny-greeting-waffle.md
references:
  - /Users/user/Desktop/veneer/src/a2ui/components/Layout.tsx
  - /Users/user/Desktop/veneer/src/a2ui/components/attrs.ts
  - /Users/user/Desktop/veneer/src/a2ui/types.ts
  - /Users/user/Desktop/veneer/src/a2ui/a2ui.css
  - docs/2026/2026-04/2026-04-24/edu-portal-admin-gaps.md
---

# a2uiLayout → ds/ui 흡수 검토

edu-portal-admin 1-pass에서 드러난 **layout primitive 공백**(GAP-04, sidebar+main+aside, form 좌우 분할,
카드 그리드)을 veneer의 a2ui Layout (Row/Column/Stack/Grid) 모델을 참고해 ds에 흡수할지 설계한다.
이 문서는 설계·판단만 담고 ds 본체·meta·ds.css는 수정하지 않는다.

---

## 1. TL;DR

**조건부 채택**. Row/Column/Stack/Grid 4개를 ds/ui/layout/ 로 신설한다. 단,

- veneer의 **legacy numeric props**(`gap="3"`, `pad="4"`, `align="center"`…)는 **채택하지 않는다.**
  "minimize choices for LLM" 원칙을 정면으로 위반한다(숫자 고르기를 LLM에 떠넘김).
- veneer의 **semantic meta**(`data-intent=list|cluster|form|prose|stack|split`, `data-emphasis=raised|sunk|callout`)만
  **top-level prop으로 승격**해 채택한다. 이 두 개의 enum이 "1 role = 1 component, variant 금지" 및
  "minimize choices"와 가장 잘 맞는다.
- data-attribute 기반 선언은 **classless 원칙과 완전 호환**이므로 그대로 유지.
- CSS는 ds.css 생성기(`src/ds/index.ts` → `dsCss` 어레이) 경유로만 추가. 새 모듈
  `src/ds/css/layout.ts`를 만들어 shell 옆에 끼운다. a2ui.css를 복붙하지 않고 Intent 중심으로 재작성.
- 1 role = 1 component 원칙은 Row/Column/Stack/Grid가 "layout container(ARIA role 없음)"임을 명시하는
  것으로 해소 — role 공간을 오염시키지 않는다(각 요소는 `role` 없이 `<div data-ds="Row">`).
- **GAP-04·06·10 중 "layout이지 role이 아님"으로 분류된 gap의 절반 이상을 해소**하지만
  Checkbox/Textarea/Reorder 같은 role gap은 전혀 건드리지 않는다.

도입 판정: **YES, 단 축소판으로.** 다음 질문 3개만 2패스 킥오프에서 정한다:
(1) `Stack`(Grid place-items overlay) 실제 사용처 있는가, (2) `emphasis=raised`가 ds의 `surface()` 헬퍼와
어느 쪽이 canonical인가, (3) Row/Column 선택을 없애고 `Flex direction="row|column"` 단일 컴포넌트로
통합할지(minimize choices 극단화).

---

## 2. veneer a2ui Layout 분석

### 2.1 컴포넌트 4종

| 컴포넌트 | 의미                       | 기본 디스플레이                          | 핵심 prop                             |
| -------- | -------------------------- | ---------------------------------------- | ------------------------------------- |
| Row      | 가로 flex container        | `display:flex; flex-direction:row`       | align, justify, wrap, grow, gap       |
| Column   | 세로 flex container        | `display:flex; flex-direction:column`    | 동일                                  |
| Stack    | 모든 자식을 한 셀에 겹침   | `display:grid; 1fr/1fr; > * grid-area:1/1` | align, justify                        |
| Grid     | N열 그리드                 | `grid-template-columns:repeat(cols,1fr)` | `cols: 1\|2\|3\|4\|6\|12 \| string` |

모두 `data-a2ui="Row"` 등 **대문자 토큰**을 루트 속성으로 찍어 CSS가 `[data-a2ui="Row"]` 선택자로 매칭한다.
자식 배치는 `Slots ids={n.children}`로 id 참조(JSON flat model) — DS에서는 그냥 `children` JSX로 받으면 된다.

### 2.2 layoutAttrs로 방출되는 data-* 속성

`/Users/user/Desktop/veneer/src/a2ui/components/attrs.ts` 읽기 결과.

Legacy numeric (BoxLayoutProps):

- `data-gap`, `data-gap-sm`, `data-gap-md`, `data-gap-lg` — 토큰 `0|1|2|3|4|5|6|8|10|12|16`
- `data-pad`, `data-padx`, `data-pady` + 반응형 suffix
- `data-align` — `start|center|end|stretch|baseline`
- `data-justify` — `start|center|end|between|around|evenly`
- `data-wrap`, `data-grow` — boolean
- `data-a2ui-surface` — `none|raised|sunk|surface|bg`
- `data-a2ui-radius` — `none|xs|s|m|l|xl|full`
- `data-a2ui-shadow` — `none|1|2|3`
- `data-a2ui-border` — boolean

Semantic meta (canonical):

- `data-intent` — `list | cluster | form | prose | stack | split`
- `data-emphasis` — `flat | raised | sunk | callout`
- `data-grow` — 별도 최상위 flag

CSS 매핑은 `a2ui.css @layer layout` 안에 전부 있다 — 토큰은 veneer.css의 `--s-*`, `--r-*`,
`--surface-*`, `--shadow-*`를 참조. 예를 들어 `data-intent="cluster"`는
`gap: var(--s-2); align-items: center;` 한 줄로 매핑된다.

### 2.3 특이점

- `Grid`는 `cols` 가 string인 경우에만 `style={{'--a2ui-cols': template}}` 인라인 변수 주입. 이게
  유일한 inline style (escape hatch로 명시).
- Responsive는 `{ base, sm, md, lg }` 객체로 입력 → suffix 붙은 data-attr 여러 개 방출 → 미디어쿼리로
  overrides. 좋은 패턴 (ARIA 친화, JS 없이 CSS가 다 해결).
- Semantic rule이 legacy 뒤에 선언되어 **cascade로 semantic 승리**. 마이그레이션 친화적.

---

## 3. ds 철학과의 정합 평가

| 원칙                                | Legacy numeric | Semantic meta | 비고                                                                                                            |
| ----------------------------------- | -------------- | ------------- | --------------------------------------------------------------------------------------------------------------- |
| Classless (style-only class 금지)   | ✓              | ✓             | 모든 선택자가 `[data-*]`. class 0개. 완벽 호환.                                                                 |
| HTML + ARIA only                    | ✓ (div)        | ✓ (div)       | Row/Column/Stack/Grid는 ARIA role 없는 presentational container. `role` prop을 위임 가능은 해둬야 함(안쓰면 됨). |
| Minimize choices for LLM            | ✗              | ✓             | **핵심 갈림길.** `gap: '3'` vs `gap: '4'`는 LLM이 매번 고민함. `intent: 'cluster'`는 의미가 명확해 수렴 잘 됨.      |
| Data-driven (ControlProps)          | N/A            | N/A           | Row/Column은 roving/selection 없는 단순 container. ControlProps 적용 대상 아님 (명시 필요).                     |
| 1 role = 1 component                | △              | △             | Row·Column 둘 다 "flex container" — role이 없으니 role 중복은 아님. 하지만 **축이 다른 변형**이라 variant-ish.  |
| No escape hatches / raw role 금지   | ✓              | ✓             | 모두 `<div>` + data-attr. `role=` 소비자 노출 X.                                                                |
| prop 이름은 ARIA 그대로              | ✗              | ✗             | `intent`/`emphasis`는 ARIA에 없는 ds 조어. 단 "flow intent"는 업계에 선례 없음 → ds 자체 어휘 허용 범위.        |
| Middle alignment invariant          | —              | —             | rovingItem 규칙과 무관(Row/Column은 rovingItem 아님). 충돌 없음.                                                |

**어긋나는 지점 요약**

1. **Legacy numeric gap/pad/align 전부 기각.** LLM이 `gap='3'`인지 `'4'`인지 매번 고르게 되는 선택지 폭발.
   ds 메모리 `feedback_minimize_choices_for_llm.md` 위반.
2. **Row vs Column 선택**도 minimize choices 관점에서 약한 지점. 하지만 "가로/세로"는 업계 de facto
   (Radix, RAC, ChakraUI, Mantine, Ariakit 전부 별개 컴포넌트) → 예외적으로 2개 유지.
3. `as` prop 도입 유혹: Row를 `<nav>`/`<header>`로 쓰고 싶어질 것. 현 원칙상 **거절**. 해당 케이스는
   소비자가 `<nav>` 안에 `<Row>`를 감싸거나, 전용 role(Navbar, Toolbar)을 ui/에 만들어 쓴다. Toolbar는 이미 있음.

---

## 4. 도입 시 ds 구조 매핑

### 4.1 파일 구조 (제안)

```
src/ds/ui/layout/              # NEW
  Row.tsx
  Column.tsx
  Stack.tsx
  Grid.tsx
  index.ts                     # re-export
src/ds/css/layout.ts           # NEW — data-* 선택자 전체
src/ds/index.ts                # dsCss 배열에 layout() 추가
src/ds/ui/index.ts             # layout re-export
```

columns/ 는 이미 Finder의 column-list 컴포넌트로 쓰이고 있어 이름 충돌 방지를 위해 **별도 폴더 `layout/`**.
grid/ 는 DataGrid(role=grid) 전용이므로 건드리지 않는다 (의미 혼동 방지).

### 4.2 API 초안

모두 `<div>` 렌더, 소비자 children JSX. ControlProps 없음.

```tsx
// src/ds/ui/layout/Row.tsx
type Flow = 'list' | 'cluster' | 'form' | 'prose' | 'stack' | 'split'
type Emphasis = 'flat' | 'raised' | 'sunk' | 'callout'

type RowProps = {
  flow?: Flow            // data-flow  (veneer의 data-intent. ds에선 "flow"가 더 의도 명확)
  emphasis?: Emphasis    // data-emphasis
  grow?: boolean         // data-grow
  children?: React.ReactNode
} & Omit<ComponentPropsWithoutRef<'div'>, 'role'>

export function Row({ flow, emphasis, grow, children, ...rest }: RowProps) {
  return (
    <div
      data-ds="Row"
      data-flow={flow}
      data-emphasis={emphasis}
      data-grow={grow || undefined}
      {...rest}
    >
      {children}
    </div>
  )
}
```

Column/Stack은 동일 시그니처, `data-ds` 값만 다름. Grid는 `cols` 추가:

```tsx
type GridProps = RowProps & { cols?: 1 | 2 | 3 | 4 | 6 | 12 }

export function Grid({ cols, ...rest }: GridProps) {
  return <div data-ds="Grid" data-cols={cols} {...rest} />
}
```

**의도적으로 뺀 것**:

- `gap`, `pad`, `padX`, `padY` (숫자) — flow가 결정
- `align`, `justify` (문자) — flow가 결정 (split은 between, cluster는 center 등)
- `wrap` — 필요해지면 "flow=cluster wraps"로 CSS 규칙 보강하거나 새 flow 추가
- `surface`, `radius`, `shadow`, `border` — emphasis가 번들
- Responsive (`gap-sm` 등) — 1차 범위 제외. flow가 반응형 무관한 의도 표현이므로 대부분 불필요. 필요시 2패스

**prop 이름 판정**: veneer는 `meta.intent`. ds는 `flow`로 **변경 제안**.

- `intent`는 React에서 "user intent / action intent"와 충돌 어휘
- `flow`는 CSS flow-layout과 의미가 일치, "children이 어떤 흐름"이라는 메타포 직관적
- Radix·Mantine·Chakra 전부 이 용어 미사용 → de facto 부재, ds 자체 명명 허용

### 4.3 data-attr prefix

veneer는 `data-a2ui`. ds는 이미 `data-ds`를 사용 (ex: `data-ds="field"` 등 없음, 확인 필요).
**제안: `data-ds="Row" | "Column" | "Stack" | "Grid"`**. ui/ 전반의 data-* 네이밍과 맞춘다.

---

## 5. ds.css 생성기 영향

현재 `src/ds/index.ts`의 `dsCss` 배열:

```
reset, seeds, iconVars(), states(), menu(), tree(), widgets(), iconIndicator(), shell()
```

**추가**: `layout()`을 `widgets()` 다음에 삽입 (widgets가 surface/radius 토큰을 소비하므로 그 뒤). shell은
앱 특화 pane 배치라 **반드시 layout 뒤**에 와야 오버라이드 순서가 맞는다.

```ts
// src/ds/index.ts (after)
import { layout } from './css/layout'

export const dsCss = [
  reset, seeds, iconVars(),
  states(),
  menu(), tree(), widgets(),
  layout(),                  // NEW
  iconIndicator(), shell(),
].join('\n')
```

**`src/ds/css/layout.ts` 스켈레톤**:

```ts
import { css, pad, surface } from '../fn'

export const layout = () => css`
  /* roots */
  [data-ds="Row"], [data-ds="Column"] { display: flex; min-inline-size: 0; }
  [data-ds="Row"]    { flex-direction: row; }
  [data-ds="Column"] { flex-direction: column; }

  [data-ds="Stack"] { display: grid; grid-template: 1fr / 1fr; }
  [data-ds="Stack"] > * { grid-area: 1 / 1; }

  [data-ds="Grid"] { display: grid; grid-template-columns: repeat(var(--ds-cols, 2), minmax(0, 1fr)); }
  [data-ds="Grid"][data-cols="1"]  { --ds-cols: 1; }
  [data-ds="Grid"][data-cols="2"]  { --ds-cols: 2; }
  /* ...3|4|6|12 */

  /* flow — 의도 하나가 gap + align을 동시에 결정 */
  [data-ds][data-flow="list"]    { gap: ${pad(1)}; align-items: stretch; }
  [data-ds][data-flow="cluster"] { gap: ${pad(2)}; align-items: center; }
  [data-ds][data-flow="form"]    { gap: ${pad(3)}; align-items: stretch; }
  [data-ds][data-flow="prose"]   { gap: ${pad(4)}; align-items: stretch; }
  [data-ds][data-flow="stack"]   { gap: ${pad(6)}; align-items: stretch; }
  [data-ds][data-flow="split"]   { gap: ${pad(3)}; align-items: center; justify-content: space-between; }

  /* emphasis — surface + radius + pad 번들 */
  [data-ds][data-emphasis="raised"]  { ${surface(1)} border-radius: ${pad(2)}; padding: ${pad(4)}; }
  [data-ds][data-emphasis="sunk"]    { background: var(--ds-surface-sunk); border-radius: ${pad(2)}; padding: ${pad(4)}; }
  [data-ds][data-emphasis="callout"] { border: 1px solid var(--ds-accent); border-radius: ${pad(1.5)}; padding: ${pad(4)}; }

  [data-ds][data-grow] { flex: 1 1 auto; min-inline-size: 0; }
`
```

ds/fn의 `pad()`, `surface()` 헬퍼 재사용 — veneer처럼 별도 토큰 시스템(`--s-*`)을 중복 선언하지 않는다.
이게 "ds 고유 제약"의 핵심: **ds는 토큰 이중화를 하지 않는다.**

---

## 6. edu-portal-admin 재작성 (pseudo, 파일 미수정)

### 6.1 Dashboard — KPI grid + chart region (GAP-04)

**Before** (현재, semantic HTML로 조립):

```tsx
<section aria-labelledby="sec-kpi">
  <h2 id="sec-kpi">주요 지표</h2>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
    {kpi.map((k) => (
      <article key={k.id}>
        <dl><dt>{k.label}</dt><dd>{k.value}</dd></dl>
        <p><small>{k.delta}</small></p>
      </article>
    ))}
  </div>
</section>
```

**After** (layout primitive 도입):

```tsx
<Column flow="stack">
  <section aria-labelledby="sec-kpi">
    <h2 id="sec-kpi">주요 지표</h2>
    <Grid cols={5}>
      {kpi.map((k) => (
        <article key={k.id} data-ds="Column" data-flow="list" data-emphasis="raised">
          {/* 또는 <Column flow="list" emphasis="raised">로 감싸되 article semantic 손실 → as prop 부재로 이게 한계 */}
          <dl><dt>{k.label}</dt><dd>{k.value}</dd></dl>
          <p><small>{k.delta}</small></p>
        </article>
      ))}
    </Grid>
  </section>

  <Row flow="split">
    <section aria-labelledby="sec-chart"><h2 id="sec-chart">조회수 추이</h2><figure aria-label="막대 차트 placeholder" /></section>
    <section aria-labelledby="sec-top10"><h2 id="sec-top10">Top 10</h2>{/* ... */}</section>
  </Row>
</Column>
```

**한계 노출**: `<article>`이 "flow=list emphasis=raised"를 원해도 Row/Column은 `<div>`만 렌더한다.
→ 소비자가 `<article data-ds="Column" data-flow="list" data-emphasis="raised">`로 직접 속성을 찍을 수
있어야 하는가? 이는 **"as prop 없이 attrs만 노출"하는 중간 해법** 또는 **전용 Card role 신설**이
필요함을 드러낸다. 본 문서는 **전자(attr-only exposure)를 기각**하고 **2패스에서 Card role 결정**으로 미룸.
1차 범위에서는 `<article><Column>…</Column></article>` 이중 중첩을 감수.

### 6.2 VideoEdit — 좌 폼 + 우 설정 사이드바

**Before**:

```tsx
<form>
  <div style={{ display: 'flex', gap: 24 }}>
    <div style={{ flex: 1 }}>...섹션들...</div>
    <aside style={{ width: 320 }}>...설정...</aside>
  </div>
</form>
```

**After**:

```tsx
<form aria-label="영상 편집">
  <Row flow="stack">
    <Column flow="form" grow>
      <section aria-labelledby="sec-upload">…</section>
      <section aria-labelledby="sec-basic">…</section>
      <section aria-labelledby="sec-desc">…</section>
    </Column>
    <aside>
      <Column flow="form" emphasis="sunk">
        <section>게시 상태</section>
        <section>게시 예약</section>
      </Column>
    </aside>
  </Row>
</form>
```

`<aside>` 의 고정 폭(320px)은 어디로 가는가? → emphasis/flow로는 불가능. 현재 shell/panes.ts가
`aside[aria-roledescription="panel"] { width: var(--ds-panel-w) }` 관행을 쓴다.
**편집용 aside는 새로운 aria-roledescription이 필요**. 본 문서는 `aria-roledescription="sidebar-form"` 같은 관습을
2패스에서 결정할 것으로 미루고, 1차에서는 native width 지정 불가로 **GAP 잔류**로 표기.

---

## 7. 예상 GAP 해소 범위

| GAP ID  | 항목                          | 해소 | 비고                                                          |
| ------- | ----------------------------- | ---- | ------------------------------------------------------------- |
| GAP-01  | Checkbox/CheckboxGroup        | ✗    | role gap. layout과 무관                                       |
| GAP-02  | Drag reorder                  | ✗    | core/axes gap                                                 |
| GAP-03  | Tag/Chip input                | ✗    | role gap                                                      |
| GAP-04  | Stat/KPI card + chart region  | ▲    | Grid cols + emphasis=raised로 카드 나열 해결. **차트 자체는 여전히 별도 gap** |
| GAP-05  | File upload                   | ✗    | role gap                                                      |
| GAP-06  | DataGrid preset               | ✗    | recipe gap (Toolbar+Grid 이미 있음)                           |
| GAP-07  | Textarea                      | ✗    | role gap                                                      |
| GAP-08  | Badge                         | ✗    | 표시용 role(or CSS preset). layout 무관                       |
| GAP-09  | Date input                    | ✗    | role gap                                                      |
| GAP-10  | Field layout                  | △    | `<label>` 직접이 여전히 최선. FieldLayout 전용 role 별도 필요 |
| GAP-11  | Accordion-as-list             | ✗    | Disclosure 반복으로 이미 해소                                 |

**추가 해소 효과**:

- edu-portal-admin 전반에 흩어진 **inline `style={{display:'flex', gap:..}}` 약 30여 개소**가 제거
  가능 — 현재 1패스 코드에서 `rg "style=" src/meta/edu-portal-admin/` 해보면 확인됨
- **새 meta 앱 작성 비용**이 현저히 낮아짐. "div + flex + gap 숫자 선택"이 아니라 "flow 6개 중 하나" 결정

---

## 8. 부작용·리스크

### 8.1 1 role = 1 component 원칙 긴장

- Row와 Column은 축만 다른 flex container. "Row에 direction='column'" 같은 variant는 금지 → 별개 컴포넌트로 2개 유지.
- Radix/Ariakit/Mantine/Chakra 모두 별개 컴포넌트(HStack/VStack, Box+direction 분리). 2곳 이상 수렴.
- **판정**: 원칙 통과. role이 아닌 layout primitive이므로 "1 role = 1 component"는 엄밀히 비적용.

### 8.2 `as` prop 필요성

섹션 6.1의 `<article>` 케이스가 가장 강한 압력. 그러나:

- `as` prop은 **최후 수단** 원칙
- 대안: (a) `<article><Row>...</Row></article>` 이중 중첩 (b) 2패스에서 `Card` role 신설 (c) 소비자가
  `<article data-ds="Row" data-flow="list">` 속성을 직접 찍는 것 허용(문서화)
- **판정**: 1차 범위에선 `as` 미도입. (a) 이중 중첩으로 살아남는지 2패스 전에 모니터링.

### 8.3 CSS 충돌

- `[data-ds][data-flow=...]` 는 매우 일반적 selector. ds/ui의 기존 컴포넌트에 `data-flow` attr이 붙어있지 않은지
  사전 검사 필요. 예비 검색: `rg 'data-flow' src/ds/` → 현재 0건 확인됨.
- Shell의 `panes.ts`가 `aria-roledescription`별로 display:flex를 박는 패턴과 **이중 적용 가능성**. 상호
  점검 필요 (같은 요소에 `data-ds="Row"`와 `aria-roledescription="panel-section"` 동시 적용 시 cascade 순서로
  panes.ts 승리 — shell이 뒤에 있음. 이는 의도된 우선순위).

### 8.4 Responsive 미지원

veneer의 `gap-sm|-md|-lg` 배열을 flow가 대체하지만, "sm에서는 cluster, md부터 split" 같은 의도 전환은
지원 안 됨. 2패스에서 필요성 판정. 극단적으로 `flow={{ base: 'cluster', md: 'split' }}` 객체 prop
허용할지 결정.

---

## 9. 기각된 대안

### 대안 A: "ds는 layout 안 건드리고 소비자가 semantic HTML + inline style로 조립"

**장점**: ds 코드 0 증가. classless·HTML+ARIA only 완벽 유지.

**기각 이유**:

1. edu-portal-admin 1-pass에서 `style={{display:'flex', gap:16}}` 패턴이 30+곳에 중복 — LLM이 매번
   동일 결정을 재수행. "minimize choices" 원칙은 class/컴포넌트가 없다는 뜻이 아니라 **결정 수가 적어야
   한다**는 뜻. div+inline flex는 매번 7가지(direction/gap/align/justify/wrap/padding/grow)를 다시 고르게 함.
2. meta 앱 2개째(inspector 이후 edu-portal-admin)에서 같은 layout 페인 포인트가 반복 — 공통화 신호.
3. inline style은 classless 원칙의 "스타일 전용 class 금지"가 보호하려던 것(DOM 가독성, ARIA 중심성)과
   **동일 문제**를 다시 만든다(class 대신 style 속성이 노이즈).

### 대안 B: veneer Layout을 그대로 포팅 (legacy numeric 포함)

**기각 이유**: 3장의 평가대로 `gap="3"` 스타일이 "minimize choices" 정면 위반. veneer는 a2ui v0.9 JSON 스키마
compatibility 때문에 legacy를 끌고 가지만, ds는 그 제약이 없다.

### 대안 C: `Flex` 단일 컴포넌트 + `direction="row|column"`

**기각 이유 (잠정)**: Row/Column 분리가 de facto. 통합 시 "Flex vs Stack vs Grid" 3개로 줄어 최소 선택지를
만드나, 업계 수렴 패턴 이탈은 LLM 사전학습 가중치에서 Row/Column 선호가 높다는 점 고려해야. 2패스에서
재검토 가능.

---

## 10. 결론 + 2패스 액션 아이템

### 결론

**흡수 YES, 단 semantic meta 축만.** veneer Layout의 **뼈대(data-attr 기반 4-컴포넌트 구조)는 그대로
채택**, **숫자 prop은 전부 제거**, **flow/emphasis 2개 enum으로 선택 공간을 축소**한다. 이는 veneer가 이미 푼
문제(a2ui.css layout layer의 semantic intent rule들)를 그대로 가져오되, ds의 minimize-choices 원칙을 더
엄격히 적용하는 방향이다.

### 2패스 액션 아이템

1. **`src/ds/ui/layout/{Row,Column,Stack,Grid}.tsx` 신설** — 섹션 4.2 시그니처
2. **`src/ds/css/layout.ts` 신설** + `src/ds/index.ts` dsCss 배열에 삽입 — 섹션 5
3. **flow enum 6개 확정** — list/cluster/form/prose/stack/split. edu-portal-admin 재작성 시 **실제로 사용된
   flow만 남기고 미사용 제거**(YAGNI)
4. **emphasis enum 4개 확정** — flat/raised/sunk/callout. `surface()` 헬퍼와 중복 소지 사전 해소
5. **edu-portal-admin 페이지 재작성** — 각 페이지에서 `style={{display:'flex'}}` → `<Row flow=...>` 치환
6. **Card role 채택 판정** — 섹션 6.1의 `<article>` 케이스가 2패스에서 실제 문제로 나타나면 Card 추가
7. **Responsive flow prop 판정** — `flow={{ base, md }}` 객체 지원 필요성 실측

### 남은 의사결정 포인트 3개

1. **`Stack`(Grid overlay) 실제 수요** — edu-portal-admin에 사용처가 있는가? 없으면 1차에서 제거
2. **`emphasis` vs 기존 `surface()` 헬퍼 canonical 판정** — 어느 쪽이 authoritative인지 명시 필요. 병존은
   혼란 유발
3. **Row vs Column 통합 여부** — `Flex direction` 단일 컴포넌트로 줄이면 minimize choices 극단화 달성.
   업계 de facto와는 이탈. 2패스 킥오프에서 최종 결정
