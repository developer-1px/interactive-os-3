# @p/aria-kernel

ARIA 행동 인프라 — axis 합성, roving tabindex, gesture/intent 변환, FlatLayout 선언적 트리, Resource 단일 데이터 인터페이스. 토큰/CSS/UI 어휘 0건.

## 설치

```bash
npm install @p/aria-kernel
# peer
npm install react@^19
```

또는 file 경로 (모노레포 인접):

```bash
npm install file:../ds/packages/aria-kernel
```

## 한 줄 사용

```tsx
import { useSpatialNavigation } from '@p/aria-kernel'

function Toolbar() {
  const { ref, onKeyDown } = useSpatialNavigation<HTMLDivElement>(null, {
    orientation: 'horizontal',
  })
  return (
    <div ref={ref} onKeyDown={onKeyDown} role="toolbar">
      <button>A</button><button>B</button><button>C</button>
    </div>
  )
}
```

## 8 카테고리

| 카테고리 | 핵심 export |
|---|---|
| **Types** | `Entity` · `NormalizedData` · `UiEvent` · `ROOT` · `CollectionProps` · `ControlProps` |
| **Axes** | `composeAxes` · `navigate` · `activate` · `expand` · `treeNavigate` · `typeahead` |
| **Roving** | `useRovingTabIndex` · `useSpatialNavigation` |
| **Gesture** | `composeGestures` · `navigateOnActivate` · `selectionFollowsFocus` · `expandBranchOnActivate` · `activateProps` |
| **State** | `reduce` · `fromTree` · `fromList` · `useControlState` · `useEventBridge` |
| **Flow** | `defineFlow` · `useFlow` · `FlowDef` · `Resource` · `useResource` · `defineResource` · `readResource` · `writeResource` |
| **Feature** | `defineFeature` · `useFeature` · `invalidateQuery` |
| **Layout** | `definePage` · `defineLayout` · `defineWidget` · `merge` · `node` · `placementAttrs` · `validatePage` |
| **Middleware** | `defineMiddleware` |

## Subpath imports

```ts
import { composeAxes, navigate } from '@p/aria-kernel/axes'
import { useRovingTabIndex } from '@p/aria-kernel/roving/useRovingTabIndex'
import { definePage } from '@p/aria-kernel/layout'
```

## UI Registry Augmentation

`UiNode.component`을 등록된 이름 set으로 좁히기:

```ts
declare module '@p/aria-kernel/layout/nodes' {
  interface Register {
    component: keyof typeof uiRegistry
  }
}
```

## 22개 invariant

`INVARIANTS.md` 참조 — APG 외부 권위 7 + ds 아키텍처 선언 9 + 논리적 필연 3 + 파생 3.

위반은 버그 또는 정책 전환이지 개선이 아니다.

## 빌드

```bash
pnpm build       # esm + cjs + dts → dist/
pnpm typecheck   # tsc --noEmit
pnpm clean       # dist/ 제거
```

## 라이선스

MIT
