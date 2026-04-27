import { css, grouping, microLabel, radius, surface, surfaceTint, text, typography } from '@p/ds/tokens/foundations'
import { pad, weight } from '@p/ds/tokens/palette'

// Finder 모바일 — iOS Files 식 drill-down + TikTok 세로 스냅 스와이퍼 + FloatingNav FAB.
// 라우트 컴포넌트가 isMobile 분기로 FinderMobile을 렌더하므로 CSS는 자기 root만 잡는다.
export const finderMobileCss = css`
  main[data-part="finder-mobile"] {
    display: flex; flex-direction: column;
    block-size: 100svh; min-block-size: 0;
  }
  main[data-part="finder-mobile"] > header {
    position: sticky;
    inset-block-start: 0;
    z-index: 1;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: ${pad(2)};
    padding: ${pad(2)} ${pad(3)};
    border-block-end: var(--ds-hairline) solid var(--ds-border);
    background: ${surface('subtle')};
  }
  main[data-part="finder-mobile"] > header > button {
    inline-size: 2rem; block-size: 2rem;
    border: 0; background: transparent; color: inherit;
    font-size: 1.5rem; line-height: 1;
    border-radius: ${radius('md')};
    cursor: pointer;
  }
  main[data-part="finder-mobile"] > header > button:hover {
    background: color-mix(in oklch, CanvasText 8%, transparent);
  }
  main[data-part="finder-mobile"] > header > h1 {
    margin: 0;
    ${typography('heading')};
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  main[data-part="finder-mobile"] > header > h1:only-child {
    grid-column: 1 / -1;
  }
  main[data-part="finder-mobile"] > section {
    flex: 1 1 0; min-block-size: 0; overflow-y: auto;
    padding: ${pad(3)};
    display: flex; flex-direction: column; gap: ${pad(4)};
  }
  /* Home — 위치/최근 두 섹션 */
  section[data-part="finder-home"] > section {
    display: flex; flex-direction: column; gap: ${pad(1)};
  }
  section[data-part="finder-home"] > section > h2 {
    ${microLabel()}
    margin: 0;
  }
  main[data-part="finder-mobile"] [role="listbox"] {
    padding: 0; gap: ${pad(0.5)};
  }
  section[data-part="finder-empty"] {
    display: grid; place-items: center;
    color: inherit; opacity: .55;
    padding: ${pad(8)};
  }
  /* TikTok 식 세로 스냅 스와이퍼 — 형제 파일을 한 화면씩 풀-블리드로 쌓는다.
     JS는 진입 시 1회 점프만(useLayoutEffect), IO/scroll-sync 없음 (memory: feedback_mobile_js_boundary). */
  main[data-part="finder-mobile"] > section[data-part="finder-tiktok"] {
    display: block;
    padding: 0; gap: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    scroll-snap-type: y mandatory;
    scrollbar-width: none;
  }
  article[data-part="finder-file"] {
    position: relative;
    block-size: 100svh;
    overflow: hidden;
    background: var(--ds-bg);
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
  /* preview-fill — div는 roleless라 figure 사용 (data-part 부여 가능). */
  article[data-part="finder-file"] > figure[data-part="preview-fill"] {
    margin: 0;
    position: absolute; inset: 0;
    overflow: auto;
    overscroll-behavior: contain;
  }
  /* TikTok top/bottom overlays — gradient mask로 콘텐츠와 분리, safe-area inset 흡수. */
  header[data-part="finder-tiktok-top"],
  aside[data-part="finder-tiktok-bottom"] {
    position: absolute;
    inset-inline: 0;
    z-index: 1;
    padding-inline: ${pad(3)};
  }
  header[data-part="finder-tiktok-top"] {
    inset-block-start: 0;
    padding-block-start: calc(env(safe-area-inset-top) + ${pad(2)});
    padding-block-end: ${pad(2)};
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: ${pad(2)};
    background: linear-gradient(
      to bottom,
      color-mix(in oklch, ${surface('subtle')} 96%, transparent) 30%,
      color-mix(in oklch, ${surface('subtle')} 70%, transparent) 70%,
      transparent
    );
  }
  header[data-part="finder-tiktok-top"] > strong {
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    min-inline-size: 0;
  }
  aside[data-part="finder-tiktok-bottom"] {
    inset-block-end: 0;
    padding-block-start: ${pad(2)};
    padding-block-end: calc(env(safe-area-inset-bottom) + ${pad(3)});
    display: flex; flex-wrap: wrap; align-items: center;
    gap: ${pad(2)};
    background: linear-gradient(
      to top,
      color-mix(in oklch, ${surface('subtle')} 96%, transparent) 30%,
      color-mix(in oklch, ${surface('subtle')} 70%, transparent) 70%,
      transparent
    );
  }
  /* path — 마지막 small을 trail 위치로 밀고 약화. cell-level color 금지 → opacity. */
  aside[data-part="finder-tiktok-bottom"] > small:last-child {
    flex: 1; min-inline-size: 0; text-align: end;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    opacity: .6;
  }

  /* FloatingNav — 우측 하단 FAB. 안의 popover만 우하단 anchor. */
  aside[data-part="floating-nav"] {
    position: fixed;
    inset-block-end: ${pad(4)};
    inset-inline-end: ${pad(4)};
    z-index: 100;
  }
  aside[data-part="floating-nav"] > button {
    width: 3.5rem; height: 3.5rem;
    border-radius: ${radius('pill')};
    border: var(--ds-hairline) solid var(--ds-border);
    ${grouping(3)}
    color: inherit;
    font-size: 1.5rem; line-height: 1;
    cursor: pointer;
    box-shadow:
      0 0 0 1px ${surfaceTint('overlay')},
      0 1px 2px ${surfaceTint('overlay')},
      0 4px 10px ${surfaceTint('overlay')};
    transition: transform var(--ds-dur-fast) var(--ds-ease-out);
  }
  aside[data-part="floating-nav"] > button:hover { transform: scale(1.05); }
  aside[data-part="floating-nav"] > button:active { transform: scale(0.96); }
  /* mobile glass override — 진한 frosted + 선명 ring + 짧은 drop. */
  @media (hover: none) and (pointer: coarse) {
    aside[data-part="floating-nav"] > button {
      background: color-mix(in oklch, Canvas 60%, transparent);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
              backdrop-filter: blur(24px) saturate(180%);
      border: var(--ds-hairline) solid ${surfaceTint('overlay')};
      box-shadow:
        inset 0 1px 0 ${surfaceTint('overlay')},
        0 0 0 1px ${surfaceTint('glass')},
        0 2px 4px ${surfaceTint('overlay')},
        0 8px 16px ${surfaceTint('overlay')};
    }
  }
  aside[data-part="floating-nav"] [popover][data-part="popover"] {
    inset: auto;
    inset-inline-end: ${pad(4)};
    inset-block-end: calc(${pad(4)} + 3.5rem + ${pad(2)});
    inline-size: min(92vw, 28rem);
    max-block-size: min(70vh, 32rem);
    overflow: auto;
  }

  menu[data-part="route-grid"] {
    list-style: none; margin: 0; padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
    gap: ${pad(2)};
  }
  menu[data-part="route-grid"] > li > a {
    display: flex; flex-direction: column; align-items: center; gap: ${pad(1)};
    padding: ${pad(2)} ${pad(1)};
    border-radius: ${radius('md')};
    color: inherit; text-decoration: none;
    transition: background var(--ds-dur-fast) var(--ds-ease-out);
  }
  menu[data-part="route-grid"] > li > a:hover {
    background: color-mix(in oklch, var(--ds-fg) 6%, transparent);
  }
  menu[data-part="route-grid"] > li > a > figure {
    margin: 0;
    width: 3rem; height: 3rem;
    display: grid; place-items: center;
    border-radius: ${radius('md')};
    border: var(--ds-hairline) solid var(--ds-border);
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
    font-size: 1.25rem; font-weight: ${weight('bold')};
    font-family: ui-rounded, ui-sans-serif, sans-serif;
    color: ${text('mute')};
  }
  menu[data-part="route-grid"] > li > a > strong {
    ${typography('micro')}; text-align: center;
    word-break: keep-all; line-height: 1.3;
  }
`
