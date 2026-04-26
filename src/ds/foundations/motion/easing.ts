/**
 * easing token — preset의 모션 곡선.
 * @demo type=value fn=ease args=["out"]
 */
export const ease = (e: 'out' | 'spring') => `var(--ds-ease-${e})`
