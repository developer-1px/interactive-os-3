---
id: q07FiveYearsLater
type: inbox
slug: q07FiveYearsLater
title: Q7 — 5년 후에도 이 why가 유효할까?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q7 — 5년 후에도 이 why가 유효할까?

## 질문

5년 후에도 이 why가 유효할까? — 모델 컨텍스트가 무한이면 "어휘 일관성"이 무의미해질 수도

## 해보니까 알게 된 것

**솔직히 모른다.** 다만 "어떤 부분이 무너지고 어떤 부분이 살아남는가"를 시나리오로 분리해보면 일부는 답을 말할 수 있다.

**시나리오 A: 모델 context가 무한이고 자가 일관성이 완벽**

이 시나리오에서는 모델이 코드베이스 전체를 매번 읽고 "지금까지의 표현 패턴"을 자가 추론해 일관성을 유지한다. 이 경우:

- ds **어휘 일관성** 가치는 약화된다 (모델이 알아서 일관시키므로)
- 그러나 ds **직렬화 가능성 (C2)** 은 살아남는다. 직렬화는 LLM 때문이 아니라 시간·공간·도구 가로지르기 때문이다 (CANONICAL.md 1-11줄 헌장). 데이터 형태로 저장된 UI 명세는 git diff·migration·외부 도구가 다룰 수 있다. 모델이 좋아져도 git은 여전히 textual diff를 본다.
- ds **선언성 (C1·C3)** 도 살아남는다. 명령형 절차는 정적 분석·테스트·migration이 어렵다는 건 LLM 무관 사실이다.

따라서 이 시나리오에선 why 시리즈 중 **classless·variant 금지·de facto 어휘** 부분은 약화되고, **declarative serialization** 부분은 살아남는다.

**시나리오 B: 모델은 좋아졌지만 sampling은 여전히 비결정적**

context가 커져도 sampling은 본질적으로 분포에서 뽑는 행위다. 같은 prompt 두 번 → 두 번 다른 출력은 5년 뒤에도 그대로다. 이 시나리오에선 어휘 일관성도 살아남는다 — context 무한이 결정성을 보장하지 않는다.

**시나리오 C: LLM이 코드 표현을 우회한다 (코드 없는 미래)**

5년 후 LLM이 UI를 코드가 아니라 다른 표현(예: 직접 DOM 그래프·바이트코드)으로 짜는 시대가 오면 ds의 컴포넌트 어휘 자체가 의미 없어진다. 이 경우 ds why 시리즈 전체가 부적합 framing이 된다. 가능성 0%는 아니지만 가까운 미래는 아니다.

**아라 프로젝트가 시사하는 것**

aria README는 OS 레이어를 데이터 모델·command pipeline·plugin 시스템으로 정의한다. 이건 **LLM 능력에 의존하지 않는** 추상이다. behavior(treegrid·listbox)·command·entity 같은 어휘는 LLM이 사라져도 의미가 있다. ds도 이 방향에 가까운 정본은 5년 후에 살아남고, LLM 결정성을 직접 정조준한 정본은 약해질 수 있다.

**5년 후 가장 위태로운 것**

- de facto 4개 라이브러리 채택 기준 (Q3) — 5년 후 라이브러리 지형은 다르다. 기준 자체를 갱신해야 한다.
- variant 금지의 강도 — 모델이 variant 분포를 자가 sharp하게 만드는 시점이 오면 약화 가능
- "LLM 결정성 framing" (Q6) — 5년 후 lens가 바뀌어 있을 가능성 높음

**5년 후 살아남을 것 (개인 베팅)**

- C2 직렬화 가능성 — 시간·공간·도구 가로지르기는 LLM과 무관
- 1 role = 1 component — SRP의 한 형태. 사람에게도 LLM에게도 좋다
- data-driven rendering — React·Elm 본질의 후예. 5년 후 React가 사라져도 데이터→UI 패러다임은 남는다

**검증 못한 것**: 5년이 짧을 수도 길 수도 있다. 본 프로젝트에서 한 어떤 작업도 5년 시점의 증거를 제공하지 못한다. 위 답은 모두 시나리오 추론이다.

## 근거 (코드/문서 인용)

- `/Users/user/Desktop/ds/CANONICAL.md:1-11` — 직렬화 가능성의 LLM-무관 근거 (시간·공간·도구)
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/13_whyDeclarativeSerialization.md` (참조) — 직렬화 가치의 항구성
- `/Users/user/Desktop/aria/README.md:60-78` — OS 레이어가 LLM-독립 추상이라는 시사
- `/Users/user/Desktop/ds/CANONICAL.md:92-97` — 정본 갱신 절차 (5년 갱신 자체가 시스템에 내장)

## 남은 의문

- 모델이 자가 일관성에 도달하는 시점을 어떻게 감지할지 — 메트릭 없음
- 직렬화 가치가 살아남는다 vs ds의 직렬화 형식이 살아남는다 — 후자는 약하다. JSON·zod schema가 5년 후 표준일 보장 없음.
- 본 why 시리즈를 5년 후 다시 읽었을 때 어느 부분을 "역사적 산물"로 분류하고 어느 부분을 "여전히 유효"로 분류할지 — 미래의 자기 자신만 답할 수 있음
