import { accent, css, dur, ease, hairline, listReset, mute, pad, tint } from '../../../foundations'
import { containerPad, slotGap } from '../../seed/keyline'

/**
 * OrderableList — drag-to-reorder list.
 *
 * 컨테이너는 일반 `<ol role="list">` 로 base.ts 의 grid+subgrid 시스템 밖에
 * 있다 (subgrid 3-track 모델보다 더 많은 슬롯이 필요해 flex 가 적합).
 * 간격은 ds keyline 토큰을 그대로 소비:
 *   - container padding   = containerPad   (외부 여백)
 *   - 같은 행 안 슬롯 gap = slotGap        (외부 < 내부 역전 방지, Law of Proximity)
 *   - 행 사이 분리        = hairline()      (재사용 helper)
 * 핸들 button 의 hit target 은 --ds-control-h 로 보장한다.
 */
export const orderableCss = () => css`
  ${listReset(`ol[data-part="orderable"]`)}
  ol[data-part="orderable"] {
    display: flex;
    flex-direction: column;
    padding: ${containerPad};
  }

  ol[data-part="orderable"] > li {
    display: flex;
    align-items: center;
    gap: ${slotGap};
    padding-block: ${pad(1)};
    transition: background ${dur('base')} ${ease('out')};
  }
  ${hairline(`ol[data-part="orderable"] > li`)}
  ol[data-part="orderable"] > li:hover {
    background: ${tint(accent(), 6)};
  }

  /* primary label — flex:1 + truncate */
  ol[data-part="orderable"] > li > span {
    flex: 1;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* drag handle — icon-only button[data-icon="grip-vertical"].
     base.ts controlBox + button.ts square('button[data-icon]:empty') 가 정사각형
     축과 가운데 정렬을 자동 적용한다. cell-level은 color: inherit + opacity로 약화/복귀
     (mute primitive). surface flip 시 대비 안전. */
  ol[data-part="orderable"] > li > button {
    cursor: grab;
    background: transparent;
    border-color: transparent;
    color: inherit;
    ${mute(3)}
  }
  ol[data-part="orderable"] > li > button:hover {
    opacity: 1;
  }

  /* trail slot — 시각·메타·우측 정렬 */
  ol[data-part="orderable"] > li > small {
    color: inherit;
    ${mute(2)}
    font-variant-numeric: tabular-nums;
  }

  /* drag 상태 시각 */
  ol[data-part="orderable"] > li[data-dragging] {
    opacity: 0.4;
    cursor: grabbing;
  }
  ol[data-part="orderable"] > li[data-dragging] > button {
    cursor: grabbing;
  }
  ol[data-part="orderable"] > li[data-drop-over] {
    box-shadow: inset 0 2px 0 0 ${accent()};
  }
`
