---
type: inbox
status: unconsumed
tags: [design-system, canvas, vocabulary, gap-audit]
---

# 우리 캔버스 vs 업계 표준 — 어휘 비교

## 1. Token tier 분류

| 업계 표준 (M3·Adobe·Carbon) | 우리 (DOM에서 읽음) | 차이 |
|---|---|---|
| primitive / reference / raw | **L0 Tokens** (Theme creator만) | ✅ 일치하지만 컬럼 안에 1개 섹션뿐 — palette 본문(color/spacing/elev/font 등)이 어디로 갔는지 불명 |
| semantic / system / alias | **L1 Foundations** (Color/Control/Elevation/Iconography/Layout/Motion/Shape/Spacing/State/Typography 10개) | ✅ 정합 |
| component / scoped | **L1.5 Component tokens** (0 sections, intentionally empty) | ⚠️ 명시적 빈 컬럼 — Radix/Base 노선 표명. M3·Adobe는 채우는 게 표준이지만 비우는 것도 valid 선택 |

🔴 **갭**: L0 Tokens에 Theme creator만 있고 palette raw scale(color ramp/spacing stack/elev tower/type scale)이 안 보임. 산업 표준은 raw scale도 primitive tier에 노출. **Type Scale은 추가했지만 다른 palette가 컬럼에 묶이지 않은 것 같음** — PaletteSection의 Color/Elevation/Spacing 등이 별개 column section으로 안 잡힘.

## 2. Component classification

| 업계 표준 (Atomic Design + lane) | 우리 | 차이 |
|---|---|---|
| atoms · molecules · organisms · templates · pages | L2 Primitives · L3 Patterns · L4 Templates · L5 Devices | ✅ 동등 어휘. "atoms→Primitives", "organisms→Patterns" 매핑. **L5 Devices**는 우리 고유 — 업계엔 없음 (mock frame 별 layer) |
| primitives / status / action / input / selection / display / overlay / navigation / layout | Primitives(L2) 안에 Primitives · Status · Action · Input · Parts · Layout | ⚠️ **Selection · Display · Overlay 가 Patterns(L3)에 가있음** — 업계 표준은 이들도 atoms 레벨. 우리는 file structure(`ui/<tier>`)로 lane 강제했지만 "Selection은 L3 합성"이라는 분류는 비표준 |
| navigation lane | 우리는 별도 navigation 없음 → Sidebar는 **Devices(L5)**에 | ⚠️ Sidebar/Breadcrumb/Stepper 같은 navigation은 L3 또는 L4가 표준. devices에 들어간 건 우리 고유 |

🔴 **갭**: 
- **Selection · Display · Overlay**가 Patterns(L3)으로 분류된 건 비표준 (Radix/RAC는 atoms primitive로 본다)
- **Devices(L5)**는 업계에 없는 우리 고유 lane

## 3. Token category (Foundations 10개 vs 업계 13개)

| 업계 표준 | 우리 Foundations | 차이 |
|---|---|---|
| color | ✅ Color | |
| typography | ✅ Typography | |
| spacing | ✅ Spacing | |
| sizing | ❌ 없음 | 🔴 width/height/icon-size 별도 카테고리가 표준 (Tailwind size scale, M3 size) |
| radius / shape | ✅ Shape | |
| elevation | ✅ Elevation | |
| motion | ✅ Motion | |
| iconography | ✅ Iconography | |
| breakpoint | ❌ Layout 안에? | 🔴 Tailwind/Material는 별도. 우리는 Layout에 묶음 |
| z-index | ❌ 없음 | 🔴 표준 카테고리 |
| opacity | ❌ 없음 | 🔴 표준 카테고리 (disabled/scrim) |
| border | ❌ Shape 안? | ⚠️ 표준은 별도 |
| focus ring | ❌ 없음 | ⚠️ Carbon/Polaris는 별도 |
| **Control** | ✅ 우리 고유 | 🟡 우리만 — control-h/box/indicator. 업계엔 없는 카테고리 |
| **State** | ✅ 우리 고유 | 🟡 보통 typography나 component에 흡수. 우리는 별도 lane으로 명시 |
| **Layout** | ✅ container/listReset/square | 🟡 보통 spacing+breakpoint 합집합. 우리는 별도 |

🔴 **갭**: **sizing · z-index · opacity · breakpoint · border** 5개 표준 카테고리 누락. 우리는 **Control · State · Layout** 3개를 추가 — 보편 어휘에 없음.

## 4. Token tier 어휘 (우리 vs DTCG)

| W3C DTCG 표준 | 우리 | 차이 |
|---|---|---|
| `$value` `$type` `$description` `$extensions` | ❌ 안 씀 | 🔴 우리는 TS export 함수 (`pad(2)`, `text('strong')`) — DTCG JSON 형식 ❌. import/export 호환 안 됨 |
| reference syntax `{color.brand.primary}` | CSS var (`var(--ds-text-strong)`) | ⚠️ 표준 syntax는 JSON path 참조. 우리는 CSS var |

🟡 **고유**: TS function 기반 토큰은 type-safe + IDE 자동완성 + tree-shake. DTCG JSON은 변환 도구(Style Dictionary 등) 필요. 우리는 빌드타임 합성으로 갔다는 의식적 선택 — 비표준이지만 명시적.

## 5. Component anatomy

| 업계 (Radix/RAC/HeadlessUI) | 우리 | 차이 |
|---|---|---|
| `Trigger`, `Content`, `Group`, `Label`, `Indicator`, `Item`, `Separator`, `Portal`, `Slot` | TBD (DOM에서 직접 못 읽음) | 메모리에 따르면 우리도 같은 어휘 (Trigger/GroupLabel/Submenu*/TabPanel) → **2곳 이상 수렴 시 채택** 정책. ✅ 정합 |
| `data-state` (open/closed/checked) | ✅ data-* 속성 | ARIA 속성도 그대로 셀렉터로 사용 |

## 6. 가장 큰 비표준 (의식적 선택)

| 항목 | 우리 | 표준 | 의도 |
|---|---|---|---|
| **L5 Devices** lane | Phone/Mobile frame mock | 없음 | 카탈로그 시연용 별도 layer (`ds/devices/`) — `parts·ui와 시각 무게 차이로 lane 섞이면 위계 깨짐` 메모리 |
| **L1.5 Component tokens 빈 컬럼** | 명시적 빈 표시 | M3는 채움 | "Radix/Base 노선" 의식적 선언 |
| **Foundations에 Control · State · Layout** | 별도 카테고리 | 표준엔 없음 (다른 카테고리에 흡수) | DS 본 lane 어휘 — `foundations/<domain>/` 폴더 = 토큰 도메인 |
| **fs-driven SSoT** | `ui/0-primitives/` 폴더 위치 = lane | 업계는 manifest/registry | "lanes.ts의 bucketOf/labelOf/orderOf가 fs에서 자동 도출" |

## 정리 — 우선 보완 후보

🔴 **표준 vs 우리 차이**가 의식적 결정이 아닌 **누락**으로 보이는 것:
1. **L0 Tokens 컬럼이 Theme creator만 — palette(color/spacing/elev/typography) 본문 누락** — 가장 큰 갭
2. **sizing · z-index · opacity · breakpoint · border** 토큰 카테고리 누락
3. **Selection · Display · Overlay**가 Patterns(L3)에 있는 것 — atoms 레벨이 표준

🟡 **우리 고유 — 의식적 선택**:
- L5 Devices · L1.5 빈 Component tokens · fs-driven lane · Control/State/Layout foundation lane · TS function 토큰
