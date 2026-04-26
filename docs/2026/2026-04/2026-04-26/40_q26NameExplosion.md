---
id: q26NameExplosion
type: inbox
slug: q26NameExplosion
title: Q26 — variant 금지로 이름이 폭증하면 LLM이 이름을 잘못 부르지 않나?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q26 — variant 금지로 이름이 폭증하면 LLM이 이름을 잘못 부르지 않나?

## 질문

variant 금지 → 이름 폭증. 어휘가 커지면 LLM이 이름 자체를 잘못 부르지 않나?

## 해보니까 알게 된 것

실제로 ds/ui를 까보면 폴더가 `0-primitive ~ 8-layout`까지 9층, 그 안의 컴포넌트는 ARIA role 이름을 그대로 가져가서 종류가 그렇게 많지 않다. role 자체가 W3C에서 닫힌 집합이기 때문이다 — `button·link·tab·tabpanel·menuitem·option·row·gridcell·treeitem·dialog·alertdialog·…` 정도에서 끝난다. variant를 풀었을 때 생기는 `PrimaryButton·DangerButton·GhostButton·IconButton·LoadingButton·…`의 조합 폭발과는 차원이 다르다.

ds/parts/도 마찬가지다 — `Avatar·Badge·Breadcrumb·Callout·Card·Code·EmptyState·Heading·KeyValue·Link·Phone·Progress·Skeleton·Table·Tag·Thumbnail·Timestamp` 17개. `ContractCardLarge·ContractCardCompact·ContractCardWithAvatar`처럼 변형을 펼쳤으면 50개도 우습게 넘었을 것이다.

LLM이 이름을 잘못 부르는 건 "이름이 많아서"가 아니라 "같은 의미의 이름이 여러 개라서"다. `Btn·Button·CTAButton·ActionButton`이 공존할 때 LLM은 분포에서 가장 흔한 걸 던진다. ds는 ARIA 1곳으로 수렴시켜서 이 분기를 제거한다 — `<button>` 태그가 곧 button role이고, role과 컴포넌트 이름이 같다.

오히려 variant 허용 시스템이 이름을 더 못 부른다. `<Button variant="destructive">`인지 `variant="danger"`인지 `intent="danger"`인지 `color="red"`인지 — 라이브러리마다 다르고 LLM은 매번 헷갈린다.

## 근거

- /Users/user/Desktop/ds/packages/ds/src/ui/ — role별 폴더 구조 (총 9층)
- /Users/user/Desktop/ds/packages/ds/src/parts/index.ts — parts 17개
- /Users/user/Desktop/ds/CANONICAL.md:79 — "Trigger/GroupLabel/Submenu*/TabPanel 별도 export. Radix·Base·Ariakit·RAC 최소 2곳 수렴 시 채택"
- /Users/user/Desktop/ds/CANONICAL.md:80 — "prop 이름은 ARIA 그대로. 인위적 통일 금지"

## 남은 의문

- ARIA 외 ds 고유 어휘(SearchBox·CommandPalette 등)가 늘어날수록 다시 분기가 생긴다 — 이때 수렴 기준은?
- "최소 2곳 수렴 시 채택"의 2곳이 같은 가계도(Radix → Base)일 때는 진짜 수렴인가?
