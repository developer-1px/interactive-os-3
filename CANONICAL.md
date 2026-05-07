# CANONICAL — ds 프로젝트 정본 매뉴얼

> 이 문서는 `/canonical` 스킬이 Phase 0에서 자동 로드한다.
>
> **원칙**: 극단적 선언적 직렬화 (Extreme Declarative Serialization)
>
> 모든 정본은 다음 두 조건을 만족해야 한다:
> 1. **선언적** — 형태가 데이터로 기술 가능해야 한다 (명령형 절차 X)
> 2. **직렬화 가능** — JSON/문자열로 왕복(round-trip) 가능해야 한다
>
> 이 두 조건을 만족하면 시간(저장·복원)·공간(이관·공유)·도구(검증·생성·diff)를 가로질러 재현 가능하다. 못 만족하는 표현은 정본이 될 수 없다.

---

## 정본 헌장 (불변 원칙)

| # | 원칙 | 의미 |
|---|------|------|
| C1 | **데이터가 곧 UI** | UI = f(data). 컴포넌트 children에 비즈니스 콘텐츠 JSX 금지 — `data` prop으로 |
| C2 | **상태는 직렬화 가능** | useState 값은 JSON.stringify 가능해야 한다. DOM·함수·Promise를 상태에 두지 않는다 |
| C3 | **분기는 데이터 룩업** | switch/if 체인 → 선언적 map. 실행 시점이 아닌 정의 시점에 결정 가능해야 한다 |
| C4 | **명령형은 경계로** | DOM·네트워크·시간 같은 부작용은 `@p/aria-kernel` 또는 resource로 격리. widget·route는 선언만 |
| C5 | **이름이 곧 계약 경계** | 앱/LLM authored className 금지. DS 내부 generated class가 component root를 소유하고, tag + role + aria + data-slot은 그 경계 안에서만 셀렉트한다 |
| C6 | **정본 ≠ 이상형** | 코드에 한 곳도 안 쓰이는 형태를 정본으로 못 박지 않는다 |

---

## 정본 선언 (영역별)

각 항목 형식: `<영역>: <한 줄 정의> · 임시: <만료 조건> · 유산: <마이그레이션 대상>`

### 레이아웃
- **앱 레이아웃**: `definePage` entities tree + Renderer · 임시: Row/Column/Grid JSX 조립 (이유 명기 시) · 유산: 직접 flexbox 조립
- **레이아웃 셀렉터 namespace**: `data-ds="Row|Column|Grid"`만 허용 · 임시: 없음 · 유산: 그 외 data-ds
- **반응형 분기**: CSS only (viewport·입력장치·해상도) · 임시: 없음 · 유산: matchMedia 훅, JS swipe, IO sync

### 컴포넌트 인터페이스
- **ui/ role 인터페이스**: `ControlProps(data, onEvent)` 데이터 주도 · 임시: 없음 · 유산: children JSX prop
- **gesture/intent**: ui/는 activate 단발 emit, navigate/expand는 `@p/aria-kernel/gesture` 헬퍼 · 임시: 없음 · 유산: 컴포넌트 내부 onKeyDown 분기
- **DOM 활성화**: JSX-children 스타일(TreeRow·GridCell 등) 요소의 클릭+Enter/Space 처리는 `activateProps(onActivate)` 헬퍼로 단일화 · 임시: 없음 · 유산: 콜사이트의 onClick + onKeyDown 키 분기
- **roving**: 내부 self-attach (composeAxes 내장) · 임시: 없음 · 유산: 소비자 onKeyDown
- **role=row 그룹**: `useRovingDOM` itemSelector='[role="row"]' 명시 · 임시: 없음 · 유산: 기본 TABBABLE 사용

