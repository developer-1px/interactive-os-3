---
id: q24FigmaTokenSync
type: inbox
slug: q24FigmaTokenSync
title: Q24 — Figma·디자인 도구와 토큰 동기화?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q24 — Figma·디자인 도구와 토큰 동기화?

## 질문

디자인 토큰을 외부(Figma·디자인 도구)와 어떻게 동기화하나?

## 해보니까 알게 된 것

**아직 안 하고 있다.** ds 코드베이스 안에 Figma sync 파이프라인은 없다. 원칙만 있다.

### 원칙 (직렬화 필터의 자연스러운 결과)

토큰은 정의상 직렬화 가능한 key→value 매핑이다. palette(raw)·foundations(semantic)는 둘 다 JSON으로 round-trip 가능. 따라서 Figma Variables ↔ ds tokens는 **양방향 직렬화 동기화**가 원칙적으로 가능.

방향성:
- **단방향: Figma → ds** — Figma Variables export → JSON → palette·semantic 갱신. 디자이너가 값을 정한다.
- **단방향: ds → Figma** — ds tokens → Figma Variables import. 코드가 값을 정한다.
- **양방향** — 충돌 룰 필요. ds 입장에서는 **어느 쪽이 source of truth인가** 결정이 먼저.

ds의 정본 갱신 절차(CANONICAL 92~97)를 토큰에도 적용하면 Figma에서 온 변경도 "반례 → 후보 평가 → 합의 → 갱신" 4단계를 거친다. 즉 **자동 sync는 안 한다** — 수동 갱신이 정본 절차에 더 잘 맞는다.

### 코드에 있는 것

- `palette/`·`foundations/color/semantic.ts` 같은 진입점이 1곳으로 모여 있어서 import·export가 기술적으로 단순하다
- `recipes/`도 동일 — 묶음 단위로 dump 가능

### 코드에 없는 것

- Figma plugin / Tokens Studio integration
- CI에서 Figma diff 감지
- design-extract 스킬은 외부 사이트 실측 추출용이고 Figma 실시간 sync와는 다른 것

### 솔직한 답

ds는 "tokens가 데이터다"까지만 정본화했고 "Figma와 자동 sync한다"는 정본화하지 않았다. 자동 sync는 결정 축소 원칙과도 약간 결이 안 맞는다 — sync가 빈번하면 토큰이 자주 흔들리고, ds 어휘 안정성이 떨어진다.

## 근거

- /Users/user/Desktop/ds/packages/ds/src/foundations/color/semantic.ts
- /Users/user/Desktop/ds/packages/ds/src/palette/ (raw scale 진입점)
- /Users/user/Desktop/ds/CANONICAL.md:92-97 (정본 갱신 절차)
- 메모리 — design-extract 스킬 (실측 추출 — Figma sync와 다름)

## 남은 의문

- Figma Variables 표준이 안정화되면 sync가 자연스러워질 수 있는데, 그때 ds가 자동/수동 어느 쪽을 채택할지 미정
- 디자이너 ↔ 코드 경계의 governance(누가 source of truth)는 Q41 거버넌스와 묶여서 미해결
