import { accent, accentTint, control, css, currentTint, dur, ease, radius, ring } from '../../tokens/foundations'
import { font, pad } from '../../tokens/palette'

/**
 * Chip — removable label. Material/Mantine 의 Input/Filter Chip 시맨틱.
 * 셀렉터: `span[data-part="chip"]`. optional remove `button[data-icon="x"]`.
 *
 * 정렬 표준 (control 티어):
 * - block-size: control('h') — input/button 과 가로 키라인 일치
 * - inline-flex + align-items: center — 라벨/아이콘 수직 정렬
 * - line-height: 1 — 텍스트가 자체 leading 으로 박스 키우는 것 차단
 * - padding-inline 비대칭 — 버튼이 있을 때 우측 인셋만 줄여 시각적 균형
 * - data-icon 표준: button 자체에 [data-icon="x"]. ::before margin/size 만 로컬 보정.
 */
export const cssChip = () => css`
  :where(span[data-part="chip"]) {
    display: inline-flex;
    align-items: center;
    gap: ${pad(0.5)};
    block-size: ${control('h')};
    padding-inline: ${pad(1.5)};
    background: ${currentTint('soft')};
    border-radius: ${radius('pill')};
    font-size: ${font('sm')};
    line-height: 1;
    white-space: nowrap;
  }
  :where(span[data-part="chip"]:has(> button)) {
    padding-inline-end: ${pad(0.5)};
  }
  span[data-part="chip"] > button {
    all: unset;
    inline-size: 1.5em;
    block-size: 1.5em;
    border-radius: ${radius('pill')};
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    color: inherit;
    opacity: .55;
    transition: opacity ${dur('fast')} ${ease('out')},
                background-color ${dur('fast')} ${ease('out')};
  }
  /* data-icon ::before 의 base 어휘(margin-inline-end · 1.25em)를 chip remove 컨텍스트에 맞게 보정 */
  span[data-part="chip"] > button[data-icon]::before {
    margin: 0;
    inline-size: 0.9em;
    block-size: 0.9em;
    opacity: 1;
  }
  span[data-part="chip"] > button:hover {
    opacity: 1;
    background: ${accentTint('medium')};
    color: ${accent()};
  }
  span[data-part="chip"] > button:focus-visible {
    ${ring()}
    opacity: 1;
  }
`