### 데이터 흐름
- **데이터 read/write 인터페이스**: `useResource → (value, dispatch(event))` 단일 인터페이스 · 임시: 없음 · 유산: 종류별 훅
- **ui ↔ resource 연결**: `defineFlow` 1조각 + `useFlow` 한 줄. resource.onEvent가 intent 라우터 흡수 · 임시: 없음 · 유산: 컴포넌트 안의 직접 fetch/dispatch
- **상태 직렬화**: 모든 useState는 JSON 직렬화 가능. DOM ref·함수·Promise 보관 금지 · 임시: 없음
- **이벤트 어휘 (UiEvent)**: `@p/aria-kernel/src/types.ts` `UiEvent` discriminated union 이 SSOT. axis(논리 네비)→resolveIntent(축↔UiEvent)→reducer(상태) 3-layer 통과. select 는 `{ids, to?}` 단일 — `to` undefined ⇒ replace, true ⇒ additive, false ⇒ unset. 단수 `select{id}`·별도 `selectMany` 폐기. AxisIntent(`treeStep`·`pageStep`·`expandSeed`)는 UiEvent 가 아니라 resolveIntent 통과로 풀린다 — emits/handles 가 UiEvent type literal 자리에 AxisIntent 키를 섞어 쓰면 정본 위반 · 임시: 없음 · 유산: 단수 `select{id}`, `selectMany`, AxisIntent 의 UiEvent 누설
- **Step A 키보드 보편 액션**: selectAll(Cmd+A)·selectNone(Esc)·selectRange(Shift+Arrow/Click)·focus·sort·filter·find(Cmd+F)·save(Cmd+S)·commit(Enter)·revert(Esc-edit)·duplicate(Cmd+D) 는 UiEvent 정본에 직접 등장. host reducer 가 의미 부여 — 어휘는 aria-kernel 이 정의, 효과는 host 가 결정 · 임시: 없음 · 유산: 앱 안에서 키 → 도메인 액션 직접 dispatch

### 콘텐츠
- **콘텐츠 vs 컨트롤**: 비즈니스 콘텐츠는 entity로 분리 (사용처 1곳이어도 entity 승격) · 임시: 없음 · 유산: route 안 인라인 콘텐츠 JSX
- **content widget**: DS 부품 조합 + root 1곳 className(카탈로그). 서브파트 이름 금지 · 임시: 없음
- **신뢰된 HTML payload entity**: 외부 라이브러리가 HTML 문자열로 내놓는 결과(마크다운·코드 하이라이트 등)는 명명된 entity 안에서만 `dangerouslySetInnerHTML`을 사용한다. 정본 entity 위치: `src/ds/ui/0-primitive/` (`Prose`, `CodeBlock`). 라우트·widget이 직접 호출 금지 · 임시: 없음 · 유산: route 안 직접 dangerouslySetInnerHTML

### 셀렉터·스타일
- **셀렉터 어휘**: DS generated class(root ownership) + tag + role + aria + data-slot · 임시: 시연/카탈로그 라우트 본문의 raw role · 유산: 앱/LLM authored className, 전역 tag/role/data-part 부품 셀렉터
- **data-part**: 디버그/계약 표식. 스타일 소유권은 `defineStyleContract()` generated class가 가진다 · 임시: 없음 · 유산: aria-roledescription 또는 data-part를 namespace/style owner로 쓰는 곳
- **색**: semantic token만 import. palette gray N 직접 X · 임시: foundations 내부 정의 · 유산: 컴포넌트가 palette 직접 import
- **색 weight·opacity**: surface 소유자만 색 보유. item은 mute()/emphasize() · 임시: 없음 · 유산: cell-level color: dim(N)

### 컬렉션
- **컬렉션 표시**: Table(비교)·List(관리)·Card Grid(시각 브라우징) 3패턴 분류 자체가 정본 · 임시: 없음
- **카드 변형**: ds/parts/Card 슬롯 + 부모 Grid subgrid · 임시: 없음 · 유산: 카드별 커스텀 layout

### 슬라이드 (md PPT)
- **마크다운→슬라이드 분할**: 줄 단독 `^---$` 1개 = 슬라이드 경계 (Marpit / Slidev / Deckset 수렴 표준). `splitMarkdown(path, text): Deck` 정본 함수는 `apps/slides/src/features/split.ts` · 임시: 없음 · 유산: 없음

### 라우팅
- **라우트 정의**: TanStack file-based (src/routes/<path>.tsx) · 임시: 없음 · 유산: router.tsx 직접 수정
- **cmd+k 등록**: staticData.palette · 임시: 없음 · 유산: 별도 등록 코드

