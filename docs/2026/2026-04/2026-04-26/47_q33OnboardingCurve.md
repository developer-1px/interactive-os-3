---
id: q33OnboardingCurve
type: inbox
slug: q33OnboardingCurve
title: Q33 — ds 학습 곡선이 가파른 거 아닌가? 신입 온보딩은?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q33 — ds 학습 곡선이 가파른 거 아닌가? 신입 온보딩은?

## 질문

ds 자체의 학습 곡선이 가파른 거 아닌가? 신입 온보딩은?

## 해보니까 알게 된 것

가파르다, 솔직히. 특히 Tailwind·MUI 출신이 처음 ds를 만나면 3가지 지점에서 멈춘다:

1. **className 못 씀** — "그러면 스타일을 어디에"가 첫 질문. 답: ds/parts·ui가 이미 다 입혀져 있고, 화면별 시각은 widget의 root 1곳 className으로
2. **children 못 씀** — `<Button>저장</Button>`이 안 되고 `<Button data={{ label: '저장' }} />`이라는 게 처음에는 어색
3. **definePage entities tree** — JSX 직접 조립 대신 데이터 트리로 페이지를 선언

다만 학습 곡선 *가파르다 ≠ 길다*. 정본 매뉴얼 1장(CANONICAL.md)이 110줄이다. 신입이 첫날 그걸 읽고, 둘째 날부터 ds/ui에 있는 컴포넌트 목록을 보면서 자기 화면을 조립한다. ARIA를 미리 알고 있으면 이미 절반 안 셈이다.

진짜 비결은 ds가 LLM 친화적이라 신입도 LLM을 동료로 쓰면 된다는 것이다 — Cursor·Claude Code가 ds 어휘 안에서 작업하면 결정적이라서, 신입이 "이거 어떻게 짜요"를 LLM에 묻는 게 사람 시니어보다 빠른 경우가 많다. 정본이 LLM에 학습 친화적인 만큼 신입에게도 친화적이다.

가파른 부분이 진짜 비싼 건 *Tailwind 습관 unlearn* 비용이다. "잠깐만 div에 class 박으면 되는데"를 참는 데 1~2주. 그 후로는 평탄.

비교 대상이 중요하다. MUI도 Polaris도 첫 1주는 자기네 어휘 학습이고, 그 어휘가 ds보다 *더* 임의적이다 (variant·sx·slotProps). 표준 ARIA 기반인 ds 학습은 다른 곳으로 옮겨도 재사용된다.

## 근거

- /Users/user/Desktop/ds/CANONICAL.md — 정본 매뉴얼 (110줄, 1장)
- /Users/user/Desktop/ds/packages/ds/src/ui/ — 9층 폴더 그 자체가 카탈로그
- 08_projectWhy.md — LLM 친화 = 신입 친화 (LLM이 동료)
- /content 라우트 — 신입 학습용 시연 카탈로그

## 남은 의문

- 측정값: ds 신입 첫 PR까지 평균 며칠인가
- ARIA 기초 없는 신입(주니어)이 ds로 진입할 때 ARIA 학습을 어디서 시키나
- 디자이너→개발자 전향자처럼 비표준 경로 신입의 곡선
