import { css, fg, indicator, onAccent, pad, radius } from '../../../fn'

/**
 * Checkbox / Radio (custom) — `<button role="checkbox">` 와 `<div role="radio">` 로
 * 컴포넌트가 emit되므로 native input을 못 쓴다. 박스 자체를 여기서 그린다.
 * states base는 이미 `[aria-checked="true"]`에 accent 배경을 주므로, 박스 모양 · 체크 표식만 더한다.
 *
 * radiogroup — 그룹 컨테이너는 항목들을 수직 정렬로 묶는다 (row flow도 허용).
 */
export const toggle = () => [
  css`
    [role="checkbox"],
    [role="radio"] {
      /* base controlBox가 min-height/padding을 잡으므로 여기선 박스 scale만.
         box-size는 1.125em — 1em(body)보다 살짝 크게 해야 "컨트롤이 있다"는 tactile 신호가 선다
         (Material 3 · iOS 16 · Radix 2026 수렴). */
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.125em;
      height: 1.125em;
      min-height: 0;
      padding: 0;
      /* off-state — --ds-border(12%)는 너무 얕아 비활성 컨트롤 신호가 약했다.
         fg(3) 레벨로 올려 Switch off-channel(fg(4))과 계층을 맞춘다. */
      border: 1.5px solid ${fg(3)};
      background: var(--ds-bg);
      flex: 0 0 auto;
      cursor: pointer;
      transition:
        background-color var(--ds-dur-base) var(--ds-ease-out),
        border-color var(--ds-dur-base) var(--ds-ease-out),
        box-shadow var(--ds-dur-base) var(--ds-ease-out);
    }
    [role="checkbox"] { border-radius: ${radius('sm')}; }
    [role="radio"]    { border-radius: 50%; }

    /* hover — 비활성 상태일 때 border 한 단계 짙게, 활성일 땐 accent 유지 */
    [role="checkbox"]:hover:not([aria-disabled="true"]):not([aria-checked="true"]):not([aria-checked="mixed"]),
    [role="radio"]:hover:not([aria-disabled="true"]):not([aria-checked="true"]) {
      border-color: ${fg(5)};
    }

    /* 체크 표식 pop-in — checked 전환 시 스프링 곡선으로 살짝 튕겨 나옴 */
    @keyframes ds-toggle-pop {
      0%   { opacity: 0; transform: scale(0.5); }
      100% { opacity: 1; transform: scale(1); }
    }
    [role="checkbox"][aria-checked="true"]::before,
    [role="checkbox"][aria-checked="mixed"]::after,
    [role="radio"][aria-checked="true"]::before {
      animation: ds-toggle-pop var(--ds-dur-base) var(--ds-ease-spring);
    }

    /* checked — accent 배경 + 흰색 표식 */
    [role="checkbox"][aria-checked="true"],
    [role="checkbox"][aria-checked="mixed"],
    [role="radio"][aria-checked="true"] {
      background: var(--ds-accent);
      border-color: var(--ds-accent);
      color: ${onAccent()};
    }

    /* disabled — base가 aria-disabled opacity 0.4를 이미 처리 */

    /* radiogroup — 세로 흐름 기본, aria-orientation="horizontal"일 때 가로 */
    [role="radiogroup"] {
      display: flex;
      flex-direction: column;
      gap: ${pad(1)};
    }
    [role="radiogroup"][aria-orientation="horizontal"] {
      flex-direction: row;
      flex-wrap: wrap;
      gap: ${pad(3)};
    }
  `,
  // checkbox check mark + mixed (minus) + radio dot
  indicator('[role="checkbox"]', 'check', { on: '[aria-checked="true"]', size: '0.8em' }),
  indicator('[role="radio"]',    'dot',   { on: '[aria-checked="true"]', size: '0.6em' }),
  // mixed state — 체크 아이콘(::before) 대신 가로 dash(::after)로 표시
  css`
    [role="checkbox"][aria-checked="mixed"]::before { visibility: hidden; }
    [role="checkbox"][aria-checked="mixed"]::after {
      content: '';
      display: block;
      width: 0.6em;
      height: 2px;
      background: currentColor;
      border-radius: 1px;
    }
  `,
].join('\n')

/**
 * Field error — `role="alert"` 로 emit되는 에러 메시지.
 * 작은 글자, error 톤, 라인 높이 맞춤.
 */
export const alert = () => css`
  [role="alert"] {
    color: var(--ds-danger);
    font-size: 0.85em;
    line-height: 1.4;
    margin-block-start: ${pad(0.5)};
  }
`
