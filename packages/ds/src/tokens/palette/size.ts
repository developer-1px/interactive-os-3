// ── Size raw scale (palette tier) — width/height/box ─────────────────────
// font-size 와 별개. control height · icon · avatar · thumbnail 의 box 크기.
// widget tier 직참 ❌ — foundations/sizing 의 boxSize(slot) 사용.

/**
 * box size scale — preset.size.
 *
 * xs=16  · sm=20  · md=24  · lg=32  · xl=40  · 2xl=48
 * Tailwind size-{4..12} · Material 3 box size 합집합. icon · avatar · thumbnail 공용.
 *
 * @demo type=value fn=size args=["md"] scale=["xs","sm","md","lg","xl","2xl"]
 */
export const size = (s: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl') =>
  `var(--ds-size-${s})`
