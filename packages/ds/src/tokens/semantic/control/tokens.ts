/**
 * control 스칼라 — h: block-size, border/borderHover/channel: border 색.
 * @demo type=value fn=control args=["h"]
 */
export const control = (k: 'h' | 'border' | 'borderHover' | 'channel') => {
  switch (k) {
    case 'h':           return `var(--ds-control-h)`
    case 'border':      return `var(--ds-control-border)`
    case 'borderHover': return `var(--ds-control-border-hover)`
    case 'channel':     return `var(--ds-control-channel)`
  }
}
