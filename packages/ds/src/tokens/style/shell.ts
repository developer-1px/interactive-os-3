import { SHELL_MOBILE_MAX, border, css, grouping, hairlineWidth, pad, radius, weight } from '../foundations'

// shell — OS 셸 크롬 (window-controls, traffic lights, body flex 컨테이너).
// 특정 앱 이름이 아니라 "window-controls를 가진 main" 을 구조로 매칭.
// 모든 앱(finder / inspector / …)이 동일 규칙을 상속한다. classless + structural.
// 앱별 body 배치는 style/apps/* owner.
const chromeCss = css`
  main:has(> header > [data-part="window-controls"]) {
    position: fixed;
    inset: var(--ds-shell-inset);
    border-radius: var(--ds-shell-radius);
    ${grouping(2)}
    display: flex; flex-direction: column; overflow: hidden;
    container-type: inline-size;
    container-name: shell;
  }
  main:has(> header > [data-part="window-controls"]) > header {
    display: flex; flex-direction: row; align-items: center; gap: var(--ds-slot-gap);
    height: var(--ds-chrome-h); flex: none;
    padding-inline: ${pad(3)};
    border-bottom: ${hairlineWidth()} solid ${border()};
    background: color-mix(in oklch, Canvas 95%, CanvasText 5%);
    font-weight: ${weight('semibold')};
  }
  main:has(> header > [data-part="window-controls"])
    > section[data-slot="body"] {
    flex: 1; display: flex; min-height: 0;
  }
  [data-part="window-controls"] { display: flex; gap: ${pad(2)}; align-items: center; }
  [data-part="window-controls"] > span {
    width: var(--ds-traffic-size); height: var(--ds-traffic-size);
    border-radius: ${radius('pill')}; border: ${hairlineWidth()} solid ${border()};
  }
  [data-part="window-controls"] > span:nth-child(1) { background: var(--ds-traffic-close); }
  [data-part="window-controls"] > span:nth-child(2) { background: var(--ds-traffic-min); }
  [data-part="window-controls"] > span:nth-child(3) { background: var(--ds-traffic-max); }

  /* 모바일: 데스크톱 윈도우 메타포(traffic lights, inset, radius)를 떼고 풀스크린 */
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    main:has(> header > [data-part="window-controls"]) {
      position: fixed;
      inset: 0;
      border-radius: 0;
    }
    main:has(> header > [data-part="window-controls"]) > header {
      padding-inline: max(${pad(2)}, env(safe-area-inset-left)) max(${pad(2)}, env(safe-area-inset-right));
      padding-block-start: env(safe-area-inset-top);
    }
    [data-part="window-controls"] { display: none; }
  }
`

export const shell = () => chromeCss
