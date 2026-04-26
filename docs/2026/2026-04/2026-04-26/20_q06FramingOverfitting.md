---
id: q06FramingOverfitting
type: inbox
slug: q06FramingOverfitting
title: Q6 — DS = LLM 결정성 framing은 over-fitting 아닌가?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q6 — DS = LLM 결정성 framing은 over-fitting 아닌가?

## 질문

디자인 시스템이 풀 문제가 LLM 결정성이라는 framing 자체가 over-fitting 아닌가?

## 해보니까 알게 된 것

**부분적으로 맞는 비판이다. 정직하게 답한다.**

**1. ds가 푸는 문제는 LLM 결정성 단 하나가 아니다**

ds의 정본 원칙 P1~P6 (08_projectWhy.md)을 다시 보면, **LLM이 등장하기 전에도 좋은 디자인 시스템 원칙으로 통하던 것들**이 대부분이다.

- P2 Classless·셀렉터=의미 — 1990년대 후반 의미적 마크업 운동의 직계 후손
- P5 de facto 표준 우선 — 어떤 라이브러리든 채택 휴리스틱
- P6 Declarative Serialization — Redux·Elm·React 자체의 design philosophy
- P3 Data-driven rendering — `f(state) = view`라는 React 본질
- P1 Variant 금지 — 컴포넌트 단일 책임(SRP)의 한 형태. 사람도 variant prop이 폭증하면 외우기 짐

**LLM이 없어도 성립하는 원칙들을 LLM-friendly framing으로 다시 묶은 것**이라고 보는 게 정확하다. 이 점에서 framing이 LLM에 over-fit됐다는 비판은 일부 맞다 — framing 그 자체는 LLM 시대의 lens일 뿐, 원칙들의 근거는 더 깊다.

**2. 그럼 왜 LLM framing을 쓰는가**

세 가지 이유가 있다.

a. **시급성**: LLM이 등장한 이후, 같은 원칙들이 깨지면 비용이 즉시 가시화됐다. 사람 1명이 5년에 걸쳐 누적시키던 inconsistency를 LLM은 1주에 만든다. framing은 시급성을 표현하는 도구다.

b. **결정 기준의 명료화**: "좋은 디자인 시스템"의 정의는 모호하다. "LLM 결정성을 올린다"는 정의는 측정 후보가 있다 (Q2). framing이 좁아졌지만 그만큼 의사결정이 명료해졌다. CANONICAL.md의 "선택지가 줄어드는가"라는 평가 기준 (08_projectWhy.md:68)은 이 framing의 산물이다.

c. **사람의 미래**: aria README의 "0→1 노동만 사람이 한다·1→10은 결과만 받는다" framing이 깔려있다. 디자인 시스템은 1→10 도구다. LLM이 1→10 노동을 흡수한다면 디자인 시스템도 LLM의 도구로 재정렬해야 한다. 이건 framing이 아니라 시장 가설이다.

**3. Over-fitting의 진짜 위험**

framing이 over-fit이라면 다음 위험이 있다.

- LLM이 학습 분포를 자가 보정하게 되면 ds 어휘 자체의 가치가 떨어진다 (Q1)
- 모델이 코드 스타일을 자가 추론하면 CANONICAL.md 같은 외부 문서의 효용이 줄어든다
- "결정성"이 다른 가치(접근성·성능·미감)를 가릴 위험

본 프로젝트에서 이걸 막는 게이트는 P5 (de facto standard) 와 정본 갱신 절차다. de facto는 LLM 분포만이 아니라 사람 커뮤니티 분포도 본다. LLM only가 아니라 **LLM ∩ 사람 커뮤니티**의 교집합에 베팅한다. 이게 over-fitting을 일부 완화한다.

**4. 더 정직한 framing**

> "디자인 시스템은 사람·도구·LLM 모두에게 어휘를 공급한다. ds는 그 어휘 집합의 cardinality를 줄여 모든 소비자(사람·LLM·정적 도구)에게 결정성을 제공한다. LLM은 가장 cardinality에 민감한 소비자이므로 ds 효과가 가장 크게 가시화되는 곳이지만, ds의 가치는 LLM에 한정되지 않는다."

이게 over-fit 비판을 받아낸 framing 후보다.

## 근거 (코드/문서 인용)

- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/08_projectWhy.md:31-39` — P1~P6 원칙 (LLM 없이도 성립하는 것들)
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/08_projectWhy.md:66-68` — ds = decision-shrinking system framing
- `/Users/user/Desktop/aria/README.md:9-13` — 0→1 vs 1→10 시장 가설
- `/Users/user/Desktop/ds/CANONICAL.md:79` — de facto 2곳 수렴 — LLM ∩ 커뮤니티 교집합

## 남은 의문

- LLM이 사라진다는 가정에서 ds의 원칙이 살아남는지 — 사고 실험으로만 진행, 실제 검증 불가
- "결정성"이 가리는 다른 가치(예: 미감·브랜드 차별화) 영역이 어디까지인지 (Q53·Q54와 연동)
- framing을 약화하면 ds의 시급성·동기부여가 약해질 위험 — framing의 효용 자체도 trade-off
