---
id: q04ChoiceShrinkingHypothesis
type: inbox
slug: q04ChoiceShrinkingHypothesis
title: Q4 — "선택지 줄이면 LLM 결정성 ↑" 가설은 입증됐나?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q4 — "선택지 줄이면 LLM 결정성 ↑" 가설은 입증됐나?

## 질문

"선택지가 줄면 LLM 결정성이 올라간다"는 가설은 실제 실험으로 입증됐나, 아니면 직관인가?

## 해보니까 알게 된 것

**직관이다. 정량 입증 안 됐다.** ds 자체에는 controlled experiment가 없다. 다만 직관을 뒷받침하는 약한 일화 증거와 인접 분야 논거는 있다.

**1. 정보이론 직관**

선택지가 N개일 때 모델이 1개를 고를 entropy는 log(N) 비례로 증가한다. variant prop 5×5×5 = 125 조합과 1 role = 1 component (1 조합)는 entropy 차이가 명확하다. 이건 **수학적으로는 자명**하지만 "실제 LLM이 그 entropy 만큼 흔들리는가"는 다른 문제다. 모델은 prompt 문맥·학습 prior에 의해 분포가 sharp해질 수 있어서 형식적 선택지 수가 그대로 출력 분포 폭으로 매핑되지 않는다.

**2. 본 프로젝트에서 관찰한 일화**

src/ds/ui/2-button-link/ 에 SubmitAction·DangerAction·LinkAction을 분리한 후, 코드 작성을 모델에 시킬 때 "어떤 버튼?"을 두 번 묻는 일이 사라졌다. variant 시절엔 매번 prop 조합을 추정했는데, role 분리 후엔 import 이름만 정해진다. 이게 N=수십 정도의 비공식 관찰이다 — 통계가 아니다.

src/routes/finder/ 의 이번 세션 작업에서 `query`를 feature.state로 승격하고 raw `role="search"`를 제거하면서, 같은 영역을 다시 손볼 때 "검색을 어디 둘지" 결정 분기가 사라졌다 (CANONICAL.md 변경 이력 2026-04-26 참조). 작은 사례지만 결정성 효과가 코드 흐름에 직접 보인다.

**3. 인접 분야 증거**

- **Constrained decoding**: JSON schema·grammar로 출력을 제약하면 valid JSON 생성률이 급등한다는 건 여러 논문에서 보고됨 (Outlines, Guidance 등). 이건 "선택지를 닫으면 결정성이 올라간다"의 강한 형태다.
- **Few-shot prompting**: 예시 1-3개만 넣어도 출력 형식이 sharp해진다는 건 GPT-3 시절부터 표준 결과.

이 두 가지가 ds 가설의 **"비슷한 모양의 다른 곳에서 입증된 메커니즘"**이다. ds는 컴파일 타임에 그 제약을 코드 구조에 박는다 — 즉, 동일 메커니즘의 다른 시점 적용. 합리적이지만 ds 자체로 측정된 건 아니다.

**가설로 정직하게 남기는 게 맞다**

ds why 시리즈가 "선택지 줄이면 결정성 올라간다"를 명제로 단언했다면 약화해야 한다. 정직한 형태는:

> "Constrained decoding·few-shot prompting 분야에서 확인된 메커니즘 — 출력 공간을 제약하면 결정성이 올라간다 — 을 디자인 시스템 어휘 자체에 적용하는 가설. ds 내부에서는 정량 입증 미완."

## 근거 (코드/문서 인용)

- `/Users/user/Desktop/ds/CANONICAL.md:106-112` — 변경 이력에 finder query 승격, raw role 제거 케이스 (선택지 1개씩 줄인 흔적)
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/10_whyNoVariant.md:19-23` — N×M×K 결정 분기 논거 (직관 영역)
- `/Users/user/Desktop/ds/src/ds/ui/2-button-link/` — role 분리 실증
- 인접 증거: Outlines·Guidance·JSON-mode (외부 — 본 프로젝트에 직접 인용 없음)

## 남은 의문

- ds 어휘 vs MUI variant 어휘로 같은 사양 N=100회 생성 → AST 동일성 비율 비교 실험 미수행 (Q2와 연동)
- 사람 prompt가 정교하면 variant도 결정성을 회복할 수 있는데, 그 경우 ds 가치가 약해지는 영역의 경계가 어디인지 미조사
- entropy 직관이 실제 LLM token 분포에 어느 정도로 매핑되는지 — 이론과 측정 사이 갭 미해소