### 패키지·플러그인
- **패키지 우선 구조**: pnpm workspace 모노레포. 제품 의의는 ARIA/headless behavior와 검증 인프라 패키지(`@p/aria-kernel` 중심)다. `apps/<X>`와 `showcase/<X>`는 독립 제품이 아니라 패키지를 소비자 관점에서 검사하는 쇼케이스·검증 harness다 · 임시: 없음 · 유산: 앱 구현 안에 재사용 behavior/API를 숨기는 구조
- **디자인 컴포넌트 소유권**: visual component·brand/theme·디자인 토큰 제품 방향성은 이 repo가 아니라 `aria-design-system`이 맡는다. 이 repo의 `@p/ds`는 기존 검증/호환 표면으로만 취급한다 · 임시: 없음 · 유산: `@p/ds`를 디자인 컴포넌트 제품으로 확장하는 구조
- **검증 앱 내부 구조 (FSD)**: 큰 apps/<X>/src/는 실제 사용 시나리오 검증을 위해 FSD 레이어로 분할 가능 — `entities/`(zod schema·types·헬퍼) · `features/`(feature·resources·data·nav 도메인 흐름) · `widgets/`(composite UI 컴포넌트·hook) · 선택 `<variant>/`(mobile 등) · 루트 `index.ts·plugin.ts·style.ts`. 단, 재사용 가능한 계약은 apps가 아니라 `packages/*`에 둔다 · 임시: 작은 검증 앱(파일 ≤ 5개)은 평탄 유지 — 분할 비용 > 이익 · 유산: 큰 앱(>10 파일)이 평탄 분포로 책임 혼재
- **쇼케이스 내부 구조**: showcase/<X>/src/는 보통 평탄 (단일 검증 표면). 큰 시연만 1개 서브폴더(`samples/`·`sections/`·`pages/`·`demos/` 중 의미 정확한 것 1개) · 임시: 없음 · 유산: 한 패키지 안에 같은 종류 서브폴더 2개
- **Plugin manifest**: 패키지마다 `definePlugin({ name, routes?, widgets?, middlewares?, capabilities? })`를 default export. schemas·resources·features는 패키지 내부 detail이라 manifest 등록 대상 아님 · 임시: 없음 · 유산: 라우트가 다른 라우트의 내부에 직접 import (markdown→finder/data 등)
- **Plugin 합산 시점**: 빌드 타임 정적 — `app/plugins.ts`가 정적 import 배열로 모든 manifest를 모음. `composeRegistry(plugins)`가 ds.uiRegistry merge·middleware chain 정렬·capability map 생성을 import 시점 부작용으로 수행 · 임시: 없음 · 유산: 런타임 register() 호출
- **Middleware**: 파이프라인 훅은 `defineMiddleware({ name, phase, fn })` 정본. phase는 `pre-dispatch`(기존 gestures와 등가) · `post-dispatch` · `pre-resource-read` · `post-resource-write` · 임시: 기존 `defineFlow.gestures`는 pre-dispatch 특수 케이스로 흡수됨 — 시그니처 호환 유지 · 유산: 컴포넌트 안의 dispatch 가로채기

### 도메인 엔티티
- **엔티티 정의**: `z.object({...})` 스키마로 선언하고 타입은 `z.infer<typeof X>`로 도출. 스키마 파일은 라우트/도메인 옆 `schema.ts` · 임시: (a) aria-kernel 내부 ARIA·DOM prop 타입(`@p/aria-kernel/src/types.ts`) — 만료 조건: 외부 입력 자리에 닿을 때 zod 승격, (b) 내부 reducer 통신용 discriminated union(Cmd·VM) — 만료 조건: URL/스토리지/네트워크 경계 노출 시 zod 승격 · 유산: `routes/*/types.ts`의 도메인 type/interface
- **외부 데이터 진입점**: 외부에서 들어오는 entity는 boundary에서 `Schema.parse(raw)`로 검증 (virtual·fetch·storage·라우트 파라미터 등) · 임시: 없음 · 유산: 진입 지점에서 검증 없이 `as FsNode` 같은 cast

### 네이밍·구조
- **컴포넌트 명명**: Trigger/GroupLabel/Submenu*/TabPanel 별도 export. Radix·Base·Ariakit·RAC 최소 2곳 수렴 시 채택 · 임시: 없음
- **prop 이름**: ARIA 그대로. 인위적 통일 금지 · 임시: 없음
- **escape hatch**: raw `role="..."` 0개 · 임시: 시연/카탈로그 라우트 본문 · 유산: `as` prop (최후 수단)

### ds 검증/호환 레이어 (직교 2축 구조)

> `@p/ds`는 이 repo의 디자인 컴포넌트 제품 방향이 아니다. 남아 있는 시각·토큰·role 컴포넌트 코드는 ARIA/headless 계약을 검증하기 위한 호환 표면이며, 새 디자인 컴포넌트 제품화는 `aria-design-system` 소유다.

