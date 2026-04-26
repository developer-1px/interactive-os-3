// ── Typography scalar tokens ────────────────────────────────────────────
/**
 * font-size scale — preset.text.
 * @demo type=value fn=font args=["lg"]
 */
export const font = (s: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl') =>
  `var(--ds-text-${s})`

/**
 * letter-spacing — preset.leading.tracking
 * @demo type=value fn=tracking
 */
export const tracking = () => `var(--ds-tracking)`

/**
 * line-height tier — tight(heading) / normal(default) / loose(prose body).
 * @demo type=value fn=leading args=["normal"]
 */
export const leading = (t: 'tight' | 'normal' | 'loose') =>
  `var(--ds-leading-${t})`

/**
 * font-weight tier — regular / medium / semibold / bold.
 * @demo type=value fn=weight args=["semibold"]
 */
export const weight = (
  w: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold',
) => `var(--ds-weight-${w})`
