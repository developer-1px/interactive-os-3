import { accent, css, dim, hairline, listReset, pad, tint } from '../../../fn'
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
  ${listReset(`ol[aria-roledescription="orderable"]`)}
  ol[aria-roledescription="orderable"] {
    display: flex;
    flex-direction: column;
    padding: ${containerPad};
  }

  ol[aria-roledescription="orderable"] > li {
    display: flex;
    align-items: center;
    gap: ${slotGap};
    padding-block: ${pad(1)};
    transition: background var(--ds-dur-base) var(--ds-ease-out);
  }
  ${hairline(`ol[aria-roledescription="orderable"] > li`)}
  ol[aria-roledescription="orderable"] > li:hover {
    background: ${tint(accent(), 6)};
  }

  /* primary label — flex:1 + truncate */
  ol[aria-roledescription="orderable"] > li > span {
    flex: 1;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* drag handle — hit target 보장 */
  ol[aria-roledescription="orderable"] > li > button {
    cursor: grab;
    background: transparent;
    border: 0;
    color: ${dim(50)};
    min-inline-size: var(--ds-control-h);
    min-block-size: var(--ds-control-h);
    font-size: var(--ds-text-md);
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  ol[aria-roledescription="orderable"] > li > button:hover {
    color: var(--ds-fg);
  }

  /* trail slot — 시각·메타·우측 정렬 */
  ol[aria-roledescription="orderable"] > li > small {
    color: ${dim(55)};
    font-variant-numeric: tabular-nums;
  }

  /* drag 상태 시각 */
  ol[aria-roledescription="orderable"] > li[data-dragging] {
    opacity: 0.4;
    cursor: grabbing;
  }
  ol[aria-roledescription="orderable"] > li[data-dragging] > button {
    cursor: grabbing;
  }
  ol[aria-roledescription="orderable"] > li[data-drop-over] {
    box-shadow: inset 0 2px 0 0 var(--ds-accent);
  }
`
