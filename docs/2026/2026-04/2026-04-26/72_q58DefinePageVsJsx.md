---
id: q58DefinePageVsJsx
type: inbox
slug: q58DefinePageVsJsx
title: Q58 — definePage entity tree = JSX 이름만 바꾼 것 아닌가?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q58 — definePage entity tree = JSX 이름만 바꾼 것 아닌가?

## 질문

`definePage({ entities, relationships })`는 결국 트리 구조다. JSX도 트리 구조다. `<Page><Header/><Body/></Page>` 와 `definePage({...})`는 같은 정보를 다른 문법으로 쓴 것 아닌가? 왜 새 표기를 만들었나?

## 해보니까 알게 된 것

표면 구조는 같지만 **무엇이 데이터로 환원되는가**가 다르다.

- JSX는 ReactElement를 만든다. 노드에는 함수 reference(컴포넌트 type), closures(prop으로 캡처된 onClick), children fragment가 박힌다 — JSON.stringify 시 깨진다.
- `definePage`는 `NormalizedData`를 반환한다(`packages/ds/src/layout/definePage.ts:12`). 그냥 객체다. round-trip 가능하다.

이게 가능한 이유는 entity의 `kind` 필드가 **registry lookup key**이기 때문이다. JSX에서 `<Sidebar/>`는 `Sidebar` 컴포넌트 함수 reference를 박지만, `definePage` 안의 `{ id:'sidebar', kind:'Sidebar' }`는 문자열 key 하나만 박는다. Renderer가 `kind` → 컴포넌트를 registry에서 찾는다(`packages/ds/src/layout/registry.ts`).

세 가지가 따라온다.

1. **저장 가능** — URL·DB·파일에 그대로 직렬화. JSX는 불가.
2. **검증 가능** — `validatePage`가 orphan/cycle/unknown kind를 dev에 경고(`definePage.ts:13-15`). JSX는 런타임 마운트 후에나 안다.
3. **변환 가능** — entity tree에 map/filter/replace를 데이터 변환으로 적용 가능. JSX는 React.cloneElement 같은 우회로 필요.

즉 "이름만 다른 JSX"가 아니라, **JSX의 함수-reference 슬롯을 문자열 kind로 치환해 직렬화 차원을 한 단계 내린 표현**이다. CANONICAL의 정본 원칙(선언적 + 직렬화 가능)을 통과하려면 JSX는 못 쓴다.

## 근거

- `/Users/user/Desktop/ds/packages/ds/src/layout/definePage.ts:1-17` — identity wrapper + dev validation
- `/Users/user/Desktop/ds/packages/ds/src/layout/registry.ts` — kind → component lookup
- `/Users/user/Desktop/ds/CANONICAL.md:7-11` — 선언적 + 직렬화 가능이 정본 통과 조건
- `/Users/user/Desktop/ds/CANONICAL.md:33` — 앱 레이아웃 정본 = definePage entities tree

## 남은 의문

- entity prop에 함수가 들어가면 다시 깨진다 — 현재 어떤 kind에 어떤 prop schema가 허용되는지 zod 강제는 미적용
- registry에 미등록된 kind가 prod에서 실패하는 경로(현재는 dev warning만) — fail-fast 정책 필요
- JSX 임시(Row/Column/Grid)는 "이유 명기 시" 허용 — 그 게이트가 PR review로만 지켜지는 중
