import type { DsPreset, TokenRef } from './types'
import { defaultPreset } from './default'

const ringAt = (pct: number): TokenRef => ({ mix: ['CanvasText', pct, 'transparent'] })
const dropAt = (pct: number): TokenRef => ({ mix: ['CanvasText', pct, 'transparent'] })

/**
 * Vercel·Notion·shadcn 진영의 hairline + multi-layer drop 공식.
 *  - d=1: ring(8%) — 경계만
 *  - d=2: ring(10%) + sharp(6%) + soft(8%) — dropdown·popover·toast
 *  - d=3: ring(12%) + sharp(8%) + soft(12%) — dialog·command palette
 * blur는 사용하지 않음 (ds 원칙: 투명하게 잘 보이도록).
 * darkShadowMultiplier는 dark 모드에서 alpha를 2.5배로.
 */
export const hairlinePreset: DsPreset = {
  ...defaultPreset,
  id: 'hairline',
  elevation: {
    0: [],
    1: [
      { x: 0, y: 0, blur: 0, spread: 1, color: ringAt(8) },
    ],
    2: [
      { x: 0, y: 0, blur: 0, spread: 1, color: ringAt(10) },
      { x: 0, y: 1, blur: 2, spread: 0, color: dropAt(6) },
      { x: 0, y: 8, blur: 24, spread: -4, color: dropAt(8) },
    ],
    3: [
      { x: 0, y: 0, blur: 0, spread: 1, color: ringAt(12) },
      { x: 0, y: 2, blur: 4, spread: 0, color: dropAt(8) },
      { x: 0, y: 16, blur: 40, spread: -8, color: dropAt(12) },
    ],
  },
  darkShadowMultiplier: 2.5,
}
