---
id: q23ThirdPartyCoexistence
type: inbox
slug: q23ThirdPartyCoexistence
title: Q23 — react-select·react-table 같은 서드파티와 어떻게 공존?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q23 — react-select·react-table 같은 서드파티와 어떻게 공존?

## 질문

서드파티 컴포넌트(react-select, react-table)와 어떻게 공존하나?

## 해보니까 알게 된 것

ds는 **알고리즘·headless 라이브러리**는 흡수하고, **시각 라이브러리**는 추방한다. 둘이 다르다.

### 흡수 (가능)

- **TanStack Table·TanStack Query·zod·shiki**: 헤드리스 또는 데이터 변환 도구. 시각이 없거나 HTML 문자열을 내놓는다 → entity boundary 안에서 사용. 실제로 finder 라우트가 TanStack Router를, CodeBlock이 shiki를 그렇게 흡수한다.
- **Radix·Ariakit·RAC**: ds 어휘의 **선행 참조**. 직접 import하지 않고 "수렴 패턴 채택"의 입력으로만 사용(P5).

### 추방 (불가)

- **react-select·MUI DataGrid·AntD Form**: 시각·prop·variant·className을 다 들고 온다. ds 정본 4개 모두 위반(variant·classless·data-driven·escape hatch). 페이지 안에 박는 순간 ds 가치가 무너진다.

### 진짜로 필요할 때

도메인 알고리즘이 막대(예: 가상 스크롤된 100만 row 표)이면:
1. 시각 시작은 ds 어휘로(`role="grid"`·`role="row"`·`role="gridcell"`)
2. 알고리즘만 서드파티에서 빌려옴 (TanStack Virtual 같은 것)
3. boundary는 entity로 격리 — 라이브러리가 toss하는 ref·callback은 entity 내부에서만 해소

react-table은 v8(TanStack Table)이 헤드리스라 흡수 가능. **시각을 가진 옛 react-table v7는 추방.** 이름은 같지만 ds 입장에서 다른 도구다.

### 결론

"공존"은 **알고리즘 layer에서**만 일어난다. 시각 layer에서는 공존 안 한다 — 둘 중 하나만 살아남는다.

## 근거

- /Users/user/Desktop/ds/src/ds/ui/0-primitive/CodeBlock.tsx (shiki 흡수, dangerouslySetInnerHTML 격리)
- /Users/user/Desktop/ds/CANONICAL.md:52 (신뢰된 HTML payload entity)
- /Users/user/Desktop/ds/CANONICAL.md:79 (Radix·Base·Ariakit·RAC 수렴 참조)
- /Users/user/Desktop/ds/src/routes/finder/finder.feature.ts (TanStack 기반 wiring 사례)

## 남은 의문

- 헤드리스/시각 경계가 회색인 라이브러리(예: react-aria의 일부 hook + 일부 component)에서 흡수/추방 룰이 명확치 않음
- 서드파티가 내부에서 className을 박아두면 classless 원칙이 외관상 위반된다. 이 격차를 측정·차단하는 lint 없음
