/**
 * 명명된 viewport breakpoint — semantic 상수.
 * preset 의 default.shell.mobileMax 와 widget @media 리터럴이 모두 이 값을 본다.
 *
 * @media (max-width: var(--x)) 는 브라우저 지원이 불완전 (CSS Conditional 5).
 * css`` 템플릿에서 ${SHELL_MOBILE_MAX} 로 build-time interpolation 한다.
 */
export const SHELL_MOBILE_MAX = '600px'
