---
id: q10VsBigSystems
type: inbox
slug: q10VsBigSystems
title: Q10 — Material 3·Polaris·Carbon 대비 ds가 이긴다는 점?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q10 — Material 3·Polaris·Carbon은 이미 큰 시스템인데 ds가 이긴다고 주장하는 점은?

## 질문

Material 3·Polaris·Carbon은 이미 큰 시스템인데 ds가 이긴다고 주장하는 점은?

## 해보니까 알게 된 것

"이긴다"가 아니다. **다른 목적함수를 최적화**한다. Material 3·Polaris·Carbon은 사람 디자이너·개발자의 자유도(variant·테마·유연한 composition)를 보장하면서 시각 일관성을 추구한다. ds는 그 자유도를 의도적으로 깎아 LLM 결정성을 추구한다. 같은 차원에서 비교 불가능한 시스템들이다.

대형 시스템의 구조적 한계 (LLM 관점):
1. **variant 폭증**: M3 Button만 filled/tonal/elevated/outlined/text 5개 + size·icon 변형. LLM이 매번 다른 조합을 고른다 (08_projectWhy.md:21).
2. **시각 prop 노출**: `color`·`elevation`·`shape` 등 시각이 prop이라 LLM이 비즈니스 로직과 시각을 섞어 생성. ds는 색은 surface 소유자만, item은 mute/emphasize (CANONICAL.md:58).
3. **Token이 별도 도구**: M3 token은 Figma·코드·문서가 분리. ds는 palette → foundations 2층 코드 import 1경로 (CANONICAL.md:84).
4. **Composition이 자유**: Polaris의 `<Card>`는 children에 무엇이든 들어간다. ds는 Card slot + parent Grid subgrid 정본 (CANONICAL.md:62).

ds가 못하는 것:
- M3 수준의 시각 다양성·브랜드 표현·motion 풍부함은 없다. 초기 단계라 양적으로도 비교 불가.
- 디자이너 친화 도구 (Figma kit·token sync 도구)도 없다.

즉 "큰 시스템 vs ds"가 아니라 "사람 자유도 우선 vs LLM 결정성 우선"의 다른 axis다. M3가 LLM을 위해 variant를 0개로 줄일 일은 없을 것이다 — 그러면 디자이너 사용자 기반을 잃는다. ds는 디자이너 친화를 처음부터 포기했기 때문에 그 길이 열린다.

## 근거

- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/08_projectWhy.md:21-27` — variant 폭증·자유도 = 비결정성
- `/Users/user/Desktop/ds/CANONICAL.md:58` — 색 소유 규칙
- `/Users/user/Desktop/ds/CANONICAL.md:62` — 카드 변형 정본
- `/Users/user/Desktop/ds/CANONICAL.md:84` — 토큰 2층

## 남은 의문

- M3·Polaris·Carbon이 자체 LLM 도구를 도입하면서 variant 축소를 시도할 가능성은 있다. 그 경우 ds의 차별점은 "더 일찍 수렴"으로만 남는다.
- "디자이너 친화 vs LLM 결정성"이 진짜 zero-sum인지는 아직 증거 없음 (Q5와 같은 의문).
- 실제로 같은 task에 대해 M3 기반 LLM 출력 vs ds 기반 LLM 출력의 결정성 분포 측정한 적 없음.
