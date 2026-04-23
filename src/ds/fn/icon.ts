import { css } from './values'

// Inline SVG → mask url. currentColor로 칠해지도록 alpha 마스크 방식.
const svgUrl = (svg: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}")`

export const icon = (svg: string, size: string = '1em') => css`
  content: '';
  display: inline-block;
  width: ${size};
  height: ${size};
  flex: none;
  background-color: currentColor;
  mask: ${svgUrl(svg)} center / contain no-repeat;
  -webkit-mask: ${svgUrl(svg)} center / contain no-repeat;
`

const S = (d: string) =>
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${d}</svg>`

export const icons = {
  chevronRight: S(`<path d='M6 3l5 5-5 5'/>`),
  chevronDown:  S(`<path d='M3 6l5 5 5-5'/>`),
  check:        S(`<path d='M3 8.5l3.2 3L13 4.5'/>`),
  dot:          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='2.5' fill='black'/></svg>`,
}
