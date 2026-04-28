---
type: task
status: in-progress
tags: [design-system, tokens, foundations, ocp, renderer-dispatch]
---

# /tokens · /foundations — 속성 기반 Renderer Dispatch (OCP)

## Context

오늘 03_tasks 1~6 으로 foundation lane 6개(z-index·opacity·focus-ring·sizing·breakpoint·border) 신규. 현 `/tokens` 740줄(`showcase/playground/src/tokens.tsx`)은 7개 카테고리 hard-coded JSX → 신규 lane 마다 페이지 본체 수정 필요 = OCP 위반. 04_research 에서 본 M3·Polaris·Carbon 패턴(대표=시각, 나머지=표) 을 dispatch 골격으로 추상화.

두 페이지가 **같은 dispatch 패턴, 다른 SSOT 소스**:

| 페이지 | SSOT | enumerate | 대표 카테고리 | ETC |
|--------|------|-----------|--------------|-----|
| /tokens | `:root --ds-*` | `getComputedStyle` 런타임 | color · typography · spacing · radius · elevation · motion · container | name prefix unmatched |
| /foundations | `foundations/*` TS export | 빌드타임 module enumerate | mixin · helper · scale | typeof unmatched |

OCP 자리: `categorize` prefix 표 + `rendererRegistry`. 신규 lane = 두 파일 1줄씩 append. 메인 entry 는 닫혀 있음.

## 아키텍처

```
showcase/playground/src/tokens/        ← 디렉토리로 승격
  index.tsx              <Tokens/> entry — enumerate → group → render
  categorize.ts          (varName) => CategoryKey | 'etc'  longest-prefix match
  enumerate.ts           getComputedStyle(:root) → [{name,value}]
  renderers/
    color.tsx            기존 ColorSwatchGrid·SemanticPairs 승격
    typography.tsx       기존 TypeSpecimen
    spacing.tsx          기존 SpacingDemo
    radius.tsx           기존 RadiusMorph
    elevation.tsx        기존 ElevationStack
    motion.tsx           기존 MotionTrigger
    container.tsx        기존 ContainerBars
    index.ts             rendererRegistry: Record<CategoryKey, FC<{tokens}>>
  EtcTable.tsx           parts/Table — name·value·computed 표

showcase/playground/src/foundations/   ← 신규
  index.tsx              <Foundations/> entry — module enumerate → group → render
  categorize.ts          (exportName, value) => 'mixin' | 'helper' | 'scale' | 'etc'
  enumerate.ts           import * as F from '@p/ds/tokens/foundations' → entries
  renderers/
    mixin.tsx            CSS mixin (hairline·focusRing) — selector 데모
    helper.tsx           함수 (mix·dim·level) — input/output 표
    scale.tsx            scale record (text·radius) — 키 → 값 표
    index.ts             rendererRegistry
  EtcTable.tsx
```

dispatch 의사코드:
```ts
const tokens = enumerate()
const buckets = groupBy(tokens, t => categorize(t))
return entries(buckets).map(([cat, items]) =>
  <Section heading={cat}>
    {cat in registry ? createElement(registry[cat], {tokens: items}) : <EtcTable tokens={items}/>}
  </Section>
)
```

## Critical files

- `showcase/playground/src/tokens.tsx` (740줄) → 디렉토리 + 분해 (이동, 로직 재작성 ❌)
- `packages/app/src/routes/tokens.tsx` — entry 그대로 (`Tokens` re-export 경로 호환 유지)
- `packages/app/src/routes/foundations.tsx` (신규) — `<Foundations/>` mount
- `packages/ds/src/tokens/foundations/index.ts` — barrel `import * as F` 가능 검증
- `packages/ds/src/parts/Table.tsx` (재사용) · `parts/Section` · `parts/Heading` · `parts/Code` · `parts/KeyValue` · `parts/Tag`

## 제약 (CLAUDE.md)

- `:root --ds-*` SSOT — 수동 매핑 ❌
- classless · `data-ds="Row|Column|Grid"` 만
- raw `<table>` ❌ — `parts/Table` 사용
- 기존 7개 메타포 컴포넌트 *이동* 만, 로직 재작성 ❌
- `data-part="<name>"` 은 namespace, 부품 전용 CSS hook ❌

## 메모리 정합

- `project_canvas_route_absorbs_catalogs` — /canvas 흡수 정책 ≠ /tokens·/foundations. /tokens 는 정성 페이지로 이미 예외 명시. /foundations 는 *과거 흡수된 자동 카탈로그* 와 다른 *함수형 SSOT viewer* — 신규 라우트 정당
- `project_palette_vs_foundations` — palette(raw scale CSS) ↔ foundations(TS semantic) 2층과 페이지 분담 1:1 정합
- `feedback_minimize_choices_for_llm` — 두 페이지 동일 dispatch 패턴 = 선택 최소화

## Tasks

- [ ] T1. /tokens 디렉토리화 + enumerate.ts·categorize.ts 분리
- [ ] T2. 기존 7 메타포 → renderers/*.tsx 이동, rendererRegistry 정의
- [ ] T3. EtcTable — parts/Table 기반 generic name/value 표
- [ ] T4. <Tokens/> = registry 순회 + EtcTable. routes/tokens.tsx 호환 확인
- [ ] T5. /foundations 디렉토리 신규 — enumerate (module reflection) + categorize (typeof)
- [ ] T6. mixin·helper·scale 3 renderer + EtcTable
- [ ] T7. routes/foundations.tsx 신규. staticData.palette 등록
- [ ] T8. 검증: `npx tsc -b --noEmit` + `pnpm lint:ds:all` + dev server preview snapshot 두 페이지 콘솔 0 에러

## 부작용 처리

- prefix 충돌 (`--ds-color-bg` vs `--ds-bg`) → longest-first matching
- 함수형 export → /foundations 가 흡수 (별도 영역)
- `--ds-*` 가 아닌 var (예: `--ds-leading-*` 도 prefix `leading`) → categorize 표에 누락 시 자동 ETC 로 빠짐 = 안전망 작동
