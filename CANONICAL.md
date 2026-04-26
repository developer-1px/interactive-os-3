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
| C4 | **명령형은 경계로** | DOM·네트워크·시간 같은 부작용은 ds/core 또는 resource로 격리. widget·route는 선언만 |
| C5 | **이름이 곧 셀렉터** | 스타일 전용 className 금지. tag + role + aria + data-part로 셀렉트한다 |
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
- **gesture/intent**: ui/는 activate 단발 emit, navigate/expand는 ds/core/gesture 헬퍼 · 임시: 없음 · 유산: 컴포넌트 내부 onKeyDown 분기
- **DOM 활성화**: JSX-children 스타일(TreeRow·GridCell 등) 요소의 클릭+Enter/Space 처리는 `activateProps(onActivate)` 헬퍼로 단일화 · 임시: 없음 · 유산: 콜사이트의 onClick + onKeyDown 키 분기
- **roving**: 내부 self-attach (composeAxes 내장) · 임시: 없음 · 유산: 소비자 onKeyDown
- **role=row 그룹**: `useRovingDOM` itemSelector='[role="row"]' 명시 · 임시: 없음 · 유산: 기본 TABBABLE 사용

### 데이터 흐름
- **데이터 read/write 인터페이스**: `useResource → (value, dispatch(event))` 단일 인터페이스 · 임시: 없음 · 유산: 종류별 훅
- **ui ↔ resource 연결**: `defineFlow` 1조각 + `useFlow` 한 줄. resource.onEvent가 intent 라우터 흡수 · 임시: 없음 · 유산: 컴포넌트 안의 직접 fetch/dispatch
- **상태 직렬화**: 모든 useState는 JSON 직렬화 가능. DOM ref·함수·Promise 보관 금지 · 임시: 없음

### 콘텐츠
- **콘텐츠 vs 컨트롤**: 비즈니스 콘텐츠는 entity로 분리 (사용처 1곳이어도 entity 승격) · 임시: 없음 · 유산: route 안 인라인 콘텐츠 JSX
- **content widget**: DS 부품 조합 + root 1곳 className(카탈로그). 서브파트 이름 금지 · 임시: 없음
- **신뢰된 HTML payload entity**: 외부 라이브러리가 HTML 문자열로 내놓는 결과(마크다운·코드 하이라이트 등)는 명명된 entity 안에서만 `dangerouslySetInnerHTML`을 사용한다. 정본 entity 위치: `src/ds/ui/0-primitive/` (`Prose`, `CodeBlock`). 라우트·widget이 직접 호출 금지 · 임시: 없음 · 유산: route 안 직접 dangerouslySetInnerHTML

### 셀렉터·스타일
- **셀렉터 어휘**: tag + role + aria + data-part · 임시: 시연/카탈로그 라우트 본문의 raw role · 유산: 스타일 전용 className
- **data-part**: content 부품 어휘 (src/ds/parts/) · 임시: 없음 · 유산: aria-roledescription을 namespace로 쓰는 곳
- **색**: semantic token만 import. palette gray N 직접 X · 임시: foundations 내부 정의 · 유산: 컴포넌트가 palette 직접 import
- **색 weight·opacity**: surface 소유자만 색 보유. item은 mute()/emphasize() · 임시: 없음 · 유산: cell-level color: dim(N)

### 컬렉션
- **컬렉션 표시**: Table(비교)·List(관리)·Card Grid(시각 브라우징) 3패턴 분류 자체가 정본 · 임시: 없음
- **카드 변형**: ds/parts/Card 슬롯 + 부모 Grid subgrid · 임시: 없음 · 유산: 카드별 커스텀 layout

### 라우팅
- **라우트 정의**: TanStack file-based (src/routes/<path>.tsx) · 임시: 없음 · 유산: router.tsx 직접 수정
- **cmd+k 등록**: staticData.palette · 임시: 없음 · 유산: 별도 등록 코드

### 패키지·플러그인
- **패키지 구조**: pnpm workspace 모노레포. 단위는 `@p/ds`(디자인 시스템 · `packages/ds/`) · `@p/app`(셸 — main·router·routes·devtools·assets · `packages/app/`) · `@p/domain-<area>`(도메인 — schema·feature·resource·data·widgets·routes 묶음 · 도입 예정) · `@p/capability-<name>`(편집·조작 capability — clipboard·history·focus·cursor·rename·crud · 도입 예정) · 임시: 도메인·capability는 아직 `packages/app/src/routes/<area>` 안에 평탄 분포 (만료 조건: Phase B에서 domain-finder 시드 분리) · 유산: 라우트가 다른 라우트의 내부 모듈에 직접 import
- **Plugin manifest**: 패키지마다 `definePlugin({ name, routes?, widgets?, middlewares?, capabilities? })`를 default export. schemas·resources·features는 패키지 내부 detail이라 manifest 등록 대상 아님 · 임시: 없음 · 유산: 라우트가 다른 라우트의 내부에 직접 import (markdown→finder/data 등)
- **Plugin 합산 시점**: 빌드 타임 정적 — `app/plugins.ts`가 정적 import 배열로 모든 manifest를 모음. `composeRegistry(plugins)`가 ds.uiRegistry merge·middleware chain 정렬·capability map 생성을 import 시점 부작용으로 수행 · 임시: 없음 · 유산: 런타임 register() 호출
- **Middleware**: 파이프라인 훅은 `defineMiddleware({ name, phase, fn })` 정본. phase는 `pre-dispatch`(기존 gestures와 등가) · `post-dispatch` · `pre-resource-read` · `post-resource-write` · 임시: 기존 `defineFlow.gestures`는 pre-dispatch 특수 케이스로 흡수됨 — 시그니처 호환 유지 · 유산: 컴포넌트 안의 dispatch 가로채기

### 도메인 엔티티
- **엔티티 정의**: `z.object({...})` 스키마로 선언하고 타입은 `z.infer<typeof X>`로 도출. 스키마 파일은 라우트/도메인 옆 `schema.ts` · 임시: (a) DS 내부 ARIA·DOM prop 타입(ds/core/types.ts) — 만료 조건: 외부 입력 자리에 닿을 때 zod 승격, (b) 내부 reducer 통신용 discriminated union(Cmd·VM) — 만료 조건: URL/스토리지/네트워크 경계 노출 시 zod 승격 · 유산: `routes/*/types.ts`의 도메인 type/interface
- **외부 데이터 진입점**: 외부에서 들어오는 entity는 boundary에서 `Schema.parse(raw)`로 검증 (virtual·fetch·storage·라우트 파라미터 등) · 임시: 없음 · 유산: 진입 지점에서 검증 없이 `as FsNode` 같은 cast

### 네이밍·구조
- **컴포넌트 명명**: Trigger/GroupLabel/Submenu*/TabPanel 별도 export. Radix·Base·Ariakit·RAC 최소 2곳 수렴 시 채택 · 임시: 없음
- **prop 이름**: ARIA 그대로. 인위적 통일 금지 · 임시: 없음
- **escape hatch**: raw `role="..."` 0개 · 임시: 시연/카탈로그 라우트 본문 · 유산: `as` prop (최후 수단)

### 토큰
- **토큰 계층**: palette(raw scale) → foundations(semantic role/slot/mixin) 2층. widget은 semantic만 import · 임시: 없음
- **위계**: foundations/layout/hierarchy.ts atom < section < surface < shell 5단 (Gestalt sys layer) · 임시: 없음

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
