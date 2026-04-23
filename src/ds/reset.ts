import { css } from './fn'

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
    background: var(--ds-bg);
  }
  body {
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  code, kbd, samp, pre { font-family: var(--ds-font-mono); font-size: 0.92em; }
  h1 { font-size: var(--ds-text-2xl); line-height: var(--ds-leading-tight); font-weight: 600; }
  h2 { font-size: var(--ds-text-xl);  line-height: var(--ds-leading-tight); font-weight: 600; }
  h3 { font-size: var(--ds-text-lg);  line-height: var(--ds-leading-tight); font-weight: 600; }
  h4, h5, h6 { font-size: var(--ds-text-md); font-weight: 600; }
  small { font-size: var(--ds-text-sm); color: var(--ds-muted); }
  img, picture, video, canvas, svg { display: block; max-width: 100%; }
  input, button, textarea, select { font: inherit; color: inherit; }
  button { background: none; border: 0; }
  p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
  ul, ol { padding: 0; list-style: none; }
  a { color: inherit; text-decoration: none; }
  :focus-visible { outline: none; }
`
