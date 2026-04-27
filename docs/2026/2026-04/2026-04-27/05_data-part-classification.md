---
title: data-part 분류 — atom(aria/html) vs part(namespace) vs misuse
type: inbox
status: open
date: 2026-04-27
tags: [data-part, lint, refactor-plan, ds, classification]
---

# data-part 70개 분류 — atom / part / misuse

baseline 135 signatures = 70 distinct names. invariant 기준으로 분류한다.

## 분류 기준

| 카테고리 | 정의 | 조치 |
|---------|------|------|
| **A. ATOM** (aria/html) | 단일 native HTML tag 또는 ARIA role 로 환원 가능 | `data-part` 제거 → `tag[role=…]` 셀렉터로 마이그레이션 |
| **P. PART** (namespace 정당) | 합성 부품, 단일 ARIA role 없음, ds 어휘 합성으로 만들어짐 | 유지. 단 `*.style.ts` 안 raw 값은 토큰 환원 필수 |
| **L. LAYOUT MISUSE** | layout primitive 영역 (`data-ds="Row\|Column\|Grid"`) 침범 | `data-ds` + `flow` prop 으로 이동 |
| **S. SCREEN MISUSE** | 페이지/라우트 스코프 — 부품 아님 | 라우트 파일로 이동, data-part 제거 |
| **D. DEVICE** | `ds/devices/` layer 의 sub-anatomy — 별도 PART 군 | 유지하되 devices/ 안에 격리 (이미 분리됨) |

---

## A. ATOM — 환원 대상 (24개)

| 이름 | 환원 셀렉터 | 비고 |
|------|------------|------|
| `body` | `[data-slot="body"]` | data-slot 영역 |
| `breadcrumb` | `nav[aria-label="breadcrumb"]` | ARIA APG 표준 |
| `callout` | `aside` 또는 `[role="note"]` | |
| `code` | `code` | native |
| `field` | `label` 또는 form control wrapper | |
| `fieldset` | `fieldset` | native |
| `heading` | `h1`–`h6` 또는 `[role="heading"]` | data-level 은 슬롯 |
| `kbd` | `kbd` | native |
| `key-value` | `dl > dt + dd` | native |
| `legend-dot` | `[role="presentation"]` 장식 | atom-level cosmetic |
| `link` | `a` | native |
| `progress` | `progress` 또는 `[role="progressbar"]` | native |
| `table` | `table` | native |
| `tag` | `output` 또는 `span[aria-label]` | 용도 검토 후 PART 승격 가능 |
| `text-divider` | `hr` + `aria-label` | |
| `thumbnail` | `img` 또는 `figure > img` | |
| `actions` | `menu` 또는 `[role="group"]` | Button.style.ts 안 |
| `danger` | `data-tone="danger"` | tone 슬롯 — Button.style.ts |
| `roving-item` | ARIA mechanism (focus 패턴) | data-part 가 아니라 동작. lib 위치로 이동 |
| `frame` | `figure` 또는 `[role="presentation"]` | canvas frame |
| `frame-label` | `figcaption` | |
| `frames` | `[role="list"]` | 컨테이너 |
| `avatar` | `img` widget — 경계선 (P 가능) | 단순 img wrap 이면 ATOM, badge 합성이면 PART |
| `badge` | `output` widget — 경계선 (P 가능) | count badge 의미 가지면 PART |

→ 24개 중 22개는 명백 ATOM. `avatar`·`badge` 는 합성 정도에 따라 PART 승격 후보.

---

## P. PART — 유지 (12개, namespace 정당)

| 이름 | 합성 근거 |
|------|----------|
| `bar-chart` | dl + meter + figcaption 합성, 단일 ARIA 없음 |
| `card` | article + slot 패턴, generic container |
| `carousel` | section + slide + roving |
| `empty-state` | 아이콘 + heading + action 합성 |
| `floating-nav` | aside + menu + route grid |
| `oauth-row` | 공급자 버튼 row |
| `otp-row` | 자릿수 input 합성 |
| `popover` | popover API + anchor + content |
| `top-10` | ranked ol + 순위 visual |
| `orderable` | ol + drag handle + button |
| `skeleton` | loading placeholder, ARIA 없음 |
| `slide` | carousel sub-part |
| `window-controls` | os chrome 버튼 묶음 |

→ 13개. 단 모두 `*.style.ts` 안 raw 값(px·hex) 환원 검사 별도 진행 필요 (BarChart 가 대표 위반).

---

## L. LAYOUT MISUSE — `data-ds` 로 이동 (5개)

| 이름 | 정본 |
|------|------|
| `column` | `data-ds="Column"` |
| `columns` | `data-ds="Row"` (자식 column) |
| `row-split` | `data-ds="Row" data-flow="split"` |
| `sidebar` | `data-ds="Column"` + ds shell role |
| `route-grid` | `data-ds="Grid"` |

