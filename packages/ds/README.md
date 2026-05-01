# @p/ds — style layer canonical

DS는 두 가지만 제공한다:

```
tokens/      ref(scalar) + sys(semantic) + internal
ui/          role-pure component + sibling .style.ts
```

그 외 모든 CSS는 **소비처가 소유**한다 (shells / apps).

## 어디에 무엇을 두는가

| 만들 것 | 위치 | 패턴 |
|---|---|---|
| **새 role-pure 컴포넌트** | `ui/<tier>/<Component>.tsx` + `<Component>.style.ts` | sibling 1:1 |
| **content 패턴** (Card/Row/Post …) | `ui/patterns/<Name>.style.ts` 또는 `features/<Name>.style.ts` | sibling, css.ts 등록 |
| **앱 chrome** (sidebar shell, command palette …) | `packages/ds/src/shells/<area>/<name>.style.ts` | shells 소유 |
| **앱 페이지** (board/chat/feed/inbox …) | `apps/<app>/src/{style.ts \| pages.style.ts}` | 앱 소유, `main.tsx` 등록 |
| **DS 전역 reset / preset** | `tokens/internal/{seed,preset,states,shell}.ts` | DS internal |

`packages/ds/src/style/widgets/` 는 **legacy buffer** — 새로 추가하지 않는다.

## sibling 작성 규칙

### 1. 파일

```
ui/2-input/
  Switch.tsx          ← role-pure 컴포넌트
  Switch.style.ts     ← 같은 폴더, 같은 이름
```

배럴(`Switch/index.tsx`) ❌ — 형제 파일.

### 2. import

```ts
// ui/2-input/Switch.style.ts
import { accent, border, css, control, radius } from '../../tokens/semantic'
import { font, pad } from '../../tokens/scalar'  // raw 명시 import 정당
```

- semantic 우선 (text · surface · border · accent · control · slot · proximity · hierarchy …)
- raw scale (pad · font · weight · elev) 이 *명시적으로* 필요하면 `tokens/scalar` 직접 — 의도 표시
- `palette` ❌ (deprecated 어휘)

### 3. export 시그니처

```ts
export const cssSwitch = () => css`
  button[role="switch"] {
    /* … */
  }
`
```

- 이름: `css<Component>` (PascalCase 컴포넌트명)
- `() => string` lazy
- 셀렉터는 ARIA role / 표준 element / `data-part` 만. class ❌

### 4. 등록

`packages/ds/src/widgets.styles.ts` 에 import + lazy 호출:

```ts
import { cssSwitch } from './ui/2-input/Switch.style'
// …
export const widgets = () => [
  cssSwitch(), /* … */
].join('\n')
```

content 패턴은 `packages/ds/src/css.ts` 의 `segments` 에서 `wrap('content', cssX())`.

## 앱 레이어 (shells / apps)

DS 밖에서 자기 CSS 를 소유하는 단위. **3-layer**:

```
shells/<area>/<name>.style.ts     — 다중 앱 공유 chrome (sidebar shell 등)
apps/<app>/src/style.ts           — 단일 앱 전역 (finderCss · inboxCss …)
apps/<app>/src/<feature>/style.ts — 앱 내 페이지/feature (genrePagesCss …)
```

등록은 `packages/app/src/main.tsx` 의 `appsStyleEl` aggregator:

```ts
appsStyleEl.textContent = wrapAppsLayer([
  finderCss, eduPortalAdminCss, inboxCss, chatCss, feedCss, genrePagesCss, /* … */
])
```

## CSS layer 순서

`@p/ds/css` 가 자동 선언:

```css
@layer reset, states, widgets, parts, content, shell, apps;
```

- **widgets** — DS ui sibling + shells (cssX() 들)
- **parts** — `ui/6-structure/styles` (Card primitive 등)
- **content** — content 패턴 (postCard · authCard · inboxRow …)
- **shell** — `tokens/internal/shell` (전역 chrome reset)
- **apps** — `apps/<app>/style.ts` 들 (가장 후순위, 마지막 override)

자손 layer 가 조상 layer 를 cascade 로 덮는다 — apps 가 가장 강함.

## 흔한 안티패턴

| ❌ | ✅ |
|---|---|
| `style/widgets/<new-file>.ts` 신규 추가 | sibling `ui/<tier>/<Name>.style.ts` |
| 다중 role 콤마 묶음 (`[role="checkbox"], [role="radio"]`) | role 마다 sibling 1:1 (base 룰 복제 정당) |
| 가짜 컴포넌트 (`Glass.tsx` 빈 wrapper) 만들어 sibling 짝 맞춤 | shells/ 또는 tokens/internal/ |
| 앱 페이지 스타일을 DS 에 ([data-part="board-page"] in DS) | apps/<app>/style.ts 소유 |
| `from '@p/ds/tokens/palette'` | `from '@p/ds/tokens/scalar'` 또는 `tokens/semantic` |

## 참조

- canonical 선언: 이 문서
- 마이그레이션 진척: 커밋 `f654700` (`refactor(ds): style/widgets/ → ui sibling · shells · apps 분해`)
- 잔존 6 buffer: `style/widgets/{control/{form,itemRow,toggle:cssAlert}, layout/layout, overlay/{glass,overlay:cssPopover}}` — 공유 invariant 영역, 별도 의사결정 후 분해
