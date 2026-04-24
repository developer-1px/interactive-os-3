import { css } from '../../fn'
import { avatarSize, containerPad, levelShift, rowGap, slotGap } from './keyline'
import { defaultPreset } from '../preset/default'
import { toCss } from '../preset/apply'

/* @property 선언 + preset 비종속 파생 토큰 (control-h, keyline) */
const staticSeeds = css`
  @property --ds-hue     { syntax: '<number>'; initial-value: 260; inherits: true; }
  @property --ds-density { syntax: '<number>'; initial-value: 1;   inherits: true; }
  @property --ds-depth   { syntax: '<number>'; initial-value: 1;   inherits: true; }

  :root {
    /* UA가 line-height를 무시하는 select까지 min-height로 강제해 같은 선상 정렬 보장 */
    --ds-control-h: calc(var(--ds-text-md) * var(--ds-leading) + var(--ds-space) * 2 + 2px);

    /* keyline 시스템 — 원본은 src/ds/keyline.ts */
    --ds-row-gap:       ${rowGap};
    --ds-slot-gap:      ${slotGap};
    --ds-container-pad: ${containerPad};
    --ds-level-shift:   ${levelShift};
    --ds-avatar-size:   ${avatarSize};

    /* 2026 motion — state transition 공용 토큰. widget이 transition-duration/easing을 여기 참조. */
    --ds-ease-out:    cubic-bezier(0.22, 1, 0.36, 1);
    --ds-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ds-dur-fast:    120ms;
    --ds-dur-base:    180ms;
  }
`

/* preset 주입 토큰 — applyPreset()로 런타임 교체 가능 */
export const seeds = staticSeeds + '\n' + toCss(defaultPreset)
