import { border, css, font, icon, pad, radius } from '../../../fn'
export const detailsCss = css`
  :where(details) {
    border: 1px solid ${border()};
    border-radius: ${radius('sm')};
    overflow: hidden;
  }
  :where(details) + :where(details) { border-top-width: 0; border-radius: 0; }
  :where(details:first-child) {
    border-top-left-radius: ${radius('sm')};
    border-top-right-radius: ${radius('sm')};
  }
  :where(details:last-child) {
    border-bottom-left-radius: ${radius('sm')};
    border-bottom-right-radius: ${radius('sm')};
  }
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
    ${icon('chevronRight')}
    opacity: .6;
    transition: transform 120ms;
    flex: none;
  }
  :where(details[open]) > :where(summary)::before { transform: rotate(90deg); }
  :where(details[open]) > :where(summary) { border-bottom: 1px solid ${border()}; }
  :where(details) > :not(summary) { padding: ${pad(2)}; }

  /* summary 내부 rhythm — strong(이름) · span(설명) · small(메타) 3단 위계.
     small은 자동으로 오른쪽 정렬되어 메타(개수 등) 역할을 고정한다. */
  :where(details) > :where(summary) > :where(strong) { font-weight: 600; }
  :where(details) > :where(summary) > :where(span)   { opacity: .7; min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  :where(details) > :where(summary) > :where(small)  {
    margin-inline-start: auto;
    opacity: .55;
    font-size: ${font('xs')};
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  /* details 리스트 맨 끝의 "+ 추가" 버튼 — 리스트의 연장선으로 읽히도록 ghost row. */
  :where(details) + :where(button[data-icon="plus"]) {
    display: flex; align-items: center; justify-content: center;
    gap: ${pad(1.5)};
    inline-size: 100%;
    margin-block-start: -1px;
    padding: ${pad(2)};
    background: transparent;
    border: 1px dashed ${border()};
    border-radius: ${radius('sm')};
    border-top-left-radius: 0; border-top-right-radius: 0;
    color: inherit; opacity: .7;
    cursor: pointer;
  }
  :where(details) + :where(button[data-icon="plus"]):hover { opacity: 1; }
`
