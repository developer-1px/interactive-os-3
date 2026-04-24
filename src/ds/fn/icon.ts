import { css } from './values'

// lucide-static v1.9.0 — 각 SVG 는 별도 asset 파일로 emit (Vite `?url`).
// JS 번들엔 URL 문자열만, SVG 본문은 브라우저가 mask-image 페인트 시점에 lazy fetch.
const lucideUrls = import.meta.glob('/node_modules/lucide-static/icons/*.svg', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

const urlByBasename = Object.fromEntries(
  Object.entries(lucideUrls).map(([p, url]) => [p.match(/([^/]+)\.svg$/)![1], url]),
) as Record<string, string>

// 토큰 이름이 lucide 파일명과 다를 때만 오버라이드 (대부분 camelCase → kebab 자동 변환).
const alias: Record<string, string> = {
  dir: 'folder',
  dirOpen: 'folder-open',
  fileConfig: 'file-cog',
  fileGlobe: 'file',
  filePalette: 'palette',
}

const toKebab = (s: string) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())

// ds 커스텀 아이콘 — lucide 에 없는 것만 인라인 data URL 로 유지.
const svgUrl = (svg: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}")`
const lucideShell = (body: string) =>
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${body}</svg>`
const customUrls: Record<string, string> = {
  dot: svgUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='3' fill='black'/></svg>`,
  ),
  'align-top':    svgUrl(lucideShell(`<path d='M12 9v12'/><path d='M18 7v14'/><path d='M6 3h18'/>`)),
  'align-bottom': svgUrl(lucideShell(`<path d='M12 3v12'/><path d='M18 3v14'/><path d='M3 21h18'/>`)),
}

// 토큰 목록 — 소비 지점에서 참조하는 이름 집합.
const tokens = [
  'chevronRight', 'chevronDown', 'check', 'dot',
  'dir', 'dirOpen',
  'file', 'fileCode', 'fileConfig', 'fileImage', 'fileText', 'fileGlobe', 'filePalette',
  'home', 'sliders', 'palette',
  'align-left', 'align-center-horizontal', 'align-right',
  'align-top', 'align-center-vertical', 'align-bottom',
  'arrow-right', 'arrow-down', 'plus', 'settings',
  'x', 'star', 'arrow-up', 'arrow-left', 'trending-up', 'trending-down',
  'video', 'users', 'badge-check', 'door-open',
  'inbox', 'send', 'ban', 'trash', 'reply', 'forward', 'archive', 'star-off',
  'hash', 'lock', 'user',
] as const

export type IconToken = (typeof tokens)[number]

const urlOf = (t: IconToken): string => {
  if (customUrls[t]) return customUrls[t]
  const file = alias[t] ?? toKebab(t)
  const url = urlByBasename[file]
  if (!url) throw new Error(`icon: lucide-static has no '${file}.svg' (token '${t}')`)
  return `url("${url}")`
}

const varName = (t: IconToken) => `--ds-icon-${t}`

export const iconVars = () => css`
  :root {
${tokens.map((t) => `    ${varName(t)}: ${urlOf(t)};`).join('\n')}
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
${tokens
  .map(
    (t) =>
      `  [data-icon="${t}"]::before { -webkit-mask-image: var(${varName(t)}); mask-image: var(${varName(t)}); }`,
  )
  .join('\n')}
`
