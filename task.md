# task — de facto vocab gap fill

> 발견 경로: `/guess` 로 css 중복 인사이트 추적 → "함수로 묶을 다발"의 정체가 *어휘 누락*이라는 결론 → ds 어휘 인벤토리 vs Radix·Ariakit·RAC·Material·Polaris·MUI·Atlassian 교차 → ds 부재 + 3곳 이상 수렴 어휘 10개.

## 원칙 (각 컴포넌트 공통 contract)

1. **Schema-first** — props 타입 명시. `(data, onEvent)` 단일 인터페이스 가능한 곳은 그쪽으로.
2. **Vocabulary closed** — 이름·prop 은 ARIA / de facto 그대로 (Radix·Ariakit 우선). 새 단어 짓지 않음.
3. **Classless** — class 금지. `data-part="<name>"` namespace + ARIA 속성 셀렉터.
4. **Token only** — palette raw 는 명시 import, 의미는 foundations.
5. **Sibling files** — `Foo.tsx + Foo.style.ts` 동거. 배럴 ❌.
6. **No escape hatches** — raw `role="..."` 사용처 대신 컴포넌트로 흡수.

## 진행 순서 (의존성 + 단순한 것부터)

| # | 컴포넌트 | tier | de facto | 의존 |
|---|---------|------|---------|------|
| 1 | Spinner | 1-status | Material CircularProgress · Radix · RAC · Polaris | — |
| 2 | ButtonGroup | 2-action | Material · Polaris · Bootstrap · Chakra | Button |
| 3 | ToggleButton / ToggleGroup | 2-action | Radix Toggle · Ariakit · RAC ToggleButton | Button |
| 4 | SegmentedControl | 4-selection | Material · Polaris · Apple HIG | roving |
| 5 | AvatarGroup | parts | Material · Polaris · Atlassian · Chakra | Avatar |
| 6 | MediaObject | parts | Bootstrap · Material List · Atlassian | Avatar / Thumbnail |
| 7 | Pagination | 5-display | Material · Polaris · Ant · Atlassian | Button |
| 8 | Stepper | 5-display | Material · Polaris · Ant · Atlassian | — |
| 9 | Accordion | 6-overlay | Radix · Ariakit · RAC · Material | Disclosure |
| 10 | Toast | 6-overlay | Radix · Sonner · RAC · Material · Polaris | Dialog 시스템 참고 |

## 산출물 contract (각 컴포넌트)

- `packages/ds/src/ui/<tier>/<Name>.tsx`
- `packages/ds/src/ui/<tier>/<Name>.style.ts` — `export const css<Name> = () => css\`...\``
- `src/css.ts` 또는 `ui/parts/styles.ts` 의 segments 에 등록
- `src/index.ts` 에 `export * from './ui/<tier>/<Name>'`
- (Ui 노드로 쓸 거라면) `src/registry.ts` 에 매핑 추가
- (캔버스 카탈로그 노출이 필요하면) 같은 폴더 `_demos/` 에 demo 파일

## verify

- `npx tsc -b --noEmit` 통과
- `pnpm lint:ds:all` 통과 (data-part baseline 갱신 필요시 명시)
- canvas 라우트에서 시각 확인

## 메모

- "MediaObject" — content/PostCard·FeedPost 의 grid-template-areas 패턴 흡수가 후속 PR. 이번 PR 은 어휘만 신설.
- "Toast" — provider + queue + portal 시스템 필요. 가장 무거움. 작은 surface API 부터.
- "Accordion" — Disclosure 의 group container 어휘. Disclosure 자체는 그대로 유지.
