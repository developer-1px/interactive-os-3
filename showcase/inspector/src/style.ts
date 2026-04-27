import { css, microLabel, status, grouping } from '@p/ds/tokens/foundations'
import { pad } from '@p/ds/tokens/palette'

// Inspector + DS Matrix — 검사 패널 셸 + 단일 셀 매트릭스 데모
export const inspectorCss = css`
  /* Inspector: canvas가 남은 공간을, aside panel이 고정폭. */
  section[aria-label="Canvas"] {
    flex: 1; min-width: 0; overflow: auto; display: grid; place-items: center;
    background: color-mix(in oklch, Canvas 93%, CanvasText 7%);
  }
  section[aria-label="Canvas"] > svg {
    width: 100%; height: 100%; max-width: 100%;
  }
  /* L1 — Inspector panel의 outer-layout(width)은 inspector-app shell이 소유. */
  main[data-part="inspector-app"] > section[data-slot="body"] > aside[data-part="panel"] {
    width: var(--ds-panel-w, 280px); flex: none; overflow-y: auto;
    border-inline-start: var(--ds-hairline) solid var(--ds-border);
  }
  /* widget-internal layout (column flow, tabpanel)은 widget이 소유. */
  aside[data-part="panel"] {
    display: flex; flex-direction: column;
  }
  aside[data-part="panel"] [role="tabpanel"] {
    display: flex; flex-direction: column;
  }
  section[data-part="panel-section"] {
    padding: ${pad(3)};
    border-bottom: var(--ds-hairline) solid var(--ds-border);
    display: flex; flex-direction: column; gap: ${pad(2)};
  }
  section[data-part="panel-section"] > h3 {
    ${microLabel()}
    margin: 0;
  }
  /* Inspector 패널 내부 field — label·control·unit 가로 정렬 (전역 form Field 와 다른 변형).
     selector를 inspector-app 안으로 스코프하지 않으면 다른 라우트의 Field 가 모두 grid 로 깨진다. */
  main[data-part="inspector-app"] [data-part="field"] {
    display: grid;
    grid-template-columns: 5rem 1fr auto;
    align-items: center; gap: ${pad(2)};
  }
  main[data-part="inspector-app"] [data-part="field"] > label { opacity: .6; font-size: var(--ds-text-sm); }
  main[data-part="inspector-app"] [data-part="field"] > [data-part="control"] {
    display: flex; align-items: center; gap: ${pad(1)}; min-width: 0;
  }
  main[data-part="inspector-app"] [data-part="field"] > [data-part="control"] > * { min-width: 0; flex: 1; }
  main[data-part="inspector-app"] [data-part="field"] > [data-part="unit"] {
    opacity: .5; font-size: var(--ds-text-sm); min-width: 1.5em; text-align: end;
  }

  /* DS Matrix — 컨트롤 하나당 cell 하나, 사람 눈이 일관성 판단 */
  main[data-part="ds-matrix"] {
    padding: ${pad(6)};
    display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: ${pad(2)};
    max-width: 1400px; margin: 0 auto;
  }
  main[data-part="ds-matrix"] > header { grid-column: 1 / -1; }
  main[data-part="ds-matrix"] > header h1 { margin: 0; }
  main[data-part="ds-matrix"] > header p { opacity: .6; margin: ${pad(1)} 0 0; }
  figure[data-part="matrix-cell"] {
    ${grouping(1)}
    margin: 0;
    border: var(--ds-hairline) solid var(--ds-border); border-radius: ${pad(1.5)};
    padding: ${pad(2)};
    display: grid; grid-template-rows: auto 1fr;
    gap: ${pad(1.5)};
    min-height: 120px;
  }
  figure[data-part="matrix-cell"] > figcaption {
    font-family: ui-monospace, monospace; font-size: var(--ds-text-sm);
    opacity: .7;
  }
  [data-cell-error] {
    color: ${status('danger')}; font-size: .75em;
    white-space: pre-wrap; word-break: break-word;
  }
`
