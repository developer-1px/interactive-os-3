import { css } from '../../foundations'

// Modern hard reset (Josh Comeau + Andy Bell 참고, 최소판)
export const reset = css`
  *, *::before, *::after { box-sizing: border-box; }
  * { margin: 0; }
  html, body { height: 100%; }
  html {
    color-scheme: light dark;
    font-family: var(--ds-font-sans);
    font-size: var(--ds-text-md);
    line-height: var(--ds-leading);
    letter-spacing: var(--ds-tracking);
    color: var(--ds-fg);
    /* page ground = tinted base. 컨트롤/카드는 --ds-bg(Canvas/pure)로 떠 보임. */
    background: var(--ds-base);
  }
  body {
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  /* 모든 element 셀렉터 :where() 로 spec 0,0,0 — author 규칙(어떤 layer든)이 자동 우위.
     reset 은 "최후의 fallback", 위계 경쟁 대상 아님. */
  :where(code, kbd, samp, pre) { font-family: var(--ds-font-mono); font-size: 0.92em; }
  :where(h1) { font-size: var(--ds-text-2xl); line-height: var(--ds-leading-tight); font-weight: 600; }
  :where(h2) { font-size: var(--ds-text-xl);  line-height: var(--ds-leading-tight); font-weight: 600; }
  :where(h3) { font-size: var(--ds-text-lg);  line-height: var(--ds-leading-tight); font-weight: 600; }
  :where(h4, h5, h6) { font-size: var(--ds-text-md); font-weight: 600; }
  :where(small) { font-size: var(--ds-text-sm); color: var(--ds-muted); }
  :where(img, picture, video, canvas, svg) { display: block; max-width: 100%; }
  :where(input, button, textarea, select) { font: inherit; color: inherit; }
  :where(button) { background: none; border: 0; }
  :where(p, h1, h2, h3, h4, h5, h6) { overflow-wrap: break-word; }
  :where(ul, ol) { padding: 0; list-style: none; }
  :where(a) { color: inherit; text-decoration: none; }
  :where(:focus-visible) { outline: none; }
`
