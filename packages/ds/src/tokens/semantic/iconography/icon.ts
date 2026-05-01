import { css } from '../css'
import { hairlineWidth } from '../shape/hairline'

// lucide-static v1.9.0 — 사용 토큰에 매핑되는 파일만 명시 import 한다.
// (eager glob 은 1944 개 SVG 모두 entry 로 끌어와 dev cold-start 를 망가뜨림)
import urlChevronRight from 'lucide-static/icons/chevron-right.svg?url'
import urlChevronDown from 'lucide-static/icons/chevron-down.svg?url'
import urlChevronLeft from 'lucide-static/icons/chevron-left.svg?url'
import urlCheck from 'lucide-static/icons/check.svg?url'
import urlFolder from 'lucide-static/icons/folder.svg?url'
import urlFolderOpen from 'lucide-static/icons/folder-open.svg?url'
import urlFile from 'lucide-static/icons/file.svg?url'
import urlFileCode from 'lucide-static/icons/file-code.svg?url'
import urlFileCog from 'lucide-static/icons/file-cog.svg?url'
import urlFileImage from 'lucide-static/icons/file-image.svg?url'
import urlFileText from 'lucide-static/icons/file-text.svg?url'
import urlHome from 'lucide-static/icons/home.svg?url'
import urlSliders from 'lucide-static/icons/sliders.svg?url'
import urlPalette from 'lucide-static/icons/palette.svg?url'
import urlAlignLeft from 'lucide-static/icons/align-left.svg?url'
import urlAlignCenterHorizontal from 'lucide-static/icons/align-center-horizontal.svg?url'
import urlAlignRight from 'lucide-static/icons/align-right.svg?url'
import urlAlignCenterVertical from 'lucide-static/icons/align-center-vertical.svg?url'
import urlArrowRight from 'lucide-static/icons/arrow-right.svg?url'
import urlArrowDown from 'lucide-static/icons/arrow-down.svg?url'
import urlArrowUp from 'lucide-static/icons/arrow-up.svg?url'
import urlArrowLeft from 'lucide-static/icons/arrow-left.svg?url'
import urlPlus from 'lucide-static/icons/plus.svg?url'
import urlSettings from 'lucide-static/icons/settings.svg?url'
import urlX from 'lucide-static/icons/x.svg?url'
import urlStar from 'lucide-static/icons/star.svg?url'
import urlStarOff from 'lucide-static/icons/star-off.svg?url'
import urlTrendingUp from 'lucide-static/icons/trending-up.svg?url'
import urlTrendingDown from 'lucide-static/icons/trending-down.svg?url'
import urlVideo from 'lucide-static/icons/video.svg?url'
import urlUsers from 'lucide-static/icons/users.svg?url'
import urlBadgeCheck from 'lucide-static/icons/badge-check.svg?url'
import urlDoorOpen from 'lucide-static/icons/door-open.svg?url'
import urlInbox from 'lucide-static/icons/inbox.svg?url'
import urlSend from 'lucide-static/icons/send.svg?url'
import urlBan from 'lucide-static/icons/ban.svg?url'
import urlTrash from 'lucide-static/icons/trash.svg?url'
import urlReply from 'lucide-static/icons/reply.svg?url'
import urlForward from 'lucide-static/icons/forward.svg?url'
import urlArchive from 'lucide-static/icons/archive.svg?url'
import urlHash from 'lucide-static/icons/hash.svg?url'
import urlLock from 'lucide-static/icons/lock.svg?url'
import urlUser from 'lucide-static/icons/user.svg?url'
import urlPin from 'lucide-static/icons/pin.svg?url'
import urlSearch from 'lucide-static/icons/search.svg?url'
import urlInfo from 'lucide-static/icons/info.svg?url'
import urlFilter from 'lucide-static/icons/filter.svg?url'
import urlEdit from 'lucide-static/icons/edit.svg?url'
import urlLayoutGrid from 'lucide-static/icons/layout-grid.svg?url'
import urlList from 'lucide-static/icons/list.svg?url'
import urlColumns3 from 'lucide-static/icons/columns-3.svg?url'
import urlGalleryVertical from 'lucide-static/icons/gallery-vertical.svg?url'
import urlHeart from 'lucide-static/icons/heart.svg?url'
import urlMessageCircle from 'lucide-static/icons/message-circle.svg?url'
import urlShare2 from 'lucide-static/icons/share-2.svg?url'
import urlMoreHorizontal from 'lucide-static/icons/more-horizontal.svg?url'
import urlCalendar from 'lucide-static/icons/calendar.svg?url'
import urlCalendarDays from 'lucide-static/icons/calendar-days.svg?url'
import urlCalendarRange from 'lucide-static/icons/calendar-range.svg?url'
import urlGripVertical from 'lucide-static/icons/grip-vertical.svg?url'
import urlMenu from 'lucide-static/icons/menu.svg?url'
import urlPanelLeft from 'lucide-static/icons/panel-left.svg?url'
import urlChartColumn from 'lucide-static/icons/chart-column.svg?url'
import urlAward from 'lucide-static/icons/award.svg?url'
import urlArrowUpDown from 'lucide-static/icons/arrow-up-down.svg?url'
import urlCode from 'lucide-static/icons/code.svg?url'
import urlWrench from 'lucide-static/icons/wrench.svg?url'
import urlShield from 'lucide-static/icons/shield.svg?url'
import urlBot from 'lucide-static/icons/bot.svg?url'
import urlLink from 'lucide-static/icons/link.svg?url'
import urlExternalLink from 'lucide-static/icons/external-link.svg?url'
import urlPaperclip from 'lucide-static/icons/paperclip.svg?url'
import urlGitCommit from 'lucide-static/icons/git-commit.svg?url'

