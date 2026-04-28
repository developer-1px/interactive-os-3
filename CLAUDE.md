# Coding rules — read before editing

이 프로젝트는 메모리에 누적된 규약이 많다. 새 페이지·컴포넌트·문서를 만들기 전에 이 체크리스트를 통과해야 한다. **위반은 silent regression — 빌드가 통과해도 위계·접근성·일관성이 깨진다.**

## 기본 자세

- **고민되면 de facto 를 따른다.** 직접 만들기 전 업계 수렴 패턴(Radix·Base·Ariakit·RAC 등 최소 2곳) 부터 본다.
- **하란 것 이상으로 하지 않는다.** 시키지 않은 리팩토링·추가 기능·예방적 추상화 금지.
- **코드 양을 늘리려 하지 않는다.** 있는 것으로 해결 가능하면 있는 것으로. 새 파일·새 어휘·새 wrapper 는 마지막 수단.

## 추구미 — 단 한 줄

> **모든 산출물은 검증 가능한 선언(declaration)이다 — 명령(instruction)이 아니다.**
>
> 자유도는 버그의 표면적이다. 선언으로 묶을 수 있는 것은 전부 선언으로 묶어 LLM이 같은 결과로 수렴하게 한다.

이 한 줄이 아래 7개 invariant 로 펼쳐진다. 모든 규약은 이 중 하나의 면(facet)이다 — 충돌하면 추구미가 이긴다.

| # | Invariant | 한 줄 |
|---|-----------|-------|
| 1 | **Schema-first (zod)** | 새 데이터 형태는 zod schema 먼저, 사용은 그 다음. 타입은 주석이 아니라 런타임 gate. |
| 2 | **Serializable-first** | 페이지·flow·state는 plain object 로 왕복 가능해야 한다. 함수·class·ref 가 들어가면 명령형 잔재. |
| 3 | **One direction** | data → ui → event → reducer → data. 양방향 바인딩·역참조·side channel ❌. |
| 4 | **Hierarchy monotonic (Gestalt)** | 자손은 조상보다 약한 분리. 같은 의미 = 같은 형태. flow prop · hierarchy 토큰만으로 표현. |
| 5 | **Declare, don't assemble (FlatLayout)** | 새 라우트 = `definePage` entities tree. JSX 조립은 escape hatch. |
| 6 | **Vocabulary closed (디자인시스템)** | 어휘는 ds/parts · ui · foundations · icon token 에 닫혀있다. 새 단어는 ds 에 먼저 등재. |
| 7 | **Search before create (있는거 쓰기)** | 만들기 전 grep. 동의어가 있으면 그쪽으로 수렴 — 새로 만들면 동의어 드리프트. |

## 0. 시작 전 30초 체크

| 만들 것 | 먼저 할 일 |
|--------|-----------|
| 새 라우트/페이지 | `definePage` (FlatLayout) 로 만든다. JSX 조립 ❌ |
| 새 콘텐츠 부품 | `packages/ds/src/parts/` 먼저 grep — 있으면 그걸 쓴다 |
| 새 ui 부품 | `packages/ds/src/ui/<tier>/` 먼저 grep |
| 레이아웃 (간격·정렬) | `Row/Column/Grid` + `flow` prop. raw `<div>` ❌ |
| 표/리스트/카드 | `Table` (비교) · `Listbox/Tree` (관리) · `Card Grid` (시각 브라우징) |
| 아이콘 | `<span data-icon="<token>" />`. 이모지·특수기호 ❌ |
| 폼 필드 | `Field/Input/Select/Checkbox` ui. raw `<input>` 은 escape hatch |

## 1. 레이아웃 — FlatLayout이 canonical

**ds 프로젝트의 레이아웃은 `definePage` + `Renderer` 가 정본이다.** Row/Column/Grid 를 JSX 로 조립하는 건 임시 — 새 페이지는 entities tree 로 작성한다.

```tsx
// ✅ canonical
import { Renderer, definePage, ROOT } from '@p/ds'

export function MyPage() {
  return <Renderer page={definePage({
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page:   { id: 'page', data: { type: 'Column', flow: 'form' } },
      sec1:   { id: 'sec1', data: { type: 'Section', heading: { content: 'State' } } },
      // ...
    },
    relationships: { [ROOT]: ['page'], page: ['sec1', 'sec2'], ... },
  })} />
}
```

**레퍼런스**: `apps/edu-portal-admin/src/pages/Dashboard.tsx`. 노드 타입은 `packages/ds/src/layout/nodes.ts` (Row/Column/Grid/Section/Header/Footer/Aside/Ui/Text). 등록된 Ui 컴포넌트는 `registry.ts`. 등록 안 된 ReactNode 는 `{ type: 'Ui', component: 'Block', content: <…/> }` 로 끼운다 (escape hatch 정당).

## 2. Gestalt 위계 = recursive Proximity

같은 위계는 같은 gap, 다른 위계는 다른 gap. **flow prop 으로 자동 적용된다 — 직접 padding/margin/gap CSS 쓰지 말 것.**

| flow | gap | 용도 |
|------|-----|-----|
| `cluster` | pad(2) | chip 줄·툴바·legend |
| `list`    | pad(1) | 같은 위계 형제 (row↔row) |
| `form`    | pad(3) | 폼 그룹·section↔section |
| `prose`   | pad(4) | 페이지 root·문서 흐름 |
| `split`   | pad(3) | space-between (header) |

