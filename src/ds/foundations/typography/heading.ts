/**
 * Heading scale tokens — Tailwind Typography prose-base spec 정량 수렴 (2026).
 *
 * fluid scale은 가독성/위계 산만 — 폐기. 정적 ladder가 de facto 표준.
 * 모두 em/rem 단위 — prose body font-size에 비례.
 */

/**
 * Static heading size scale — modern docs ladder (Linear/Notion/Stripe 수렴, 2026).
 * h1=2.25rem(36) / h2=1.75rem(28) / h3=1.375rem(22) /
 * h4=1.125rem(18) / h5=1rem(16) / h6=0.8125rem(13, microlabel)
 *
 * 단계 차이 (36→28→22→18→16→13) = 줄어드는 폭이 점차 작아져 modular 1.286 ratio 자연스러움.
 * 이전 Tailwind prose-base는 h2(24)→h3(20)→h4(16) 4px씩이라 위계가 평탄했음.
 * @demo type=value fn=headingSize args=[2]
 */
export const headingSize = (n: 1 | 2 | 3 | 4 | 5 | 6) => {
  const scale = ['2.25rem', '1.75rem', '1.375rem', '1.125rem', '1rem', '0.8125rem']
  return scale[n - 1]
}

/**
 * Heading line-height — modern docs ladder.
 * h1=1.111 / h2=1.286 / h3=1.45 / h4~h6=1.5
 * 큰 헤딩은 타이트한 leading, 작은 헤딩은 본문 leading에 가깝게.
 * @demo type=value fn=headingLeading args=[1]
 */
export const headingLeading = (n: 1 | 2 | 3 | 4 | 5 | 6) => {
  const map = ['1.111', '1.286', '1.45', '1.5', '1.5', '1.5']
  return map[n - 1]
}

/**
 * letter-spacing scale — heading dramatic tight + uppercase caps.
 * tightest=-0.02em (h1), tighter=-0.015em (h2), tight=-0.01em (h3),
 * normal=0, wide=0.02em, caps=0.06em.
 * @demo type=value fn=trackingScale args=["tight"]
 */
export const trackingScale = (
  t: 'tightest' | 'tighter' | 'tight' | 'normal' | 'wide' | 'caps',
) => {
  const map = {
    tightest: '-0.02em',
    tighter: '-0.015em',
    tight: '-0.01em',
    normal: '0',
    wide: '0.02em',
    caps: '0.06em',
  }
  return map[t]
}

/**
 * Underline offset — Tailwind Typography 0.2em.
 * @demo type=value fn=underlineOffset args=[]
 */
export const underlineOffset = () => '0.2em'
