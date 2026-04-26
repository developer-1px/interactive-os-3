---
id: q60ExcludedLibraries
type: inbox
slug: q60ExcludedLibraries
title: Q60 — 4개 라이브러리만 — Headless UI·Reach UI·Aria Components 빠진 이유?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q60 — 4개 라이브러리만 — Headless UI·Reach UI·Aria Components 빠진 이유?

## 질문

ds의 "de facto 2곳 수렴" 룰의 4개는 Radix·Base UI(MUI)·Ariakit·React Aria Components(RAC). Headless UI(Tailwind), Reach UI, 그리고 Adobe의 React Aria(hooks)는 왜 후보에서 빠졌나? 자의적 큐레이션 아닌가?

## 해보니까 알게 된 것

빠진 게 아니라 **이미 흡수됐거나 후보 자격이 약하다**.

- **React Aria (hooks API)** — RAC와 같은 Adobe 라이브러리. RAC가 hooks를 컴포넌트로 감싼 상위 표현이라 RAC를 채택하면 React Aria도 채택한 셈이다. ds가 보는 건 "수렴된 어휘"이지 구현 layer가 아님.
- **Headless UI** — Tailwind팀의 라이브러리. Menu/Listbox/Combobox 정도로 컴포넌트 수가 적고 Radix·Ariakit·RAC와 어휘가 거의 동일(Trigger/Items/Item). 즉 채택해도 4개 합의에 새 신호를 거의 못 주는 redundant 표본이다. "수렴 시그널"의 가중치를 바꾸지 않는다.
- **Reach UI** — 사실상 유지보수 중단(Chakra가 뒤를 이음). ds가 보는 건 살아있는 표준이지 박물관 아님.
- **Base UI (MUI Base)** — 들어 있다. 자체적으로 Radix·RAC와 다른 어휘를 제안할 때가 있어 "수렴 vs 분기"를 가르는 신호로 유용.

즉 4개는 **(1) 활발히 유지되고 (2) ARIA pattern을 head-less로 풀고 (3) 어휘 결정에 독립적 신호를 주는** 라이브러리의 최소 집합이다. Headless UI를 더해도 새 정보가 안 늘고, Reach UI는 죽었고, React Aria(hooks)는 RAC에 흡수.

이 큐레이션이 자의적이라는 비판은 부분적으로 맞다 — 정본 갱신 절차(CANONICAL.md:92-97) 안에 "4개 후보 집합" 자체의 갱신 절차가 명시돼 있지 않다. 새 라이브러리(예: Park UI, Mantine headless)가 의미 있게 떠오르면 후보에 추가해야 하는데, 그 트리거 조건이 미정.

## 근거

- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/12_whyDeFactoStandard.md:1-30` — "Radix·Base·Ariakit·RAC 최소 2곳 수렴" 룰의 출처
- `/Users/user/Desktop/ds/CANONICAL.md:79` — 컴포넌트 명명 정본
- 메모리 `ds naming conventions` — "Radix·Base·Ariakit·RAC 최소 2곳 수렴 시 채택"

## 남은 의문

- 후보 집합 자체의 갱신 절차가 정본에 빠져 있음 — 메타 정본 필요
- "수렴" 정의가 모호 — 동일 컴포넌트 이름이면 수렴? prop까지 같아야? 형태(slot 구조)까지?
- 한국·일본권 라이브러리(예: Toss UI 등) — 학습 분포 비중이 다른 시장에서는 다른 후보 집합이 맞을 수도
