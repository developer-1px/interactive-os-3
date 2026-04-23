import { css, icon, icons, pad, radius, rowPadding, surface } from './fn'

// 새 컴포넌트 CSS — 표준 HTML/ARIA 셀렉터만 사용 (classless).
// 단일 책임: 각 블록은 정확히 한 role(또는 한 네이티브 요소)의 시각 계약을 담는다.

const switchCss = css`
  :where([role="switch"]) {
    width: calc(var(--ds-control-h) * 1.75);
    padding: 2px;
    border-radius: 999px;
    background: var(--ds-border);
    min-height: auto;
    display: inline-flex;
    align-items: center;
  }
  :where([role="switch"])::before {
    content: '';
    width: calc(var(--ds-control-h) - 10px);
    height: calc(var(--ds-control-h) - 10px);
    border-radius: 50%;
    background: var(--ds-bg);
    box-shadow: var(--ds-shadow);
    transition: transform 120ms;
  }
  :where([role="switch"])[aria-checked="true"] {
    background: var(--ds-accent);
  }
  :where([role="switch"])[aria-checked="true"]::before {
    transform: translateX(calc(var(--ds-control-h) * 0.75));
  }
`

const dialogCss = css`
  :where(dialog) {
    ${surface(2)}
    color: inherit;
    padding: ${pad(4)};
    border-radius: ${radius('md')};
    max-width: min(90vw, 480px);
    min-width: 280px;
  }
  :where(dialog)::backdrop {
    background: color-mix(in oklch, CanvasText 40%, transparent);
    backdrop-filter: blur(2px);
  }
`

const tooltipCss = css`
  :where([role="tooltip"]) {
    ${surface(2)}
    padding: ${rowPadding(2)};
    font-size: var(--ds-text-sm);
    border-radius: ${radius('sm')};
    color: inherit;
    pointer-events: none;
  }
`

const detailsCss = css`
  :where(details) {
    border: 1px solid var(--ds-border);
    border-radius: ${radius('sm')};
    overflow: hidden;
  }
  :where(details) + :where(details) { border-top-width: 0; border-radius: 0; }
  :where(details:first-child) { border-top-left-radius: ${radius('sm')}; border-top-right-radius: ${radius('sm')}; }
  :where(details:last-child)  { border-bottom-left-radius: ${radius('sm')}; border-bottom-right-radius: ${radius('sm')}; }

  :where(details) > :where(summary) {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${pad(1.5)};
    padding: ${pad(1.5)} ${pad(2)};
    user-select: none;
  }
  :where(details) > :where(summary)::-webkit-details-marker { display: none; }
  :where(details) > :where(summary)::before {
    ${icon(icons.chevronRight)}
    opacity: .6;
    transition: transform 120ms;
    flex: none;
  }
  :where(details[open]) > :where(summary)::before { transform: rotate(90deg); }
  :where(details[open]) > :where(summary) { border-bottom: 1px solid var(--ds-border); }
  :where(details) > :not(summary) { padding: ${pad(2)}; }
`

// Progress / Meter — 네이티브 요소를 토큰 기반으로 얇게 스타일.
// value 축: aria-valuenow는 native progress/meter에서 value 속성으로 반영되므로 별도 attr() 불필요.
const valueCss = css`
  :where(progress), :where(meter) {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    height: calc(var(--ds-space) * 2);
    border: 1px solid var(--ds-border);
    border-radius: 999px;
    background: transparent;
    overflow: hidden;
  }
  :where(progress)::-webkit-progress-bar,
  :where(meter)::-webkit-meter-bar {
    background: transparent;
    border-radius: 999px;
  }
  :where(progress)::-webkit-progress-value,
  :where(meter)::-webkit-meter-optimum-value {
    background: var(--ds-accent);
    border-radius: 999px;
    transition: inline-size 160ms;
  }
  :where(progress)::-moz-progress-bar {
    background: var(--ds-accent);
  }
  :where(meter)::-webkit-meter-suboptimum-value    { background: oklch(75% 0.16 80); }
  :where(meter)::-webkit-meter-even-less-good-value { background: oklch(65% 0.22 25); }
`

export const widgets = () => [switchCss, dialogCss, tooltipCss, detailsCss, valueCss].join('\n')
