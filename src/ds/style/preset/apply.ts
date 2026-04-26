import { css } from '../../foundations/primitives/css'
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

/**
 * Control emphasis ladder:
 *   hairline        (--ds-border, ~12%)  — 경계 분리
 *   control-border  (neutral-3)             — Checkbox/Radio/Button/Grid 가장자리
 *   control-channel (neutral-4)             — Switch track · Progress rail (On/Off 축)
 *   *-hover         (neutral-5)             — 위 두 단 공통 hover 1단
 */
const rootBlock = (p: DsPreset, alphaScale = 1) => {
  const elev = (n: 0 | 1 | 2 | 3) =>
    `--ds-elev-${n}: ${elevationToShadow(p.elevation[n], alphaScale)};`
  return `
    --ds-hue:     ${p.seed.hue};
    --ds-density: ${p.seed.density};
    --ds-depth:   ${p.seed.depth};

    --ds-space:  calc(${p.space.unit} * var(--ds-density));
    --ds-fg:     ${tokenRefToCss(p.color.fg)};
    /* --ds-bg = "elevated surface" (card/popover/input). Canvas(=pure white in light)로
       유지해 base 위에서 살짝 떠 보이게 한다. 페이지 자체 배경은 --ds-base. */
    --ds-bg:     ${tokenRefToCss(p.color.bg)};
    /* --ds-tone = 정직한 neutral 대신 미세한 warm cast(papery) 입힌 회색 소스.
       seed.toneHue/toneChroma로 preset 갈아끼울 수 있게 변수화. CanvasText 베이스를
       hued chip과 합쳐, OS dark mode 추적은 유지하되 톤은 살짝 따뜻하게. */
    --ds-tone-hue:    ${p.seed.toneHue ?? 70};
    --ds-tone-chroma: ${p.seed.toneChroma ?? 0.018};
    /* tone-tint: hued chip이 CanvasText에 섞이는 비율 (%). 18%=감지 임계, 0=정직한 회색. */
    --ds-tone-tint:   ${p.seed.toneTint ?? 18};
    /* step-scale: neutral 1~9 곡선 전체 배율. 1=기본, <1=대비 약화(soft), >1=대비 강화(punchy). */
    --ds-step-scale:  ${p.seed.stepScale ?? 1};
    --ds-tone: color-mix(in oklch,
      CanvasText calc(100% - var(--ds-tone-tint) * 1%),
      oklch(60% var(--ds-tone-chroma) var(--ds-tone-hue)) calc(var(--ds-tone-tint) * 1%));
    /* --ds-base = page ground. 컨트롤/카드(--ds-bg)보다 한 단 어두워 surface가 떠 보인다.
       Linear/Vercel/Notion 수렴 패턴: tinted ground + bright elevated surface. */
    --ds-base:   var(--ds-neutral-1);
    --ds-muted:  ${tokenRefToCss(p.color.muted)};
    --ds-border: ${tokenRefToCss(p.color.border)};
    --ds-accent: ${tokenRefToCss(p.color.accent)};
    /* on-* = 해당 bg 위의 전경 텍스트. preset이 contrast 책임을 진다 (consumer CI 불필요). */
    --ds-accent-on:  ${p.color.accentOn  ? tokenRefToCss(p.color.accentOn)  : '#fff'};
    --ds-success:    ${p.color.success   ? tokenRefToCss(p.color.success)   : 'var(--ds-accent)'};
    --ds-success-on: ${p.color.successOn ? tokenRefToCss(p.color.successOn) : 'var(--ds-accent-on)'};
    --ds-warning:    ${p.color.warning   ? tokenRefToCss(p.color.warning)   : 'var(--ds-accent)'};
    --ds-warning-on: ${p.color.warningOn ? tokenRefToCss(p.color.warningOn) : '#000'};
    --ds-danger:     ${p.color.danger    ? tokenRefToCss(p.color.danger)    : 'var(--ds-accent)'};
    --ds-danger-on:  ${p.color.dangerOn  ? tokenRefToCss(p.color.dangerOn)  : 'var(--ds-accent-on)'};

    ${(['1','2','3','4','5','6','7','8','9'] as const).map((n) => {
      // 모든 neutral는 var(--ds-tone)을 베이스로 — 정직한 회색이 아니라 미세 warm cast.
      // preset neutral override 시에도 토큰을 무조건 var(--ds-tone) 기반으로 강제한다 (drift 방지).
      const pct = [1, 2, 3.5, 6, 10, 18, 32, 52, 78][Number(n)-1]
      return `--ds-neutral-${n}: color-mix(in oklch, var(--ds-tone) calc(${pct}% * var(--ds-step-scale)), Canvas);`
    }).join('\n    ')}

    --ds-control-border:        var(--ds-neutral-3);
    --ds-control-channel:       var(--ds-neutral-4);
    --ds-control-border-hover:  var(--ds-neutral-5);

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

    --ds-leading:        ${p.leading.normal};
    --ds-leading-tight:  ${p.leading.tight};
    --ds-leading-normal: ${p.leading.normal};
    --ds-leading-loose:  1.75;
    --ds-tracking:       ${p.leading.tracking};

    --ds-weight-regular:  400;
    --ds-weight-medium:   500;
    --ds-weight-semibold: 600;
    --ds-weight-bold:     700;
    --ds-weight-extrabold: 800;

    /* Heading ladder — preset.heading 가 없으면 default (1.5/1.25/1.125/1/1/1 em). */
    --ds-h1-size: ${p.heading?.size?.[0] ?? '1.5em'};
    --ds-h2-size: ${p.heading?.size?.[1] ?? '1.25em'};
    --ds-h3-size: ${p.heading?.size?.[2] ?? '1.125em'};
    --ds-h4-size: ${p.heading?.size?.[3] ?? '1em'};
    --ds-h5-size: ${p.heading?.size?.[4] ?? '1em'};
    --ds-h6-size: ${p.heading?.size?.[5] ?? '1em'};
    --ds-h1-leading: ${p.heading?.leading?.[0] ?? '1.35'};
    --ds-h2-leading: ${p.heading?.leading?.[1] ?? '1.35'};
    --ds-h3-leading: ${p.heading?.leading?.[2] ?? '1.4'};
    --ds-h4-leading: ${p.heading?.leading?.[3] ?? '1.5'};
    --ds-h5-leading: ${p.heading?.leading?.[4] ?? '1.5'};
    --ds-h6-leading: ${p.heading?.leading?.[5] ?? '1.5'};

    /* letter-spacing scale — preset.tracking 가 없으면 default. */
    --ds-tracking-tightest: ${p.tracking?.tightest ?? '-0.02em'};
    --ds-tracking-tighter:  ${p.tracking?.tighter  ?? '-0.015em'};
    --ds-tracking-tight:    ${p.tracking?.tight    ?? '-0.01em'};
    --ds-tracking-normal:   ${p.tracking?.normal   ?? '0'};
    --ds-tracking-wide:     ${p.tracking?.wide     ?? '0.02em'};
    --ds-tracking-caps:     ${p.tracking?.caps     ?? '0.06em'};

    /* focus-ring 두께 — outline / active indicator / thumb 강조선 공통.
       hairline(--ds-hairline)보다 한 단 두꺼운 강조 테두리. */
    --ds-focus-ring-w: 2px;

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
    --ds-shell-mobile-max: ${p.shell.mobileMax};

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
