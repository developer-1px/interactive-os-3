import { css } from '../../fn'

// 모바일 확장 — container query 전용 breakpoint 토큰.
// 원칙: media query는 장치 특성(hover/pointer/prefers-*)에만, viewport 폭 분기는 container query.
// 이유: definePage entities는 viewport 의식이 없고, 같은 zone이 어떤 shell 안에 들어가도
// 자기 container 폭에만 적응해야 한다(예: aside 안에 들어간 grid는 main 폭 무관).
//
// 사용:
//   container-type: inline-size; container-name: <role>;
//   @container <role> (inline-size < var(--ds-bp-compact)) { ... }
export const breakpointsCss = css`
  :root {
    --ds-bp-compact: 40rem;   /* ~640px — phone */
    --ds-bp-regular: 64rem;   /* ~1024px — tablet/small laptop */
    --ds-bp-wide:    96rem;   /* ~1536px — desktop */
  }
`
