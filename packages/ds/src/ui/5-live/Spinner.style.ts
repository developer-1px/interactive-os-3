import { accent, css, radius, status, text } from '../../tokens/foundations'

/**
 * Spinner — inline loading indicator. CircularProgress 풍.
 * data-part="spinner" + role="status". conic-gradient 마스크 회전.
 * Skeleton(layout placeholder) 와 의미 분리 — Spinner 는 *작업 진행 중* 어휘.
 */
export const cssSpinner = () => css`
  [data-part="spinner"] {
    display: inline-block;
    inline-size: 1em;
    block-size: 1em;
    border-radius: ${radius('pill')};
    background: conic-gradient(from 0deg, currentColor, transparent 75%);
    -webkit-mask: radial-gradient(circle, transparent 50%, #000 52%);
            mask: radial-gradient(circle, transparent 50%, #000 52%);
    animation: ds-spin 800ms linear infinite;
    color: ${text('subtle')};
    vertical-align: middle;
  }
  [data-part="spinner"][data-size="sm"] { inline-size: .875em; block-size: .875em; }
  [data-part="spinner"][data-size="lg"] { inline-size: 1.5em;  block-size: 1.5em; }
  [data-part="spinner"][data-tone="info"]    { color: ${accent()}; }
  [data-part="spinner"][data-tone="success"] { color: ${status('success')}; }
  [data-part="spinner"][data-tone="warning"] { color: ${status('warning')}; }
  [data-part="spinner"][data-tone="danger"]  { color: ${status('danger')}; }
  @keyframes ds-spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    [data-part="spinner"] { animation-duration: 2400ms; }
  }
`