const urlByBasename: Record<string, string> = {
  'chevron-right': urlChevronRight,
  'chevron-down': urlChevronDown,
  'chevron-left': urlChevronLeft,
  check: urlCheck,
  folder: urlFolder,
  'folder-open': urlFolderOpen,
  file: urlFile,
  'file-code': urlFileCode,
  'file-cog': urlFileCog,
  'file-image': urlFileImage,
  'file-text': urlFileText,
  home: urlHome,
  sliders: urlSliders,
  palette: urlPalette,
  'align-left': urlAlignLeft,
  'align-center-horizontal': urlAlignCenterHorizontal,
  'align-right': urlAlignRight,
  'align-center-vertical': urlAlignCenterVertical,
  'arrow-right': urlArrowRight,
  'arrow-down': urlArrowDown,
  'arrow-up': urlArrowUp,
  'arrow-left': urlArrowLeft,
  plus: urlPlus,
  settings: urlSettings,
  x: urlX,
  star: urlStar,
  'star-off': urlStarOff,
  'trending-up': urlTrendingUp,
  'trending-down': urlTrendingDown,
  video: urlVideo,
  users: urlUsers,
  'badge-check': urlBadgeCheck,
  'door-open': urlDoorOpen,
  inbox: urlInbox,
  send: urlSend,
  ban: urlBan,
  trash: urlTrash,
  reply: urlReply,
  forward: urlForward,
  archive: urlArchive,
  hash: urlHash,
  lock: urlLock,
  user: urlUser,
  pin: urlPin,
  search: urlSearch,
  info: urlInfo,
  filter: urlFilter,
  edit: urlEdit,
  'layout-grid': urlLayoutGrid,
  list: urlList,
  'columns-3': urlColumns3,
  'gallery-vertical': urlGalleryVertical,
  heart: urlHeart,
  'message-circle': urlMessageCircle,
  'share-2': urlShare2,
  'more-horizontal': urlMoreHorizontal,
  calendar: urlCalendar,
  'calendar-days': urlCalendarDays,
  'calendar-range': urlCalendarRange,
  'grip-vertical': urlGripVertical,
  menu: urlMenu,
  'panel-left': urlPanelLeft,
  'chart-column': urlChartColumn,
  award: urlAward,
  'arrow-up-down': urlArrowUpDown,
  code: urlCode,
  wrench: urlWrench,
  shield: urlShield,
  bot: urlBot,
  link: urlLink,
  'external-link': urlExternalLink,
  paperclip: urlPaperclip,
  'git-commit': urlGitCommit,
}

// 토큰 이름이 lucide 파일명과 다를 때만 오버라이드 (대부분 camelCase → kebab 자동 변환).
const alias: Record<string, string> = {
  dir: 'folder',
  dirOpen: 'folder-open',
  fileConfig: 'file-cog',
  fileGlobe: 'file',
  filePalette: 'palette',
  share: 'share-2',
  more: 'more-horizontal',
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
export const ICON_TOKENS = [
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
  'pin', 'search', 'info',
  'filter', 'edit',
  'layout-grid', 'list', 'columns-3', 'gallery-vertical',
  'heart', 'message-circle', 'share', 'more',
  'calendar', 'calendar-days', 'calendar-range',
  'grip-vertical', 'chevron-left',
  'menu', 'panel-left', 'chart-column', 'award', 'arrow-up-down',
  'code', 'wrench', 'shield', 'bot',
  'link', 'external-link', 'paperclip', 'git-commit',
] as const

export type IconToken = (typeof ICON_TOKENS)[number]

const urlOf = (t: IconToken): string => {
  if (customUrls[t]) return customUrls[t]
  const file = alias[t] ?? toKebab(t)
  const url = urlByBasename[file]
  if (!url) throw new Error(`icon: lucide-static has no '${file}.svg' (token '${t}')`)
  return `url("${url}")`
}

const varName = (t: IconToken) => `--ds-icon-${t}`

/** @demo type=recipe fn=iconVars */
export const iconVars = () => css`
  :root {
${ICON_TOKENS.map((t) => `    ${varName(t)}: ${urlOf(t)};`).join('\n')}
  }
`

/**
 * icon() — token 기반. mask만 var로, 나머지(색/크기/모양)는 공용 base.
 * @demo type=icon fn=icon args=["chevronRight","1em"]
 */
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

/**
 * data-icon 규약 CSS — 모든 토큰을 [data-icon="..."]::before로 펼친다.
 * @demo type=recipe fn=iconIndicator
 */
export const iconIndicator = () => css`
  /* base — 미등록 토큰은 :not(:is(${ICON_TOKENS.map((t) => `[data-icon="${t}"]`).join(',')}))로 따로 빨간 빗금 표시. */
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
  /* dev affordance — 미등록 토큰 (mask 없음) 은 시끄럽게: 빨간 빗금. 검정 박스가 정상 같던 문제 차단. */
  [data-icon]:not(${ICON_TOKENS.map((t) => `[data-icon="${t}"]`).join(', ')})::before {
    background-color: transparent;
    background-image: repeating-linear-gradient(45deg, #e11 0 3px, transparent 3px 6px);
    outline: ${hairlineWidth()} dashed #e11;
    opacity: 1;
  }
${ICON_TOKENS
  .map(
    (t) =>
      `  [data-icon="${t}"]::before { -webkit-mask-image: var(${varName(t)}); mask-image: var(${varName(t)}); }`,
  )
  .join('\n')}
`
