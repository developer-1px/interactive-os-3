---
id: q13VsWebComponents
type: inbox
slug: q13VsWebComponents
title: Q13 — Web Components·Lit·Stencil 표준 진영과의 관계?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q13 — Web Components·Lit·Stencil 같은 표준 진영과의 관계는?

## 질문

Web Components·Lit·Stencil 같은 표준 진영과의 관계는?

## 해보니까 알게 된 것

Web Components는 **배포·격리·재사용의 표준**이다. ds는 **결정 수렴의 정본**이다. layer가 다르다 — 충돌하지 않지만, ds가 적극적으로 채택하지도 않는다. 이유는 학습 분포와 호환성.

Web Components가 푸는 것:
- Custom Element: 브라우저 네이티브 컴포넌트 등록
- Shadow DOM: 스타일·DOM 격리
- HTML Templates: 선언적 마크업

ds가 채택하지 않는 이유:
1. **학습 분포 mismatch**: LLM이 가장 안정적으로 출력하는 컴포넌트 모델은 React JSX다. de facto 4개 라이브러리(Radix·Base·Ariakit·RAC, 12_whyDeFactoStandard.md:42-47)가 모두 React 기반. Web Components·Lit는 학습 분포에서 빈도가 낮다 — ds의 "표준 채택" 룰이 React·JSX 쪽을 가리킨다.
2. **Shadow DOM이 정본 셀렉터를 차단**: ds의 C5는 "tag + role + aria + data-part"로 외부에서 셀렉트 가능하다는 전제다. Shadow DOM은 의도적으로 외부 셀렉터·스타일을 막아 audit·devtools 도구의 가시성을 떨어뜨린다.
3. **직렬화 가능성**: Web Components는 imperative API(`element.someProperty = ...`)가 흔하다. ds C2 "상태 직렬화 가능"과 마찰. Lit는 reactive property로 일부 해결하지만 React 진영의 데이터 인터페이스만큼 표준화돼 있지 않다.

같은 정신을 공유하는 부분:
- "표준에 수렴" 철학은 동일 — Web Components는 W3C 표준이고 ds는 ARIA 표준을 채택한다 (P5).
- 결정을 닫는 방향성도 비슷 — Custom Element는 한 번 등록하면 한 형태로 사용한다.

따라서 ds의 답은: "표준 진영을 거부하지 않지만, LLM 학습 분포가 React로 쏠려 있는 한 ds도 React 위에 머문다. 분포가 바뀌면 따라간다" (12_whyDeFactoStandard.md:84-86 — 정본은 영원하지 않다).

## 근거

- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/12_whyDeFactoStandard.md:42-47` — 4개 후보 라이브러리 모두 React
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/12_whyDeFactoStandard.md:84` — 분포가 바뀌면 ds도 따라간다
- `/Users/user/Desktop/ds/CANONICAL.md:23` — C5 셀렉터 정본
- `/Users/user/Desktop/ds/CANONICAL.md:20` — C2 직렬화

## 남은 의문

- Lit가 SSR·streaming에서 React보다 가벼운 점은 무시 못 한다. 성능이 결정성을 이기는 시점이 오면 재고할 수 있다.
- Web Components custom element + ARIA 채택이 보편화되면 (Adobe spectrum-web-components 등) ds의 4개 후보 목록이 확장될 가능성. 현재는 확장 안 함.
