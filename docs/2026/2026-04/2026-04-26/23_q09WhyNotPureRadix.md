---
id: q09WhyNotPureRadix
type: inbox
slug: q09WhyNotPureRadix
title: Q9 — Radix를 그대로 쓰면 안 되나?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q9 — Radix를 그대로 쓰면 안 되나? 왜 그 위에 또 한 층을 얹나?

## 질문

Radix를 그대로 쓰면 안 되나? 왜 그 위에 또 한 층을 얹나?

## 해보니까 알게 된 것

Radix는 **headless primitive**다 — ARIA·키보드·focus는 정확히 풀어주지만, "의미와 시각의 결합"·"데이터 인터페이스"·"조립 형태"는 풀지 않는다. 그 풀리지 않은 결정이 LLM의 비결정성을 만든다.

Radix를 그대로 쓰면 풀리지 않는 것:
1. **시각**: Radix는 unstyled. 색·간격·shape를 사용자가 매번 결정한다. ds는 foundations 토큰으로 결정 1개 (`src/ds/foundations/`).
2. **인터페이스 형태**: Radix는 children-driven JSX. `<Menu><Menu.Trigger/><Menu.Content><Menu.Item/></Menu.Content></Menu>`. ds는 `data, onEvent` 단일 인터페이스 (P3, CANONICAL.md:38). 트리 데이터를 LLM이 매번 다른 JSX로 조립할 자유를 차단.
3. **gesture/intent 분리**: Radix 컴포넌트는 onKeyDown 등이 노출돼 있어 소비자가 분기 코드를 끼워 넣을 여지가 있다. ds는 `ui/`가 activate만 emit, intent 도출은 `ds/core/gesture`로 격리 (CANONICAL.md:39).
4. **Resource·Flow**: Radix는 데이터 흐름에 의견이 없다. ds는 `useResource`·`defineFlow` 1개로 닫는다 (CANONICAL.md:45-46).
5. **레이아웃**: Radix는 컴포넌트 단위. 페이지 레이아웃은 사용자가 짠다. ds는 `definePage` entities tree 정본 (CANONICAL.md:33).

즉 Radix는 "ARIA 결정"만 닫고, 나머지 결정 9개를 열어둔다. ds는 그 9개를 마저 닫는 추가 층이다. Radix를 거부하지 않는다 — 오히려 ds 내부에서 Radix·Ariakit 어휘를 그대로 채택한다 (`Trigger`/`GroupLabel`/`TabPanel`, 12_whyDeFactoStandard.md:53).

## 근거

- `/Users/user/Desktop/ds/CANONICAL.md:33` — definePage 정본
- `/Users/user/Desktop/ds/CANONICAL.md:38-46` — ui 인터페이스, gesture, resource, flow
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/12_whyDeFactoStandard.md:80` — "ds는 표준 + 더 엄격"
- `/Users/user/Desktop/ds/src/ds/core/` — gesture·feature·hooks 격리 위치

## 남은 의문

- Radix 자체도 시간이 지나면서 더 많은 결정을 내릴 수 있다 (예: themes 패키지). 그렇게 되면 ds 추가 층의 부피가 줄지만, 0이 되진 않을 것 — children JSX 인터페이스는 Radix가 절대 버리지 않을 가능성이 크다.
- "왜 Ariakit이나 RAC가 아니라 그 위에 한 층"인지도 똑같이 답할 수 있다 — 결정 닫힘 정도의 문제이지 라이브러리 선택 문제가 아니다.
