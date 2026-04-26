---
id: q21MultiTenantBranding
type: inbox
slug: q21MultiTenantBranding
title: Q21 — SaaS multi-tenant에서 테넌트별 시각 customization은?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q21 — SaaS multi-tenant에서 테넌트별 시각 customization은?

## 질문

SaaS multi-tenant에서 테넌트별 시각 customization은 어떻게?

## 해보니까 알게 된 것

원칙상 답은 명확하다 — **foundations semantic token tier가 테넌트 boundary**다. 컴포넌트·트리는 모든 테넌트가 동일, 토큰만 다르다. 다만 코드베이스 안에서 multi-tenant를 본격적으로 돌려본 적은 없다.

### 흡수 layer (위에서 아래)

1. **palette tier** — 절대 테넌트가 손대지 않음. raw scale은 ds 소유.
2. **semantic tier** — 테넌트가 brand color를 주입하는 자리. `--brand`·`--surface-hero` 등의 mapping이 테넌트 config로 swap.
3. **컴포넌트** — 손 못 댐. 모든 테넌트 동일.
4. **definePage tree** — 손 못 댐. 모든 테넌트 동일.
5. **content** — 테넌트별 logo·텍스트는 entity data로. 컴포넌트 prop이 아니다.

### 직렬화 필터 통과

테넌트 config = JSON. semantic token mapping = key→value 매핑. 둘 다 직렬화 가능 → 정본 통과. 

테넌트가 컴포넌트 코드를 fork하거나 className을 주입하는 길은 0 — escape hatch 0개 원칙(P4). "이 테넌트만 살짝 다르게"는 정본을 바꿔서 모든 테넌트에 적용하든지, 안 받든지 둘 중 하나.

### 한계

테넌트가 "버튼 모양 자체가 round vs square"처럼 **shape semantics 수준**의 차이를 요구하면 어렵다. 토큰으로는 색·간격·typography까지 흡수되지만 shape token은 좁다. 이때 두 길:
- shape도 semantic token tier로 승격(`--radius-action`)
- 거부 — "ds 안에서는 그 차이가 없다"고 통보

ds 입장은 후자에 가깝다. "테넌트별 customization 자유도"는 의도적으로 좁힌다.

## 근거

- /Users/user/Desktop/ds/src/ds/foundations/color/semantic.ts
- /Users/user/Desktop/ds/src/ds/foundations/shape/ (shape token 정의 위치)
- /Users/user/Desktop/ds/CANONICAL.md:84 (palette/foundations 2층)
- /Users/user/Desktop/ds/CANONICAL.md:81 (escape hatch 0개)

## 남은 의문

- 실제 multi-tenant 라우트가 코드베이스에 없어서 "원칙상 이렇다"가 검증 안 됨
- 테넌트 config의 boundary 검증(zod parse) 위치가 미정 — `@p/capability-tenant`? `@p/app`?
- shape·motion까지 semantic 승격 압력이 들어왔을 때 token 이름이 폭증하는 것을 막는 룰 없음
