---
id: q01ModelImproving
type: inbox
slug: q01ModelImproving
title: Q1 — 모델이 더 좋아지면 ds why가 무너지나?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q1 — 모델이 더 좋아지면 ds why가 무너지나?

## 질문

LLM이 코드를 잘 못 짠다는 게 전제인데, 모델이 더 좋아지면 ds의 why가 무너지지 않나?

## 해보니까 알게 된 것

이 프로젝트를 Opus 4.7(1M context)로 돌리면서 체감한 건 **모델이 좋아질수록 오히려 ds 같은 결정적 시스템의 가치가 더 분명해진다**는 것이다. 이유는 두 가지다.

**1. "잘 짠다"의 정의가 바뀐다**

초기 모델은 "동작하는 코드를 뽑는다"가 목표였다. 그 시기엔 ds 같은 제약이 부담이다. 하지만 Opus 4.7쯤 되면 동작은 거의 다 한다. 문제는 **"이 코드가 다른 곳에서 짠 코드와 같은 형태인가"**로 옮겨간다. 같은 의도("폼 제출 버튼")에 대해 어떤 세션은 `<Button variant="primary" type="submit">`, 다른 세션은 `<button className="btn-primary">`, 또 다른 세션은 `<SubmitButton>`을 뱉으면 — 동작은 다 하지만 코드베이스가 일관성을 잃는다. 이건 모델 능력이 올라간다고 풀리는 게 아니라, **선택지 자체를 줄여야 풀린다**.

packages/ds/src/ui/2-button-link/ 폴더에 SubmitAction·DangerAction·LinkAction이 별도 export로 있는 이유가 이거다. 모델이 "어떤 버튼을 쓰지?"를 고민하는 게 아니라 "이 의도엔 SubmitAction이지"로 lookup하게 만든다.

**2. context가 무한해도 "쓸 수 있는 표현"이 무한이면 분포가 흐트러진다**

모델 발전이 푸는 건 "긴 컨텍스트를 기억한다"·"더 정교한 추론" 쪽이다. 근데 ds가 풀려는 건 "표현 공간 자체의 cardinality"다. variant prop이 5×5×5 = 125개 조합인 컴포넌트는 모델이 좋아져도 여전히 125개 중 하나를 골라야 한다. 모델이 좋아지면 그 선택이 "더 합리적"이 될 뿐, **결정성**은 그대로다. 같은 prompt 두 번 던지면 두 번 다른 조합이 나오는 건 sampling temperature의 본질이지 모델 품질이 아니다.

aria 프로젝트 README의 "조작형 UI 런타임"이라는 framing도 같은 이야기다. 표시형(마케팅 카피·이미지 생성)은 모델이 좋아질수록 사람 손이 빠진다. 조작형(파일 탐색기·칸반)은 모델이 좋아져도 **OS 레이어가 좌표계를 잡아주지 않으면 조각이 안 맞물린다**.

**아직 검증 못한 것**: "모델이 좋아지면 ds 같은 시스템 없이도 일관성을 자가 유지한다"는 반론은 실험으로 부수지 못했다. 가설일 뿐이다. 다만 본 프로젝트에서 다섯 세션을 거치며 같은 라우트(/finder)를 여러 번 손볼 때, **CANONICAL.md가 있는 영역은 다섯 번 다 같은 형태로 수렴**했고, 없는 영역은 매번 표현이 달랐다. 이게 약한 일화 증거다.

## 근거 (코드/문서 인용)

- `/Users/user/Desktop/ds/CANONICAL.md:1-25` — 직렬화·선언적 두 조건이 정본 조건
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/08_projectWhy.md:23-27` — "선택지 폭증"이 풀려는 핵심
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/10_whyNoVariant.md:19-23` — N×M×K 분기 논거
- `/Users/user/Desktop/aria/README.md:9-13` — 조작형 UI 런타임 framing
- `/Users/user/Desktop/ds/packages/ds/src/ui/` — 1 role = 1 component 실증

## 남은 의문

- "ds 없는 코드베이스 vs ds 있는 코드베이스"에서 같은 의도 prompt 100회의 출력 분포가 실제로 다른지 측정 안 됨 (Q2와 연동)
- 모델이 ds CANONICAL.md를 system prompt로 받았을 때 vs 받지 못할 때 결정성 차이 측정 필요
- 모델이 충분히 좋아지면 "프로젝트 코드 스타일을 자가 추론"해 일관성을 회복할 가능성도 배제 못함 — 이 가능성이 실현되면 ds의 why 일부가 약화됨
