/**
 * Heading scale tokens — preset 기반 (--ds-h{n}-size, --ds-h{n}-leading).
 *
 * 이 파일은 var 참조만 반환한다. 실제 ladder 값은 preset/types.ts → preset/apply.ts.
 * preset 갈아끼우면 모든 prose/parts 헤딩이 자동 따라옴 (낙수 단방향).
 */

/**
 * Heading size — h1~h6. preset.heading.size 가 owner. 미정의 시 default ladder.
 * @demo type=value fn=headingSize args=[2]
 */
export const headingSize = (n: 1 | 2 | 3 | 4 | 5 | 6) => `var(--ds-h${n}-size)`

/**
 * Heading line-height — h1~h6. preset.heading.leading 이 owner.
 * @demo type=value fn=headingLeading args=[1]
 */
export const headingLeading = (n: 1 | 2 | 3 | 4 | 5 | 6) => `var(--ds-h${n}-leading)`

/**
 * letter-spacing scale — preset.tracking 이 owner. 미정의 시 default.
 * @demo type=value fn=trackingScale args=["tight"]
 */
export const trackingScale = (
  t: 'tightest' | 'tighter' | 'tight' | 'normal' | 'wide' | 'caps',
) => `var(--ds-tracking-${t})`

/**
 * Underline offset — Tailwind Typography 0.2em.
 * @demo type=value fn=underlineOffset args=[]
 */
export const underlineOffset = () => '0.2em'
