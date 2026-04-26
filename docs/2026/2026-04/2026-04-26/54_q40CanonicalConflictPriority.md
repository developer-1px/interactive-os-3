---
id: q40CanonicalConflictPriority
type: inbox
slug: q40CanonicalConflictPriority
title: Q40 — 정본이 갈등할 때(직렬화 vs de facto) 우선순위
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q40 — 정본이 갈등할 때(직렬화 vs de facto) 우선순위

## 질문

직렬화(C2)와 de facto 표준이 충돌한다(예: 모든 라이브러리가 함수 prop·render prop으로 푸는 패턴). 어느 쪽이 이기나?

## 해보니까 알게 된 것

우선순위 사다리 (위가 강함):

1. **헌장 C1~C6** (선언적·직렬화·데이터 룩업·명령형 격리·셀렉터·정본 ≠ 이상형)
2. **영역별 정본 선언** (CANONICAL.md "정본 선언" 표)
3. **de facto 표준 어휘** (이름·prop 시그니처)
4. **개별 라이브러리 단독 패턴** (1곳 사례)

- 그래서 C2(직렬화)와 de facto가 붙으면 **C2가 이긴다.** 함수 prop을 그대로 받지 않고, ds는 그것을 데이터/이벤트로 우회해서 같은 효용을 낸다(`onEvent` + dispatch, definePage entity, useResource 등).
- 같은 layer 안에서 갈등(예: 영역 A 정본 vs 영역 B 정본)이면 **헌장으로 올려서 어느 쪽이 헌장에 더 가까운가**로 결정. 둘 다 같으면 사용 빈도·LLM 결정성 영향이 큰 쪽.
- 이 사다리는 정본 갱신의 의사결정 트리이기도 하다. PR에서 "이거 어떻게 결정?"이 나오면 위에서부터 적용.
- 헌장 자체가 흔들리는 충돌(예: C1·C2가 서로 안 맞는 것처럼 보이는 케이스)은 **why 문서로 회귀**해서 두 헌장 항목의 전제가 무엇이었는지 다시 확인. 보통은 정의 부족이지 진짜 충돌이 아니다.
- 우선순위가 명시되지 않은 정본은 "선언이 부족한 것"이지 "충돌이 정상인 것"이 아니다. 충돌이 발견되면 정본 갱신 압력으로 본다 — CANONICAL.md "정본 갱신 절차" 1단계(반례 발견).

## 근거

- CANONICAL.md 구조 자체가 헌장 → 영역 정본 → 임시·유산의 위계.
- 12_whyDeFactoStandard·13_whyDeclarativeSerialization: 두 why가 우선순위가 다른 layer임을 명시.
- MEMORY.md `feedback_no_escape_hatches`·`feedback_prefer_de_facto`: 헌장 위반은 escape hatch 없음.

## 남은 의문

- 사다리가 명시적으로 CANONICAL.md에 적혀있지 않다. 추가해야 정본의 정본이 된다.
- "헌장이 더 가깝다"의 측정 — 사람의 판단에 의존. 두 PR 리뷰어가 다르게 매기면 누가 결정하나(메타 절차 — Q41과 연결).
- de facto 4곳이 만장일치로 헌장 위반 패턴으로 갔을 때(가설적), 그래도 헌장이 이기나? 이 경우 헌장 재검토 압력이 너무 큰데, 임계값 정의가 없다.
