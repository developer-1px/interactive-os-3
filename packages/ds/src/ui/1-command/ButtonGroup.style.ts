import { accent, css, hairlineWidth } from '../../tokens/semantic'

/**
 * ButtonGroup — visually attached cluster of buttons (Material/Polaris/Bootstrap).
 * Toolbar(ARIA) 와 의미 분리: ButtonGroup 은 *시각 묶음*, Toolbar 는 *키보드 roving 묶음*.
 *
 * 변형 prop 없음 — 자식 button 의 기본 시각을 인접 처리(라운드 collapse)만 한다.
 */
export const cssButtonGroup = () => css`
  [data-part="button-group"] {
    display: inline-flex;
    isolation: isolate;
  }
  [data-part="button-group"][data-orientation="vertical"] { flex-direction: column; }

  /* horizontal — 가운데 라운드 0, 인접 경계 겹치기 */
  [data-part="button-group"][data-orientation="horizontal"] > button:not(:first-child) {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
    margin-inline-start: calc(${hairlineWidth()} * -1);
  }
  [data-part="button-group"][data-orientation="horizontal"] > button:not(:last-child) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  /* vertical */
  [data-part="button-group"][data-orientation="vertical"] > button:not(:first-child) {
    border-start-start-radius: 0;
    border-start-end-radius: 0;
    margin-block-start: calc(${hairlineWidth()} * -1);
  }
  [data-part="button-group"][data-orientation="vertical"] > button:not(:last-child) {
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }

  /* hover/focus 가 인접 경계 위로 올라오도록 */
  [data-part="button-group"] > button:hover,
  [data-part="button-group"] > button:focus-visible,
  [data-part="button-group"] > button[aria-pressed="true"] {
    z-index: 1;
    border-color: ${accent()};
  }
`
