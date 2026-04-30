import type { Layer, TokenRef } from './types'

/** TokenRef → CSS string. literal 통과 또는 color-mix() 직조. */
export const tokenRefToCss = (t: TokenRef): string => {
  if (typeof t === 'string') return t
  const [base, pct, mix] = t.mix
  return `color-mix(in oklch, ${base} ${pct}%, ${mix})`
}

/** TokenRef alpha 배율. dark mode 등 elevation shadow 강도 보정용. */
const scaleAlpha = (t: TokenRef, k: number): string => {
  if (typeof t === 'string') return t
  const [base, pct, mix] = t.mix
  const scaled = Math.min(100, Math.round(pct * k))
  return `color-mix(in oklch, ${base} ${scaled}%, ${mix})`
}

const layerToCss = (l: Layer, alphaScale = 1): string => {
  const color =
    alphaScale === 1
      ? tokenRefToCss(l.color)
      : scaleAlpha(l.color, alphaScale)
  return `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${color}`
}

/** elevation Layer[] → box-shadow string. alphaScale로 dark 보정. */
export const elevationToShadow = (layers: Layer[], alphaScale = 1): string =>
  layers.length === 0 ? 'none' : layers.map((l) => layerToCss(l, alphaScale)).join(', ')
