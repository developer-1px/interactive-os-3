import type { DsPreset } from './types'
import { SHELL_MOBILE_MAX } from '../../semantic/layout/breakpoints'

export const defaultPreset: DsPreset = {
  id: 'default',
  seed: { hue: 260, density: 1, depth: 1, toneHue: 70, toneChroma: 0.018, toneTint: 18, stepScale: 1 },
  color: {
    fg: 'CanvasText',
    bg: 'Canvas',
    muted: { mix: ['var(--ds-tone)', 60, 'transparent'] },
    /* hairline 5% — tone 기반은 CanvasText 직접 mix보다 살짝 강해 보이므로 8→5로 낮춤. */
    border: { mix: ['var(--ds-tone)', 5, 'transparent'] },
    accent: 'oklch(65% 0.22 var(--ds-hue))',
    success: 'oklch(62% 0.15 150)',
    warning: 'oklch(72% 0.15 75)',
    danger:  'oklch(58% 0.20 25)',
    // Light/dark 모두에서 일관된 계층 — Canvas/CanvasText를 기준으로 단계적 mix.
    // 숫자가 높을수록 CanvasText(전경)에 가까워진다 = 더 강한 대비.
    //
    // neutral 1~9 곡선은 apply.ts가 var(--ds-tone) 기반으로 일괄 계산 (drift 방지).
    // 톤 자체를 갈고 싶으면 seed.variantHue / seed.variantChroma 조정.
  },
  space: { unit: '4px' },
  // 2026 스케일 — 산업 수렴 방향(Linear/Arc/Vercel): 더 둥글게, 덜 타이트하게.
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    pill: '9999px',
  },
  text: {
    xs: '11px',
    sm: '12px',
    md: '13.5px',
    lg: '15px',
    xl: '18px',
    '2xl': '24px',
    '3xl': '34px',
  },
  // box size scale — Tailwind size-{4..12} 합집합. icon · avatar · thumbnail.
  size: {
    xs:    '16px',
    sm:    '20px',
    md:    '24px',
    lg:    '32px',
    xl:    '40px',
    '2xl': '48px',
  },
  font: {
    sans: `ui-sans-serif, -apple-system, 'SF Pro Text', 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    mono: `ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace`,
  },
  // 타이포 타이트닝 — 본문 leading 낮추고 tracking은 강화.
  leading: { normal: 1.4, tight: 1.25, tracking: '-0.014em' },
  /* 현재 ds 재현: elev-2 = 기존 --ds-shadow (선형 depth 스케일),
     elev-1 = none (border-only), elev-0 = none, elev-3 = 기존 shadow × 1.5 */
  /* d=1의 ring은 기존 `border: ${hairlineWidth()} solid ${border()}`와 1:1 동치 (hairline, alpha 12%).
     d=2는 기존 --ds-shadow + ring 포함해 dialog·tooltip 시각 유지. */
  /* Layered elevation — Vercel/Linear/Arc 수렴 패턴.
     각 단계는 hairline ring + tight contact + ambient diffusion 다층.
     낮은 alpha를 쌓아 "그림자가 보이지만 거칠지 않은" 깊이감.
       d=1: hairline ring only (분리 신호)
       d=2: card·popover — contact 2px + ambient 16px (-2 spread로 가장자리만)
       d=3: dialog·overlay — contact 4px + ambient 32px (-4 spread, 더 떠있음) */
  elevation: {
    0: [],
    1: [{ x: 0, y: 0, blur: 0, spread: 1, color: { mix: ['var(--ds-tone)', 5, 'transparent'] } }],
    2: [
      { x: 0, y: 0, blur: 0,  spread: 1,  color: { mix: ['var(--ds-tone)', 4,  'transparent'] } },
      { x: 0, y: 1, blur: 3,  spread: 0,  color: { mix: ['var(--ds-tone)', 3,  'transparent'] } },
      { x: 0, y: 6, blur: 20, spread: -4, color: { mix: ['var(--ds-tone)', 5,  'transparent'] } },
    ],
    3: [
      { x: 0, y: 0,  blur: 0,  spread: 1,  color: { mix: ['var(--ds-tone)', 4,  'transparent'] } },
      { x: 0, y: 4,  blur: 8,  spread: -2, color: { mix: ['var(--ds-tone)', 4,  'transparent'] } },
      { x: 0, y: 16, blur: 40, spread: -6, color: { mix: ['var(--ds-tone)', 9,  'transparent'] } },
    ],
  },
  /* Dark에서는 같은 alpha가 안 보임 — 2.2배 (Linear 0.25 → 0.55 패턴). */
  darkShadowMultiplier: 2.2,
  shell: {
    inset: '16px',
    radius: '12px',
    chromeH: '44px',
    sidebarW: '200px',
    columnW: '220px',
    previewW: '320px',
    trafficSize: '12px',
    mobileMax: SHELL_MOBILE_MAX,
  },
}
