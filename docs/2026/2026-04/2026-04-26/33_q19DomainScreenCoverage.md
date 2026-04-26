---
id: q19DomainScreenCoverage
type: inbox
slug: q19DomainScreenCoverage
title: Q19 — 캘린더·차트·코드 에디터 같은 도메인 화면은 정본이 어디까지?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q19 — 캘린더·차트·코드 에디터 같은 도메인 화면은 정본이 어디까지?

## 질문

화면 전체가 제품 특수 도메인일 때 (예: 캘린더·차트·코드 에디터) 정본이 어디까지 커버하나?

## 해보니까 알게 된 것

ds는 **표현 어휘**까지는 정본이고, **도메인 알고리즘**은 정본 외부다. 경계가 실제로 코드에 보인다.

### 실제 사례

- **CodeBlock**: `ui/0-primitive/CodeBlock.tsx`가 정본. shiki/prism 같은 외부 라이브러리가 HTML 문자열을 만들어내는 부분은 entity 안에서만 `dangerouslySetInnerHTML` 허용(CANONICAL "신뢰된 HTML payload entity"). 도메인 알고리즘(syntax highlight)은 외부, 표현(`<pre><code>`)은 정본.
- **차트**: `ui/7-pattern/BarChart.tsx`가 있는데 SVG primitive 조립으로 끝나는 단순 케이스만 ds 안에 있음. 진짜 차트 라이브러리(d3·visx) 수준은 ds 안 들어옴 — 도메인 패키지로 분리될 자리.
- **캘린더·코드 에디터**: 아직 정본화 안 됨. 들어온다면 `@p/domain-calendar`·`@p/domain-editor` 형태로 별도 패키지가 될 것 (CANONICAL 패키지 구조: `@p/domain-<area>` 슬롯).

### 경계 원칙

ds 내부 ui/는 ARIA pattern 어휘만. ARIA에 grid·tree·listbox·textbox는 있지만 "캘린더"·"코드 에디터"·"간트차트"는 없다 → ds 어휘 아님 → 도메인 패키지.

다만 도메인 패키지도 ds 정본을 따른다:
- 인터페이스: ControlProps(data, onEvent)
- 직렬화 가능 state
- gesture/intent 분리
- ARIA pattern 위에 얹기 (예: 캘린더 = `role="grid"` + datetime semantics)

즉 ds는 **만드는 길**(C 인터페이스 4종 + 직렬화 필터)을 정본화하고, **만든 결과물**은 도메인이 가진다.

## 근거

- /Users/user/Desktop/ds/src/ds/ui/0-primitive/CodeBlock.tsx
- /Users/user/Desktop/ds/src/ds/ui/7-pattern/BarChart.tsx
- /Users/user/Desktop/ds/CANONICAL.md:52 (신뢰된 HTML payload entity)
- /Users/user/Desktop/ds/CANONICAL.md:69 (`@p/domain-<area>` 패키지 슬롯)

## 남은 의문

- "ARIA pattern에 없으면 도메인"이라는 룰은 캘린더·코드 에디터까지는 깔끔한데, 모호한 케이스(파일 트리·드래그 가능한 칸반)에서 어디로 가는지 룰이 약함
- 도메인 패키지가 ds 정본을 따르는지 검증하는 lint·hook이 아직 없다 — 합의는 있지만 강제 메커니즘 부재
