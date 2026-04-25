import { accent, css, pad, radius, surface, tint } from '../../../fn'
// 모바일 글래스 — iOS 26 Liquid Glass / Material 3 Expressive 트렌드 수렴.
// hover:none + pointer:coarse 환경에서만 발동하여 데스크톱 외형 유지.
//
// 원칙
// - background: 반투명 Canvas (60~78%) + backdrop-filter blur·saturate
// - border: 미세 hairline (CanvasText 6~10%)
// - shadow: 안쪽 1px highlight + 바깥쪽 soft drop
// - radius: 알약(button) / lg(input·card)
// - 색은 그대로, 표면만 교체 (semantic 토큰 재사용)
export const glassCss = css`
  @media (hover: none) and (pointer: coarse) {
    :where(button):not([aria-roledescription="actions"] > button) {
      background: color-mix(in oklch, Canvas 70%, transparent);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
              backdrop-filter: blur(20px) saturate(180%);
      border: var(--ds-hairline) solid ${tint('CanvasText', 8)};
      border-radius: ${radius('pill')};
      /* hairline 1px ring(경계 또렷) + 짧은 드롭 — 큰 blur 흐림 제거 */
      box-shadow:
        inset 0 1px 0 ${tint('CanvasText', 6)},
        0 1px 2px ${tint('CanvasText', 8)},
        0 4px 10px ${tint('CanvasText', 6)};
    }

    [aria-roledescription="actions"] > button:first-of-type {
      border-radius: ${radius('pill')};
      box-shadow:
        inset 0 1px 0 ${tint('Canvas', 30)},
        0 1px 2px color-mix(in oklch, ${accent()} 20%, transparent),
        0 6px 14px color-mix(in oklch, ${accent()} 22%, transparent);
    }

    :where(input):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]),
    :where(select),
    :where(textarea) {
      background: color-mix(in oklch, Canvas 70%, transparent);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
              backdrop-filter: blur(20px) saturate(180%);
      border: var(--ds-hairline) solid ${tint('CanvasText', 8)};
      border-radius: ${radius('lg')};
      box-shadow: inset 0 1px 0 ${tint('CanvasText', 5)};
    }

    /* card / sheet — emphasis="raised" 카드도 frosted, 선명한 1px ring + 작은 drop */
    [data-emphasis="raised"] {
      background: color-mix(in oklch, Canvas 75%, transparent);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
              backdrop-filter: blur(24px) saturate(180%);
      border: var(--ds-hairline) solid ${tint('CanvasText', 8)};
      box-shadow:
        inset 0 1px 0 ${tint('CanvasText', 5)},
        0 1px 2px ${tint('CanvasText', 6)},
        0 6px 14px ${tint('CanvasText', 5)};
    }

    /* popover/dialog 표면 — 동일 frosted, scrim과 어우러져 layered glass */
    :where([popover][role="dialog"][aria-roledescription="popover"]),
    :where(dialog) {
      background: color-mix(in oklch, Canvas 72%, transparent);
      -webkit-backdrop-filter: blur(28px) saturate(180%);
              backdrop-filter: blur(28px) saturate(180%);
      border: var(--ds-hairline) solid ${tint('CanvasText', 8)};
    }

    /* FloatingNav FAB — 진한 glass + 선명 ring + 짧은 drop */
    aside[aria-roledescription="floating-nav"] > button {
      background: color-mix(in oklch, Canvas 60%, transparent);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
              backdrop-filter: blur(24px) saturate(180%);
      border: var(--ds-hairline) solid ${tint('CanvasText', 10)};
      box-shadow:
        inset 0 1px 0 ${tint('CanvasText', 8)},
        0 0 0 1px ${tint('CanvasText', 4)},
        0 2px 4px ${tint('CanvasText', 10)},
        0 8px 16px ${tint('CanvasText', 8)};
    }

    /* toolbar (반응 버튼 묶음) — ghost glass, 활성/hover 시만 살짝 채움 */
    :where([role="toolbar"]) > :where(button) {
      background: transparent;
      backdrop-filter: none;
      border-color: transparent;
      box-shadow: none;
    }
    :where([role="toolbar"]) > :where(button[aria-pressed="true"]) {
      background: color-mix(in oklch, ${accent()} 12%, transparent);
      border-color: ${tint('CanvasText', 6)};
    }
  }

  /* prefers-color-scheme: dark 에서 반투명 Canvas는 어두운 frosted 자동 처리 */
  ${surface(0).slice(0, 0)}
`
