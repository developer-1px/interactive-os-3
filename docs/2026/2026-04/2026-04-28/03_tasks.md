---
type: task
status: completed
tags: [design-system, canvas, gap-fix, plan]
---

# Canvas Industry Standard Gap — 보완 작업 계획

## Context

[`docs/2026/2026-04/2026-04-28/02_canvas-vs-industry-vocabulary-comparison.md`](docs/2026/2026-04/2026-04-28/02_canvas-vs-industry-vocabulary-comparison.md)에서 우리 캔버스 DOM과 업계 표준(M3·Carbon·Polaris·Radix·Tailwind·DTCG) 어휘를 비교하여 갭을 찾음. 의식적 비표준은 유지하고 **누락된 표준 카테고리**만 보완한다.

### 비교 결과 (DOM 재검증 후)

| Gap | 진단 | 결론 |
|-----|------|------|
| L0 Tokens 컬럼이 Theme creator만 있음 | DOM 재확인 결과 palette-groups 안에 Color/Elevation/Type Scale/Spacing 모두 존재. **false alarm** | NO-OP |
| sizing 카테고리 누락 (width/height/icon-size) | 표준 (Tailwind size · M3 size). 우리는 control-h 정도 외 별도 어휘 없음 | 🟡 보완 필요 |
| z-index 카테고리 누락 (dropdown/sticky/overlay/modal/tooltip) | 표준. 우리는 z-index 토큰 없음 | 🟢 신규 추가 |
| opacity 카테고리 누락 (disabled/scrim/overlay) | 표준. 우리는 opacity 누적을 막기로 함 → semantic 색으로 대체 중. 다만 scrim/overlay는 별도 토큰이 표준 | 🟢 신규 추가 |
| breakpoint이 layout 안에 흡수 | foundations/layout/breakpoints.ts 존재하지만 별도 lane 아님. Tailwind/M3는 **별도** | 🟡 분리 |
| border가 shape 안에 부분 (hairline만) | shape/hairline.ts에만. width/style scale 없음 | 🟡 별도 lane으로 격상 |
| focus-ring 별도 토큰 없음 | preset.focusRingWidth만. Carbon/Polaris는 별도 lane | 🟢 신규 추가 |
| Selection·Display·Overlay가 L3 | fs-driven (`ui/4-selection` → n≥4 → L3). 표준은 atoms = primitives 레벨 | 🔴 OUT OF SCOPE — 별도 spec |
| L5 Devices · L1.5 빈 Component tokens · TS function 토큰 · Control/State foundation lane | 의식적 비표준 | NO-OP — 유지 |

## Tasks (순차 적용)

- [x] Task 1 — z-index foundation lane 🟢
- [x] Task 2 — opacity foundation lane 🟢
- [x] Task 3 — focus-ring foundation lane 🟢
- [x] Task 4 — sizing palette + foundation 🟡
- [x] Task 5 — breakpoint foundation lane 격상 🟡
- [x] Task 6 — border foundation lane (hairline 분리) 🟡 — `borderWidth` · `borderStyle` 추가, hairline 셀렉터 mixin은 shape에 그대로 (라우트 호환)

각 task 끝마다 `npx tsc -b --noEmit` + `pnpm lint:ds:all` + /canvas screenshot.

## Out of scope

- **Selection/Display/Overlay → L2**: lanes.ts `bucketOf` fs-driven. 폴더명 prefix 변경(`ui/4-selection` → `ui/3-selection`) + 모든 import 경로 마이그레이션 → 별도 spec.
