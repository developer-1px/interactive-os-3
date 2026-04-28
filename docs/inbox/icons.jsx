// Minimal line icon library — 20×20, 1.5 stroke
// Usage: <Icon name="search" size={16} />

const ICON_PATHS = {
  search: <><circle cx="9" cy="9" r="6"/><path d="m14 14 4 4"/></>,
  plus: <><path d="M10 4v12M4 10h12"/></>,
  check: <path d="m4 10 4 4 8-8"/>,
  x: <path d="m5 5 10 10M15 5 5 15"/>,
  chevronRight: <path d="m8 5 5 5-5 5"/>,
  chevronDown: <path d="m5 8 5 5 5-5"/>,
  arrowRight: <><path d="M4 10h12M11 5l5 5-5 5"/></>,
  arrowUp: <><path d="M10 16V4M5 9l5-5 5 5"/></>,
  download: <><path d="M10 4v9M5 9l5 5 5-5M3 17h14"/></>,
  upload: <><path d="M10 16V5M5 10l5-5 5 5M3 17h14"/></>,
  user: <><circle cx="10" cy="7" r="3"/><path d="M4 17c.5-3 3-5 6-5s5.5 2 6 5"/></>,
  users: <><circle cx="8" cy="7" r="3"/><path d="M2 17c.5-3 2.5-5 6-5s5.5 2 6 5M14 4a3 3 0 0 1 0 6"/></>,
  settings: <><circle cx="10" cy="10" r="2.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"/></>,
  bell: <><path d="M15 13H5l1.5-2v-3a3.5 3.5 0 0 1 7 0v3z"/><path d="M8.5 16a1.5 1.5 0 0 0 3 0"/></>,
  mail: <><rect x="3" y="5" width="14" height="10" rx="1.5"/><path d="m4 7 6 4 6-4"/></>,
  calendar: <><rect x="3" y="4" width="14" height="13" rx="1.5"/><path d="M3 8h14M7 2v3M13 2v3"/></>,
  clock: <><circle cx="10" cy="10" r="6"/><path d="M10 6v4l3 2"/></>,
  home: <path d="m3 9 7-5 7 5v8H3z"/>,
  folder: <path d="M3 6c0-.5.5-1 1-1h4l2 2h6c.5 0 1 .5 1 1v7c0 .5-.5 1-1 1H4c-.5 0-1-.5-1-1z"/>,
  file: <><path d="M5 3h7l3 3v11H5z"/><path d="M12 3v3h3"/></>,
  star: <path d="m10 3 2.2 4.6 5 .7-3.6 3.5.9 5L10 14.4 5.5 16.8l.9-5L2.8 8.3l5-.7z"/>,
  heart: <path d="M10 16s-6-3.5-6-8a3.5 3.5 0 0 1 6-2.5A3.5 3.5 0 0 1 16 8c0 4.5-6 8-6 8z"/>,
  trash: <><path d="M4 6h12M8 6V4h4v2M5 6l1 11h8l1-11"/></>,
  edit: <><path d="m13 3 4 4-9 9H4v-4z"/><path d="m11 5 4 4"/></>,
  copy: <><rect x="6" y="6" width="10" height="10" rx="1.5"/><path d="M4 13V5a1 1 0 0 1 1-1h8"/></>,
  link: <><path d="M9 11a3 3 0 0 0 4 0l3-3a3 3 0 1 0-4-4l-1 1"/><path d="M11 9a3 3 0 0 0-4 0l-3 3a3 3 0 1 0 4 4l1-1"/></>,
  externalLink: <><path d="M11 4h5v5"/><path d="M16 4l-7 7"/><path d="M14 11v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4"/></>,
  filter: <path d="M3 5h14l-5 6v5l-4-2v-3z"/>,
  sort: <><path d="M5 3v14M2 14l3 3 3-3"/><path d="M15 17V3M12 6l3-3 3 3"/></>,
  menu: <><path d="M3 6h14M3 10h14M3 14h14"/></>,
  more: <><circle cx="5" cy="10" r="1"/><circle cx="10" cy="10" r="1"/><circle cx="15" cy="10" r="1"/></>,
  info: <><circle cx="10" cy="10" r="7"/><path d="M10 9v5M10 6.5v.5"/></>,
  warning: <><path d="m10 3 8 14H2z"/><path d="M10 8v4M10 14.5v.5"/></>,
  error: <><circle cx="10" cy="10" r="7"/><path d="m7 7 6 6M13 7l-6 6"/></>,
  success: <><circle cx="10" cy="10" r="7"/><path d="m7 10 2 2 4-4"/></>,
  eye: <><path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z"/><circle cx="10" cy="10" r="2.5"/></>,
  lock: <><rect x="4" y="9" width="12" height="8" rx="1.5"/><path d="M7 9V6a3 3 0 0 1 6 0v3"/></>,
  globe: <><circle cx="10" cy="10" r="7"/><path d="M3 10h14M10 3a10 10 0 0 1 0 14M10 3a10 10 0 0 0 0 14"/></>,
  image: <><rect x="3" y="4" width="14" height="12" rx="1.5"/><circle cx="7" cy="8" r="1.5"/><path d="m3 14 4-4 5 5M11 11l3-3 3 3"/></>,
  grid: <><rect x="3" y="3" width="6" height="6"/><rect x="11" y="3" width="6" height="6"/><rect x="3" y="11" width="6" height="6"/><rect x="11" y="11" width="6" height="6"/></>,
  list: <><path d="M7 5h11M7 10h11M7 15h11"/><circle cx="3.5" cy="5" r=".5"/><circle cx="3.5" cy="10" r=".5"/><circle cx="3.5" cy="15" r=".5"/></>,
  bold: <path d="M5 3h6a3 3 0 0 1 0 6H5zM5 9h7a3 3 0 0 1 0 6H5z"/>,
  italic: <path d="M8 3h8M4 17h8M12 3 8 17"/>,
  underline: <path d="M5 3v7a5 5 0 0 0 10 0V3M3 18h14"/>,
  alignLeft: <path d="M3 5h14M3 10h10M3 15h14"/>,
  alignCenter: <path d="M3 5h14M5 10h10M3 15h14"/>,
  alignRight: <path d="M3 5h14M7 10h10M3 15h14"/>,
  play: <path d="M6 4v12l10-6z"/>,
  pause: <path d="M6 4h3v12H6zM11 4h3v12h-3z"/>,
  refresh: <><path d="M3 10a7 7 0 0 1 12-5l2 2"/><path d="M17 5v4h-4"/><path d="M17 10a7 7 0 0 1-12 5l-2-2"/><path d="M3 15v-4h4"/></>,
  arrowDown: <><path d="M10 4v12M5 11l5 5 5-5"/></>,
  send: <path d="m3 10 14-7-5 14-3-6z"/>,
  attach: <path d="m14 8-6 6a3 3 0 0 1-4-4l7-7a2 2 0 0 1 3 3l-7 7a1 1 0 0 1-1-1l6-6"/>,
  building: <><rect x="4" y="3" width="12" height="14"/><path d="M7 6h2M11 6h2M7 9h2M11 9h2M7 12h2M11 12h2"/></>,
  card: <><rect x="2" y="5" width="16" height="11" rx="1.5"/><path d="M2 8h16"/></>,
  bookmark: <path d="M5 3h10v15l-5-3-5 3z"/>,
  zap: <path d="m11 2-7 10h5l-1 6 7-10h-5z"/>,
  shield: <path d="M10 3 4 5v5c0 4 3 6 6 7 3-1 6-3 6-7V5z"/>,
};

function Icon({ name, size = 16, stroke = 1.5, style }) {
  const path = ICON_PATHS[name];
  if (!path) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none"
         stroke="currentColor" strokeWidth={stroke}
         strokeLinecap="round" strokeLinejoin="round" style={style}>
      {path}
    </svg>
  );
}

const ICON_NAMES = Object.keys(ICON_PATHS);

window.Icon = Icon;
window.ICON_NAMES = ICON_NAMES;
