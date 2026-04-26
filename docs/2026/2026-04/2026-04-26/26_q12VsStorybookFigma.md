---
id: q12VsStorybookFigma
type: inbox
slug: q12VsStorybookFigma
title: Q12 — Storybook·Figma Token과 ds는 같은 문제?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q12 — Storybook·Figma Token이 풀려는 문제와 ds가 풀려는 문제는 같은가 다른가?

## 질문

Storybook·Figma Token이 풀려는 문제와 ds가 풀려는 문제는 같은가 다른가?

## 해보니까 알게 된 것

다르다. 같은 어휘("디자인 시스템")를 쓸 뿐 풀려는 문제 자체가 다른 layer에 있다.

**Storybook이 푸는 문제**: 컴포넌트의 **시각·동작 카탈로그**. 디자이너·개발자가 가능한 variant·state 조합을 눈으로 확인하고 QA한다. 즉 "사람이 컴포넌트를 이해·검증하는 도구". 컴포넌트가 variant 폭증한 채로도 잘 작동한다 — 오히려 variant가 많을수록 Storybook의 가치가 커진다.

**Figma Token이 푸는 문제**: 디자인 결정의 **단일 출처(SSOT)**. 색·간격·typography 값을 Figma·코드·문서가 같은 토큰을 참조하게 한다. 즉 "사람이 만든 결정을 도구 간에 동기화".

**ds가 푸는 문제**: **LLM의 출력 분포를 같은 의도 → 같은 출력로 수렴**시키기. 결정 자체를 줄이는 게 목적 (`decision-shrinking system`, 08_projectWhy.md:67-68).

세 문제는 직교한다. ds가 Storybook을 거부하지 않고 (오히려 카탈로그 라우트로 비슷한 일을 한다 — `/content`, CANONICAL.md:81 "시연/카탈로그 라우트"), Figma Token도 ds의 foundations 2층 토큰과 정합 가능하다 (CANONICAL.md:84).

다만 함의는 다르다:
- Storybook은 **variant가 있어야 의미가 있는 도구**다. ds처럼 variant 0이면 카탈로그가 1 role = 1 화면이라 단조롭다.
- Figma Token은 **디자이너가 결정을 만든다**는 전제다. ds는 결정 자체를 줄이려 한다 — 도구가 같이 쓰이지만 정본 갱신의 권한은 다르다 (Q49 권력 질문과 연결).

## 근거

- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/08_projectWhy.md:67` — decision-shrinking system
- `/Users/user/Desktop/ds/CANONICAL.md:81` — 시연/카탈로그 라우트 raw role 예외
- `/Users/user/Desktop/ds/CANONICAL.md:84` — palette → foundations 2층

## 남은 의문

- ds도 사람 검증용 카탈로그가 필요하다 (`/content`·`/foundations` 라우트). 이게 사실상 Storybook을 다시 발명한 것 아닌가? — 정본 외부에서 보면 그렇다.
- Figma → ds token 자동 동기화는 Q24에서 다루기로 보류.
