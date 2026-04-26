---
id: q11VsTailwindShadcn
type: inbox
slug: q11VsTailwindShadcn
title: Q11 — Tailwind+shadcn이 LLM 최적인데 ds가 더 결정적이라는 증거?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q11 — Tailwind + shadcn 조합이 사실상 LLM이 가장 잘 짜는 스택인데, ds는 그것보다 결정성이 높다는 증거가 있나?

## 질문

Tailwind + shadcn 조합이 사실상 LLM이 가장 잘 짜는 스택인데, ds는 그것보다 결정성이 높다는 증거가 있나?

## 해보니까 알게 된 것

엄밀한 증거는 **없다**. 측정한 실험이 없다. 가지고 있는 건 가설과 구조적 추론뿐이다 — 솔직히 말하면 이게 ds의 가장 약한 부분이다 (Q2·Q4와 같은 빈약함).

가설은 두 갈래로 나뉜다.

**Tailwind+shadcn이 분포 1위인 이유**: 학습 데이터에서 빈도 1위다. LLM은 그 분포를 안정적으로 재현한다. "잘 짠다"는 "분포에 가깝게 출력한다"는 의미.

**ds가 더 결정적이라고 추정하는 근거** (검증 안 됨):
1. **출력 공간이 작다**: Tailwind는 `class="..."` 안에 토큰 N개의 자유 조합. ds는 `tag + role + aria + data-part` 4축으로 닫혀 있어 가능한 출력 수가 적다 (산술적으로). 작은 공간 = 같은 의도에 같은 출력 확률 ↑.
2. **variant가 0**: shadcn cva는 `variant: "destructive" | "outline" | ...` 자유 선택지를 LLM에게 준다. ds는 1 role = 1 component (08_projectWhy.md:33).
3. **escape hatch가 0**: Tailwind는 임의 `[arbitrary-value]` 허용. LLM은 이걸 매번 다르게 만든다. ds는 임의 값 자체가 작성 불가능 (P4).
4. **데이터 인터페이스 1개**: shadcn은 children JSX. LLM이 같은 데이터를 다른 JSX 트리로 변형. ds는 `data, onEvent` 1개 (P3).

반박 가능성:
- 분포 0인 ds 어휘는 LLM이 호출 자체를 못한다. Tailwind는 호출은 안정적, 조합만 흔들린다. "전혀 못 호출 vs 흔들리며 호출" 중 어느 쪽이 결정성이 높은지 자체가 비자명.
- 12_whyDeFactoStandard.md:18-26은 이를 인정하고 어휘를 Radix·Ariakit에서 가져와 분포를 보장하려 한다. 하지만 `data-part`·`useResource` 같은 ds 고유 어휘는 분포 0이다.

따라서 답은: **이론은 있으나 측정은 없다**. 측정 인프라(같은 task N회 생성 → diff 분포)를 만드는 것이 다음 행동이다.

## 근거

- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/08_projectWhy.md:73` — "C7: LLM 결정 가능성 명문화" 후속 검토 항목
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/12_whyDeFactoStandard.md:18-26` — 학습 분포 활용 전략
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/14_whyReaderQuestions.md:23-24` — Q2·Q4 같은 측정 부재 인정

## 남은 의문

- "동일 의도 → 동일 출력 분포"의 실측 인프라가 아직 없다 (Q2 그대로).
- 측정한 결과 Tailwind+shadcn이 더 결정적이면 ds why의 핵심 가설이 깨진다 — 받아들일 준비가 돼있는가?
- ds 고유 어휘(`data-part`·`useResource`·`defineFlow`)가 분포 0이라는 것은 ds의 약점이다. 이걸 LLM 컨텍스트에 in-prompt로 넣어 보강하는 방식 외에 본질적 해결책은 미지.
