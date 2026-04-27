import { css } from '../../tokens/foundations'
import { avatarSize, containerPad, levelShift, rowGap, slotGap } from './keyline'
import { defaultPreset } from '../preset/default'
import { toCss } from '../preset/apply'

/* @property 선언 + preset 비종속 파생 토큰 (control-h, keyline) */
const staticSeeds = css`
  @property --ds-hue     { syntax: '<number>'; initial-value: 260; inherits: true; }
  @property --ds-density { syntax: '<number>'; initial-value: 1;   inherits: true; }
  @property --ds-depth   { syntax: '<number>'; initial-value: 1;   inherits: true; }

  :root {
    /* 컨트롤 높이는 맥락 폰트크기 기반(1em). 헤더 안 버튼은 헤더 글자에 맞고,
       small 옆 칩은 small에 맞는다. 토큰 값은 :root 기본 — 자식이 :where(button) 등에서
       자체 font-size를 지정해도 calc(1em × leading)이 그 1em에 비례 재계산됨.
       leading × text + 수직 padding(space*2) + 1px 보더 양변. */
    --ds-control-h: calc(1em * var(--ds-leading) + var(--ds-space) * 2 + 2px);
    /* 터치 타겟 — iOS HIG 44px·Android Material 48dp 수렴 (de facto 표준) */
    --ds-touch-target: 44px;
    /* Hairline — DPR이 1일 땐 1px, 고해상도에선 device-pixel 1줄로 더 얇게.
       Chrome 109+/Safari 11+ 분수 px 지원. iOS Mobile Safari가 가장 자주 발생. */
    --ds-hairline: 1px;
  }
  @media (resolution >= 2dppx) {
    :root { --ds-hairline: 0.5px; }
  }
  @media (resolution >= 3dppx) {
    :root { --ds-hairline: 0.34px; }
  }
  :root {
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
  /* 터치 환경(coarse pointer + hover 없음): touch-target 최소치 보장.
     맥락 폰트가 크면 자연 더 커지도록 max()로 합쳐 — 헤더 안 버튼은 더 크고, 본문 안에서는 44 보장. */
  @media (hover: none) and (pointer: coarse) {
    :root { --ds-control-h: max(var(--ds-touch-target), calc(1em * var(--ds-leading) + var(--ds-space) * 2 + 2px)); }
  }
`

/* preset 주입 토큰 — applyPreset()로 런타임 교체 가능 */
export const seeds = staticSeeds + '\n' + toCss(defaultPreset)
