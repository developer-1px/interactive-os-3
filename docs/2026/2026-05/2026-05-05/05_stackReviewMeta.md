---
id: stackReviewMeta
type: inbox
slug: stackReviewMeta
title: 04_stackReview 메타-리뷰 — 누락·편향·과대/과소평가
tags: [inbox, retro, meta-review]
created: 2026-05-05
updated: 2026-05-05
---

## 1. 누락된 차원

리뷰는 "정체성·어휘·store·추상화·boilerplate·확장성·문서·테스트" 8축으로 짰다. 빠진 축:

- **성능/리렌더 비용** — `setMeta(prev => reduce({...data, meta:prev}, e).meta ?? prev)` 가 모든 이벤트마다 전체 doc spread + reduce 재실행. tree `findParent` O(N) 도 키 입력마다. 측정 0.
- **번들/런타임 크기** — `@p/headless` 가 9 verb 라우터·zod-crud 동형 union 을 다 싣는데 사용처가 verb 1~2개만 쓸 때 tree-shake 가능 여부 미점검.
- **스크린리더/실사용 a11y** — ARIA-faithful 을 표방하나 NVDA/VoiceOver 실제 announce 검증 0. role/aria 속성이 *문법적으로* 맞다는 것과 *발화* 가 맞다는 것은 다르다.
- **에러 경로** — `routeUiEventToCrud` 가 9 verb 외 입력, crud op 실패, schema 위반 시 동작 미점검. happy-path 만 본다.
- **동시성/race** — `crud.subscribe` 콜백과 `dispatch` 사이의 순서, unmount 중 setMeta — useEffect cleanup 검증 없음.
- **API 안정성/버전** — UiEvent union 변경이 곧 `@p/headless` breaking. semver 정책 언급 0.
- **DX 회복성** — 잘못 쓸 때의 type error 메시지 품질, `editable` 부분키셋의 컴파일타임 표현 가능성.

## 2. 편향/그룹씽크

3 페르소나(U/R/Y)가 *형식상* 대립하지만 **모든 8개 차원에서 결론 방향이 같다** — 모두 "강점도 있고 약점도 있다, 권고는 부분 흡수". 진짜 충돌(예: U "더 추상화해라" vs Y "지우자")이 0건.

§3(useFeature) 분석: U·R·Y 셋 다 "useFeature 는 N=1, premature" 로 수렴. 반대 옹호자 부재. defineFeature 가 *future-proof spec layer* 라는 입장(예: outliner 가 scope·flow·multi-resource 가 늘면 자연 흡수)을 아무도 안 변호했다. 합의편향.

§2 도 마찬가지 — "두 spec 권위 공존이 흠집" 에 셋 다 동의. "ARIA spec 자체가 편집 verb 를 정의 *안 한* 공백을 zod-crud 로 메우는 게 정합" 이라는 반론 부재.

## 3. 과대평가 항목

- **§1 "import graph cleanly inverted" → 강점 ✅** — 사실 `CrudPort` 가 `JsonCrudInterface` 의 alias 라는 R 의 지적이 강점을 무력화하는데도 "Top strength" 1번에 그대로 박제됨.
- **§5 Top strength "부채가 문서화되어 있어 silent drift 는 아니다"** — 문서화된 부채를 강점으로 셈하는 건 인정편향. 미흡수 부채는 부채다.
- **§7 INVARIANTS B16 일치 ✅** — 한 invariant 1건 점검으로 "문서/메모리 일치" 강점 결론. 표본 1.

## 4. 과소평가 항목

- **§4 약점**: tree `findParent` O(N) per keystroke — Y 가 "회귀 테스트 없음" 으로만 처리, 큰 트리(>10³ 노드)에서 성능 회귀 위험. 측정 권고 누락.
- **§6 비-위계 backend 충돌**: "네번째 example 에서 재설계" 로 미룸 — 그러나 UiEvent 가 이미 `@p/headless` *공개 API* 라 후행 재설계 = breaking. 미루기 비용 과소.
- **§8 app 단위 회귀 0**: "보통" 으로 평가했지만 outliner/kanban 이 zod-crud 와 헤드리스의 *유일한 통합 증거* 인데 둘 다 test 0건은 "보통" 이 아니라 *blocking* 수준.
- **§2 invariant 부분 위반**: "Vocabulary closed (ARIA)" 가 깨졌다고 자백하면서 권고는 "EditEvent 분리로 *표면* 만 가르자" — 문제 해결이 아니라 표기 변경에 그침.

## 5. 차원 간 모순

- §3 "useFeature N=1 → premature" 와 §5 "useResource 가 meta 흡수해야 한다(=feature 같은 합성 책임 추가)" 가 충돌. meta 흡수가 진행되면 `useResource` 가 사실상 mini-feature 가 되어 `useFeature` 와 책임 중첩 — 둘 중 어느 쪽으로 수렴할지 결정 부재.
- §2 "어휘 1:1 lock-in 약점" 과 §1 "Top strength: 어휘 1:1 박제" 가 같은 사실에 정반대 부호.

## 6. Must-act 재정렬

리뷰의 1순위 = "useResource meta 흡수". 진짜 1순위 후보:

1. **outliner/kanban screen-test 1쌍** (Tab indent → focus 이동, Cmd+X→V 사이클). 통합 증거 0 인 채로 어떤 흡수도 silent regression. 흡수 *전제조건*.
2. **useResource meta 흡수** (현 1순위). 단 #1 이 먼저여야 안전.
3. **UiEvent 어휘 권위 표면 분리** (`UiEvent = NavigateEvent | EditEvent`). public API 굳기 전에 — 미루면 breaking.

리뷰의 1순위는 가치는 있으나 *순서* 가 틀렸다. 안전망 없이 store 핵심을 손대는 것.

## 7. Grade 재평가

리뷰 자체 등급: **C+**.

- 형식(8축·3페르소나)은 갖췄으나 페르소나가 실제로 충돌하지 않아 다관점 가치 절반.
- 성능·a11y 실측·에러·동시성·API stability 5개 큰 축 누락.
- Must-act 우선순위가 안전망(test) 보다 핵심 손대기를 앞세움.
- 종합점수 B+ 는 후하다 — 누락 5축을 더하면 스택 자체도 B 정도.

---

**Reviewer 의 가장 큰 사각지대**: 통합 회귀 테스트 0인 상태에서 store 핵심 리팩토링을 1순위로 권고한 것 — 측정·증거 없이 "잘 됐다" 를 선언하는 happy-path 편향.
