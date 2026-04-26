---
id: q05HumanFreedomVsLlmDeterminism
type: inbox
slug: q05HumanFreedomVsLlmDeterminism
title: Q5 — 사람 자유도 vs LLM 결정성, 둘 다 잡는 길은 없나?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q5 — 사람 자유도 vs LLM 결정성, 둘 다 잡는 길은 없나?

## 질문

사람을 위한 자유도와 LLM을 위한 결정성이 정말 trade-off인가? 둘 다 잡는 길은 없나?

## 해보니까 알게 된 것

**모든 자유도와 결정성이 trade-off는 아니다.** ds를 짜면서 발견한 건 자유도가 두 종류로 나뉜다는 것이다.

**1. "표현 자유도"는 trade-off다**

같은 의도를 100가지로 표현할 수 있는 자유 — variant prop·className 자유·`as` prop·escape hatch — 는 LLM 결정성과 직접 충돌한다. 사람에게 "표현이 다양해도 같은 의미로 읽힌다"는 게 LLM에는 "어떤 형태로 출력할지 매번 결정해야 하는 분기"가 된다. 여기는 trade-off가 진짜다. ds는 이쪽 자유도를 의도적으로 0으로 만든다.

**2. "조합 자유도"는 trade-off가 아니다 — 오히려 둘 다 산다**

사람이 진짜 원하는 건 "Button을 5가지로 표현하는 자유"가 아니라 **"Button·Card·Dialog를 자유롭게 조합해서 새로운 화면을 만드는 자유"** 다. ds의 `definePage` entities tree·`useResource (value, dispatch)`·`defineFlow` 한 줄 wiring이 이 조합 자유도를 보존한다. 어휘는 닫혀있지만 어휘를 어떻게 트리로 짜넣느냐는 무한대다.

이 구별을 하면 trade-off가 사라지는 영역이 보인다.

| 자유도 종류 | 사람 가치 | LLM 결정성 | ds 정책 |
|---|---|---|---|
| 표현 자유도 (variant·className) | 낮음 — 사실 외우기 짐 | 직접 충돌 | 0으로 닫는다 |
| 조합 자유도 (entity tree 짜기) | 높음 — 진짜 창작 | 충돌 안 함 (트리 노드 종류는 닫힘) | 보존 |
| 콘텐츠 자유도 (data 채우기) | 높음 — 텍스트·아이콘·순서 | 충돌 안 함 (data prop은 자유) | 보존 |
| 구조 자유도 (definePage 위계) | 높음 — section 위계 설계 | 충돌 안 함 | 보존 |

**3. "둘 다 잡는 길"의 본 프로젝트 답**

packages/ds/src/index.ts·packages/ds/src/ui/* 의 어휘는 닫혀있다 (LLM 결정성). 그러나 같은 어휘로 짤 수 있는 화면은 무한이다 (사람 자유도). 이 비대칭이 답이다. 

또 한 층 — 정본은 갱신된다 (CANONICAL.md "정본 갱신 절차" 92-97줄). 어휘가 부족할 때 사람은 새 role 컴포넌트를 정본으로 추가할 수 있다. 즉 **현재 어휘는 닫혀있지만 어휘 집합은 시간 차원에서 열려있다**. 사람의 창작은 어휘를 늘리는 형태로 살고, LLM은 매 순간의 닫힌 어휘로 결정성을 산다.

**4. 정직한 한계**

같은 의도를 시각적으로 다르게 보여주고 싶은 욕구 — "이 버튼은 그냥 좀 더 둥글면 좋겠다" — 는 ds에서 불가능하다. 그 욕구는 surface 정정으로 옮기거나 새 role을 만들거나 둘 중 하나다. 사람 입장에서 "잠깐만 빨리"가 안 된다. 이건 **포기한 자유도**이고, 트레이드오프가 진짜인 영역이다 (Q31과 연동).

## 근거 (코드/문서 인용)

- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/08_projectWhy.md:50-56` — definePage·useResource·defineFlow 조합 자유도
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/08_projectWhy.md:58-64` — "무엇을 포기했는가" 절 — trade-off가 진짜인 영역
- `/Users/user/Desktop/ds/CANONICAL.md:92-97` — 정본 갱신 절차 (어휘 시간차 열림)
- `/Users/user/Desktop/ds/packages/ds/src/index.ts` — 닫힌 어휘 export 목록

## 남은 의문

- "조합 자유도가 정말 LLM 결정성과 무관한가" — 트리 깊이가 깊어지면 LLM이 트리 짜기에 흔들리는 영역이 시작될 수 있음. 미측정.
- 새 role 추가 비용이 정본 갱신 절차에서 얼마나 무거운가 — 사람 자유도가 시간차로 열려있다지만 그 시간이 얼마나 빠른지 모름
- 시각 미세 조정 욕구를 surface로 흡수하는 게 항상 가능한가 — 마케팅·브랜드 페이지에서 안 통할 수 있음 (Q16·Q17과 연동)
