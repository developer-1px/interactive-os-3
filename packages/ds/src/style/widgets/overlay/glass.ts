import { accent, border, css, grouping, hairlineWidth, radius } from '../../../tokens/foundations'
import { elev } from '../../../tokens/palette'
// 모바일 글래스 — iOS 26 Liquid Glass / Material 3 Expressive 트렌드 수렴.
// hover:none + pointer:coarse 환경에서만 발동하여 데스크톱 외형 유지.
//
// 원칙
// - background: 반투명 Canvas (60~78%) + backdrop-filter blur·saturate
// - border: 미세 hairline (CanvasText 6~10%)
// - shadow: 안쪽 1px highlight + 바깥쪽 soft drop
// - radius: 알약(button) / lg(input·card)
// - 색은 그대로, 표면만 교체 (semantic 토큰 재사용)
export const cssGlass = () => css`
  @media (hover: none) and (pointer: coarse) {
    :where(button):not([data-part="actions"] > button) {
      background: color-mix(in oklch, Canvas 70%, transparent);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
              backdrop-filter: blur(20px) saturate(180%);
      border: ${hairlineWidth()} solid ${border()};
      border-radius: ${radius('pill')};
      /* preset elev-2 — hairline ring + 작은 드롭 + 중간 드롭 (frosted button 분리) */
      box-shadow: ${elev(2)};
    }

    /* primary action 의 mobile pill+drop override 는 control/button.ts (owner) 가 보유 */

    :where(input):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]),
    :where(select),
    :where(textarea) {
      background: color-mix(in oklch, Canvas 70%, transparent);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
              backdrop-filter: blur(20px) saturate(180%);
      border: ${hairlineWidth()} solid ${border()};
      border-radius: ${radius('lg')};
      box-shadow: ${elev(1)};
    }

    /* emphasis="raised" 의 mobile frosted override 는 layout/layout.ts (owner) 가 보유 */

    /* popover/dialog 표면 — 동일 frosted, scrim과 어우러져 layered glass */
    :where([popover][role="dialog"][data-part="popover"]),
    :where(dialog) {
      background: color-mix(in oklch, Canvas 72%, transparent);
      -webkit-backdrop-filter: blur(28px) saturate(180%);
              backdrop-filter: blur(28px) saturate(180%);
      border: ${hairlineWidth()} solid ${border()};
    }

    /* FloatingNav FAB — frosted override 는 shell/panes.ts (FAB owner) 가 inline media query 로 직접 보유 */

    /* toolbar (반응 버튼 묶음) — ghost glass, 활성/hover 시만 살짝 채움 */
    :where([role="toolbar"]) > :where(button) {
      background: transparent;
      backdrop-filter: none;
      border-color: transparent;
      box-shadow: none;
    }
    :where([role="toolbar"]) > :where(button[aria-pressed="true"]) {
      background: color-mix(in oklch, ${accent()} 12%, transparent);
      border-color: ${border()};
    }
  }

  /* prefers-color-scheme: dark 에서 반투명 Canvas는 어두운 frosted 자동 처리 */
  ${grouping(0).slice(0, 0)}
`
