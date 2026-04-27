import { control, css, dim, neutral, font, pad, radius } from '../../../tokens/foundations'
/**
 * Toolbar — 필터·액션을 담는 수평 컨테이너.
 *
 * 읽기(info)와 조작(control)이 한 바에 섞이는 게 일반 — 시각 계약:
 * - pressable (input/button/select): 기본 컨트롤 스타일 그대로
 * - 읽기 텍스트 (p[data-variant], span): dim + margin-inline-start: auto로
 *   오른쪽 밀어내 "정보 요약" 블록으로 분리
 * - separator: 그룹 경계 신호
 * - 컨테이너 자체: neutral-1 서피스 + radius로 "이건 한 묶음"이라는 괄호 역할
 */
export const toolbar = () => css`
  [role="toolbar"] {
    padding: ${pad(1.5)} ${pad(2)};
    background: ${neutral(1)};
    border-radius: ${radius('md')};
    row-gap: ${pad(1.5)};
  }

  /* 검색 input은 남은 공간을 먹도록 — 선언 순서와 무관하게 */
  [role="toolbar"] > input[type="text"],
  [role="toolbar"] > input:not([type]) {
    flex: 1 1 240px;
    min-inline-size: 0;
  }

  /* 읽기 텍스트(요약/카운트)는 우측으로 밀어내고 dim 처리 —
     조작 컨트롤 사이에 섞이지 않게 시각적으로 떨어뜨린다. */
  [role="toolbar"] > [data-variant] {
    margin-inline-start: auto;
    color: ${dim(60)};
    font-size: ${font('sm')};
    white-space: nowrap;
  }

  /* vertical separator — 얇고 높이는 컨트롤 높이에 맞춤 */
  [role="toolbar"] > [role="separator"][aria-orientation="vertical"] {
    inline-size: 1px;
    block-size: calc(${control('h')} * 0.6);
    background: ${neutral(3)};
    align-self: center;
  }

  /* ── toolbar group — pill 캡슐 단위로 액션 묶기 (Apple Mail 패턴) ──
     role="group"을 toolbar 안에 두면 내부 버튼이 pill 클러스터로 묶임.
     segmented 느낌 — 1개짜리 그룹도 허용(독립 pill). */
  [role="toolbar"] > [role="group"] {
    display: inline-flex;
    align-items: center;
    gap: ${pad(0.25)};
    padding: ${pad(0.5)};
    background: ${neutral(2)};
    border-radius: ${radius('pill')};
  }
  [role="toolbar"] > [role="group"] > button {
    background: transparent;
    border: 0;
    border-radius: ${radius('pill')};
  }
  [role="toolbar"] > [role="group"] > button:hover:not(:disabled) {
    background: ${neutral(3)};
  }
`
