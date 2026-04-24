import { css } from './values'

const svgUrl = (svg: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}")`

// lucide v1.9.0에서 추출. mask 용도이므로 stroke='black' (alpha).
const lucide = (body: string) =>
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'>${body}</svg>`

const svgs = {
  chevronRight: lucide(`<path d='m9 18 6-6-6-6'/>`),
  chevronDown:  lucide(`<path d='m6 9 6 6 6-6'/>`),
  check:        lucide(`<path d='M20 6 9 17l-5-5'/>`),
  dot:          lucide(`<circle cx='12' cy='12' r='3' fill='black' stroke='none'/>`),

  dir:          lucide(`<path d='M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z'/>`),
  dirOpen:      lucide(`<path d='m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2'/>`),
  file:         lucide(`<path d='M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z'/><path d='M14 2v5a1 1 0 0 0 1 1h5'/>`),
  fileCode:     lucide(`<path d='M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z'/><path d='M14 2v5a1 1 0 0 0 1 1h5'/><path d='M10 12.5 8 15l2 2.5'/><path d='m14 12.5 2 2.5-2 2.5'/>`),
  fileConfig:   lucide(`<path d='M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z'/><path d='M14 2v5a1 1 0 0 0 1 1h5'/><path d='M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1'/><path d='M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1'/>`),
  fileImage:    lucide(`<path d='M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z'/><path d='M14 2v5a1 1 0 0 0 1 1h5'/><circle cx='10' cy='12' r='2'/><path d='m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22'/>`),
  fileText:     lucide(`<path d='M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z'/><path d='M14 2v5a1 1 0 0 0 1 1h5'/><path d='M10 9H8'/><path d='M16 13H8'/><path d='M16 17H8'/>`),
  fileGlobe:    lucide(`<path d='M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z'/><path d='M14 2v5a1 1 0 0 0 1 1h5'/>`),
  filePalette:  lucide(`<path d='M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z'/><path d='M14 2v5a1 1 0 0 0 1 1h5'/><circle cx='10' cy='14' r='1' fill='black'/><circle cx='13' cy='11' r='1' fill='black'/><circle cx='16' cy='14' r='1' fill='black'/>`),

  home:         lucide(`<path d='M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8'/><path d='M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/>`),
  sliders:      lucide(`<path d='M10 5H3'/><path d='M12 19H3'/><path d='M14 3v4'/><path d='M16 17v4'/><path d='M21 12h-9'/><path d='M21 19h-5'/><path d='M21 5h-7'/><path d='M8 10v4'/><path d='M8 12H3'/>`),
  palette:      lucide(`<path d='M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z'/><circle cx='13.5' cy='6.5' r='.8' fill='black' stroke='none'/><circle cx='17.5' cy='10.5' r='.8' fill='black' stroke='none'/><circle cx='6.5' cy='12.5' r='.8' fill='black' stroke='none'/><circle cx='8.5' cy='7.5' r='.8' fill='black' stroke='none'/>`),

  'align-left':              lucide(`<path d='M15 12H3'/><path d='M17 18H3'/><path d='M21 6H3'/>`),
  'align-center-horizontal': lucide(`<path d='M17 12H7'/><path d='M19 18H5'/><path d='M21 6H3'/>`),
  'align-right':             lucide(`<path d='M21 12H9'/><path d='M21 18H7'/><path d='M21 6H3'/>`),
  'align-top':               lucide(`<path d='M12 9v12'/><path d='M18 7v14'/><path d='M6 3h18'/>`),
  'align-center-vertical':   lucide(`<path d='M12 7v10'/><path d='M18 5v14'/><path d='M6 3v18'/>`),
  'align-bottom':            lucide(`<path d='M12 3v12'/><path d='M18 3v14'/><path d='M3 21h18'/>`),
  'arrow-right':             lucide(`<path d='M5 12h14'/><path d='m12 5 7 7-7 7'/>`),
  'arrow-down':              lucide(`<path d='M12 5v14'/><path d='m19 12-7 7-7-7'/>`),
  'plus':                    lucide(`<path d='M5 12h14'/><path d='M12 5v14'/>`),
  'settings':                lucide(`<path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'/><circle cx='12' cy='12' r='3'/>`),
} as const

export type IconToken = keyof typeof svgs

const varName = (t: IconToken) => `--ds-icon-${t}`

export const iconVars = () => css`
  :root {
${(Object.keys(svgs) as IconToken[])
  .map((t) => `    ${varName(t)}: ${svgUrl(svgs[t])};`)
  .join('\n')}
  }
`

/** icon() — token 기반. mask만 var로, 나머지(색/크기/모양)는 공용 base. */
export const icon = (token: IconToken, size: string = '1em') => css`
  content: '';
  display: inline-block;
  width: ${size};
  height: ${size};
  flex: none;
  background-color: currentColor;
  mask: var(${varName(token)}) center / contain no-repeat;
  -webkit-mask: var(${varName(token)}) center / contain no-repeat;
`

/** data-icon 규약 CSS — 모든 토큰을 [data-icon="..."]::before로 펼친다. */
export const iconIndicator = () => css`
  [data-icon]::before {
    content: '';
    display: inline-block;
    width: 1.25em;
    height: 1.25em;
    flex: none;
    background-color: currentColor;
    -webkit-mask: center / contain no-repeat;
            mask: center / contain no-repeat;
    margin-inline-end: calc(var(--ds-space) * 1);
    opacity: .65;
  }
${(Object.keys(svgs) as IconToken[])
  .map(
    (t) =>
      `  [data-icon="${t}"]::before { -webkit-mask-image: var(${varName(t)}); mask-image: var(${varName(t)}); }`,
  )
  .join('\n')}
`
