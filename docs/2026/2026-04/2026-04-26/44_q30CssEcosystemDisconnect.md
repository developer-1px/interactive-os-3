---
id: q30CssEcosystemDisconnect
type: inbox
slug: q30CssEcosystemDisconnect
title: Q30 — classless가 CSS-in-JS·Tailwind 생태계와 단절시키지 않나?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q30 — classless가 CSS-in-JS·Tailwind 생태계와 단절시키지 않나?

## 질문

classless → CSS-in-JS·Tailwind 생태계와 단절. 학습 자료·도구가 빈약해지지 않나?

## 해보니까 알게 된 것

오해 1: ds가 className 자체를 금지한다고 착각하기 쉬운데, 실제 정본은 "**스타일 전용** className 금지"다. content widget root 1곳에 카탈로그용 className은 허용된다. 셀렉터 namespace는 tag + role + aria + data-part로 잡는다.

오해 2: classless = "CSS 안 씀"이 아니다. ds는 vanilla-extract / 일반 CSS / styled-components 어느 것이든 쓸 수 있다 — 다만 셀렉터를 `[role="tab"][aria-selected="true"]` 같은 ARIA로 쓴다. CSS 자체와 단절이 아니라 *className을 시각 변형 carrier로 쓰는 관행*과 단절이다.

생태계 비용은 솔직히 있다. Tailwind 클래스 자동완성·Shadcn 카탈로그·도구체인 — 이걸 못 쓴다. 대신 얻은 것:
- 의미가 마크업에 박혀서 LLM이 코드 읽을 때 ARIA 트리만 봐도 의도가 보인다
- DOM이 평탄해진다 (스타일 wrapper 없음)
- 다크모드·고대비·hover·focus 분기가 ARIA·data-* 셀렉터로 자연스럽게 풀린다

학습 자료 빈약 — 사실이지만 ds의 어휘가 ARIA 그 자체라서 MDN·W3C·Radix 문서가 그대로 학습 자료다. Tailwind 학습 자료보다 양은 적지만 표준 기반이라 수명이 길다.

## 근거

- /Users/user/Desktop/ds/CANONICAL.md:23 — "C5 이름이 곧 셀렉터 · tag + role + aria + data-part"
- /Users/user/Desktop/ds/CANONICAL.md:55 — "셀렉터 어휘: tag + role + aria + data-part · 유산: 스타일 전용 className"
- /Users/user/Desktop/ds/CANONICAL.md:51 — "content widget: root 1곳 className(카탈로그). 서브파트 이름 금지"
- feedback_classless_html_aria — wrapper 대신 DOM 평탄화/portal

## 남은 의문

- Tailwind 사용 팀이 ds로 전환할 때의 학습 비용 — 측정한 적 있나
- 디자이너가 Figma의 auto-layout 토큰을 ARIA 셀렉터 CSS로 export하는 도구 부재
