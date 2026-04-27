import { css, dim, font, pad, radius, status } from '../tokens/foundations'

/**
 * ContractCard slot inner styling — Card primitive 슬롯 안의 컨트랙트 특화 시각만.
 *
 * # Gestalt HMI 적용 (2026-04-26)
 * 평소 표시: preview + h3 + 통과 dot indicator + (drift ⚠) — 4 슬롯
 * hover/focus-within/[data-selected]: meta(file) + body(signature) + checks 슬라이드 인
 *
 * sep ladder (단조 감소):
 *   카드 ↔ 카드 (grid gap)        → group  1.5em
 *   카드 안 preview ↔ title       → sibling 1.0em (Card primitive 담당)
 *   title 안 (h3 ↔ badge)         → bonded  0.25em
 *
 * 평소 노이즈 0 — preview 가 카드의 80%. 디테일은 사용자 의도(hover/focus) 시에만.
 */
export const contractCard = () => css`
  /* title 슬롯 header — h3 와 통과 indicator 한 row, bonded gap */
  article[data-part="card"][data-card="contract"] > [data-slot="title"] > header {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: baseline;
    gap: 0.25em;
  }
  article[data-part="card"][data-card="contract"] > [data-slot="title"] > header > [data-part="heading"][data-level="h3"] {
    margin: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  /* 통과 dot indicator — pass/total 을 점 N개로 압축. 텍스트 0줄. */
  article[data-part="card"][data-card="contract"] > [data-slot="title"] > header > [data-badge] {
    display: inline-flex;
    gap: 0.2em;
    align-items: center;
    flex: none;
    font-size: ${font('xs')};
    color: ${dim(60)};
  }
  /* badge 자체는 텍스트 안 보이고 dot 만. text 는 SR 전용으로. */
  article[data-part="card"][data-card="contract"] > [data-slot="title"] > header > [data-badge]::before {
    content: '';
    display: inline-block;
    inline-size: 0.5em; block-size: 0.5em; border-radius: ${radius('pill')};
  }
  article[data-part="card"][data-card="contract"] > [data-slot="title"] > header > [data-badge][data-tone="good"]::before { background: ${status('success')}; }
  article[data-part="card"][data-card="contract"] > [data-slot="title"] > header > [data-badge][data-tone="warn"]::before { background: ${status('warning')}; }
  article[data-part="card"][data-card="contract"] > [data-slot="title"] > header > [data-badge][data-tone="bad"]::before  { background: ${status('danger')}; }

  /* role / caption (caption-level heading): 평소 숨김. */
  article[data-part="card"][data-card="contract"] > [data-slot="title"] > header > code,
  article[data-part="card"][data-card="contract"] > [data-slot="title"] > header > [data-part="heading"][data-level="caption"] {
    grid-column: 1 / -1;
    display: none;
  }
  article[data-part="card"][data-card="contract"]:hover > [data-slot="title"] > header > code,
  article[data-part="card"][data-card="contract"]:focus-within > [data-slot="title"] > header > code,
  article[data-part="card"][data-card="contract"][data-selected="true"] > [data-slot="title"] > header > code,
  article[data-part="card"][data-card="contract"]:hover > [data-slot="title"] > header > [data-part="heading"][data-level="caption"],
  article[data-part="card"][data-card="contract"]:focus-within > [data-slot="title"] > header > [data-part="heading"][data-level="caption"],
  article[data-part="card"][data-card="contract"][data-selected="true"] > [data-slot="title"] > header > [data-part="heading"][data-level="caption"] {
    display: block;
  }

  /* meta·body·checks 슬롯 — 평소 숨김. hover/focus/selected 시에만 펼침. */
  article[data-part="card"][data-card="contract"] > :where([data-slot="meta"], [data-slot="body"], [data-slot="checks"]) {
    display: none;
  }
  article[data-part="card"][data-card="contract"]:hover > :where([data-slot="meta"], [data-slot="body"], [data-slot="checks"]),
  article[data-part="card"][data-card="contract"]:focus-within > :where([data-slot="meta"], [data-slot="body"], [data-slot="checks"]),
  article[data-part="card"][data-card="contract"][data-selected="true"] > :where([data-slot="meta"], [data-slot="body"], [data-slot="checks"]) {
    display: block;
  }

  /* 펼친 상태의 슬롯 시각 — 모두 mute, 본문 흐름 깨지 않게. */
  article[data-part="card"][data-card="contract"] > [data-slot="meta"] > code {
    background: transparent;
    padding: 0;
    font-size: ${font('xs')};
    color: ${dim(45)};
  }
  article[data-part="card"][data-card="contract"] > [data-slot="body"] > pre {
    margin: 0;
    background: ${dim(4)};
    padding: ${pad(1)};
    border-radius: ${radius('sm')};
    overflow-x: auto;
    max-block-size: 8em;
  }
  article[data-part="card"][data-card="contract"] > [data-slot="body"] > pre > code {
    background: transparent;
    padding: 0;
    font-size: ${font('xs')};
    color: ${dim(50)};
    white-space: pre;
  }
  article[data-part="card"][data-card="contract"] > [data-slot="checks"] [data-pass="true"]  { color: ${status('success')}; }
  article[data-part="card"][data-card="contract"] > [data-slot="checks"] [data-pass="false"] { color: ${status('danger')}; }

  /* hover/focus 시 카드 살짝 떠 보이게 — depth 4 (카드 안) 변화하지만 카드 ↔ 카드 도
     elev shadow 로 같이 강해지므로 HMI 유지. parts/Card 의 article[data-part="card"]
     rule 을 침범하지 않도록 :hover / :focus-within / [data-selected] selector 만. */
  article[data-part="card"][data-card="contract"]:hover,
  article[data-part="card"][data-card="contract"]:focus-within,
  article[data-part="card"][data-card="contract"][data-selected="true"] {
    box-shadow: 0 2px 8px ${dim(8)};
    transition: box-shadow 160ms ease;
  }
`
