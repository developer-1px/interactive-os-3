import { border, css, dur, ease, grouping, hairlineWidth, radius, scrim, slot, surface } from '../../../tokens/semantic'

// 잔존 — Dialog/Tooltip 은 ui/4-window/{Dialog,Tooltip}.style.ts 로 이전.
// popover + sheet 는 ui/ 컴포넌트 매칭 없는 orphan 으로 임시 보존.
export const cssPopover = () => css`
  /* Popover — non-modal light-dismiss. native [popover] element. dialog와 외형 공유하되
     centered 강제 풀고, padding/border-radius만 기본값. 위치는 소비 측이 결정.
     [popover]는 modal <dialog>와 달리 ::backdrop을 만들지 않으므로 scrim 옵션 시
     body::before로 dim layer를 깐다 (popover는 top layer라 scrim 위에 떠 있음). */
  [popover][role="dialog"][data-part="popover"] {
    ${grouping(3)}
    background-color: ${surface('default')};
    color: inherit;
    margin: 0;
    padding: ${slot.popover.pad};
    border-radius: ${radius('lg')};
    border: ${hairlineWidth()} solid ${border()};
    box-shadow: var(--ds-elev-3);
  }
  body:has([popover][data-ds-scrim]:popover-open)::before {
    content: '';
    position: fixed; inset: 0;
    background: ${scrim('strong')};
    z-index: 99;
    pointer-events: none;
  }

  /* Sheet — edge-anchored dialog (모바일 drawer). max-width/centering 무력화 + 슬라이드. */
  :where(dialog[data-ds-sheet]) {
    margin: 0;
    max-width: none;
    border-radius: 0;
    padding: ${slot.sheet.pad};
    transition: translate ${dur('base')} ${ease('out')};
  }
  :where(dialog[data-ds-sheet="end"]) {
    inset-block: 0; inset-inline-end: 0; inset-inline-start: auto;
    block-size: 100dvh; inline-size: min(360px, 92vw);
    border-inline-start: ${hairlineWidth()} solid ${border()};
  }
  :where(dialog[data-ds-sheet="start"]) {
    inset-block: 0; inset-inline-start: 0; inset-inline-end: auto;
    block-size: 100dvh; inline-size: min(320px, 88vw);
    border-inline-end: ${hairlineWidth()} solid ${border()};
  }
  :where(dialog[data-ds-sheet="bottom"]) {
    inset-inline: 0; inset-block-end: 0; inset-block-start: auto;
    inline-size: 100%; max-block-size: 88dvh;
    border-start-start-radius: ${radius('lg')};
    border-start-end-radius: ${radius('lg')};
    border-block-start: ${hairlineWidth()} solid ${border()};
  }
`
