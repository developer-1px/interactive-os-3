---
id: q02MeasureDeterminism
type: inbox
slug: q02MeasureDeterminism
title: Q2 — "동일 의도 → 동일 출력 분포"는 측정 가능한가?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q2 — "동일 의도 → 동일 출력 분포"는 측정 가능한가?

## 질문

"동일 의도 → 동일 출력 분포"는 측정 가능한가? 어떻게 검증하나?

## 해보니까 알게 된 것

**솔직히 말해서 본 프로젝트에서 정량 측정은 못했다.** ds에는 LLM 결정성 벤치마크가 없다. why 문서는 직관과 일화 증거 위에 서있다. 다만 측정을 시도한다면 어떤 모양일지는 코드 구조에서 보인다.

**측정 가능성에 대한 현실적 입장**

"같다"의 기준을 무엇으로 잡느냐에 따라 측정 가능성이 갈린다.

1. **AST 동일성** — 같은 의도 prompt N회 → 출력의 AST가 같은 비율. ds가 정본화한 영역(예: `definePage` entities tree)은 leaf 데이터만 채우는 구조라 AST 분기 자체가 거의 없다. src/ds/foundations/layout/ 의 Renderer 구조를 보면 트리 노드 종류가 정해져 있어 측정 가능. variant·className이 살아있는 라이브러리는 같은 prompt에 출력 AST가 매번 달라 비교가 어렵다 — **이 비대칭 자체가 ds의 가설을 약하게 지지**한다.

2. **import 분포** — 같은 의도에 대해 `import { X } from '@/ds'`의 X 토큰 분포. 1 role = 1 component이면 X 분포가 sharp(거의 1개 값)해야 한다. 측정 가능. 본 프로젝트 src/ds/index.ts의 named export 목록을 candidate로 받아 분포를 그려볼 수 있다.

3. **셀렉터 형태** — `data-part`·`role`·`aria-*`만 쓰는 비율 vs `className`이 섞인 비율. ESLint custom rule(eslint-rules/)로 정적 측정 가능. 본 프로젝트는 stylelint·custom rule을 가지지만 "결정성 메트릭"으로 묶은 적은 없다.

**왜 아직 측정 안 했는가**

부정직하게 말하면, 측정 결과가 ds 가설을 부정할 수도 있어서다. 정확히는 — variant 금지가 정말로 출력 분포를 sharp하게 만드는지, 아니면 단지 사람이 보기 좋게 만드는지 갈리는 지점이다. 본 프로젝트는 1인 운영이라 controlled experiment가 어렵고, 외부 기여자가 같은 task를 받아 출력하는 환경이 없다. **이건 진짜 갭이다.**

**aria 프로젝트의 단서**

aria는 behavior 단위(treegrid·listbox·tabs)를 제한하고 plugin을 합성하는 구조다. 같은 사양 ("file tree with rename")을 ds 스타일·자유 스타일로 N번 짜게 한 뒤 commands dispatch 시퀀스를 비교하면, 결과는 데이터로 떨어진다. 이게 가장 실현 가능한 측정 시나리오다. 아직 못 돌렸다.

## 근거 (코드/문서 인용)

- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/08_projectWhy.md:73` — "C7: LLM 결정 가능성 추가 검토" — 명문화 자체가 미완료
- `/Users/user/Desktop/ds/eslint-rules/` — 정적 측정 인프라 일부 존재
- `/Users/user/Desktop/ds/src/ds/index.ts` — 정본 어휘 export 목록 (분포 측정의 candidate set)
- `/Users/user/Desktop/aria/src/interactive-os/` — behavior·plugin 단위 (commands sequence 비교 가능)

## 남은 의문

- 어떤 metric이 "사람이 보기 좋다" 와 분리되어 "LLM 결정성"만 측정하는가 — 정의 자체가 아직 모호
- N=100 같은 sample size로 controlled experiment를 어떻게 디자인할지 절차 없음
- 같은 prompt를 같은 모델에 N번 던질 때 temperature·top_p 설정이 결과를 좌우 — ds 효과를 모델 sampling 효과와 분리하는 통계 설계 필요
- ds 가설이 측정으로 부정될 가능성을 진지하게 받아들여야 한다 — 측정 안 하는 게 가설을 보호하는 행동이 되어선 안 됨
