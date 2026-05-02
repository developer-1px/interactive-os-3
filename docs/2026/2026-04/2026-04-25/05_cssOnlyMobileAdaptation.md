---
id: cssOnlyMobileAdaptation
type: inbox
slug: cssOnlyMobileAdaptation
title: CSS-only 모바일 적응 합의 — JS 셸 분기 도입/제거 회고
tags: [inbox, retro, decision]
created: 2026-04-25
updated: 2026-04-25
---

# CSS-only 모바일 적응 합의 — JS 셸 분기 도입/제거 회고

## 배경

`Finder`의 모바일 처리 방식을 정리하던 중, 메모리 원칙 `"shell·control은 desktop·mobile 별도 구현"`에 따라 JS-level shell-mode 분기 architecture를 도입했다. 약 12개 커밋을 거쳐 L0~L3 4-layer까지 lock-in했고, 중립 감사를 받았다. 그 결과 "위계 ✓, 채택 1/9 (Finder만)"이 드러났고, 후속 마이그레이션을 진행하던 중 **사용자가 도입한 primitive 전체를 제거**하고 CSS-only 적응으로 방향을 합의했다. 이 결정 자체가 가치 있는 신호이므로 회고로 남긴다.

## 내용

### 도입 — 무엇을 만들었나

| Layer | 산출 |
|---|---|
| L0 token | `--ds-shell-mobile-max` (CSS), `SHELL_MOBILE_MAX` const (TS) |
| L0 hook | `useShellMode(): 'desktop' \| 'mobile'` |
| L1 shell | `<ShellSwitch desktop={...} mobile={...}/>` |
| L2 gesture | `useSwipe`, `useSwipeAxis`, `swipe(orientation)` axis, `Trigger.swipe`, `bindAxis.onSwipe` |
| L3 content | `@container` 패턴 (atlas-card-grid, list-view, preview) |
| guard | `lint:ds-shell` R1/R2/R3 |
| 라우트 적용 | `Finder` (`<ShellSwitch>` + `FinderMobile` + `mobile/` 5 컴포넌트), `Catalog`/`EduPortalAdmin` (`useShellMode`), Catalog `mobile` 카테고리 큐레이션 |

### 감사 결과 — 위계 ✓, 수렴 ✗

병렬 4 렌즈(아키텍처/스멜/API 사용자/invariant)의 독립 평가가 같은 사실 3개를 확인했다.

1. **JS↔CSS 약속 절반만**: 토큰은 정의됐지만 CSS @media에 600px 리터럴 7개 잔존 → R3 위반
2. **1 reference, 0 spread**: ShellSwitch 채택 1/9 route. EduPortalAdmin은 `window.matchMedia` 직접 호출(R1 위반)로 회귀
3. **gesture 0 consumer**: useSwipeAxis/swipe axis는 export만 되고 실사용 0. composeAxes 6곳 모두 미투입

핵심 위반: `var(--ds-shell-mobile-max)` 직접 참조 CSS 0회. 토큰의 약속(JS와 CSS가 같은 출처)이 절반만 지켜짐.

### 후속 마이그레이션 — 1~3 진행

토큰화·EduPortalAdmin 마이그레이션·lint 등록. lint 위반 10 → 0, ShellSwitch 채택 1/9 → useShellMode 채택 2/9.

### 사용자의 방향 전환 — 전체 제거

step 4(widget self-sizing) 진행 중 사용자가:

- `Finder.tsx` 주석: `"Mobile/Desktop 분기는 CSS가 담당 (panes.ts container query). JS는 데스크톱 셸 한 본만."`
- `EduPortalAdmin.tsx`: `useShellMode` 제거, `[navOpen]` 토글만 유지
- 파일 삭제: `useShellMode.ts`, `ShellSwitch.tsx`, `useSwipe.ts`, `useSwipeAxis.ts`, `axes/swipe.ts`, `FinderMobile.tsx`, `finder/mobile/*` 5 컴포넌트, `catalog/mobile.tsx`
- 코드 수정: `bind.ts`(onSwipe 제거), `trigger.ts`(swipe kind 제거), `axes/index.ts`(swipe export 제거)

### 새 정책

> **viewport는 CSS만 본다. JS는 단일 트리, mode를 모른다.**

| 살아남은 것 | 사라진 것 |
|---|---|
| `--ds-shell-mobile-max` 토큰 (CSS @media interpolation) | `useShellMode()` |
| `SHELL_MOBILE_MAX` const (build-time) | `<ShellSwitch>` |
| `lint:ds-shell` R1/R2/R3 (CSS-only 강제) | `useSwipe`, `useSwipeAxis` |
| `@container` 패턴 (atlas/list-view/preview) | `swipe()` axis primitive (Trigger.swipe) |
| Outer-layout 정책 주석 (invariant vs contextual) | `FinderMobile`, `mobile/` 분리 폴더 |
| 토큰 단일 출처 (preset.shell.mobileMax) | catalog `mobile` 카테고리 큐레이션 |

### 회의론자가 옳았던 점

- "1 reference, 0 spread"는 architecture 채택의 진짜 시그널. 한 라우트가 따라가야 위계가 진짜다.
- export만 되고 0 consumer인 primitive는 self-promotion으로 보일 수 있다. catalog `mobile` 카테고리에 카드로 띄운 건 "정착했다는 가짜 시그널"이었다.
- "도입은 끝, 마이그레이션은 시작도 안 함"이 정직한 표현이었다.

### 옹호자가 옳았던 점

- primitive lock-in과 위계 그림이 없었다면 9가지 변형이 나왔을 것 — 가설은 맞았다.
- 토큰화·@container 마이그레이션·lint:ds-shell은 살아남았다. 이 셋은 CSS-only 정책에서도 동일하게 유효하다.
- 4-layer 토론 자체가 사용자의 방향 결정을 도왔다. "L1 ShellSwitch가 강제하지 않는다"는 인식이 "그러면 L1 자체를 빼자"로 이어졌다.

### 메모리 원칙과의 충돌

`MEMORY.md`의 다음 항목이 새 정책과 충돌한다:

```
- 반응형은 컨텐츠만 — Grid 같은 컨텐츠만 reflow,
  shell·control은 desktop·mobile 별도 구현. CSS로 shell DOM reshape 금지
```

새 정책은 정확히 그 반대로 — **shell DOM reshape를 CSS @media로 한다** (Catalog/EduPortalAdmin의 sidebar drawer가 CSS @media + `data-nav-open` 토글로 동작). 이 원칙은 갱신 또는 삭제가 필요하다.

## 다음 행동

- [ ] `MEMORY.md`의 `반응형은 컨텐츠만` feedback 항목 갱신 또는 삭제 (현재 코드와 불일치)
- [ ] 새 정책을 메모리에 기록: "CSS-only 모바일 적응 — JS는 viewport mode를 모른다, CSS @media + @container만"
- [ ] L4 감사가 지적한 widget self-sizing 누수 (panel/sidebar/column) 정리 여부 결정 — invariant vs contextual 정책으로 step 4에서 일부 정리됨, 나머지는 별도 PR

## 핵심 신호

> **"도입 → 사용 안 됨 → 제거"는 over-engineering을 빼는 정직한 수렴이다.**
> Architecture가 회귀한 게 아니라, *옳은 회의론자에게 자리를 내주고 단순해진* 결과.
> 12 커밋 동안 옹호자가 만든 layer가 사용자의 의사결정으로 1주일 만에 정리됐다.
> 만든 것의 양보다 *지금 쓰는 것이 옳은가*가 architecture의 진짜 척도였다.
