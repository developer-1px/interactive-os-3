import { css } from '../fn/values'
import type {
  DsPreset,
  Layer,
  TokenRef,
} from './types'

export const tokenRefToCss = (t: TokenRef): string => {
  if (typeof t === 'string') return t
  const [base, pct, mix] = t.mix
  return `color-mix(in oklch, ${base} ${pct}%, ${mix})`
}

const layerToCss = (l: Layer, alphaScale = 1): string => {
  const color =
    alphaScale === 1
      ? tokenRefToCss(l.color)
      : scaleAlpha(l.color, alphaScale)
  return `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${color}`
}

const scaleAlpha = (t: TokenRef, k: number): string => {
  if (typeof t === 'string') return t
  const [base, pct, mix] = t.mix
  const scaled = Math.min(100, Math.round(pct * k))
  return `color-mix(in oklch, ${base} ${scaled}%, ${mix})`
}

export const elevationToShadow = (layers: Layer[], alphaScale = 1): string =>
  layers.length === 0 ? 'none' : layers.map((l) => layerToCss(l, alphaScale)).join(', ')

const rootBlock = (p: DsPreset, alphaScale = 1) => {
  const elev = (n: 0 | 1 | 2 | 3) =>
    `--ds-elev-${n}: ${elevationToShadow(p.elevation[n], alphaScale)};`
  return `
    --ds-hue:     ${p.seed.hue};
    --ds-density: ${p.seed.density};
    --ds-depth:   ${p.seed.depth};

    --ds-space:  calc(${p.space.unit} * var(--ds-density));
    --ds-fg:     ${tokenRefToCss(p.color.fg)};
    --ds-bg:     ${tokenRefToCss(p.color.bg)};
    --ds-muted:  ${tokenRefToCss(p.color.muted)};
    --ds-border: ${tokenRefToCss(p.color.border)};
    --ds-accent: ${tokenRefToCss(p.color.accent)};

    ${p.color.traffic ? `
    --ds-traffic-close: ${tokenRefToCss(p.color.traffic.close)};
    --ds-traffic-min:   ${tokenRefToCss(p.color.traffic.min)};
    --ds-traffic-max:   ${tokenRefToCss(p.color.traffic.max)};
    ` : ''}

    --ds-font-sans: ${p.font.sans};
    --ds-font-mono: ${p.font.mono};

    --ds-text-xs:  ${p.text.xs};
    --ds-text-sm:  ${p.text.sm};
    --ds-text-md:  ${p.text.md};
    --ds-text-lg:  ${p.text.lg};
    --ds-text-xl:  ${p.text.xl};
    --ds-text-2xl: ${p.text['2xl']};

    --ds-leading:       ${p.leading.normal};
    --ds-leading-tight: ${p.leading.tight};
    --ds-tracking:      ${p.leading.tracking};

    --ds-radius-sm:   ${p.radius.sm};
    --ds-radius-md:   ${p.radius.md};
    --ds-radius-lg:   ${p.radius.lg};
    --ds-radius-pill: ${p.radius.pill};
    --ds-radius:      ${p.radius.md};

    --ds-shell-inset:   ${p.shell.inset};
    --ds-shell-radius:  ${p.shell.radius};
    --ds-chrome-h:      ${p.shell.chromeH};
    --ds-sidebar-w:     ${p.shell.sidebarW};
    --ds-column-w:      ${p.shell.columnW};
    --ds-preview-w:     ${p.shell.previewW};
    --ds-traffic-size:  ${p.shell.trafficSize};

    ${elev(0)}
    ${elev(1)}
    ${elev(2)}
    ${elev(3)}

    /* hairline shadow 전환기 호환 — 과거 단일 --ds-shadow 소비처 fallback */
    --ds-shadow: var(--ds-elev-2);
  `
}

export const toCss = (p: DsPreset): string => {
  const k = p.darkShadowMultiplier ?? 1
  return css`
    :root {
      ${rootBlock(p, 1)}
    }
    ${k !== 1 ? `
    @media (prefers-color-scheme: dark) {
      :root {
        --ds-elev-0: ${elevationToShadow(p.elevation[0], k)};
        --ds-elev-1: ${elevationToShadow(p.elevation[1], k)};
        --ds-elev-2: ${elevationToShadow(p.elevation[2], k)};
        --ds-elev-3: ${elevationToShadow(p.elevation[3], k)};
      }
    }` : ''}
  `
}

const STYLE_ID = 'ds-preset'

export const applyPreset = (p: DsPreset): void => {
  if (typeof document === 'undefined') return
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = STYLE_ID
    document.head.appendChild(el)
  }
  el.textContent = toCss(p)
  document.documentElement.dataset.dsPreset = p.id
}
