---
id: q34TriggerVsActivator
type: inbox
slug: q34TriggerVsActivator
title: Q34 — 두 라이브러리가 갈리는 이름은 어떻게 결정?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q34 — 두 라이브러리가 갈리는 이름은 어떻게 결정?

## 질문

`Trigger` vs `Activator`처럼 de facto 4개(Radix·Base·Ariakit·RAC) 사이에 수렴이 안 된 이름은 어떻게 고르나? 동전 던지기인가?

## 해보니까 알게 된 것

- 정본 명명 룰은 "**최소 2곳 수렴 시 채택**"이다 (CANONICAL.md "컴포넌트 명명"). 1:3, 2:2, 1:1:1:1 케이스가 갈림길이다.
- 1:3·2:2면 다수쪽을 바로 채택. 동률(2:2)은 **ARIA 스펙 텍스트에 등장하는 단어**가 1차 tiebreaker. Trigger의 경우 ARIA APG가 "trigger button"을 자주 쓰므로 Trigger 채택.
- 1:1:1:1처럼 완전 분산이면 (a) ARIA 스펙 단어 → (b) 가장 짧고 다의어 아닌 쪽 → (c) `prop 이름은 ARIA 그대로` 원칙과 충돌하지 않는 쪽 순서.
- **이름은 정본 갱신 대상**이다. 한번 골라도 후행 수렴(라이브러리 3:1 이상으로 기우는 사건)이 일어나면 갱신한다 — 그래서 동률 결정의 비용은 영구적이지 않다.
- 우리 코드에 이미 존재하는 이름은 가산점 0. 매몰비용으로 정본을 흔들지 않는다. 정본이 바뀌면 일괄 마이그레이션.

## 근거

- CANONICAL.md "컴포넌트 명명": Radix·Base·Ariakit·RAC 최소 2곳 수렴.
- MEMORY.md `feedback_prefer_de_facto`: 업계 수렴 패턴이 있으면 항상 그걸로.
- MEMORY.md `project_ds_naming_conventions`: ARIA 그대로, 인위적 통일 금지.

## 남은 의문

- 동률 시 ARIA 스펙 텍스트 검색은 사람이 매번 손으로 해야 하나? `naming-audit` 스킬에 결정 트리 자동화 가능한가.
- "후행 수렴 발생 시 갱신"의 갱신 트리거 — 분기마다 라이브러리 릴리즈를 추적하는 cron이 있어야 하나.
- ARIA 스펙도 단어를 안 쓰는 새 패턴(예: ds 자체에서만 의미 있는 Roving·Flow)은 무엇이 tiebreaker인가.
