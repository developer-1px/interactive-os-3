import { border, css, dim, grouping, hairlineWidth, pad, radius } from '../../foundations'

/**
 * Card — surface primitive. 슬롯은 vertical flex stack.
 *
 * 카드 root: `<article data-part="card">` 안에 `<div data-slot="<name>">` 자식들.
 * 슬롯 어휘: preview · title · meta · body · checks · footer.
 *
 * 슬롯 cross-card baseline 정렬(subgrid)은 후속 PR에서 — 현재는 단순 vertical stack.
 * 부모 Grid 가 `cardGrid` 일 때 추가 시각(예: row gap 동기화)만 옵션으로 얹는다.
 */
export const card = () => css`
  article[data-part="card"] {
    ${grouping(1)}
    display: flex;
    flex-direction: column;
    gap: ${pad(1.5)};
    border: ${hairlineWidth()} solid ${border()};
    border-radius: ${radius('md')};
    padding: ${pad(2.5)};
    min-inline-size: 0;
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  article[data-part="card"]:hover {
    border-color: ${dim(15)};
    box-shadow: 0 1px 3px ${dim(6)};
  }
  article[data-part="card"][aria-current="true"] {
    border-color: var(--ds-accent);
    box-shadow: 0 0 0 1px var(--ds-accent), 0 1px 3px ${dim(6)};
  }
  article[data-part="card"]:focus-visible {
    outline: 2px solid var(--ds-accent);
    outline-offset: 2px;
  }

  /* slot blocks — 기본은 block. 슬롯 내부 시맨틱 태그(header/code/p/footer)는 호출처 책임. */
  article[data-part="card"] > [data-slot] {
    display: block;
    min-inline-size: 0;
  }

  /* preview 슬롯 — 카드의 주인공. 큰 영역 + 가운데 정렬. */
  article[data-part="card"] > [data-slot="preview"] {
    min-block-size: 220px;
    padding: ${pad(3)};
    background: ${dim(3)};
    border: ${hairlineWidth()} solid ${border()};
    border-radius: ${radius('md')};
    display: grid; place-items: center;
    overflow: hidden;
  }
  article[data-part="card"] > [data-slot="preview"] > * {
    max-inline-size: 100%;
  }
`