`packages/ds/src/` 의 레이어는 단일 사다리가 아니라 **Visual 축(V) · Behavior 축(B) 직교**다. 두 축은 서로를 import 하지 않으며, `ui/` 에서 처음 합류한다. 실측 의존도(2026-04-27)로 검증됨.

```
  V축 (Visual — 값·CSS)              B축 (Behavior — DOM·키보드·상태)
  ─────────────────────              ─────────────────────────────
  V0  tokens/palette/                B0  headless/
       └─► foundations/                  (axes·state·layout·
            └─► style/                    hooks·feature)
  V1  style/widgets/                     · 0 deps, 완전 pure ⭐
  ─────────────────────              ─────────────────────────────
                    \                /
                     ▼              ▼
              C0  ui/  (V + B 합류 — role 컴포넌트)
                       0-primitives · 1-status · 2-action · 3-input ·
                       4-selection · 5-display · 6-overlay · 8-layout ·
                       parts · patterns · recipes
                    │
                    ▼
              C1  content/  (도메인 widget — ui 위)
                    │
                    ▼
              C2  devices/  (mock frame — V만 사용)
                    │
                    ▼
              R   registry · index · data · plugin · widgets.styles
                    (조립 — 전 레이어 import)
```

- **V·B 직교**: V → B 또는 B → V import 0건이 invariant. 위반 시 직교 깨짐.
- **headless 0 deps**: tokens조차 import 하지 않는다. "엔진은 시각을 모른다"가 정본.
- **합류는 ui/ 에서만**: V·B 둘을 동시에 보는 첫 지점. content/devices/registry 는 그 위.
- **단조 흐름**: V축·B축 → ui → content → registry. 역방향(아래→위) 0건이 invariant.
- **content > ui**: content/ 가 ui/ 위. ui/ 가 content/ 를 import 하면 위반.

#### 토큰 (V축 세부)
- **토큰 계층**: palette(raw scale) → foundations(semantic role/slot/mixin) → style(preset/seed/shell/states) 3층. widget은 semantic 이상만 import · 임시: 없음
- **토큰 변수명 경계**: system-facing CSS 변수는 `--ds-*`가 정본. LLM-facing 공개 subset은 preset 출력에서 `--color-bg-*`·`--color-text-*`·`--color-border-*`·`--color-action-*`·`--color-state-*`·`--space-*`·`--radius-*`·`--shadow-*`·`--focus-*`·`--size-*`·`--z-*`·`--duration-*`·`--ease-*` alias로만 노출한다. alias의 의미 값은 `--ds-*` 그래프에서 파생하고, `0`·`50%` 같은 CSS 기하 상수만 예외다. component-specific token은 만들지 않는다 · 임시: 없음
- **위계 토큰**: foundations/layout/hierarchy.ts atom < section < surface < shell 5단 (Gestalt sys layer) · 임시: 없음

#### 알려진 일탈 (수렴 대상)
- ui/ → content/ 역방향 import 2건 (실측 2026-04-27). 위치 특정 후 ui→content 승격 또는 content→ui 강등으로 해소 · 유산: ui 안의 도메인 wording

### 문서
- **inbox 문서 폴더**: `docs/YYYY-MM-DD/` = 사건 발생 날짜 (작성일 X) · 임시: 없음

---

## 정본 갱신 절차

1. 반례 발견 (정본으로 표현 부족) → Phase 1 회귀
2. 후보 평가 (de facto·직렬화·선언성·단순성·확장)
3. 사용자 합의 → 매뉴얼 1행 갱신 + 변경 일자 기록
4. 일탈 감사 재실행 → 수렴 또는 임시/유산 분류

## 일탈 감사 명령

```
/canonical <영역명>     # 해당 영역 일탈만 감사
/canonical              # 매뉴얼 전체 항목 순회
```

## 변경 이력