→ 5개. CLAUDE.md §4 "data-ds 는 layout primitive 전용" 와 일치.

---

## S. SCREEN MISUSE — 라우트로 이동 (10개)

| 이름 | 위치 |
|------|------|
| `board-page` | route file |
| `board-nav` | route file 내부 |
| `board-posts` | route file 내부 |
| `board-stream` | route file 내부 |
| `chat-page` | route file |
| `feed-page` | route file |
| `shop-page` | route file |
| `post-cont` | route file |
| `canvas` | canvas 라우트 |
| `canvas-family` | canvas 라우트 sub |

→ 10개. data-part 는 ds/parts 어휘를 위한 namespace 인데, 라우트가 자기 이름을 박은 것. 라우트 파일 안 className 또는 ARIA section 으로 환원.

---

## D. DEVICE — 격리 유지 (16개)

| 이름 |
|------|
| `phone`, `phone-frame`, `phone-screen`, `phone-body`, `phone-notch`, `phone-home` |
| `phone-status`, `phone-topbar`, `phone-topbar-lead`, `phone-topbar-title`, `phone-topbar-trail` |
| `phone-tabbar`, `phone-tab` |
| `phone-time`, `phone-battery`, `phone-wifi`, `phone-signal`, `phone-signals` |

→ 16개. `ds/devices/` layer 한정. memory `project_devices_layer.md` 와 일치 — phone 은 mock device frame 의 anatomy 로 단일 ARIA 없음. **devices namespace 한정 PART** 로 승인. baseline 영구 등록.

---

## 재정밀화 (2026-04-27 1차 환원 후)

ATOM 후보 11건 정밀 검토 결과 — 단순 1:1 native 환원 외에는 PART 또는 차원 불일치(L)로 재분류.

| 원분류 | 이름 | 재분류 | 근거 |
|--------|------|--------|------|
| ATOM | `actions` | **PART (slot pattern)** | "그룹 첫 자식 button = primary CTA" 의미 캡슐화 |
| ATOM | `danger` | **L (tone misuse)** | `data-tone="danger"` 가 정본. 차원 자체 오류 |
| ATOM | `legend-dot` | **PART** | 색 dot + 4-tone 합성 widget, ARIA 등가 없음 |
| ATOM | `thumbnail` | **PART** | 합성 micro-widget |
| ATOM | `avatar` | **PART** | 합성 micro-widget (badge 합성 가능) |
| ATOM | `badge` | **PART** | count badge widget, output role 약함 |
| ATOM | `tag` | **PART** | chip widget, ARIA 등가 없음 |
| ATOM | `frame` / `frames` / `frame-label` | **S (showcase scope)** | 라우트 자산 |
| ATOM | `text-divider` | **ATOM ✅** | `<div role="separator">` 이미 사용 중 → `[role="separator"]` |

→ 진짜 ATOM 은 줄어들고 PART 가 늘어남. 다음 환원은 의미 차원 검토 필수.

## 환원 진행 (2026-04-27)

| 배치 | 환원 | 잔여 baseline |
|------|------|--------------|
| 시작 | — | 135 |
| 1차: code, kbd, link, progress, table, key-value, fieldset | -14 | 121 |
| 2차: text-divider | -1 | 120 |

## 요약 (분포)

| 카테고리 | 개수 | 비율 |
|---------|------|------|
| A. ATOM (환원) | 24 | 34% |
| P. PART (유지) | 13 | 19% |
| L. LAYOUT MISUSE | 5 | 7% |
| S. SCREEN MISUSE | 10 | 14% |
| D. DEVICE (격리 PART) | 16 | 23% |
| **(경계선 avatar/badge)** | (2 above) | — |
| **합계** | 70 | 100% |

→ **39개 (A 24 + L 5 + S 10) 가 invariant 위반 — 환원/이동 대상.**
→ **29개 (P 13 + D 16) 가 정당한 PART** — 유지하되 raw CSS 값 환원 검사 별도.

## 다음 단계 후보

1. **A 환원 PR** — 24 ATOM 을 tag/role 셀렉터로 마이그레이션. 각 부품 1-PR (`Heading.style.ts` → `[role="heading"]` 등). lint baseline 자동 축소
2. **L 환원 PR** — 5 LAYOUT 을 `data-ds` 로 이동. `lint:ds:invariants` 가 잡아주는지 별도 체크
3. **S 환원 PR** — 10 SCREEN 부품을 라우트 내부로 흡수. 가장 단순
4. **P 부품 raw CSS 감사** — 13개 PART 의 `*.style.ts` 안 px/hex 환원 (BarChart 등)
5. **avatar / badge 경계선 결정** — 합성도 검토 후 ATOM vs PART 확정

우선순위 제안: **3 (S) → 2 (L) → 1 (A) → 4 (P)** — 변경 비용 작은 것부터.
