---
id: finderMobileTikTokDesignThink
type: decision
slug: finderMobileTikTokDesignThink
title: /m/finder/* — TikTok full-screen redesign
tags: [design-think, ux, ui, mobile, finder]
created: 2026-04-25
updated: 2026-04-25
status: open
layer: design
---

## 이해 표

| # | Decision | Content | Score |
|---|---|---|---|
| 1 | Job | 폴더에 들어왔을 때 형제 파일들을 한 장씩 풀스크린으로 빠르게 훑고, 다음/이전으로 vertical swipe 한다. | 🟢 90% |
| 2 | Context | 모바일 (iPhone safe-area), 한 손, 세로, 빠른 swipe. /m/finder/$path drill-down 후 file 진입 시 진입 | 🟢 85% |
| 3 | Content | 파일명 1–40ch · 종류 1–5ch · 경로 5–80ch · 크기 0.1KB–10MB · 수정일 timestamp · Preview body(텍스트/이미지/markdown/코드) | 🟢 80% |
| 4 | Priority | 1st: Preview body(콘텐츠) · 2nd: 파일명(어디 있는지) · 3rd: 종류·크기·수정일·경로 | 🟢 90% |
| 5 | Scan | TikTok pattern — 1 file = 1 viewport, vertical snap | 🟢 95% |
| 6 | Layout | Layer 0: Preview(전 화면 배경) · Layer 1: top overlay(back + 파일명) · Layer 2: bottom overlay(메타) · Layer 3(옵션): right edge action | 🟢 85% |
| 7 | Hierarchy | L1 Preview body(가장 큼) · L2 파일명 strong(top overlay) · L3 종류/크기/수정일 small muted(bottom overlay) · L4 back ghost icon | 🟢 80% |
| 8 | Component | 기존 FilesSwiper 유지(scroll-snap canonical) · Preview 100svh 채움 · header→fixed overlay(top) · meta→fixed overlay(bottom) · safe-area inset 사용 | 🟢 85% |
| 9 | States | 빈 폴더: Empty · 코드/이미지/MD/큰 파일 분기는 Preview가 이미 처리 · loading: aria-busy | 🟡 70% |
| 10 | Interaction | vertical swipe(snap mandatory) · top-left back tap · scroll-snap-stop: always | 🟢 85% |
| 11 | Density | 모바일 only · 100svh · safe-area-inset-top/bottom | 🟢 90% |
| 12 | Visual contract | (1) Preview는 viewport 전체 채움 (2) overlay 배경은 mask gradient로 콘텐츠와 분리 (3) 파일명 truncate (4) 어떤 Preview라도 z-stack 깨지지 않음 | 🟢 80% |
| 13 | Critique | Squint test: Preview만 보이면 OK · 메타가 콘텐츠 위에서 가독되려면 mask gradient 필요 · 텍스트/코드 Preview는 자체 스크롤이 vertical swipe와 충돌 가능 — 한 카드 안에서만 스크롤되도록 contain | 🟡 65% |

## 1. Job
폴더 안에서 파일을 미리보고 다음/이전으로 swipe — TikTok 식 풀스크린 vertical browser. 데스크톱 finder와 다른 모바일 전용 UX (이미 분리되어 있음).

## 4. Information priority
1. Preview body — 사용자가 보러 온 이유
2. 파일명 — 어디 있는지 자기 위치 확인
3. 종류·크기·수정일 — 부가 메타
4. 경로 — 가장 약하게 (이미 navigation으로 들어왔다)

## 6. Layout skeleton
```
┌─────────────────┐  ← top overlay (mask gradient)
│ ‹  파일명       │
├─────────────────┤
│                 │
│   Preview body  │  Layer 0 (전체)
│   (스크롤 contained) │
│                 │
├─────────────────┤
│ ext · size · day│  ← bottom overlay (mask gradient)
└─────────────────┘
```

## 8. Component choice
- 기존 `FilesSwiper` 유지 — `scroll-snap-type: y mandatory` 이미 canonical
- `<article>` 안의 `Preview` 자체가 풀-블리드로 채우도록 css 강화
- header를 sticky → `position: fixed` overlay로 (article 안에서 floating)
- bottom meta는 `<aside>` overlay로
- safe-area: `env(safe-area-inset-top/bottom)`

## 12. Visual contract (측정 가능 규칙)
- 각 article의 Preview body는 `block-size: 100svh` 정확히 채움
- top overlay z-index ≥ 1, height ≤ 64px + safe-area-top
- bottom overlay z-index ≥ 1, height ≤ 56px + safe-area-bottom
- 파일명 1줄 truncate
- Preview pre / article은 `overscroll-behavior: contain` — 카드 안 스크롤이 swiper로 누수되지 않음

## Axis mapping
| Decision | → 구현 |
|---|---|
| L1 Preview body | `<article>` block-size 100svh, overflow contained |
| L2 파일명 | top overlay strong, mask gradient bg |
| L3 메타 | bottom overlay small, mask gradient bg |
| L4 back | top overlay ghost icon button |
| safe-area | `env(safe-area-inset-*)` |
| swipe canonical | `scroll-snap-type: y mandatory; scroll-snap-stop: always` (이미 적용됨) |
