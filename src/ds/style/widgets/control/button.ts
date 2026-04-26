import { accent, control, css, dur, ease, fg, onAccent, pad, radius, square, status, tint } from '../../../foundations'
// Badge vs Button 시각 계약 단서:
//  - Badge: 작음(xs, height auto), pill, 얕은 tint, cursor default, 경계 없음
//  - Button: 체크기(29.5px control-h), radius md, gray-2 서피스, 1px hairline 경계, cursor pointer
// 두 축(크기 × 경계)으로 한눈에 구분되도록 button에 keyline을 부여한다.

/**
 * Button 시각 계약 — variant prop 없이 **문맥**으로 강도 결정.
 *
 * 계층 (강→약):
 * 1. Primary — `[aria-roledescription="actions"] > button` (페이지 top-level CTA 영역)
 *    → accent fill, onAccent 텍스트. "이 화면에서 해야 할 주된 행동" 신호.
 * 2. Default — 일반 <button> (grid 셀, 폼, 툴바 등)
 *    → gray-2 서피스 + 경계 없음 + accent hover. "눌릴 수 있음"은 알지만 첫 눈길은 아님.
 * 3. Ghost — 이미 state.ts base가 주는 기본 (transparent bg + controlBox).
 *    variant로 옵트인 없음 — 모든 button은 2번에 기본 해당.
 *
 * 메모: Primary 분기를 data-tone이나 variant prop이 아닌 ARIA context로 결정 →
 * "페이지의 주 행동은 actions 영역에 둔다"는 IA 규약이 자연스레 강제된다.
 */
export const buttonCss = css`
  /* ── 기본 (= secondary/default) ───────────────────────────────
     base.ts의 controlBox 위에 얕은 서피스와 경계 없는 hover 신호만 얹는다. */
  :where(button:not([aria-roledescription="actions"] > button)) {
    background: ${fg(2)};
    color: inherit;
    border: 1px solid ${control('border')};
    border-radius: ${radius('md')};
    padding: 0 ${pad(3)};
    transition: background-color ${dur('fast')} ${ease('out')},
                color ${dur('fast')} ${ease('out')},
                border-color ${dur('fast')} ${ease('out')};
  }
  /* icon-only — children이 비어있고 data-icon만 있는 버튼은 정사각형. fn/square로 통일.
     ::before 아이콘 너비(1.25em) + control-h 높이로 자연 정사각형. */
  ${square('button[data-icon]:empty')}
  :where(button[data-icon]:empty)::before {
    margin-inline-end: 0;
  }
  :where(button:not([aria-roledescription="actions"] > button)):hover:not([aria-disabled="true"]) {
    background: ${tint(accent(), 12)};
    color: ${accent()};
    border-color: ${tint(accent(), 40)};
  }

  /* ── Primary (actions 영역의 "주" 버튼 하나) ─────────────────────
     [aria-roledescription="actions"] 안의 첫 번째 버튼만 primary로 승격.
     두 번째 이상은 default 스타일 (2CTA 경쟁 방지 — 1 primary 규약). */
  [aria-roledescription="actions"] > button:first-of-type {
    background: ${accent()};
    color: ${onAccent()};
    border: 1px solid ${accent()};
    border-radius: ${radius('md')};
    padding: 0 ${pad(4)};
    font-weight: 600;
    transition: background-color ${dur('fast')} ${ease('out')},
                transform ${dur('fast')} ${ease('out')};
  }
  [aria-roledescription="actions"] > button:first-of-type:hover:not([aria-disabled="true"]) {
    background: ${tint(accent(), 85)};
  }
  [aria-roledescription="actions"] > button:first-of-type:active:not([aria-disabled="true"]) {
    transform: translateY(1px);
  }
  /* mobile glass override — pill + accent-tinted drop. desktop 외형은 위 base 가 유지. */
  @media (hover: none) and (pointer: coarse) {
    [aria-roledescription="actions"] > button:first-of-type {
      border-radius: ${radius('pill')};
      box-shadow:
        inset 0 1px 0 ${tint('Canvas', 30)},
        0 1px 2px color-mix(in oklch, ${accent()} 20%, transparent),
        0 6px 14px color-mix(in oklch, ${accent()} 22%, transparent);
    }
  }

  /* ── Danger (위험 영역) ────────────────────────────────────────
     [aria-roledescription="danger"] 섹션 안의 button은 경고 색. 삭제/해지 등. */
  [aria-roledescription="danger"] button {
    background: ${tint(`${status('danger')}`, 8)};
    color: ${status('danger')};
    border-color: ${tint(`${status('danger')}`, 30)};
  }
  [aria-roledescription="danger"] button:hover:not([aria-disabled="true"]) {
    background: ${status('danger')};
    color: ${onAccent()};
    border-color: ${status('danger')};
  }

  /* columnheader 안의 sort 토글 버튼은 grid.ts 가 all: unset 으로 owner — 여기 예외 처리 불필요. */
`