위계 토큰 (`foundations/spacing/hierarchy.ts`): atom < group < section < surface < shell. **단조 증가 invariant** — 자손이 조상보다 큰 분리를 가지면 위계가 깨진다.

라우트 추가 시 `audit-hmi` 또는 `keyline-loop` 으로 invariant 체크.

## 3. 부품 재사용 — 만들기 전에 찾는다

새 부품을 만들기 전 반드시 검색:

```bash
ls packages/ds/src/parts/      # Card·Table·KeyValue·Heading·Tag·Code·Callout·Badge·Avatar·Thumbnail·Skeleton·EmptyState·Breadcrumb·Progress·Link·Timestamp
ls packages/ds/src/ui/         # 0-primitives · 1-status · 2-action · 3-input · 4-selection · 5-display · 6-overlay · 7-patterns · 8-layout
```

Memory: "있는 ds 부품으로 조립" — Card·Heading·KeyValue·Code·Tag 등 parts에서 먼저 찾는다. raw `<dl>·<button>·<table>` 또는 custom CSS 손으로 만들지 말 것.

## 4. 금지 패턴 (자주 위반됨)

| ❌ 금지 | ✅ 대안 |
|--------|--------|
| `<div data-grid="...">·data-section="..."` 등 임의 namespace | `data-ds="Row\|Column\|Grid"` 만 허용. 의미 그룹은 Section/Aside 노드 |
| `style={{ padding, gap, margin }}` 인라인 | `flow` prop + hierarchy 토큰 |
| raw `role="button"` 등 escape hatch | 해당 role 의 ui 컴포넌트를 만들어서 쓴다. `as` prop 은 최후 수단 |
| 이모지·특수기호 인디케이터 (✅·🟢·★) | `data-icon="<token>"` |
| ghost 약화에 `opacity` | semantic 색 (text subtle) |
| `aria-roledescription` 을 셀렉터 namespace 로 | `data-part="<name>"` 사용 |
| `*.style.ts` 안 `[data-part="x"]` 셀렉터 + 부품 전용 CSS hook | `data-part` 는 namespace 일 뿐 — 부품 독립 어휘 ❌. 표현은 ARIA-* / semantic token 합성으로. 부족하면 토큰 먼저 등록. 신규 `data-part` 이름 도입은 baseline 갱신 명시 (`pnpm lint:ds:data-part --update-baseline`) |
| `useMemo·useCallback` | 등장하면 SRP 실패 신호 — 책임 경계 재설계 (`/srp`) |
| Stylesheet class 추가 | classless — tag + role + ARIA 셀렉터만 |
| ui prop 으로 children JSX | data 주도: `(data, onEvent)` 단일 인터페이스 |

## 5. 색·토큰

**레이어 폴더 분리** (palette re-export ❌):
- raw scale (인자=숫자): `from '@p/ds/tokens/palette'` — `pad`, `neutral`, `elev`, `tint`, `mix`, `dim`, `level`, `rowPadding`, `emStep`, `insetStep`
- semantic role (인자=slot/role 이름): `from '@p/ds/tokens/foundations'` — `text`, `surface`, `border`, `accent`, `font`, `weight`, `radius`, `slot`, `proximity`, ...

widget 은 semantic 우선. raw 가 필요하면 *명시적으로* palette 에서 import (의도 표시). foundations 는 raw 를 re-export 하지 않는다 — 두 layer 가 import 경로로 분리.

color pair 는 surface 소유자만 (item 이 자기 색을 선언 ❌).

## 6. 반응형 경계

- viewport·해상도 분기는 **CSS 만**. JS matchMedia 훅 ❌
- shell·control 은 desktop·mobile **별도 구현** (CSS 로 reshape ❌)
- Grid 같은 컨텐츠만 reflow

## 7. data·flow

- 데이터 read/write 는 `useResource` 단일 인터페이스 `(value, dispatch(event))`
- ui ↔ resource 연결은 `defineFlow` + `useFlow` 한 줄. resource.onEvent 가 intent 라우터 흡수
- Content vs Control 무조건 분리 — 비즈니스 콘텐츠는 entity 로 (사용처 1곳이어도 승격)

## 8. 문서·파일 규약

- inbox 문서: `docs/YYYY/YYYY-MM/YYYY-MM-DD/NN_{slug}.md` (NN = 그 날 max+1, zero-padded)
- 새 라우트 = 새 파일 (`packages/app/src/routes/<path>.tsx`). router.tsx 수정 ❌
- staticData.palette 로 cmd+k 자동 등록

## 9. 검증 — 페이지 만들고 끝낼 때

1. `npx tsc -b --noEmit` — 타입
2. `pnpm lint:ds:all` — 정적 규약 (data-ds 위반·raw role·인라인 style 등)
3. dev 서버에서 preview snapshot — 콘솔 에러 0
4. `audit-hmi` / `keyline-loop` — 위계·정렬 단조성

## 10. 참조

- 메모리 (모든 규약 SSoT): `~/.claude/projects/-Users-user-Desktop-ds/memory/MEMORY.md`
- canonical 선언서: `CANONICAL.md`
- ui tier 라벨: canvas LANE_LABEL (Primitives·Status·Action·Input·Selection·Display·Overlay·Patterns·Layout)
- ds parts 셀렉터 namespace: `data-part="<name>"`

**원칙**: minimize choices for LLM — 1 role = 1 component, variant 금지, prop 이름은 ARIA 그대로. 꼼수 대신 항상 de facto 표준 (Radix·Base·Ariakit·RAC 최소 2곳 수렴 패턴).
