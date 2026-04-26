---
id: q22MuiMigration
type: inbox
slug: q22MuiMigration
title: Q22 — 기존 MUI 앱을 ds로 점진 마이그레이션?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q22 — 기존 MUI 앱을 ds로 점진 마이그레이션?

## 질문

마이그레이션 — 기존 MUI 앱을 ds로 옮길 때 점진 전환 경로는?

## 해보니까 알게 된 것

**해본 적 없다.** 이 질문에 대한 ds의 답은 사고 실험 수준이다. 솔직하게 적는다.

### 가능해 보이는 경로

1. **bottom-up: 페이지 1개부터** — 라우트 1개를 골라 그 안의 MUI 컴포넌트를 ds 어휘로 교체. 다른 라우트는 그대로 MUI. 두 시스템이 라우트 boundary로 격리되니까 미끄러짐이 적다.
2. **outside-in: foundations부터** — MUI theme provider를 들어내고 ds foundations(palette → semantic)를 먼저 박는다. MUI 컴포넌트가 CSS variable을 따르도록 하면 시각적으로는 ds, 어휘는 MUI인 중간 상태가 만들어진다. 이 상태에서 컴포넌트 단위 교체.
3. **레이아웃부터** — `definePage`·Renderer를 도입해서 페이지 골격만 ds로 바꾸고, slot 안에 MUI 트리를 넣는다. layer가 클수록 위에서 흡수되는 구조라 점진성이 자연스럽다.

### 어려워 보이는 부분

- **variant prop 미끄러짐 차단** — MUI 코드는 `<Button variant>`이 도처에 있다. 자동 codemod로 바꾸기 어렵다. 의미별 컴포넌트 분리(SubmitAction·DangerAction)가 사람의 판단을 필요로 한다.
- **className·sx 자유도** — escape hatch 0개를 지키려면 결국 모든 sx를 들어내야 한다. 이건 점진이 어렵다 — 한 번에 끝내야 한다.
- **함수 prop(render prop·callback)** — 직렬화 필터에 걸린다. 데이터 + dispatch로 풀어야 하는데, 도메인 로직 변경을 동반한다.

### 솔직한 결론

"점진 마이그레이션 경로"라는 단어가 **ds 정본과 양립 안 한다**. ds는 "들어오는 코드도 정본을 따른다"이지 "기존 코드를 살살 끌어온다"가 아니다. 점진은 가능하지만 **혼합 상태가 길어지면 ds의 가치(결정 축소)가 무너진다.** 차라리 페이지 1개씩 완전 교체하고 그 페이지는 ds 100%로 두는 격리 전략이 맞아 보인다.

## 근거

- /Users/user/Desktop/ds/CANONICAL.md (정본 전체) — 점진 경로 명시 없음
- /Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/10_whyNoVariant.md:98-107 (variant 1개 허용의 미끄러짐)
- 메모리 feedback_no_escape_hatches (raw role 0개)

## 남은 의문

- 실제 MUI → ds codemod 도구가 없다 — variant 분기를 의미별 컴포넌트로 어떻게 자동 변환할지 미설계
- "혼합 상태가 길어지면 가치 무너진다"는 가설인데, 실제 마이그레이션 프로젝트로 검증된 건 아님
- ds가 외부 도입을 받아들일 의사가 있는가 자체도 미정 (오픈소스화 정책 없음 — Q45)
