import type { DsPreset } from './types'

export const defaultPreset: DsPreset = {
  id: 'default',
  seed: { hue: 260, density: 1, depth: 1 },
  color: {
    fg: 'CanvasText',
    bg: 'Canvas',
    muted: { mix: ['CanvasText', 60, 'transparent'] },
    /* hairline 8% — Linear/Vercel/Arc 수렴. 12%는 시각 노이즈가 강함. */
    border: { mix: ['CanvasText', 8, 'transparent'] },
    accent: 'oklch(65% 0.22 var(--ds-hue))',
    success: 'oklch(62% 0.15 150)',
    warning: 'oklch(72% 0.15 75)',
    danger:  'oklch(58% 0.20 25)',
    // Light/dark 모두에서 일관된 계층 — Canvas/CanvasText를 기준으로 단계적 mix.
    // 숫자가 높을수록 CanvasText(전경)에 가까워진다 = 더 강한 대비.
    gray: {
      '1': { mix: ['CanvasText', 3,  'Canvas'] },
      '2': { mix: ['CanvasText', 6,  'Canvas'] },
      '3': { mix: ['CanvasText', 10, 'Canvas'] },
      '4': { mix: ['CanvasText', 16, 'Canvas'] },
      '5': { mix: ['CanvasText', 28, 'Canvas'] },
      '6': { mix: ['CanvasText', 44, 'Canvas'] },
      '7': { mix: ['CanvasText', 62, 'Canvas'] },
      '8': { mix: ['CanvasText', 80, 'Canvas'] },
      '9': { mix: ['CanvasText', 95, 'Canvas'] },
    },
  },
  space: { unit: '4px' },
  // 2026 스케일 — 산업 수렴 방향(Linear/Arc/Vercel): 더 둥글게, 덜 타이트하게.
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    pill: '999px',
  },
  text: {
    xs: '11px',
    sm: '12px',
    md: '13.5px',
    lg: '15px',
    xl: '18px',
    '2xl': '24px',
  },
  font: {
    sans: `ui-sans-serif, -apple-system, 'SF Pro Text', 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    mono: `ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace`,
  },
  // 타이포 타이트닝 — 본문 leading 낮추고 tracking은 강화.
  leading: { normal: 1.4, tight: 1.25, tracking: '-0.014em' },
  /* 현재 ds 재현: elev-2 = 기존 --ds-shadow (선형 depth 스케일),
     elev-1 = none (border-only), elev-0 = none, elev-3 = 기존 shadow × 1.5 */
  /* d=1의 ring은 기존 `border: 1px solid var(--ds-border)`와 1:1 동치 (hairline, alpha 12%).
     d=2는 기존 --ds-shadow + ring 포함해 dialog·tooltip 시각 유지. */
  /* Layered elevation — Vercel/Linear/Arc 수렴 패턴.
     각 단계는 hairline ring + tight contact + ambient diffusion 다층.
     낮은 alpha를 쌓아 "그림자가 보이지만 거칠지 않은" 깊이감.
       d=1: hairline ring only (분리 신호)
       d=2: card·popover — contact 2px + ambient 16px (-2 spread로 가장자리만)
       d=3: dialog·overlay — contact 4px + ambient 32px (-4 spread, 더 떠있음) */
  elevation: {
    0: [],
    1: [{ x: 0, y: 0, blur: 0, spread: 1, color: { mix: ['CanvasText', 8, 'transparent'] } }],
    2: [
      { x: 0, y: 0, blur: 0, spread: 1,  color: { mix: ['CanvasText', 6,  'transparent'] } },
      { x: 0, y: 1, blur: 2, spread: 0,  color: { mix: ['CanvasText', 5,  'transparent'] } },
      { x: 0, y: 4, blur: 16, spread: -2, color: { mix: ['CanvasText', 8,  'transparent'] } },
    ],
    3: [
      { x: 0, y: 0,  blur: 0,  spread: 1,  color: { mix: ['CanvasText', 6,  'transparent'] } },
      { x: 0, y: 2,  blur: 4,  spread: 0,  color: { mix: ['CanvasText', 6,  'transparent'] } },
      { x: 0, y: 12, blur: 32, spread: -4, color: { mix: ['CanvasText', 14, 'transparent'] } },
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
    mobileMax: '600px',
  },
}
