---
id: q18CrossCuttingConcerns
type: inbox
slug: q18CrossCuttingConcerns
title: Q18 — dark mode·i18n·고대비 같은 cross-cutting concerns는?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q18 — dark mode·i18n·고대비 같은 cross-cutting concerns는?

## 질문

dark mode·국제화·고대비 접근성 같은 cross-cutting concerns는 어떻게?

## 해보니까 알게 된 것

세 개가 같은 답이 아니다. 각각 다른 layer에서 흡수된다.

### dark mode
**foundations semantic token**으로 흡수. palette(raw gray N)는 그대로 두고 semantic(text/surface/border)가 `[data-theme="dark"]` 셀렉터로 다시 매핑된다. 컴포넌트는 mode를 모른다(10_whyNoVariant Q3). variant prop이 아니다 — **컴포넌트는 1개 형태, CSS 토큰만 다르다**.

이건 실제로 동작한다. `foundations/color/semantic.ts`가 단일 진입점이고 컴포넌트는 `var(--text)` 같은 이름만 본다.

### 고대비
같은 메커니즘 — semantic token tier에 highContrast 변형 추가. `prefers-contrast: more` 미디어 쿼리로 자동 swap. 모바일 분기 정본(CSS only)과 같은 길이다.

### i18n
이건 좀 다르다. i18n은 **콘텐츠 레이어**의 문제이지 시각 토큰 문제가 아니다.
- 텍스트는 entity의 data로 들어간다 (콘텐츠 vs 컨트롤 분리)
- entity 안의 라벨이 i18n key를 가지고, route boundary에서 resolve
- RTL은 CSS logical property(`margin-inline-start` 등)로 흡수, JS 분기 없음
- 다만 ds 코드베이스 안에서 i18n을 본격적으로 돌려본 라우트는 거의 없다 — "원칙상 이렇다"이지 검증된 패턴은 아님

세 cross-cutting 모두 **"컴포넌트가 모르는 곳"**에서 처리된다는 게 공통점이다. 이게 직렬화·선언성 필터의 결과다 — 컴포넌트가 mode·locale·contrast를 prop으로 받기 시작하면 variant 폭증이 시작된다.

## 근거

- /Users/user/Desktop/ds/src/ds/foundations/color/semantic.ts (dark/light semantic 매핑 진입점)
- /Users/user/Desktop/ds/src/ds/foundations/color/pair.ts
- /Users/user/Desktop/ds/CANONICAL.md:84 (palette → foundations 2층, widget은 semantic만)
- 메모리 — feedback_responsive_content_only / feedback_mobile_js_boundary (CSS-only 분기 원칙)

## 남은 의문

- i18n을 entity data에 박는 게 정본인지, 별도 layer(@p/capability-i18n?)인지 미합의
- 고대비는 dark mode와 직교 축이라 semantic token이 2D matrix가 된다 — token 이름이 폭증할 수 있는데 ds는 이걸 어떻게 구조적으로 막는지 아직 명시 안 됨