- 2026-04-26 · 초기 정리 (메모리 + 헌장 통합)
- 2026-04-26 · 콘텐츠/HTML payload 정본 갱신: entity(`Prose`·`CodeBlock`) 격리 패턴으로 명문화. finder/Preview.tsx 일탈 2건 수렴
- 2026-04-26 · finder 일탈 4건 수렴: query를 feature.state로 승격, raw `role="search"` 제거(SearchBox 자체로 표현), `activateProps` 헬퍼 신설 후 ListView 키/클릭 단일화
- 2026-04-26 · 도메인 엔티티 정본 채택: zod schema → z.infer. 시드 마이그레이션 — finder/schema.ts 신설(FsNode·SidebarItem·SmartGroupId·SmartGroupItem·TagGroupItem·ViewMode·PreviewKind 7종), virtual:fs-tree 진입점에 `FsNodeSchema.parse` 적용
- 2026-04-26 · 모노레포·plugin manifest 정본 채택 (Phase A.0): pnpm-workspace.yaml 신설, `@p/*` path alias, `definePlugin`·`defineMiddleware` contract 신설(src/ds/plugin.ts·core/middleware.ts), `app/plugins.ts`·`app/registry.ts` 신설, main.tsx에 `composeRegistry(plugins)` 부팅 합산 — 파일 이동(Phase A.1)은 후속
- 2026-04-26 · Phase A.1 파일 이동 완료: src/ds → packages/ds/src, src/{main,router,routeTree.gen,index.css,app,routes,devtools,assets} → packages/app/src/. 80개 파일의 ../ds 류 상대 import을 @p/ds로 일괄 alias 전환. vite alias·tsconfig path·tanstackRouter routesDirectory·scripts/ 하드코드 모두 재타깃. src/ 폴더 제거. tsc 0에러 + vite build 통과
- 2026-04-26 · 카테고리 분리: packages/{ds·app·fs·devtools} 4개, apps/{edu-portal-admin·finder·genres·markdown} 4개, showcase/{catalog·content·ds-matrix·foundations·inspector·keyboard·playground·theme} 8개. m.finder를 finder/mobile로 흡수. @p/fs로 fs source layer 격리(loadText·tagIndex·frontmatter·highlight·FsNode). finder의 router 의존을 setFinderNav inversion으로 해소
- 2026-04-27 · ds 패키지 레이어 정본 채택 — 직교 2축(Visual·Behavior) 구조 선언. 실측 의존도로 검증: headless 0 deps(완전 pure), V·B 상호 import 0건, content > ui 단조. 기존 "토큰" 섹션을 "ds 패키지 레이어" 하위로 흡수. 알려진 일탈 1종 등록(ui→content 역방향 2건)
- 2026-04-26 · FSD 정본 채택 — 큰 앱에 entities/features/widgets 레이어 적용. 시드: apps/finder (entities: schema·types · features: feature·resources·data·nav · widgets: 7 components + useSidebarNav + mobile/). apps/edu-portal-admin도 entities/widgets + pages 유지로 적용
- 2026-04-27 · slides 정본 채택: apps/slides 신설 (FSD). 슬라이드 분할 정본 = 줄 단독 `^---$` 1개 (Marpit/Slidev/Deckset 3곳 수렴). `splitMarkdown`/`SlideSchema`/`DeckSchema` 시드. 라우트 /slides/$, finder Sidebar 재사용, Prose entity로 슬라이드 본문 격리, 키 ←→/PgUp PgDn/Space/Home/End 네비
- 2026-05-02 · 프로젝트 방향 전환 정본화: repo 제품은 `packages/*` 라이브러리, `apps/*`와 `showcase/*`는 패키지 검증용 소비자 쇼케이스로 재정의. 재사용 가능한 behavior/API는 앱 안에 숨기지 않고 패키지에 둔다.
- 2026-05-02 · 디자인 컴포넌트 방향성 제거: visual component·brand/theme·디자인 토큰 제품화는 `aria-design-system` 소유. 이 repo의 `@p/ds`는 ARIA/headless 검증/호환 표면으로 격하.
- 2026-05-08 · UiEvent 어휘 SSOT 갱신: select/selectMany 분기 폐지 → `select{ids,to?}` 1축으로 통합(`to` undefined ⇒ replace). Step A 키보드 보편 액션 11종(selectAll/None/Range/focus/sort/filter/find/save/commit/revert/duplicate) 정본 등재 — host reducer 가 의미 부여. AxisIntent(treeStep/pageStep/expandSeed) 와 UiEvent 의 분리를 명문화. 수렴 완료: aria-kernel 내부 axes/multiSelect·gridMultiSelect·state/reduce·state/handles·state/check·gesture·emits 옛 어휘 마이그레이션 — 모노레포 tsc 0에러.
- 2026-05-08 · 명명 갱신(SSOT): 매뉴얼 안 `ds/core` 표기를 `@p/aria-kernel` 로 정정 — C4·gesture/intent·엔티티 정의 임시 (a) 3곳. 패키지 분리(2026-04-26) 이후 잔존한 표기 일탈.
