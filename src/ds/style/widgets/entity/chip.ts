import { accent, css, dim, dur, ease, font, icon, pad, radius, tint } from '../../../fn'
/**
 * Chip — 삭제 가능한 태그 라벨. Badge(읽기)와 Button(컨트롤) 사이의 합성물.
 *
 * 사용: [aria-roledescription="chip"] 를 Row 같은 컨테이너에 부여하면 내부의
 * text + <button>(× remove)이 자동으로 chip 시각 계약을 받는다.
 *
 * 시각 계약:
 * - 컨테이너: dim(8) tint + pill radius + sm 타이포. Badge보다 약간 큼(삭제 타겟 필요).
 * - 내부 텍스트: 그대로
 * - 내부 <button>: 원형 ×, 기본 투명·hover tint — Badge도 Button도 아닌 미니 어포던스.
 */
export const chipCss = css`
  [aria-roledescription="chip"] {
    display: inline-flex;
    align-items: center;
    gap: ${pad(0.5)};
    padding: 2px 2px 2px ${pad(1.5)};
    background: ${dim(8)};
    border-radius: ${radius('pill')};
    font-size: ${font('sm')};
    line-height: 1.4;
    white-space: nowrap;
  }
  /* 내부 remove 버튼 — 원형, 기본 투명, hover 시 accent tint.
     × 글리프 대신 lucide 'x' 아이콘을 ::before mask로 그려 완벽한 시각 중앙 + 벡터 선명함.
     버튼 자체의 텍스트 content는 aria-label 역할만 — font-size: 0 로 텍스트 숨김. */
  [aria-roledescription="chip"] > button {
    all: unset;
    inline-size: 1.25em;
    block-size: 1.25em;
    min-height: 0;
    border-radius: 50%;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    color: inherit;
    opacity: .5;
    font-size: 0;
    transition: opacity ${dur('fast')} ${ease('out')},
                background-color ${dur('fast')} ${ease('out')};
  }
  [aria-roledescription="chip"] > button::before {
    ${icon('x', '0.85em')}
    font-size: ${font('sm')};
  }
  [aria-roledescription="chip"] > button:hover {
    opacity: 1;
    background: ${tint(accent(), 20)};
    color: ${accent()};
  }
  [aria-roledescription="chip"] > button:focus-visible {
    outline: 2px solid ${accent()};
    outline-offset: 2px;
    opacity: 1;
  }
`
