---
id: atlasFnTacitKnowledge
type: inbox
slug: atlasFnTacitKnowledge
title: /atlas fn 개념 순회로 모던 디자인 암묵지·안티패턴·노하우 목록화
tags: [inbox, idea, explain]
created: 2026-04-26
updated: 2026-04-26
---

# /atlas fn 개념 순회로 모던 디자인 암묵지·안티패턴·노하우 목록화

## 배경

`http://localhost:5173/atlas` 의 fn 카탈로그에는 ds가 축적한 함수형 primitive(색·간격·타이포·레이아웃 헬퍼 등)가 모여 있다. 이걸 한 항목씩 훑으면서 "왜 이렇게 생겼는지"를 역으로 풀어보면, 모던 디자인 시스템이 명시적으로 적지 않는 암묵지(tacit knowledge), 흔히 빠지는 안티패턴, 그리고 패턴이 묶이는 경향성(노하우 클러스터)을 추출할 수 있다.

기존 메모리에는 단편적으로 흩어져 있다 — color pair, token tier, classless, content/control 분리 등. atlas fn 순회를 통해 이걸 한 장의 지도로 묶는 것이 목적.

## 내용

### 순회 대상

- `/atlas` 의 fn 카탈로그 (packages/ds/src/fn/* — color, icon, values 등)
- 각 fn의 시그니처·사용처·왜 함수형으로 만들어졌는지

### 추출할 축

1. **암묵지(tacit knowledge)**: 코드는 말하지만 문서는 안 적는 것
   - 예: 색은 surface 소유자만 정한다, item은 weight만 조절
   - 예: 토큰 3-tier (palette → semantic → component)
2. **안티패턴**: fn이 막고 있는 것 (왜 이 fn이 존재하는가의 반대편)
   - 예: cell-level `color: dim(N)` 직접 호출
   - 예: 스타일 전용 className, raw `role="..."`
3. **경향(trend)**: 업계 수렴 방향과 ds의 위치
   - 예: data-driven rendering, classless CSS, ARIA-as-prop
4. **묶음(cluster)**: 함께 등장하는 fn 패턴
   - 예: pair primitive + mute/emphasize 가족
   - 예: layout primitive (Row/Column/Grid) 한정 data-ds
5. **노하우(heuristic)**: "이럴 땐 이거" 류의 결정 규칙

### 산출 형식 (예상)

- atlas의 각 fn 항목 → 위 5축 중 해당하는 것에 핀 꽂기
- 최종 결과: `docs/.../modernDesignTacitMap.md` 또는 area 문서로 승격

## 다음 행동

- [x] `/atlas` 라우트 열어 fn 카탈로그 항목 enumerate (2026-04-26)
- [x] 진단: content 부품 layer 통째 비어있음 — `ds/parts/` 신설 필요
- [x] **P1**: `packages/ds/src/parts/` 신설 — Avatar, Badge(CountBadge alias), Tag, Thumbnail, Timestamp, Skeleton, EmptyState, Callout, KeyValue 9개 + 스타일
- [x] **P2**: atlas Parts 탭 추가 — nav `parts` 항목 + filter 분기 + 9/17 coverage
- [x] **P3**: entity 폴더 정리 — chip/badge에 deprecation 주석, 14개 분류표
- [x] **P4**: atlas demos 자기참조화 — inline-style 18→8(본질만), Callout/Skeleton/Badge/Tag/recipes.microLabel 자기 시연
- [x] FnCard `sites` optional화 — parts에서 dead 시그널 누수 방지
- [x] 메모리 업데이트: `project_ds_parts_layer`, `feedback_no_aria_roledescription_namespace`

### 후속 (별도 세션)
- [ ] `chip → parts/Tag` 마이그레이션 (사용처 1곳: `src/routes/edu-portal-admin/pages/VideoEdit.tsx:260`)
- [ ] `entity/badge.ts` → `entityHighlightMark.ts` rename (`<mark>` 텍스트 하이라이트 의미 명확화)
- [ ] virtual:ds-audit 확장 — parts 표준 17개 대비 coverage 자동 표시
- [ ] 누락 8개 부품 점진 신설: Heading scale, Link, Money(보류), Stat(이미 entity), Progress, Divider(hairline로 충분), Code/Kbd, Breadcrumb
- [ ] 각 fn별 5축 매핑 표 작성 (당초 inbox 동기) — atlas `?fn=name` deep link로 부품마다 메타 표시

## 메모

본 inbox는 "atlas 부족함" 진단 → 4 페이즈 자율 실행 → 메모리 갱신까지 한 번에 닫혔다. /team 편성 후 P1→P2+P3 병렬→P4의 3페이즈 직렬, 각 페이즈마다 code-reviewer 평가자 호출로 4가지 실패 모드 검증.
