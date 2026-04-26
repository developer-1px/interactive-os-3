/**
 * duration token — preset의 모션 시간. transition·animation에 사용.
 * @demo type=value fn=dur args=["base"]
 */
export const dur = (d: 'fast' | 'base') => `var(--ds-dur-${d})`
