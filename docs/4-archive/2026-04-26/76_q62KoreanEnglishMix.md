---
id: q62KoreanEnglishMix
type: inbox
slug: q62KoreanEnglishMix
title: Q62 — Korean·English 어휘 혼용 — 정본 언어는?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q62 — Korean·English 어휘 혼용 — 정본 언어는?

## 질문

CANONICAL.md, why 시리즈, 메모리 모두 한국어 산문에 영어 식별자가 박힌 형태다 — "ui/ role 인터페이스: ControlProps(data, onEvent) 데이터 주도". 외부 독자(영어권)에게 그대로 못 보인다. 정본 언어가 한국어인가 영어인가? 둘 다라면 어느 쪽이 진본인가?

## 해보니까 알게 된 것

**층별로 갈린다.**

- **코드 식별자 층 = English 단일** — 파일명, 함수명, 타입명, prop 이름, ARIA attribute 모두 영어. 메모리 `ds naming conventions`가 강제: "Radix·Base·Ariakit·RAC 최소 2곳 수렴". 학습 분포가 영어다.
- **설명 산문 층 = Korean** — CANONICAL.md, why 시리즈, 메모리, 커밋 메시지. 1인 운영 ds 프로젝트의 사고·결정 기록이라 사고 언어(한국어)로 작성.
- **공개 문서 = 미정** — 외부 공개 시 영어가 필요. 현재 정본 문서는 그 단계 이전.

따라서 진본은 **코드는 영어, 결정 기록은 한국어**. 이게 모순이 아닌 이유는 두 층이 **다른 청중**을 향하기 때문이다.

- 코드는 LLM·외부 contributor·미래의 자기 자신이 읽는다 → 영어 표준
- 결정 기록은 현재 작성자가 빠르게 사고하기 위한 노트 → 모국어가 효율적

이 분리 자체가 명문화돼 있지는 않다. 메모리 `inbox 문서는 사건 날짜 폴더에`도 폴더 규칙만 정하고 언어는 정하지 않았다. 한국어 결정 기록이 영어 코드를 produce한다는 비대칭 — 코드 리뷰·LLM 생성에서는 한국어 산문이 context로 안 들어가는 경우가 많아 결정 기록과 코드의 drift가 잠재 위험.

실용 룰(추론):

1. `data-part` 값, prop 이름, 식별자, 라우트 경로 = English 강제
2. 산문 결정 기록 = Korean 허용 (현재 1인 단계)
3. 외부 공개 시점에 산문도 영어 정본 + 한국어 사본으로 분기 — 그때 진본 선언 필요

## 근거

- `/Users/user/Desktop/ds/CANONICAL.md` 전체 — 한국어 산문 + 영어 식별자
- `/Users/user/Desktop/ds/packages/ds/src/parts/Card.tsx:1-30` — 코드 주석조차 한국어 산문, 식별자는 영어
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/12_whyDeFactoStandard.md` — why 시리즈 = 한국어
- 메모리 `ds naming conventions` — 영어 식별자 강제 (Radix·Base·Ariakit·RAC 어휘)

## 남은 의문

- 외부 공개 시점에 영어 산문을 LLM 번역으로 만들 것인지, 처음부터 영어로 다시 쓸 것인지 — 결정성 측면에서 후자가 안전
- LLM에 한국어 산문이 context로 들어갈 때, 영어 코드 생성 결정성이 떨어지는지 측정 필요 (Q2 측정 가능성과 연결)
- 메모리·CANONICAL을 영어로 mirror할 자동 파이프라인 — 정본 drift 방지 장치
- 식별자에 한국어 허용 가능 자리(예: 한국어 라우트 라벨)는 어디까지 — 현재 0
