/** L0 단일 출처 — viewport/content breakpoint 상수.
 *  default preset.shell.mobileMax(→ --ds-shell-mobile-max CSS 변수)와
 *  shell CSS의 @media 리터럴이 모두 이 const를 참조한다. JS는 CSS 변수,
 *  CSS는 build-time interpolation으로 같은 값을 본다.
 *
 *  주의: @media (max-width: var(--x))는 브라우저 지원이 불완전(CSS Conditional 5).
 *  안전한 방법은 css`` 템플릿에서 ${...}로 직접 박는 것.
 */
export const SHELL_MOBILE_MAX = '600px'
